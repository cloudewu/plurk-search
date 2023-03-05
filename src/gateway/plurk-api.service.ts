import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PlurkClient } from 'plurk2';
import { isNullish } from '../common/util';
import type { AuthDetail } from '../dto/authDetail.dto';
import { FilterType } from '../dto/filter-type.enum';
import type { PlurksDto } from '../dto/plurks.dto';
import { PlurksSerializer } from './plurks.serializer';

@Injectable()
export class PlurkApiService {
  plurkApi: PlurkClient;
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

  async getTimelinePlurks(auth: AuthDetail, filter: FilterType, offset: string | undefined): Promise<PlurksDto> {
    const params: any = {
      limit: 10,
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
      this.resetAuth();
      this.logResponse(response);
    } catch (err: any) {
      this.logger.error('Failed to retrieve response from Plurk API', err.stack, err.message);
      throw new HttpException('External server error', HttpStatus.BAD_GATEWAY);
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
