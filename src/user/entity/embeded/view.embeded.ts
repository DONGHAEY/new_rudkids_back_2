import { Column } from 'typeorm';

export class ViewEmbeded {
  @Column({
    default: 0,
  })
  todayCnt: number;

  @Column({
    default: 0,
  })
  totalCnt: number;
}
