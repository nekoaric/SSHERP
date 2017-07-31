package com.cnnct.api.cs.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.cnnct.api.XmlBeanUtil;
import com.cnnct.api.cs.service.CSService;
import com.cnnct.api.cs.util.MsgTools;
import com.cnnct.sys.vo.UserInfoVo;

@SuppressWarnings("serial")
public class CSServlet extends HttpServlet {
    private static Log log = LogFactory.getLog(CSServlet.class);

    private CSService csService = (CSService) SpringBeanLoader.getSpringBean("csService");

    public CSServlet() {
        super();
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doPost(request, response);
    }

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String reqStr = MsgTools.getRequestStr(request); // 请求文本
        log.info(request.getContentType());
        log.info(request.getCharacterEncoding());
        log.info("客户端请求IP：" + request.getRemoteAddr());
        log.info("请求文本：");
        log.info(reqStr);

        try {
            if (reqStr != null && !reqStr.equals("")) {
                // 获取MESSAGE/HEADER节点下的所有一级子节点（格式化基础数据）
                // Dto reqDto = MsgTools.converReqStr2Map(reqStr.substring(0, reqStr.length() - 1), "//MESSAGE/HEADER/child::*");
                Dto reqDto = MsgTools.convertReqStr2Map(reqStr, "//Envelope/Header/system/para");
                Dto bodyDto = MsgTools.convertReqStr2Map(reqStr, "//Envelope/Body/business/para");

                reqDto.put("request", request);
                String funid = reqDto.getAsString("funid");

                Dto outDto = new BaseDto();
                if ("F00.00.00.00".equals(funid)) {//登录

                    Dto userInfo = csService.getUserInfo(reqDto);
                    userInfo.put("funid", funid);
                    //根据返回xml要求组装xml String
                    String resStr = XmlBeanUtil.generateResponseXmlString(userInfo);
                    MsgTools.output(response.getWriter(), resStr);
                } else if ("F00.00.01".equals(funid)) {//订单信息查询

                    outDto = csService.getOrdBasInfo(bodyDto);

                    outDto.put("name", "ordinfo");
                    //根据返回xml要求组装xml String
                    String resStr = XmlBeanUtil.generateResponseXmlString(outDto);
                    MsgTools.output(response.getWriter(), resStr);
                }else if ("F00.00.01.01".equals(funid)) {//订单信息查询

                    outDto = csService.getOrdBasNumInfo(bodyDto);

                    outDto.put("name", "ordinfo");

                    //根据返回xml要求组装xml String
                    String resStr = XmlBeanUtil.generateResponseXmlString(outDto);
                    MsgTools.output(response.getWriter(), resStr);
                } else if ("F00.00.02".equals(funid)) {//产品绑定
                    //获取用户信息
                    UserInfoVo user = csService.getLoginUserInfo(reqDto);
                    bodyDto.put("userInfo",user);

                    outDto = csService.bindProdBasInfo(bodyDto);

                    outDto.put("name", "ordinfo");

                    //根据返回xml要求组装xml String
                    String resStr = XmlBeanUtil.generateResponseXmlString(outDto);
                    MsgTools.output(response.getWriter(), resStr);
                } else if("F00.00.02.01".equals(funid)){//产品批量绑定
                	Dto epcCodes = MsgTools.convertReqBatchStr2Map(reqStr, "//Envelope/Body/business/paralist/row");
                	UserInfoVo user = csService.getLoginUserInfo(reqDto);
                	bodyDto.put("userInfo", user);
                	
                	bodyDto.put("epcCodes",epcCodes);
                	outDto = csService.bindBatchProdBasInfo(bodyDto);
                	
                	String resStr = XmlBeanUtil.generateResponseXmlString(outDto);
                    MsgTools.output(response.getWriter(), resStr);
                }else if("F00.00.09.01".equals(funid)){	// 产品解绑
                	Dto epcCodes = MsgTools.convertReqBatchStr2Map(reqStr, "//Envelope/Body/business/paralist/row");
                	UserInfoVo user = csService.getLoginUserInfo(reqDto);
                	bodyDto.put("userInfo", user);
                	bodyDto.put("epcCodes",epcCodes);
                	outDto = csService.removeBindProdBasInfo(bodyDto);
                	String resStr = XmlBeanUtil.generateResponseXmlString(outDto);
                	MsgTools.output(response.getWriter(), resStr);
                }else if("F00.00.09.02".equals(funid)){// 批量产品解绑

                	Dto epcCodes = MsgTools.convertReqBatchStr2Map(reqStr, "//Envelope/Body/business/paralist/row");
                	UserInfoVo user = csService.getLoginUserInfo(reqDto);
                	bodyDto.put("userInfo", user);
                	bodyDto.put("epcCodes",epcCodes);
                	outDto = csService.removeBind4Batch(bodyDto);
                	String resStr = XmlBeanUtil.generateResponseXmlString(outDto);
                	MsgTools.output(response.getWriter(), resStr);
                }else if("F00.00.09.03".equals(funid)){ // epc查询
                	Dto epcCodes = MsgTools.convertReqBatchStr2Map(reqStr, "//Envelope/Body/business/para");
                	UserInfoVo user = csService.getLoginUserInfo(reqDto);
                	bodyDto.put("userInfo", user);
                	bodyDto.put("epcCodes", epcCodes);
                	outDto = csService.queryProd4Epc(bodyDto);
                	String resStr = XmlBeanUtil.generateResponseXmlString(outDto);
                	MsgTools.output(response.getWriter(), resStr);
                }else if("F00.00.00.02".equals(funid)) {// 生产通知单信息查询
                    Dto ordBasDto = csService.getProdOrdInfo(reqDto);

                    ordBasDto.put("name", "prodordinfo");
                    ordBasDto.put("sessionID", request.getSession().getId());
                    //根据返回xml要求组装xml String
                    String resStr = XmlBeanUtil.generateResponseXmlString(ordBasDto);
                    MsgTools.output(response.getWriter(), resStr);
//                } else if ("F00.00.00.00".equals(funid)) {//产品信息查询
//                    Dto ordBasDto = csService.getProdBasInfo(reqDto);
//
//                    ordBasDto.put("name", "prodinfo");
//                    ordBasDto.put("sessionID", request.getSession().getId());
//                    //根据返回xml要求组装xml String
//                    String resStr = XmlBeanUtil.generateResponseXmlString(ordBasDto);
//                    MsgTools.output(response.getWriter(), resStr);
                }else if ("F00.00.03".equals(funid)) {//产品信息查询
                    Dto ordBasDto = csService.getProdOrdInfo(bodyDto);

                    ordBasDto.put("name", "lst");
                    //根据返回xml要求组装xml String
                    String resStr = XmlBeanUtil.generateResponseXmlString(ordBasDto);
                    MsgTools.output(response.getWriter(), resStr);
                }else if ("F00.00.04".equals(funid)) {//产品信息查询
                    Dto ordBasDto = csService.getProdOrdInfo(bodyDto);

                    ordBasDto.put("name", "lst");
                    //根据返回xml要求组装xml String
                    String resStr = XmlBeanUtil.generateResponseXmlString(ordBasDto);
                    MsgTools.output(response.getWriter(), resStr);
                }else if("F14.03.04".equals(funid)){
                    
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
