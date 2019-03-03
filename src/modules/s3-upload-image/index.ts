import { APIGatewayEvent, APIGatewayProxyCallback, Callback, Context, S3Event } from 'aws-lambda';
import { Rekognition, S3, SNS, SQS } from 'aws-sdk';

import * as _ from 'lodash';
import * as uuid from 'uuid';
import config from '../../config';

export const s3UploadImage = async (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
    const key = _.get(event, 'queryStringParameters.name') ? event.queryStringParameters.name : uuid.v4();
    const image = Buffer.from(event.body.split(',')[1], 'base64');
    const s3 = new S3();
    await s3
        .putObject({
            Bucket: config.s3bucket,
            Key: key,
            Body: image,
            ACL: 'public-read',
        })
        .promise();
    callback(null, {
        body: JSON.stringify({ accepted: true }),
        statusCode: 200,
        headers: {
            'content-type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
    });
};

export const s3UploadImageSubsribe = async (event: S3Event, context: Context, callback: Callback) => {
    const sns = new SNS();
    const topicArn = `arn:aws:sns:${config.region}:${config.accountId}:${config.snsTopic}`;
    try {
        console.log(event.Records[0].s3.object.key); //tslint:disable-line
        const params = {
            SimilarityThreshold: 90,
            SourceImage: {
                S3Object: {
                    Bucket: config.s3bucket,
                    Name: 'me',
                },
            },
            TargetImage: {
                S3Object: {
                    Bucket: config.s3bucket,
                    Name: event.Records[0].s3.object.key,
                },
            },
        };
        const rekognition = new Rekognition();
        const result = await rekognition.compareFaces(params).promise();
        if (result.FaceMatches.length > 0) {
            const sqs = new SQS();
            await sqs
                .sendMessage({ QueueUrl: config.sqsArn, MessageBody: JSON.stringify({ key: event.Records[0].s3.object.key }) })
                .promise();
        } else {
            await sns
                .publish({
                    TopicArn: topicArn,
                    Message: JSON.stringify({ key: event.Records[0].s3.object.key }),
                })
                .promise();
        }
        console.log(result); //tslint:disable-line

        callback(null, event);
    } catch (error) {
        console.error(error, event); //tslint:disable-line
        if (error.code === 'InvalidParameterException') {
            await sns
                .publish({
                    TopicArn: topicArn,
                    Message: JSON.stringify({ key: event.Records[0].s3.object.key }),
                })
                .promise();
        }
        callback(error, null);
    }
};
