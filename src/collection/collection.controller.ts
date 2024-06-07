import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { OffsetPageRequestDto } from 'src/dto/pagination/page-request.dto';
import JwtAuthGuard from 'src/auth/guards/auth.guard';
import { GetUser } from 'src/auth/decorators/getUser.decorator';
import { UserEntity } from 'src/user/entity/user.entity';

@Controller('collection')
@UseGuards(JwtAuthGuard)
export class CollectionController {
  constructor(private collectionService: CollectionService) {}

  @Get()
  async getMyCollection(
    @GetUser() user: UserEntity,
    @Query() offsetPageRequest: OffsetPageRequestDto,
  ) {
    return await this.collectionService.getMyCollection(
      user,
      offsetPageRequest,
    );
  }
}
