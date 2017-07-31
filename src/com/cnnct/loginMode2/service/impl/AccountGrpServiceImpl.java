package com.cnnct.loginMode2.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.cnnct.common.ApplicationException;
import com.cnnct.loginMode2.service.AccountGrpService;
import com.cnnct.util.TimeUtil;

/**
 * 用户工厂
 * @author zhouww
 * @since 2014-12-29
 */
public class AccountGrpServiceImpl extends BaseServiceImpl implements AccountGrpService{

    /**
     * 更新我的工厂信息
     */
    public void updateGrps(Dto inDto) throws ApplicationException {
        String account = inDto.getAsString("account");
        String opr_date = TimeUtil.getCurrentDate("yyyy-MM-dd");
        
        String grps = inDto.getAsString("grps");
        String[] grpArr = grps.split(",");
        List<Dto> resultList = new ArrayList<Dto>();
        for(String str : grpArr){
            Dto beanDto = new BaseDto();
            beanDto.put("grp_id", str);
            beanDto.put("account", account);
            beanDto.put("opr_id", account);
            beanDto.put("opr_date", opr_date);
            resultList.add(beanDto);
        }
        
        // 删除原有的
        g4Dao.delete("deleteUserGrps", inDto);
        // 新增现有的
        g4Dao.batchInsertBaseDto("insertUserGrps", resultList);
    }

    /**
     * 添加我的订单
     */
    public void addMyOrder(Dto inDto) throws ApplicationException {
        List<Dto> resultList = g4Dao.queryForList("queryOrderOperator",inDto);
        if(resultList.size() == 0){
            // 没有我的订单信息，则添加我的订单
            g4Dao.insert("insert4Order_Operator",inDto);
        }
    }

    /**
     * 删除我的订单
     */
    public void deleteMyOrder(Dto inDto) throws ApplicationException {
        String prod_ord_seq = inDto.getAsString("prod_ord_seq");
        inDto.put("prodord", "'"+prod_ord_seq +"'");
        g4Dao.delete("deleteBind4Myorder",inDto);
        
    }
    
}
