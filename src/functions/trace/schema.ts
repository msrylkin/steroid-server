// export default {
//     type: 'object',
//     properties: {
//         traces: {
//             type: 'array',
//             items: {
//                 type: 'object',
//                 properties: {
//                     fileName: {
//                         type: 'string'
//                     },
//                     columnNumber: {
//                         type: 'number'
//                     },
//                     lineNumber: {
//                         type: 'number'
//                     },
//                     measurements: {
//                         type: 'array',
//                         items: {
//                             type: 'array',
//                             minItems: 2,
//                             maxItems: 2,
//                             items: [{
//                                 type: 'number'
//                             }, {
//                                 type: 'number'
//                             }]
//                             // prefixItems: [{
//                             //     type: 'number'
//                             // }, {
//                             //     type: 'number'
//                             // }]
//                         }
//                     }
//                 },
//                 required: ['fileName', 'columnNumber', 'lineNumber', 'measurements']
//             }
//         }
//     },
//     required: ['traces']
// } as const;

export default {
    type: 'object',
    properties: {
        queries: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    fileName: {
                        type: 'string'
                    },
                    columnNumber: {
                        type: 'number'
                    },
                    lineNumber: {
                        type: 'number'
                    },
                    measurements: {
                        type: 'array',
                        items: {
                            type: 'array',
                            minItems: 2,
                            maxItems: 2,
                            items: [{
                                type: 'number'
                            }, {
                                type: 'number'
                            }],
                        },
                    },
                    callers: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                fileName: {
                                    type: 'string'
                                },
                                columnNumber: {
                                    type: 'number'
                                },
                                lineNumber: {
                                    type: 'number'
                                },
                            },
                            required: ['fileName', 'columnNumber', 'lineNumber']
                        }
                    }
                },
                required: ['fileName', 'columnNumber', 'lineNumber', 'measurements', 'callers']
            },
        },
    },
    required: ['queries']
} as const;