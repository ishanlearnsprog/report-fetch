export const databaseTypes = [
    'POSTGRES'
]

export const roleTypes = [
    'ADMIN',
    'CREATOR',
    'VIEWER'
]

// environment variables
const applicationVars = ['PORT', 'NODE_ENV']
const postgresVars = ['PG_HOST', 'PG_PORT', 'PG_USER', 'PG_PASSWORD', 'PG_DATABASE']
export const envRequiredVars = [
    ...applicationVars,
    ...postgresVars
]
