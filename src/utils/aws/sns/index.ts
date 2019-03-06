const createTopic = (config: { region: string; accountId: string | number; snsTopic: string }) =>
    `arn:aws:sns:${config.region}:${config.accountId}:${config.snsTopic}`;
