package com.cnnct.may.data.process.ordrecordmanager;

import java.util.ArrayList;
import java.util.List;

import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.cnnct.common.ApplicationException;
import com.cnnct.dataInterface.ProcessDataAdapter;
import com.cnnct.util.G4Utils;
import com.cnnct.util.NatureNumberUtil;


/**
 * 将退货流程转化为能操作数据库的数据j
 * @author zhouww
 *
 */
@SuppressWarnings("unchecked")
public class RollbackChange4dbProcess extends ProcessDataAdapter{
    
    public RollbackChange4dbProcess(){} //空构造函数
    
    // 定制所需信息的构造器
    public RollbackChange4dbProcess(Dto inDto,IDao dao){
        this.inDto = inDto;
        this.dao = dao;
    }
    /**
     * 1)查询原有数据流水</br>
     * 2)处理原有流水数据为正向数据处理
     * 3)处理改变的数据为反向处理
     */
    public Dto processData() throws ApplicationException {
        Dto outDto = new BaseDto();
        String seq_no = inDto.getAsString("seq_no");
        String middleState = inDto.getAsString("middleState");
        Dto dbDto = new BaseDto();
        dbDto.put("seq_no", seq_no);
        dbDto.put("state", middleState);
        Dto resultDto = (Dto)dao.queryForObject("queryOrdDayList4Change", dbDto);
        List<Dto> resultList = new ArrayList<Dto>();
        Dto addDto = NatureNumberUtil.parseDataToAdd(resultDto);    //对原修改的数据进行正向处理
        addDto.put("state", "0");   //待更新的数据状态为正常
        addDto.put("status", "0");  //数据待更新状态
        Dto delDto = NatureNumberUtil.parseDataToDel(inDto);    //对修改的数据做反向处理
        delDto.put("status", "0");  //数据待更新状态
        delDto.put("state", "0");   //待更新的数据状态为正常
        
        resultList.add(addDto);
        resultList.add(delDto);
        outDto.setDefaultAList(resultList);
        //增加修改的流水数据的订单和生产通知单同步状态
        outDto.put("ord_status", resultDto.getAsString("ord_status"));
        outDto.put("prodord_status", resultDto.getAsString("prodord_status"));
        // 完善修改流水的数据
        outDto.putAll(inDto);
        outDto.put("before_amount", resultDto.getAsString("amount"));
        outDto.put("before_nature", resultDto.getAsString("nature"));
        outDto.put("after_amount", inDto.getAsString("amount"));
        outDto.put("after_nature", inDto.getAsString("nature"));
        outDto.put("ord_day_list_seq_no", seq_no);
        outDto.put("opr_time", G4Utils.getCurrentTime());
        outDto.put("state", "0");
        outDto.put("status", "2");// 生产通知单的同步状态+订单的同步状态 修改操作
        return outDto;
    }

}
