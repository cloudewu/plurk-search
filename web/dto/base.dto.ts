// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class BaseDto {
  constructor(args: Record<string, unknown> = {}) {
    // dynamically assign
    Object.assign(this, args);
  }
}
