import { Module } from '@nestjs/common';
import { Tag } from '../../entities/tag.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  providers: [TagService],
  exports: [TypeOrmModule.forFeature([Tag]), TagService],
  controllers: [TagController],
})
export class TagModule {}
