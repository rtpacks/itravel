import {
  ArgumentMetadata,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ArticleDTO } from 'src/modules/article/dto/article.dto';
import { Validator } from './utils';
import { Article } from 'src/entities/article.entity';
import { UserService } from 'src/modules/user/user.service';
import { Assert } from 'src/utils/Assert';
import { SpotService } from 'src/modules/spot/spot.service';
import { CategoryService } from 'src/modules/category/category.service';

@Injectable()
export class TransformArticlePipe implements PipeTransform {
  constructor(
    private userService: UserService,
    private spotService: SpotService,
    private categoryService: CategoryService,
  ) {}
  async transform(articleDTO: ArticleDTO, metadata: ArgumentMetadata) {
    /**
     * 转换数据类型
     */
    articleDTO = plainToClass(ArticleDTO, articleDTO);

    /**
     * 校验所需数据
     */
    await Validator.validate(articleDTO);

    const article = new Article();
    article.title = articleDTO.title?.trim();
    article.content = articleDTO.content;
    article.summary = articleDTO.summary?.trim();
    article.thumbUrl = articleDTO.thumbUrl?.trim();
    article.images = articleDTO.images;
    const author = await this.userService.findUserById(articleDTO.author);
    Assert.isNotEmptyUser(author, '用户不存在或已注销');
    article.author = author;

    if (articleDTO.spot) {
      const spot = await this.spotService.findSpotById(articleDTO.spot);
      article.spot = spot;
    }

    return article;
  }
}
