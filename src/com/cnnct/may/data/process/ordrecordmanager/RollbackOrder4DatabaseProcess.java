package com.cnnct.may.data.process.ordrecordmanager;

import java.util.List;

import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.ccl.datastructure.Dto;

import com.cnnct.common.ApplicationException;
import com.cnnct.dataInterface.ProcessDataAdapter;
import com.cnnct.sys.vo.UserInfoVo;
import com.cnnct.util.TimeUtil;

/**
 * 处理dto数据 使数据符合插入到数据库的格式 :订单回退
 * @author zhouww
 *
 */
public class RollbackOrder4DatabaseProcess extends ProcessDataAdapter{
    
    /** 控制层传过来的字段 **/
    private static String[] webStr = new String[]{"naturerollback","ribbon_color"};
    /** 数据库的字段 **/
    private static String[] dbStr = new String[]{"nature","mark"};
    
    public RollbackOrder4DatabaseProcess(Dto dto,IReader dao){
        inDto = dto;
        super.iReader = dao;
    }
    
    public RollbackOrder4DatabaseProcess(){super();};
    /**
     * 处理数据：将从客户端中传过来的不完整或者不规范的数据整理为数据中所需的数据
     * </br>将从前台传入的字段名称通过处理适应数据库的字段
     * </br>添加操作员的信息
     */
    public Dto processData() throws ApplicationException {
        int dbStrLength = dbStr.length;
        UserInfoVo user = (UserInfoVo)inDto.get("userInfo");
        List dataList = inDto.getDefaultAList();
        for(Object obj : dataList){
            Dto beanDto = (Dto)obj;
            //整理修改字段
            for(int i=0;i<dbStrLength;i++){
                beanDto.put(dbStr[i], beanDto.get(webStr[i]));
            }
            //添加时间信息
            beanDto.put("opr_time", TimeUtil.getCurrentDate());
            beanDto.put("state","0");
            beanDto.put("opr_id",user.getAccount());
        }
        return inDto;
    }

}
