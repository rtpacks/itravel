import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
  OneToMany,
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { User } from './user.entity';
import { Tag } from './tag.entity';
import { ARTICLE_STATUS } from 'src/shared/constants/article.constant';
import { Exclude } from 'class-transformer';
import { Category } from './category.entity';
import { Comment } from './comment.entity';
import { Spot } from './spot.entity';

@Entity('article')
export class Article {
  /**
   * 文章ID
   */
  @PrimaryGeneratedColumn('uuid', { comment: '文章ID' })
  id: string;

  /**
   * 文章title
   */
  @Column('text', { comment: '文章title' })
  title: string;

  /**
   * 文章作者
   * 将user的主键作为article中的外键
   */
  @ManyToOne((type) => User, (user) => user.articles) // 注入User，user.articles 关联的属性
  @JoinColumn()
  author: User;

  /**
   * 文章缩略图
   */
  @Column({ nullable: true, comment: '文章缩略图URL' })
  thumbUrl: string;

  /**
   * 文章的简要
   */
  @Column({ type: 'text', nullable: true, comment: '文章的简要' })
  summary: string;

  /**
   * 文章内容
   */
  @Column('text', { comment: '文章内容' })
  content: string;

  /**
   * 文章评论
   */
  @OneToMany(() => Comment, (comment) => comment.article, {
    cascade: ['insert', 'update'],
  })
  comments: Comment[];

  /**
   * 评论数量
   * 隐藏字段，防止在查询时返回，只用作 Article 实体返回数据
   */
  @Column({ default: 0, select: false, comment: '评论数量' })
  commentCount: number;

  /**
   * 浏览量
   */
  @Column({ default: 0, comment: '浏览量' })
  viewCount: number;

  /**
   * 点赞量
   */
  @Column({ default: 0, comment: '点赞量' })
  likeCount: number;

  /**
   * 收藏量
   */
  @Column({ default: 0, comment: '收藏量' })
  favCount: number;

  /**
   * 图片集合
   */
  @Column({ type: 'json', nullable: true, comment: '图片集合' })
  images: string[];

  /**
   * 文章分类
   * 将category的主键作为article中的外键
   */
  @ManyToOne(() => Category, (category) => category.articles)
  @JoinColumn()
  category: Category;

  /**
   * 文章标签，@JoinTable标识字段为被所有者方，当前类为所有者一方
   * @JoinTable()是@ManyToMany关系所必需的，无论是单项关系还是双向关系，只存在一边
   * 保存时需要先生成/保存主实体，因为主实体的id需要作为其他实体的索引依赖
   * 然后生成/设置其他实体中主实体的属性，最后保存其他实体
   */
  @ManyToMany(() => Tag, (tag) => tag.articles)
  @JoinTable()
  tags: Tag[];

  /**
   * 文章状态
   * ARTICLE.DRAFT 0 未发布、草稿箱
   * ARTICLE.PUBLISH 1 已发布
   */
  @Column({
    type: 'tinyint',
    default: ARTICLE_STATUS.PUBLISH,
    comment: '文章状态',
  })
  status: number;

  /**
   * 关联的景点
   */
  @ManyToOne(() => Spot, (s) => s.articles)
  @JoinColumn()
  spot: Spot;

  /**
   * 发布时间
   */
  @CreateDateColumn({ type: 'timestamp', comment: '发布时间' })
  publishTime: Date;

  /**
   * 是否删除
   */
  @Exclude()
  @Column({ default: false, comment: '是否删除' })
  isDeleted: boolean;

  /**
   * 创建时间
   * YYYY-MM-DD HH:mm:ss
   */
  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
  createdTime: string;

  /**
   * 更新时间
   */
  @UpdateDateColumn({ type: 'timestamp', comment: '更新时间' })
  updatedTime: string;
}
