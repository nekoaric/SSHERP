package com.cnnct.rfid.service.impl;

import java.util.List;

import com.cnnct.rfid.service.ProdBoxListService;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.cnnct.common.ApplicationException;
import com.cnnct.util.GlobalConstants;

/************************************************
 * 创建日期: 2013-05-13
 * 创建作者：lingm
 * 功能：领片记录确认 实现类
 * 最后修改时间：
 * 修改记录：
*************************************************/
public class ProdBoxListServiceImpl extends BaseServiceImpl implements ProdBoxListService {

	public Dto queryProdBoxInfo(Dto inDto) throws ApplicationException {
	    Dto outDto = new BaseDto();
	    inDto.put("state", 0);
        List list = g4Dao.queryForPage("queryProdBoxList", inDto);
        Integer totalCount = (Integer) g4Dao.queryForObject("queryProdBoxListCount", inDto);
        outDto.put("jsonStrList", JsonHelper.encodeList2PageJson(list, totalCount, GlobalConstants.FORMAT_Date));
        return outDto;
	}

	public Dto addProdBoxDef(Dto inDto) throws ApplicationException {
		Dto outDto = new BaseDto();
		Integer seq_no = (Integer) g4Dao.queryForObject("queryMaxProdBoxNo",inDto);
		seq_no = seq_no == null ? 1 : (seq_no + 1);
		inDto.put("seq_no", seq_no);
		inDto.put("state", "0");
		g4Dao.insert("insertProdBoxList", inDto);
		outDto.put("msg", "装箱信息登记成功!");
		outDto.put("success", true);
		return outDto;
	}

	public Dto updateProdBoxInfo(Dto inDto) throws ApplicationException {
		// TODO Auto-generated method stub
		return null;
	}

	public Dto deleteProdBoxInfo(Dto inDto) throws ApplicationException {
		Dto outDto = new BaseDto();
		g4Dao.update("deleteProdBoxInfo", inDto);
		outDto.put("msg", "装箱单删除成功!");
		outDto.put("success", true);
		return outDto;
	}
	
	public Dto deleteForEdit(Dto inDto) throws ApplicationException {
		Dto outDto = new BaseDto();
		g4Dao.delete("deleteProdBoxForEdit", inDto);
		return outDto;
	}

	

}
