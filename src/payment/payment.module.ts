import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './entity/payment.entity';
import { OrderEntity } from 'src/order/entity/order.entity';
import { PaymentController } from './payment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity, OrderEntity])],
  providers: [PaymentService],
  exports: [TypeOrmModule],
  controllers: [PaymentController],
})
export class PaymentModule {}
