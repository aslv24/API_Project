let customers = require('../data/customerData');
let users = require('../data/userData');
const { getPagination, isValidEmail } = require('../utils/requestValidators');

exports.getCustomers = (req, res) => {
    const pagination = getPagination(req.query);

    if (pagination.error) {
        return res.status(400).json({ message: pagination.error });
    }

    const { page, limit } = pagination;

    const start = (page - 1) * limit;
    const end = page * limit;

    res.json({
        total: customers.length,
        page,
        limit,
        data: customers.slice(start, end)
    });
};

exports.patchCustomer = (req, res) => {
    const customer = customers.find(c => c.id == req.params.id);

    if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
    }

    const { name, email } = req.body;

    if (name !== undefined) {
        if (typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({ message: "Name must be a valid string" });
        }
        customer.name = name.trim();
    }

    if (email !== undefined) {
        const normalizedEmail = String(email).trim().toLowerCase();

        if (!isValidEmail(normalizedEmail)) {
            return res.status(400).json({ message: "Email must be in mail@mail.com format" });
        }

        const emailInUseByCustomer = customers.some(
            c => c.id !== customer.id && c.email === normalizedEmail
        );
        const emailInUseByUser = users.some(
            user => user.customerId !== customer.id && user.email === normalizedEmail
        );

        if (emailInUseByCustomer || emailInUseByUser) {
            return res.status(409).json({ message: "Email already exists" });
        }

        customer.email = normalizedEmail;

        const linkedUser = users.find(user => user.customerId === customer.id);
        if (linkedUser) {
            linkedUser.email = normalizedEmail;
        }
    }

    res.json({
        message: "Customer updated successfully",
        customer
    });
};

exports.deleteCustomer = (req, res) => {
    const customerIndex = customers.findIndex(c => c.id == req.params.id);

    if (customerIndex === -1) {
        return res.status(404).json({ message: "Customer not found" });
    }

    const deletedCustomer = customers.splice(customerIndex, 1)[0];

    res.json({
        message: "Customer deleted successfully",
        customer: deletedCustomer
    });
};
