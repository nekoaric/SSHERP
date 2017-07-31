package com.cnnct.rfid.web;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

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
public class SalesFocusReportAction extends BaseAction {
	Log log = LogFactory.getLog(OrdDayListAction.class);
	SalesFocusReportService salesFocusReportService =(SalesFocusReportService)super.getService("salesFocusReportService");
	
	/**
     * 报表页面初始化
     *
     * @param
     * @return
     */
    public ActionForward salesFocusInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                        HttpServletResponse response) throws Exception {
        return mapping.findForward("salesFocusView");
    }
    
    /**
     * 仅供浏览的报表页面初始化
     *
     * @param
     * @return
     */
    public ActionForward salesFocus4ViewInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                        HttpServletResponse response) throws Exception {
        return mapping.findForward("salesFocus4View");
    }
    
    /**
     * 品牌信息初始化
     *
     * @param
     * @return
     */
    public ActionForward salesFocusBrandInfoInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                        HttpServletResponse response) throws Exception {
        return mapping.findForward("salesFocusBrandInfoView");
    }
    /**
     * 查询今年报表
     *
     * @param
     * @return
     */
    public ActionForward querySalesFocusReport(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                        HttpServletResponse response) throws Exception {
        Dto outDto=new BaseDto();
    	try {
        	 String user_name = super.getSessionContainer(request).getUserInfo().getUsername();
        	 CommonActionForm cForm = (CommonActionForm)form;
             Dto inDto = cForm.getParamAsDto(request);
             inDto.put("operater", user_name);
             outDto=salesFocusReportService.querySalesFocus(inDto);
             super.write(outDto.getAsString("jsonStrList"), response);
    	} catch (Exception e) {
			e.printStackTrace();
		}
    	return mapping.findForward(null);
    }
    /**
     * 查询登录人可以操作的所有品牌
     *用于制作动态grid
     * @param
     * @return
     */
    public ActionForward getSaleFoucusBrandInfoByOpertater(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                        HttpServletResponse response) throws Exception {
        Dto outDto=new BaseDto();
    	try {
        	 String user_name = super.getSessionContainer(request).getUserInfo().getUsername();
             CommonActionForm cForm = (CommonActionForm)form;
             Dto inDto = cForm.getParamAsDto(request);
             inDto.put("operater", user_name);
             List brandList=g4Reader.queryForList("getSaleFoucusBrandInfoByOpertater", inDto);
             String brandListJson = JsonHelper.encodeObject2Json(brandList);
             super.write(brandListJson, response);
    	} catch (Exception e) {
			e.printStackTrace();
		}
    	return mapping.findForward(null);
    }
    
    /**
     * 新增或者更新salesfocusreport
     */
    public ActionForward updateSalesFocus(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
		Dto outDto=new BaseDto();
		try {
			UserInfoVo u=super.getSessionContainer(request).getUserInfo();
			String user_name = super.getSessionContainer(request).getUserInfo().getUsername();
			CommonActionForm cForm = (CommonActionForm)form;
			Dto inDto = cForm.getParamAsDto(request);
			inDto.put("remark", G4Utils.getCurrentTime()+user_name);
			inDto.put("operater", user_name);
			outDto=salesFocusReportService.updateSalesFocus(inDto);
			String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
    	} catch (Exception e) {
			 e.printStackTrace();
			 outDto.put("failure", new Boolean(true));
	         outDto.put("msg", "salesFocusReport更新失败");
	         String jsonString = JsonHelper.encodeObject2Json(outDto);
	         response.getWriter().write(jsonString);
		}
    	return mapping.findForward(null);
    }
    
    /**
     * 查询所有品牌信息
     *用于品牌信息管理页面
     * @param
     * @return
     */
    public ActionForward querySalesFocusBrandInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                        HttpServletResponse response) throws Exception {
        Dto outDto=new BaseDto();
    	try {
             CommonActionForm cForm = (CommonActionForm)form;
             Dto inDto = cForm.getParamAsDto(request);
             outDto=salesFocusReportService.querySalesFocusBrandInfo(inDto);
             super.write(outDto.getAsString("jsonString"), response);
    	} catch (Exception e) {
			e.printStackTrace();
		}
    	return mapping.findForward(null);
    }
    /**
     * 添加品牌负责人等相关信息
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward addSalesFocusBrandInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
    	Dto outDto=new BaseDto();
    	try {
       	 	String account = super.getSessionContainer(request).getUserInfo().getAccount();
            UserInfoVo s=super.getSessionContainer(request).getUserInfo();
       	 	CommonActionForm cForm = (CommonActionForm)form;
            Dto inDto = cForm.getParamAsDto(request);
            inDto.put("opr_time", G4Utils.getCurDate());
            //重复验证：品牌，负责人，产地
            List list=g4Reader.queryForList("checkDouble4BrandInfo",inDto);
            if (list.size()>0) {
            	outDto.put("msg", "已存在品牌，负责人，产地相同的信息");
				throw new Exception();
			}
            outDto=salesFocusReportService.addSalesFocusBrandInfo(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
    	} catch (Exception e) {
			 e.printStackTrace();
			 outDto.put("failure", new Boolean(true));
	         outDto.put("msg", "品牌相关信息新增失败");
	         String jsonString = JsonHelper.encodeObject2Json(outDto);
	         response.getWriter().write(jsonString);
		}
    	return mapping.findForward(null);
    }
    /**
     * 修改品牌相关信息
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward updateSalesFocusBrandInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
    	Dto outDto=new BaseDto();
    	try {
       	 	String account = super.getSessionContainer(request).getUserInfo().getAccount();
            CommonActionForm cForm = (CommonActionForm)form;
            Dto inDto = cForm.getParamAsDto(request);
            inDto.put("opr_id", account);
            outDto=salesFocusReportService.updateSalesFocusBrandInfo(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);;
    	} catch (Exception e) {
			 e.printStackTrace();
			 outDto.put("failure", new Boolean(true));
	         outDto.put("msg", "品牌相关信息修改失败");
	         String jsonString = JsonHelper.encodeObject2Json(outDto);
	         response.getWriter().write(jsonString);
		}
    	return mapping.findForward(null);
    }
    
    /**
     * 删除品牌相关信息
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward deleteSalesFocusBrandInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
    	Dto outDto=new BaseDto();
    	try {
       	 	String account = super.getSessionContainer(request).getUserInfo().getAccount();
            CommonActionForm cForm = (CommonActionForm)form;
            Dto inDto = cForm.getParamAsDto(request);
            inDto.put("opr_id", account);
            //检验品牌信息是否已有记录
            outDto=salesFocusReportService.deleteSalesFocusBrandInfo(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
    	} catch (Exception e) {
			 e.printStackTrace();
			 outDto.put("failure", new Boolean(true));
	         outDto.put("msg", "品牌相关信息修改失败");
	         String jsonString = JsonHelper.encodeObject2Json(outDto);
	         response.getWriter().write(jsonString);
		}
    	return mapping.findForward(null);
    }
    
    public ActionForward getSalesFocusLeaderReport(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
    	Dto outDto=new BaseDto();
    	try {
    		CommonActionForm cForm = (CommonActionForm)form;
            Dto inDto = cForm.getParamAsDto(request);
    		List list=g4Reader.queryForList("getSalesFocusLeaderReport",inDto);
    		String jsonString = JsonHelper.encodeObject2Json(list);
            super.write(jsonString, response);
		} catch (Exception e) {
			e.printStackTrace();
		}
    	return mapping.findForward(null);
    }
    public ActionForward getSalesFocusLocationReport(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
    	Dto outDto=new BaseDto();
    	try {
    		CommonActionForm cForm = (CommonActionForm)form;
            Dto inDto = cForm.getParamAsDto(request);
    		List list=g4Reader.queryForList("getSalesFocusLocationReport",inDto);
    		String jsonString = JsonHelper.encodeObject2Json(list);
            super.write(jsonString, response);
		} catch (Exception e) {
			e.printStackTrace();
		}
    	return mapping.findForward(null);
    }
    public ActionForward getSalesFocusTeamReport(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
    	Dto outDto=new BaseDto();
    	try {
    		CommonActionForm cForm = (CommonActionForm)form;
            Dto inDto = cForm.getParamAsDto(request);
    		List list=g4Reader.queryForList("getSalesFocusTeamReport",inDto);
    		String jsonString = JsonHelper.encodeObject2Json(list);
            super.write(jsonString, response);
		} catch (Exception e) {
			e.printStackTrace();
		}
    	return mapping.findForward(null);
    }
    public ActionForward getSalesFocusBrandReport(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
    	Dto outDto=new BaseDto();
    	try {
    		CommonActionForm cForm = (CommonActionForm)form;
            Dto inDto = cForm.getParamAsDto(request);
    		List list=g4Reader.queryForList("getSalesFocusBrandReport",inDto);
            //outDto.setDefaultAList(list);
    		//response.getWriter().write(jsonString);
    		String jsonString = JsonHelper.encodeObject2Json(list);
            super.write(jsonString, response);
		} catch (Exception e) {
			e.printStackTrace();
		}
    	return mapping.findForward(null);
    }
    /**
     * 同步验证用户名是否存在于系统中
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward checkOperater(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
    	Dto outDto=new BaseDto();
    	try {
    		CommonActionForm cForm = (CommonActionForm)form;
            Dto inDto = cForm.getParamAsDto(request);
            String operaters=inDto.getAsString("operater");
            String[] users=operaters.split(",");
            String msg="系统中不存在的用户：";
            for (int i = 0; i < users.length; i++) {
				Dto dto=new BaseDto();
				dto.put("user_name", users[i]);
				List list=g4Reader.queryForList("checkOperater", dto);
				if (list.size()==0) {
					msg+=users[i]+"。";
				}
			}
            outDto.put("msg", msg);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
		} catch (Exception e) {
			e.printStackTrace();
		}
    	return mapping.findForward(null);
    }
}
