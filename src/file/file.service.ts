import { createClient } from '@supabase/supabase-js';
import {
  ConflictException,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';

@Injectable()
export class FileService implements OnApplicationBootstrap {
  private static supabaseStorage: any;

  async onApplicationBootstrap() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    FileService.supabaseStorage = createClient(
      supabaseUrl,
      supabaseKey,
    ).storage;
  }

  async saveFileToSupabase(
    relativeDirPath: string = '',
    file: any,
  ): Promise<string> {
    try {
      const { error, data } = await FileService.supabaseStorage
        .from('rudkids')
        .upload(relativeDirPath, file, {
          upsert: true,
        });

      if (error) {
        throw new ConflictException('에러남 ㅅㄱ');
      }
      console.log(data);
      const baseUrl =
        'https://saocbhosfbzowqshlhfv.supabase.co/storage/v1/object/public/';
      return baseUrl + data['fullPath'];
    } catch (e) {
      throw e;
    }
  }
}
