package com.cnnct.may.data.valide.ordrecordmanager;

import java.util.ArrayList;
import java.util.List;

import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.cnnct.common.ApplicationException;
import com.cnnct.dataInterface.ValideDataAdapter;
import com.cnnct.util.G4Utils;
import com.cnnct.util.NatureNumberUtil;
import com.cnnct.util.NatureUtil;

/**
 * 检查回退的数据合规性
 * 回退的数量不能超过当前流程的数量
 * @author zhouww
 *
 */
public class RollbackOrder4dbValide extends ValideDataAdapter{

    public RollbackOrder4dbValide(){}
    
    public RollbackOrder4dbValide(Dto dto,IReader iReader){
       super.inDto = dto;
       super.iReader = iReader;
    }
    /**
     * 检查集合的数量回退是否是合规的
     */
    public void valideDate() throws ApplicationException {
        List dataList = inDto.getDefaultAList();    //所有的回退记录
        List<Dto> dbList = new ArrayList<Dto>();    //相同退货的数据的集合
        //重组数据，按照订单，和回退性质生成查询的数据信息
        //查询并判断数据的正确性
        for(Object obj : dataList){
            boolean isExists = false;
            Dto beanDto = (Dto)obj;
            String rollbackNature = beanDto.getAsString("nature");
            String order_id = beanDto.getAsString("order_id");
            Long amount = beanDto.getAsLong("amount");
            if(G4Utils.isEmpty(amount) || amount ==0){
                throw new ApplicationException("数据数量不能为空或者为0");
            }
            for(Dto dto : dbList){
                if(dto.getAsString("nature").equals(rollbackNature) && 
                        dto.getAsString("order_id").equals(order_id)){
                    dto.put("amount", dto.getAsLong("amount")+amount);
                    isExists = true;
                }
            }
            if(!isExists){
                String startNature = NatureUtil.parseNC2NormalNature4rb(rollbackNature);    //退货流程的起始流程
                Dto newDto = new BaseDto();
                newDto.putAll(beanDto);
                newDto.put("startnature", startNature);
                String rollbackNatures = NatureNumberUtil.getRollbackNature4nature(startNature);//设置其实流程涉及的退货流程
                rollbackNatures = G4Utils.isEmpty(rollbackNatures)?"'##'":rollbackNatures;
                newDto.put("nature", rollbackNatures);
                dbList.add(newDto);
            }
        }
        
        for(Dto dto : dbList){
            List resultList = iReader.queryForList("getOrdAmountByNatureValide",dto);
            if(resultList.size()>0){
                Dto resultDto= (Dto)resultList.get(0);
                //如果退货的数量比现在有的数量还多 则结束业务
                if((resultDto.getAsLong("resultamount") < dto.getAsLong("amount"))){
                    throw new ApplicationException("订单:"+dto.getAsString("order_id")+
                                " 款号:"+dto.getAsString("style_no")+"退货数量超出现有的数量");
                }
            }
            
        }
    }

}
