const express = require('express');
const app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

app.use(express.json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes (API v1)
app.use('/api/v1/rooms', require('./routes/roomRoutes'));
app.use('/api/v1/customers', require('./routes/customerRoutes'));
app.use('/api/v1/bookings', require('./routes/bookingRoutes'));
app.use('/api/v1', require('./routes/authRoutes'));
app.use('/api/v1/upload', require('./routes/uploadRoutes'));

const PORT = 3000;
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
