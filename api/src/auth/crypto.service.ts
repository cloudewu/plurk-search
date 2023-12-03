// Kudos: https://code.pieces.app/blog/using-encryption-and-hashing-to-increase-security-in-nestjs

import { Injectable, Logger, UnprocessableEntityException } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';

@Injectable()
export class CryptoService {
  private readonly logger = new Logger(CryptoService.name);
  private readonly key: string;

  static readonly cypherAlgorithm: string = 'aes-256-ctr';
  static readonly hashAlgorithm: string = 'sha256';
  static readonly transferEncoding: BufferEncoding = 'hex';

  constructor(
    private readonly configService: ConfigService,
  ) {
    const key = this.configService.getOrThrow<string>('ENCRYPTION_KEY');
    this.key = createHash(CryptoService.hashAlgorithm).update(key).digest('base64').substring(0, 32);
  }

  encrypt(text: string): string {
    const iv = randomBytes(16);
    const cipher = createCipheriv(CryptoService.cypherAlgorithm, this.key, iv);
    try {
      const result = Buffer.concat([iv, cipher.update(text), cipher.final()]);
      return result.toString(CryptoService.transferEncoding);
    } catch (err: any) {
      this.logger.error(`Failed to encrypt data. IV: ${iv.toString()}`, err.stack, err.message);
      throw new UnprocessableEntityException(err.message);
    }
  }

  decrypt(data: string): string {
    try {
      const iv = Buffer.from(data.slice(0, 32), CryptoService.transferEncoding);
      const cipher = Buffer.from(data.slice(32), CryptoService.transferEncoding);
      const decipher = createDecipheriv(CryptoService.cypherAlgorithm, this.key, iv);
      const result = Buffer.concat([decipher.update(cipher), decipher.final()]);
      return result.toString();
    } catch (err: any) {
      this.logger.error(`Failed to decrypt data: ${data}`, err.stack, err.message);
      throw new UnprocessableEntityException(err.message);
    }
  }

  checkKey(givenKey: string): boolean {
    try {
      return givenKey === this.key;
    } catch (err: any) {
      // Do not expose stack in case any malicious requests
      this.logger.warn(
        'Unkown error occurred during key checking. ' +
        `The request is failed silently, but you should keep an eye on malicious key breaking. Input: ${givenKey}`,
        err.message);
      return false;
    }
  }
}
