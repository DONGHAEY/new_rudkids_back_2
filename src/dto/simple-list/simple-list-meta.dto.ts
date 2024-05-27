export class SimpleListMeta {
  readonly take: number;
  readonly total: number;

  constructor({ take, total }: { take: number; total: number }) {
    this.take = take;
    this.total = total;
  }
}
