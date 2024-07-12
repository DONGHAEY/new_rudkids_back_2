import { SetMetadata } from '@nestjs/common';

export const CheckAdmin = (): any => {
  return SetMetadata('check_admin', true);
};
