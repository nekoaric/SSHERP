package com.cnnct.rfid.service.impl;

import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import jxl.Workbook;
import jxl.format.Alignment;
import jxl.format.Border;
import jxl.format.BorderLineStyle;
import jxl.format.VerticalAlignment;
import jxl.write.Label;
import jxl.write.WritableCellFormat;
import jxl.write.WritableFont;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;

import org.apache.poi.hssf.record.MergeCellsRecord;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.cnnct.common.ApplicationException;
import com.cnnct.rfid.service.ProdOrdInfoService;
import com.cnnct.util.DataUtil;
import com.cnnct.util.G4Utils;
import com.cnnct.util.GlobalConstants;

public class ProdOrdInfoServiceImpl extends BaseServiceImpl implements
		ProdOrdInfoService {

	/**
	 * 生产通知单信息查询
	 */
	public Dto queryProdOrdInfo(Dto pDto) throws ApplicationException {
		Dto outDto = new BaseDto();
		String prod_ord_seq = pDto.getAsString("prod_ord_seq");
		String ordstatus = pDto.getAsString("prodstatus");
		//处理历史记录判断条件
		String hisStatus = pDto.getAsString("isHistory");
		//如果不是历史记录
		if("no".equals(hisStatus)){
			pDto.remove("isHistory");
		}
		// 处理完单号 详细查询的订单号处理
		String prodords = pDto.getAsString("prodords");
		if(!G4Utils.isEmpty(prodords)){
		    prodords.replace("'", "''");
		    String[] prodordArr = prodords.split(",");
		    StringBuffer sb = new StringBuffer();
		    for(String str : prodordArr){
		        sb = sb.append(",'").append(str).append("'");
		    }
		    if(sb.length()>0){
		        sb.deleteCharAt(0);
		    }
		    pDto.put("prodords", sb.toString());
		}
		
		String ord_seq_no = pDto.getAsString("ord_seq_no");
        if(!G4Utils.isEmpty(ord_seq_no)){
            ord_seq_no = ord_seq_no.replace("'", "''");
            pDto.put("ord_seq_no", ord_seq_no);
        }
        if(!G4Utils.isEmpty(prod_ord_seq)){
            prod_ord_seq = prod_ord_seq.replace("'", "''");
            pDto.put("prod_ord_seq", prod_ord_seq);
        }
		
		//有prod_ord_seq数据的单个订单查询 增加isHistory参数 保证是在所有的订单中查询
		if(!"".equals(prod_ord_seq)){
		    pDto.put("isHistory", "yes");
		}
		if(ordstatus.length()>0){
			String[] ordstatusStr = ordstatus.split(";");
			StringBuffer sb = new StringBuffer();
			for(String str:ordstatusStr){
				if("".equals(str)){
					continue;
				}
				sb.append("'").append(str.trim()).append("',");
			}
			if(sb.length()>0){
				sb.deleteCharAt(sb.length()-1);
				pDto.put("prodstatus", sb.toString());
			}
		}
		
		List list = g4Dao.queryForPage("queryProdOrdInfo", pDto);
		Integer totalCount = (Integer)g4Dao.queryForObject("queryProdOrdInfo4Count", pDto);

		for (Object obj : list) {
			Dto dto = (Dto) obj;
			String remark = dto.getAsString("remark").replaceAll(";", "\n");
			dto.put("remark", remark);
		}
		String jsonStrList = JsonHelper.encodeList2PageJson(list, totalCount,
				GlobalConstants.FORMAT_Date);
		outDto.put("jsonStrList", jsonStrList);
		return outDto;
	}

	/**
	 * 产品信息查询
	 */
	public Dto queryProdBasInfo(Dto pDto) throws ApplicationException {
		Dto outDto = new BaseDto();
		List prodList = new ArrayList();
		List list = g4Dao.queryForPage("queryProdBasInfo4RealNum", pDto);
		List colortList = g4Dao.queryForPage("queryProdBasInfo4Row", pDto);
		for (int i = 0; i < list.size(); i++) {
			Dto dto = (Dto) list.get(i);
			for (int y = 0; y < colortList.size(); y++) {
				Dto inDto = (Dto) colortList.get(y);
				if (dto.getAsString("color").equals(inDto.getAsString("color"))
						&& dto.getAsString("in_length").equals(
								inDto.getAsString("in_length"))
						&& dto.getAsString("country").equals(
								inDto.getAsString("country"))) {
					inDto.put("num" + dto.getAsString("waist"), dto
							.getAsString("real_num"));
					if (G4Utils.isEmpty(inDto.getAsString("num"))) {
						inDto.put("num", dto.getAsString("waist"));
						inDto.put("real_num", dto.getAsString("real_num"));
					} else {
						inDto.put("num", inDto.getAsString("num") + ","
								+ dto.getAsString("waist"));
						inDto.put("real_num", inDto.getAsString("real_num")
								+ "," + dto.getAsString("real_num"));
					}
				} else {

				}
			}

		}

		Integer totalCount = g4Dao.queryForPageCount("queryProdBasInfo4Row", pDto);
		String jsonStrList = JsonHelper.encodeList2PageJson(colortList,
				totalCount, GlobalConstants.FORMAT_Date);
		outDto.put("jsonStrList", jsonStrList);
		return outDto;
	}

	/**
	 * 产品信息查询 订单数查询
	 */
	public Dto queryProdOrdBasInfo(Dto pDto) throws ApplicationException {
		Dto outDto = new BaseDto();
		List prodList = new ArrayList();
		List list = g4Dao.queryForList("queryProdBasInfo4OrdNum", pDto);// 具体产品订单数量信息
		List rowList = g4Dao.queryForList("queryProdBasInfo4Row", pDto);// 行信息

		Dto qDto = new BaseDto();
		qDto.put("id", pDto.getAsString("prod_ord_seq"));
		qDto.put("state", "0");
		Dto columnDto = (Dto) g4Dao.queryForObject("queryProdSubInfo", pDto);// 列头信息
		String columnStr = columnDto.getAsString("value");

		for (int i = 0; i < rowList.size(); i++) {
			Dto rowDto = (Dto) rowList.get(i);
			String color = rowDto.getAsString("color");
			String in_length = rowDto.getAsString("in_length");
			String country = rowDto.getAsString("country");

			rowDto.put("num", columnStr);
			String[] columns = columnStr.split(",");

			for (String waist : columns) {
				Boolean flag = false;
				for (Object aList : list) {
					Dto dto = (Dto) aList;
					if (dto.getAsString("color").equals(color)
							&& dto.getAsString("in_length").equals(in_length)
							&& dto.getAsString("country").equals(country)
							&& dto.getAsString("waist").equals(waist)) {
						if ("".equals(rowDto.getAsString("ord_num"))) {
							rowDto.put("ord_num", dto.getAsString("ord_num")
									+ ",");
						} else {
							rowDto.put("ord_num", rowDto.getAsString("ord_num")
									+ dto.getAsString("ord_num") + ",");
						}

						flag = true;
						list.remove(aList);
						break;
					}
				}

				if (!flag) {// 该尺码下没有订单数量为空
					rowDto.put("ord_num", rowDto.getAsString("ord_num") + ",");
				}

			}
		}
		Integer totalCount = rowList.size();
		String jsonStrList = JsonHelper.encodeList2PageJson(rowList,
				totalCount, GlobalConstants.FORMAT_Date);
		outDto.put("jsonStrList", jsonStrList);
		return outDto;
	}

	/**
	 * 产品信息查询 指令数查询
	 */
	public Dto queryProdInsInfo(Dto pDto) throws ApplicationException {
		Dto outDto = new BaseDto();
		List prodList = new ArrayList();
		List list = g4Dao.queryForList("queryProdBasInfo4InsNum", pDto);// 具体产品指令数信息
		List rowList = g4Dao.queryForList("queryProdBasInfo4Row", pDto);// 行信息

		Dto qDto = new BaseDto();
		qDto.put("id", pDto.getAsString("prod_ord_seq"));
		qDto.put("state", "0");
		Dto columnDto = (Dto) g4Dao.queryForObject("queryProdSubInfo", pDto);// 列头信息
		String columnStr = columnDto.getAsString("value");

		for (int i = 0; i < rowList.size(); i++) {
			Dto rowDto = (Dto) rowList.get(i);
			String color = rowDto.getAsString("color");
			String in_length = rowDto.getAsString("in_length");
			String country = rowDto.getAsString("country");

			rowDto.put("num", columnStr);
			String[] columns = columnStr.split(",");

			for (String waist : columns) {
				Boolean flag = false;
				for (Object aList : list) {
					Dto dto = (Dto) aList;
					if (dto.getAsString("color").equals(color)
							&& dto.getAsString("in_length").equals(in_length)
							&& dto.getAsString("country").equals(country)
							&& dto.getAsString("waist").equals(waist)) {
						if ("".equals(rowDto.getAsString("ins_num"))) {
							rowDto.put("ins_num", dto.getAsString("ins_num")
									+ ",");
						} else {
							rowDto.put("ins_num", rowDto.getAsString("ins_num")
									+ dto.getAsString("ins_num") + ",");
						}

						flag = true;
						break;
					}
				}

				if (!flag) {
					rowDto.put("ins_num", rowDto.getAsString("ins_num") + ",");
				}

			}
		}
		Integer totalCount = rowList.size();
		String jsonStrList = JsonHelper.encodeList2PageJson(rowList,
				totalCount, GlobalConstants.FORMAT_Date);
		outDto.put("jsonStrList", jsonStrList);
		return outDto;
	}

	public synchronized Dto addProdOrdDef(Dto inDto)
			throws ApplicationException {
		Dto outDto = new BaseDto();
		
		String ord_seq_no = inDto.getAsString("ord_seq_no");
		// 验证订单编号是否唯一
	    Dto dbDto = new BaseDto();
        dbDto.put("order_id", ord_seq_no);
        List ords = g4Dao.queryForList("queryOrdBasInfo",dbDto);
        if(ords.size()>0){
            throw new ApplicationException("["+ord_seq_no+"该订单编号已经存在，请检查]");
        }
		// 生产通知单号由客户提供 我们保存一个序号
		String maxSeqNo = (String) g4Dao.queryForObject("getProdOrdMaxSeqNo",
				inDto);
		Integer seq_no = maxSeqNo == null ? 1
				: (Integer.parseInt(maxSeqNo) + 1);
		inDto.put("seq_no", seq_no);
		// 订单号取最大值
		// 生产计划序号取最大值
		String maxPlanSeqNo = (String) g4Dao.queryForObject(
				"getProdPlanMaxSeqNo", inDto);
		Integer planSeqNo = maxPlanSeqNo == null ? 1 : (Integer
				.parseInt(maxPlanSeqNo) + 1);
		String plan_seq_no = String.format("%03d", planSeqNo);
		inDto.put("plan_seq_no", plan_seq_no);

		inDto.put("prod_plan_seq", plan_seq_no);
		inDto.put("state", "0");
		g4Dao.insert("insertProdOrdInfo", inDto);
		g4Dao.insert("insertProdPlanInfo", inDto);

		// 插入生产通知单附加信息表(表头信息)
		Dto prodSubInfoDto = new BaseDto();
		prodSubInfoDto.put("seq_no", seq_no);
		prodSubInfoDto.put("id", inDto.getAsString("prod_ord_seq"));
		prodSubInfoDto.put("value", inDto.getAsString("colValue"));
		prodSubInfoDto.put("flag", "1");
		prodSubInfoDto.put("state", "0");
		g4Dao.insert("insertProdSubInfo", prodSubInfoDto);

		// 插入订单
		Dto orderDto = new BaseDto();
		orderDto.putAll(inDto);
		orderDto.put("flag", "2");// 1-预计订单 2-已排产订单3-在线订单4-已完成订单，5-已交货订单
		orderDto.put("order_id", inDto.getAsString("ord_seq_no"));
		orderDto.put("order_date", G4Utils.getCurDate());
		orderDto.put("deli_date", inDto.getAsString("delivery_date"));// 交货日期
		g4Dao.insert("insertOrdBasInfo4ProdOrd", orderDto);

		outDto.put("msg", "生产通知单登记成功!");
		outDto.put("success", true);
		return outDto;
	}

	public synchronized Dto addProdBasDef(Dto inDto)
			throws ApplicationException {
		Dto outDto = new BaseDto();

		// 款式序号 (同一个生产通知单下的最大款式序号) 一个生成通知单下的款式序号相同
		Integer maxStyleSeqNo = (Integer) g4Dao.queryForObject(
				"getProdBasInfoMaxStyleSeqNo", inDto);
		maxStyleSeqNo = maxStyleSeqNo == null ? 1 : maxStyleSeqNo;
		String style_no_seq_no = "" + maxStyleSeqNo;

		// 颜色序号 (同一个生产通知单下的最大演示序号)
		Dto qDto = new BaseDto();
		qDto.put("prod_ord_seq", inDto.getAsString("prod_ord_seq"));
		qDto.put("style_no_seq_no", style_no_seq_no);

		qDto.put("color", inDto.getAsString("color"));
		Dto maxDto = (Dto) g4Dao.queryForObject("getProdBasInfoMaxInfo4Color",
				qDto);
		Integer maxColorSeqNo = maxDto.getAsInteger("max_color_seq_no") == null ? 1
				: maxDto.getAsInteger("max_color_seq_no") + 1;
		String color_seq_no = String.format("%02d", maxColorSeqNo);
		qDto.remove("color");

		qDto.put("in_length", inDto.getAsString("in_length"));
		qDto.put("waist", inDto.getAsString("waist"));
		maxDto = (Dto) g4Dao.queryForObject("getProdBasInfoMaxInfo4ClothSize",
				qDto);
		Integer clothSizeSeqNo = maxDto.getAsInteger("max_cloth_size_seq_no") == null ? 1
				: maxDto.getAsInteger("max_cloth_size_seq_no") + 1;
		String cloth_size_seq_no = String.format("%02d", clothSizeSeqNo);
		qDto.remove("in_length");
		qDto.remove("waist");

		qDto.put("country", inDto.getAsString("country"));
		maxDto = (Dto) g4Dao.queryForObject("getProdBasInfoMaxInfo4Country",
				qDto);
		Integer maxCountrySeqNo = maxDto.getAsInteger("country_seq_no") == null ? 1
				: maxDto.getAsInteger("country_seq_no") + 1;
		String country_seq_no = "".equals(inDto.getAsString("country")) ? "0"
				: ("" + maxCountrySeqNo);
		qDto.remove("country");

		qDto.put("print", inDto.getAsString("print"));
		maxDto = (Dto) g4Dao
				.queryForObject("getProdBasInfoMaxInfo4Print", qDto);
		Integer maxPrintSeqNo = maxDto.getAsInteger("max_print_seq_no") == null ? 1
				: maxDto.getAsInteger("max_print_seq_no") + 1;
		String print_seq_no = "".equals(inDto.getAsString("print")) ? "0"
				: ("" + maxPrintSeqNo);
		qDto.remove("print");

		qDto.put("wash", inDto.getAsString("wash"));
		maxDto = (Dto) g4Dao.queryForObject("getProdBasInfoMaxInfo4Wash", qDto);
		Integer maxWashSeqNo = maxDto.getAsInteger("max_wash_seq_no") == null ? 1
				: maxDto.getAsInteger("max_wash_seq_no") + 1;
		String wash_seq_no = "".equals(inDto.getAsString("wash")) ? "0"
				: ("" + maxWashSeqNo);
		qDto.remove("wash");

		// 产品编号 8位完单编号 1位国家 2位颜色 2位尺码 1位印花 1位洗水方式
		int seqIndex=inDto.getAsString("prod_ord_seq").length()>8?inDto.getAsString("prod_ord_seq").length()-8:0;
		String product_id = inDto.getAsString("prod_ord_seq").substring(seqIndex) + country_seq_no
				+ style_no_seq_no + color_seq_no + cloth_size_seq_no
				+ print_seq_no + wash_seq_no;

		inDto.put("product_id", product_id);
		inDto.put("style_no_seq_no", style_no_seq_no);
		inDto.put("country_seq_no", country_seq_no);
		inDto.put("color_seq_no", color_seq_no);
		inDto.put("cloth_size_seq_no", cloth_size_seq_no);
		inDto.put("print_seq_no", print_seq_no);
		inDto.put("wash_seq_no", wash_seq_no);

		inDto.put("state", "0");

		g4Dao.insert("insertProdBasInfo", inDto);
		// g4Dao.insert("insertBasClothInfo", inDto);
		outDto.put("msg", "产品信息登记成功!");
		outDto.put("success", true);
		return outDto;
	}

	public Dto updateProdOrdInfo(Dto inDto) throws ApplicationException {
		Dto outDto = new BaseDto();
		String plan_seq_no = inDto.getAsString("prod_plan_seq");
		while (plan_seq_no.length() < 3) {
			plan_seq_no = "0" + plan_seq_no;
		}
		inDto.put("prod_plan_seq", plan_seq_no);
		
		
		g4Dao.update("updateProdOrdInfo", inDto);
		//同步订单基本信息中的客户信息
		g4Dao.update("updateOrdBasInfoCustId",inDto);
		//同步流水记录中的客户信息
		g4Dao.update("updateOrdDayListCustId",inDto);
		g4Dao.update("updateProdBasInfo",inDto);
		g4Dao.update("updateProdPlanInfo", inDto);

		Dto prodSubInfoDto = new BaseDto();
        prodSubInfoDto.put("id", inDto.getAsString("prod_ord_seq"));
        prodSubInfoDto.put("value", inDto.getAsString("colValue"));
        g4Dao.update("updateProdSubInfo", prodSubInfoDto);

		outDto.put("msg", "生产通知单修改成功!");
		outDto.put("success", true);
		return outDto;
	}
	
	/**
	 * 删除生产通知单
	 */
	public Dto deleteProdOrdInfo(Dto inDto) throws ApplicationException {
		//判断生产通知单是否已经有绑定或者有订单导入信息
    	//如果有则不能够删除，如果没有则删除生产通知单
		//如果订单包含多个生产通知单 则 不删除 订单, 否则删除订单
		Dto outDto = new BaseDto();
		Long sum_num = (Long)g4Dao.queryForObject("queryCount4Stream", inDto);
		if(sum_num>0){
			throw new ApplicationException(1155,"生产通知单已有生产信息，停止删除操作!");
		}
		//删除生产通知单：生产通知单，订单，产品信息，生产计划表，通知单附加信息表,产品标签对应表
		g4Dao.delete("deleteEpcProdList", inDto);
		g4Dao.delete("deleteProdBasInfoByOrderId", inDto);
		g4Dao.delete("deleteProdSubInfo", inDto);
		g4Dao.delete("deleteProdPlanInfo", inDto);
		g4Dao.delete("deleteProdOrdInfoByOrderId", inDto);
		List prodOrds = g4Dao.queryForList("queryProdOrdByOrdSeqNo",inDto);
		int prodOrdsSize = prodOrds.size();
		if(prodOrdsSize <= 1){
			g4Dao.delete("deleteOrdBasInfoByOrderId", inDto);
		}
		return outDto;
	}
	/**
	 * 删除生产通知单的所有数据：基础数据和订单基本信息
	 */
	public Dto deleteAllInfo4ProdOrd(Dto inDto) throws ApplicationException {
		//查询索要删除的流程数据
		//删除生产通知单的基本信息
		//删除流程数据
		//删除统计数据
		
		//删除生产通知单：生产通知单，订单，产品信息，生产计划表，通知单附加信息表,产品标签对应表
		Dto outDto = new BaseDto();
		g4Dao.delete("deleteDayListAndScheList",inDto);
		g4Dao.delete("deleteProductStream",inDto);
		g4Dao.delete("deleteProdOrdStream",inDto);
		g4Dao.delete("deleteEpcProdList", inDto);
		g4Dao.delete("deleteProdBasInfoByOrderId", inDto);
		g4Dao.delete("deleteProdSubInfo", inDto);
		g4Dao.delete("deleteProdPlanInfo", inDto);
		g4Dao.delete("deleteProdOrdInfoByOrderId", inDto);
		g4Dao.delete("deleteOrdBasInfoByOrderId", inDto);
		return outDto;
	}
	public Dto deleteProdBasDef(Dto inDto) throws ApplicationException {
		Dto outDto = new BaseDto();
		g4Dao.delete("deleteProdBasInfo", inDto);
		outDto.put("msg", "产品删除成功!");
		outDto.put("success", true);
		return outDto;
	}

	public Dto updateFileInfo(Dto pDto) throws ApplicationException {
		Dto outDto = new BaseDto();
		g4Dao.update("updateProdOrdInfoFileInfo", pDto);
		outDto.put("msg", "文件保存成功!"); 
		outDto.put("success", true);
		return outDto;
	}

	public Dto getProdBasInfoCombo(Dto inDto) throws ApplicationException {
		Dto outDto = new BaseDto();

		String flag = inDto.getAsString("flag");// 查询标志

		String click_cust_id = inDto.getAsString("click_cust_id");
		String click_grp_id = inDto.getAsString("click_grp_id");

		if (click_cust_id.startsWith("cust")) {
			inDto.put("cust_id", click_cust_id.substring(4));
		} else if (click_cust_id.startsWith("ord")) {
			inDto.put("ord_seq_no", click_cust_id.substring(3));
		} else if (click_grp_id.startsWith("grps")) {
			inDto.put("belong_grp_id", click_grp_id.substring(4));
		} else if (click_grp_id.startsWith("ord")) {
			inDto.put("ord_seq_no", click_grp_id.substring(3, click_grp_id
					.indexOf("_grps")));
		}

		List list = g4Dao.queryForList("getProdBasInfoCombo", inDto);
		String jsonString = "";
		if ("style_no".equals(flag)) {
			List styleList = new ArrayList();
			Map<String, Dto> styleMap = new HashMap<String, Dto>();
			for (Object obj : list) {
				Dto dto = (Dto) obj;

//				String value = dto.getAsString("prod_ord_seq") + "_"
//						+ dto.getAsString("style_no");
				String value = dto.getAsString("style_no");
				if("".equals(value)){
					continue;
				}
				dto.put("value", value);
				dto.put("text", dto.getAsString("style_no"));
				Dto d = styleMap.get(value);
				if (G4Utils.isEmpty(d)) {
					styleMap.put(value, dto);
				}
			}
			for (String key : styleMap.keySet()) {
				styleList.add(styleMap.get(key));
			}
			jsonString = JsonHelper.encodeObject2Json(styleList);
		} else if ("country".equals(flag)) {
			List countryList = new ArrayList();
			Map<String, Dto> countryMap = new HashMap<String, Dto>();
			for (Object obj : list) {
				Dto dto = (Dto) obj;

//				String value = dto.getAsString("prod_ord_seq") + "_"
//						+ dto.getAsString("country");
				String value = dto.getAsString("country");
				if("".equals(value)){
					continue;
				}
				dto.put("value", value);
				dto.put("text", dto.getAsString("country"));
				Dto d = countryMap.get(value);
				if (G4Utils.isEmpty(d)) {
					countryMap.put(value, dto);
				}
			}
			for (String key : countryMap.keySet()) {
				countryList.add(countryMap.get(key));
			}
			jsonString = JsonHelper.encodeObject2Json(countryList);
		} else if ("color".equals(flag)) {
			List colorList = new ArrayList();
			Map<String, Dto> colorMap = new HashMap<String, Dto>();
			for (Object obj : list) {
				Dto dto = (Dto) obj;

//				String value = dto.getAsString("prod_ord_seq") + "_"
//						+ dto.getAsString("color");
				String value = dto.getAsString("color");
				if("".equals(value)){
					continue;
				}
				dto.put("value", value);
				dto.put("text", dto.getAsString("color"));
				Dto d = colorMap.get(value);
				if (G4Utils.isEmpty(d)) {
					colorMap.put(value, dto);
				}
			}
			for (String key : colorMap.keySet()) {
				colorList.add(colorMap.get(key));
			}
			jsonString = JsonHelper.encodeObject2Json(colorList);
		} else if ("cloth_size".equals(flag)) {
			List clothSizeList = new ArrayList();
			Map<String, Dto> clothSizeMap = new HashMap<String, Dto>();
			for (Object obj : list) {
				Dto dto = (Dto) obj;

				String in_length = dto.getAsString("in_length");
				String text = dto.getAsString("waist")
						+ ("".equals(in_length) ? "" : ("," + in_length));
//				String value = dto.getAsString("prod_ord_seq") + "_"
//						+ dto.getAsString("cloth_size_seq_no");
				String value = dto.getAsString("cloth_size_seq_no");
				if("".equals(value)){
					continue;
				}
				dto.put("value", value);
				dto.put("text", text);
				Dto d = clothSizeMap.get(value);
				if (G4Utils.isEmpty(d)) {
					clothSizeMap.put(value, dto);
				}
			}
			for (String key : clothSizeMap.keySet()) {
				clothSizeList.add(clothSizeMap.get(key));
			}

			jsonString = JsonHelper.encodeObject2Json(clothSizeList);
		}

		outDto.put("jsonString", jsonString);

		return outDto;
	}

	/**
	 * 导出 生产计划通知单
	 */
	public Dto prodPlanExceport(Dto pDto) throws ApplicationException {
		try{
			// 查询数据封装到dataDto，创建wbook
			// createExcel产生excle
			// 关闭wbook流
			HttpServletResponse response = (HttpServletResponse) pDto
					.get("response");
			pDto.remove("response");
			pDto.remove("state");
			Dto dataDto = (Dto)g4Dao.queryForObject("prodOrdExceport", pDto);
			pDto.put("state", "0");
			List[] prodOrdInfo = prodInsInfoExceport(pDto);
			dataDto.put("orderInfo", prodOrdInfo[0]);
			dataDto.put("prodInsInfo", prodOrdInfo[1]);
			dataDto.put("prodOrdInfo", prodOrdInfo);
			OutputStream os = response.getOutputStream();
			WritableWorkbook wbook = Workbook.createWorkbook(os);
			wbook = createExcel(wbook, dataDto);
			String fs = new String((dataDto.getAsString("ord_seq_no")+"生产通知单").getBytes("UTF8"), "iso8859-1");
	
			response.setHeader("Content-disposition", "attachment;filename=" + fs
					+ ".xls");
			response.setContentType("application/vnd.ms-excel");
			wbook.write();
			wbook.close();
			os.close();
		}catch(Exception e){
			ApplicationException ae = new ApplicationException();
			ae.initCause(e);
			throw ae;
		}
		return null;
	}
	/**
	 * 删除生产通知单的所有信息：基础信息和产品动态流程信息
	 */
	public Dto deleteAllProdBasDef(Dto inDto) throws ApplicationException {
		
		return null;
	}

	/**
	 * 生产计划通知单Excel
	 * 
	 * @param wbook
	 * @return
	 */
	public WritableWorkbook createExcel(WritableWorkbook wbook, Dto dataDto)
			throws Exception {
		// 计划通知单模版信息
		// 按照模版装填数据
		// 返回完成excel
		Dto modelDto = new BaseDto();
		Dto prodInfo = new BaseDto();
		Dto prodPlan = new BaseDto();
		Dto planCheck = new BaseDto();
		Dto remarkDto = new BaseDto();
		Dto prodCost = new BaseDto();
		Dto prodBasInfo = new BaseDto();
		// 订单基本信息
		prodInfo.put("baseX", 0);
		prodInfo.put("baseY", 2);
		prodInfo.put("title", "订单基本信息");
		prodInfo.put("prod_ord_seq", "通知单编号");
		prodInfo.put("contract_id", "合同号");
		prodInfo.put("batch", "分单号(批次)");
		prodInfo.put("ord_seq_no", "订单号PO");
		prodInfo.put("cust_id", "客户/品牌");
		prodInfo.put("style_no", "款号");
		prodInfo.put("article", "品名");
		prodInfo.put("classify", "产品分类");
		prodInfo.put("wash", "洗水工艺");
		prodInfo.put("material", "面料");
		prodInfo.put("percent_j", "面料缩率J");
		prodInfo.put("percent_w", "面料缩率W");
		prodInfo.put("add_proportion", "加裁比例%");
//		prodInfo.put("delivery_date", "订单交货日期");
		prodInfo.put("ribbon_color", "丝带色号");
		prodInfo.put("notity_date", "通知日期");
		prodInfo.put("order_num", "总数");
		prodInfo.put("more_clause", "溢装");
		prodInfo.put("less_clause", "短装");
		prodInfo.put("sxyxsh", "水洗允许损耗");
		prodInfo.put("fzyxsh", "缝制允许损耗");
		prodInfo.put("mlfl", "面料分类");
		prodInfo.put("ksfl", "款式分类");
		prodInfo.put("sxff", "水洗方法");
		
		// 生产进度计划
		prodPlan.put("baseX", 8);
		prodPlan.put("baseY", 2);
		prodPlan.put("title", "生产进度计划");
		prodPlan.put("sew_fac", "缝制工厂");
		prodPlan.put("bach_fac", "水洗工厂");
		prodPlan.put("pack_fac", "后整工厂");
		prodPlan.put("sew_start_date", "缝制起始日期");
		prodPlan.put("sew_delivery_date", "缝制交货日");
		prodPlan.put("bach_delivery_date", "水洗交货日");
		prodPlan.put("pack_delivery_date", "后整交货日");
		// 审核记录
		planCheck.put("baseX", 8);
		planCheck.put("baseY", 7);
		planCheck.put("title", "审核记录");
		planCheck.put("plan_check", "计划审批");
		planCheck.put("purchase_check", "采购审批");
		planCheck.put("tech_check", "技术审批");
		planCheck.put("trade_check", "贸易审批");
		planCheck.put("plan_check_date", "计划审批日期");
		planCheck.put("purchase_check_date", "采购审批日期");
		planCheck.put("tech_check_date", "技术审批日期");
		planCheck.put("trade_check_date", "贸易审批日期");
		// 重要提示
		remarkDto.put("baseX", 15);
		remarkDto.put("baseY", 2);
		remarkDto.put("title", "重要提示（可多项提示）");
		remarkDto.put("wash_stream", "大货洗水流程");
		// 材料成本预计
		prodCost.put("baseX", 15);
		prodCost.put("baseY", 7);
		prodCost.put("title", "材料成本预计");
		prodCost.put("total_cost", "采购总金额");
		prodCost.put("singleton_cost", "单件原料成本");
		prodCost.put("percent", "溢短装%");
		prodCost.put("wash_process", "洗水工艺");
		prodCost.put("singleton_money", "单价");
		// 订单数量明细
		prodBasInfo.put("baseX", 0);
		prodBasInfo.put("baseY", 15);
		prodBasInfo.put("title", new String[] { "订单数量数量明细", "指令数量数量明细" });
		prodBasInfo.put("numCheck", "总数验证");
		prodBasInfo.put("numValid", "总数准确");
		prodBasInfo.put("realCutParent","加裁比例%");
		prodBasInfo.put("country", "国家");
		prodBasInfo.put("color", "颜色");
		prodBasInfo.put("in_length", "内长");
		prodBasInfo.put("total", "合计");
		prodBasInfo.put("subtotal", "小计");
		// 生产计划通知单
		modelDto.put("baseX", 0);
		modelDto.put("baseY", 0);
		modelDto.put("title", dataDto.getAsString("ord_seq_no")+"生产计划通知单");
		modelDto.put("area_no", "区域");
		modelDto.put("fob_deal_date", "FOB交货期");
		modelDto.put("check_prod_date", "尾查期");
		modelDto.put("transportation_way", "出运方式");
		modelDto.put("opr_merchandiser", "跟单员");
		modelDto.put("opr_date", "制单日期");
		modelDto.put("opr_name", "制单员");
		// ~ 模版所需字段结束
		WritableSheet wsheet = wbook.createSheet(dataDto.getAsString("ord_seq_no")+"生产通知单", 0);
		//--制定列的宽度
		wsheet.setColumnView(2, 15);
		wsheet.setColumnView(14, 15);
		// 格式
		WritableFont font = new WritableFont(WritableFont.TIMES,22,WritableFont.BOLD,false);
		WritableCellFormat titleF = new WritableCellFormat(font);
		titleF.setBorder(Border.ALL, jxl.format.BorderLineStyle.THIN);
		titleF.setAlignment(Alignment.CENTRE);
		
		WritableFont subTitleFont = new WritableFont(WritableFont.TIMES,12,WritableFont.BOLD,false);
		WritableCellFormat subTitleF = new WritableCellFormat(subTitleFont);
		subTitleF.setBorder(Border.ALL, BorderLineStyle.THIN);
		subTitleF.setAlignment(Alignment.CENTRE);
		
		WritableCellFormat beanF = new WritableCellFormat();
		beanF.setBorder(Border.ALL, BorderLineStyle.THIN);
		beanF.setAlignment(Alignment.CENTRE);
		WritableCellFormat infoF = new WritableCellFormat();
		infoF.setAlignment(Alignment.CENTRE);
		infoF.setWrap(true);
		infoF.setVerticalAlignment(VerticalAlignment.CENTRE);
		infoF.setBorder(Border.ALL, BorderLineStyle.THIN);
		
		// 组合表单
		int baseX, baseY;
		baseX = modelDto.getAsInteger("baseX");
		baseY = modelDto.getAsInteger("baseY");
		//--融合单元格
		wsheet.mergeCells(baseX, baseY, baseX + 19, baseY);
		wsheet.mergeCells(baseX+3, baseY+1, baseX+4, baseY+1);
		wsheet.mergeCells(baseX+5, baseY+1,baseX+6 , baseY+1);
		wsheet.mergeCells(baseX+7, baseY+1,baseX+8 , baseY+1);
		wsheet.mergeCells(baseX+10, baseY+1,baseX+11 , baseY+1);
		wsheet.mergeCells(baseX+12, baseY+1, baseX+13, baseY+1);
		wsheet.mergeCells(baseX+18, baseY+1,baseX+19, baseY+1);
		//--生产通知单表头信息
		Label label = new Label(baseX, baseY,  modelDto.getAsString("title"),titleF);
		wsheet.addCell(label);
		label = new Label(baseX,baseY+1,modelDto.getAsString("area_no"),beanF);
		Label infoLabel = new Label(baseX + 1, baseY + 1, dataDto.getAsString("area_no"), infoF);
		wsheet.addCell(label);
		wsheet.addCell(infoLabel);
		label = new Label(baseX+2,baseY+1,modelDto.getAsString("fob_deal_date"),beanF);
		infoLabel = new Label(baseX+3,baseY+1,dataDto.getAsString("fob_deal_date"),infoF);
		wsheet.addCell(label);
		wsheet.addCell(infoLabel);
		label = new Label(baseX+5,baseY+1,modelDto.getAsString("check_prod_date"),beanF);
		infoLabel = new Label(baseX+7,baseY+1,dataDto.getAsString("check_prod_date"),infoF);
		wsheet.addCell(label);
		wsheet.addCell(infoLabel);
		label = new Label(baseX+9,baseY+1,modelDto.getAsString("transportation_way"),beanF);
		infoLabel = new Label(baseX+10,baseY+1,dataDto.getAsString("transportation_way"),infoF);
		wsheet.addCell(label);
		wsheet.addCell(infoLabel);
		//--出运方式
		label = new Label(baseX+9,baseY+1,modelDto.getAsString("transportation_way"),beanF);
		infoLabel = new Label(baseX+10,baseY+1,dataDto.getAsString("transportation_way"),infoF);
		wsheet.addCell(label);
		wsheet.addCell(infoLabel);								
		label = new Label(baseX+12,baseY+1,modelDto.getAsString("opr_merchandiser"),beanF);
		infoLabel = new Label(baseX+14,baseY+1,dataDto.getAsString("opr_merchandiser"),infoF);
		wsheet.addCell(label);
		wsheet.addCell(infoLabel);
		label = new Label(baseX+15,baseY+1,modelDto.getAsString("opr_name"),beanF);
		infoLabel = new Label(baseX+16,baseY+1,dataDto.getAsString("opr_name"),infoF);
		wsheet.addCell(label);
		wsheet.addCell(infoLabel);
		label = new Label(baseX+17,baseY+1,modelDto.getAsString("opr_date"),beanF);
		infoLabel = new Label(baseX+18,baseY+1,dataDto.getAsString("opr_date"),infoF);
		wsheet.addCell(label);
		wsheet.addCell(infoLabel);
		// 订单基本信息
		baseX = prodInfo.getAsInteger("baseX");
		baseY = prodInfo.getAsInteger("baseY");
		wsheet.mergeCells(baseX, baseY, baseX + 7, baseY);
		label = new Label(baseX, baseY, prodInfo.getAsString("title"),
				subTitleF);
		wsheet.addCell(label);
		String[] prodInfoColumns = { "prod_ord_seq", "contract_id", "batch",
				"ord_seq_no", "cust_id", "style_no", "article", "classify",
				"wash", "sxyxsh","ksfl","sxff", "material","percent_j", "percent_w", "add_proportion",
				"ribbon_color", "notity_date", "order_num", "more_clause",
				"less_clause","fzyxsh","mlfl"};
		int length = prodInfoColumns.length;
		int halfLength = length / 2;
		halfLength = length%2==1 ? halfLength+1 : halfLength;
		for (int i = 0; i < halfLength; i++) {
			wsheet.mergeCells(baseX, baseY + 1 + i, baseX + 1, baseY + 1 + i);
			wsheet.mergeCells(baseX + 2, baseY + 1 + i, baseX + 3, baseY + 1
					+ i);
			wsheet.mergeCells(baseX + 4, baseY + 1 + i, baseX + 5, baseY + 1
					+ i);
			wsheet.mergeCells(baseX + 6, baseY + 1 + i, baseX + 7, baseY + 1
					+ i);
			label = new Label(baseX, baseY + i + 1, prodInfo
					.getAsString(prodInfoColumns[i]), beanF);
			infoLabel = new Label(baseX + 2, baseY + i + 1, dataDto
					.getAsString(prodInfoColumns[i]), infoF);
			wsheet.addCell(label);
			wsheet.addCell(infoLabel);
			if((i+halfLength) < length){
    			label = new Label(baseX + 4, baseY + i + 1, prodInfo
    					.getAsString(prodInfoColumns[i + halfLength]), beanF);
    			infoLabel = new Label(baseX + 6, baseY + i + 1, dataDto
    					.getAsString(prodInfoColumns[i + halfLength]), infoF);
    			wsheet.addCell(label);
    			wsheet.addCell(infoLabel);
			}
		}
		// 生产进度计划
		baseX = prodPlan.getAsInteger("baseX");
		baseY = prodPlan.getAsInteger("baseY");
		wsheet.mergeCells(baseX, baseY, baseX + 6, baseY);
		label = new Label(baseX, baseY, prodPlan.getAsString("title"),subTitleF);
		wsheet.addCell(label);
		String[] prodPlanCloumns = { "bach_fac", "pack_fac",
				"bach_delivery_date", "pack_delivery_date" };
		//添加缝制工厂信息
		String[] sew_facCloumns = {"sew_fac","sew_start_date","sew_delivery_date"};
		wsheet.mergeCells(baseX, baseY+1, baseX+1, baseY+2);
		wsheet.mergeCells(baseX+2, baseY+1, baseX+3, baseY+2);
		wsheet.mergeCells(baseX+4, baseY+1, baseX+5, baseY+1);
		wsheet.mergeCells(baseX+4, baseY+2, baseX+5, baseY+2);
		//--缝制工厂
		label = new Label(baseX,baseY+1,prodPlan.getAsString(sew_facCloumns[0]),beanF);
		infoLabel = new Label(baseX+2,baseY+1,dataDto.getAsString(sew_facCloumns[0]),infoF);
		wsheet.addCell(label);
		wsheet.addCell(infoLabel);
		//--缝制起始日期
		label = new Label(baseX+4,baseY+1,prodPlan.getAsString(sew_facCloumns[1]),beanF);
		infoLabel = new Label(baseX+6,baseY+1,dataDto.getAsString(sew_facCloumns[1])+"",infoF);
		wsheet.addCell(label);
		wsheet.addCell(infoLabel);
		//--缝制交货日
		label = new Label(baseX+4,baseY+2,prodPlan.getAsString(sew_facCloumns[2]),beanF);
		infoLabel = new Label(baseX+6,baseY+2,dataDto.getAsString(sew_facCloumns[2]),infoF);
		wsheet.addCell(label);
		wsheet.addCell(infoLabel);
		
		//添加水洗工厂和后整工厂信息 
		halfLength = prodPlanCloumns.length / 2;
		for (int i = 0; i < halfLength; i++) {
			wsheet.mergeCells(baseX, baseY + 3 + i, baseX + 1, baseY + 3 + i);
			wsheet.mergeCells(baseX + 2, baseY + 3 + i, baseX + 3, baseY + 3
					+ i);
			wsheet.mergeCells(baseX + 4, baseY + 3 + i, baseX + 5, baseY + 3
					+ i);
			label = new Label(baseX, baseY + i + 3, prodPlan
					.getAsString(prodPlanCloumns[i]), beanF);
			infoLabel = new Label(baseX + 2, baseY + i + 3, dataDto
					.getAsString(prodPlanCloumns[i]), infoF);
			wsheet.addCell(label);
			wsheet.addCell(infoLabel);
			label = new Label(baseX + 4, baseY + i + 3, prodPlan
					.getAsString(prodPlanCloumns[i + halfLength]), beanF);
			infoLabel = new Label(baseX + 6, baseY + i + 3, dataDto
					.getAsString(prodPlanCloumns[i + halfLength]), infoF);
			wsheet.addCell(label);
			wsheet.addCell(infoLabel);
		}

		// 审核记录
		baseX = planCheck.getAsInteger("baseX");
		baseY = planCheck.getAsInteger("baseY");
		wsheet.mergeCells(baseX, baseY, baseX + 6, baseY);
		label = new Label(baseX, baseY, planCheck.getAsString("title"),
				subTitleF);
		wsheet.addCell(label);
		String[] planCheckColumns = { "plan_check", "purchase_check",
				"tech_check", "trade_check", "plan_check_date",
				"purchase_check_date", "tech_check_date", "trade_check_date" };
		halfLength = planCheckColumns.length / 2;
		for (int i = 0; i < halfLength; i++) {
			wsheet.mergeCells(baseX, baseY + i + 1, baseX + 1, baseY + i + 1);
			wsheet.mergeCells(baseX + 2, baseY + i + 1, baseX + 3, baseY + i
					+ 1);
			wsheet.mergeCells(baseX + 4, baseY + i + 1, baseX + 5, baseY + i
					+ 1);
			label = new Label(baseX, baseY + i + 1, planCheck
					.getAsString(planCheckColumns[i]), beanF);
			infoLabel = new Label(baseX + 2, baseY + i + 1, dataDto
					.getAsString(planCheckColumns[i]), infoF);
			wsheet.addCell(label);
			wsheet.addCell(infoLabel);
			label = new Label(baseX + 4, baseY + i + 1, planCheck
					.getAsString(planCheckColumns[i + halfLength]), beanF);
			infoLabel = new Label(baseX + 6, baseY + i + 1, dataDto
					.getAsString(planCheckColumns[i + halfLength]), infoF);
			wsheet.addCell(label);
			wsheet.addCell(infoLabel);
		}
		// 重要提示,大货洗水流程
		baseX = remarkDto.getAsInteger("baseX");
		baseY = remarkDto.getAsInteger("baseY");
		//--重要提示
		
		wsheet.mergeCells(baseX, baseY, baseX + 4, baseY);
		wsheet.mergeCells(baseX, baseY+1, baseX+4, baseY+8);
		label = new Label(baseX, baseY, remarkDto.getAsString("title"),
				subTitleF);
		wsheet.addCell(label);
		String remarks = dataDto.getAsString("remark");
		remarks = remarks.replace(";", "\n");
		infoLabel = new Label(baseX,baseY+1,remarks,infoF);
		wsheet.addCell(infoLabel);
//		String[] remarks = dataDto.getAsString("remark").split(";");
//		int remarksSize = remarks.length;
//		for(int i=0;i<8;i++){
//			wsheet.mergeCells(baseX, baseY+1+i, baseX+4, baseY+1+i);
//			infoLabel = new Label(baseX,baseY+i+1,i>=remarksSize?"":remarks[i],infoF);
//			wsheet.addCell(infoLabel);
//		}
		//--大货洗水流程
		wsheet.mergeCells(baseX, baseY+9, baseX+1, baseY+9);
		wsheet.mergeCells(baseX+2, baseY+9, baseX+4, baseY+9);
		label = new Label(baseX,baseY+9,remarkDto.getAsString("wash_stream"),beanF);
		infoLabel = new Label(baseX+2,baseY+9,dataDto.getAsString("wash_stream"),infoF);
		wsheet.addCell(label);
		wsheet.addCell(infoLabel);

		// 订单数量数量明细
		// 加入表头等信息
		int prodOrdInfoLen = ((List[]) dataDto.get("prodOrdInfo")).length;
		int rolCount = 0;
		long totalNum = 0;
		long ordNumSum = 0;
		long insNumSum = 0;
		//循环添加订单数和指令数
		for (int g = 0; g < prodOrdInfoLen; g++) {
			totalNum = 0;
			List prodOrdInfo = ((List[]) dataDto.get("prodOrdInfo"))[g];
			String nums = "";
			String[] columns = new String[0];
			if(prodOrdInfo.size()>0){
				nums = ((BaseDto) prodOrdInfo.get(0)).getAsString("num");
				columns  = nums.split(",");
			}
			Long[] subtotal = new Long[columns.length];
			Long[] total = new Long[prodOrdInfo.size()];

			baseX = prodBasInfo.getAsInteger("baseX");
			baseY = prodBasInfo.getAsInteger("baseY") + rolCount + g * 3;
			rolCount += prodOrdInfo.size();
			wsheet.mergeCells(baseX, baseY, baseX + 16, baseY);
			wsheet.mergeCells(baseX + 17, baseY, baseX + 18, baseY);
			label = new Label(baseX, baseY, ((String[]) prodBasInfo
					.get("title"))[g], subTitleF);
			wsheet.addCell(label);
			label = new Label(baseX + 17, baseY, prodBasInfo
					.getAsString("numCheck"), subTitleF);
			wsheet.addCell(label);
			label = new Label(baseX + 19, baseY, prodBasInfo
					.getAsString("numValid"), subTitleF);
			wsheet.addCell(label);
			label = new Label(baseX, baseY + 1, prodBasInfo
					.getAsString("country"), subTitleF);
			wsheet.addCell(label);
			label = new Label(baseX + 1, baseY + 1, prodBasInfo
					.getAsString("color"), subTitleF);
			wsheet.addCell(label);
			label = new Label(baseX + 2, baseY + 1, prodBasInfo
					.getAsString("in_length"), subTitleF);
			wsheet.addCell(label);
			label = new Label(baseX + 19, baseY + 1, prodBasInfo
					.getAsString("total"), subTitleF);
			wsheet.addCell(label);
//			wsheet.mergeCells(baseX, baseY + 6, baseX + 2, baseY + 6);

			int colLength = columns.length;
			for (int i = 0; i < colLength; i++) {
				label = new Label(baseX + 3 + i, baseY + 1, columns[i],
						subTitleF);
				wsheet.addCell(label);
			}
			// 表格数据
			int rolNum = prodOrdInfo.size();
			for (int i = 0; i < rolNum; i++) {
				Dto dto = (BaseDto) prodOrdInfo.get(i);
				String ordNum = dto.getAsString("ord_num");
				String[] colNums = ordNum.split(",");

				label = new Label(baseX, baseY + 2 + i, dto
						.getAsString("country"), infoF);
				wsheet.addCell(label);
				label = new Label(baseX + 1, baseY + 2 + i, dto
						.getAsString("color"), infoF);
				wsheet.addCell(label);
				label = new Label(baseX + 2, baseY + 2 + i, dto
						.getAsString("in_length"), infoF);
				wsheet.addCell(label);
				//统计小计，合计
				for (int k = 0; k < colLength; k++) {
					label = new Label(baseX + 3 + k, baseY + 2 + i, colNums[k],
							infoF);
					wsheet.addCell(label);
					Long l = string2Long(colNums[k].trim());
					if (subtotal[k] == null) {
						subtotal[k] = l;
					} else {
						subtotal[k] = subtotal[k] + l;
					}
					if (total[i] == null) {
						total[i] = string2Long(colNums[k].trim());
					} else {
						total[i] += string2Long(colNums[k].trim());
					}
				}

			}
			wsheet.mergeCells(baseX, baseY+rolNum+2, baseX+2 , baseY+rolNum+2);
			label = new Label(baseX, baseY + 2 + rolNum, prodBasInfo
					.getAsString("subtotal"), subTitleF);
			wsheet.addCell(label);
			for (int i = 0; i < colLength; i++) {
				label = new Label(baseX + 3 + i, baseY + rolNum + 2,
						subtotal[i].toString(), infoF);
				wsheet.addCell(label);
			}
			for (int i = 0; i < rolNum; i++) {
				label = new Label(baseX + 19, baseY + 2 + i, total[i]
						.toString(), infoF);
				wsheet.addCell(label);
				totalNum+=total[i];
			}
			label = new Label(baseX+19,baseY+2+rolNum,totalNum+"",infoF);
			wsheet.addCell(label);
			
			//保存合计数量
			if(g==0){
				ordNumSum = totalNum;
			}else if(g==1){
				insNumSum = totalNum;
			}
			//g==0：true 填充的是订单数的信息 ,false 填充的是指令数的信息
			if(g==0 && totalNum!=dataDto.getAsLong("order_num")){
				label = new Label(baseX+19,baseY,"总数错误",subTitleF);
				wsheet.addCell(label);
			}else if(g==1){
				label = new Label(baseX+17,baseY,"加裁比例",subTitleF);
				wsheet.addCell(label);
				double realCutParent = DataUtil.doubleDiv(insNumSum-ordNumSum, ordNumSum,2);
				label = new Label(baseX+19,baseY,realCutParent+"%",subTitleF);
				wsheet.addCell(label);
			}
		}
		// ~
		return wbook;
	}

    /**
     * 保存我的订单
     */
    public Dto saveMyOrder(Dto pDto) throws ApplicationException {
        String myorder = pDto.getAsString("myorder");   //保存的订单
        String myorderInOrder = pDto.getAsString("myorderInOrder"); //删除的生产通知单
        String myprodord = pDto.getAsString("myprodord");   //保存的生产通知单
        String account = pDto.getAsString("account");   //用户
        
        //删除的条件
        Dto delDto = new BaseDto();
        delDto.put("account", account);
        String delOrderStr ="";
        String[] delOrders = myorderInOrder.split(",");
        int ordLength = delOrders.length;
        for(int i=0;i<ordLength;i++){
            delOrderStr = delOrderStr+"'"+delOrders[i]+"',";
        }
        if(delOrderStr.length()>1){
            delOrderStr = delOrderStr.substring(0,delOrderStr.length()-1);
        }
        delDto.put("prodord", delOrderStr);
        
        //添加的条件
        List<Dto> addList = new ArrayList<Dto>();
        String[] myorders = myorder.split(",");
        String[] myprodords = myprodord.split(",");
        int ordersLength = myorders.length;
        for(int i=0;i<ordersLength;i++){
            Dto addDto = new BaseDto();
            //过滤不正确数据
            if(myorders[i]==null ||"".equals(myorders[i]) || myprodords[i]==null||"".equals(myprodords[i])){
                continue;
            }
            addDto.put("ord_seq_no", myorders[i]);
            addDto.put("prod_ord_seq", myprodords[i]);
            addDto.put("account", account);
            addList.add(addDto);
        }
        
        //删除
        g4Dao.delete("deleteBind4Myorder", delDto);
        //增加
        g4Dao.batchInsertBaseDto("insert4Order_Operator", addList);
        return null;
    }

    /**
	 * 生产通知单导出数据 查询
	 */
	public List[] prodInsInfoExceport(Dto pDto) throws ApplicationException {
		List prodList = new ArrayList();
		List list = g4Dao.queryForList("queryProdBasInfo4OrdNum", pDto);// 具体产品指令数信息
		List prodInsList = g4Dao.queryForList("queryProdBasInfoExceport", pDto);// 具体产品订单数量信息
		List rowList1 = g4Dao.queryForList("queryProdBasInfo4Row", pDto);// 订单数量信息
		List rowList2 = g4Dao.queryForList("queryProdBasInfo4Row", pDto);// 指令数量信息

		List[] outList = { list, prodInsList };
		List[] rowLists = { rowList1, rowList2 };

		Dto qDto = new BaseDto();
		qDto.put("id", pDto.getAsString("prod_ord_seq"));
		qDto.put("state", "0");
		Dto columnDto = (Dto) g4Dao.queryForObject("queryProdSubInfo", pDto);// 列头信息
		String columnStr = columnDto.getAsString("value");
		String[] columns = columnStr.split(",");
		for (int g = 0; g < rowLists.length; g++) {
			List dataList = outList[g];
			List rowList = rowLists[g];
			for (int i = 0; i < rowList.size(); i++) {
				Dto rowDto = (Dto) rowList.get(i);
				String color = rowDto.getAsString("color");
				String in_length = rowDto.getAsString("in_length");
				String country = rowDto.getAsString("country");

				rowDto.put("num", columnStr);

				for (String waist : columns) {
					Boolean flag = false;
					for (Object aList : dataList) {
						Dto dto = (Dto) aList;
						if (dto.getAsString("color").equals(color)
								&& dto.getAsString("in_length").equals(
										in_length)
								&& dto.getAsString("country").equals(country)
								&& dto.getAsString("waist").equals(waist)) {
							if ("".equals(rowDto.getAsString("ord_num"))) {
								rowDto.put("ord_num", dto
										.getAsString("ord_num")
										+ " ,");
							} else {
								rowDto.put("ord_num", rowDto
										.getAsString("ord_num")
										+ dto.getAsString("ord_num") + " ,");
							}

							flag = true;
							break;
						}
					}

					if (!flag) {
						rowDto.put("ord_num", rowDto.getAsString("ord_num")
								+ " ,");
					}

				}

			}
		}
		return rowLists;
	}

	 /**
	* 通知单信息的删除日志
	* 记录手动删除订单和导入通知单失败时的日志记录
	*/
	public void logProdDelete(Dto dto){
		g4Dao.insert("logProdDelete",dto);
	}
	/**
	 * 将String转Long方法
	 * 
	 * @param num
	 * @return
	 */
	public long string2Long(String num) {
		if (num == null || "".equals(num)) {
			return 0l;
		}
		return Long.parseLong(num);
	}

	public Dto updateNumeditRemark(Dto inDto) throws ApplicationException {
		g4Dao.update("updateNumeditRemark",inDto);
		return null;
	}
}
