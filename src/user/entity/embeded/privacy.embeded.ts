import { Column } from 'typeorm';

export class PrivacyEmbeded {
  @Column()
  email: string;

  @Column()
  name: string; //실명

  @Column()
  mobile: string; //휴대전화번호

  @Column()
  birth: string; //생일
}
