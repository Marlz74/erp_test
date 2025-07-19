export const sendResponse = (res, status, data, message = null) => {
    res.status(status).json({
        status: status >= 200 && status < 300,
        code:status,
        message,
        data
    });
};

export const sendError = (res, status, message) => {
    res.status(status).json({
        status: false,
        code:status,
        error: message
    });
};