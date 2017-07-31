package com.cnnct.rfid.valide.prodOrd;

import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.ccl.datastructure.Dto;

import com.cnnct.dataInterface.ValideDataAdapter;

/**
 * 订单数据验证控制类
 * @author zhouww
 *
 */
public class ProdOrdValideControl {
   
    /**
     * 生产通知单导入数据验证
     */
    public void prodOrdImportValide(Dto inDto,IReader iReader){
    	//校验基础数据
        ValideDataAdapter poev = new ProdOrd2BaseDataValide(inDto, iReader);
        poev.valideDate();
        //校验重复数据
        ValideDataAdapter por = new ProdOrd2RedataValide(inDto, iReader);
        por.valideDate();
        // 判断数量
        ValideDataAdapter ponv = new ProdOrd2NumberValide(inDto);
        ponv.valideDate();
    }
    
    /**
     * 检测生产通知单的基础信息
     * @param inDto
     * @param iReader
     */
    public void valideProdordBaseInfo(Dto inDto,IReader iReader){
    	ValideDataAdapter poev = new ProdOrd2BaseDataValide(inDto, iReader);
        poev.valideDate();
    }
    /**
     * 检测重复数据
     * @param inDto
     * @param iReader
     */
    public void valideProdordRedataInfo(Dto inDto,IReader iReader){
    	ValideDataAdapter por = new ProdOrd2RedataValide(inDto, iReader);
        por.valideDate();
    }
}
