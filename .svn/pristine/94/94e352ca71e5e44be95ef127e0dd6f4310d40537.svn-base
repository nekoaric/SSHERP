package com.cnnct.may.data.valide.ordrecordmanager;

import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.cnnct.common.ApplicationException;
import com.cnnct.dataInterface.ValideData;
import com.cnnct.dataInterface.ValideDataAdapter;
import com.cnnct.util.NatureUtil;

/**
 * 判断现有数量的合法性
 * @author zhouww
 *
 */
public class AccountExistsValide extends ValideDataAdapter {
    
    
    public void valideDate() throws ApplicationException {
        String nat = inDto.getAsString("naturea");
        String natValue = NatureUtil.parseNatureZh2natureCode(nat);
        if("".equals(natValue))
        try{
            Dto dto = (Dto)dao.queryForObject("getOrderSche4OrderInfo",inDto);
            if(dto==null){
                throw new ApplicationException("查询不到订单流程数据，请核对订单");
            }
            Dto exisDto = createData4Exists(dto);
            String naturea = inDto.getAsString("naturea");
            int amount = inDto.getAsInteger("amount");
            if(amount>exisDto.getAsInteger(naturea)){
                throw new ApplicationException("订单数量问题，请可对实际数量");
            }
        }catch(Exception e){
            e.printStackTrace();
            throw new ApplicationException("数量判断异常");
        }
    }
    
    /**
     * 处理查询的结果数据处理为现有的数量问题；此判断问题为未计算中间领用对各个流程的影响
     * @return
     */
    public Dto createData4Exists(Dto dto){
        Dto existsDto = new BaseDto();
        //标注流程以NatureUtil类中流程为准 
        int n1 = dto.getAsInteger(NatureUtil.parseNC2natureEn("1")); //裁出
        int n3 = dto.getAsInteger(NatureUtil.parseNC2natureEn("3")); //下线
        int n4 = dto.getAsInteger(NatureUtil.parseNC2natureEn("4")); //水洗收货
        int n5 = dto.getAsInteger(NatureUtil.parseNC2natureEn("5")); //水洗移交
        int n6 = dto.getAsInteger(NatureUtil.parseNC2natureEn("6")); //后整收货
        int n7 = dto.getAsInteger(NatureUtil.parseNC2natureEn("7")); //移交成品
        int n8 = dto.getAsInteger(NatureUtil.parseNC2natureEn("8")); //移交B品
        int n10 = dto.getAsInteger(NatureUtil.parseNC2natureEn("10"));   //收成品
        int n11 = dto.getAsInteger(NatureUtil.parseNC2natureEn("11"));   //收B品
        int n12 = dto.getAsInteger(NatureUtil.parseNC2natureEn("12"));   //中间领用
        int n13 = dto.getAsInteger(NatureUtil.parseNC2natureEn("13"));   //送水洗
        
        //处理裁出数量
        existsDto.put(NatureUtil.parseNC2natureEn("1"), n1-n3);
        //处理缝制下线
        existsDto.put(NatureUtil.parseNC2natureEn("3"), n3-n13);
        //处理送水洗
        existsDto.put(NatureUtil.parseNC2natureEn("13"), n13-n4);
        //处理水洗收货
        existsDto.put(NatureUtil.parseNC2natureEn("4"), n4-n5);
        //处理水洗移交
        existsDto.put(NatureUtil.parseNC2natureEn("5"), n5-n6);
        //处理后整收货
        existsDto.put(NatureUtil.parseNC2natureEn("6"), n6-n7-n8);
        //处理移交成品
        existsDto.put(NatureUtil.parseNC2natureEn("7"), n7-n10);
        //处理移交B品
        existsDto.put(NatureUtil.parseNC2natureEn("8"), n8-n11);
        //处理收成品
        existsDto.put(NatureUtil.parseNC2natureEn("10"), n10);
        //处理收B品
        existsDto.put(NatureUtil.parseNC2natureEn("11"), n11);
        //处理中间领用
        existsDto.put(NatureUtil.parseNC2natureEn("12"), n12);
        return existsDto;
    }

}
