package com.cnnct.rfid.service.impl;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.eredlab.g4.bmf.base.BaseDao;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.springframework.aop.ThrowsAdvice;

import com.cnnct.common.ApplicationException;
import com.cnnct.rfid.service.SalesFocusReportService;
import com.cnnct.util.G4Utils;

public class SalesFocusReportServiceImpl extends BaseServiceImpl implements SalesFocusReportService {
/**
 * 查询并生成报表
 */
	public Dto querySalesFocus(Dto inDto) throws ApplicationException {
		Dto outDto=new BaseDto();
		//如果查询的月份为空，设置为全选
		if (G4Utils.isEmpty(inDto.getAsString("months"))) {
			inDto.put("months", "1;2;3;4;5;6;7;8;9;10;11;12");
		}
		//处理下查询用的月份
		String[] months=inDto.getAsString("months").split(";");
		String monthsP="";
		for (int i = 0; i < months.length; i++) {
			monthsP+="'"+inDto.getAsString("year")+"-"+toEnDate(Integer.parseInt(months[i])-1)+"'";
			if (i!=months.length-1) {
				monthsP+=",";
			}
		}
		inDto.put("monthsP", monthsP);
		//生成周行
		Map weekMap =	initWeeks(inDto);
		
		if (weekMap.size()==0) {
			 new Exception("salesfocus生成周列失败");
		}
		
		
		//根据月份查询数据
		List list=g4Dao.queryForList("getSaleFoucusList",inDto);
		//根据负责人显示相应品牌
		List brandList=g4Dao.queryForList("getSaleFoucusBrandInfoByOpertater",inDto);
		//填充周信息 ：匹配周行和品牌信息列填入数量和价格
		for (int i = 0; i < list.size(); i++) {
			Dto sdto=(Dto)list.get(i);
			for (int j = 0; j < brandList.size(); j++) {
				Dto brandDto=(Dto)brandList.get(j);
				if (sdto.getAsString("brand_info_no").equals(brandDto.getAsString("seq_no"))) {
					Dto weekDto= (Dto) weekMap.get(sdto.getAsString("week"));
					weekDto.put(brandDto.getAsString("brand")+"-"
							+brandDto.getAsString("location")+"-"
							+brandDto.getAsString("leader")+
							"-amount", sdto.getAsString("amount"));
					weekDto.put(brandDto.getAsString("brand")+"-"
							+brandDto.getAsString("location")+"-"
							+brandDto.getAsString("leader")+
							"-fob_price", sdto.getAsString("fob_price"));
					weekDto.put(brandDto.getAsString("brand")+"-"
							+brandDto.getAsString("location")+"-"
							+brandDto.getAsString("leader")+
							"-remark", sdto.getAsString("remark"));
				}
			}
		}
		//填充按月汇总信息
		List sumList=g4Dao.queryForList("getSaleFoucusSumList",inDto);
		for (int i = 0; i < sumList.size(); i++) {
			Dto sdto=(Dto)sumList.get(i);
			for (int j = 0; j < brandList.size(); j++) {
				Dto brandDto=(Dto)brandList.get(j);
				//如果记录是该操作人负责的，往对应周的dto里塞入数量和价格
				if (sdto.getAsString("brand_info_no").equals(brandDto.getAsString("seq_no"))) {
					Dto weekDto= (Dto) weekMap.get(sdto.getAsString("month_p")+".total");
					weekDto.put(brandDto.getAsString("brand")+"-"
							+brandDto.getAsString("location")+"-"
							+brandDto.getAsString("leader")+
							"-amount", sdto.getAsString("amount"));
					weekDto.put(brandDto.getAsString("brand")+"-"
							+brandDto.getAsString("location")+"-"
							+brandDto.getAsString("leader")+
							"-fob_price", sdto.getAsString("fob_price"));
//					weekDto.put(brandDto.getAsString("brand")+"-"
//							+brandDto.getAsString("location")+"-"
//							+brandDto.getAsString("leader")+
//							"-remark", sdto.getAsString("remark"));
				}
			}
		}
		List reportList=new ArrayList();
		Iterator iter = weekMap.entrySet().iterator();
		while (iter.hasNext()) {
			Map.Entry entry = (Map.Entry) iter.next();
			Object val = entry.getValue();
			reportList.add(val);
		}
		
		Integer totalCount = g4Dao.queryForPageCount("getSaleFoucusList", inDto);
		String jsonStrList = JsonHelper.encodeObject2Json(reportList);
        outDto.put("jsonStrList", JsonHelper.encodeJson2PageJson(jsonStrList, totalCount));
        return outDto;
	}
	

	/**
	 * merger 新增或者修修改报表
	 */
	public Dto updateSalesFocus(Dto inDto) throws ApplicationException {
		Dto outDto=new BaseDto();
		Dto brandDto=new BaseDto();
		brandDto.put("brand", inDto.getAsString("brand"));
		brandDto.put("location", inDto.getAsString("location"));
		brandDto.put("leader", inDto.getAsString("leader"));
		Dto seq=(Dto)g4Dao.queryForObject("checkDouble4BrandInfo",brandDto);
		inDto.put("brand_info_no", seq.getAsString("seq_no"));
		g4Dao.insert("updateSalesFocus",inDto);
        outDto.put("success", true);
		return outDto;
	}

	

	/**
	 * 品牌负责人等相关信息
	 */
	public Dto querySalesFocusBrandInfo(Dto inDto) throws ApplicationException {
		Dto outDto=new BaseDto();
		List list=g4Dao.queryForPage("querySalesFocusBrandInfoByParam",inDto);
		Integer totalCount = g4Dao.queryForPageCount("querySalesFocusBrandInfoByParam", inDto);
		String jsonStrList = JsonHelper.encodeObject2Json(list);
        outDto.put("jsonString", JsonHelper.encodeJson2PageJson(jsonStrList, totalCount));
		return outDto;
	}
	/**
	 * 添加品牌相关信息
	 */
	public Dto addSalesFocusBrandInfo(Dto inDto) throws ApplicationException {
		Dto outDto=new BaseDto();
		g4Dao.insert("insertSalesFoucusChargeInfo",inDto);
        outDto.put("success", true);
		return outDto;
	}
	/**
	 * 更新品牌相关信息
	 */
	public Dto updateSalesFocusBrandInfo(Dto inDto) throws ApplicationException {
		Dto outDto=new BaseDto();
		g4Dao.update("updateSalesFoucusChargeInfo",inDto);
        outDto.put("success", true);
		return outDto;
	}
	/**
	 * 删除品牌相关信息
	 */
	public Dto deleteSalesFocusBrandInfo(Dto inDto) throws ApplicationException {
		Dto outDto=new BaseDto();
		g4Dao.update("deleteSaleFoucusChargeInfo",inDto);
        outDto.put("success", true);
		return outDto;
	}
	/**
	 * 初始化当年的周列表
	 */
	private Map<String,Dto> initWeeks(Dto inDto) {
		String year=inDto.getAsString("year");
		String months=inDto.getAsString("months");
		Map<String, Dto> weeks=new HashMap<String, Dto>();
	      Calendar fdw= Calendar.getInstance();
	      fdw.set(Calendar.WEEK_OF_YEAR, 1);
	      fdw.set(Calendar.DAY_OF_WEEK, 7);
	      fdw.set(Calendar.YEAR,Integer.parseInt(year));
	      SimpleDateFormat sf=new SimpleDateFormat("MM/dd");
	      
	      //获取当前年总周数
	      Calendar c2 = new GregorianCalendar();
          c2.setFirstDayOfWeek(Calendar.SUNDAY);
	      c2.setMinimalDaysInFirstWeek(7);
          int y=Integer.parseInt(G4Utils.getCurDate().substring(0, 4));
          c2.set(y, Calendar.DECEMBER, 31, 23, 59, 59);
          int weekNum=c2.get(Calendar.WEEK_OF_YEAR);
          //String[] s=months.split(";");
          //int monthF=Integer.parseInt(s[0])-1;
          int monthF=0;
          boolean sumFlag=false;
	      //根据周数生成map
          //需要添加的汇总行数量
	      for (int i = 0;i<weekNum; i++) {
			Dto dto=new BaseDto();
			//月份判断字段 fdw.get(Calendar.MONTH) 0是一月
			monthF=fdw.get(Calendar.MONTH);
			//当前年+月+第几周+详细时间 
			String week=+fdw.get(Calendar.YEAR)+"-"+toEnDate(fdw.get(Calendar.MONTH))+"-"+fdw.get(Calendar.WEEK_OF_MONTH)+"Week";
			String date=sf.format(fdw.getTime());
			fdw.add(Calendar.DAY_OF_YEAR, -6);
			date=sf.format(fdw.getTime())+"-"+date;
			String weekInfo=week+"("+date+")";
			dto.put("week",weekInfo);
			dto.put("no", i);
			//如果是勾选的月份，添加进列表，否则跳过
			if((";"+months+";").indexOf(";"+(monthF+1)+";")>-1){
				weeks.put(weekInfo,dto);
				System.out.println(weekInfo);
			}
	    	fdw.add(Calendar.DAY_OF_YEAR, 13);
	    	//查看下个时间如果换了一个月 ，再插入一行用作月汇总
			if (monthF!=fdw.get(Calendar.MONTH)) {
				if((";"+months+";").indexOf(";"+(monthF+1)+";")>-1){
					Dto sumDto =new BaseDto();
					sumDto.put("week",year+"-"+toEnDate(monthF)+".total");
					sumDto.put("no", i+0.1);
					weeks.put(year+"-"+toEnDate(monthF)+".total",sumDto);
					System.out.println(year+"-"+toEnDate(monthF)+".total");
				}
			}
	      }
        return weeks;
	}
	
	/**
	 * 初始化当年的周列表2
	 * 从数据库查询后拼接成weekmap
	 */
	private Map<String,Dto> initWeeks2(Dto pDto){
		
		Map<String, Dto> weeks=new HashMap<String, Dto>();
		List weekList=g4Dao.queryForList("getSalesWeekList", pDto);
		for (int i = 0; i < weekList.size(); i++) {
			Dto iDto = (Dto)weekList.get(i);
			String weekInfo = iDto.getAsString("s_year") + "-" +
					toEnDate(iDto.getAsInteger("s_month")) + "-" +
					iDto.getAsString("s_week") + "week(" +
					iDto.getAsString("s_date") + ")";
			Dto weekDto= new BaseDto();
			weekDto.put("week", weekInfo);
			weekDto.put("no",iDto.getAsString("week_id"));
			weeks.put(weekInfo, weekDto);
		}
		return weeks;
	} 
	
	//月份转英文
	private  String toEnDate(int month){
    	String monthEn="";
    	switch (month) {
		case 0:
			monthEn="Jan";
			break;
		case 1:
			monthEn="Feb";
			break;
		case 2:
			monthEn="Mar";
			break;
		case 3:
			monthEn="Apr";
			break;
		case 4:
			monthEn="May";
			break;
		case 5:
			monthEn="Jun";
			break;
		case 6:
			monthEn="Jul";
			break;
		case 7:
			monthEn="Aug";
			break;
		case 8:
			monthEn="Sep";
			break;
		case 9:
			monthEn="Oct";
			break;
		case 10:
			monthEn="Nov";
			break;
		case 11:
			monthEn="Dec";
			break;
		case -1:
			monthEn="Dec";
			break;	
		default:
			monthEn="e";
			break;
		}
    	return monthEn;
    }
}
