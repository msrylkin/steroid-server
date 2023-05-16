export default {
    type: 'object',
    properties: {
        commit: {
            type: 'string',
        },
        environment: {
            type: 'string'
        }
    },
} as const;