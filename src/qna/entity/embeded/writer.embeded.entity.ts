import { Column } from 'typeorm';

export class WriterEmbeded {
  @Column()
  name: string;

  @Column()
  mobile: string;

  @Column()
  email: string;
}
