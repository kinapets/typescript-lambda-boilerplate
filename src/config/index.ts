import * as packageJson from '../../package.json';

const config = {
  appName: packageJson.name,
  version: packageJson.version,
  environment: process.env.STAGE || 'dev',
  sqsArn: process.env.SQS_ARN,
};

export default Object.freeze(config);
