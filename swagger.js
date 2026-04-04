const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Hotel Booking API",
            version: "1.0.0",
            description: `
Hotel Booking System with role-based access and approval workflow.

This API helps manage:
- User registration and login with JWT authentication
- Customer records
- Room listing and room updates
- Booking creation, approval, rejection, update, and deletion
- Secure file upload for authenticated users

Main workflow:
1. Register or log in to get a bearer token
2. Browse available rooms
3. Create a booking for selected dates
4. Admin can approve or reject pending bookings

Role behavior:
- Admin can manage all bookings and approve or reject them
- Customer can access and manage only their own bookings

Demo credentials:
- Admin: admin@mail.com / 1234
- Customer: Register a new account and use a numeric password with minimum 4 digits and maximum 10 digits

Use the Authorize button in Swagger UI and paste your JWT token as:
Bearer <your_token>
            `.trim(),
            contact: {
                name: "Hotel API Team",
                email: "support@hotelapi.local"
            },
            license: {
                name: "ISC"
            }
        },
        servers: [
            {
                url: "http://localhost:3000/api/v1",
                description: "Local"
            },
            {
                url: "https://api-project-yuo0.onrender.com/api/v1",
                description: "Live"
            }
        ],
        tags: [
            {
                name: "Auth",
                description: "Register users and log in to receive JWT access tokens."
            },
            {
                name: "Rooms",
                description: "Browse hotel rooms and update room details."
            },
            {
                name: "Customers",
                description: "View and manage customer records."
            },
            {
                name: "Bookings",
                description: "Create, review, approve, reject, update, and delete bookings."
            },
            {
                name: "Upload",
                description: "Upload authenticated files such as room or profile images."
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
                    required: ["email", "password"],
                    properties: {
                        email: {
                            type: "string",
                            example: "admin@mail.com"
                        },
                        password: {
                            type: "string",
                            minLength: 4,
                            maxLength: 10,
                            pattern: "^\\d{4,10}$",
                            example: "1234",
                            description: "Password must contain only numbers and be 4 to 10 digits long."
                        }
                    }
                },
                RegisterRequest: {
                    type: "object",
                    required: ["name", "email", "password"],
                    properties: {
                        name: {
                            type: "string",
                            example: "Keerthana Nair"
                        },
                        email: {
                            type: "string",
                            example: "keerthana@mail.com"
                        },
                        password: {
                            type: "string",
                            minLength: 4,
                            maxLength: 10,
                            pattern: "^\\d{4,10}$",
                            example: "1234",
                            description: "Password must contain only numbers and be 4 to 10 digits long."
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
                                name: { type: "string", example: "Admin" },
                                email: { type: "string", example: "admin@mail.com" },
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
                MessageResponse: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            example: "Operation completed successfully"
                        }
                    }
                },
                ErrorResponse: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            example: "Something went wrong"
                        }
                    }
                },
                BookingCreateRequest: {
                    type: "object",
                    required: ["roomId", "fromDate", "toDate"],
                    properties: {
                        roomId: { type: "integer", example: 5 },
                        customerId: {
                            type: "integer",
                            example: 12,
                            description: "Optional for admin users. Customer users should not send this."
                        },
                        fromDate: {
                            type: "string",
                            example: "2026-04-10"
                        },
                        toDate: {
                            type: "string",
                            example: "2026-04-12"
                        }
                    }
                },
                BookingUpdateRequest: {
                    type: "object",
                    properties: {
                        roomId: { type: "integer", example: 5 },
                        customerId: {
                            type: "integer",
                            example: 12,
                            description: "Admin only."
                        },
                        fromDate: {
                            type: "string",
                            example: "2026-04-10"
                        },
                        toDate: {
                            type: "string",
                            example: "2026-04-12"
                        },
                        status: {
                            type: "string",
                            enum: ["PENDING", "CONFIRMED", "REJECTED"],
                            example: "CONFIRMED",
                            description: "Admin only."
                        }
                    }
                },
                RoomUpdateRequest: {
                    type: "object",
                    properties: {
                        type: {
                            type: "string",
                            enum: ["Single", "Double", "Deluxe", "Suite", "Premium Suite"],
                            example: "Premium Suite"
                        },
                        price: {
                            type: "integer",
                            example: 4500
                        },
                        available: {
                            type: "boolean",
                            example: true
                        }
                    }
                },
                CustomerUpdateRequest: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            example: "Keerthana Nair"
                        },
                        email: {
                            type: "string",
                            example: "keerthana@mail.com"
                        }
                    }
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
                        email: { type: "string", example: "logesh@mail.com" }
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
                            enum: ["PENDING", "CONFIRMED", "REJECTED"],
                            example: "PENDING"
                        }
                    }
                },
                PaginationMeta: {
                    type: "object",
                    properties: {
                        total: { type: "integer", example: 150 },
                        page: { type: "integer", example: 1 },
                        limit: { type: "integer", example: 5 }
                    }
                },
                PaginatedRoomsResponse: {
                    allOf: [
                        { $ref: '#/components/schemas/PaginationMeta' },
                        {
                            type: "object",
                            properties: {
                                data: {
                                    type: "array",
                                    items: { $ref: '#/components/schemas/Room' }
                                }
                            }
                        }
                    ]
                },
                PaginatedCustomersResponse: {
                    allOf: [
                        { $ref: '#/components/schemas/PaginationMeta' },
                        {
                            type: "object",
                            properties: {
                                data: {
                                    type: "array",
                                    items: { $ref: '#/components/schemas/Customer' }
                                }
                            }
                        }
                    ]
                },
                PaginatedBookingsResponse: {
                    allOf: [
                        { $ref: '#/components/schemas/PaginationMeta' },
                        {
                            type: "object",
                            properties: {
                                data: {
                                    type: "array",
                                    items: { $ref: '#/components/schemas/Booking' }
                                }
                            }
                        }
                    ]
                },
                RoomMutationResponse: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            example: "Room updated successfully"
                        },
                        room: {
                            $ref: '#/components/schemas/Room'
                        }
                    }
                },
                CustomerMutationResponse: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            example: "Customer updated successfully"
                        },
                        customer: {
                            $ref: '#/components/schemas/Customer'
                        }
                    }
                },
                BookingMutationResponse: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            example: "Booking updated successfully"
                        },
                        booking: {
                            $ref: '#/components/schemas/Booking'
                        }
                    }
                },
                UploadFile: {
                    type: "object",
                    properties: {
                        fieldname: {
                            type: "string",
                            example: "image"
                        },
                        originalname: {
                            type: "string",
                            example: "room-1.jpg"
                        },
                        encoding: {
                            type: "string",
                            example: "7bit"
                        },
                        mimetype: {
                            type: "string",
                            example: "image/jpeg"
                        },
                        destination: {
                            type: "string",
                            example: "uploads/"
                        },
                        filename: {
                            type: "string",
                            example: "1712200000000-room-1.jpg"
                        },
                        path: {
                            type: "string",
                            example: "uploads/1712200000000-room-1.jpg"
                        },
                        size: {
                            type: "integer",
                            example: 48213
                        }
                    }
                },
                UploadResponse: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            example: "File uploaded successfully"
                        },
                        file: {
                            $ref: '#/components/schemas/UploadFile'
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
