import { Column } from 'typeorm';

export class InstagramEmbeded {
  @Column({
    nullable: true,
  })
  instagramId: string;

  @Column({
    nullable: true,
  })
  imageUrl: string;
}
