package com.cnnct.rfid.service;

import com.cnnct.common.ApplicationException;
import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

import java.util.List;


/**
 * RFID电子标签业务接口
 * @author lingm
 * @since 2013-05-09
 */
public interface EpcDayListService extends BaseService {
	
	public Dto queryEpcDayListInfo(Dto pDto);

    public Dto importExcel(Dto pDto) throws ApplicationException;

    public Dto importExcelNoEpc(List list) throws ApplicationException;
}
