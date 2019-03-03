import { Callback, Context, SNSEvent } from 'aws-lambda';
import axios from 'axios';
import config from '../../config';

const slackClient = axios.create({ baseURL: 'https://hooks.slack.com/services' });

const HOOK_URL = '/T0FBUL9A4/BGME7J2KD/gIBjXtXoRFnYfz1p5AVMbspO';

export const snsSubscribe = async (event: SNSEvent, context: Context, callback: Callback) => {
    const json = JSON.parse(event.Records[0].Sns.Message);
    const s3link = `https://s3-eu-west-1.amazonaws.com/${config.s3bucket}/${json.key}`;
    const payload = {
        text: `Váš dům právě navštěvuje nový uživatel <${s3link}|Nebezpečná osoba> ${event.Records[0].Sns.Message}`,
    };
    slackClient.post(HOOK_URL, payload);
    callback(null, null);
};
