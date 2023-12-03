import BaseDto from './Base';

export class AuthResults extends BaseDto {
  authLink!: string;
  token!: string;
}
export default AuthResults;
