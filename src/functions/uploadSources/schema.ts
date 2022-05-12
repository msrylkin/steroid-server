export default {
    type: 'object',
    properties: {
        commit: {
            type: 'string',
        },
        files: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    path: { 
                        "type": 'string'
                    },
                    content: { 
                        "type":'string'
                    },
                },
            },
        },
    },
} as const;