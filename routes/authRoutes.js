const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const users = require('../data/userData');
const customers = require('../data/customerData');

const SECRET_KEY = process.env.JWT_SECRET || 'mysecretkey';
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern = /^\d{4,10}$/;

const buildAuthResponse = user => {
  const token = jwt.sign(
    {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      customerId: user.customerId
    },
    SECRET_KEY,
    {
      expiresIn: '1h',
      jwtid: `${user.id}-${Date.now()}`
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      customerId: user.customerId
    },
    role: user.role
  };
};

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new customer and get JWT token
 *     tags: [Auth]
 *     description: Creates a new customer account and returns a token immediately for booking access. Customer passwords must contain only numbers and be 4 to 10 digits long.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: 'Name, email, and password are required'
    });
  }

  if (typeof name !== 'string' || !String(name).trim()) {
    return res.status(400).json({ message: 'Name must be a valid string' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  if (!emailPattern.test(normalizedEmail)) {
    return res.status(400).json({ message: 'Email must be in mail@mail.com format' });
  }

  if (!passwordPattern.test(String(password))) {
    return res.status(400).json({
      message: 'Password must contain only numbers and be 4 to 10 digits long'
    });
  }

  const existingUser = users.find(user => user.email === normalizedEmail);
  const existingCustomer = customers.find(customer => customer.email === normalizedEmail);
  if (existingUser || existingCustomer) {
    return res.status(409).json({ message: 'Email already exists' });
  }

  const customer = {
    id: customers.length + 1,
    name: String(name).trim(),
    email: normalizedEmail
  };
  customers.push(customer);

  const user = {
    id: users.length + 1,
    name: customer.name,
    email: normalizedEmail,
    password: bcrypt.hashSync(String(password), 8),
    role: 'customer',
    customerId: customer.id
  };
  users.push(user);

  const authResponse = buildAuthResponse(user);

  res.status(201).json({
    ...authResponse,
    customer,
    message: 'Registration successful'
  });
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login and get JWT token
 *     tags: [Auth]
 *     description: Use `admin@mail.com/1234` or any customer account password that contains only numbers and is 4 to 10 digits long.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Missing email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: 'Email and password are required'
    });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = users.find(u => u.email === normalizedEmail);

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  const isMatch = bcrypt.compareSync(String(password), user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const authResponse = buildAuthResponse(user);

  res.json({
    ...authResponse,
    message: "Login successful"
  });
});

module.exports = router;
