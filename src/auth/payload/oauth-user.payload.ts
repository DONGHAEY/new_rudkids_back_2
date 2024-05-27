import { Expose } from 'class-transformer';

export class OauthUserPaylod {
  @Expose()
  email: string;
  @Expose()
  birth: string;
  @Expose()
  name: string;
  @Expose()
  mobile: string;
}
