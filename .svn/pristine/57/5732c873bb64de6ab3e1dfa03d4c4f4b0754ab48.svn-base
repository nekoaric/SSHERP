package com.cnnct.rfid.service.impl;

import java.util.List;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.cnnct.common.ApplicationException;
import com.cnnct.rfid.service.QAInfoService;

public class QAInfoServiceImpl extends BaseServiceImpl implements QAInfoService{
	/**
	 * 保存Q&A
	 */
	public Dto saveQAInfo(Dto pDto) throws ApplicationException {
		Dto outDto = new BaseDto();
		String user_id=pDto.getAsString("opr_name");
		Dto dDto = new BaseDto();
		dDto.put("account", user_id);
		String userName=((Dto)g4Dao.queryForObject("queryUserName", dDto)).getAsString("user_name");
		pDto.put("opr_name", userName);
		pDto.put("info_type", pDto.getAsString("info_type"));
		g4Dao.insert("saveQAInfo",pDto);
		outDto.put("msg", "信息发布成功!");
		outDto.put("success", true);
		return outDto;
	}

	/**
	 * 查询信息
	 */
	public Dto queryQAInfo(Dto pDto) throws ApplicationException {
		Dto outDto = new BaseDto();
		List qaList = g4Dao.queryForPage("queryQAInfo", pDto);
		Integer qaCount = g4Dao.queryForPageCount("queryQAInfo", pDto);
		String outStr = JsonHelper.encodeObject2Json(qaList);
		String jsonStr = JsonHelper.encodeJson2PageJson(outStr, qaCount);
		outDto.setDefaultJson(jsonStr);
		return outDto;
	}
	
	/**
	 * 依据问题查询信息
	 */
	public Dto queryByAnswer(Dto pDto) throws ApplicationException {
		Dto outDto = new BaseDto();
		List qaList = g4Dao.queryForPage("queryByAnswer", pDto);
		Integer qaCount = g4Dao.queryForPageCount("queryByAnswer", pDto);
		String outStr = JsonHelper.encodeObject2Json(qaList);
		String jsonStr = JsonHelper.encodeJson2PageJson(outStr, qaCount);
		outDto.setDefaultJson(jsonStr);
		return outDto;
	}
	/**
	 * 修改Q&A
	 */
	public Dto updateQAInfo(Dto pDto) throws ApplicationException {
		String user_id=pDto.getAsString("opr_name");
		Dto dDto = new BaseDto();
		Dto outDto=new BaseDto();
		dDto.put("account", user_id);
		try {
			String userName=((Dto)g4Dao.queryForObject("queryUserName", dDto)).getAsString("user_name");
			pDto.put("opr_name", userName);
			g4Dao.update("updateQAInfo",pDto);
			outDto.put("msg", "信息修改成功!");
			outDto.put("success", true);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			outDto.put("msg", "信息修改失败!");
			outDto.put("success", false);
			e.printStackTrace();
		}
		return outDto;
	}

	@Override
	public Dto deleteQAInfo(Dto PDto) throws ApplicationException {
		g4Dao.delete("deleteQAInfo", PDto);
		return PDto;
	}

	@Override
	public Dto queryFileInfo(Dto pDto) throws ApplicationException {
		Dto outDto = new BaseDto();
		List fileList = g4Dao.queryForPage("queryFileInfo", pDto);
		Integer fileCount = g4Dao.queryForPageCount("queryFileInfo", pDto);
		String outStr = JsonHelper.encodeObject2Json(fileList);
		String jsonStr = JsonHelper.encodeJson2PageJson(outStr, fileCount);
		outDto.setDefaultJson(jsonStr);
		return outDto;
	}

	@Override
	public Dto saveFileInfo(Dto pDto) throws ApplicationException {
		Dto outDto = new BaseDto();
		String user_id=pDto.getAsString("opr_name");
		Dto dDto = new BaseDto();
		dDto.put("account", user_id);
		String userName=((Dto)g4Dao.queryForObject("queryUserName", dDto)).getAsString("user_name");
		pDto.put("OPR_NAME", userName);
		pDto.put("info_type", "2");
		g4Dao.insert("saveFileInfo",pDto);
		outDto.put("msg", "文件信息发布成功!");
		outDto.put("success", true);
		return outDto;
	}
}
