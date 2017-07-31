package com.cnnct.rfid.service.impl;

import java.util.ArrayList;
import java.util.List;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.cnnct.common.ApplicationException;
import com.cnnct.rfid.service.HungProgressService;

public class HungProgressServiceImpl extends BaseServiceImpl implements HungProgressService {

	public Dto queryHungProgress(Dto inDto) throws ApplicationException {
		Dto outDto=new BaseDto();
		List list=g4Dao.queryForPage("getHungProgress",inDto);
		Integer totalCount = g4Dao.queryForPageCount("getHungProgress", inDto);
		String jsonStrList = JsonHelper.encodeObject2Json(list);
        outDto.put("jsonStrList", JsonHelper.encodeJson2PageJson(jsonStrList, totalCount));
        return outDto;
	}

	public Dto updateHungProgress(Dto inDto) throws ApplicationException {
		Dto outDto=new BaseDto();
		g4Dao.update("updateHungProgress",inDto);
		outDto.put("success", true);
		return outDto;
	}

	public Dto addHungProgress(Dto inDto) throws ApplicationException {
		Dto outDto=new BaseDto();
		g4Dao.update("insertHungProgress",inDto);
        outDto.put("success", true);
		return outDto;
	}

	public Dto deleteHungProgress(Dto inDto) throws ApplicationException {
		Dto outDto=new BaseDto();
		inDto.put("statue", "1");
		g4Dao.update("updateHungProgress",inDto);
        outDto.put("success", true);
		return outDto;
	}

}
