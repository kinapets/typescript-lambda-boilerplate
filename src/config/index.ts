import * as packageJson from '../../package.json';

const config = {
    appName: packageJson.name,
    version: packageJson.version,
    environment: process.env.STAGE || 'dev',
};

export default Object.freeze(config);
