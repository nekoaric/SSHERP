package com.cnnct.util.excel2007;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.xssf.eventusermodel.XSSFReader;
import org.apache.poi.xssf.model.SharedStringsTable;
import org.apache.poi.xssf.model.StylesTable;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.openxmlformats.schemas.spreadsheetml.x2006.main.CTXf;
import org.xml.sax.InputSource;
import org.xml.sax.XMLReader;
import org.xml.sax.helpers.XMLReaderFactory;


/**
 * 解析文件的信息
 * @author zhouww
 * @since 2015-1-20
 * <2015-01-28  增加GC处理，使得在解析过程中产生的高内存能够及时释放>
 */
public class ParseExcel2007Control {
    // 解析数据的开关
    private ParseExcel2007Mode mode = new ParseExcel2007Mode();
    
    public ParseExcel2007Control(ParseExcel2007Mode mode) {
        super();
        this.mode = mode;
    }

    public ParseExcel2007Control() {
        super();
    }

    /**
     * 解析指定文件的表
     * @param fis
     * @param rId 表的ID
     * @return
     * @throws Exception
     */ 
    public  List<List<String>> parseSheetData(InputStream fis,String rId)throws Exception{
        // 获取解析资源
        OPCPackage pkg = OPCPackage.open(fis);
        XSSFReader r = new XSSFReader(pkg);
        SharedStringsTable sst = r.getSharedStringsTable();
        
        
//        StylesTable st = r.getStylesTable();    // 获取样式表 
//        // 考虑 怎么样获取样式，获取是否是日期的判断  
//        CTXf ctxf = st.getCellXfAt(1923);   // 指定样式的格式
//        
//        st.getNumberFormatAt(idx)
        // XSSFCellStyle 可以获取CTXf 但是 CTXf不能获取XSSFCellStyle
//        XSSFCellStyle cellStyle = st.getStyleAt(1923);
//        String dStr = cellStyle.getDataFormatString();
//        cellStyle.
//        DateUtil.isADateFormat(1924, dStr);
        
        
        // 解析 方式
        XMLReader parser = XMLReaderFactory
                .createXMLReader("org.apache.xerces.parsers.SAXParser");
        ParseSheetsExcel2007Mode2DH dhMode2 = new ParseSheetsExcel2007Mode2DH(sst,mode);
        parser.setContentHandler(dhMode2);

        InputStream sheet2 = r.getSheet(rId);
        InputSource sheetSource = new InputSource(sheet2);
        // 解析资源
        try{
            parser.parse(sheetSource);
        }catch(Exception e){
            e.printStackTrace();
        }
        sheet2.close();
        clearSpace();
        return dhMode2.getResultList();
    }
    
    /**
     * 解析指定表的行
     * @param fis
     * @param rId 表的ID
     * @return
     * @throws Exception
     */ 
    public  List<String> parseSheetData4rowIdx(InputStream fis,String rId,int rowIdx)throws Exception{
        // 获取解析资源
        OPCPackage pkg = OPCPackage.open(fis);
        XSSFReader r = new XSSFReader(pkg);
        
        SharedStringsTable sst = r.getSharedStringsTable();
        
        // 解析 方式
        XMLReader parser = XMLReaderFactory
                .createXMLReader("org.apache.xerces.parsers.SAXParser");
        ParseSheetsExcel2007RowDH rowDH = new ParseSheetsExcel2007RowDH(sst,mode);
        rowDH.setAppointRowIdx(rowIdx);
        parser.setContentHandler(rowDH);

        InputStream sheet2 = r.getSheet(rId);
        InputSource sheetSource = new InputSource(sheet2);
        // 解析资源
        try{
            parser.parse(sheetSource);
        }catch(Exception e){
            e.printStackTrace();
        }
        sheet2.close();
        clearSpace();
        return rowDH.getRowData();
    }
    
    
    /**
     * 解析指定表的行
     * @param fis
     * @param rId 表的ID
     * @return
     * @throws Exception
     */ 
    public  List<String> parseSheetTTTTTTTTT(InputStream fis,String rId,int rowIdx)throws Exception{
        // 获取解析资源
        OPCPackage pkg = OPCPackage.open(fis);
        XSSFReader r = new XSSFReader(pkg);
        
        
        SharedStringsTable sst = r.getSharedStringsTable();
        
        // 解析 方式
        XMLReader parser = XMLReaderFactory
                .createXMLReader("org.apache.xerces.parsers.SAXParser");
        ParseSheetsExcel2007RowDH rowDH = new ParseSheetsExcel2007RowDH(sst,mode);
        rowDH.setAppointRowIdx(rowIdx);
        parser.setContentHandler(rowDH);

        InputStream sheet2 = r.getSheet(rId);
        InputSource sheetSource = new InputSource(sheet2);
        // 解析资源
        try{
            parser.parse(sheetSource);
        }catch(Exception e){
            e.printStackTrace();
        }
        sheet2.close();
        clearSpace();
        return rowDH.getRowData();
    }
    
    /**
     * 解析workbook的sheets信息
     * @return
     * @throws Exception
     */
    public List<Map<String,String>> parseSheetsInfo(InputStream fis)throws Exception{
        // 获取解析资源
        OPCPackage pkg = OPCPackage.open(fis);
        XSSFReader r = new XSSFReader(pkg);
        InputStream is = r.getWorkbookData();
        
        // 解析 方式
        XMLReader parser = XMLReaderFactory
                .createXMLReader("org.apache.xerces.parsers.SAXParser");
        ParseWorkBookExcel2007DH wbdh = new ParseWorkBookExcel2007DH();
        parser.setContentHandler(wbdh);
        
        InputSource iSource = new InputSource(is);
        parser.parse(iSource);
        is.close();
        clearSpace();
        return wbdh.getSheetsInfo();
        
    }
    
    /**
     * 解析指定文件的表
     * @param fis
     * @param rId 表的ID
     * @return
     * @throws Exception
     */ 
    public  List<List<String>> parseSheetData(File file,String rId)throws Exception{
        List<List<String>> resultList = parseSheetData(new FileInputStream(file), rId);
        clearSpace();
        return resultList;
    }
    
    /**
     * 解析指定表的行
     * @param fis
     * @param rId 表的ID
     * @return
     * @throws Exception
     */ 
    public  List<String> parseSheetData(File file,String rId,int rowIdx)throws Exception{
        List<String> resultList = parseSheetData4rowIdx(new FileInputStream(file), rId,rowIdx);
        clearSpace();
        return resultList;
    }
    
    /**
     * 解析workbook的sheets信息
     * @return
     * @throws Exception
     */
    public List<Map<String,String>> parseSheetsInfo(File file)throws Exception{
        List<Map<String,String>> resultList = parseSheetsInfo(new FileInputStream(file));
        clearSpace();
        return resultList;
    }
    /**
     * 垃圾回收
     * 防止延迟的垃圾回收  影响内存
     */
    private void clearSpace(){
        System.gc();
    }
}
