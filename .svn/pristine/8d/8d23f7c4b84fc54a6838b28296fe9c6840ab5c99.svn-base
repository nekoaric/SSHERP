package com.cnnct.rfid.process.prodOrd;

import java.io.InputStream;

import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.cnnct.dataInterface.ProcessDataAdapter;

/**
 * 生产通知单的数据处理控制类
 * @author zhouww
 *
 */
public class ProdOrdProcessControl {
    
    /**
     * 生产通知单导入数据
     * @param inDto
     * @param iReader
     * @param is
     * @return
     */
    public Dto praseProdOrdExcel(Dto inDto,IReader iReader,InputStream is){
        Dto outDto = new BaseDto();
        //excel数据解析
        ProcessDataAdapter pep = new ProdOrd2ExcelProcess(inDto, iReader, is);
        outDto = pep.processData();
        
        //增加数据处理的过程：适应多订单的情况 
        for(int i=0;i<outDto.keySet().size();i++){
        //数据库数据分析
        ProcessDataAdapter pdp = new ProdOrd2DbProcess((Dto)outDto.get(i), iReader);
        outDto.put(i, pdp.processData());
        }
        return outDto;
    }
}
