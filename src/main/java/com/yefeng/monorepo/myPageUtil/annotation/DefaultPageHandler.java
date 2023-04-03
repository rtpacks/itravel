package com.yefeng.monorepo.myPageUtil.annotation;

import com.github.pagehelper.PageInfo;

import com.yefeng.monorepo.result.ApiResult;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DefaultPageHandler implements PageHandler<PageInfo> {


    @Override
    public PageInfo solve(Object data1) {
        if (data1 instanceof ApiResult) {
            ApiResult<?> result = (ApiResult<?>) data1;
            List data = (List) result.getData();
            PageInfo pageInfo = new PageInfo(data);
            return pageInfo;
        } else if (data1 instanceof List) {
            List data = (List) data1;

            PageInfo pageInfo = new PageInfo<>(data);
            return pageInfo;
        }
        return null;
    }
}