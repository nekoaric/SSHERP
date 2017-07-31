package com.cnnct.may.data.valide.ordrecordmanager;

import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.ccl.datastructure.Dto;

import com.cnnct.dataInterface.ValideData;

/**
 * 交接记录数据判断控制
 * @author zhouww
 *
 */
public class OrdRecordmanagerValideContorl {
    /**
     * 回退操作的数据判断
     * 某一流程的回退数量不能超过现有流程的数量
     * @param inDto
     * @return
     */
    public static void rollbackValide(Dto inDto,IReader dao){
        ValideData rollbackValide = new RollbackOrder4dbValide(inDto, dao);
        rollbackValide.valideDate();
    }
    
    public static void rollbackChanageValide(Dto inDto,IDao dao){
        ValideData changeValide = new RollbackChange4dbValide(inDto, dao);
        changeValide.valideDate();
    }
}
