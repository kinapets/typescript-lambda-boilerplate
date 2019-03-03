import { Callback, Context, SNSEvent } from 'aws-lambda';

export const snsSubscribe = async (event: SNSEvent, context: Context, callback: Callback) => {
    callback(null, event);
};
