package com.cnnct.rfid.service;

import com.cnnct.common.ApplicationException;
import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

import java.util.List;


public interface OrdDayListService extends BaseService {

    public Dto queryOrdDayList(Dto pDto) throws ApplicationException;

    public Dto importOrdScheList(Dto pDto) throws ApplicationException;
    
    public Dto insertStyleImgFile(Dto pDto) throws ApplicationException;
    /**
     * 删除重复数据 
     */
    public Dto deleteOrdReData(Dto pDto) throws ApplicationException;
}
