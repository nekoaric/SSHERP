package com.cnnct.util.excel2007;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

public class ParseWorkBookExcel2007DH extends DefaultHandler{
    // 表格信息 
    private List<Map<String,String>> sheetsInfo = new ArrayList<Map<String,String>>();
    
    public void startElement(String uri, String localName, String qName,
            Attributes attributes) throws SAXException {
        if("sheet".equals(qName)) { // 是一个表信息元素
            String name = attributes.getValue("name");
            String sheetId = attributes.getValue("sheetId");
            String rId = attributes.getValue("r:id");
            String state = attributes.getValue("state");
            Map<String,String> resultMap = new HashMap<String, String>();
            resultMap.put("name", name);
            resultMap.put("rId", rId);
            resultMap.put("sheetId", sheetId);
            resultMap.put("state", state);
            sheetsInfo.add(resultMap);
        }
    }
    
    //~~~SET ADN GET
    public List<Map<String, String>> getSheetsInfo() {
        return sheetsInfo;
    }

    public void setSheetsInfo(List<Map<String, String>> sheetsInfo) {
        this.sheetsInfo = sheetsInfo;
    }
    
    
}
