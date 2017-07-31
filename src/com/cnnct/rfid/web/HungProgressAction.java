package com.cnnct.rfid.web;

import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import com.cnnct.rfid.service.HungProgressService;
import com.cnnct.rfid.service.SalesFocusReportService;
import com.cnnct.sys.vo.UserInfoVo;
import com.cnnct.util.G4Utils;
import com.sun.swing.internal.plaf.basic.resources.basic;
/**
 * *********************************************
 * 创建日期: 2015-07-20
 * 创建作者：xtj
 * 功能：
 * 最后修改时间：
 * 修改记录：
 * ***********************************************
 */
@SuppressWarnings({"unchecked"})
public class HungProgressAction extends BaseAction {
	Log log = LogFactory.getLog(OrdDayListAction.class);
	HungProgressService hungProgressService =(HungProgressService)super.getService("hungProgressService");
	/**
     * 报表页面初始化
     *
     * @param
     * @return
     */
    public ActionForward hungProgressInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                        HttpServletResponse response) throws Exception {
        return mapping.findForward("hungProgressView");
    }
    
    
    /**
     * 查询
     * @param
     * @return
     */
    public ActionForward queryhungProgressReport(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                        HttpServletResponse response) throws Exception {
        Dto outDto=new BaseDto();
    	try {
        	 String user_id = super.getSessionContainer(request).getUserInfo().getUserid();
        	 CommonActionForm cForm = (CommonActionForm)form;
             Dto inDto = cForm.getParamAsDto(request);
             inDto.put("opr_id", user_id);
             outDto=hungProgressService.queryHungProgress(inDto);
             String jsonStrList = outDto.getAsString("jsonStrList");
             response.getWriter().write(jsonStrList);
    	} catch (Exception e) {
			e.printStackTrace();
		}
    	return mapping.findForward(null);
    }

    /**
     * 新增
     */
    public ActionForward addHungProgress(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
		Dto outDto=new BaseDto();
		try {
       	 	String user_id = super.getSessionContainer(request).getUserInfo().getAccount();
			CommonActionForm cForm = (CommonActionForm)form;
			Dto inDto = cForm.getParamAsDto(request);
			inDto.put("opr_id", user_id);
			inDto.put("opr_date",G4Utils.getCurDate());
			outDto=hungProgressService.addHungProgress(inDto);
			String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
    	} catch (Exception e) {
			 e.printStackTrace();
			 outDto.put("failure", new Boolean(true));
	         outDto.put("msg", "新增失败");
	         String jsonString = JsonHelper.encodeObject2Json(outDto);
	         response.getWriter().write(jsonString);
		}
    	return mapping.findForward(null);
    }
    
 
    /**
     * 修改信息
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward updateHungProgress(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
    	Dto outDto=new BaseDto();
    	try {
       	 	String account = super.getSessionContainer(request).getUserInfo().getAccount();
            CommonActionForm cForm = (CommonActionForm)form;
            Dto inDto = cForm.getParamAsDto(request);
            inDto.put("opr_id", account);
            inDto.put("edt_date",G4Utils.getCurDate());
            outDto=hungProgressService.updateHungProgress(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);;
    	} catch (Exception e) {
			 e.printStackTrace();
			 outDto.put("failure", new Boolean(true));
	         outDto.put("msg", "修改失败");
	         String jsonString = JsonHelper.encodeObject2Json(outDto);
	         response.getWriter().write(jsonString);
		}
    	return mapping.findForward(null);
    }
    
    /**
     * 删除信息
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward deleteHungProgress(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
    	Dto outDto=new BaseDto();
    	try {
       	 	String account = super.getSessionContainer(request).getUserInfo().getAccount();
            CommonActionForm cForm = (CommonActionForm)form;
            Dto inDto = cForm.getParamAsDto(request);
            inDto.put("opr_id", account);
            outDto=hungProgressService.deleteHungProgress(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
    	} catch (Exception e) {
			 e.printStackTrace();
			 outDto.put("failure", new Boolean(true));
	         outDto.put("msg", "删除失败");
	         String jsonString = JsonHelper.encodeObject2Json(outDto);
	         response.getWriter().write(jsonString);
		}
    	return mapping.findForward(null);
    }
    
    
}
