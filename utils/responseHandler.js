exports.success = (res, message, data = {}) => {
return res.status(200).json({
status: "success",
message,
data
});
};

exports.error = (res, statusCode, message) => {
return res.status(statusCode).json({
status: "error",
message
});
};
