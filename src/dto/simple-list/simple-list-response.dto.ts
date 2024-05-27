import { SimpleListMeta } from './simple-list-meta.dto';

export class SimpleListResponseDto<T> {
  data: T[];
  meta: SimpleListMeta;
}
