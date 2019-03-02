import { APIGatewayEvent, APIGatewayProxyCallback, Context } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import * as uuid from 'uuid';
import config from '../../config';

export const s3UploadImage = async (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
    const image = Buffer.from(event.body.split(',')[1], 'base64');
    const s3 = new S3();
    await s3
        .putObject({
            Bucket: config.s3bucket,
            Key: uuid.v4(),
            Body: image,
            ACL: 'public-read',
        })
        .promise();
    callback(null, { body: 'OK', statusCode: 200 });
};
