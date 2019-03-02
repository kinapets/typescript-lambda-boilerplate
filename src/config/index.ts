import * as packageJson from '../../package.json';

const config = {
    appName: packageJson.name,
    version: packageJson.version,
    environment: process.env.STAGE || 'dev',
    sqsArn: process.env.SQS_ARN,
    s3bucket: process.env.S3_BUCKET,
};

export default Object.freeze(config);
