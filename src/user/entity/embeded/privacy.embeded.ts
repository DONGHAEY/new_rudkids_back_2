import { Column } from 'typeorm';

export class PrivacyEmbeded {
  @Column()
  email: string;

  @Column()
  mobile: string; //휴대전화번호

  // @Column()
  // name: string; //실명

  // @Column()
  // birth: string; //생일
}
