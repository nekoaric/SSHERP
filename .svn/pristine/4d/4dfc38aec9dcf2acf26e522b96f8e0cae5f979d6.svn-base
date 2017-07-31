package com.cnnct.api;

import java.io.StringReader;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import com.cnnct.util.G4Utils;
import org.apache.commons.betwixt.io.BeanReader;
import org.apache.commons.betwixt.io.BeanWriter;

import com.cnnct.common.ApplicationException;
import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.rif.report.fcf.Set;

public class XmlBeanUtil {
    public static final Object xml2java(String xmlStr, String objName, Class cls) throws ApplicationException {
        try {
            Object retObject = null;
            StringReader xmlReader = new StringReader(xmlStr);
            BeanReader beanReader = new BeanReader();
            beanReader.getXMLIntrospector().getConfiguration().setAttributesForPrimitives(false);
            beanReader.getBindingConfiguration().setMapIDs(false);
            beanReader.registerBeanClass(objName, cls);
            retObject = beanReader.parse(xmlReader);
            return retObject;
        } catch (Exception e) {
            throw new ApplicationException("处理输入参数xmlStr出现异常，" + e.toString());
        }
    }

    public static final String java2xml(Object inBean) throws ApplicationException {
        try {
            StringWriter outputWriter = new StringWriter();
            outputWriter.write("<?xml version=\"1.0\" encoding=\"utf-8\" ?>");
            BeanWriter beanWriter = new BeanWriter(outputWriter);

            beanWriter.getXMLIntrospector().getConfiguration().setAttributesForPrimitives(false);
            beanWriter.getBindingConfiguration().setMapIDs(false);
            beanWriter.enablePrettyPrint();

            beanWriter.write(inBean);
            String reslutXml = outputWriter.toString();

            outputWriter.close();
            return reslutXml;
        } catch (Exception e) {
            throw new ApplicationException("转换bean对象为xml时出现异常，" + e.toString());
        }
    }


    /**
     * 将dto转化成前台需要的参数格式
     *
     * @param pDto
     * @return
     * @throws ApplicationException
     */
    public static String generateResponseXmlString(Dto pDto) throws Exception {
        /*<?xml version="1.0" encoding="GBK"?>
        <Envelope>
        <Header>
        <result sessionID="Ld1yRw1SMTQB47xCvRCZRy3JKkcNhJV1yJj5KL87vcKmcpKlpSyR!203933104!1370519026713" />
        </Header>
        <Body>
        <business>
        <resultset name="code">
        <row modifyflag="-" codename="现金" typename="账户充值支付方式" codevalue="1" codetype="ACCZFFS" />

        <?xml version="1.0" encoding="GBK"?> <Envelope><Header><system><result sessionID="604AFD41417A276B73B8746672469234"/>
        <result username="管理员"/><result producttype="null"/></system></Header><Body><business>
        <result operserid="11001"/><result orgid="01"/><result fzorgid="01"/><result brchrole="1"/></business></Body>
        </Envelope>
        */
        Document document = DocumentHelper.createDocument();
        document.setXMLEncoding("GBK");
        Element elRoot = document.addElement("Envelope");
        Element header = elRoot.addElement("Header");

        if ((Boolean) pDto.get("success")) {//后台查询成功的
            Element header_result_1 = header.addElement("result");
            header_result_1.addAttribute("sessionID", pDto.getAsString("sessionID"));
            Element header_result_2 = header.addElement("result");
            header_result_2.addAttribute("username", new String("管理员".getBytes("GBK"), "iso8859-1"));

            Element body = elRoot.addElement("Body");
            Element business = body.addElement("business");

            Object obj = pDto.get("object");

            if ("F00.00.00.00".equals(pDto.getAsString("funid"))) {
                if (obj instanceof Dto) {
                    Dto dto = (Dto) obj;
                    for (Object keyObj : dto.keySet()) {
                        Element business_result = business.addElement("result");
                        String key = (String) keyObj;
                        business_result.addAttribute(key, new String(dto.getAsString(key).getBytes("GBK"), "iso8859-1"));
                    }
                }
            } else {

                if (obj instanceof List) {
                    Element resultset = business.addElement("resultset");
                    resultset.addAttribute("name", pDto.getAsString("name"));
                    List list = (List) obj;
                    for (Object o : list) {
                        Dto dto = (Dto) o;
                        Element row = resultset.addElement("row");
                        List<String> keyValueList = new ArrayList<String>();
                        boolean flag = false;
                        for (Object keyObj : dto.keySet()) {
                            keyValueList.add("");
                        }
                        for (Object keyObj : dto.keySet()) {
                            String key = (String) keyObj;
                            if (key.startsWith("sequence")) {//此时key的格式为sequece+序号(第几位)
                                key = key.substring(8);
                                keyValueList.set((Integer.parseInt(key) - 1), new String(dto.getAsString(key).getBytes("GBK"), "iso8859-1"));
                                flag = true;
                            } else {
                                row.addAttribute(key, new String(dto.getAsString(key).getBytes("GBK"), "iso8859-1"));
                            }
                        }
                        if (flag) {
                            for (int i = 1; i <= keyValueList.size(); i++) {
                                if (!"".equals(keyValueList.get(i - 1))) {
                                    row.addAttribute("" + i, new String(dto.getAsString(keyValueList.get(i - 1)).getBytes("GBK"), "iso8859-1"));
                                }
                            }
                        }
                    }
                } else if (obj instanceof Dto) {
                    Dto resultDto = (Dto) obj;
                    for (Object keyObj : resultDto.keySet()) {
                        String key = (String) keyObj;
                        Object value = resultDto.get(key);
                        value = value == null ? "" : value;

                        if (value instanceof List) {
                            Element resultset = business.addElement("resultset");
                            resultset.addAttribute("name", key);
                            List list = (List) value;
                            for (Object o : list) {
                                Dto dto = (Dto) o;
                                Element row = resultset.addElement("row");
                                List<String> keyValueList = new ArrayList<String>();
                                boolean flag = false;
                                for (Object keyObj_2 : dto.keySet()) {
                                    keyValueList.add("");
                                }
                                for (Object keyObj_2 : dto.keySet()) {
                                    String key_2 = (String) keyObj_2;
                                    if (key_2.startsWith("sequence")) {//此时key的格式为sequece+序号(第几位)
                                        Integer seq = Integer.parseInt(key_2.substring(8)) - 1;
                                        keyValueList.set(seq, new String(dto.getAsString(key_2).getBytes("GBK"), "iso8859-1"));
                                        flag = true;
                                    } else {
                                        row.addAttribute(key_2, new String(dto.getAsString(key_2).getBytes("GBK"), "iso8859-1"));
                                    }
                                }
                                if (flag) {
                                    for (int i = 1; i <= keyValueList.size(); i++) {
                                        if ("".equals(keyValueList.get(i - 1))) {
                                            row.addAttribute("seq" + i, "");
                                        } else {
                                            row.addAttribute("seq" + i, new String(keyValueList.get(i - 1).getBytes("GBK"), "iso8859-1"));
                                        }
                                    }
                                }
                            }
                        } else if (value instanceof Dto) {
                            Element resultset = business.addElement("resultset");
                            resultset.addAttribute("name", key);
                            Dto dto = (Dto) value;
                            Element row = resultset.addElement("row");
                            for (Object keyObj_2 : dto.keySet()) {
                                String key_2 = (String) keyObj_2;
                                row.addAttribute(key_2, new String(dto.getAsString(key_2).getBytes("GBK"), "iso8859-1"));
                            }
                        } else {//其他类型如(string)
                            //判断当前节点下是否有resultset节点,没有则添加有则获取
                            Element resultset = null;
                            List<Element> elements = business.elements();
                            for (Element element : elements) {
                                if (element.getName().equals("resultset")) {
                                    resultset = element;
                                    break;
                                }
                            }

                            resultset = resultset == null ? business.addElement("resultset") : resultset;
                            resultset.addAttribute("name", pDto.getAsString("name"));

                            Element row = null;
                            List<Element> elements_2 = business.elements();
                            for (Element element : elements_2) {
                                if (element.getName().equals("row")) {
                                    row = element;
                                    break;
                                }
                            }
                            row = row == null ? resultset.addElement("row") : row;
                            String val = new String(value.toString().getBytes("GBK"), "iso8859-1");
                            row.addAttribute(key, val);
                        }
                    }
                }
            }
        } else {//后台查询失败
            /*<?xml version="1.0" encoding="GBK"?>
            <Envelope><Header><result sessionID="5FB3E257C5AD5A46790F610B73C3833A"/></Header>
            <Body><Fault><faultcode>1405</faultcode><faultstring>
            <error msg="2013-06-17 11:16:47|1405|系统错误（发生在系统框架部分），请联系技术支持部门！|非法的用户名或口令"/>
            </faultstring>
            </Fault>
            </Body></Envelope>
            */
            Element header_result_1 = header.addElement("result");
            header_result_1.addAttribute("sessionID", "null");

            Element body = elRoot.addElement("Body");
            Element fault = body.addElement("Fault");
            Element faultcode = fault.addElement("faultcode");
            String code = "1405";
            String errorMsg = "系统错误（发生在系统框架部分），请联系技术支持部门！";
            if(!"".equals(pDto.getAsString("code"))){
                code = pDto.getAsString("code");
                errorMsg = "";
            }
            faultcode.addText(code);//错误码
            Element faultstring = fault.addElement("faultstring");
            Element error = faultstring.addElement("error");
            String msg = G4Utils.getCurrentTime() + "|" + code +
                    "|"+errorMsg+"|" + pDto.getAsString("msg");

            error.addAttribute("msg", new String(msg.getBytes("GBK"), "iso8859-1"));
        }

        String outXml = document.asXML().replaceAll("\n", "");
        return outXml;
    }
}