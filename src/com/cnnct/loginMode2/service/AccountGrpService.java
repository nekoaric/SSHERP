package com.cnnct.loginMode2.service;


import org.eredlab.g4.ccl.datastructure.Dto;

import com.cnnct.common.ApplicationException;

/**
 * 用户工厂
 * @author zhouww
 * @since 2014-12-29
 */
public interface AccountGrpService {
    
    /**
     * 更新我的工厂信息
     * @param inDto
     * @throws ApplicationException
     */
    public void updateGrps(Dto inDto)throws ApplicationException;
    
    /**
     * 增加我的订单
     * @param inDto
     * @throws ApplicationException
     */
    public void addMyOrder(Dto inDto)throws ApplicationException;
    
    /**
     * 删除我的订单
     * @param inDto
     * @throws ApplicationException
     */
    public void deleteMyOrder(Dto inDto) throws ApplicationException;
}
