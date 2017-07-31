package com.cnnct.util.excel2007;

import java.io.File;
import java.util.List;
import java.util.Map;


/**
 * 解析excel2007版本的文档 
 * @author zhouww
 * @since 2015-1-20
 * <此解析工具未对日期，boolean做处理。日期，boolean作为数字返回，其他的值作为字符串返回。
 * 建议在此工具的基础上添加一层数据处理(将特殊数据的类型转换为需要的类型 ：日期，boolean)>
 */
public class ParseExcel2007Util {

    // 忽视隐藏表 默认为隐藏表
    private boolean ignoreHiddenSheet = true;
    
    // 解析第一张表模式
    public static final int FIRST_SHEET = 0;
    // 指定表位置
    public static final int APPOINT_INDEX = 1;
    // 指定表名模式
    public static final int APPOINT_NAME = 2;
    
    
    // excel解析模式 默认解析第一张表
    private int modeFlag = FIRST_SHEET;
    // 用作检索表名用  如果是指定表名，则 值为表名。如果指定表序号，则值为序号
    private String appointName = "";
    
    // 解析表的模式 
    private ParseExcel2007Mode mode = new ParseExcel2007Mode();
    
    /**
     * 解析文件，文件参数
     * @param file
     * @return
     */
    public List<List<String>> parseExcel(File file)throws Exception{
        // 解析表信息
        ParseExcel2007Control control = new ParseExcel2007Control(mode);
        List<Map<String,String>> sheetsInfo = control.parseSheetsInfo(file);
        String rId = getSheetId(sheetsInfo);    // 表的rID 用来索引解析表的ID
        
        // 用解析出来的表信息解析文件
        List<List<String>> sheetData = control.parseSheetData(file,rId);
        return sheetData;
    }
    
    /**
     * 解析指定的行
     * @param file
     * @param rowIdx
     * @return
     * @throws Exception
     */
    public List<String> parseSheetAppointRow(File file, int rowIdx)throws Exception{
        ParseExcel2007Control control = new ParseExcel2007Control(mode);
        // 获取表信息
        List<Map<String,String>> sheetsInfo = control.parseSheetsInfo(file);
        String rId = getSheetId(sheetsInfo);    // 表的rID 用来索引解析表的ID
        List<String> rowData = control.parseSheetData(file, rId, rowIdx);
        return rowData;
    }
    
    /**
     * 解析表的模式获取需要解析表的ID
     * @param sheets
     * @return
     */
    private String getSheetId(List<Map<String,String>> sheetsInfo){
        String sheetId = "";
        if (modeFlag == FIRST_SHEET) {
            // 解析第一张表
            for(Map<String,String> map : sheetsInfo){
                String state = map.get("state");
                // 如果不计算隐藏的表 那么跳过隐藏的表
                if(ignoreHiddenSheet && "hidden".equals(state)){
                    continue;
                }else { // 符合规定的则获取id
                    sheetId = map.get("rId");
                    break;
                }
            }
        }else if(modeFlag == APPOINT_NAME){
            // 解析指定名字的表
            // 此模式必须指定名字值
            if (appointName==null || "".equals(appointName)) {
                return "";
            }
            for(Map<String,String> map : sheetsInfo){
                String sheetName = map.get("name");
                String state = map.get("state");
                if (appointName.equals(sheetName) 
                        && !(ignoreHiddenSheet && "hidden".equals(state))) {
                    // 获取合规范的表ID
                    sheetId = map.get("rId");
                    break;
                }
            }
        }else if(modeFlag == APPOINT_INDEX){
            // 解析指定序号的表
            // 解析指定名字的表
            // 此模式必须指定名字值
            if (appointName==null || "".equals(appointName)) {
                return "";
            }
            // 有效表的下标
            int valideIdx = 0;
            // 指定解析表的下标
            int sheetIdx = Integer.parseInt(appointName);
            for(int idx=0;idx<sheetsInfo.size();idx++){
                Map<String,String> map = sheetsInfo.get(idx);
                String state = map.get("state");
                if ((ignoreHiddenSheet && "hidden".equals(state))) {
                    continue;
                }
                valideIdx++;
                if(valideIdx==sheetIdx){
                    sheetId = map.get("rId");
                    break;
                }
            }
        }
        return sheetId;
    }

    //~~~SET ADN GET
    public boolean isIgnoreHiddenSheet() {
        return ignoreHiddenSheet;
    }


    public void setIgnoreHiddenSheet(boolean ignoreHiddenSheet) {
        this.ignoreHiddenSheet = ignoreHiddenSheet;
    }


    public int getModeFlag() {
        return modeFlag;
    }


    public void setModeFlag(int modeFlag) {
        this.modeFlag = modeFlag;
    }


    public ParseExcel2007Mode getMode() {
        return mode;
    }


    public void setMode(ParseExcel2007Mode mode) {
        this.mode = mode;
    }
    public String getAppointName() {
        return appointName;
    }
    public void setAppointName(String appointName) {
        this.appointName = appointName;
    }

    
    
}
