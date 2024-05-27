import { ConflictException, Injectable, OnModuleInit } from '@nestjs/common';
import axios, { Axios } from 'axios';

@Injectable()
export class SmsService implements OnModuleInit {
  private static smsApi: Axios;
  private static fromPhoneNum: string;

  async onModuleInit() {
    const axiosInstance = axios.create({
      baseURL: 'https://apick.app/rest',
      headers: {
        CL_AUTH_KEY: process.env['APICK_AUTH_KEY'],
      },
    });
    SmsService.smsApi = axiosInstance;
    SmsService.fromPhoneNum = process.env['APICK_PHONENUM'];
  }

  async sendSms(targetPhoneNum: string, text: string): Promise<boolean> {
    try {
      const { data } = await SmsService.smsApi.post('/send_sms', {
        from: SmsService.fromPhoneNum,
        to: targetPhoneNum?.replaceAll('-', ''),
        text: text,
      });
      if (data?.api?.success) {
        return true;
      } else {
        throw new ConflictException('문자를 보내지 못했어요');
      }
    } catch (e) {
      throw new ConflictException('문자를 보내지 못했어요');
    }
  }
}
