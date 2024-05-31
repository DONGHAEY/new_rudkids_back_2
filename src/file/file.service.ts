import { SupabaseClient, createClient } from '@supabase/supabase-js';
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
    contentType: string = '',
  ): Promise<string> {
    const tas: SupabaseClient = null;
    try {
      const { error, data } = await FileService.supabaseStorage
        .from('rudkids')
        .upload(relativeDirPath, file, {
          contentType,
          upsert: true,
        });
      if (error) {
        throw new ConflictException('에러남 ㅅㄱ');
      }
      const { data: urlData } = await FileService.supabaseStorage
        .from('rudkids')
        .getPublicUrl(data.path);
      return urlData?.publicUrl;
    } catch (e) {
      throw e;
    }
  }
}
