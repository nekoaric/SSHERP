package com.cnnct.rfid.process.prodOrd;

import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.ccl.datastructure.Dto;

import com.cnnct.common.ApplicationException;
import com.cnnct.dataInterface.ProcessDataAdapter;

/**
 * 分解多订单的数据;生成数据信息
 * <br/>系统生成复合订单号，复合完单号;保证号码的唯一性
 * <br/>复合订单号:生产通知单+款号+（最大订单序号+1)+一位随机数字
 * <br/>复合完单号：生产通知单+款号+（最大生产通知单序号+1）+一位随机数字
 * @author zhouww
 *
 */
public class SeparateProdOrdProcess extends ProcessDataAdapter{
    
    public SeparateProdOrdProcess() {
        super();
    }
    
    public SeparateProdOrdProcess(Dto dto,IReader reader){
        this.inDto = dto;
        this.iReader = reader;
    }

    /**
     * 
     */
    public Dto processData() throws ApplicationException {
        String prodordseq = inDto.getAsString("prod_ord_seq");
        String ordseqno = inDto.getAsString("ord_seq_no");
        
        
        return null;
    }
    
}
