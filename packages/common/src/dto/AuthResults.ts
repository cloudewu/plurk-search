import BaseDto from './Base';

export class AuthResultsDto extends BaseDto {
  authLink!: string;
  token!: string;
}
export default AuthResultsDto;
