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
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import com.cnnct.listeners.LogRequestCollection;

/**
 * 请求信息管理Action
 * @author zhouww
 * @since 2014-9-26
 */
public class SysRequestManageAction extends BaseAction{
	
	/**
	 * 请求信息管理界面初始化
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	 public ActionForward requestManageInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
	            HttpServletResponse response) throws Exception {
	        return mapping.findForward("requestManageView");
	    }
	 /**
	  * 查询请求信息
	  * @param mapping
	  * @param form
	  * @param request
	  * @param response
	  * @return
	  * @throws Exception
	  */
	 public ActionForward queryRequestInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
	            HttpServletResponse response) throws Exception {
		 List<Dto> resultList = new ArrayList<Dto>();
		 int totalCount = 0;
		 try{
			 CommonActionForm cForm = (CommonActionForm)form;
			 Dto inDto = cForm.getParamAsDto(request);
			 resultList = g4Reader.queryForPage("queryRequestInfo", inDto);
			 totalCount = g4Reader.queryForPageCount("queryRequestInfo", inDto);
		 }catch(Exception e){
			 e.printStackTrace();
			 resultList = new ArrayList<Dto>();
			 totalCount = 0;
		 }
		 String resultStr = JsonHelper.encodeList2PageJson(resultList, totalCount, null);
		 super.write(resultStr, response);
		 return mapping.findForward(null);
	 }
	 /**
	  * 刷新请求日志参数
	  * @param mapping
	  * @param form
	  * @param request
	  * @param response
	  * @return
	  * @throws Exception
	  */
	 public ActionForward refreshLogRequestInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
	            HttpServletResponse response) throws Exception {
		 Dto outDto = new BaseDto();
		 try{
			 LogRequestCollection.loadRequestCollInfo();
			 outDto.put("success", true);
			 outDto.put("msg", "刷新成功");
		 }catch(Exception e){
			 e.printStackTrace();
			 outDto.put("success", false);
			 outDto.put("msg", "刷新失败");
			 outDto.put("msg2", e.getMessage());
		 }
		 String resultStr = JsonHelper.encodeObject2Json(outDto);
		 super.write(resultStr, response);
		 return mapping.findForward(null);
	 }
}
