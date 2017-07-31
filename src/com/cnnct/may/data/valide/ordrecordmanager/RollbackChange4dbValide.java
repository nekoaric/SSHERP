package com.cnnct.may.data.valide.ordrecordmanager;

import java.util.ArrayList;
import java.util.List;

import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.cnnct.common.ApplicationException;
import com.cnnct.dataInterface.ValideDataAdapter;
import com.cnnct.util.G4Utils;
import com.cnnct.util.NatureUtil;

/**
 * 检查回退流程流水数据修改是否合规
 * @author zhouww
 *
 */
@SuppressWarnings("unchecked")
public class RollbackChange4dbValide extends ValideDataAdapter{

    public RollbackChange4dbValide(Dto inDto,IDao dao){
        this.inDto = inDto;
        this.dao = dao;
    }
    public RollbackChange4dbValide(){};
    
    /**
     * 1)查询原有流水记录（状态是正常的）
     * 2)查询改变流程的数量性质的数量
     * 3)数据操作现有流程的数量 抛出异常
     */
    public void valideDate() throws ApplicationException {
        String seq_no = inDto.getAsString("seq_no");
        String rollbackNature = inDto.getAsString("naturerollback");
        Long amount = inDto.getAsLong("amount");
        if(G4Utils.isEmpty(amount) || amount<=0){
            throw new ApplicationException("修改的数量不正确，数值必须大于0");
        }
        
        if(G4Utils.isEmpty(seq_no)){
            throw new ApplicationException("无法获取原有流水记录号");
        }
        //查询久流水信息
        Dto dbDto = new BaseDto();
        dbDto.put("seq_no", seq_no);
        dbDto.put("state", inDto.getAsString("middleState"));
        Dto oldDto = (Dto)dao.queryForObject("queryOrdDayList4Change",dbDto);
        String state = oldDto.getAsString("state");
        //状态为不正常的流水不能修改
        if("1".equals(state)){
            throw new ApplicationException("流水为状态不正常的不能修改");
        }
        // 查询现有的流水记录的数据信息
        dbDto = new BaseDto();
        String startNature = NatureUtil.parseNC2NormalNature4rb(rollbackNature);    //退货流程的起始流程
        dbDto.put("startnature", startNature);
        dbDto.put("nature", rollbackNature);
        dbDto.put("style_no",inDto.getAsString("style_no"));
        dbDto.put("order_id", inDto.getAsString("order_id"));
        Dto resultDto = (Dto)dao.queryForObject("getOrdAmountByNatureValide",dbDto);
        //判断修改数量是否合法的
        String oldNature = oldDto.getAsString("nature");
        long valideamount = 0l;
        long resultamount = resultDto.getAsLong("resultamount");
        long maxamount = 0;
        if(oldNature.equals(rollbackNature)){ 
            long oldamount = oldDto.getAsLong("amount");
            maxamount = resultamount+oldamount;
        }else { 
            maxamount = resultamount;
        }
        valideamount = maxamount - amount;
        if(valideamount<0){ //修改的数量比现有的流程数量大
            String startNatureName = NatureUtil.parseNC2natureZh(startNature);
            String changeNatureName = NatureUtil.parseNC2natureZh4rb(rollbackNature);
            throw new ApplicationException(changeNatureName+"的数量为"+amount+"不能大于"+maxamount);
        }
    }

}
