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
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.apache.poi.ss.usermodel.Cell;

/**
 * Excel数据读取器
 * 
 * @author XiongChun
 * @since 2010-08-12
 */
@SuppressWarnings({"rawtypes","unchecked"})
public class ExcelReader {
	private String metaData = null;
	private InputStream is = null;
	
	public ExcelReader(){};
	
	/**
	 * 构造函数
	 * @param pMetaData 元数据
	 * @param pIs Excel数据流
	 * @throws IOException 
	 * @throws BiffException 
	 */
	public ExcelReader(String pMetaData, InputStream pIs){
		setIs(pIs);
		setMetaData(pMetaData);
	}
	
	public synchronized List read(int pBegin) throws BiffException, IOException,InvalidFormatException{
		Dto outDto = new BaseDto();
		outDto = readByPoi(pBegin,0,"");
		return outDto.getDefaultAList();
	}
	
	public synchronized List read(int pBegin, int pBack) throws BiffException, IOException,InvalidFormatException{
		Dto outDto = new BaseDto();
		outDto = readByPoi(pBegin,pBack,"");
		return outDto.getDefaultAList();
	}
	
	public synchronized Dto read(int pBegin, int pBack,String keyWord) throws BiffException, IOException,InvalidFormatException{
		Dto outDto = new BaseDto();
		outDto = readByPoi(pBegin,pBack,keyWord);
		return outDto;
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
//	public Dto readByJxl(int pBegin, int pBack,String keyWord) throws BiffException, IOException{
//		Dto outDto = new BaseDto();
//		List list = new ArrayList();
//		String keyString = "";
//		StringBuffer sb = new StringBuffer();
//		jxl.Workbook workbook = jxl.Workbook.getWorkbook(getIs());
//		jxl.Sheet sheet = workbook.getSheet(0);
//		int rows = sheet.getRows();
//		for (int i = pBegin; i < rows - pBack; i++) {
//			Dto rowDto = new BaseDto();
//			jxl.Cell[] cells = sheet.getRow(i);
//			for (int j = 0; j < cells.length; j++) {
//				String[] meteDatas = getMetaData().trim().split(",");
//				String key = meteDatas[j];
//				if(keyWord.equals(key)){
//					sb.append("'"+cells[j].getContents()+"',");
//				}
//				if(G4Utils.isNotEmpty(key)) 
//					rowDto.put(key, cells[j].getContents());
//			}
//			list.add(rowDto);
//		}
//		
//		if(sb.length()!=0){
//			keyString = sb.toString().substring(0, sb.length()-1);
//		}
//		
//		workbook.close();
//		outDto.put("keyString", keyString);
//		outDto.setDefaultAList(list);
//		return outDto;
//	}

	/**
	 * 读取Excel数据
	 * @param pBegin 从第几行开始读数据<br>
	 * <b>注意下标索引从0开始的哦!</b>
	 * </br>过滤空行，如果有空行就不再解析
	 * @param pBack 工作表末尾减去的行数
	 * @return 以List<BaseDTO>形式返回数据
	 * @throws BiffException
	 * @throws IOException
	 */
    public Dto readByPoi(int pBegin, int pBack,String keyWord) throws IOException,InvalidFormatException{
		Dto outDto = new BaseDto();
		
		List list = new ArrayList();
		String keyString = "";
		StringBuffer sb = new StringBuffer();
		
		String[] keys = getMetaData().trim().split(",");
		
		org.apache.poi.ss.usermodel.Workbook workbook = WorkbookFactory.create(getIs());
		org.apache.poi.ss.usermodel.Sheet sheet = workbook.getSheetAt(0);
		int rows = sheet.getPhysicalNumberOfRows(), cellNum;
		org.apache.poi.ss.usermodel.Row row;
		row = sheet.getRow(0);
		cellNum = row.getPhysicalNumberOfCells();
		for (int i = pBegin; i < rows - pBack; i++) {
			Dto rowDto = new BaseDto();
			System.out.println(i);
			row = sheet.getRow(i);
			if(row==null){
			    break;
			}
			boolean isEmpty = true;  //空行过滤标识
		
			for (int j = 0; j < cellNum; j++) {
				//不读取长度大于提供的关键字列表的长度的
				if(j>=keys.length){
					break;
				}
				
				String key = keys[j];
				org.apache.poi.ss.usermodel.Cell  cell = row.getCell(j, Row.CREATE_NULL_AS_BLANK);
				Object value =null;
				switch (cell.getCellType()) {
					case Cell.CELL_TYPE_BLANK:
						value = "";
						break;
					case Cell.CELL_TYPE_BOOLEAN:
						value = Boolean.toString(cell.getBooleanCellValue());
						break;
					// 数值
					case Cell.CELL_TYPE_NUMERIC:
						if (DateUtil.isCellDateFormatted(cell)) {
                            double d = cell.getNumericCellValue();
                            value = DateUtil.getJavaDate(d);
						} else {
							cell.setCellType(Cell.CELL_TYPE_STRING);
							String temp = cell.getStringCellValue();
							// 判断是否包含小数点，如果不含小数点，则以字符串读取，如果含小数点，则转换为Double类型的字符串
							if (temp.indexOf(".") > -1) {
								value = String.valueOf(new Double(temp)).trim();
							} else {
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
						if (value != null) {
							value = ((String)value).replaceAll("#N/A", "").trim();
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
					isEmpty = false;   //修改空行标识标识为不空行
				}
			}
			if (isEmpty) {
                break;
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
	
	/**
	 * 读取Excel数据
	 * @param pBegin 从第几行开始读数据<br>
	 * <b>注意下标索引从0开始的哦!</b>
	 * @param pBack 工作表末尾减去的行数
	 * @return 以List<BaseDTO>形式返回数据
	 * @throws BiffException
	 * @throws IOException
	 */
    public Dto readByPoi4Key(int pBegin, int pBack,String keyWord) throws IOException,InvalidFormatException{
		Dto outDto = new BaseDto();

		List list = new ArrayList();
		Dto keyWordDto = new BaseDto();//关键字的映射
		StringBuffer sb = new StringBuffer();

		String[] keys = getMetaData().trim().split(",");

		org.apache.poi.ss.usermodel.Workbook workbook = WorkbookFactory.create(getIs());
		org.apache.poi.ss.usermodel.Sheet sheet = workbook.getSheetAt(0);
		int rows = sheet.getPhysicalNumberOfRows(), cellNum;
		org.apache.poi.ss.usermodel.Row row;
		for (int i = pBegin; i < rows - pBack; i++) {
			Dto rowDto = new BaseDto();
			row = sheet.getRow(i);
			cellNum = row.getPhysicalNumberOfCells();
			for (int j = 0; j < cellNum; j++) {
				//不读取长度大于提供的关键字列表的长度的
				if(j>=keys.length){
					break;
				}

				String key = keys[j];
				org.apache.poi.ss.usermodel.Cell  cell = row.getCell(j, Row.CREATE_NULL_AS_BLANK);
				Object value =null;
				switch (cell.getCellType()) {
					case Cell.CELL_TYPE_BLANK:
						value = "";
						break;
					case Cell.CELL_TYPE_BOOLEAN:
						value = Boolean.toString(cell.getBooleanCellValue());
						break;
					// 数值
					case Cell.CELL_TYPE_NUMERIC:
						if (DateUtil.isCellDateFormatted(cell)) {
                            double d = cell.getNumericCellValue();
                            value = DateUtil.getJavaDate(d);
						} else {
							cell.setCellType(Cell.CELL_TYPE_STRING);
							String temp = cell.getStringCellValue();
							// 判断是否包含小数点，如果不含小数点，则以字符串读取，如果含小数点，则转换为Double类型的字符串
							if (temp.indexOf(".") > -1) {
								value = String.valueOf(new Double(temp)).trim();
							} else {
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
						if (value != null) {
							value = ((String)value).replaceAll("#N/A", "").trim();
						}
						break;
					default:
						value = "";
						break;
				}
				if (G4Utils.isNotEmpty(value)) {
					if(keyWord.equals(key)){
                        keyWordDto.put(value,"");
					}
					rowDto.put(key, value);
				}
			}
			list.add(rowDto);
		}

		outDto.put("keyWordDto", keyWordDto);
		outDto.setDefaultAList(list);
		return outDto;
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
