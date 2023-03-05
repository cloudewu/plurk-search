// Kudos: https://stackoverflow.com/questions/59268777/validate-enum-directly-in-controller-function

import { type PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseEnumPipe implements PipeTransform<string, number> {
  enumValues: string[];

  constructor(private readonly enumEntity: any) {
    this.enumValues = Object.keys(this.enumEntity).map(k => this.enumEntity[k]);
  }

  transform(value?: string | null): number {
    if (value !== null && value !== undefined && this.isEnum(value)) {
      return this.enumEntity[value];
    } else {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const errorMessage = `the value ${value} is not valid. Acceptable values are: ${this.enumValues.toString()}`;
      throw new BadRequestException(errorMessage);
    }
  }

  private isEnum(value: string): boolean {
    return this.enumValues.includes(value);
  }
}
