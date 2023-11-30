import BaseDto from './Base';

export class AuthResponse extends BaseDto {
  authLink!: string;
  token!: string;
}
export default AuthResponse;
