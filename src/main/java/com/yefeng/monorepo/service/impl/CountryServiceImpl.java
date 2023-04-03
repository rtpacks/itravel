package com.yefeng.monorepo.service.impl;

import com.yefeng.monorepo.entity.Country;
import com.yefeng.monorepo.mapper.CountryMapper;
import com.yefeng.monorepo.service.ICountryService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author yefeng
 * @since 2023-04-03
 */
@Service
public class CountryServiceImpl extends ServiceImpl<CountryMapper, Country> implements ICountryService {

}
