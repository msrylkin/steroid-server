import middy from "@middy/core"
import validator from '@middy/validator'
import middyJsonBodyParser from "@middy/http-json-body-parser"

interface MiddifyParams {
  schema?: any
}

export const middyfy = (handler, { schema }: MiddifyParams = {}) => {
  const wrappedHandler = middy(handler)
    .use(middyJsonBodyParser());

  if (schema) {
    wrappedHandler.use(validator({
      inputSchema: {
        type: 'object',
        properties: {
          body: schema
        }
      }
    }));
  }

  return wrappedHandler;
}
