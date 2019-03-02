import { APIGatewayEvent, APIGatewayProxyCallback, Context, Handler } from 'aws-lambda';

export const helloWorldHandler: Handler = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
  callback(null, { body: JSON.stringify({ event, hello: 'world' }), statusCode: 200 });
};
