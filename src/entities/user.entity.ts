import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';
import strRandom from 'string-random';
import { Article } from './article.entity';
import { Title } from './title.entity';
import { Tag } from './tag.entity';
import { USER_ROLES } from 'src/shared/constants/user.constant';
import { Category } from './category.entity';
import { Comment } from './comment.entity';

@Entity('user')
export class User {
  /**
   * user id
   */
  @PrimaryGeneratedColumn('uuid', { comment: 'user id' })
  id: string;

  /**
   * 用户名称
   */
  @Column({ nullable: true, comment: '用户名称' })
  username: string;

  /**
   * 用户角色
   * 0：普通游客
   * 1：作者
   * 2：管理员
   * 3：超级管理员
   */
  @Column({
    type: 'tinyint',
    default: USER_ROLES.VISITOR,
    comment: '用户角色',
  })
  role: number;

  /**
   * 用户头像
   */
  @Column({
    default:
      'https://th.bing.com/th/id/OIP.37mLTapohqg7soL2wzLFyQAAAA?pid=ImgDet&rs=1',
    comment: '用户头像',
  })
  avatar: string;

  /**
   * 用户密码
   * @Exclude() 结合 ClassSerializerInterceptor 拦截器使用能将密码字段排除后返回
   * 如果注册时没有提供密码，则设置一个随机的密码作为默认密码
   */
  @Exclude()
  @Column({ nullable: true, default: strRandom(32), comment: '用户密码' })
  password: string;

  /**
   * 需要密码存在，且密码未加密或hash已修改时才进行加密
   * 未加密、已需改返回NaN
   */
  @BeforeInsert()
  @BeforeUpdate()
  async encryptPwd() {
    if (this.password && isNaN(bcrypt.getRounds(this.password))) {
      this.password = bcrypt.hashSync(this.password, 10);
    }
  }

  /**
   * 用户简介
   */
  @Column({ nullable: true, comment: '用户简介' })
  description: string;

  /**
   * 用户缩略图
   */
  @Column({ nullable: true, comment: '用户缩略图' })
  thumbUrl: string;

  /**
   * 用户邮箱
   */
  @Column({ nullable: true, comment: '用户邮箱' })
  email: string;

  /**
   * 用户号码
   */
  @Column({ nullable: true, comment: '用户号码' })
  phone: string;

  /**
   * 是否为园区，0 标识普通游客，1，2，方便以后拓展景区等级
   */
  @Column({ default: 0, comment: '是否为园区' })
  scenicArea: number;

  /**
   * 访客数量
   */
  @Column({ default: 0, comment: '访客数量' })
  visitors: number;

  /**
   * 用户头衔
   */
  @OneToOne(() => Title, (title) => title.user)
  @JoinColumn()
  title: Title;

  /**
   * 用户创建的文章分类
   */
  @OneToMany(() => Category, (category) => category.user, {
    cascade: ['insert', 'update'],
  })
  categories: Category[];

  /**
   * 用户创建的文章标签
   */
  @OneToMany(() => Tag, (tag) => tag.user, { cascade: ['insert', 'update'] })
  tags: Tag[];

  /**
   * 创建的文章
   */
  @OneToMany(() => Article, (article) => article.author, {
    cascade: ['insert', 'update'],
  }) //一对多，回调返回的类型，注入关联的属性
  articles: Article[];

  /**
   * 发起的评论/回复
   */
  @OneToMany(() => Comment, (comment) => comment.user, {
    cascade: ['insert', 'update'],
  })
  comments: Comment[];

  /**
   * receivedComments
   * 收到的评论/回复
   */
  @OneToMany(() => Comment, (comment) => comment.toUser, {
    cascade: ['insert', 'update'],
  })
  receivedComments: Comment[];

  /**
   * 上一次登录时间
   * YYYY-MM-DD HH:mm:ss
   */
  @Column({ nullable: true, type: 'timestamp', comment: '上一次登录时间' })
  lastTime: string;

  /**
   * 是否激活
   * 主要用于邮箱链接激活
   * 未激活：0
   * 已激活：1
   */
  @Exclude()
  @Column({ default: 1, comment: '是否激活' })
  status: number;

  /**
   * 是否删除
   * @Exclude() 结合 ClassSerializerInterceptor 拦截器使用能将密码字段排除后返回
   */
  @Exclude()
  @Column({ default: false, comment: '是否删除' })
  isDeleted: boolean;

  /**
   * 创建时间
   */
  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
  createdTime: string;

  /**
   * 更新时间
   */
  @UpdateDateColumn({ type: 'timestamp', comment: '更新时间' })
  updatedTime: string;
}
