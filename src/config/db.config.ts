import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { getOrdefault } from './utils';

export const getDBConf = (): TypeOrmModuleOptions => ({
  // type: configService.get('DB_TYPE', 'mysql'), error，ts 类型检测
  type: 'mysql',
  host: getOrdefault('DB_HOST', 'localhost'),
  port: getOrdefault('DB_PORT', 3306),
  database: getOrdefault('DB_NAME', 'web'),
  username: getOrdefault('DB_USERNAME', 'root'),
  password: getOrdefault('DB_PASSWORD', 'root'),
  logging: 'all',
  entities: [],
  autoLoadEntities: true,
  namingStrategy: new SnakeNamingStrategy(), // 将实体中的小驼峰变为蛇形
  timezone: '+08:00', // 时区
  charset: 'utf8mb4',
  synchronize: true, //根据实体自动创建数据库表， 生产环境建议关闭
});
export default getDBConf();
