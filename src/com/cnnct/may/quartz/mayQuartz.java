package com.cnnct.may.quartz;

import java.util.List;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.cnnct.util.NatureUtil;

/**
 * *********************************************
 * 创建日期: 2013-12-23
 * 创建作者：may
 * 功能：
 * 最后修改时间：
 * 修改记录：
 * ***********************************************
 */
/**
 * 弃用：在逻辑业务中处理数量实时性高，取消过多的分散的定时任务
 * zhouww
 * 2014年8月5日
 */
public class mayQuartz extends BaseServiceImpl {

    /**
     * 定时更新订单日记录修改列表
     */
    public void updateOrdDayUpdateList(){
        //获取需要更新的订单日记录更改列表
        List ordDayUpdateList = g4Dao.queryForList("getOrdDayUpdateList4Quartz");

        for(Object obj : ordDayUpdateList){
            Dto ordDayUpdateDto = (Dto)obj;
            Dto updateDto = new BaseDto();
            
            String before_nature = ordDayUpdateDto.getAsString("nature");
            String after_nature = ordDayUpdateDto.getAsString("after_nature");
            String before_amount = ordDayUpdateDto.getAsString("amount");
            String after_amount = ordDayUpdateDto.getAsString("after_amount");
            before_amount = "".equals(before_amount)?"0":before_amount;
            after_amount = "".equals(after_amount)?"0":after_amount;
            //更改日记录
            updateDto.put("style_no", ordDayUpdateDto.getAsString("style_no"));
            updateDto.put("nature",after_nature);
            updateDto.put("amount",after_amount);
            updateDto.put("opr_id",ordDayUpdateDto.getAsString("opr_id"));
            updateDto.put("opr_time",ordDayUpdateDto.getAsString("opr_time"));
            updateDto.put("remark",ordDayUpdateDto.getAsString("remark"));
            updateDto.put("seq_no",ordDayUpdateDto.getAsString("seq_no"));
            if(!after_amount.equals("0")){//删除记录时不需更改状态
                g4Dao.update("updateOrdDayListByRecordManage", updateDto);
            }

            /**开始更改总记录*/
            updateDto.put("before_amount", before_amount);
            updateDto.put("before_nature", before_nature);
            updateDto.put("after_amount", after_amount);
            updateDto.put("after_nature", after_nature);

            updateDto.put("tr_date",ordDayUpdateDto.getAsString("tr_date"));
            updateDto.put("order_id", ordDayUpdateDto.getAsString("order_id"));
            //如果原数量性质和更改后的数量性质一直
            if (before_nature.equals(after_nature)) {
                //更改后的数量-更改前的数量 再登记到对应的数量性质中
                Integer interval = Integer.parseInt(after_amount)-Integer.parseInt(before_amount);

                updateDto.put(NatureUtil.parseNC2natureEn(after_nature),interval);
            } else {
                //原登记记录做负操作,现记录做正操作
                updateDto.put(NatureUtil.parseNC2natureEn(before_nature), -Integer.parseInt(before_amount));
                updateDto.put(NatureUtil.parseNC2natureEn(after_nature),Integer.parseInt(after_amount));
            }
            //更改订单日总记录
            g4Dao.update("updateOrdDayScheNatureAmount", updateDto);
            //更改订单总记录
            g4Dao.update("updateOrdScheListNatureAmount", updateDto);
            // 更改生产通知单日记录
            g4Dao.update("updateProdordDayScheNatureAmount", updateDto);
            // 更改生产通知单总记录
            g4Dao.update("updateProdordScheListNatureAmount", updateDto);
            
            
            //记录订单日记录更改表
            updateDto.put("status", "1");//已处理
            updateDto.put("ord_day_list_seq_no", ordDayUpdateDto.getAsString("seq_no"));//已处理
            g4Dao.insert("updateOrdDayUpdateList", updateDto);
        }
    }
}
