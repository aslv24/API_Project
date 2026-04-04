const express = require('express');
const path = require('path');
const multer = require('multer');
const app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Root route (IMPORTANT FIX)
app.get("/", (req, res) => {
  res.send("Hotel Booking API is running 🚀");
});

// Swagger
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Hotel Booking API Docs',
    customCssUrl: '/swagger-custom.css',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'list',
      filter: true,
      tryItOutEnabled: true,
      defaultModelsExpandDepth: 1
    }
  })
);

// Routes (API v1)
app.use('/api/v1/rooms', require('./routes/roomRoutes'));
app.use('/api/v1/customers', require('./routes/customerRoutes'));
app.use('/api/v1/bookings', require('./routes/bookingRoutes'));
app.use('/api/v1', require('./routes/authRoutes'));
app.use('/api/v1/upload', require('./routes/uploadRoutes'));

app.use((err, req, res, next) => {
  if (!err) {
    return next();
  }

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }

  if (err.message) {
    return res.status(400).json({ message: err.message });
  }

  return res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 3000; // ✅ better for deployment
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
