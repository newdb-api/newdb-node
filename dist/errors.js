"use strict";
/**
 * NewDB SDK Errors.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIResponseError = exports.TimeoutError = exports.RateLimitError = exports.AuthenticationError = exports.NewDBError = void 0;
class NewDBError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NewDBError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.NewDBError = NewDBError;
class AuthenticationError extends NewDBError {
    constructor(message = 'Invalid or missing API key (X-API-KEY).') {
        super(message);
        this.name = 'AuthenticationError';
    }
}
exports.AuthenticationError = AuthenticationError;
class RateLimitError extends NewDBError {
    constructor(message = 'Rate limit exceeded for NewDB API.') {
        super(message);
        this.name = 'RateLimitError';
    }
}
exports.RateLimitError = RateLimitError;
class TimeoutError extends NewDBError {
    constructor(message = 'Task did not finish within timeout.') {
        super(message);
        this.name = 'TimeoutError';
    }
}
exports.TimeoutError = TimeoutError;
class APIResponseError extends NewDBError {
    statusCode;
    responseBody;
    constructor(message, statusCode, responseBody) {
        super(`[${statusCode}] ${message}`);
        this.name = 'APIResponseError';
        this.statusCode = statusCode;
        this.responseBody = responseBody;
    }
}
exports.APIResponseError = APIResponseError;
//# sourceMappingURL=errors.js.map