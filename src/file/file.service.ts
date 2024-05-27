import { createClient } from '@supabase/supabase-js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileService {
  private static supabaseStorage: any;
  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    FileService.supabaseStorage = createClient(
      supabaseUrl,
      supabaseKey,
    ).storage;
  }

  async saveFileToSupabase(
    relativeDirPath: string = '',
    file: ArrayBuffer | ArrayBufferView | Blob | Buffer | File,
  ): Promise<string> {
    try {
      const { data, error } = await FileService.supabaseStorage
        .from('rudkids')
        .upload(relativeDirPath, file, {
          upsert: true,
        });
      const baseUrl =
        'https://saocbhosfbzowqshlhfv.supabase.co/storage/v1/object/public/';
      return baseUrl + data.fullPath;
    } catch (e) {
      throw e;
    }
  }
}
