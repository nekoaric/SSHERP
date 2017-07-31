package com.cnnct.rfid.web.excelParse.ordDayExcelParse;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.struts.upload.FormFile;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.rif.report.excel.ExcelReader;

import com.cnnct.common.ApplicationException;
import com.cnnct.rfid.web.excelParse.OrdDayExcelParseInf;
import com.cnnct.util.excel2007.ParseExcel2007Util;

/**
 * 四列
 * <br>出运成品导入模板
 * 序号，ETD(船期), PO#，数量
 * @author zhouww
 * @since 2015-1-16
 */
public class OrdDayExcelFour implements OrdDayExcelParseInf{
    //流水账导入模板四
    private String metaData = "sequence_number,tr_date,order_id,amount";
    

    private SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
    private Calendar calendar = Calendar.getInstance();
    
    public Dto parseExcel(FormFile file, Dto inDto) throws ApplicationException {
        try {
            
            ExcelReader excelReader = new ExcelReader(metaData, file.getInputStream());
            List list = excelReader.read(0, 0);
            if (list.size() > 0) {
                Dto dto = (Dto) list.get(0);
                if (dto.size() != metaData.split(",").length) {
                    throw new ApplicationException("[模板四]导入文件格式有误,请下载最新文件格式!");
                }
            }
            return parseQueryData(list);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    
    }

    /**
     * POI SAX解析文件
     */
    public Dto parseExcel(File file, Dto inDto) throws Exception {
        try{
            ParseExcel2007Util pUtil = new ParseExcel2007Util();
            List<List<String>> sheetData = pUtil.parseExcel(file);
            List<Dto> list = new ArrayList<Dto>();
            
            String[] colNames = metaData.split(",");
            int colLength = colNames.length;
            for(List<String> rowD : sheetData){
                Dto beanDto = new BaseDto();
                int rowSize = rowD.size();
                for(int idx=0;idx<colLength; idx++){
                    String value = "";
                    if(idx<rowSize){
                        value = rowD.get(idx);
                    }
                    beanDto.put(colNames[idx], value);
                }
                list.add(beanDto);
            }
            
            // 处理日期的格式  如果将来在SAX中处理了日期格式，此步骤可以省略
            for(Dto dto : list){
                String dateNum = dto.getAsString("tr_date");
                try{
                    dto.put("tr_date", parseNum2Date(Double.parseDouble(dateNum)));
                }catch(Exception e){}
            }
            return parseQueryData(list);
        }catch(Exception e){
            e.printStackTrace();
        }
        return null;
    }
    
    /**
     * 将数字转换为日期
     * @param dateNum
     * @return
     */
    private String parseNum2Date(double dateNum){
        // 用POI自带的日期处理类 
        Date date = DateUtil.getJavaDate(dateNum);
        String  dateStr = sdf.format(date);
        return dateStr;
    }
    
    private Dto parseQueryData(List list){
        Dto outDto = new BaseDto();
        List resultList = new ArrayList();
        for(int idx=1; idx<list.size(); idx++){
            Dto dto = (Dto)list.get(idx);
            String nature = "14"; // 
            dto.put("nature", nature);
            //添加行号
            dto.put("row_num", (idx+1));
            resultList.add(dto);
        }
        outDto.setDefaultAList(resultList);
        return outDto;
    }
}
