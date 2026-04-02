const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Hotel Booking API",
            version: "1.0.0",
            description: "Hotel Booking System with Role-Based Access & Approval Workflow"
        },
        servers: [
            {
                url: "http://localhost:3000/api/v1"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            },
            schemas: {
                Room: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        type: {
                            type: "string",
                            enum: ["Single", "Double", "Deluxe", "Suite", "Premium Suite"],
                            example: "Deluxe"
                        },
                        price: { type: "integer", example: 3000 },
                        available: { type: "boolean", example: true }
                    }
                },
                Customer: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        name: { type: "string", example: "Logesh" },
                        phone: { type: "string", example: "9000000001" }
                    }
                },
                Booking: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        roomId: { type: "integer", example: 1 },
                        customerId: { type: "integer", example: 1 },
                        fromDate: {
                            type: "string",
                            example: "2026-04-02"
                        },
                        toDate: {
                            type: "string",
                            example: "2026-04-05"
                        },
                        status: {
                            type: "string",
                            enum: ["PENDING", "CONFIRMED", "CANCELLED"],
                            example: "PENDING"
                        }
                    }
                }
            }
        },
        security: [
            { bearerAuth: [] }
        ]
    },

    apis: ["./routes/*.js"]
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
