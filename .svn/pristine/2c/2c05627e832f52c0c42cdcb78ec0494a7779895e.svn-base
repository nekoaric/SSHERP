package com.cnnct.rfid.service.impl;

import java.util.List;

import com.cnnct.rfid.service.ProdSureListService;
import com.cnnct.util.G4Utils;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.cnnct.common.ApplicationException;

/************************************************
 * 创建日期: 2013-05-13
 * 创建作者：lingm
 * 功能：领片记录确认 实现类
 * 最后修改时间：
 * 修改记录：
*************************************************/
public class ProdSureListServiceImpl extends BaseServiceImpl implements ProdSureListService {
	
	public Dto queryProdInfoById(Dto pDto) {
		Dto outDto = new BaseDto();
		List list = g4Dao.queryForPage("queryProdBasInfo4Sure", pDto);
		Integer totalCount = g4Dao.queryForPageCount("queryProdBasInfo4Sure", pDto);
		String jsonStrList = JsonHelper.encodeObject2Json(list);
		outDto.put("jsonStrList", JsonHelper.encodeJson2PageJson(jsonStrList, totalCount));
		return outDto;
	}

	public Dto queryProdSureInfoById(Dto pDto) {
		Dto outDto = new BaseDto();
		List list = g4Dao.queryForPage("queryProdSureList", pDto);
		Integer totalCount = (Integer) g4Dao.queryForObject("queryProdSureListForPageCount", pDto);
		String jsonStrList = JsonHelper.encodeObject2Json(list);
		outDto.put("jsonStrList", JsonHelper.encodeJson2PageJson(jsonStrList, totalCount));
		return outDto;
	}
	/**
	 * 领片确认信息保存
	 * 
	 * @param pDto
	 * @return
	 */
	public  Dto saveProdSureInfo(Dto iDto) throws ApplicationException {
		try {
			Dto outDto = new BaseDto();
			Integer no=(Integer)g4Dao.queryForObject("querySumAmount", iDto);
			if(no==null)no=0;
			int allNo=no+Integer.parseInt(iDto.getAsString("amount"));
			Integer cut_num=iDto.getAsInteger("cut_num");
			if(cut_num==null)cut_num=0;
			if(cut_num==0){
				outDto.put("msg", "当前服装未绑定标签!");
				outDto.put("success", new Boolean(false));
			}else{
			if(allNo>cut_num){
				outDto.put("msg", "领片数量超出剩余服装裁剪数量!");
				outDto.put("success", new Boolean(false));
			}else {
			Integer seq_no=(Integer) g4Dao.queryForObject("queryMaxProdSureInfo");
			if (seq_no == null) {
				seq_no = 1;
			} else {
				seq_no = seq_no + 1;
			}
				iDto.put("seq_no", seq_no);
				iDto.put("state", "0");
				iDto.put("seq_no", seq_no);
				g4Dao.insert("insertProdSureList",iDto);
				outDto.put("msg", "领片信息确认登记成功!");
				outDto.put("success", new Boolean(true));
			}
			}
			return outDto;
		} catch (Exception e) {
			throw new ApplicationException(e.getMessage(), e);
		}

	}
	/**
	 * 查询RFID产品信息 带分页
	 * 
	 * @param pDto
	 * @return
	 */
	public  Dto queryProdList(Dto iDto) {
		Dto outDto = new BaseDto();
		List list = g4Dao.queryForPage("queryProdBasInfo", iDto);
		Integer totalCount = (Integer) g4Dao.queryForObject("queryProdBasInfoForPageCount", iDto);
		String jsonStrList = JsonHelper.encodeObject2Json(list);
		outDto.put("jsonStrList", JsonHelper.encodeJson2PageJson(jsonStrList, totalCount));
		return outDto;
	}
	public  Dto queryProdBasInfo(Dto iDto) {
		Dto outDto = new BaseDto();
		List list = g4Dao.queryForPage("queryProdBasInfo", iDto);
		Integer totalCount = (Integer) g4Dao.queryForObject("queryProdBasInfoForPageCount", iDto);
		String jsonStrList = JsonHelper.encodeObject2Json(list);
		outDto.put("jsonStrList", JsonHelper.encodeJson2PageJson(jsonStrList, totalCount));
		return outDto;
	}
	public  Dto queryProdBasBaseInfo(Dto iDto) {
		Dto outDto = new BaseDto();
		List list = g4Dao.queryForPage("queryProdBasBaseInfo", iDto);
		Integer totalCount = (Integer) g4Dao.queryForObject("queryProdBasInfoForPageCount", iDto);
		String jsonStrList = JsonHelper.encodeObject2Json(list);
		outDto.put("jsonStrList", JsonHelper.encodeJson2PageJson(jsonStrList, totalCount));
		return outDto;
	}
	
	/**
	 * RFID电子标签解绑
	 * 
	 * @param pDto
	 * @return
	 */
	public Dto updateProdEpcInfo(Dto pDto) {
		try {
			Dto outDto = new BaseDto();
			pDto.put("flow", "9");
			pDto.put("state", "1");//0-正常 1-失效
			g4Dao.update("removeEpcInfo",pDto);
			g4Dao.update("removeEpcFlowInfo",pDto);
			outDto.put("success", new Boolean(true));
			outDto.put("msg", "解除R电子标签绑定成功!");

			pDto.put("nature", "9");
			pDto.put("flag", "0");
			pDto.put("opr_time", G4Utils.getCurrentTime());
			g4Dao.insert("insertEpcDayListInfo",pDto);
		} catch (Exception e) {
			throw new ApplicationException(e.getMessage(), e);
		}
		return null;
	}

}
