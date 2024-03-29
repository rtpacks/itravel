import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Article } from './article.entity';
import { User } from './user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Tag {
  /**
   * 主键，tag id
   */
  @PrimaryGeneratedColumn('uuid', { comment: 'tag id' })
  id: string;

  /**
   * tag 名称
   */
  @Column('tinytext', { comment: 'tag 名称' })
  name: string;

  /**
   * 由谁创建
   * 将User的主键作为Tag的user字段的值，即user字段是外键
   */
  @ManyToOne(() => User, (user) => user.tags)
  @JoinColumn()
  user: User;

  /**
   * tag 文章
   */
  @ManyToMany(() => Article, (article) => article.tags)
  articles: Article[];

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
