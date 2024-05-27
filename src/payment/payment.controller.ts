import { Body, Controller, Param, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentRequestDto } from './dto/create-payment-request.dto';
import { GetUser } from 'src/auth/decorators/getUser.decorator';
import { UserEntity } from 'src/user/entity/user.entity';
import { CancelPaymentRequestDto } from './dto/cancel-payment-request.dto';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}
  //
  @Post()
  async createPayment(@Body() createPaymentDto: CreatePaymentRequestDto) {
    //paymentKey, orderId
    return await this.paymentService.createPayment(createPaymentDto);
  }

  @Post(':payment_key/cancel')
  async cancelPayment(
    @GetUser() user: UserEntity,
    @Param('payment_key') paymentKey: string,
    @Body() cancelPaymentDto: CancelPaymentRequestDto,
  ) {
    return await this.paymentService.cancelPayment(
      user,
      paymentKey,
      cancelPaymentDto,
    );
  }
}
