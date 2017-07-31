package com.cnnct.sys.web;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.report.excel.ExcelExporter;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

/**
 * 用户会话管理
 * @author zhouww
 * @since 2014-9-26
 */
public class SysSessionManageAction extends BaseAction{
	
	/**
	 * 业务员登录信息查询
	 * 工号采用全名匹配
	 * 姓名采用模糊匹配
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	 public ActionForward queryAccountLogin(ActionMapping mapping, ActionForm form, HttpServletRequest request,
	            HttpServletResponse response) throws Exception {
		 //TODO 此处查询当添加业务员的工号以后，采用使用工号查询
		 // 目前采用名字匹配方式(注：名字匹配可能有名字重复的问题)
		 try{
			 System.out.println("come in");
			 CommonActionForm cForm = (CommonActionForm)form;
			 Dto inDto = cForm.getParamAsDto(request);
			 String loginFlag = inDto.getAsString("loginFlag");
			 
			 List<Dto> resultDtos;
			 Integer count;
			 if("1".equals(loginFlag)){	//  loginFlag标识为1 为未登录标识
				 resultDtos = g4Reader.queryForPage("queryAccountUnLoginInfo4serviceAccount",inDto);
				 count = g4Reader.queryForPageCount("queryAccountUnLoginInfo4serviceAccount", inDto);
			 }else {
				 resultDtos = g4Reader.queryForPage("queryAccountLoginInfo4serviceAccount",inDto);
				 count = g4Reader.queryForPageCount("queryAccountLoginInfo4serviceAccount", inDto);
			 }
			 String resultStr = JsonHelper.encodeList2PageJson(resultDtos, count, null);
			 System.out.println(resultStr);
			 super.write(resultStr, response);
			 return mapping.findForward(null);
		 }catch(Exception e){
			 e.printStackTrace();
			 List list = new ArrayList();
			 String resultStr = JsonHelper.encodeList2PageJson(list, 0, null);
			 super.write(resultStr, response);
			 return mapping.findForward(null);
		 }
	 }
	
	 /**
	  * 会话界面初始化
	  * @param mapping
	  * @param form
	  * @param request
	  * @param response
	  * @return
	  * @throws Exception
	  */
	 public ActionForward sessionManageInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
	            HttpServletResponse response) throws Exception {
		 return mapping.findForward("sessionManageView");
	 }
	 
	 /**
	  * 查询用户会话信息
	  * @param mapping
	  * @param form
	  * @param request
	  * @param response
	  * @return
	  * @throws Exception
	  */
	 public ActionForward queryPageSessionInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
	            HttpServletResponse response) throws Exception {
		 List<Dto> resultList = new ArrayList<Dto>();
		 int totalNum = 0;
		 try{
			 CommonActionForm cForm = (CommonActionForm)form;
			 Dto inDto = cForm.getParamAsDto(request);
			 resultList = g4Reader.queryForPage("querySessionInfo", inDto);
			 totalNum = g4Reader.queryForPageCount("querySessionInfo", inDto);
		 }catch(Exception e){
			 e.printStackTrace();
		 }
		 String resultStr = JsonHelper.encodeList2PageJson(resultList, totalNum, null);
		 super.write(resultStr, response);
		 return mapping.findForward(null);
	 }
	 
	 /**
		 * 导出业务员登录信息
		 * @param mapping
		 * @param form
		 * @param request
		 * @param response
		 * @return
		 * @throws Exception
		 */
		 public ActionForward exportAccountLogin(ActionMapping mapping, ActionForm form, HttpServletRequest request,
		            HttpServletResponse response) throws Exception {
			 //TODO 此处查询当添加业务员的工号以后，采用使用工号查询
			 // 目前采用名字匹配方式(注：名字匹配可能有名字重复的问题)
			 Dto parametersDto = new BaseDto();
			 try{
				 CommonActionForm cForm = (CommonActionForm)form;
				 Dto inDto = cForm.getParamAsDto(request);
				 List<Dto> loginDtos = g4Reader.queryForPage("queryAccountUnLoginInfo4serviceAccount",inDto);
				 List<Dto> unloginDtos = g4Reader.queryForPage("queryAccountLoginInfo4serviceAccount",inDto);
				 loginDtos.addAll(unloginDtos);
				 ExcelExporter excelExporter = new ExcelExporter();
				 parametersDto.put("reportTitle", "员工登陆信息");
				 excelExporter.setTemplatePath("report/excel/accountLoginInfo.xls");
				 excelExporter.setFilename("员工登陆信息.xls");
				 excelExporter.setData(parametersDto, loginDtos);
				 excelExporter.export(request, response);
				 return mapping.findForward(null);
			 }catch(Exception e){
				 e.printStackTrace();
				 List list = new ArrayList();
				 String resultStr = JsonHelper.encodeList2PageJson(list, 0, null);
				 super.write(resultStr, response);
				 return mapping.findForward(null);
			 }
		 }
		 /**
			 * 导出所有人员登录信息
			 * @param mapping
			 * @param form
			 * @param request
			 * @param response
			 * @return
			 * @throws Exception
			 */
			 public ActionForward exportAllAccountLogin(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			            HttpServletResponse response) throws Exception {
				 //TODO 此处查询当添加业务员的工号以后，采用使用工号查询
				 // 目前采用名字匹配方式(注：名字匹配可能有名字重复的问题)
				 Dto parametersDto = new BaseDto();
				 try{
					 CommonActionForm cForm = (CommonActionForm)form;
					 Dto inDto = cForm.getParamAsDto(request);
					 List<Dto> loginDtos = g4Reader.queryForPage("queryAllAccountLoginInfo",inDto);
					 ExcelExporter excelExporter = new ExcelExporter();
					 parametersDto.put("reportTitle", "员工登陆信息");
					 excelExporter.setTemplatePath("report/excel/accountLoginInfo.xls");
					 excelExporter.setFilename("员工登陆信息.xls");
					 excelExporter.setData(parametersDto, loginDtos);
					 excelExporter.export(request, response);
					 return mapping.findForward(null);
				 }catch(Exception e){
					 e.printStackTrace();
					 List list = new ArrayList();
					 String resultStr = JsonHelper.encodeList2PageJson(list, 0, null);
					 super.write(resultStr, response);
					 return mapping.findForward(null);
				 }
			 }
			
}
