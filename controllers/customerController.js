let customers = require('../data/customerData');

exports.getCustomers = (req, res) => {
    let { page = 1, limit = 5 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

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

    const { name, phone } = req.body;

    if (name !== undefined) {
        customer.name = name;
    }

    if (phone !== undefined) {
        customer.phone = phone;
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
