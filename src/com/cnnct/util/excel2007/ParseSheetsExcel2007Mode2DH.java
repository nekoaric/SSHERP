package com.cnnct.util.excel2007;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.poi.xssf.model.SharedStringsTable;
import org.apache.poi.xssf.usermodel.XSSFRichTextString;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

import com.cnnct.common.ApplicationException;

/**
 * 解析所有的c<单元格> 获取位置信息
 * @author zhouww
 * @since 2015-1-19
 */
public class ParseSheetsExcel2007Mode2DH extends DefaultHandler{
    
    //    解析规则
    private ParseExcel2007Mode mode = new ParseExcel2007Mode();
    
    // 匹配模式
    private static Pattern wordPat = Pattern.compile("(([a-z]|[A-Z])*)(\\d*)");
    
    private SharedStringsTable sst;
    //上一次的内容
    private boolean nextIsString;
    
    // 一行的数据
    private List<String> oneRowData = new ArrayList<String>();   
    
    // 隐藏行标识
    private boolean isHiddenRow = false;
    // 当前单元格的列号
    private int curCol = 0;
    // 当前单元格的行号
    private int curRow = 0;
    
    // 隐藏列标识
    private List<Integer> hiddenCols = new ArrayList<Integer>();
    // sheet的数据
    private List<List<String>> resultList = new ArrayList<List<String>>();
    // 记录行每行之前的隐藏行数量 ：用于处理空单元格的情况下记录信息
    private Map<Integer,Integer> beforeHiddenCols = new HashMap<Integer, Integer>();
    // 内容标志
    private boolean haveValue = false;
    private String cellValue = "";
    
    
    public ParseSheetsExcel2007Mode2DH() {
        super();
    }
    
    public ParseSheetsExcel2007Mode2DH(SharedStringsTable sst) {
        super();
        this.sst = sst;
    }
    public ParseSheetsExcel2007Mode2DH(SharedStringsTable sst, ParseExcel2007Mode mode) {
        super();
        this.sst = sst;
        this.mode = mode;
    }
    


    public void startElement(String uri, String localName, String name,
            Attributes attributes) throws SAXException {
        // c => 单元格 
        if ("c".equals(name)) {
            // 如果下一个元素是 SST的索引，则将nextIsString标记为true
            String optionInfo = attributes.getValue("r");
            String stringFlag = attributes.getValue("t");
            if("s".equals(stringFlag)){
                // 引用格式的单元格
                nextIsString = true;
            }else {
                nextIsString = false;
            }
            String[] optionArr = parseCell4Option(optionInfo);
            curRow = Integer.parseInt(optionArr[1]);
            curCol = Integer.parseInt(optionArr[0]);
            
        }else if("v".equals(name)){
            // v元素存储单元格值，或者是索引
            haveValue = true;
        }else if("row".equals(name)){
            String isHidden = attributes.getValue("hidden");
            if(!(isHidden==null || "null".equals(isHidden))){
                isHiddenRow = true;
            }else {
                isHiddenRow = false;
            }
        }else if("col".equals(name)){   // 解析到行信息
            // 处理隐藏列
            String minIdx = attributes.getValue("min");
            String maxIdx = attributes.getValue("max");
            String hiddenF = attributes.getValue("hidden");
            if(!(hiddenF==null || "null".equals(hiddenF))){
                int startIdx = Integer.parseInt(minIdx);
                int endIdx = Integer.parseInt(maxIdx);
                for(;startIdx<=endIdx; startIdx++){
                    hiddenCols.add(startIdx);
                }
            }
        }
    }


    public void endElement(String uri, String localName, String name)
            throws SAXException {
        if(isHiddenRow && mode.isIgnoreHiddenRow()){
            // 当遇到隐藏行并且隐藏行是忽略的 则不处理
            return;
        }
        
        if ("c".equals(name)) {
            if (nextIsString) {
                int idx = Integer.parseInt(cellValue);
                cellValue = new XSSFRichTextString(sst.getEntryAt(idx))
                        .toString();
                
                nextIsString = false;
            }
            
            if((hiddenCols.indexOf(curCol) < 0) && mode.isIgnoreHiddenCol()){
                // 当前列为隐藏列,并且只有忽略隐藏列的时候不处理
            }else {
                int maxNum = curCol; 
                if(mode.isIgnoreHiddenCol()){ // 需要判断是否需要计算隐藏列
                    Integer countCols = beforeHiddenCols.get(curCol);
                    countCols = countCols==null ? hiddenCols.size() : countCols;
                    maxNum = curCol - countCols;
                }
                int curSize = oneRowData.size()+1;
                for(;curSize < maxNum; curSize++){
                    oneRowData.add(""); // 用空字符串填充没有的数据
                }
                oneRowData.add(cellValue);
            }
            
            // 取值后初始化 有值标志
            haveValue = false;
            // 初始化值
            cellValue = "";
        }else if("row".equals(name)){
            // 如果是空行并且不允许空行
            if(!mode.isIgnoreEmptyRow()){
                boolean isEmptyRow = true;
                for(String str : oneRowData){
                    if(!(str==null || "".equals(str))){
                        isEmptyRow = false; // 有值行 标记不是空行
                        break;
                    }
                }
                if(isEmptyRow){
                    throw new ApplicationException("遇到空行解析结束");
                }
            }
            // 初始化隐藏行标识
            isHiddenRow = false;
            
            resultList.add(oneRowData);
            oneRowData = new ArrayList<String>();
        }else if("cols".equals(name)){  //行信息结束时处理隐藏行信息
            Collections.sort(hiddenCols);
            int hiddNum = 0;
            int colNum = 1;
            for(int colNo : hiddenCols) {
                for(;colNum<=colNo ; colNum++){
                    beforeHiddenCols.put(colNum, hiddNum);
                }
                hiddNum++;
            }
        }
    }
    
    public void characters(char[] ch, int start, int length)
            throws SAXException {
        if(haveValue){
            cellValue = new String(ch, start, length);
        }
    }
    
    
    /**
     * 根据r信息解析单元格位置 
     * 传入格式为‘A1'
     * <br>返回格式为 [列号，行号]
     * @param r
     * @return
     */
    private static String[] parseCell4Option(String r){
        String[] resultArr = new String[2];
        // 字母开始的是列
        // 数字的是行
        String colNum = "";
        String rowNum = "";
        Matcher strMatcher = wordPat.matcher(r);
        if(strMatcher.find()){
            colNum = strMatcher.group(1);
            rowNum = strMatcher.group(3);
        }
        String colIdx = parseWord2Number(colNum);
        resultArr[0] = colIdx;
        resultArr[1] = rowNum;
        return resultArr;
    }
    
    /**
     * 字符串转数字
     * 
     */
    private static String parseWord2Number(String word){
        // 记录位数
        int numOption = 0;
        int strLength = word.length();
        int totalNum = 0;
        for(int idx=strLength-1 ; idx >= 0 ; idx--){
            int charNum = parserChart2Number(word.charAt(idx));
            totalNum += (charNum * (Math.pow(26, numOption)));
            // 本次结束，位数加一
            numOption ++;
        }
        return  totalNum+"";
    }
    
    /**
     * 单个字符转数字
     * @param ch
     * @return
     */
    private static int parserChart2Number(char singleChar){
        if(singleChar > 96){
            return singleChar - 96;
        }else {
            return singleChar - 64;
            
        }
    }
    
    //~~~SET AND GET
    public List<List<String>> getResultList() {
        return resultList;
    }

    public void setResultList(List<List<String>> resultList) {
        this.resultList = resultList;
    }
    
}
