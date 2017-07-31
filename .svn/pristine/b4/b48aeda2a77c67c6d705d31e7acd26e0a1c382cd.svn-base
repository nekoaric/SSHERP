package com.cnnct.rfid.service.impl;

import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import jxl.Workbook;
import jxl.format.Alignment;
import jxl.format.Border;
import jxl.format.BorderLineStyle;
import jxl.format.Colour;
import jxl.format.UnderlineStyle;
import jxl.format.VerticalAlignment;
import jxl.write.Label;
import jxl.write.Number;
import jxl.write.NumberFormat;
import jxl.write.NumberFormats;
import jxl.write.WritableCellFormat;
import jxl.write.WritableFont;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.cnnct.common.ApplicationException;
import com.cnnct.rfid.service.ExcelExportService;
import com.cnnct.util.G4Utils;
import com.cnnct.util.NatureUtil;
import com.cnnct.util.TimeUtil;
import com.ibatis.common.logging.Log;
import com.ibatis.common.logging.LogFactory;
import com.sun.org.apache.bcel.internal.generic.NEW;

/**
 * 功能：报表导出
 * 创建时间：2013-10-21
 * 创建作者：zhouww
 * 最后修改功能：
 * 最后修改时间：
 */
public class ExcelExportServiceImpl extends BaseServiceImpl implements ExcelExportService {
	private Log log = LogFactory.getLog(ExcelExportServiceImpl.class);
	
	
	/**
	 * 产品流水记录表
	 * @param inDto
	 * @return
	 * @throws ApplicationException
	 */
	public Dto ordDayListExcel(Dto inDto) throws ApplicationException {
		try{
			HttpServletRequest request = (HttpServletRequest)inDto.get("excel_request");
			HttpServletResponse response = (HttpServletResponse)inDto.get("excel_response");
			String ord_seq_no = inDto.getAsString("ord_seq_no");
			String natures = inDto.getAsString("natures");
			if(natures.length()>0){
				StringBuffer sb = new StringBuffer();
				String[] nature = natures.split(";");
				for(String str:nature){
					if("".equals(str)){
						continue;
					}
					sb.append("'").append(str).append("',");
				}
				if(sb.length()>0){
					sb.deleteCharAt(sb.length()-1);
				}
				inDto.put("natures", sb.toString());
			}
			List dataList = g4Dao.queryForList("queryOrdDayList4OrdDayListExcel", inDto);
			//变换数量性质和流水名称的改变
			int dataSize = dataList.size();
			for (int i = 0; i < dataSize; i++) {
                Dto dto = (Dto) dataList.get(i);
                dto.put("nature", NatureUtil.parseNC2natureZh(dto.getAsString("nature")));
            }
			
			OutputStream os = response.getOutputStream();
			WritableWorkbook book = Workbook.createWorkbook(os);
			book = ordDayListFillData(book,dataList);
			String fileName = new String((ord_seq_no+"订单流水记录表.xls").getBytes("GBK"),"iso8859-1");
			response.setHeader("Content-disposition", "attachment;filename="+fileName);
			response.setContentType("application/vnd.ms-excel");
			book.write();
			book.close();
			os.close();
		}catch(Exception e){
			e.printStackTrace();
			ApplicationException ae = new ApplicationException();
			ae.initCause(e);
			throw ae;
		}
		return null;
	}
	/**
	 * 导出水洗工厂的流水记录
	 */
	public Dto acceptAndDeliveryExcel(Dto inDto) throws ApplicationException {
		try{
			HttpServletRequest request = (HttpServletRequest)inDto.get("excel_request");
			HttpServletResponse response = (HttpServletResponse)inDto.get("excel_response");
			inDto.put("nature", "13");
			List acceptList = g4Dao.queryForList("queryOrdDayList4Excel",inDto);
			inDto.put("nature", "5");
			List deliveryList = g4Dao.queryForList("queryOrdDayList4Excel",inDto);
			OutputStream os = response.getOutputStream();
			WritableWorkbook book = Workbook.createWorkbook(os);
			book = AADFillData(book, acceptList, deliveryList);
			String fileName = new String((inDto.getAsString("grp_name")+".xls").getBytes("GBK"),"iso8859-1");
			response.setHeader("Content-disposition", "attachment;filename="+fileName);
			response.setContentType("application/vnd.ms-excel");
			book.write();
			book.close();
			os.close();
		}catch(Exception e){
			e.printStackTrace();
			ApplicationException ae = new ApplicationException();
			ae.initCause(e);
			throw ae;
		}
		return null;
	}
	/**
	 * 出货报表
	 */
	public Dto shipmentExcel(Dto inDto) throws ApplicationException {
		try{
			HttpServletRequest request = (HttpServletRequest)inDto.get("excel_request");
			HttpServletResponse response = (HttpServletResponse)inDto.get("excel_response");
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			SimpleDateFormat sdfSC = new SimpleDateFormat("MM.dd");
			String startDateStr = inDto.getAsString("startdate");
			String endDateStr = inDto.getAsString("enddate");
			//默认起始日期为当前日期
			Calendar cal = Calendar.getInstance();
			if(startDateStr==null|| "".equals(startDateStr)){
				cal.setTime(new Date());
				startDateStr = sdf.format(cal.getTime());
			}else {
				cal.setTime(sdf.parse(startDateStr));
			}
			if(endDateStr==null||"".equals(endDateStr)){
				cal.add(Calendar.DAY_OF_YEAR, 13);
				endDateStr = sdf.format(cal.getTime());
			}
			inDto.put("startdate", startDateStr);
			inDto.put("enddate", endDateStr);
			OutputStream os = response.getOutputStream();
			WritableWorkbook book = Workbook.createWorkbook(os);
			book = fillData4ShipmentExcel(book,inDto);
			response.setHeader("Content-disposition", "attachment;filename="+(new String(("下两周出货报表 "+
						sdfSC.format(sdf.parse(startDateStr))+"-"+sdfSC.format(sdf.parse(endDateStr))+".xls").getBytes(),"iso8859-1")));
			response.setContentType("application/vnd.ms-excel");
			book.write();
			book.close();
			os.close();
		}catch(Exception e){
			e.printStackTrace();
			ApplicationException ae = new ApplicationException();
			ae.initCause(e);
			throw ae;
		}
		return null;
	}
	/**
	 * 水洗厂的出货进货统计
	 */
	public Dto washStatisticsData(Dto inDto) throws ApplicationException {
		//添加基础数据
		//查询总收货数
		//查询每一个水洗工厂的收货数
		Dto outDto = new BaseDto();
		try{
			HttpServletResponse response = (HttpServletResponse)inDto.get("excel_response");
			List<String> factoryNames = new ArrayList<String>();
			String month = "";
			//设置时间
			String factoryName = inDto.getAsString("factoryNames");
			String osName = System.getProperty("os.name").toLowerCase();
			if(osName.indexOf("window")==-1){
				//linux服务器上编码转换
				factoryName = new String(factoryName.getBytes());
			}else if(osName.indexOf("window")!=-1){
				//win7上编码转换
				factoryName = new String(factoryName.getBytes("iso8859-1"),"utf-8");
			}
			if(factoryName.length()>0){
				String[] strs = factoryName.split(";");
				for(String str:strs){
					if(!"".equals(str)){
						factoryNames.add(str);
					}
				}
			}
			inDto.put("factoryName", factoryNames);
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			String startDate = inDto.getAsString("start_date");
			String endDate = inDto.getAsString("end_date");
			month = startDate.substring(5,7);
			inDto.put("month", month);
			Calendar cal_startDate = Calendar.getInstance();
			cal_startDate.setTime(sdf.parse(startDate));
			Calendar cal_endDate = Calendar.getInstance();
			cal_endDate.setTime(sdf.parse(endDate));
			
			//添加开始日期的前一天日期，作为查询统计数量的参数
			Calendar before_startDate = Calendar.getInstance();
            before_startDate.setTime(sdf.parse(startDate));
            before_startDate.add(Calendar.DAY_OF_YEAR, -1);
            
			inDto.put("before_date", sdf.format(before_startDate.getTime()));
			
			//保存日期顺序
			List<String> dateShow = new ArrayList<String>();
			List<String> dateValue = new ArrayList<String>();
			SimpleDateFormat showSdf = new SimpleDateFormat("MM月dd日");
			for(;cal_startDate.compareTo(cal_endDate)<=0;){
				String date = showSdf.format(cal_startDate.getTime());
				dateShow.add(date);
				dateValue.add(sdf.format(cal_startDate.getTime()));
				cal_startDate.add(Calendar.DAY_OF_MONTH, 1);
			}
			OutputStream os = response.getOutputStream();
			WritableWorkbook wbook = Workbook.createWorkbook(os);
			wbook = washStatisticsDataFill(wbook, dateShow, dateValue, inDto);
			String fileName = new String((TimeUtil.getCurrentDate("yyyy-MM")+"水洗收送明细.xls").getBytes("utf-8"),"iso8859-1");
			response.setHeader("Content-disposition", "attachment;filename="+fileName);
			response.setContentType("application/vnd.ms-excel");
			wbook.write();
			wbook.close();
			os.close();
			
		}catch(Exception e){
			e.printStackTrace();
		}
		return outDto;
	}
	/**
	 * 订单进度跟踪表
	 */
	public Dto ordStatisticsExcel(Dto inDto) throws ApplicationException {
		Dto outDto = new BaseDto();
		try{
			HttpServletResponse response = (HttpServletResponse)inDto.get("excel_response");
			inDto.remove("excel_response");
			OutputStream os = response.getOutputStream();
			//处理order_id数据
			String order_id = inDto.getAsString("order_id");
			if(order_id!=null && !"".equals(order_id)){
				String[] ids = order_id.split(",");
				StringBuffer sb = new StringBuffer(100);
				for(String str:ids){
					sb.append("'").append(str).append("',");
				}
				sb.deleteCharAt(sb.length()-1);
				inDto.put("order_id", sb.toString());
			}
			WritableWorkbook wbook = Workbook.createWorkbook(os);
			wbook = ordStatisticsData(wbook,inDto);
			response.setHeader("Content-disposition", "attachment;filename="+
					new String(("(贸易用)订单进度跟踪表"+TimeUtil.getCurrentDate()+".xls").getBytes(),"iso8859-1"));
			response.setContentType("application/vnd.ms-excel");
			wbook.write();
			wbook.close();
			os.close();
		}catch(Exception e){
			e.printStackTrace();
			throw new ApplicationException();
		}
		return outDto;
	}
	
	/**
	 * 水洗厂大货进度表
	 * @param inDto
	 * @return
	 * @throws ApplicationException
	 */
	public Dto washExcelByWeekNum(Dto inDto) throws ApplicationException {
		try{
			HttpServletResponse response = (HttpServletResponse)inDto.get("excel_response");
			inDto.remove("excel_response");
			String factoryName = inDto.getAsString("washFac");
			String classify = inDto.getAsString("classify");
			String osName = System.getProperty("os.name").toLowerCase();
			if(osName.indexOf("window")==-1){
				//linux服务器上编码转换
				factoryName = new String(factoryName.getBytes());
				classify = new String(classify.getBytes());
			}else if(osName.indexOf("window")!=-1){
				//win7上编码转换
				factoryName = new String(factoryName.getBytes("iso8859-1"),"utf-8");
				classify = new String(classify.getBytes("iso8859-1"),"utf-8");
			}
			//处理工厂
			StringBuffer factoryNames = new StringBuffer();
			if(factoryName.length()>0){
				String[] strs = factoryName.split(";");
				for(String str:strs){
					if(!"".equals(str)){
						str = str.trim();
						factoryNames.append("'").append(str).append("',");
						if(str.indexOf("水洗厂")==-1){
							//如果没有水洗厂的字 添加这个字段
							factoryNames.append("'").append(str).append("水洗厂").append("',");
						}else{
							//如果有水洗厂的字 添加去掉‘水洗厂’的字段
							factoryNames.append("'").append(str.substring(0,str.length()-3)).append("',");
						}
						
					}
				}
				factoryNames.deleteCharAt(factoryNames.length()-1);
			}
			inDto.put("factoryName", factoryNames.toString());
			//处理产品分类
			StringBuffer classifySB = new StringBuffer();
			if(classify.length()>0){
				String[] classifys = classify.split(";");
				for(String str:classifys){
					if(!"".equals(str)){
						str = str.trim();
						classifySB.append("'").append(str).append("',");
					}
				}
				classifySB.deleteCharAt(classifySB.length()-1);
			}
			inDto.put("classify", classifySB.toString());
			OutputStream os =  response.getOutputStream();
			WritableWorkbook wbook = Workbook.createWorkbook(os);
			wbook = fillData4WashExcel(wbook,inDto);
			response.setHeader("Content-disposition", "attachment;filename="+
						new String("水洗厂大货进度表.xls".getBytes(),"iso8859-1"));
			response.setContentType("application/vnd.ms-excel");
			wbook.write();
			wbook.close();
			os.close();
		}catch(Exception e){
			e.printStackTrace();
			throw new ApplicationException();
		}
		return null;
	}
	
	/**
	 * 填充水洗厂大货进度表数据
	 * @param wbook
	 * @param inDto
	 * @return
	 * @throws ApplicationException
	 */
	public WritableWorkbook fillData4WashExcel(WritableWorkbook wbook,Dto inDto)throws ApplicationException{
		//导出的开始日期和结束日期是否是同一年:false不是同一年，true是同一年
		boolean isOneYeay = false;
		try{
			Dto dataDto = createDto2WashExcel();
			dataDto.put("baseX", "0");
			dataDto.put("baseY", "0");
			String[] colStrs = {"seq_no","cust_name","style_no","article","classify","wash_1","wash","wash_stream","printing",
					"embroider","ribbon_color","order_id","ord_num","real_cut_num","fob_deal_date","check_prod_date",
					"accept_start_date","bach_accept_num","bach_delivery_num","residue","sew_short","sew_name","bach_name",
					"pack_name","remark"};
			List<String> numberCols = new ArrayList<String>();
			numberCols.add("ord_num");
			numberCols.add("real_cut_num");
			numberCols.add("bach_accept_num");
			numberCols.add("bach_delivery_num");
			numberCols.add("residue");
			numberCols.add("sew_short");
			
			List dataList = g4Dao.queryForList("queryWashExcel",inDto);
			//按周信息处理
			//周信息 集合 ，有顺序
			List<String> weekList = new ArrayList<String>();
			//周信息-具体日期，无顺序
			Map<String,List<String>> weekNum2Date = new HashMap<String,List<String>>();
			//周信息-水洗厂进度信息 Map<周数，Map<标记绳,List<进度信息>>>
			Map<String,Map<String,List<Dto>>> weekNum2Dto = new HashMap<String,Map<String,List<Dto>>>();
			
			String startDateStr = inDto.getAsString("start_date");
			String endDateStr = inDto.getAsString("end_date");
			
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			Map<String,Object> weekInfo = dateToWeekInfoByNaturally(startDateStr, endDateStr);
			weekList = (List<String>)weekInfo.get("weekList");
			weekNum2Date = (Map<String,List<String>>)weekInfo.get("week2DateInfo");
			//遍历进度数据  
			for(String str:weekList){
				List<String> dateList = weekNum2Date.get(str);
				for(Object obj :dataList){
					weekNum2Dto = doDto4weekNumDto(weekNum2Dto,dateList,str,obj);
				}
			}
			//格式
			WritableFont titleF = new WritableFont(WritableFont.TIMES, 16, WritableFont.BOLD,false),
	 			colF = new WritableFont(WritableFont.TIMES,12,WritableFont.BOLD,false),
	 			checkDateFont = new WritableFont(WritableFont.TIMES,12,WritableFont.BOLD,false),
	 			beanF = new WritableFont(WritableFont.TIMES,12,WritableFont.BOLD,false,UnderlineStyle.NO_UNDERLINE,Colour.BLUE);
			NumberFormat numberFormat = new NumberFormat("#");
			WritableCellFormat titleFormat = new WritableCellFormat(titleF),
							colFormat = new WritableCellFormat(colF),
							beanFormat = new WritableCellFormat(beanF),
							checkDateFormat = new WritableCellFormat(checkDateFont),
							numberF = new WritableCellFormat(beanF,numberFormat);
			titleFormat.setBorder(Border.ALL, BorderLineStyle.THIN);
			titleFormat.setAlignment(Alignment.CENTRE);
			colFormat.setBorder(Border.ALL, BorderLineStyle.THIN);
			colFormat.setAlignment(Alignment.CENTRE);
			beanFormat.setBorder(Border.ALL, BorderLineStyle.THIN);
			beanFormat.setAlignment(Alignment.CENTRE);
			beanFormat.setVerticalAlignment(VerticalAlignment.CENTRE);
			numberF.setBorder(Border.ALL, BorderLineStyle.THIN);
			numberF.setAlignment(Alignment.CENTRE);
			numberF.setVerticalAlignment(VerticalAlignment.CENTRE);
			checkDateFormat.setBackground(Colour.GRAY_25);
			
			//格式化船期的显示
			SimpleDateFormat checkDateF = new SimpleDateFormat("yyyy/MM/dd");
			//判断导出的数据中是否是同一年，确定日期显示的格式和表头信息
			String title = dataDto.getAsString("title");
			if(startDateStr.substring(0,4).equals(endDateStr.substring(0,4))){
				isOneYeay = true;
				checkDateF = new SimpleDateFormat("MM/dd");
				title = startDateStr.substring(0,4)+"年   "+title;
			}else if(Integer.parseInt(startDateStr.substring(0,4))<Integer.parseInt((endDateStr.substring(0,4)))){
				title = startDateStr.substring(0,4) +"年-"+endDateStr.substring(0,4)+"年   "+title;
			}
			
			Number number = null;
			//设置表头
			WritableSheet sheet0 = wbook.createSheet(title, 0);
			//设置每列的宽度 :序号列和备注列单独设置
			for(int i=1;i<colStrs.length-1;i++){
				sheet0.setColumnView(i, 15);
			}
			sheet0.setColumnView(colStrs.length-1, 50);
			sheet0.setColumnView(3, 30);
			int x = dataDto.getAsInteger("baseX");
			int y = dataDto.getAsInteger("baseY");
			sheet0.mergeCells(x, y, x+colStrs.length-1, y);
			Label label = new Label(x,y,title,titleFormat);
			sheet0.addCell(label);
			////遍历数据   填充表格列头
			for(int k=0;k<colStrs.length;k++){
				sheet0.mergeCells(k, y+1, k, y+2);
				label = new Label(x+k,y+1,dataDto.getAsString(colStrs[k]),colFormat);
				sheet0.addCell(label);
			}
			//所要融合的列名及位置(取第一个数据为结果数据)
			List<String> colMergeListNoSum = new ArrayList<String>();
			colMergeListNoSum.add("ribbon_color");
			int[] colMergeIdxNoSum = {10};
			//所要融合的列名及位置(结果数据需要相加)
			List<String> colMergeList = new ArrayList<String>();
			colMergeList.add("real_cut_num");
			colMergeList.add("bach_accept_num");
			colMergeList.add("bach_delivery_num");
			colMergeList.add("residue");
			colMergeList.add("sew_short");
			int[] colMergeIdx = {13,17,18,19,20};
			Map<Integer,Double> colSumResult = new HashMap<Integer,Double>();
			//需要统计的列名及位置
			List<String> colSumList = new ArrayList<String>();
			colSumList.add("ord_num");
			colSumList.add("real_cut_num");
			colSumList.add("bach_accept_num");
			colSumList.add("bach_delivery_num");
			colSumList.add("residue");
			colSumList.add("sew_short");
			int[] colSumIdx = {12,13,17,18,19,20};
			Map<Integer,Double> everyWeekResult = new HashMap<Integer,Double>();
			Map<Integer,Double> allWeekResult = new HashMap<Integer,Double>();
			//rowIdx：表格的行号，dataIdx一周的数据的行号，dataSize：一周数据的长度
			int rowIdx = 3,dataSize = 0;
			//遍历周信息
			for(String str:weekList){
				//合成尾查信息
				List<String> dateList = weekNum2Date.get(str);
				String checkDate = "尾查: "+checkDateF.format(sdf.parse(dateList.get(0)))+"-"+
									checkDateF.format(sdf.parse(dateList.get(dateList.size()-1)));
				//填充的数据
				Map<String,List<Dto>> rc2ListDto = weekNum2Dto.get(str);
				sheet0.mergeCells(x, y+rowIdx, x+colStrs.length-1, y+rowIdx);
				label = new Label(x,y+rowIdx,checkDate,checkDateFormat);
				sheet0.addCell(label);
				rowIdx++;
				if(rc2ListDto==null || rc2ListDto.size()==0){
					continue;
				}
				if(rc2ListDto.size()>0){
					Set<String> rcStrs = rc2ListDto.keySet();
					//在处理一周数据之前清空一周的统计信息
					everyWeekResult.clear();
					//一周数据的序号
					int weekDataIdx = 1;
					//遍历丝带色号和dto的数据
					for(String rcStr:rcStrs){
						List<Dto> listDtos = rc2ListDto.get(rcStr);
						everyWeekResult = sumColNum(everyWeekResult, listDtos, colSumList, colSumIdx);
						allWeekResult = sumColNum(allWeekResult, listDtos, colSumList, colSumIdx);
						for(Dto dto:listDtos){
							//添加序号
							number = new Number(0,y+rowIdx,weekDataIdx,numberF);
							sheet0.addCell(number);
							weekDataIdx++;
							//循环添加数据
							for(int k=1;k<colStrs.length;k++){
								if(numberCols.contains(colStrs[k])){
									number = new Number(k, y+rowIdx, dto.getAsDouble(colStrs[k])==null?0.0:dto.getAsDouble(colStrs[k])
											, numberF);
									sheet0.addCell(number);
								}else {
									label = new Label(k,y+rowIdx,dto.getAsString(colStrs[k]),beanFormat);
									sheet0.addCell(label);
								}
							}
							rowIdx++;
						}
						//处理合并数据
						dataSize = listDtos.size();
						if(dataSize>1){
							int colMergeIdxNoSumLength = colMergeIdxNoSum.length;
							int colMergeIdxLength = colMergeIdx.length;
							for(int g=0;g<colMergeIdxNoSumLength;g++){
								sheet0.mergeCells(colMergeIdxNoSum[g], y+rowIdx-dataSize, colMergeIdxNoSum[g], y+rowIdx-1);
								label = new Label(colMergeIdxNoSum[g],y+rowIdx-dataSize,listDtos.get(0).getAsString(colMergeListNoSum.get(g)),beanFormat);
								sheet0.addCell(label);
							}
							//数据添加前先将集合清空
							colSumResult.clear();
							colSumResult = sumColNum(colSumResult,listDtos,colMergeList,colMergeIdx);
							for(int g=0;g<colMergeIdxLength;g++){
								sheet0.mergeCells(colMergeIdx[g], y+rowIdx-dataSize, colMergeIdx[g], y+rowIdx-1);
								number = new Number(colMergeIdx[g], y+rowIdx-dataSize,colSumResult.get(colMergeIdx[g]),numberF);
								sheet0.addCell(number);
							}
						}
					}
				}
				//添加一周的统计信息
				for(int g=0;g<colStrs.length;g++){
					//此循环为了让所有的单元格有同一个格式
					label = new Label(g,y+rowIdx,"",beanFormat);
					sheet0.addCell(label);
				}
				for(int g=0;g<colSumIdx.length;g++){
					if(everyWeekResult.size()==0){
						break;
					}
					number = new Number(colSumIdx[g], y+rowIdx,everyWeekResult.get(colSumIdx[g]),numberF);
					sheet0.addCell(number);
				}
				rowIdx++;
			}
			//添加所有数据的统计信息
			for(int g=0;g<colStrs.length;g++){
				//此循环为了让所有的单元格有同一个格式
				label = new Label(g,y+rowIdx,"",beanFormat);
				sheet0.addCell(label);
			}
			label = new Label(2,y+rowIdx,"合计",colFormat);
			sheet0.addCell(label);
			for(int g=0;g<colSumIdx.length;g++){
				if(allWeekResult==null ||allWeekResult.size()==0){
					break;
				}
				number = new Number(colSumIdx[g], y+rowIdx,allWeekResult.get(colSumIdx[g]),numberF);
				sheet0.addCell(number);
			}
		}catch (Exception e) {
			e.printStackTrace();
			throw new ApplicationException();
		}
		return wbook;
	}
	
	/**
	 * 统计列的数字
	 * @param result Map<列序号,数值>
	 * @param dtos 待处理数据
	 * @param colName 带处理的列名
	 * @param idxs 待处理列名所对应的位置
	 * @return
	 */
	public Map<Integer,Double> sumColNum(Map<Integer,Double> result,List<Dto> dtos,List<String> colName,int[] idxs){
		int idxLength = idxs.length;
		for(Dto dto:dtos){
			for(int i=0;i<idxLength;i++){
				Double d = dto.getAsDouble(colName.get(i))==null?0.0:dto.getAsDouble(colName.get(i));
				Double resultD = result.get(idxs[i]);
				if(resultD==null){
					result.put(idxs[i], d);
				}else{
					result.put(idxs[i], d+resultD);
				}
			}
		}
		return result;
	}
	
	/**
	 * 将dto添加到对应的map里(标记绳分类)
	 * @param weekNum2Dto dto集合
	 * @param dateList 日期集合
	 * @param str 周期信息
	 * @param obj 单个dto信息
	 * @return
	 */
	public Map<String,Map<String,List<Dto>>> doDto4weekNumDto(Map<String,Map<String,List<Dto>>> weekNum2Dto,
						List<String> dateList,String str,Object obj){
		//判断weekNum2Dto有无本周信息
		//如果没有 新增 如果有跳过新增 继续执行
		//判断本条dto是否是本周的数据 如果不是本周数据 返回结果
		//如果是 判断是否已经有本丝带色号的集合 如果没有新增集合，如果有 跳过新增继续执行
		//添加dto到本周的数据的集合
		Dto dto = (Dto)obj;
		String ribbon_color = dto.getAsString("ribbon_color");
		String check_prod_date = dto.getAsString("check_prod_date");
		Map<String,List<Dto>> rc2Dto = weekNum2Dto.get(str);
		if(rc2Dto==null){
			rc2Dto = new HashMap<String,List<Dto>>();
			weekNum2Dto.put(str, rc2Dto);
			
		}
		if(!dateList.contains(check_prod_date)){
			return weekNum2Dto;
		}
		List<Dto> dtos = rc2Dto.get(ribbon_color);
		if(dtos==null){
			dtos = new ArrayList<Dto>();
			rc2Dto.put(ribbon_color, dtos);
		}
		dtos.add(dto);
		return weekNum2Dto;
	}
	/**
	 * 将dto添加到对应的map里
	 * @param weekNum2Dto dto集合
	 * @param dateList 日期集合
	 * @param str 周期信息
	 * @param obj 单个dto信息
	 * @return
	 */
	public Map<String,List<Dto>> doDto4ShipmentExcel(Map<String,List<Dto>> weekNum2Dto,
						List<String> dateList,String str,Object obj){
		//判断weekNum2Dto有无本周信息
		//如果没有 新增 如果有跳过新增 继续执行
		//判断本条dto是否是本周的数据 如果不是本周数据 返回结果
		//添加dto到本周的数据的集合
		Dto dto = (Dto)obj;
		String fob_deal_date = dto.getAsString("fob_deal_date");
		List<Dto> rc2Dto = weekNum2Dto.get(str);
		if(rc2Dto==null){
			rc2Dto = new ArrayList<Dto>();
		}
		weekNum2Dto.put(str, rc2Dto);
		if(dateList.contains(fob_deal_date)){
			rc2Dto.add(dto);
		}
		return weekNum2Dto;
	}
	/**
	 * 订单流水记录表
	 * @param wbook
	 * @param list
	 * @return
	 * @throws ApplicationException
	 */
	private WritableWorkbook ordDayListFillData(WritableWorkbook wbook,List list)throws ApplicationException{
		try{
			Dto dto = createDto4OrdDayList();
			String[] colStrs = {"sequence_number","tr_date","tr_time","dept_name","team_name",
					"fac_name","cust_name","order_id","style_no","article","mark","nature",
					"amount","billno","submit_name","sure_name","driver","remark"};
			List numberList = new ArrayList();
			numberList.add("amount");
			//设置字体的格式
			WritableFont titleF = new WritableFont(WritableFont.TIMES, 16, WritableFont.BOLD,false),
			 			colF = new WritableFont(WritableFont.TIMES,12,WritableFont.BOLD,false),
			 			beanF = new WritableFont(WritableFont.TIMES,12,WritableFont.BOLD,false);
			NumberFormat numberFormat = new NumberFormat("#");
			WritableCellFormat titleFormat = new WritableCellFormat(titleF),
							colFormat = new WritableCellFormat(colF),
							beanFormat = new WritableCellFormat(NumberFormats.TEXT),
							numberF = new WritableCellFormat(beanF,numberFormat);
			beanFormat.setFont(beanF);
			titleFormat.setBorder(Border.ALL, BorderLineStyle.THIN);
			titleFormat.setAlignment(Alignment.CENTRE);
			colFormat.setBorder(Border.ALL, BorderLineStyle.THIN);
			colFormat.setAlignment(Alignment.CENTRE);
			beanFormat.setBorder(Border.ALL, BorderLineStyle.THIN);
			beanFormat.setAlignment(Alignment.CENTRE);
			numberF.setBorder(Border.ALL, BorderLineStyle.THIN);
			//填充数据
			WritableSheet sheet0 = wbook.createSheet("流水记录", 0);
			//设置列长
			for(int i=0;i<colStrs.length;i++){
				sheet0.setColumnView(i, 15);
			}
			//写列头
			Label label = null;
			Number number = null;
			int colLength = colStrs.length;
			for(int i=0;i<colLength;i++){
				label = new Label(i,0,dto.getAsString(colStrs[i]),colFormat);
				sheet0.addCell(label);
			}
			//写数据
			int dataSize = list.size();
			for(int k=0;k<dataSize;k++){
				Dto dtoData = (Dto)list.get(k);
				for(int i=0;i<colLength;i++){
					if(numberList.contains(colStrs[i])){
						Double  d = dtoData.getAsDouble(colStrs[i]);
						number = new Number(i,k+1,d==null?0.0:d,beanFormat);
						sheet0.addCell(number);
					}else {
						label = new Label(i,k+1,dtoData.getAsString(colStrs[i]),beanFormat);
						sheet0.addCell(label);
					}
				}
			}
		}catch(Exception e){
			e.printStackTrace();
			ApplicationException ae = new ApplicationException();
			ae.initCause(e);
			throw ae;
		}
		return wbook;
	}
	/**
	 * 订单进度跟踪表
	 * @param wbook
	 * @param inDto
	 * @return
	 * @throws ApplicationException
	 */
	public WritableWorkbook ordStatisticsData(WritableWorkbook wbook,Dto inDto)throws ApplicationException{
		try{
			Dto dataDto = createOrdStatisticsColInfo();
			dataDto.put("baseX", "0");
			dataDto.put("baseY", "0");
			String[] colStrs = new String[]{"cust_name","order_id","style_no","opr_merchandiser","fob_deal_date","check_prod_date",
					"check_prod_result","order_num","ins_num","receive_f_product","receive_f_product_percent",
					"sendout_f_product","consume","real_cut_num","sew_num","sew_delivery_num","bach_accept_num",
					"bach_delivery_num","pack_accept_num","f_product_num","b_product_num","receive_b_product","middle_take"};
			//数值的列
			List<String> numberCol = new ArrayList<String>();
			numberCol.add("order_num");
			numberCol.add("ins_num");
			numberCol.add("receive_f_product");
			numberCol.add("receive_f_product_percent");
			numberCol.add("sendout_f_product");
			numberCol.add("consume");
			numberCol.add("real_cut_num");
			numberCol.add("draw_num");
			numberCol.add("sew_num");
			numberCol.add("sew_delivery_num");
			numberCol.add("bach_accept_num");
			numberCol.add("bach_delivery_num");
			numberCol.add("pack_accept_num");
			numberCol.add("f_product_num");
			numberCol.add("b_product_num");
			numberCol.add("receive_b_product");
			numberCol.add("middle_take");
			//小数点的列
			List<String> numberPointCol = new ArrayList<String>();
			numberPointCol.add("receive_f_product_percent");
			numberPointCol.add("consume");
			//设置字体的格式
			WritableFont titleF = new WritableFont(WritableFont.TIMES, 16, WritableFont.BOLD,false),
			 			colF = new WritableFont(WritableFont.TIMES,12,WritableFont.BOLD,false),
			 			beanF = new WritableFont(WritableFont.TIMES,12,WritableFont.BOLD,false);
			NumberFormat numberFormat = new NumberFormat("#");
			NumberFormat number2PointFormat = new NumberFormat("#.##");
			WritableCellFormat titleFormat = new WritableCellFormat(titleF),
							colFormat = new WritableCellFormat(colF),
							beanFormat = new WritableCellFormat(NumberFormats.TEXT),
							numberF = new WritableCellFormat(beanF,numberFormat),
			                number2PointF = new WritableCellFormat(beanF,number2PointFormat);
			beanFormat.setFont(beanF);
			titleFormat.setBorder(Border.ALL, BorderLineStyle.THIN);
			titleFormat.setAlignment(Alignment.CENTRE);
			colFormat.setBorder(Border.ALL, BorderLineStyle.THIN);
			colFormat.setAlignment(Alignment.CENTRE);
			beanFormat.setBorder(Border.ALL, BorderLineStyle.THIN);
			beanFormat.setAlignment(Alignment.CENTRE);
			numberF.setBorder(Border.ALL, BorderLineStyle.THIN);
			number2PointF.setBorder(Border.ALL, BorderLineStyle.THIN);
			
			List excelData = g4Dao.queryForList("queryProdordScheList4Excel", inDto);
			
			//填充数据
			int baseX = dataDto.getAsInteger("baseX");
			int baseY = dataDto.getAsInteger("baseY");
			WritableSheet sheet0 = wbook.createSheet("订单跟踪表", 0);
			//设置列长
			for(int i=0;i<colStrs.length;i++){
				sheet0.setColumnView(i, 15);
			}
			//设置列的显示格式
			sheet0.mergeCells(baseX, baseY, colStrs.length-1, baseY);
			Label label = new Label(baseX,baseY,dataDto.getAsString("title"),titleFormat);
			sheet0.addCell(label);
			for(int i=0;i<colStrs.length;i++){
				label = new Label(baseX+i,baseY+1,dataDto.getAsString(colStrs[i]),colFormat);
				sheet0.addCell(label);
			}
			for(int i=0;i<excelData.size();i++){
				Dto dto = (Dto)excelData.get(i);
				Integer ins_num = dto.getAsInteger("ins_num");
				Integer receive_f = dto.getAsInteger("receive_f_product");
				if(ins_num!=null && ins_num!=0 && receive_f!=null){
					double percent = ((int)(receive_f/(ins_num+0.0)*10000))/100.0;
					dto.put("receive_f_product_percent", percent);
				}
				for(int k=0;k<colStrs.length;k++){
					String beanStr = colStrs[k];
					if(numberCol.contains(beanStr)){
					    Double result = dto.getAsDouble(beanStr);
					    //表明是需要小数点并且不为null 数据保证到小数点后两位
					    if(numberPointCol.contains(beanStr) && result!=null && Math.round(result*100)>0){
					        Number number = new Number(baseX+k,baseY+i+2,result==null?0.0:result,number2PointF);
	                        sheet0.addCell(number);
	                        continue;
					    }
					    //剩余的其他情况
						Number number = new Number(baseX+k,baseY+i+2,result==null?0.0:result,numberF);
						sheet0.addCell(number);
					}else {
						label = new Label(baseX+k,baseY+i+2,dto.getAsString(colStrs[k]),beanFormat);
						sheet0.addCell(label);
					}
				}
			}
		}catch(Exception e){
			e.printStackTrace();
		}
		return wbook;
	}
	
	/**
	 * 水洗工厂流水记录数据填充
	 */
	public WritableWorkbook AADFillData(WritableWorkbook book,List acceptList,List deliveryList)
										throws ApplicationException{
		try{
			Dto acceptInfo = new BaseDto();
			Dto deliveryInfo = new BaseDto();
			String[] acceptStrs = new String[]{"seq_no","tr_date","tr_time","cust_name","style_no","article","mark",
									"amount","sure_address","sure_name","drivery","remark"};
			String[] deliveryStrs = new String[]{"seq_no","tr_date","tr_time","cust_name","style_no","article","mark",
					"amount","destination","submit_name","drivery","remark"};
			acceptInfo.put("title", "日收货数");
			acceptInfo.put("baseX", 0);
			acceptInfo.put("baseY", 0);
			acceptInfo.put("seq_no", "序号");
			acceptInfo.put("tr_date", "日期");
			acceptInfo.put("tr_time", "入时间");
			acceptInfo.put("cust_name", "客户");
			acceptInfo.put("style_no", "款号");
			acceptInfo.put("article", "款式");
			acceptInfo.put("mark", "标记");
			acceptInfo.put("amount", "数量");
			acceptInfo.put("sure_address", "收货地");
			acceptInfo.put("sure_name", "收货人");
			acceptInfo.put("drivery", "司机");
			acceptInfo.put("remark", "备注");
			
			deliveryInfo.put("title", "日送货数");
			deliveryInfo.put("baseX", 13);
			deliveryInfo.put("baseY", 0);
			deliveryInfo.put("seq_no", "序号");
			deliveryInfo.put("tr_date", "日期");
			deliveryInfo.put("tr_time", "出时间");
			deliveryInfo.put("cust_name", "客户");
			deliveryInfo.put("style_no", "款号");
			deliveryInfo.put("article", "款式");
			deliveryInfo.put("mark", "标记");
			deliveryInfo.put("amount", "数量");
			deliveryInfo.put("destination", "送货地");
			deliveryInfo.put("submit_name", "送货人");
			deliveryInfo.put("drivery", "司机");
			deliveryInfo.put("remark", "备注");
			
			WritableSheet sheet0 = book.createSheet("总仓收货明细", 0);
			
			WritableFont titleFont = new WritableFont(WritableFont.TIMES,22,WritableFont.BOLD,false),
						colFont = new WritableFont(WritableFont.TIMES,12,WritableFont.BOLD,false),
						beanFont = new WritableFont(WritableFont.TIMES,12,WritableFont.BOLD,false);
			
			WritableCellFormat titleF = new WritableCellFormat(titleFont),
							colF = new WritableCellFormat(colFont),
							beanF = new WritableCellFormat(beanFont);
			
			titleF.setBorder(Border.ALL, BorderLineStyle.THIN);
			titleF.setAlignment(Alignment.CENTRE);
			colF.setBorder(Border.ALL, BorderLineStyle.THIN);
			colF.setAlignment(Alignment.CENTRE);
			beanF.setBorder(Border.ALL, BorderLineStyle.THIN);
			beanF.setAlignment(Alignment.CENTRE);
			
			for(int k=1;k<acceptStrs.length;k++){
				sheet0.setColumnView(k, 15);
			}
			int deliveryLength = acceptStrs.length+deliveryStrs.length;
			for(int k=acceptStrs.length+2;k<=deliveryLength;k++){
				sheet0.setColumnView(k, 15);
			}
			int x = acceptInfo.getAsInteger("baseX");
			int y = acceptInfo.getAsInteger("baseY");
			int length = acceptStrs.length;
			int listSize = acceptList.size();
			sheet0.mergeCells(x, y, x+length-1, y);
			Label label = new Label(x, y, acceptInfo.getAsString("title"), titleF);
			sheet0.addCell(label);
			//添加列头信息
			for(int k=0;k<length;k++){
				label = new Label(x+k,y+1,acceptInfo.getAsString(acceptStrs[k]),colF);
				sheet0.addCell(label);
			}
			//添加行
			for(int i=0;i<listSize;i++){
				Dto dto = (Dto)acceptList.get(i);
				for(int k=0;k<length;k++){
					label = new Label(x+k,y+i+2,dto.getAsString(acceptStrs[k]),beanF);
					sheet0.addCell(label);
				}
			}
			//出货
			x = deliveryInfo.getAsInteger("baseX");
			y = deliveryInfo.getAsInteger("baseY");
			length = deliveryStrs.length;
			listSize = deliveryList.size();
			sheet0.mergeCells(x, y, x+length-1, y);
			label = new Label(x, y, deliveryInfo.getAsString("title"),titleF);
			sheet0.addCell(label);
			for(int k=0;k<length;k++){
				label  = new Label(x+k,y+1,deliveryInfo.getAsString(deliveryStrs[k]),colF);
				sheet0.addCell(label);
			}
			for(int i=0;i<listSize;i++){
				Dto dto = (Dto)deliveryList.get(i);
				for(int k=0;k<length;k++){
					label = new Label(x+k,y+i+2,dto.getAsString(deliveryStrs[k]),beanF);
					sheet0.addCell(label);
				}
			}
		}catch(Exception e){
			ApplicationException ae = new ApplicationException();
			ae.initCause(e);
			throw ae;
		}
		return book;
	}
	
	/**
	 * 总仓收货明细数据填充
	 * @param wbook excel表
	 * @param dateShow 导出到excel数据
	 * @param dateValue 判断的数据
	 * @param month 列头的月份
	 * @return
	 * @throws ApplicationException
	 */
	public WritableWorkbook washStatisticsDataFill(WritableWorkbook wbook,List<String> dateShow,
										List<String>  dateValue,Dto inDto)throws ApplicationException{
		try{
			String month = inDto.getAsString("month");
			List factoryName = (List)inDto.get("factoryName");
			Dto statisticsDto = new BaseDto();
			Dto subStatisticsDto = new BaseDto();
			statisticsDto.put("title", "月份累计收货数");
			statisticsDto.put("seq_no", "序号");
			statisticsDto.put("tr_date", "日期");
			statisticsDto.put("accept", "收数量");
			statisticsDto.put("delivery", "出数量");
			statisticsDto.put("surplus", "余存");
			
			String[] statisticsStrs = new String[]{"seq_no","tr_date","accept","delivery","surplus"};
			subStatisticsDto.put("title", "发");
			subStatisticsDto.put("accept", "收数量");
			subStatisticsDto.put("delivery", "出数量");
			subStatisticsDto.put("residue","余存");
			String[] subStatisticsStrs = new String[]{"accept","delivery","residue"};
			//设置字体的格式
			WritableFont titleF = new WritableFont(WritableFont.TIMES, 16, WritableFont.BOLD,false),
			 			colF = new WritableFont(WritableFont.TIMES,12,WritableFont.BOLD,false),
			 			beanF = new WritableFont(WritableFont.TIMES,12,WritableFont.BOLD,false);
			NumberFormat numberFormat = new NumberFormat("#");
			WritableCellFormat titleFormat = new WritableCellFormat(titleF),
							colFormat = new WritableCellFormat(colF),
							beanFormat = new WritableCellFormat(NumberFormats.TEXT),
							numberF = new WritableCellFormat(beanF,numberFormat);
			beanFormat.setFont(beanF);
			titleFormat.setBorder(Border.ALL, BorderLineStyle.THIN);
			titleFormat.setAlignment(Alignment.CENTRE);
			colFormat.setBorder(Border.ALL, BorderLineStyle.THIN);
			colFormat.setAlignment(Alignment.CENTRE);
			beanFormat.setBorder(Border.ALL, BorderLineStyle.THIN);
			beanFormat.setAlignment(Alignment.CENTRE);
			numberF.setBorder(Border.ALL, BorderLineStyle.THIN);
			WritableSheet sheet0 = wbook.createSheet(month+"月份仓收送货累计", 0);
			//写累计信息
			sheet0.setColumnView(1, 20); //设置日期的宽度为20
			sheet0.mergeCells(0, 0, 4, 0);
			Label label = new Label(0,0,month+statisticsDto.getAsString("title"),titleFormat);
			sheet0.addCell(label);
			//添加列信息
			for(int i=0;i<statisticsStrs.length;i++){
				label = new Label(i,1,statisticsDto.getAsString(statisticsStrs[i]),colFormat);
				sheet0.addCell(label);
			}
			// 添加日期-数量信息
			Dto paramDto = new BaseDto();
			paramDto.put("start_date", inDto.getAsString("start_date"));
			paramDto.put("end_date", inDto.getAsString("end_date"));
			int factoryNameSize = factoryName.size();
			StringBuffer sb = new StringBuffer();
			for(int i=0;i<factoryNameSize;i++){
				String facName = (String)factoryName.get(i);
				sb.append("'").append(facName).append("',");
				if(facName.indexOf("水洗厂")==-1){
					sb.append("'").append(facName).append("水洗厂").append("',");
				}else {
					sb.append("'").append(facName.substring(0,facName.length()-3)).append("',");
				}
			}
			if(sb.length()>0){
				sb.deleteCharAt(sb.length()-1);
			}
			paramDto.put("grp_name", sb.toString());
			List washDtos = g4Dao.queryForList("queryWashStatistics", paramDto); // 查询条件内的数据,所有的水洗厂
			Dto dbDto = new BaseDto();
			dbDto.put("start_date", "0");
			dbDto.put("end_date", inDto.getAsString("before_date"));
			dbDto.put("grp_name", sb.toString());
			Dto washTotalDto = (Dto)g4Dao.queryForObject("queryWashStatisticsTotal",dbDto);    //统计开始日期前的所有数量,所有的水洗厂
			washTotalDto = washTotalDto==null?new BaseDto():washTotalDto;
			
			//第三行作为结存数量
			// 2014-11-27 新增 zhouww
			// 余存数量
			long surplusNum = 0; //余存，在总数计算和各个水洗厂的余存数量时初始化此余存数量
			//此处添加统计的结存信息
			label = new Label(1, 2, "结存", colFormat);
			sheet0.addCell(label);
			Number surplus_accept = new Number(2, 2, washTotalDto.getAsDouble("accept"), numberF);
			sheet0.addCell(surplus_accept);
			Number surplus_delivery = new Number(3, 2, washTotalDto.getAsDouble("delivery"), numberF);
            sheet0.addCell(surplus_delivery);
            surplusNum = washTotalDto.getAsLong("accept")-washTotalDto.getAsLong("delivery");
            Number surplusNumber = new Number(4, 2, surplusNum, numberF);
            sheet0.addCell(surplusNumber);
			//~结存信息添加结束
            int begionRow = 3; //日期-数量开始行号
			int dateValueSize = dateValue.size();    // 所有日期的数量
			for(int i=0;i<dateValueSize;i++){
				int washDtosSize = washDtos.size();
				Number numberBean = new Number(0,i+begionRow,i+1.0,numberF);
				sheet0.addCell(numberBean);
				label = new Label(1,i+begionRow,dateShow.get(i),colFormat);
				sheet0.addCell(label);
				boolean isExists = false;
				// 遍历所有的结果数据，找到相同日期的数据，并且填充
				for(int k=0;k<washDtosSize;k++){
					Dto dto = (Dto)washDtos.get(k);
					if(dateValue.get(i).equals(dto.getAsString("tr_date"))){
					    Long accept = dto.getAsLong("accept");
					    Long delivery = dto.getAsLong("delivery");
					    accept = accept==null?0L:accept;
					    delivery = delivery==null?0L:delivery;
					    
						numberBean = new Number(2,i+begionRow,accept,numberF);
						sheet0.addCell(numberBean);
						numberBean = new Number(3,i+begionRow,delivery,numberF);
						sheet0.addCell(numberBean);
						surplusNum += accept-delivery;
						numberBean = new Number(4,i+begionRow,surplusNum,numberF);
						sheet0.addCell(numberBean);
						washDtos.remove(k);
						isExists = true;
						break;
					}
				}
				// 如果遍历结果数据没有找到对应的日期数据，则填充空数据(附加格式)
				if(!isExists){
					numberBean = new Number(2,i+begionRow,0.0,numberF);
					sheet0.addCell(numberBean);
					numberBean = new Number(3,i+begionRow,0.0,numberF);
					sheet0.addCell(numberBean);
					numberBean = new Number(4,i+begionRow,0.0,numberF);
                    sheet0.addCell(numberBean);
				}
			}
			//添加各个工厂的订单:南通和南通水洗厂的是一样概念 所以做判断添加一个额外的水洗厂名字
			factoryNameSize = factoryName.size();
			// 查询每一个水洗厂的数据，遍历填充数据
			for(int i=0;i<factoryNameSize;i++){
				String facName = (String)factoryName.get(i);
				sb = new StringBuffer();
				sb.append("'").append(facName).append("'");
				if(facName.indexOf("水洗厂")==-1){
					sb.append(",'").append(facName).append("水洗厂").append("'");
				}else {
					sb.append(",'").append(facName.substring(0,facName.length()-3)).append("'");
				}
				paramDto.put("grp_name", sb.toString());
				washDtos = g4Dao.queryForList("queryWashStatistics", paramDto); // 查询数据，单一的水洗厂
				dbDto = new BaseDto();
	            dbDto.put("start_date", "0");
	            dbDto.put("end_date", inDto.getAsString("before_date"));
	            dbDto.put("grp_name", sb.toString());
	            washTotalDto = (Dto)g4Dao.queryForObject("queryWashStatisticsTotal",dbDto);    //统计开始日期前的所有数量,所有的水洗厂
				//添加列头
				sheet0.mergeCells(5+i*3,0,7+i*3,0);
				label = new Label(5+i*3,0,subStatisticsDto.getAsString("title")+factoryName.get(i),titleFormat);
				sheet0.addCell(label);
				for(int k=0;k<subStatisticsStrs.length;k++){
					label = new Label(5+i*3+k,1,subStatisticsDto.getAsString(subStatisticsStrs[k]),colFormat);
					sheet0.addCell(label);
				}
				
				 //添加余存数量
                surplus_accept = new Number(5+i*3, 2, washTotalDto.getAsDouble("accept"), numberF);
                sheet0.addCell(surplus_accept);
                surplus_delivery = new Number(6+i*3, 2, washTotalDto.getAsDouble("delivery"), numberF);
                sheet0.addCell(surplus_delivery);
                
                surplusNum = washTotalDto.getAsLong("accept")-washTotalDto.getAsLong("delivery");   // 初始化结存数量
                surplusNumber = new Number(7+i*3, 2, surplusNum, numberF);
                sheet0.addCell(surplusNumber);
				
				
				Number numberBean = null;
				for(int q=0;q<dateValueSize;q++){
					int washDtosSize = washDtos.size();
					boolean isExists = false;
					for(int k=0;k<washDtosSize;k++){
						Dto dto = (Dto)washDtos.get(k);
						if(dateValue.get(q).equals(dto.getAsString("tr_date"))){
							Long accept = dto.getAsLong("accept");
							Long delivery = dto.getAsLong("delivery");
							accept = accept==null?0L:accept;
							delivery = delivery==null?0L:delivery;
							
							numberBean = new Number(5+i*3,q+begionRow,accept,numberF);
							sheet0.addCell(numberBean);
							numberBean = new Number(6+i*3,q+begionRow,delivery,numberF);
							sheet0.addCell(numberBean);
							surplusNum = (accept-delivery+surplusNum);
							numberBean = new Number(7+i*3,q+begionRow,surplusNum,numberF);
							sheet0.addCell(numberBean);
							washDtos.remove(k);
							isExists = true;
							break;
						}
					}
					if(!isExists){
						numberBean = new Number(5+i*3,q+begionRow,0.0,numberF);
						sheet0.addCell(numberBean);
						numberBean = new Number(6+i*3,q+begionRow,0.0,numberF);
						sheet0.addCell(numberBean);
						numberBean = new Number(7+i*3,q+begionRow,0.0,numberF);
						sheet0.addCell(numberBean);
					}
				}
			}
			
		}catch(Exception e){
			e.printStackTrace();
		}
		return wbook;
	}
	
	/**
	 * 数据填充(出货报表)
	 * @param book
	 * @param dto
	 * @return
	 */
	public WritableWorkbook fillData4ShipmentExcel(WritableWorkbook book,Dto dto)throws Exception{
		Dto colDto = createDto4ShipmentExcel();
		//显示列
		String[] colStrs = {"cust_name","opr_merchandiser","sew_name","contract_id","style_no","ord_seq_no","article","shipmentCountry",
				"ord_num","ins_num","pack_name","bach_name","sew_startdate","sew_deliverydate","real_cut_num","sew_num",
				"sew_delivery_num","bachshort","bach_accept_num","bach_acceptshort","checkBoxNum","washDays","wash_stream",
				"material","box","outsidePaster","check_prod_date","check_prod_result","lastProdIn","fob_deal_date",
				"transportation_way","shipmentRemark",};
		//数字列：无顺序关系
		List<String> colNumber = new ArrayList<String>();
		colNumber.add("ord_num");
		colNumber.add("ins_num");
		colNumber.add("real_cut_num");
		colNumber.add("sew_num");
		colNumber.add("sew_delivery_num");
		colNumber.add("bachshort");
		colNumber.add("bach_accept_num");
		colNumber.add("bach_acceptshort");
		colNumber.add("checkBoxNum");
		
		//按周信息处理
		//周信息 集合 ，有顺序
		List<String> weekList = new ArrayList<String>();
		//周信息-具体日期，无顺序
		Map<String,List<String>> weekNum2Date = new HashMap<String,List<String>>();
		//周信息-信息 Map<周数，List<信息>>
		Map<String,List<Dto>> weekNum2Dto = new HashMap<String,List<Dto>>();
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		SimpleDateFormat sdfSC = new SimpleDateFormat("MM/dd");
		
		String startDateStr = dto.getAsString("startdate");
		String endDateStr = dto.getAsString("enddate");

		//报表所需数据
		List dataList = g4Dao.queryForList("queryData4ShipmentExcel", dto);
		
		Map<String,Object> weekInfo = dateToWeekInfoByDay(startDateStr, endDateStr);
		weekList = (List<String>)weekInfo.get("weekList");
		weekNum2Date = (Map<String,List<String>>)weekInfo.get("week2DateInfo");
		//遍历进度数据  
		for(String str:weekList){
			List<String> dateList = weekNum2Date.get(str);
			for(Object obj : dataList){
				weekNum2Dto = doDto4ShipmentExcel(weekNum2Dto,dateList,str,obj);
			}
		}
		//格式
		WritableFont titleF = new WritableFont(WritableFont.TIMES, 16, WritableFont.BOLD,false),
 			colF = new WritableFont(WritableFont.TIMES,12,WritableFont.BOLD,false),
 			checkDateFont = new WritableFont(WritableFont.TIMES,12,WritableFont.BOLD,false),
 			beanF = new WritableFont(WritableFont.TIMES,12,WritableFont.BOLD,false,UnderlineStyle.NO_UNDERLINE,Colour.BLUE);
		NumberFormat numberFormat = new NumberFormat("#");
		WritableCellFormat titleFormat = new WritableCellFormat(titleF),
						colFormat = new WritableCellFormat(colF),
						beanFormat = new WritableCellFormat(beanF),
						checkDateFormat = new WritableCellFormat(checkDateFont),
						numberF = new WritableCellFormat(beanF,numberFormat);
		titleFormat.setBorder(Border.ALL, BorderLineStyle.THIN);
		titleFormat.setAlignment(Alignment.CENTRE);
		colFormat.setBorder(Border.ALL, BorderLineStyle.THIN);
		colFormat.setAlignment(Alignment.CENTRE);
		beanFormat.setBorder(Border.ALL, BorderLineStyle.THIN);
		beanFormat.setAlignment(Alignment.CENTRE);
		beanFormat.setVerticalAlignment(VerticalAlignment.CENTRE);
		numberF.setBorder(Border.ALL, BorderLineStyle.THIN);
		numberF.setAlignment(Alignment.CENTRE);
		numberF.setVerticalAlignment(VerticalAlignment.CENTRE);
		checkDateFormat.setBackground(Colour.GRAY_25);
		String title = "下两周出货汇总周报表";
		WritableSheet sheet0 = book.createSheet(title, 0);
		//设置列长
		for(int i=0;i<colStrs.length;i++){
			sheet0.setColumnView(i, 15);
		}
		//个别修正长度
		sheet0.setColumnView(0, 20);
		sheet0.setColumnView(3, 25);
		sheet0.setColumnView(5, 20);
		sheet0.setColumnView(6, 20);
		sheet0.setColumnView(22, 20);
		sheet0.setColumnView(23, 20);
		sheet0.setColumnView(31, 30);
		
		sheet0.mergeCells(0, 0,colStrs.length-1, 0);
		Label label = new Label(0,0,"下两周出货报表 "+sdfSC.format(sdf.parse(startDateStr))+"-"+sdfSC.format(sdf.parse(endDateStr)),titleFormat);
		sheet0.addCell(label);
		//写列头
		int colLength = colStrs.length;
		for(int k=0;k<colLength;k++){
			label = new Label(k,1,colDto.getAsString(colStrs[k]),colFormat);
			sheet0.addCell(label);
		}
		//写数据
		int dataSize = dataList.size();
		Number number = null;
		//统计数据
		double[] sumColsAll = new double[colStrs.length];
		double[] sumCols = new double[colStrs.length];
		//遍历周信息
		int currentIdx = 2;
		for(String weekStr: weekList){
			sumCols = new double[colStrs.length];
			List<Dto> dtos = weekNum2Dto.get(weekStr);
			int dtosSize = dtos.size();
			//遍历一周的行数据
			for(int k=0;k<dtosSize;k++){
				Dto beanDto = (Dto)dtos.get(k);
				//遍历一行的列数据
				for(int i=0;i<colLength;i++){
					String colName = colStrs[i];
					if(colNumber.contains(colName)){
						Double d = beanDto.getAsDouble(colName);
						d = d==null?0.0:d;
						sumCols[i] = sumCols[i]+d;
						sumColsAll[i] = sumColsAll[i]+d;
						number = new Number(i,currentIdx,d,numberF);
						sheet0.addCell(number);
					}else {
						label = new Label(i,currentIdx,beanDto.getAsString(colName),beanFormat);
						sheet0.addCell(label);
					}
				}
				currentIdx++;
			}
			//添加小计信息
			for(int i=0;i<colLength;i++){
				String colName = colStrs[i];
				if(colNumber.contains(colName)){
					number = new Number(i,currentIdx,sumCols[i],numberF);
					sheet0.addCell(number);
				}else {
					label  = new Label(i,currentIdx,"",beanFormat);
					sheet0.addCell(label);
				}
			}	
			List<String> dates = weekNum2Date.get(weekStr);
			if(dates.size()>0){
				String poInfo = sdfSC.format(sdf.parse(dates.get(dates.size()-1)))+"FOB TTL:";
				label = new Label(5,currentIdx,poInfo,beanFormat);
				sheet0.addCell(label);
			}
			currentIdx++;
		}
		//添加总计信息
		for(int i=0;i<colLength;i++){
			String colName = colStrs[i];
			if(colNumber.contains(colName)){
				number = new Number(i,currentIdx,sumColsAll[i],numberF);
				sheet0.addCell(number);
			}else {
				label  = new Label(i,currentIdx,"",beanFormat);
				sheet0.addCell(label);
			}
		}
		label = new Label(5,currentIdx,"合计：",beanFormat);
		sheet0.addCell(label);
		return book;
	}
	
	/**
	 * 创建（贸易用）订单进度跟踪表列头信息
	 * @return
	 */
	public Dto createOrdStatisticsColInfo(){
		Dto dataDto = new BaseDto();
		dataDto.put("title", "（贸易用）订单进度跟踪表	"+TimeUtil.getCurrentDate("yyyy-MM-dd"));
		dataDto.put("cust_name", "客户");
		dataDto.put("order_id", "订单号");
		dataDto.put("style_no", "款号");
		dataDto.put("opr_merchandiser", "跟单员");
		dataDto.put("fob_deal_date", "FOB日期");
		dataDto.put("check_prod_date", "尾查日期");
		dataDto.put("check_prod_result", "尾查结果");
		dataDto.put("order_num", "订单数");
		dataDto.put("ins_num", "指令数/开单数");
		dataDto.put("receive_f_product", "收成品");
		dataDto.put("receive_f_product_percent", "收成品%");
		dataDto.put("sendout_f_product", "实际出货数");
		dataDto.put("consume", "实际损耗%");
		dataDto.put("real_cut_num", "实裁数");
		dataDto.put("draw_num", "领片数");
		dataDto.put("sew_num", "下线数");
		dataDto.put("sew_delivery_num", "送水洗数");
		dataDto.put("bach_accept_num", "水洗收数");
		dataDto.put("bach_delivery_num", "水洗交数");
		dataDto.put("pack_accept_num", "后整收数");
		dataDto.put("f_product_num", "交成品数");
		dataDto.put("b_product_num", "交B品数");
		dataDto.put("receive_b_product", "收B品");
		dataDto.put("middle_take", "中间领用");
		return dataDto;
	}
	/**
	 * 水洗厂大货进度表
	 * @return
	 */
	public Dto createDto2WashExcel(){
		Dto dto = new BaseDto();
		dto.put("title", "大货进度表");
		dto.put("seq_no", "序号");
		dto.put("cust_name", "客户");
		dto.put("style_no", "款号");
		dto.put("article", "款式");
		dto.put("classify", "产品分类");
		dto.put("wash_1", "洗水方法");
		dto.put("wash","洗水工艺");
		dto.put("wash_stream", "大货洗水流程");
		dto.put("printing", "印花");
		dto.put("embroider", "绣花");
		dto.put("ribbon_color", "标记绳");
		dto.put("order_id", "PO#");
		dto.put("ord_num", "订单数");
		dto.put("real_cut_num", "裁剪数");
		dto.put("fob_deal_date", "船期");
		dto.put("check_prod_date", "尾查期");
		dto.put("bach_accept_num", "累计收货数");
		dto.put("accept_start_date", "收货起日期");
		dto.put("bach_delivery_num", "累计出货数");
		dto.put("residue", "余存");
		dto.put("sew_short", "缝制欠数");
		dto.put("sew_name", "缝制厂");
		dto.put("bach_name", "水洗厂");
		dto.put("pack_name", "后整厂");
		dto.put("remark", "备注");
		return dto;
	}
	/**
	 * 出货报表的Dto
	 * @return
	 */
	public Dto createDto4ShipmentExcel(){
		Dto dto = new BaseDto();
		dto.put("cust_name", "客户");
		dto.put("opr_merchandiser", "跟单员");
		dto.put("sew_name", "缝制工厂");
		dto.put("contract_id", "工厂编号（合同号）");
		dto.put("style_no", "款号");
		dto.put("ord_seq_no", "PO");
		dto.put("article", "款式描述");
		dto.put("shipmentCountry", "出运国家");
		dto.put("ord_num", "订单数量");
		dto.put("ins_num", "通知单数");
		dto.put("pack_name", "后整工厂");
		dto.put("bach_name", "水洗工厂");
		dto.put("sew_startdate", "缝制起始日期");
		dto.put("sew_deliverydate", "缝制交货日期");
		dto.put("real_cut_num", "裁剪数量");
		dto.put("sew_num", "缝制数量");
		dto.put("sew_delivery_num", "缝制送水洗数");
		dto.put("bachshort", "缝制欠水洗数");
		dto.put("bach_accept_num", "后道收水洗数");
		dto.put("bach_acceptshort", "水洗欠后道数");
		dto.put("checkBoxNum", "检验包装数量");
		dto.put("washDays", "水洗周期");
		dto.put("wash_stream", "大货洗水流程");
		dto.put("material", "后道辅料");
		dto.put("box", "箱单");
		dto.put("outsidePaster", "外箱贴纸");
		dto.put("check_prod_date", "查货期");
		dto.put("check_prod_result", "查货结果");
		dto.put("lastProdIn", "最晚进仓时间");
		dto.put("fob_deal_date", "FOB");
		dto.put("transportation_way", "出运方式");
		dto.put("shipmentRemark", "备注");
		
		return dto;
	}
	
	/**
	 * 订单流水记录表
	 */
	public Dto createDto4OrdDayList(){
		Dto dto = new BaseDto();
		dto.put("title", "订单流水记录");
		dto.put("sequence_number", "序号");
		dto.put("tr_date", "日期");
		dto.put("tr_time", "时间");
		dto.put("dept_name", "部门");
		dto.put("team_name", "班组");
		dto.put("fac_name", "分厂");
		dto.put("cust_name", "客户");
		dto.put("order_id", "订单");
		dto.put("style_no", "款号");
		dto.put("article", "品名");
		dto.put("mark", "标记");
		dto.put("nature", "数量性质");
		dto.put("amount", "完成数量");
		dto.put("billno", "单据号");
		dto.put("submit_name", "移交/记录人");
		dto.put("sure_name", "收货人");
		dto.put("driver", "司机");
		dto.put("remark", "备注");
		return dto;
	}
	
	/**
	 * B品日报表表
	 */
	public Dto createDto4BReport(){
		Dto dto = new BaseDto();
		dto.put("title", "B品管理日志");
		dto.put("sequence_number", "序号");
		dto.put("tr_date", "日期");
		dto.put("dept_name", "部门");
		dto.put("cust_name", "客户");
		dto.put("order_id", "订单");
		dto.put("style_no", "款号");
		dto.put("article", "品名");
		dto.put("sendout_b_product", "出运B品");
		dto.put("sendout_b_product_a_count", "出运A类B品数");
		dto.put("sendout_b_product_b_count", "出运B类B品数");
		dto.put("sendout_b_product_c_count", "出运C类B品数");
		dto.put("receive_b_depot", "B品库收B品");
		dto.put("receive_b_depot_a_count", "出运A类B品数");
		dto.put("receive_b_depot_b_count", "出运B类B品数");
		dto.put("receive_b_depot_c_count", "出运C类B品数");
		dto.put("sendout_b_depot", "B品库出B品");
		dto.put("sendout_b_depot_a_count", "出运A类B品数");
		dto.put("sendout_b_depot_b_count", "出运B类B品数");
		dto.put("sendout_b_depot_c_count", "出运C类B品数");
		dto.put("remark", "备注");
		return dto;
	}
	/**
	 * 将日期转化为周信息（按照自然周来分组）
	 * @param startDate
	 * @param endDate
	 * @return 返回Map<String,Object>集合 <br/>
	 * key：weekList 指的是有序的周信息集合   格式year-weekNum<br/>
	 * key:week2DateInfo 周信息-日期集合Map
	 */
	public Map<String,Object>  dateToWeekInfoByNaturally(String startDateStr,String endDateStr)throws Exception{
		Map<String,Object> weekInfo = new HashMap<String,Object>();
		//周信息 集合 ，有顺序
		List<String> weekList = new ArrayList<String>();
		//周信息-具体日期，无顺序
		Map<String,List<String>> weekNum2Date = new HashMap<String,List<String>>();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Date startDate = sdf.parse(startDateStr);
		Date endDate = sdf.parse(endDateStr);
		
		Calendar startDateCal = Calendar.getInstance();
		Calendar endDateCal = Calendar.getInstance();
		startDateCal.setTime(startDate);
		endDateCal.setTime(endDate);
		String weekNumFull = "";
		//将周期和日历对应
		while(!startDateCal.after(endDateCal)){
			String week = startDateCal.get(Calendar.WEEK_OF_YEAR)+"";
			String yeal = startDateCal.get(Calendar.YEAR)+"";
			String temp = yeal+"-"+week;
			if(!temp.equals(weekNumFull)){
				weekNumFull = temp;
				weekList.add(temp);
				List<String> dateList = new ArrayList<String>();
				dateList.add(sdf.format(startDateCal.getTime()));
				weekNum2Date.put(temp, dateList);
			}else{
				List<String> dateList = weekNum2Date.get(temp);
				dateList.add(sdf.format(startDateCal.getTime()));
			}
			startDateCal.add(Calendar.DAY_OF_YEAR, 1);
		}
		weekInfo.put("weekList", weekList);
		weekInfo.put("week2DateInfo", weekNum2Date);
		return weekInfo;
	}
	/**
	 * 将日期转化为周信息（按照开始日期 7天为一周）
	 * @param startDate
	 * @param endDate
	 * @return 返回Map<String,Object>集合 <br/>
	 * key：weekList 指的是有序的周信息集合   格式year-weekNum <br/>
	 * key:week2DateInfo 周信息-日期集合Map
	 */
	public Map<String,Object> dateToWeekInfoByDay(String startDateStr,String endDateStr)throws Exception{
		Map<String,Object> weekInfo = new HashMap<String,Object>();
		//周信息 集合 ，有顺序
		List<String> weekList = new ArrayList<String>();
		//周信息-具体日期，无顺序
		Map<String,List<String>> weekNum2Date = new HashMap<String,List<String>>();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Date startDate = sdf.parse(startDateStr);
		Date endDate = sdf.parse(endDateStr);
		
		Calendar startDateCal = Calendar.getInstance();
		Calendar endDateCal = Calendar.getInstance();
		startDateCal.setTime(startDate);
		endDateCal.setTime(endDate);
		String currentWeek = "";
		int weekIdx = 0;
		//将周期和日历对应
		while(!startDateCal.after(endDateCal)){
			String temp = weekIdx/7 + "";
			if(!currentWeek.equals(temp)){
				currentWeek = temp;
				List<String> weekDate = new ArrayList<String>();
				weekDate.add(sdf.format(startDateCal.getTime()));
				weekList.add(temp);
				weekNum2Date.put(temp, weekDate);
			}else {
				List<String> weekDate = weekNum2Date.get(temp);
				weekDate.add(sdf.format(startDateCal.getTime()));
			}
			weekIdx++;
			startDateCal.add(Calendar.DAY_OF_YEAR, 1);
		}
		weekInfo.put("weekList", weekList);
		weekInfo.put("week2DateInfo", weekNum2Date);
		return weekInfo;
	}
	/**
	 * B品收发报表
	 */
	public Dto BReportExcel(Dto inDto) throws ApplicationException {
		Dto outDto=new BaseDto();
		try {
			//SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			//Date startDate =(Date) (inDto.getAsString("startdate")==null?"":sdf.parse(inDto.getAsString("startdate")));
			//Date endDate =(Date) (inDto.getAsString("enddate")==null?"":sdf.parse(inDto.getAsString("enddate")));
			//qDto.put("startdate", startDate);
			//qDto.put("enddate", endDate);
			List list=g4Dao.queryForList("query4BReport", inDto);
			//转换数量性质
			for (int i = 0; i < list.size(); i++) {
				Dto iDto=(Dto) list.get(i);
				String nature=NatureUtil.parseNC2natureEn(iDto.getAsString("nature"));
				iDto.put(nature+"_a_count", iDto.getAsString("a_count")==null?"":iDto.getAsString("a_count"));
				iDto.put(nature+"_b_count", iDto.getAsString("b_count")==null?"":iDto.getAsString("b_count"));
				iDto.put(nature+"_c_count", iDto.getAsString("c_count")==null?"":iDto.getAsString("c_count"));
				iDto.put(nature+"_total", iDto.getAsString("total")==null?"":iDto.getAsString("total"));
				iDto.remove("a_count");
				iDto.remove("b_count");
				iDto.remove("c_count");
				iDto.remove("total");
			}
			//拼接记录
			List reportList=new ArrayList();
			for (int i = 0; i < list.size();) {
				Dto idto=(Dto) list.get(i);
				Dto rDto=new BaseDto();
				rDto.putAll(idto);
				for (int j = i; j < list.size(); j++) {
					Dto comdto=(Dto) list.get(j);
					if (idto.getAsString("order_id").equals(comdto.getAsString("order_id"))
							&&idto.getAsString("tr_date").equals(comdto.getAsString("tr_date"))) {
						rDto.putAll(comdto);
						i=j+1;
					}else{
						continue;
					}
				}
				reportList.add(rDto);
			}
			outDto.setDefaultAList(reportList);
			outDto.put("success", true);
			return outDto;
		} catch (Exception e) {
			throw new ApplicationException("获取B品报表失败");
		}
		
	}
	/**
	 * B品库存月报表
	 */
	public Dto storageMonthReport(Dto inDto) throws ApplicationException {
		Dto outDto=new BaseDto();
		try {
			List list=g4Dao.queryForList("BstorageByMonth", inDto);
			List<Dto> mList=new ArrayList();
			//创建一个12月的集合用于填充
			for (int i = 0; i < 13; i++) {
				mList.add(new BaseDto("month",i+"月"));
			}
			//填充收入和送出
			for (int i = 0; i < list.size(); i++) {
				Dto dto=(Dto)(list.get(i));
				if (dto.getAsString("nature").equals("16")) {
					mList.get(Integer.parseInt(dto.getAsString("datem").substring(5,7))).put("receiveM", dto.getAsString("amount"));
					mList.get(Integer.parseInt(dto.getAsString("datem").substring(5,7))).put("receiveM_a", dto.getAsString("a_amount"));
				}else{
				mList.get(Integer.parseInt(dto.getAsString("datem").substring(5,7))).put("sendoutM", dto.getAsString("amount"));
				mList.get(Integer.parseInt(dto.getAsString("datem").substring(5,7))).put("sendoutM_a", dto.getAsString("a_amount"));
				}
			}
			//填充上月结存和合计
			if (list.size()>0) {
			Dto totalDto=(Dto)(mList.get(0));
			for (int i = 1; i < 13; i++) {
				Dto dto=(Dto)(mList.get(i));
				Dto preDto=(Dto)(mList.get(i-1));
				dto.put("mStorage", getNum4Null(dto,"receiveM")-getNum4Null(dto,"sendoutM")+getNum4Null(preDto,"mStorage"));
				dto.put("mStorage_a", getNum4Null(dto,"receiveM_a")-getNum4Null(dto,"sendoutM_a")+getNum4Null(preDto,"mStorage_a"));
				totalDto.put("receiveM",getNum4Null(totalDto,"receiveM")+getNum4Null(dto,"receiveM"));
				totalDto.put("sendoutM",getNum4Null(totalDto,"sendoutM")+getNum4Null(dto,"sendoutM"));
			}
			Dto tmpDto=mList.get(0);
			tmpDto.put("month", "合计");
			mList.remove(0);
			mList.add(tmpDto);
			outDto.setDefaultAList(mList);
			}else{
				outDto.put("success", false);
				outDto.put("msg", "没有当月的交接记录");
			}
		} catch (Exception e) {
			e.printStackTrace();
			throw new ApplicationException("获取B品库存表失败");
		}
		return outDto;
	}
	/**
	 * B品库存日报表
	 */
	public Dto storageDayReport(Dto inDto) throws ApplicationException {
		Dto outDto=new BaseDto();
		try {
			List list=g4Dao.queryForList("BstorageByDay", inDto);
			List<Dto> dList=new ArrayList();
			//创建一个31天的集合用于填充
			for (int i = 0; i < 32; i++) {
				dList.add(new BaseDto("day",i));
			}
			//填充收入和送出
			for (int i = 0; i < list.size(); i++) {
				Dto dto=(Dto)(list.get(i));
				if (dto.getAsString("nature").equals("16")) {
					dList.get(Integer.parseInt(dto.getAsString("dated").substring(4,6))).put("receiveD", dto.getAsString("amount"));
					dList.get(Integer.parseInt(dto.getAsString("dated").substring(4,6))).put("receiveD_a", dto.getAsString("a_amount"));
				};
				if (dto.getAsString("nature").equals("17")){
					dList.get(Integer.parseInt(dto.getAsString("dated").substring(4,6))).put("sendoutD", dto.getAsString("amount"));
					dList.get(Integer.parseInt(dto.getAsString("dated").substring(4,6))).put("sendoutD_a", dto.getAsString("a_amount"));
				};
			}
			//填充昨天结存和合计
			if (list.size()>0) {
				Dto totalDto=(Dto)(dList.get(0));
				for (int i = 1; i < 32; i++) {
					Dto dto=(Dto)(dList.get(i));
					Dto preDto=(Dto)(dList.get(i-1));
					dto.put("dStorage", getNum4Null(dto,"receiveD")-getNum4Null(dto,"sendoutD")+getNum4Null(preDto,"dStorage"));
					dto.put("dStorage_a", getNum4Null(dto,"receiveD_a")-getNum4Null(dto,"sendoutD_a")+getNum4Null(preDto,"dStorage_a"));
					totalDto.put("receiveD",getNum4Null(totalDto,"receiveD")+getNum4Null(dto,"receiveD"));
					totalDto.put("sendoutD",getNum4Null(totalDto,"sendoutD")+getNum4Null(dto,"sendoutD"));
					totalDto.put("dStorage_a",getNum4Null(totalDto,"dStorage_a")+getNum4Null(dto,"dStorage_a"));
				}
				Dto tmpDto=dList.get(0);
				tmpDto.put("day", "合计");
				dList.remove(0);
				dList.add(tmpDto);
				outDto.setDefaultAList(dList);
			}else{
				outDto.put("success", false);
				outDto.put("msg", "没有当月的交接记录");
			}
		} catch (Exception e) {
			e.printStackTrace();
			throw new ApplicationException("获取B品库存表失败");
		}
		return outDto;
	}
	
	private Integer getNum4Null(Dto dto,String dtoName){
		int num = 0;
		if (dto.getAsInteger(dtoName)!=null) {
			num=dto.getAsInteger(dtoName);
		}
		return num;
	}
}
