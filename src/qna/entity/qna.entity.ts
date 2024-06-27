import { BaseEntity, Column, Entity, Generated, PrimaryColumn } from 'typeorm';
import { WriterEmbeded } from './embeded/writer.embeded.entity';

@Entity('qna')
export class QnaEntity extends BaseEntity {
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  @Column()
  responseMethod: string;

  @Column()
  type: string;

  @Column()
  subject: string;

  @Column()
  message: string;

  @Column()
  attachment: string;

  @Column(() => WriterEmbeded)
  writer: WriterEmbeded;
}
