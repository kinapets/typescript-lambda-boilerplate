import { APIGatewayEvent, APIGatewayProxyCallback, Callback, Context, S3Event } from 'aws-lambda';
import { S3 } from 'aws-sdk';

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
    callback(null, event);
};
