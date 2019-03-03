import * as packageJson from '../../package.json';

const config = {
    appName: packageJson.name,
    version: packageJson.version,
    environment: process.env.STAGE || 'dev',
    sqsArn: process.env.SQS_ARN,
    s3bucket: process.env.S3_BUCKET,
    region: process.env.REGION,
    accountId: process.env.ACCOUNT_ID,
    snsTopic: process.env.SNS_TOPIC,
};

export default Object.freeze(config);
