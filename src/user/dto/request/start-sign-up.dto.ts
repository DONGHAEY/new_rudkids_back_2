import { PlatformEnum } from 'src/auth/enum/platform.enum';
import { PrivacyEmbeded } from '../../entity/embeded/privacy.embeded';

export type StartSignUpDto = {
  privacy: PrivacyEmbeded;
  platform: PlatformEnum;
};
