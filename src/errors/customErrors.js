class CustomError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode || 500
        // Error.captureStackTrace(this, this.constructor); //Captures the stack trace to identify where the error occurred in the codebase
    }
}

module.exports = CustomError;
