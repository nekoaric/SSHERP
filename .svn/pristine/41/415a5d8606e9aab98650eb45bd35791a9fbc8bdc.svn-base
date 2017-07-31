package org.eredlab.g4.rif.report.excel;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import com.cnnct.util.G4Utils;
import jxl.read.biff.BiffException;

import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.apache.poi.ss.usermodel.Cell;

/**
 * Excel数据读取器
 * 
 * @author XiongChun
 * @since 2010-08-12
 */
public class ExcelReader_back {
	private String metaData = null;
	private InputStream is = null;
	
	public ExcelReader_back(){};
	
	/**
	 * 构造函数
	 * @param pMetaData 元数据
	 * @param pIs Excel数据流
	 * @throws IOException 
	 * @throws BiffException 
	 */
	public ExcelReader_back(String pMetaData, InputStream pIs){
		setIs(pIs);
		setMetaData(pMetaData);
	}
	
	/**
	 * 读取Excel数据
	 * @param pBegin 从第几行开始读数据<br>
	 * <b>注意下标索引从0开始的哦!
	 * @return 以List<BaseDTO>形式返回数据
	 * @throws BiffException
	 * @throws IOException
	 */
	public synchronized List read(int pBegin) throws BiffException, IOException{
		List list = new ArrayList();
		jxl.Workbook workbook = jxl.Workbook.getWorkbook(getIs());
		jxl.Sheet sheet = workbook.getSheet(0);
		int rows = sheet.getRows();
		for (int i = pBegin; i < rows; i++) {
			Dto rowDto = new BaseDto();
			jxl.Cell[] cells = sheet.getRow(i);
			for (int j = 0; j < cells.length; j++) {
				String key = getMetaData().trim().split(",")[j];
				if(G4Utils.isNotEmpty(key)) 
					rowDto.put(key, cells[j].getContents());
			}
			list.add(rowDto);
		}
		workbook.close();
		return list;
	}
	
	/**
	 * 读取Excel数据
	 * @param pBegin 从第几行开始读数据<br>
	 * <b>注意下标索引从0开始的哦!</b>
	 * @param pBack 工作表末尾减去的行数
	 * @return 以List<BaseDTO>形式返回数据
	 * @throws BiffException
	 * @throws IOException
	 */
	public synchronized List read(int pBegin, int pBack) throws BiffException, IOException{
		List list = new ArrayList();
		jxl.Workbook workbook = jxl.Workbook.getWorkbook(getIs());
		jxl.Sheet sheet = workbook.getSheet(0);
		int rows = sheet.getRows();
		for (int i = pBegin; i < rows - pBack; i++) {
			Dto rowDto = new BaseDto();
			jxl.Cell[] cells = sheet.getRow(i);
			for (int j = 0; j < cells.length; j++) {
				String[] meteDatas = getMetaData().trim().split(",");
				String key = meteDatas[j];
				if(G4Utils.isNotEmpty(key))
					rowDto.put(key, cells[j].getContents());
			}
			list.add(rowDto);
		}
		workbook.close();
		return list;
	}
	
	/**
	 * 读取Excel数据
	 * @param pBegin 从第几行开始读数据<br>
	 * <b>注意下标索引从0开始的哦!</b>
	 * @param pBack 工作表末尾减去的行数
	 * @param keyWord 关键字,用于返回时判断使用哪个key
	 * @return Dto中DefaultAList中存放的是读取的list,keyString中存放的是list中对应关键字的字符串格式为'value1','value2',...
	 * @throws BiffException
	 * @throws IOException
	 */
	public synchronized Dto read(int pBegin, int pBack,String keyWord) throws BiffException, IOException{
		Dto outDto = new BaseDto();
		List list = new ArrayList();
		String keyString = "";
		StringBuffer sb = new StringBuffer();
		jxl.Workbook workbook = jxl.Workbook.getWorkbook(getIs());
		jxl.Sheet sheet = workbook.getSheet(0);
		int rows = sheet.getRows();
		for (int i = pBegin; i < rows - pBack; i++) {
			Dto rowDto = new BaseDto();
			jxl.Cell[] cells = sheet.getRow(i);
			for (int j = 0; j < cells.length; j++) {
				String[] meteDatas = getMetaData().trim().split(",");
				String key = meteDatas[j];
				if(keyWord.equals(key)){
					sb.append("'"+cells[j].getContents()+"',");
				}
				if(G4Utils.isNotEmpty(key)) 
					rowDto.put(key, cells[j].getContents());
			}
			list.add(rowDto);
		}
		
		if(sb.length()!=0){
			keyString = sb.toString().substring(0, sb.length()-1);
		}
		
		workbook.close();
		outDto.put("keyString", keyString);
		outDto.setDefaultAList(list);
		return outDto;
	}
	
	/**
	 * 读取Excel数据
	 * @param pBegin 从第几行开始读数据<br>
	 * <b>注意下标索引从0开始的哦!</b>
	 * @param pBack 工作表末尾减去的行数
	 * @return 以List<BaseDTO>形式返回数据
	 * @throws BiffException
	 * @throws IOException
	 */
	public synchronized List readByPoi(int pBegin, int pBack) throws IOException{
		List list = new ArrayList();
		
		XSSFWorkbook workbook = new XSSFWorkbook(getIs());
		XSSFSheet sheet = workbook.getSheetAt(0);
		int rows = sheet.getPhysicalNumberOfRows(), cellNum;
		XSSFRow row;
		for (int i = pBegin; i < rows - pBack; i++) {
			Dto rowDto = new BaseDto();
			row = sheet.getRow(i);
			cellNum = row.getPhysicalNumberOfCells();
			for (int j = 0; j < cellNum; j++) {
				String key = getMetaData().trim().split(",")[j];
				if (G4Utils.isNotEmpty(key)) {
					XSSFCell cell = row.getCell(j);
					rowDto.put(key, cell.toString());
				}
			}
			list.add(rowDto);
		}
		return list;
	}
	

	/**
	 * 读取Excel数据
	 * @param pBegin 从第几行开始读数据<br>
	 * <b>注意下标索引从0开始的哦!</b>
	 * @param pBack 工作表末尾减去的行数
	 * @return 以List<BaseDTO>形式返回数据
	 * @throws BiffException
	 * @throws IOException
	 */
	public synchronized Dto readByPoi(int pBegin, int pBack,String keyWord) throws IOException{
		Dto outDto = new BaseDto();
		
		List list = new ArrayList();
		String keyString = "";
		StringBuffer sb = new StringBuffer();
		XSSFWorkbook workbook = new XSSFWorkbook(getIs());
		XSSFSheet sheet = workbook.getSheetAt(0);
		int rows = sheet.getPhysicalNumberOfRows(), cellNum;
		XSSFRow row;
		for (int i = pBegin; i < rows - pBack; i++) {
			Dto rowDto = new BaseDto();
			row = sheet.getRow(i);
			cellNum = row.getPhysicalNumberOfCells();
			for (int j = 0; j < cellNum; j++) {
				String key = getMetaData().trim().split(",")[j];
				Cell cell = row.getCell(i, Row.CREATE_NULL_AS_BLANK);
				String value ="";
	             switch(cell.getCellType()){
	               case Cell.CELL_TYPE_BLANK:
	            	   value = "";
	                 break;
	               case Cell.CELL_TYPE_BOOLEAN:
	            	   value = Boolean.toString(cell.getBooleanCellValue());
	                 break;
	                //数值
	               case Cell.CELL_TYPE_NUMERIC:               
	                 if(DateUtil.isCellDateFormatted(cell)){
	                	 value = String.valueOf(cell.getDateCellValue());
	                 }else{ 
	                   cell.setCellType(Cell.CELL_TYPE_STRING);
	                   String temp = cell.getStringCellValue();
	                   //判断是否包含小数点，如果不含小数点，则以字符串读取，如果含小数点，则转换为Double类型的字符串
	                   if(temp.indexOf(".")>-1){
	                	   value = String.valueOf(new Double(temp)).trim();
	                   }else{
	                	   value = temp.trim();
	                   }
	                 }
	                 break;
	               case Cell.CELL_TYPE_STRING:
	            	   value = cell.getStringCellValue().trim();
	                 break;
	               case Cell.CELL_TYPE_ERROR:
	            	   value = "";
	                 break;  
	               case Cell.CELL_TYPE_FORMULA:
	                 cell.setCellType(Cell.CELL_TYPE_STRING);
	                 value = cell.getStringCellValue();
	                 if(value!=null){
	                	 value = value.replaceAll("#N/A","").trim();
	                 }
	                 break;  
	               default:
	            	   value = "";
	                 break;
	             }
				if (G4Utils.isNotEmpty(value)) {
					if(keyWord.equals(key)){
						sb.append("'"+value+"',");
					}
					rowDto.put(key, value);
				}
			}
			list.add(rowDto);
		}
		
		if(sb.length()!=0){
			keyString = sb.toString().substring(0, sb.length()-1);
		}
		
		outDto.put("keyString", keyString);
		outDto.setDefaultAList(list);
		return outDto;
	}
//	public synchronized Dto readByPoi(int pBegin, int pBack,String keyWord) throws IOException{
//		Dto outDto = new BaseDto();
//		
//		List list = new ArrayList();
//		String keyString = "";
//		StringBuffer sb = new StringBuffer();
//		XSSFWorkbook workbook = new XSSFWorkbook(getIs());
//		XSSFSheet sheet = workbook.getSheetAt(0);
//		int rows = sheet.getPhysicalNumberOfRows(), cellNum;
//		XSSFRow row;
//		for (int i = pBegin; i < rows - pBack; i++) {
//			Dto rowDto = new BaseDto();
//			row = sheet.getRow(i);
//			cellNum = row.getPhysicalNumberOfCells();
//			for (int j = 0; j < cellNum; j++) {
//				String key = getMetaData().trim().split(",")[j];
//				
//				if (G4Utils.isNotEmpty(key)) {
//					XSSFCell cell = row.getCell(j);
//					if(keyWord.equals(key)){
//						sb.append("'"+cell.toString()+"',");
//					}
//					
//					rowDto.put(key, cell.toString());
//				}
//			}
//			list.add(rowDto);
//		}
//		
//		if(sb.length()!=0){
//			keyString = sb.toString().substring(0, sb.length()-1);
//		}
//		
//		outDto.put("keyString", keyString);
//		outDto.setDefaultAList(list);
//		return outDto;
//	}
	
	public synchronized List readByPoi2(int pBegin, int pBack) throws IOException, InvalidFormatException{
		List list = new ArrayList();
		
		org.apache.poi.ss.usermodel.Workbook workbook = WorkbookFactory.create(getIs());
		org.apache.poi.ss.usermodel.Sheet sheet = workbook.getSheetAt(0);
		int rows = sheet.getPhysicalNumberOfRows(), cellNum;
		org.apache.poi.ss.usermodel.Row row;
		for (int i = pBegin; i < rows - pBack; i++) {
			Dto rowDto = new BaseDto();
			row = sheet.getRow(i);
			cellNum = row.getPhysicalNumberOfCells();
			for (int j = 0; j < cellNum; j++) {
				String key = getMetaData().trim().split(",")[j];
				if (G4Utils.isNotEmpty(key)) {
					org.apache.poi.ss.usermodel.Cell cell = row.getCell(j);
					rowDto.put(key, cell.toString());
				}
			}
			list.add(rowDto);
		}
		return list;
	}

	public InputStream getIs() {
		return is;
	}

	public void setIs(InputStream is) {
		this.is = is;
	}

	public String getMetaData() {
		return metaData;
	}

	public void setMetaData(String metaData) {
		this.metaData = metaData;
	};
}
