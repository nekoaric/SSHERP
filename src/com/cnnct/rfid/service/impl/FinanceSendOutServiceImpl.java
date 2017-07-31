package com.cnnct.rfid.service.impl;

import java.util.List;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.cnnct.common.ApplicationException;

public class FinanceSendOutServiceImpl extends BaseServiceImpl implements FinanceSendOutService {

	
	public Dto queryFinanceSendOut(Dto inDto) throws ApplicationException {
		Dto outDto=new BaseDto();
		List list=g4Dao.queryForPage("queryFinanceSendOut",inDto);
		Integer totalCount = g4Dao.queryForPageCount("queryFinanceSendOut", inDto);
		String jsonStrList = JsonHelper.encodeObject2Json(list);
        outDto.put("jsonStrList", JsonHelper.encodeJson2PageJson(jsonStrList, totalCount));
        return outDto;
	}

	
	public Dto updateFinanceSendOut(Dto inDto) throws ApplicationException {
		Dto outDto=new BaseDto();
		g4Dao.update("updateFinanceSendOut",inDto);
		outDto.put("success", true);
		return outDto;
	}

	
	public Dto importFinanceSendOut(Dto inDto) throws ApplicationException {
		Dto outDto=new BaseDto();
		List rs=g4Dao.queryForList("getOrdInfo",inDto);
		g4Dao.batchInsert(rs, "insertFinanceSendOut");
		outDto.put("success", true);
		return outDto;
	}

	
	public Dto deleteFinanceSendOut(Dto inDto) throws ApplicationException {
		Dto outDto=new BaseDto();
		inDto.put("statue", "1");
		g4Dao.update("deleteFinanceSendOut",inDto);
        outDto.put("success", true);
		return outDto;
	}


	@Override
	public Dto addFinanceSendOut(Dto inDto) throws ApplicationException {
		Dto outDto=new BaseDto();
		g4Dao.insert("insertFinanceSendOut",inDto);
		return outDto;
	}

}
