import { Expose } from 'class-transformer';
import { PlatformEnum } from '../enum/platform.enum';

export class OauthUserPaylod {
  @Expose()
  email: string;
  @Expose()
  mobile: string;
  @Expose()
  platform: PlatformEnum;
}
