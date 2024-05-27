import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShippingEntity } from './entity/shipping.entity';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from 'src/user/entity/user.entity';
import { AddEditShippingRequestDto } from './dto/addEdit-shipping-request.dto';

@Injectable()
export class ShippingService {
  constructor(
    @InjectRepository(ShippingEntity)
    private shippingRepository: Repository<ShippingEntity>,
    private dataSource: DataSource,
  ) {}

  async addShipping(
    user: UserEntity,
    shippingRequestDto: AddEditShippingRequestDto,
  ) {
    const count = await this.shippingRepository.count({
      where: {
        user: {
          id: user.id,
        },
      },
    });
    if (count > 10) {
      throw new HttpException(
        '배송지는 10개 이하로만 등록 할 수 있습니다.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    return this.dataSource.transaction(async (manager) => {
      if (shippingRequestDto.isDefault && count !== 0) {
        await manager.update(
          ShippingEntity,
          {
            user: {
              id: user.id,
            },
            isDefault: true,
          },
          {
            isDefault: false,
          },
        );
      }
      const newShipping = new ShippingEntity();
      newShipping.user = user;
      newShipping.name = shippingRequestDto.name;
      newShipping.address = shippingRequestDto.address;
      newShipping.detailAddress = shippingRequestDto.detailAddress;
      newShipping.recieverName = shippingRequestDto.recieverName;
      newShipping.recieverPhoneNumber = shippingRequestDto.recieverPhoneNumber;
      newShipping.isDefault = count === 0 ? true : shippingRequestDto.isDefault;
      return await manager.save(newShipping);
    });
  }

  async removeShipping(shippingId: string) {
    const shipping = await this.shippingRepository.findOne({
      where: {
        id: shippingId,
      },
    });
    if (!shipping) throw new NotFoundException();
    await shipping.remove();
  }

  async editShipping(
    shippingId: string,
    shippingRequestDto: AddEditShippingRequestDto,
  ) {
    return this.dataSource.transaction(async (manager) => {
      const shipping = await manager.findOne(ShippingEntity, {
        where: {
          id: shippingId,
        },
      });
      if (!shipping) throw new NotFoundException();
      const user = await shipping.user;
      if (shippingRequestDto.isDefault) {
        await manager.update(
          ShippingEntity,
          {
            user: {
              id: user.id,
            },
            isDefault: true,
          },
          {
            isDefault: false,
          },
        );
      }
      await manager.update(
        ShippingEntity,
        {
          id: shippingId,
        },
        {
          ...shippingRequestDto,
        },
      );
    });
  }

  async getShippingList(user: UserEntity) {
    return await this.shippingRepository.find({
      where: {
        user: {
          id: user.id,
        },
      },
      order: {
        isDefault: 'DESC',
      },
    });
  }
}
