package com.cnnct.rfid.service.impl;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import com.cnnct.util.G4Utils;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.cnnct.common.ApplicationException;
import com.cnnct.rfid.service.EpcProdInfoService;

/**
 * *********************************************
 * 创建日期: 2013-05-09
 * 创建作者：lingm
 * 功能： 产品标签管理
 * 最后修改时间：
 * 修改记录：
 * ***********************************************
 */
public class EpcProdInfoServiceImpl extends BaseServiceImpl implements EpcProdInfoService {

	/**
	 * 查询RFID产品信息 带分页
	 *
	 * @param pDto
	 * @return
	 */
	public Dto queryProdList(Dto iDto) {
		Dto outDto = new BaseDto();
		List list = g4Dao.queryForList("queryProdBasInfo", iDto);
		Integer totalCount = (Integer) g4Dao.queryForObject("queryProdBasInfoForPageCount", iDto);
		String jsonStrList = JsonHelper.encodeObject2Json(list);
		outDto.put("jsonStrList", JsonHelper.encodeJson2PageJson(jsonStrList, totalCount));
		return outDto;
	}

	public Dto queryProdBasInfo(Dto iDto) {
		Dto outDto = new BaseDto();
		List list = g4Dao.queryForPage("queryProdBasInfo", iDto);
		Integer totalCount = (Integer) g4Dao.queryForObject("queryProdBasInfoForPageCount", iDto);
		String jsonStrList = JsonHelper.encodeObject2Json(list);
		outDto.put("jsonStrList", JsonHelper.encodeJson2PageJson(jsonStrList, totalCount));
		return outDto;
	}

	public Dto queryProdBasDetailInfo(Dto iDto) {
		Dto outDto = new BaseDto();
		List list = g4Dao.queryForPage("queryProdBasDeiltaInfo", iDto);
		Integer totalCount = (Integer) g4Dao.queryForObject("queryProdDetailInfoForPageCount", iDto);
		String jsonStrList = JsonHelper.encodeObject2Json(list);
		outDto.put("jsonStrList", JsonHelper.encodeJson2PageJson(jsonStrList, totalCount));
		return outDto;
	}

	public Dto queryProdBasBaseInfo(Dto iDto) {
		Dto outDto = new BaseDto();
		List list = g4Dao.queryForPage("queryProdAndEpcInfo", iDto);
		Integer totalCount = (Integer) g4Dao.queryForObject("queryProdAndEpcCount", iDto);
		String jsonStrList = JsonHelper.encodeObject2Json(list);
		outDto.put("jsonStrList", JsonHelper.encodeJson2PageJson(jsonStrList, totalCount));
		return outDto;
	}

	public Dto queryProdBaseInfo(Dto iDto) {
		Dto outDto = new BaseDto();
		outDto = (Dto) g4Dao.queryForObject("queryProdBasBaseInfo", iDto);
		return outDto;
	}

	/**
	 * RFID 电子标签绑定
	 *
	 * @param pDto
	 * @return
	 */
	public synchronized Dto saveProdBasInfo(Dto iDto) throws ApplicationException {
		try {
			Dto outDto = new BaseDto();

			//查询产品的一些数量
			Dto numDto = (Dto) g4Dao.queryForObject("queryNumInfoFromProdBasInfo", iDto);
			//当前裁剪数量
			Integer cut_num = numDto.getAsInteger("cut_num")+1;
			//查询实际数量
			Integer real_num = numDto.getAsInteger("real_num");
			iDto.put("cut_num", cut_num);//用于更新产品中裁剪数量

			//生成当前产品序号 产品序号+当前产品流水号(已绑定的数量)
			String epc = numDto.getAsString("product_id")+String.format("%05d",cut_num);
			iDto.put("epc",epc);
			outDto.put("epc",epc);

			//查询当前tid码是否被使用
			Integer no = (Integer) g4Dao.queryForObject("queryEpcProdInfoCountByTid", iDto);
			if (no > 0) {
				outDto.put("success", new Boolean(false));
				outDto.put("msg", "电子标签绑定失败,该标签已绑定!");
				return outDto;
			} else {
				if (cut_num > real_num) {
					outDto.put("msg", "电子标签绑定成功,当前裁剪数量已超出!");
				} else {
					outDto.put("msg", "电子标签绑定成功!");
				}
				iDto.put("state", 0);
				//保存绑定记录
				g4Dao.insert("insertEpcProdListInfo", iDto);
				//更新成品表中绑定数量
				g4Dao.update("updateProdCutNum", iDto);
				//更新标签表中状态为绑定
				g4Dao.update("updateEpcInfo", iDto);
				//插入标签流水表
				iDto.put("nature", "1");//数量流程为裁剪绑定
				iDto.put("flag", "0");//0-设备记录 1-导入
				iDto.put("opr_time", G4Utils.getCurrentTime());
				g4Dao.insert("insertEpcDayListInfo", iDto);

				outDto.put("success", new Boolean(true));
			}

			return outDto;
		} catch (Exception e) {
			throw new ApplicationException(e.getMessage(), e);
		}
	}

	/**
	 * RFID电子标签解绑
	 *
	 * @param pDto
	 * @return
	 */
	public Dto updateProdEpcInfo(Dto pDto) {
		Dto outDto = new BaseDto();
		try {
			pDto.put("flow", "3");
			pDto.put("state", "1");
			g4Dao.update("removeEpcInfo", pDto);
			g4Dao.update("removeEpcFlowInfo", pDto);

			pDto.put("nature", "9");//数量流程解绑
			pDto.put("flag", "0");
			pDto.put("opr_time", G4Utils.getCurrentTime());
			g4Dao.insert("insertEpcDayListInfo", pDto);
			g4Dao.update("updateEpcInfo", pDto);
			outDto.put("success", true);
			outDto.put("msg", "解除电子标签绑定成功!");
				
		} catch (Exception e) {
			throw new ApplicationException(e.getMessage(), e);
		}
		return outDto;
	}

	public Dto queryProdDetailInfo(Dto pDto) {
		Dto outDto = new BaseDto();
		try {
			String showFlag = pDto.getAsString("showFlag");

			String click_cust_id = pDto.getAsString("click_cust_id");
			String belong_grp_id = pDto.getAsString("belong_grp_id");
			if(!"".equals(click_cust_id)){
				if(click_cust_id.startsWith("cust")){
					pDto.put("cust_id",click_cust_id.substring(4));
				}else if(click_cust_id.startsWith("ord")){
					pDto.put("ord_seq_no",click_cust_id.substring(3));
				}else{
					return outDto;
				}
			}else if(!"".equals(belong_grp_id)){
				if(belong_grp_id.startsWith("grps")){
					pDto.put("belong_grp_id",belong_grp_id.substring(4));
				}else if(belong_grp_id.startsWith("ord")){
					pDto.put("belong_grp_id","");//设为空
					pDto.put("ord_seq_no",belong_grp_id.substring(3,belong_grp_id.indexOf("_grps")));
				}else{
					return outDto;
				}
			}

			List list = new ArrayList();
			Integer pageCount = 0;
			if(showFlag.equals("1")){//按产品信息过滤查询

				String style_no = pDto.getAsString("style_no");
				String country = pDto.getAsString("country");
				String color = pDto.getAsString("color");
				String cloth_size = pDto.getAsString("cloth_size");
				style_no= style_no.substring(style_no.indexOf("_")+1);
				country= country.substring(country.indexOf("_")+1);
				color= color.substring(color.indexOf("_")+1);
				cloth_size= cloth_size.substring(cloth_size.indexOf("_")+1);
				pDto.put("style_no",style_no);
				pDto.put("country",country);
				pDto.put("color",color);
				pDto.put("cloth_size_seq_no",cloth_size);

				list = g4Dao.queryForPage("queryProdDetailInfo4Prod",pDto);
				pageCount = g4Dao.queryForPageCount("queryProdDetailInfo4Prod",pDto);
			}else if(showFlag.equals("2")){//按生产通知单过滤查询
				list = g4Dao.queryForPage("queryProdDetailInfo4ProdOrd",pDto);
				pageCount = g4Dao.queryForPageCount("queryProdDetailInfo4ProdOrd",pDto);
			}else if(showFlag.equals("3")){//按订单过滤查询
				list = g4Dao.queryForPage("queryProdDetailInfo4Ord",pDto);
				pageCount = g4Dao.queryForPageCount("queryProdDetailInfo4Ord",pDto);
			}

			for(Object obj:list){
				Dto dto = (Dto)obj;
				String nature = dto.getAsString("nature");

				if("3".equals(nature)){//缝制下线
					dto.put("remark","在路途(从"+dto.getAsString("belong_grp_name")+"发出)");
				}else if("5".equals(nature)){//水洗移交
					dto.put("remark","在路途(从"+dto.getAsString("belong_grp_name")+"发出)");
				}

				String belong_grp_name = dto.getAsString("belong_grp_name");

				if(nature.equals("1")){//裁剪扫描到记录
					dto.put("remark","缝制中");
				}else if(nature.equals("2")){//缝制领片
					dto.put("remark","缝制中");
				}else if(nature.equals("3")){//缝制下线
					dto.put("remark","缝制中");
					dto.put("belong_grp_name","在路途");
				}else if(nature.equals("4")){//水洗收
					dto.put("remark","水洗中");
				}else if(nature.equals("5")){//水洗交
					dto.put("belong_grp_name","在路途");
					dto.put("remark","水洗中");
				}else if(nature.equals("6")){//后整收
					dto.put("remark","后整中");
				}else if(nature.equals("7")){//交成品
					dto.put("remark","成品");
				}else if(nature.equals("8")){//交b品
					dto.put("remark","B品");
				}else if(nature.equals("9")){
					dto.put("remark", "标签解绑");
				}else if(nature.equals("10")){
					dto.put("remark", "收成品");
				}else if(nature.equals("11")){
					dto.put("remark", "收B品");
				}else if(nature.equals("12")){//中间领用
					dto.put("remark", "中间领用");
				}else if(nature.equals("13")){//送水洗
					dto.put("remark", "送水洗");
				}

			}

			String jsonString = JsonHelper.encodeList2PageJson(list,pageCount,"");
			outDto.put("jsonString",jsonString);

		} catch (Exception e) {
			throw new ApplicationException(e.getMessage(), e);
		}
		return outDto;
	}
	public Dto queryProdDetailInfoByProdOrd(Dto pDto) {
		Dto outDto = new BaseDto();
		try {
			List list = g4Dao.queryForList("queryProdDetailInfo4Prod",pDto);

			//1.获取该生产通知单附加信息
			Dto prodSubInfoDto = (Dto)g4Dao.queryForObject("queryProdSubInfo",pDto);

			Dto columnKeyValue = new BaseDto();
			String[] columns = prodSubInfoDto.getAsString("value").split(",");
			for(int i =0;i<columns.length;i++){
				columnKeyValue.put(columns[i],(i+1));
			}

			List<Dto> rowList = new ArrayList();

			Dto sumDto = new BaseDto();

			//2.将行记录转化成列记录
			for(Object obj:list){
				Dto detailDto = (Dto)obj;
				Boolean eqFlag = false;
				for(Dto rowDto:rowList){
					//如果行信息中有对应的信息.设置行中其他腰围的短缺数量
					if(detailDto.getAsString("nature").equals(rowDto.getAsString("nature"))
							&&detailDto.getAsString("color").equals(rowDto.getAsString("color"))
							&&detailDto.getAsString("country").equals(rowDto.getAsString("country"))
							&&detailDto.getAsString("in_length").equals(rowDto.getAsString("in_length"))
							&&detailDto.getAsString("belong_grp").equals(rowDto.getAsString("belong_grp"))){
						eqFlag = true;
						String waist = detailDto.getAsString("waist");

						rowDto.put("waist"+columnKeyValue.getAsString(waist),detailDto.getAsString("amount"));

						sumDto.put("waist"+columnKeyValue.getAsString(waist),0);
					}
				}

				if(!eqFlag){//当前信息还没有对应的行信息时,新建一行
					//设置key名称为 waist+腰围 值为当前的腰围的短缺数
					String waist = detailDto.getAsString("waist");

					detailDto.put("waist"+columnKeyValue.getAsString(waist),detailDto.getAsString("amount"));

					sumDto.put("waist"+columnKeyValue.getAsString(waist),0);
					rowList.add(detailDto);
				}

			}

			Integer sumValue = 0;
			for(Object obj:rowList){
				Dto rowDto = (Dto)obj;

				String nature = rowDto.getAsString("nature");
				String belong_grp_name = rowDto.getAsString("belong_grp_name");
				if(nature.equals("0")){
					rowDto.put("remark", "标签绑定");
				}else if(nature.equals("1")){//裁剪扫描到记录
					rowDto.put("remark","缝制中");
				}else if(nature.equals("2")){//缝制领片
					rowDto.put("remark","缝制中");
				}else if(nature.equals("3")){//缝制下线
					rowDto.put("remark","缝制中");
					rowDto.put("belong_grp_name","缝制完成,在路途");
				}else if(nature.equals("4")){//水洗收
					rowDto.put("remark","水洗中");
				}else if(nature.equals("5")){//水洗交
					rowDto.put("belong_grp_name","水洗完成,在路途");
					rowDto.put("remark","水洗中");
				}else if(nature.equals("6")){//后整收
					rowDto.put("remark","后整中");
				}else if(nature.equals("7")){//交成品
					rowDto.put("remark","成品");
				}else if(nature.equals("8")){//交b品
					rowDto.put("remark","B品");
				}else if((nature.equals("10"))){
					rowDto.put("remark", "收成品");
				}else if((nature.equals("11"))){
					rowDto.put("remark", "收B品");
				}else if((nature.equals("12"))){
					rowDto.put("remark", "中间领用");
				}else if((nature.equals("13"))){
					rowDto.put("remark", "送水洗");
				}else if(nature.equals("9")){
					rowDto.put("remark", "标签解绑");
				}else if(nature.equals("14")){
					rowDto.put("remark", "出运成品");
				}else if(nature.equals("15")){
					rowDto.put("remark", "出运B品");
				}

				Iterator it = sumDto.keySet().iterator();
				while(it.hasNext()){
					String key = (String)it.next();

					Integer i = rowDto.getAsInteger(key);
					i=i==null?0:i;
					sumValue = sumValue+i;
					sumDto.put(key,i+sumDto.getAsInteger(key));
				}

			}

			sumDto.put("remark","汇总信息:");
			sumDto.put("belong_grp_name","总数:"+sumValue);

			rowList.add(sumDto);

			String jsonString = JsonHelper.encodeList2PageJson(rowList,rowList.size(),"");
			outDto.put("jsonString",jsonString);

		} catch (Exception e) {
			throw new ApplicationException(e.getMessage(), e);
		}
		return outDto;
	}

	/**
	 * 查询导出产品动向的数据
	 * @param pDto
	 * @return
	 */
	public Dto prodStateExport(Dto pDto) {
		 Dto outDto = new BaseDto();
		 try {
			 String showFlag = pDto.getAsString("showFlag");

			 String click_cust_id = pDto.getAsString("click_cust_id");
			 String belong_grp_id = pDto.getAsString("belong_grp_id");
			 if(!"".equals(click_cust_id)){
				 if(click_cust_id.startsWith("cust")){
					 pDto.put("cust_id",click_cust_id.substring(4));
				 }else if(click_cust_id.startsWith("ord")){
					 pDto.put("ord_seq_no",click_cust_id.substring(3));
				 }else{
					 return outDto;
				 }
			 }else if(!"".equals(belong_grp_id)){
				 if(belong_grp_id.startsWith("grps")){
					 pDto.put("belong_grp_id",belong_grp_id.substring(4));
				 }else if(belong_grp_id.startsWith("ord")){
					 pDto.put("belong_grp_id","");//设为空
					 pDto.put("ord_seq_no",belong_grp_id.substring(3,belong_grp_id.indexOf("_grps")));
				 }else{
					 return outDto;
				 }
			 }

			 List list = new ArrayList();
			 Integer pageCount = 0;
			 if(showFlag.equals("1")){//按产品信息过滤查询

				 String style_no = pDto.getAsString("style_no");
				 String country = pDto.getAsString("country");
				 String color = pDto.getAsString("color");
				 String cloth_size = pDto.getAsString("cloth_size");
				 style_no= style_no.substring(style_no.indexOf("_")+1);
				 country= country.substring(country.indexOf("_")+1);
				 color= color.substring(color.indexOf("_")+1);
				 cloth_size= cloth_size.substring(cloth_size.indexOf("_")+1);
				 pDto.put("style_no",style_no);
				 pDto.put("country",country);
				 pDto.put("color",color);
				 pDto.put("cloth_size_seq_no",cloth_size);

				 list = g4Dao.queryForPage("queryProdDetailInfo4Prod",pDto);
			 }else if(showFlag.equals("2")){//按生产通知单过滤查询
				 list = g4Dao.queryForPage("queryProdDetailInfo4ProdOrd",pDto);
			 }else if(showFlag.equals("3")){//按订单过滤查询
				 list = g4Dao.queryForPage("queryProdDetailInfo4Ord",pDto);
			 }

			 for(Object obj:list){
				 Dto dto = (Dto)obj;
				 String nature = dto.getAsString("nature");
				 
				 String belong_grp_name = dto.getAsString("belong_grp_name");
				 if(nature.equals("0")){
					 dto.put("_nature","标签入库");
				 }else if(nature.equals("1")){//裁剪扫描到记录
					 dto.put("_nature","裁出数量");
					 dto.put("remark","缝制中");
				 }else if(nature.equals("2")){//缝制领片
					 dto.put("_nature","缝制领片");
					 dto.put("remark","缝制中");
				 }else if(nature.equals("3")){//缝制下线
					 dto.put("_nature","缝制下线");
					 dto.put("remark","缝制中");
					 dto.put("belong_grp_name","在路途");
				 }else if(nature.equals("4")){//水洗收
					 dto.put("_nature","水洗收货");
					 dto.put("remark","水洗中");
				 }else if(nature.equals("5")){//水洗交
					 dto.put("belong_grp_name","在路途");
					 dto.put("_nature","水洗移交");
					 dto.put("remark","水洗中");
				 }else if(nature.equals("6")){//后整收
					 dto.put("_nature","后整收货");
					 dto.put("remark","后整中");
				 }else if(nature.equals("7")){//交成品
					 dto.put("_nature","移交成品");
					 dto.put("remark","成品");
				 }else if(nature.equals("8")){//交b品
					 dto.put("_nature","移交B品");
					 dto.put("remark","B品");
				 }else if(nature.equals("9")){
					 dto.put("_nature", "标签解绑");
				 }else if(nature.equals("10")){
					 dto.put("_nature", "收成品");
					 dto.put("remark", "成品");
				 }else if(nature.equals("11")){
					 dto.put("_nature", "收B品");
					 dto.put("remark", "B品");
				 }else if(nature.equals("12")){
					 dto.put("_nature", "中间领用");
					 dto.put("remark", "领用");
				 }else if(nature.equals("13")){
					 dto.put("_nature", "送水洗");
					 dto.put("remark", "送水洗");
				 }
			 }
			 outDto.put("prodInfo", list);
		 } catch (Exception e) {
			 throw new ApplicationException(e.getMessage(), e);
		 }
		 return outDto;
	}


}
