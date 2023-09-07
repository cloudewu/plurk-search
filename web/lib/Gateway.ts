import type { AuthResponseDto } from '@/dto/authResponse.dto';

/** todo: unit tests **/
const Gateway = {
  /** ------ CONSTANTS ------ **/
  HOST: process.env.API ?? 'http://localhost:9981',
  ENDPOINT: '/auth',
  get API() {
    return this.HOST + this.ENDPOINT;
  },

  /** ------ ENDPOINTS ------ **/
  async getAuth(): Promise<AuthResponseDto> {
    const res: Response = await this._request({ cache: 'no-store' });
    const response: AuthResponseDto = await res.json();
    return response;
  },

  async postAuth(token: string, code: string): Promise<string> {
    if (token == null || token === '') {
      throw await this._throwError('POST /auth', 'invalid auth token');
    }

    const res: Response = await this._request({
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
      }),
      cache: 'no-store',
    });

    return await res.text();
  },

  async getSearch() {
    const PATH = 'GET /search';
    console.info(PATH);
  },

  /** ------ UTILITIES ------ **/
  async _request(options: RequestInit = {}): Promise<Response> {
    const method = options.method ?? 'GET';
    const action = `${method} ${this.ENDPOINT}`;

    let res: Response;
    try {
      console.info(action);
      res = await fetch(this.API, options);
    } catch (err: any) {
      throw await this._throwError(action, err);
    }

    if (!res.ok) {
      throw await this._throwError(action, res);
    }

    return res;
  },

  async _throwError(action: string, reason: Response | Error | string): Promise<never | Error> {
    console.error(reason);

    if (typeof reason === 'string') {
      throw new Error(`[${action}] ${reason}`);
    }

    if (reason instanceof Error) {
      throw new Error(`[${action}] Service Unavailable`, { cause: reason });
    }

    const error = await reason.json();
    throw new Error(`[${action}] ${reason.status} ${reason.statusText} - ${error.message as string}`);
  },
};

export default Gateway;
