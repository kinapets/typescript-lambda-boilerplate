import { APIGatewayEvent, Callback, Context, SQSEvent } from 'aws-lambda';
import { SQS } from 'aws-sdk';
import config from '../../config';

export const publish = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
    const sqs = new SQS();
    const message = { hello: 'world' };
    await sqs.sendMessage({ QueueUrl: config.sqsArn, MessageBody: JSON.stringify(message) }).promise();
    callback(null, { body: JSON.stringify(message), statusCode: 200 });
};

export const subscribe = async (events: SQSEvent, context: Context, callback: Callback) => {
    const promises = events.Records.map((event) => {
        return JSON.parse(event.body);
    });
    const bodies = await Promise.all(promises);
    callback(null, bodies);
};
