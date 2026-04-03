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
                url: "https://api-project-yuo0.onrender.com/api/v1"
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
                LoginRequest: {
                    type: "object",
                    required: ["username", "password"],
                    properties: {
                        username: {
                            type: "string",
                            example: "admin"
                        },
                        password: {
                            type: "string",
                            example: "1234"
                        }
                    }
                },
                RegisterRequest: {
                    type: "object",
                    required: ["name", "phone", "username", "password"],
                    properties: {
                        name: {
                            type: "string",
                            example: "Keerthana Nair"
                        },
                        phone: {
                            type: "string",
                            example: "9123456789"
                        },
                        username: {
                            type: "string",
                            example: "keerthana"
                        },
                        password: {
                            type: "string",
                            example: "1234"
                        }
                    }
                },
                LoginResponse: {
                    type: "object",
                    properties: {
                        token: {
                            type: "string",
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        },
                        user: {
                            type: "object",
                            properties: {
                                id: { type: "integer", example: 1 },
                                username: { type: "string", example: "admin" },
                                role: {
                                    type: "string",
                                    enum: ["admin", "customer"],
                                    example: "admin"
                                },
                                customerId: {
                                    type: "integer",
                                    nullable: true,
                                    example: null
                                }
                            }
                        },
                        role: {
                            type: "string",
                            enum: ["admin", "customer"],
                            example: "admin"
                        },
                        message: {
                            type: "string",
                            example: "Login successful"
                        }
                    }
                },
                RegisterResponse: {
                    allOf: [
                        {
                            $ref: '#/components/schemas/LoginResponse'
                        },
                        {
                            type: "object",
                            properties: {
                                customer: {
                                    $ref: '#/components/schemas/Customer'
                                },
                                message: {
                                    type: "string",
                                    example: "Registration successful"
                                }
                            }
                        }
                    ]
                },
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
                        createdByUserId: { type: "integer", example: 2 },
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
        }
    },

    apis: ["./routes/*.js"]
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
