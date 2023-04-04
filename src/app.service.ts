import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as china from 'static/china_full.json';
import { Province } from './entities/province.entity';
import { Repository } from 'typeorm';
import { City } from './entities/city.entity';
import { District } from './entities/district.entity';
import * as MapApi from './utils/map';
import { Country } from './entities/country.entity';

export type IFeatureCollection = typeof china;

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Country)
    private countruRepository: Repository<Country>,
    @InjectRepository(Province)
    private provinceRepository: Repository<Province>,
    @InjectRepository(City)
    private cityRepository: Repository<City>,
    @InjectRepository(District)
    private districtRepository: Repository<District>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createAreaDB() {
    const country = await this.countruRepository.findOneBy({ name: '中国' });
    /**
     * 可以使用promise.all进行并发
     * forEach无法阻塞
     * 使用for where
     */

    /**
     * 第一次循环：省的遍历
     */
    for await (const item of china.features) {
      const { properties } = item;
      if (!properties.name) return;

      /**
       * 是否需要插入省
       */
      let provinceRep = await this.provinceRepository.findOneBy({
        aid: String(properties.adcode),
      });
      if (!provinceRep) {
        const province = new Province();
        province.aid = String(properties.adcode);
        /**
         * 省简称需要另外一个json数据
         */
        province.name = properties.name;
        province.fullName = properties.name;
        province.country = country;
        provinceRep = await this.provinceRepository.save(province);
      }

      /**
       * 每一个省json
       * 台湾省无数据，需要特殊处理
       */
      let provinceJson: IFeatureCollection;
      try {
        provinceJson = (await MapApi.getMapJsonWithCode(
          properties.adcode as string,
        )) as IFeatureCollection;
      } catch (error) {
        continue;
      }

      /**
       * 第二重循环：市的遍历
       */
      for await (const item of provinceJson.features) {
        const { properties } = item;
        if (!properties.name) return;

        /**
         * 是否需要插入市
         */
        let cityRep = await this.cityRepository.findOneBy({
          aid: String(properties.adcode),
        });
        const city = new City();
        city.aid = String(properties.adcode);
        city.name = properties.name;
        city.fullName = properties.name;
        city.province = provinceRep;
        city.weight = Math.floor(Math.random() * 100);
        if (!cityRep) {
          cityRep = await this.cityRepository.save(city);
        } else {
          await this.cityRepository.update(cityRep.id, city);
        }

        /**
         * 每一个市json
         * 特殊处理直辖市的情况
         */
        let cityJson;
        try {
          cityJson = (await MapApi.getMapJsonWithCode(
            item.properties.adcode as string,
          )) as IFeatureCollection;
        } catch (error) {
          continue;
        }

        /**
         * 第三重循环：县区的遍历
         */
        for await (const item of cityJson.features) {
          const { properties } = item;
          if (!properties.name) return;

          /**
           * 是否需要插入县区
           */
          let districtRep = await this.districtRepository.findOneBy({
            aid: String(properties.adcode),
          });
          const district = new District();
          district.aid = String(properties.adcode);
          district.name = properties.name;
          district.fullName = properties.name;
          district.city = cityRep;
          district.weight = Math.floor(Math.random() * 100);
          if (!districtRep) {
            districtRep = await this.districtRepository.save(district);
          } else {
            await this.districtRepository.update(districtRep.id, district);
          }
        }
      }
    }

    console.log('导入数据成功！');
  }

  async insertAreaDB(adcode: string, level: string) {}
}
