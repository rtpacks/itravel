package com.yefeng.monorepo.exception;

/**
 * @author 夜枫
 */
public class CheckFailException extends RuntimeException {


    public CheckFailException(String message) {
        super(message);
    }
}