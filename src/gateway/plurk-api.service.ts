import { BadRequestException, HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PlurkClient } from 'plurk2';
import { isNullish } from '../common/util';
import { AuthDetail } from '../dto/authDetail.dto';
import { FilterType } from '../dto/filter-type.enum';
import type { PlurksDto } from '../dto/plurks.dto';
import { PlurksSerializer } from './plurks.serializer';

@Injectable()
export class PlurkApiService {
  static readonly RESPONSE_PLURK_COUNT: number = 10;

  readonly plurkApi: PlurkClient;

  private readonly logger = new Logger(PlurkApiService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly plurkSerializer: PlurksSerializer,
  ) {
    this.plurkApi = new PlurkClient(
      this.configService.getOrThrow<string>('PLURK_APP_KEY'),
      this.configService.getOrThrow<string>('PLURK_APP_SECRET'),
    );
  }

  async getRequestToken(): Promise<{ token: string, secret: string, authPage: string }> {
    try {
      this.logger.log('Requesting request token');
      this.resetAuth();
      const { token, tokenSecret, authPage } = await this.plurkApi.getRequestToken();
      this.logger.log(`Token received: ${token}`);
      return { token, secret: tokenSecret, authPage };
    } catch (err: any) {
      this.logger.error('Failed to get reqeust token', err.stack, err.message);
      throw new HttpException('External server error', HttpStatus.BAD_GATEWAY);
    } finally {
      this.resetAuth();
    }
  }

  async authenticate(auth: AuthDetail, code: string) {
    this.setupAuth(auth);
    try {
      this.logger.log('Requesting access token');
      const { token, tokenSecret } = await this.plurkApi.getAccessToken(code);
      this.logger.log(`Token received: ${token}`);
      return new AuthDetail({ token, secret: tokenSecret });
    } catch (err: any) {
      this.logger.error('Failed to get access token.', err.stack, err.message);
      throw new BadRequestException('Invalid Verifier');
    } finally {
      this.resetAuth();
    }
  }

  async getTimelinePlurks(auth: AuthDetail, filter: FilterType, offset: string | undefined): Promise<PlurksDto> {
    const params: any = {
      limit: PlurkApiService.RESPONSE_PLURK_COUNT,
      minimal_data: true,
      minimal_user: true,
    };
    if (!isNullish(offset)) {
      params.offset = offset;
    }
    if (filter !== FilterType.NONE) {
      params.filter = FilterType[filter].toLowerCase();
    }
    const response = await this.sendRequest(auth, '/Timeline/getPlurks', params);
    return this.plurkSerializer.serialize(response);
  }

  async sendRequest(auth: AuthDetail, url: string, params?: any) {
    let response = null;
    try {
      this.logRequst(url, params);
      this.setupAuth(auth);
      response = await this.plurkApi.request(url, params);
      this.logResponse(response);
    } catch (err: any) {
      this.logger.error('Failed to retrieve response from Plurk API', err.stack, err.message);
      throw new HttpException('External server error', HttpStatus.BAD_GATEWAY);
    } finally {
      this.resetAuth();
    }
    return response;
  }

  private setupAuth(auth: AuthDetail) {
    this.plurkApi.token = auth.token ?? null;
    this.plurkApi.tokenSecret = auth.secret ?? null;
  }

  private resetAuth() {
    this.plurkApi.token = '';
    this.plurkApi.tokenSecret = '';
  }

  private logRequst(url: string, params?: Record<string, string>) {
    if (isNullish(params)) {
      params = {};
    }
    this.logger.log(`Send Plurk API Request: ${url}; params: ${JSON.stringify(params)}`);
  }

  private logResponse(response: any) {
    this.logger.log(`Received Plurk API response: ${JSON.stringify(response)}`);
  }
}
