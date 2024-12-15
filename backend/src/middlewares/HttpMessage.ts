export const httpMessages = {
    NOT_FOUND: {
        statusCode: 404,
        message: 'Data not found',
    },
    ALREADY_PRESENT: {
        statusCode: 409,
        message: 'Data already exists',
    },
    INVALID_CREDENTIALS: {
        statusCode: 401,
        message: 'Invalid email or password',
    },
    UNAUTHORIZED: {
        statusCode: 401,
        message: 'Unauthorized access',
    },
    BAD_REQUEST: {
        statusCode: 400,
        message: 'Bad request',
    },
    FORBIDDEN: {
        statusCode: 403,
        message: 'Forbidden Request',
    },
    OK: {
        statusCode: 200,
        message: 'Request successful',
    },
    INTERNAL_SERVER_ERROR: {
        statusCode: 500,
        message: 'Internal server error',
    },
    GONE: {
        statusCode: 410,
        message: 'Resource no longer available',
    },
    CONFLICT: {
        statusCode: 409,
        message: 'Conflict with existing data',
    },
    UNSUPPORTED_MEDIA_TYPE: {
        statusCode: 415,
        message: 'Unsupported media type',
    },
    UNPROCESSABLE_ENTITY: {
        statusCode: 422,
        message: 'Unprocessable entity',
    },
    TOO_MANY_REQUESTS: {
        statusCode: 429,
        message: 'Too many requests, please try again later',
    },
    SERVICE_UNAVAILABLE: {
        statusCode: 503,
        message: 'Service unavailable, please try again later',
    },
    NETWORK_AUTHENTICATION_REQUIRED: {
        statusCode: 511,
        message: 'Network authentication required',
    },
    METHOD_NOT_ALLOWED: {
        statusCode: 405,
        message: 'Method not allowed',
    },
    REQUEST_TIMEOUT: {
        statusCode: 408,
        message: 'Request timeout',
    },
    LENGTH_REQUIRED: {
        statusCode: 411,
        message: 'Length required',
    },
    PAYLOAD_TOO_LARGE: {
        statusCode: 413,
        message: 'Payload too large',
    },
    IM_A_TEAPOT: {
        statusCode: 418,
        message: 'I’m a teapot (just for fun, per HTTP/1.1)',
    },
    PRECONDITION_FAILED: {
        statusCode: 412,
        message: 'Precondition failed',
    },
    EXPECTATION_FAILED: {
        statusCode: 417,
        message: 'Expectation failed',
    },
    LOCKED: {
        statusCode: 423,
        message: 'Locked resource',
    },
    FAILED_DEPENDENCY: {
        statusCode: 424,
        message: 'Failed dependency',
    },
    TOO_EARLY: {
        statusCode: 425,
        message: 'Too early request',
    },
    UPGRADE_REQUIRED: {
        statusCode: 426,
        message: 'Upgrade required',
    },
    PRECONDITION_REQUIRED: {
        statusCode: 428,
        message: 'Precondition required',
    },
    REQUEST_HEADER_FIELDS_TOO_LARGE: {
        statusCode: 431,
        message: 'Request header fields too large',
    },
    UNAVAILABLE_FOR_LEGAL_REASONS: {
        statusCode: 451,
        message: 'Unavailable for legal reasons',
    },
    INTERNAL_ERROR: {
        statusCode: 500,
        message: 'Unexpected internal error occurred',
    },
    DATABASE_ERROR: {
        statusCode: 500,
        message: 'Database connection error',
    },
    INVALID_TOKEN: {
        statusCode: 401,
        message: 'Invalid or expired token',
    },
    INSUFFICIENT_PERMISSION: {
        statusCode: 403,
        message: 'Insufficient permissions to access the resource',
    },
    USER_NOT_FOUND: {
        statusCode: 404,
        message: 'User not found',
    },
    ACCOUNT_LOCKED: {
        statusCode: 403,
        message: 'Your account is locked',
    },
    ACCOUNT_SUSPENDED: {
        statusCode: 403,
        message: 'Your account has been suspended',
    },
    EXPIRED_SESSION: {
        statusCode: 440,
        message: 'Session has expired, please log in again',
    },
    MALFORMED_JSON: {
        statusCode: 400,
        message: 'Malformed JSON payload',
    },
    VALIDATION_ERROR: {
        statusCode: 422,
        message: 'Validation failed for one or more fields',
    },
    FILE_TOO_LARGE: {
        statusCode: 413,
        message: 'Uploaded file is too large',
    },
    FILE_FORMAT_NOT_SUPPORTED: {
        statusCode: 415,
        message: 'File format not supported',
    },
    RATE_LIMIT_EXCEEDED: {
        statusCode: 429,
        message: 'Rate limit exceeded, please try again later',
    },
};
