import { APIGatewayEvent, APIGatewayProxyCallback, Callback, Context, SNSEvent } from 'aws-lambda';
import { SNS } from 'aws-sdk';
import config from '../../config';

export const snsPublish = async (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
    const sns = new SNS();
    const topicArn = `arn:aws:sns:${config.region}:${config.accountId}:${config.snsTopic}`;
    await sns.publish({ TopicArn: topicArn, Message: JSON.stringify({ hello: 'world' }) }).promise();
    callback(null, { body: JSON.stringify(event), statusCode: 200 });
};

export const snsSubscribe = async (event: SNSEvent, context: Context, callback: Callback) => {
    const message = event.Records[0].Sns.Message;
    callback(null, message);
};
