import { Column } from 'typeorm';

export class ShippingEmbeded {
  @Column()
  id: string;

  @Column({
    nullable: false,
  })
  address: string;

  @Column({
    nullable: true,
  })
  detailAddress: string;

  @Column({
    nullable: false,
  })
  recieverName: string;

  @Column({
    nullable: false,
  })
  recieverPhoneNumber: string;

  @Column({
    nullable: true,
  })
  requestMemo: string;

  @Column({
    nullable: true,
    default: null,
  })
  trackingNumber: string; //송장번호
}
