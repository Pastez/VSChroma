import { request, ClientRequest, IncomingMessage } from 'http';
import { RequestOptions } from 'https';
import { hostname } from 'os';

const CHROMA_HOST = 'localhost';
const CHROMA_PORT = 54235;
const CHROMA_REQUEST_HEADER = { 'Content-Type': 'application/json' };
const CHROMA_DESC = {
    title: 'VSChroma',
    description: 'Visual Studio Code Plugin for Razer Chroma',
    author: {
        name: 'Tomasz Pastez Kwolek',
        contact: 'pastezzz@gmail.com'
    },
    device_supported: [
        'keyboard'
    ],
    category: 'application'
};

export interface PSColor {

}

export enum PSChromaEffect {
    CHROMA_NONE = 'CHROMA_NONE',
    CHROMA_CUSTOM = 'CHROMA_CUSTOM',
    CHROMA_STATIC = 'CHROMA_STATIC',
    CHROMA_CUSTOM_KEY = 'CHROMA_CUSTOM_KEY',
}

interface PSChromaClientResponse {
    statusCode?: number;
    body?: string;
    error?: Error;
}

export class PSChroma {

    private _initialized = false;
    private _uri?: string;
    private _port?: number;

    private _hbInterval: NodeJS.Timeout | undefined;

    init(completed: (chroma: PSChroma, uri: string) => void) {
        this._clientRequest({
            path: '/razer/chromasdk',
            method: 'POST',
        }, CHROMA_DESC, response => {
                console.log('hi response', response);
            if (response.statusCode === 200 && response.body) {
                const data = JSON.parse(response.body);
                this._uri = data['uri'];
                this._port = data['sessionid'];
                this._initialized = true;
                this._heartbeat();
                completed(this, '');
            }
        });
    }

    createKeyboardEffect(effect: PSChromaEffect, data: any | undefined, callback: (res: PSChromaClientResponse, id: string) => void) {
        let obj = {};

        if (effect === PSChromaEffect.CHROMA_NONE) {
            obj = { "effect": effect };
        } else if (effect === PSChromaEffect.CHROMA_CUSTOM) {
            obj = { "effect": effect, "param": data };
        } else if (effect === PSChromaEffect.CHROMA_STATIC) {
            var color = { "color": data };
            obj = { "effect": effect, "param": color };
        } else if (effect === PSChromaEffect.CHROMA_CUSTOM_KEY) {
            obj = { effect: effect, param: data };
        }

        this._clientRequest({
            method: 'POST',
            path: '/chromasdk/keyboard'
        }, obj, res => {
                console.log('createKeyboardEffect', res);
                if (callback && res.body) {
                    callback(res, JSON.parse(res.body).id);
                }
        });
    }

    showEffect = (id: string, completed: ((res: PSChromaClientResponse) => void) | undefined = undefined) => {
        const obj = { id };
        this._clientRequest({
            method: 'PUT',
            path: '/chromasdk/effect'
        }, obj, res => {
                console.log('showEffect', res);
                if (completed) {
                    completed(res);
                }
        });
    }

    clearAll = () => {
        this.createKeyboardEffect(PSChromaEffect.CHROMA_NONE, undefined, (res, id) => {
            this.showEffect(id);
        });
    }

    private _heartbeat = () => {
        this._clientRequest({
            method: 'PUT',
            path: `/chromasdk/heartbeat`
        }, undefined, resp => {
                this._hbInterval = setTimeout(this._heartbeat, 5000);
        });
    }

    uninit() {
        this._initialized = false;
        if (this._hbInterval) {
            clearInterval(this._hbInterval);
        }
        this._clientRequest({
            method: 'DELETE',
        }, undefined, res => {
            this._uri = undefined;
        });
    }

    private _clientRequest(params: RequestOptions, data: Object | undefined = undefined, response: ((res: PSChromaClientResponse) => void) | undefined = undefined) {
        setTimeout(() => {
            var clientResponse: PSChromaClientResponse = {};
            const reqData: RequestOptions = {
                headers: CHROMA_REQUEST_HEADER,
                host: '127.0.0.1',
                hostname: CHROMA_HOST,
                port: this._port ? this._port : CHROMA_PORT,
                method: 'GET',
                protocol: 'http:',
                ...params
            };
            const req = request(reqData, res => {
                res.on('data', chunk => {
                    if (!clientResponse.body) { clientResponse.body = ''; }
                    clientResponse.body += chunk;
                });
                res.on('end', () => {
                    if (response) { response(clientResponse); }
                });
                clientResponse.statusCode = res.statusCode;

            });
            if (data) {
                req.write(JSON.stringify(data));
            }

            req.on('error', error => {
                clientResponse.error = error;
                if (response) { response(clientResponse); }
            });

            req.end();
        }, 0);
    }

}