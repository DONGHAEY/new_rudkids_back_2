import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from './entity/payment.entity';
import { Repository } from 'typeorm';
import axios, { Axios } from 'axios';
import { OrderEntity } from 'src/order/entity/order.entity';
import PayStatusEnum from 'src/payment/enum/pay-status.enum';
import { UserEntity } from 'src/user/entity/user.entity';
import { CreatePaymentRequestDto } from './dto/create-payment-request.dto';
import { CancelPaymentRequestDto } from './dto/cancel-payment-request.dto';

@Injectable()
export class PaymentService implements OnModuleInit {
  //
  constructor(
    @InjectRepository(PaymentEntity)
    private paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
  ) {}

  private static tossAPIAxios: Axios = null;

  async onModuleInit() {
    const Authorization =
      'Basic ' +
      Buffer.from(`${process.env.TOSS_CLIENT_SECRET}:`).toString('base64');
    PaymentService.tossAPIAxios = axios.create({
      baseURL: 'https://api.tosspayments.com',
      headers: {
        Authorization,
      },
    });
  }

  async createPayment(createPaymentDto: CreatePaymentRequestDto) {
    const order = await this.orderRepository.findOneBy({
      id: createPaymentDto.orderId,
    });
    if (!order) throw new NotFoundException();
    if (order.payment) {
      throw new ConflictException('해당 주문의 결제는 이미 생성되었습니다.');
    }
    if (order.totalPrice !== createPaymentDto.amount) {
      throw new HttpException(
        '거래 금액이 일치하지 않습니다',
        HttpStatus.MISDIRECTED,
      );
    }
    try {
      await PaymentService.tossAPIAxios.post('/v1/payments/confirm', {
        paymentKey: createPaymentDto.paymentKey,
        orderId: createPaymentDto.orderId,
        amount: createPaymentDto.amount,
      });
    } catch (e) {
      throw new HttpException(
        e?.response?.data?.message,
        HttpStatus.BAD_REQUEST,
      );
    }
    const payment = await this.paymentRepository
      .create({
        paymentKey: createPaymentDto.paymentKey,
        status: PayStatusEnum.COMPLETED,
        amount: createPaymentDto.amount,
      })
      .save();
    //
    order.payment = payment;
    await order.save();
    return payment;
  }

  async cancelPayment(
    user: UserEntity,
    paymentKey: string,
    cancelPaymentDto: CancelPaymentRequestDto,
  ): Promise<void> {
    const payment = await this.paymentRepository.findOne({
      where: {
        paymentKey,
      },
    });
    if (payment.status !== PayStatusEnum.COMPLETED) {
      throw new HttpException(
        '결제상태가 취소가능한 상태가 아닙니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!user.isAdmin) {
      const order = await payment.order;
      if (order.shipping.trackingNumber !== null) {
        throw new HttpException(
          '현재 배송중 또는 배송완료된 주문입니다!',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    try {
      await PaymentService.tossAPIAxios.post(
        `/v1/payments/${payment.paymentKey}/cancel`,
        {
          cancelPaymentDto,
        },
      );
    } catch (e) {
      throw new HttpException(e.message, e.code);
    }
    payment.status = PayStatusEnum.CANCELED;
    await payment.save();
  }
}
