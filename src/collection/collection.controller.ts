import { Controller, Get, Param } from '@nestjs/common';
import { CollectionService } from './collection.service';

@Controller('collection')
// @UseGuards(JwtAuthGuard)
export class CollectionController {
  constructor(private collectionService: CollectionService) {}

  @Get('/:user_id')
  async getMyCollection_(@Param('user_id') userId: string) {
    return await this.collectionService.getQueryBasedCollection(userId);
  }
}
