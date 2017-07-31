package com.cnnct.rfid.web;

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

import com.cnnct.rfid.service.ClothBasInfoService;

/************************************************
 * 创建日期: 2013-05-07 09:38:00
 * 创建作者：唐芳海
 * 功能：客户信息管理
 * 最后修改时间：
 * 修改记录：
 *************************************************/

@SuppressWarnings("unchecked")
public class ClothBasInfoAction extends BaseAction {
	private ClothBasInfoService clothBasInfoService = (ClothBasInfoService) super
			.getService("clothBasInfoService");

	/**
	 * 服务信息初始化页面
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward ClothBasInfoInit(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		return mapping.findForward("ClothBasInfoView");
	}
	/**
	 * 服务信息查询
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */

	public ActionForward queryClothBasInfoAction(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		Dto outDto = clothBasInfoService.queryClothBasInfo(inDto);
		String jsonStrList = outDto.getAsString("jsonStrList");
		response.getWriter().write(jsonStrList);
		return mapping.findForward(null);
	}
	/**
	 * 服务信息新增
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward insertClothBasInfoAction(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		Dto outDto = new BaseDto();
		try {
			CommonActionForm aForm = (CommonActionForm) form;
			Dto inDto = aForm.getParamAsDto(request);
			outDto = clothBasInfoService.insertClothBasInfo(inDto);
			String jsonString = JsonHelper.encodeObject2Json(outDto);
			response.getWriter().write(jsonString);
		} catch (Exception e) {
			outDto.put("success", new Boolean(false));
			outDto.put("msg", "服务信息新增失败");
			String jsonString = JsonHelper.encodeObject2Json(outDto);
			response.getWriter().write(jsonString);
		}
		return mapping.findForward(null);
	}

	/**
	 * 服务信息删除
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward deleteClothBasInfoAction(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		Dto outDto = new BaseDto();
		try {
			CommonActionForm aForm = (CommonActionForm) form;
			Dto inDto = aForm.getParamAsDto(request);
			inDto.put("state", "1");
			outDto = clothBasInfoService.deleteClothBasInfo(inDto);
			String jsonString = JsonHelper.encodeObject2Json(outDto);
			response.getWriter().write(jsonString);
		} catch (Exception e) {
			outDto.put("failure", new Boolean(true));
			outDto.put("msg", "服务信息删除失败");
			String jsonString = JsonHelper.encodeObject2Json(outDto);
			response.getWriter().write(jsonString);
		}
		return mapping.findForward(null);
	}

	/**
	 * 服务信息修改
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward updateClothBasInfoAction(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		Dto outDto = new BaseDto();
		try {
			CommonActionForm aForm = (CommonActionForm) form;
			Dto inDto = aForm.getParamAsDto(request);
			outDto = clothBasInfoService.updateClothBasInfo(inDto);
			String jsonString = JsonHelper.encodeObject2Json(outDto);
			response.getWriter().write(jsonString);
		} catch (Exception e) {
			outDto.put("success", new Boolean(false));
			outDto.put("msg", "服务信息修改失败");
			String jsonString = JsonHelper.encodeObject2Json(outDto);
			response.getWriter().write(jsonString);
		}
		return mapping.findForward(null);
	}

}
