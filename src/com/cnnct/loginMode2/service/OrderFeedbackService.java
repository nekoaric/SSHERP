package com.cnnct.loginMode2.service;

import org.eredlab.g4.ccl.datastructure.Dto;

import com.cnnct.common.ApplicationException;


public interface OrderFeedbackService {
    /**
     * 保存反馈的订单信息
     * @param inDto
     * @throws ApplicationException
     */
    public void saveOrderFbInfo(Dto inDto) throws ApplicationException;
    
    /**
     * 修改反馈订单信息
     * @param inDto
     * @throws ApplicationException
     */
    public void updateOrderFbInfo(Dto inDto) throws ApplicationException;
}
