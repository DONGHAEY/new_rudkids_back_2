import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { ProductComponentModule } from './product-component/product-component.module';
import { SchoolModule } from './school/school.module';
import { FileModule } from './file/file.module';
import { SmsModule } from './sms/sms.module';
import { ShippingModule } from './shipping/shipping.module';
import { PaymentModule } from './payment/payment.module';
import { SeasonModule } from './season/season.module';
import { InvitationModule } from './invitation/invitation.module';
import { InstagramProfileModule } from './instagram-profile/instagram-profile.module';
import { CollectionModule } from './collection/collection.module';
import { QnaModule } from './qna/qna.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/*/entity/*.entity.{js,ts}'],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    CartModule,
    OrderModule,
    ProductModule,
    ProductComponentModule,
    SchoolModule,
    FileModule,
    SmsModule,
    ShippingModule,
    PaymentModule,
    SeasonModule,
    InvitationModule,
    InstagramProfileModule,
    CollectionModule,
    QnaModule,
  ],
})
export class AppModule {}
