import { OffsetPageRequestDto } from './page-request.dto';

export class CursorPageMeta {
  readonly total: number;
  readonly take: number;
  readonly hasNextData: boolean | null;
  readonly cursor: number;

  constructor(meta: {
    total: number;
    hasNextData: boolean | null;
    take: number;
    cursor: number;
  }) {
    this.total = meta.total;
    this.hasNextData = meta.hasNextData;
    this.take = meta.take;
    this.cursor = meta.cursor;
  }
}

export class OffsetPageMetaDto {
  readonly total: number;
  readonly page: number;
  readonly take: number;
  readonly last_page: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;

  constructor({
    total,
    offsetPageRequest,
  }: {
    total: number;
    offsetPageRequest: OffsetPageRequestDto;
  }) {
    this.page =
      offsetPageRequest.page <= 0 ? (this.page = 1) : offsetPageRequest.page;
    this.take = offsetPageRequest.take;
    this.total = total;
    this.last_page = Math.ceil(this.total / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.last_page;
  }
}
