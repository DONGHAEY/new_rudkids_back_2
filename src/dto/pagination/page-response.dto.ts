import { IsArray } from 'class-validator';
import { CursorPageMeta, OffsetPageMetaDto } from './page-meta.dto';

export class PageResponseDto<T> {
  @IsArray()
  readonly data: T[];
  readonly meta: OffsetPageMetaDto | CursorPageMeta;

  constructor(data: T[], meta: OffsetPageMetaDto | CursorPageMeta) {
    this.data = data;
    this.meta = meta;
  }
}
