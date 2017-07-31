package com.cnnct.util;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.cnnct.util.excel2007.ParseExcel2007Util;

/**
 * excel文档解析
 * @author zhouww
 *
 */
public class ExcelUtil {

    /**
     * 从excel中读取数据到list
     *
     * @param pIs
     * @return
     * @throws IOException
     * @throws InvalidFormatException
     */
    public static List<List<String>> readByPoi(InputStream pIs) throws IOException, InvalidFormatException {
        Dto outDto = new BaseDto();

        List<List<String>> list = new ArrayList<List<String>>();
        StringBuffer sb = new StringBuffer();

        org.apache.poi.ss.usermodel.Workbook workbook = WorkbookFactory.create(pIs);
        org.apache.poi.ss.usermodel.Sheet sheet = workbook.getSheetAt(0);
        //取第一个显示sheet 默认选取第一个
        for (int i=0, sheetNumber = workbook.getNumberOfSheets();i<sheetNumber;i++){
            sheet = workbook.getSheetAt(i);
            if(sheet.isSelected()){break;};
        }
        
        int rows = sheet.getPhysicalNumberOfRows(), cellNum;
        org.apache.poi.ss.usermodel.Row row;
        for (int i = 0; i < rows; i++) {
            System.out.println("第"+i+"行");
            List<String> rowList = new ArrayList<String>();
            row = sheet.getRow(i);
            if(row==null){
                continue;
            }
            cellNum = row.getPhysicalNumberOfCells();
            for (int j = 0; j < cellNum; j++) {
                Cell cell = row.getCell(j, Row.CREATE_NULL_AS_BLANK);
                Object value = cell2value(cell);
                rowList.add(value.toString());
            }

            list.add(rowList);
        }

        return list;
    }
    //遍历工作薄读取
    public static List<List> readByPoi2(InputStream pIs) throws IOException, InvalidFormatException {
        Dto outDto = new BaseDto();
        List<List> list = new ArrayList<List>();
        StringBuffer sb = new StringBuffer();

        org.apache.poi.ss.usermodel.Workbook workbook = WorkbookFactory.create(pIs);
        org.apache.poi.ss.usermodel.Sheet sheet = workbook.getSheetAt(0);
        //取第一个显示sheet 默认选取第一个 排除隐藏通知单
        for (int i=0, sheetNumber = workbook.getNumberOfSheets();i<sheetNumber;i++){
            sheet = workbook.getSheetAt(i);
            if(workbook.isSheetHidden(i)){
            	continue;
            }
            
            //如果表的第二行第一列的值为“区域”则是生产通知单
            Row row1=sheet.getRow(1);
            if (row1==null) {
				continue;
			}
            Cell flagCell = sheet.getRow(1).getCell(0,Row.CREATE_NULL_AS_BLANK);
            if (flagCell.getCellType()!=Cell.CELL_TYPE_STRING) {
				continue;
			}
            String flagValue = flagCell!=null?flagCell.getStringCellValue().trim():"";
            //String sheetName=sheet.getSheetName();
            System.out.println(sheet.getSheetName());
            if("区域".equals(flagValue)){
            	list.add(getSheetList(sheet));
            }else{
            	continue;
            }
        }
        return list;
    }
     
    private static List<List<String>> getSheetList(Sheet sheet){
    	List<List<String>> list = new ArrayList<List<String>>();
    	int rows = sheet.getPhysicalNumberOfRows(), cellNum;
        org.apache.poi.ss.usermodel.Row row;
        for (int i = 0; i < rows; i++) {
            System.out.println("\n第"+(i+1)+"行");
            List<String> rowList = new ArrayList<String>();
            row = sheet.getRow(i);
            if(row==null){
                continue;
            }
            cellNum = row.getPhysicalNumberOfCells();
            for (int j = 0; j < cellNum; j++) {
            	System.out.print("第"+(j+1)+"列");
                Cell cell = row.getCell(j, Row.CREATE_NULL_AS_BLANK);
                Object value = cell2value(cell);
                rowList.add(value.toString());
            }

            list.add(rowList);
        }

        return list;
    }
    
    
    /**
     * 解析文件的指定的行
     * 选择第一个显示的表
     * @param rownum
     * @return
     */
    public Dto parseExcel4Row(InputStream pIs, int rownum)throws Exception{
        Dto dto = new BaseDto();
        
        List<String> colStr = new ArrayList<String>();
        
        Sheet sheet = getSheet(pIs);
        Row row = sheet.getRow(0);
        int idx = 0;
        while(true){   // 由取到空的单元格作为结束标志
            Cell cell = row.getCell(idx++, Row.CREATE_NULL_AS_BLANK);
            Object value = cell2value(cell);
            if(value == null || "".equals(value)){
                break;
            }else{
                colStr.add(value.toString());
            }
        }
        dto.setDefaultAList(colStr);
        return dto;
    }
    
    /**
     * 解析文件获取指定行的数据
     * @param file
     * @param rownum
     * @return
     * @throws Exception
     */
    public Dto parseExcel4Row(File file, int rownum)throws Exception{
        Dto resultDto = new BaseDto();
        List<String> resultList = new ArrayList<String>();
        ParseExcel2007Util pUtil = new ParseExcel2007Util();
        List<String> rowData = pUtil.parseSheetAppointRow(file, rownum);
        
        for (int i = 0; i < rowData.size(); i++) {
            String str = rowData.get(i);
            if("".equals(str)) {
                break;
            }
            resultList.add(str);
        }
        resultDto.setDefaultAList(resultList);
        return resultDto;
    }
    
    /**
     * 获取第一张非隐藏表
     * @param pIs
     * @return
     */
    private Sheet getSheet(InputStream pIs)throws Exception{
        return getSheet(pIs,0);
    }
    /**
     * 获取第index张表
     * @param pIs
     * @param index
     * @param isHidden  isHidden如果是true那么计算隐藏表，如果isHidden是false那么不计算隐藏表
     * @return
     */
    private Sheet getSheet(InputStream pIs,int index,boolean isHidden)throws Exception{

        int total = 0; //总计表
        int sheetIdx = -1;  //遍历时表索引
        int showIdx = -1;    //显示的表索引
//        File file = FileUtil.parseIS2File(pIs);
//        File file = new File("F:\\apache-tomcat-6.0.37\\apache-tomcat-6.0.37\\webapps\\jdurfid\\importTempFile\\80354b35-8dc1-4779-b014-51ba17e2f2f7");
        
        Workbook workbook = WorkbookFactory.create(pIs);
        total = workbook.getNumberOfSheets();
        
        if(total <= index){ //索引大于总表数 返回null
            return null;
        }
        
        Sheet sheet = workbook.getSheetAt(0);
        for (int i=0, sheetNumber = workbook.getNumberOfSheets();i<sheetNumber;i++){
            sheet = workbook.getSheetAt(i);
            if(!workbook.isSheetHidden(i)){
                showIdx ++;
            }
            sheetIdx++;
            if((isHidden && sheetIdx==index)||(!isHidden && showIdx==index)){   //1：计算隐藏表判断所有表索引 2：显示判断显示表索引
                return sheet;
            }
        }
        return null;
    
    
    }
    /**
     * 获取非隐藏表的第index张表
     * @param pIs
     * @param index
     * @return
     */
    private Sheet getSheet(InputStream pIs,int index)throws Exception{
        return getSheet(pIs, index, false);
    }
    
    private static Object cell2value(Cell cell){
        Object value = null;
        switch(cell.getCellType()) {
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
                    value = G4Utils.getDate(DateUtil.getJavaDate(d), "yyyyMMdd");
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
            case Cell.CELL_TYPE_FORMULA://公式                    
                cell.setCellType(Cell.CELL_TYPE_STRING);
                value = cell.getStringCellValue();
                if (value != null) {
                    value = ((String) value).replaceAll("#N/A", "").trim();
                }
                break;
            default:
                value = "";
                break;
        }
        return value;
    }
}
