package com.cnnct.api.cs.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.dom4j.Attribute;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.cnnct.common.ApplicationException;

/**
 * 报文、消息处理工具
 * 
 * @author wuw
 * 
 */
@SuppressWarnings({ "unchecked", "rawtypes" })
public class MsgTools {

    private static Log log = LogFactory.getLog(MsgTools.class);

    /**
     * 验证节点是否存在
     * 
     * @param nodeName
     *            单个节点名称
     * @param nodeArr
     *            节点数组
     * @return
     */
    public static boolean validateNodeIsExist(String nodeName, String[] nodeArr) {
        boolean isExists = false;
        for (String tmpNodeName : nodeArr) {
            if (tmpNodeName.equals(nodeName)) {
                isExists = true;
            }
        }
        return isExists;
    }

    /**
     * 获取请求报文
     * 
     * @param request
     * @return
     * @throws com.cnnct.common.ApplicationException
     */
    public static String getRequestStr(HttpServletRequest request) {
        String rsStr = "";
        StringBuffer rs = new StringBuffer(128);
        try {
            BufferedReader br = request.getReader(); // 获取请求数据流
            String line = null;
            while ((line = br.readLine()) != null) {
                rs.append(line);
            }
            // rsStr = new String(rs.toString().getBytes("UTF-8"), "UTF-8"); 已配置字符过滤器，此外无须转换
            rsStr = rs.toString();
        } catch (IOException e) {
            log.info("网络异常，获取请求文本出错，" + e.getMessage());
        }
        return rsStr;// // 请求文本字符串
    }

    /**
     * 转换指定节点下的所有一级子节点为Map
     * 
     * @param xmlStr
     * @param xmlPath
     * @return
     */
    public static Dto convertReqStr2Map(String xmlStr, String xmlPath) {
        Dto reqDto = new BaseDto();

        Document doc = parseText(xmlStr);
        Element root = doc.getRootElement();
        List subElement = root.selectNodes(xmlPath); // 获取xmlPath节点下的所有一级子节点
        for (Iterator it = subElement.iterator(); it.hasNext();) {
            Element e = (Element) it.next();

            // System.out.println(e.getName());
            List attrs = e.attributes();
            for(Object o:attrs){
                Attribute attr = (Attribute)o;
                reqDto.put(attr.getName(),attr.getValue());
            }
        }

        return reqDto;
    }
    /**
     * 转换制定节点下的所有一级子节点<br/>
     * 重复的属性用','隔开
     * @create 2013-9-22
     * @author zhouww
     * @param xmlStr
     * @param xmlPath
     * @return
     */
    public static Dto convertReqBatchStr2Map(String xmlStr,String xmlPath){
    	Dto reqDto = new BaseDto();
    	Document doc = parseText(xmlStr);
    	Element root = doc.getRootElement();
    	List subElement = root.selectNodes(xmlPath);
    	for(Iterator it = subElement.iterator();it.hasNext();){
    		Element e = (Element)it.next();
    		List attrs = e.attributes();
    		for(Object o : attrs){
    			Attribute attr = (Attribute)o;
    			if("".equals(reqDto.getAsString(attr.getName()))){
    				reqDto.put(attr.getName(),attr.getValue());
    			}else {
    				String value = reqDto.getAsString(attr.getName())+","+attr.getValue();
    				reqDto.put(attr.getName(),value);
    			}
    		}
    		
    	}
    	return reqDto;
    }
    
    /**
     * 转换指定节点下的所有一级子节点为Map集合
     * 
     * @param xmlStr
     * @param xmlPath
     * @return
     */
    public static List<Dto> convertReqStr2MapList(String xmlStr, String xmlPath, Dto reqDto) throws ApplicationException {
        List<Dto> lst = new ArrayList<Dto>();

        Document doc = parseText(xmlStr);

        try {
            Element root = doc.getRootElement();
            List subElementLst = root.selectNodes(xmlPath); // 获取xmlPath节点下的所有一级子节点
            for (Iterator it = subElementLst.iterator(); it.hasNext();) {
                Element e = (Element) it.next();
                Dto dto = new BaseDto();
                dto.put("grp_id", reqDto.get("grp_id")); // 单位代码
                dto.put("ctrl_no", Integer.valueOf(reqDto.getAsString("devno").equals("") ? "0" : reqDto.getAsString("devno"))); // 控制器号

                for (Iterator subIterator = e.elementIterator(); subIterator.hasNext();) {
                    Element _subElement = (Element) subIterator.next();
                    dto.put(_subElement.getName().toLowerCase(), _subElement.getText());
                }

                // 刷卡日志表 刷卡时间
                Date _tr_time = str2Date(dto.getAsString("tr_time"), "yyyyMMddHHmmss");
                dto.put("tr_time_aegusrlog", date2Str(_tr_time, "yyyy-MM-dd HH:mm:ss"));
                dto.put("type", Integer.parseInt(dto.getAsString("type")) + ""); // 事件类型
                dto.put("notes", dto.getAsString("door_add") + "|" + dto.getAsString("remark") + "|" + dto.getAsString("notes"));

                // 刷卡记录表 
                dto.put("tr_date", date2Str(_tr_time, "yyyy-MM-dd"));
                dto.put("tr_time_cwacrddaily", date2Str(_tr_time, "HH:mm:ss"));
                
                dto.put("door_no", 0); // 刷卡日志表 门编号默认为0
                
                dto.put("issu_seq", 0); // 刷卡记录表 发行流水默认为0

                lst.add(dto);
            }
        } catch (Exception e) {
            log.info("格式化数据出错，" + e.getMessage());
            throw new ApplicationException(e.getMessage(), e);
        }

        return lst;
    }

    /**
     * 输出文本
     * 
     * @param out
     * @param outputStr
     */
    public static void output(PrintWriter out, String outputStr) {
        System.out.println(outputStr);
        out.println(outputStr);
        out.flush();
        out.close();
    }

    /**
     * 格式化xml字符串为文档对象模型
     * 
     * @param xmlStr
     * @return
     */
    public static Document parseText(String xmlStr) {
        Document doc = null;
        try {
            doc = DocumentHelper.parseText(xmlStr);
        } catch (DocumentException e) {
            log.info("格式化xml文本出错，" + e.getMessage());
        }
        return doc;
    }

    /**
     * 获取返回文本
     * 
     * @param innerStr
     * @return
     */
    public static String getRootPartStr(String innerStr) {
        return getStartNodeStr(MsgConstant.ROOT) + innerStr + getEndNodeStr(MsgConstant.ROOT);
    }

    /**
     * 基于请求文本获取HEADER部分的字符串
     * 
     * @param reqStr
     * @return
     */
    public static String getHeadPartStrBaseReqStr(String reqStr) {
        String startNodeStr = getStartNodeStr(MsgConstant.HEADER);
        String endNodeStr = getEndNodeStr(MsgConstant.HEADER);
        return reqStr.substring(reqStr.indexOf(startNodeStr), reqStr.indexOf(endNodeStr) + endNodeStr.length());
    }

    /**
     * 生成body部分文本
     * 
     * @param rowStr
     * @return
     */
    public static String getBodyPartStr(String rowStr) {
        return getStartNodeStr(MsgConstant.BODY) + rowStr + getEndNodeStr(MsgConstant.BODY);
    }

    /**
     * 生成rocde部分文本
     * 
     * @param rowStr
     * @return
     */
    public static String getRcodeStr(String rcodeValue) {
        return getStartNodeStr(MsgConstant.RCODE) + rcodeValue + getEndNodeStr(MsgConstant.RCODE);
    }

    /**
     * 根据数据库查询结果集及数据结构定义，生成ROW字符串
     * 
     * @param lst
     * @param nodeArr
     * @return
     */
    public static String getRowPartStr(List lst, String[] nodeArr) {
        StringBuffer rs = new StringBuffer(256);

        int lstSize = lst.size();
        int nodeArrLen = nodeArr.length;
        for (int i = 0; i < lstSize; i++) {
            rs.append(getStartNodeStr(MsgConstant.ROW));
            Dto dto = (BaseDto) lst.get(i);
            for (int j = 0; j < nodeArrLen; j++) {
                rs.append(getStartNodeStr(nodeArr[j])).append(dto.get(nodeArr[j].toLowerCase())).append(getEndNodeStr(nodeArr[j]));
            }
            rs.append(getEndNodeStr(MsgConstant.ROW));
        }

        return rs.toString();
    }

    public static String getStartNodeStr(String nodeName) {
        return "<" + nodeName + ">";
    }

    public static String getEndNodeStr(String nodeName) {
        return "</" + nodeName + ">";
    }

    public static Date str2Date(String dateStr, String format) throws ParseException {
        SimpleDateFormat dateFormat = new SimpleDateFormat(format);
        return dateFormat.parse(dateStr);
    }

    public static String date2Str(Date date, String format) throws ParseException {
        SimpleDateFormat dateFormat = new SimpleDateFormat(format);
        return dateFormat.format(date);
    }
}
