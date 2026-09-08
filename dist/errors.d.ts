/**
 * NewDB SDK Errors.
 */
export declare class NewDBError extends Error {
    constructor(message: string);
}
export declare class AuthenticationError extends NewDBError {
    constructor(message?: string);
}
export declare class RateLimitError extends NewDBError {
    constructor(message?: string);
}
export declare class TimeoutError extends NewDBError {
    constructor(message?: string);
}
export declare class APIResponseError extends NewDBError {
    statusCode: number;
    responseBody: any;
    constructor(message: string, statusCode: number, responseBody?: any);
}
//# sourceMappingURL=errors.d.ts.map