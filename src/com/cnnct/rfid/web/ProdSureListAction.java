package com.cnnct.rfid.web;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.cnnct.rfid.service.ProdSureListService;
import com.cnnct.util.G4Utils;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import com.cnnct.common.ApplicationException;


/************************************************
 * 创建日期: 2013-05-13
 * 创建作者：lingm
 * 功能：领片记录确认
 * 最后修改时间：
 * 修改记录：
*************************************************/

@SuppressWarnings({ "unchecked" })
public class ProdSureListAction extends BaseAction {
	
	ProdSureListService prodSureListService =(ProdSureListService)super.getService("prodSureListService");
	
	/**
	 * 领片确认管理页面初始化
	 * 
	 * @param
	 * @return
	 */
	public ActionForward prodSureListInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		return mapping.findForward("manageProdSureListView");
	}
	/**
	 * 根据产品id查询需要确认的产品信息
	 * 
	 * @param
	 * @returnsaveProdSureList
	 */
	
	public ActionForward queryProdBasInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm)form;
		String grp_id = super.getSessionContainer(request).getUserInfo().getGrpId();
		Dto inDto = aForm.getParamAsDto(request);
		inDto.put("state", '0');
		Dto outDto = prodSureListService.queryProdInfoById(inDto);
		String jsonStrList = outDto.getAsString("jsonStrList");
		response.getWriter().write(jsonStrList);
		return mapping.findForward(null);
	}
	public ActionForward queryProdSureList(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm)form;
		String grp_id = super.getSessionContainer(request).getUserInfo().getGrpId();
		Dto inDto = aForm.getParamAsDto(request);
		inDto.put("state", '0');
		Dto outDto = prodSureListService.queryProdSureInfoById(inDto);
		String jsonStrList = outDto.getAsString("jsonStrList");
		response.getWriter().write(jsonStrList);
		return mapping.findForward(null);
	}
	/**
	 * 领片确认信息保存
	 *
	 * @param
	 * @return、
	 */
	public ActionForward saveProdSureList(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		Dto outDto = new BaseDto();		
		try {
			CommonActionForm aForm = (CommonActionForm) form;
			Dto inDto = aForm.getParamAsDto(request);
			String opr_id = super.getSessionContainer(request).getUserInfo().getAccount();
			String grp_id = super.getSessionContainer(request).getUserInfo().getGrpId();
			inDto.put("sure_name", opr_id);
			inDto.put("sure_date", G4Utils.getCurrentTime("yyyy-MM-dd"));
			inDto.put("grp_id", grp_id);
			outDto = prodSureListService.saveProdSureInfo(inDto);
			String jsonString = JsonHelper.encodeObject2Json(outDto);
			response.getWriter().write(jsonString);
		}catch (ApplicationException e) {
            e.printStackTrace();
            outDto.put("msg", "领片信息确认失败");
            outDto.put("success", new Boolean(false));
            String jsonString = JsonHelper.encodeObject2Json(outDto);
			response.getWriter().write(jsonString);
        }catch (Exception e) {
            e.printStackTrace();
            outDto.put("msg", "领片信息确认失败");
            outDto.put("success", new Boolean(false));
            String jsonString = JsonHelper.encodeObject2Json(outDto);
			response.getWriter().write(jsonString);
        }
		return mapping.findForward(null);
	}
	

	
	
}
