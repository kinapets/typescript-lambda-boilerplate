import { APIGatewayEvent, Callback, Context, SQSEvent } from 'aws-lambda';
import { SQS } from 'aws-sdk';
import axios from 'axios';
import * as _ from 'lodash';
import * as moment from 'moment';
import config from '../../config';

const haidyClient = axios.create({
    baseURL: 'https://haidy-beta.aks.qest.cz/gateway',
    headers: {
        authorization:
            'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IkVCNTkwNUVGN0MxQUQ5QTU1MTM4QzZERjVFMTRBREEzOTQ1QjU3M0UiLCJ0eXAiOiJKV1QiLCJ4NXQiOiI2MWtGNzN3YTJhVlJPTWJmWGhTdG81UmJWejQifQ.eyJuYmYiOjE1NTExMTAwNzcsImV4cCI6MTU1MTk3NDA3NywiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS5ha3MucWVzdC5jei8iLCJhdWQiOlsiaHR0cHM6Ly9pZGVudGl0eS5ha3MucWVzdC5jei9yZXNvdXJjZXMiLCJhcGkxIl0sImNsaWVudF9pZCI6InJlYWN0dWkiLCJzdWIiOiJhZGNlZTdlYy05YmRjLTQyN2MtOTJlMi02YmI2NjQ1NzFlMDciLCJhdXRoX3RpbWUiOjE1NTA2NDgwNDEsImlkcCI6ImxvY2FsIiwibmFtZSI6ImVtYWlsIiwiZW1haWwiOiJlbWFpbEBlbWFpbC5jb20iLCJzY29wZSI6WyJvcGVuaWQiLCJhcGkxIl0sImFtciI6WyJwd2QiXX0.iGMupfrHinEsGDaR7Si1Z3zqNy6wQdNOBjJ8aAjewiYZwKNPQ-THpDbmkHZZk_l8pGpE74XmifpKqIztvjPyuyy9daGz1dXF4t-Q0UhFxSNJexywP74PmcXqA5GvgIPpSJc5Nowfw4DGBelxVVkz3Oa48Ln46QnZg5ara5_DFQqBRXwpp8-nZkLRi1B26uHVwouu8Ond7T0nIFVXuF8YYEWNIaj2dx098W72qjNLR-TyNpNwdobTRWfbd8zWoqzqoPUxT5HgvYss5hkwkOB6uHFlGMwKAwiNVj17sS-eMCT6Y_zBQ-9mIwGRQVGV43hPgTlJq7fP1nmjCc8qBh161Q', // tslint:disable-line
    },
});

export const publish = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
    const sqs = new SQS();
    const message = { hello: 'world' };
    await sqs.sendMessage({ QueueUrl: config.sqsArn, MessageBody: JSON.stringify(message) }).promise();
    callback(null, { body: JSON.stringify(message), statusCode: 200 });
};

export const subscribe = async (events: SQSEvent, context: Context, callback: Callback) => {
    await haidyClient.put('/api/v1/dimmableLights/5b9d20cfa138250001e56abd/state', {
        intensity: _.random(100, false),
        manualUntil: moment()
            .add(5, 'minutes')
            .toDate()
            .toISOString(),
    });
    callback(null, null);
};
