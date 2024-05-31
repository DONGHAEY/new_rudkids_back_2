import { SupabaseClient, createClient } from '@supabase/supabase-js';
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class FileService {
  private static supabaseStorage: any;
  //
  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    FileService.supabaseStorage = createClient(supabaseUrl, supabaseKey);
  }

  async saveFileToSupabase(
    relativeDirPath: string = '',
    file: ArrayBuffer | ArrayBufferView | Blob | Buffer | File,
  ): Promise<string> {
    try {
      const { error, data } = await FileService.supabaseStorage.storage
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
