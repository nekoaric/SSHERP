package com.cnnct.loginMode2.service.impl;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;

import com.cnnct.common.ApplicationException;
import com.cnnct.loginMode2.service.OrderFeedbackService;

/**
 * 订单信息反馈信息
 * @author zhouww
 * @since 2015-03-16
 */
public class OrderFeedbackServiceImpl extends BaseServiceImpl implements OrderFeedbackService{

    /**
     * 保存反馈的订单信息
     */
    public void saveOrderFbInfo(Dto inDto) throws ApplicationException {
        g4Dao.insert("saveOrderFeedback",inDto);
    }
    
    /**
     * 修改反馈的订单信息
     */
    public void updateOrderFbInfo(Dto inDto) throws ApplicationException {
        g4Dao.update("updateFbOrderInfo",inDto);
    }
    
    
    
}
