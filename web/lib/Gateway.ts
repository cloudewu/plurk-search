import { COOKIE_TOKEN } from '@/constants';
import FilterType from '@/dto/FilterType.enum';
import type SearchResponseDto from '@/dto/SearchResponse.dto';
import type AuthResponseDto from '@/dto/authResponse.dto';
import { cookies } from 'next/headers';

/** todo: unit tests **/
const Gateway = {
  /** ------ CONSTANTS ------ **/
  HOST: process.env.API ?? 'http://localhost:9981',

  /** ------ ENDPOINTS ------ **/
  async getAuth(): Promise<AuthResponseDto> {
    const res: Response = await this._request('/auth', { cache: 'no-store' });
    const response: AuthResponseDto = await res.json();
    return response;
  },

  async postAuth(token: string, code: string): Promise<string> {
    if (token == null || token === '') {
      throw await this._throwError('POST /auth', 'invalid auth token');
    }

    const res: Response = await this._request(
      '/auth',
      {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
        }),
        cache: 'no-store',
      },
    );

    return await res.text();
  },

  async getSearch(query: string, filter?: FilterType, offset?: Date): Promise<SearchResponseDto> {
    const token = cookies().get(COOKIE_TOKEN)?.value;

    if (token == null || token === '') {
      throw await this._throwError('GET /search', 'invalid token');
    }

    const params: { query: string, filter: string, offset?: string } = {
      query,
      filter: filter != null ? FilterType[filter] : FilterType[FilterType.NONE],
    };
    if (offset != null) {
      params.offset = offset.toISOString();
    }

    const res: Response = await this._request(
      '/search?' + new URLSearchParams(params).toString(),
      {
        headers: {
          Authorization: token,
        },
      },
    );
    const plurks: SearchResponseDto = await res.json();
    return plurks;
  },

  /** ------ UTILITIES ------ **/
  async _request(path: string, options: RequestInit = {}): Promise<Response> {
    const method = options.method ?? 'GET';
    const action = `${method} ${path}`;

    let res: Response;
    try {
      console.info(action);
      res = await fetch(this.HOST + path, options);
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
