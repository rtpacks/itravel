import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SpotMonth } from './spot-month.entity';

@Entity()
export class Month {
  /**
   * 月份id
   */
  @PrimaryGeneratedColumn('uuid', { comment: '月份id' })
  id: string;

  /**
   * 月份名称
   */
  @Column({ type: 'tinytext', comment: '月份名称' })
  name: string;

  /**
   * 推荐的月份景点对象，包括推荐度等更多拓展数据
   */
  @OneToMany(() => SpotMonth, (spotMonth) => spotMonth.month)
  spotMonths: SpotMonth[];
}
