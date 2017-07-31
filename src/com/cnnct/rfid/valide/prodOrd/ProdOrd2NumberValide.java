package com.cnnct.rfid.valide.prodOrd;

import java.util.List;
import java.util.Set;

import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.cnnct.common.ApplicationException;
import com.cnnct.dataInterface.ValideDataAdapter;

/**
 * 验证导入订单产品的数据数量的正确性
 * @author zhouww
 *
 */
@SuppressWarnings("unchecked")
public class ProdOrd2NumberValide extends ValideDataAdapter{
    
    public ProdOrd2NumberValide(Dto dto){
        this.inDto = dto;
    }

    public void valideDate() throws ApplicationException {
        String add_proportion = inDto.getAsString("add_proportion");
        String allow_loss_per=inDto.getAsString("allow_loss_per");
        //验证数量1:获取数据
        List<Dto> productList = (List<Dto>)inDto.get("productList"); //产品信息
        Dto ord_subTotal = (Dto)inDto.get("ord_subTotal");  //订单数
        Dto ins_subTotal = (Dto)inDto.get("ins_subTotal");  //指令数
        if(productList!=null && productList.size()>0){
            ordNumberValide(productList, ord_subTotal, ins_subTotal, add_proportion);
        }
    }
    

    /**
     * 判断数量合规性
     * @param productList   产品信息
     * @param ord_subTotal  订单数小计
     * @param ins_subTotal  指令数小计
     * @param add_proportion    加裁数
     */
    public void ordNumberValide(List<Dto> productList,Dto ord_subTotal,Dto ins_subTotal, String add_proportion){
    	
    	//一个异常汇总信息
        StringBuffer errsb= new StringBuffer();
    	
        Dto waist_ordDto = new BaseDto();    
        Dto waist_insDto = new BaseDto();    
        //验证数量2：遍历所有的产品  统计所有产品的相同
        for(Dto dto : productList){
            String waist = dto.getAsString("waist");
            //订单数
            if("".equals(waist_ordDto.getAsString(waist))){
                long ord_count = dto.getAsLong("ord_num");
                waist_ordDto.put(waist, ord_count);
            }else {
                long ord_count = dto.getAsLong("ord_num")+waist_ordDto.getAsLong(waist);
                waist_ordDto.put(waist, ord_count);
            }
            //指令数
//            if(dto.getAsLong("ins_num")==null){
//            	throw new ApplicationException(String.format("[指令数量]%s 腰围数据小计不正确.相加数据为%d,小计数据为%d",str,ins_waistCount,ins_count));
//            }
            if("".equals(waist_insDto.getAsString(waist))){
                long ins_count = dto.getAsLong("ins_num")==null?0:dto.getAsLong("ins_num");
                waist_insDto.put(waist, ins_count);
            }else{
                long ins_count = (dto.getAsLong("ins_num")==null?0:dto.getAsLong("ins_num"))+waist_insDto.getAsLong(waist);
                waist_insDto.put(waist, ins_count);
            }
        }
        //验证数量3：统计的数据和小计的数据比较
        //验证腰围信息
        if(waist_insDto.size()<1 || waist_insDto.size()<1){
            return;
        }
        //订单数
        Set<String> ord_keys = waist_ordDto.keySet();
        Long ord_total = 0L;
        for(String str : ord_keys){
            long ord_count = ord_subTotal.getAsLong(str);
            long ord_waistCount = waist_ordDto.getAsLong(str); 
            if(ord_count!=ord_waistCount){
                //throw new ApplicationException(String.format("[小计数量]%s 腰围数据小计不正确.相加数据为%d,小计数据为%d",str,ord_waistCount,ord_count));
            	errsb.append(String.format("[小计数量]%s 腰围数据小计不正确.相加数据为%d,小计数据为%d",str,ord_waistCount,ord_count));
            }
            ord_total += ord_count;
        }
        if(ord_subTotal.getAsLong("total").longValue() != ord_total.longValue()){
            //throw new ApplicationException("[订单数量]总计的数量和小计的数量相加不同");
        	errsb.append("[订单数量]总计的数量和小计的数量相加不同");
        }
        //指令数
        Set<String> ins_keys = waist_insDto.keySet();
        Long ins_total = 0L;
        for(String str : ins_keys){
            long ins_count = ins_subTotal.getAsLong(str);
            long ins_waistCount = waist_insDto.getAsLong(str);
            if(ins_count!=ins_waistCount){
                //throw new ApplicationException(String.format("[指令数量]%s 腰围数据小计不正确.相加数据为%d,小计数据为%d",str,ins_waistCount,ins_count));
            	errsb.append(String.format("[指令数量]%s 腰围数据小计不正确.相加数据为%d,小计数据为%d",str,ins_waistCount,ins_count));
            }
            ins_total += ins_count;
        }
        if(ins_subTotal.getAsLong("total").longValue() != ins_total.longValue()){
            //throw new ApplicationException("[指令数量]总计的数量和小计的数量相加不同");
            errsb.append("[指令数量]总计的数量和小计的数量相加不同");
        }
        
        if(inDto.getAsLong("order_num").longValue()!=inDto.getAsLong("order_num_cal").longValue()){
        	errsb.append("[总数]计算总数与通知单总数不符");
        }
      // 判断实裁数不能低于要求加载数的1%
        if(inDto.getAsLong("add_proportion").longValue()<0){
            errsb.append("[加裁数量]加裁比例不能小于0%");
        }
//      // 允许损耗的数值判断
//        if(inDto.getAsLong("allow_loss_per").longValue()<0){
//            errsb.append("[允许损耗]允许损耗比例不能小于0%");
//        }
        String errMsg=errsb.toString();
        if(errMsg.length()>0){
        	throw new ApplicationException("</br>生产通知单"+inDto.getAsString("prod_ord_seq")+"(订单号"+inDto.getAsString("ord_seq_no")+")导入失败</br>"+errMsg);
        }
        
    }

}
