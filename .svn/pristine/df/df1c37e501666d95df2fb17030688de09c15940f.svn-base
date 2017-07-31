package org.eredlab.g4.arm.web;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.cnnct.util.G4Utils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.arm.service.ResourceService;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import com.cnnct.common.ApplicationException;

/**
 * 资源模型
 * 
 * @author XiongChun
 * @since 2010-01-31
 * @see BaseAction
 */
public class ResourceAction extends BaseAction {
    Log log = LogFactory.getLog(ResourceAction.class);
	
	private ResourceService resourceService = (ResourceService) super.getService("resourceService");

	/**
	 * 菜单资源管理页面初始化
	 * 
	 * @param
	 * @return
	 */
	public ActionForward menuResourceInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		super.removeSessionAttribute(request, "menuid");
		return mapping.findForward("manageMenuResourceView");
	}

	/**
	 * 查询菜单项目 生成菜单树
	 * 
	 * @param
	 * @return
	 */
	public ActionForward queryMenuItems(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		Dto dto = new BaseDto();
		String nodeid = request.getParameter("node");
		dto.put("parentid", nodeid);
		Dto outDto = resourceService.queryMenuItems(dto);
		response.getWriter().write(outDto.getAsString("jsonString"));
		return mapping.findForward(null);
	}

	/**
	 * 查询菜单项目 - 菜单管理
	 * 
	 * @param
	 * @return
	 */
	public ActionForward queryMenuItemsForManage(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm)form;
		Dto dto = aForm.getParamAsDto(request);
		String menuid = request.getParameter("menuid");
		if (G4Utils.isNotEmpty(menuid)) {
			super.setSessionAttribute(request, "menuid", menuid);
		}
		dto.put("menuid", super.getSessionAttribute(request, "menuid"));
		Dto outDto = resourceService.queryMenuItemsForManage(dto);
		response.getWriter().write(outDto.getAsString("jsonString"));
		return mapping.findForward(null);
	}

	/**
	 * 保存菜单
	 * 
	 * @param
	 * @return
	 */
	public ActionForward saveMenuItem(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
	    Dto outDto = new BaseDto();
	    try {
	        CommonActionForm aForm = (CommonActionForm) form;
	        Dto inDto = aForm.getParamAsDto(request);
	        outDto = resourceService.saveMenuItem(inDto);
	        String jsonString = JsonHelper.encodeObject2Json(outDto);
	        response.getWriter().write(jsonString);
        } catch (ApplicationException e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            //outDto.put("msg", "人员信息导入失败，" + e.getMessage());
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }catch (Exception e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            //outDto.put("msg", "人员信息导入失败，" + e.getMessage());
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }
		
		return mapping.findForward(null);
	}

	/**
	 * 修改菜单
	 * 
	 * @param
	 * @return
	 */
	public ActionForward updateMenuItem(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
	    Dto outDto = new BaseDto();
	    try {
	        CommonActionForm aForm = (CommonActionForm) form;
	        Dto inDto = aForm.getParamAsDto(request);
	        outDto = resourceService.updateMenuItem(inDto);
	        String jsonString = JsonHelper.encodeObject2Json(outDto);
	        response.getWriter().write(jsonString);
        }catch (ApplicationException e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            //outDto.put("msg", "人员信息导入失败，" + e.getMessage());
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }catch (Exception e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            //outDto.put("msg", "人员信息导入失败，" + e.getMessage());
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }
		
		return mapping.findForward(null);
	}

	/**
	 * 删除菜单项
	 * 
	 * @param
	 * @return
	 */
	public ActionForward deleteMenuItems(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
	    Dto outDto = new BaseDto();
	    try {
	        String strChecked = request.getParameter("strChecked");
	        String type = request.getParameter("type");
	        String menuid = request.getParameter("menuid");
	        Dto inDto = new BaseDto();
	        inDto.put("strChecked", strChecked);
	        inDto.put("type", type);
	        inDto.put("menuid", menuid);
	        outDto = resourceService.deleteMenuItems(inDto);
	        String jsonString = JsonHelper.encodeObject2Json(outDto);
	        response.getWriter().write(jsonString);
        }catch (ApplicationException e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            //outDto.put("msg", "人员信息导入失败，" + e.getMessage());
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }catch (Exception e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            //outDto.put("msg", "人员信息导入失败，" + e.getMessage());
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }
		
		return mapping.findForward(null);
	}

	/**
	 * 代码表管理页面初始化
	 * 
	 * @param
	 * @return
	 */
	public ActionForward codeTableInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		return mapping.findForward("codeTableView");
	}

	/**
	 * 查询代码表
	 * 
	 * @param
	 * @return
	 */
	public ActionForward queryCodeItems(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm)form;
		Dto inDto = aForm.getParamAsDto(request);
//		inDto.put("field", "('SOC_PROV','EAMA')");
		Dto outDto = resourceService.getCodeListForManage(inDto);
		String jsonStrList = outDto.getAsString("jsonStrList");
		response.getWriter().write(jsonStrList);
		return mapping.findForward(null);
	}

	/**
	 * 保存代码表
	 * 
	 * @param
	 * @return
	 */
	public ActionForward saveCodeItem(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
	    Dto outDto = new BaseDto();
	    try {
	        CommonActionForm aForm = (CommonActionForm) form;
	        Dto inDto = aForm.getParamAsDto(request);
	        String field = inDto.getAsString("field");
	        if("EAMA".equals(field)){
	        	inDto.put("fieldname", "体检");
	        }else if("SOC_PROV".equals(field)){
	        	inDto.put("fieldname", "社保|公积金");
	        }
	        outDto = resourceService.saveCodeItem(inDto);
	        
	        List codeList = g4Reader.queryForList("getCodeList");
		    getServlet().getServletContext().removeAttribute("EACODELIST");
		    getServlet().getServletContext().setAttribute("EACODELIST", codeList);
	        
	        String jsonString = JsonHelper.encodeObject2Json(outDto);
	        response.getWriter().write(jsonString);
        }catch (ApplicationException e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            //outDto.put("msg", "人员信息导入失败，" + e.getMessage());
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }catch (Exception e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            //outDto.put("msg", "人员信息导入失败，" + e.getMessage());
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }
		
		return mapping.findForward(null);
	}

	/**
	 * 删除代码表
	 * 
	 * @param
	 * @return
	 */
	public ActionForward deleteCodeItem(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
	    Dto outDto = new BaseDto();
	    try {
	        String strChecked = request.getParameter("strChecked");
	        Dto inDto = new BaseDto();
	        inDto.put("strChecked", strChecked);
	        outDto = resourceService.deleteCodeItem(inDto);
	        
	        List codeList = g4Reader.queryForList("getCodeList");
		    getServlet().getServletContext().removeAttribute("EACODELIST");
		    getServlet().getServletContext().setAttribute("EACODELIST", codeList);
	        
	        String jsonString = JsonHelper.encodeObject2Json(outDto);
	        response.getWriter().write(jsonString);
        }catch (ApplicationException e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            //outDto.put("msg", "人员信息导入失败，" + e.getMessage());
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }catch (Exception e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            //outDto.put("msg", "人员信息导入失败，" + e.getMessage());
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }
		
		return mapping.findForward(null);
	}

	/**
	 * 修改代码表
	 * 
	 * @param
	 * @return
	 */
	public ActionForward updateCodeItem(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
	    Dto outDto = new BaseDto();
	    try {
	        CommonActionForm aForm = (CommonActionForm) form;
	        Dto inDto = aForm.getParamAsDto(request);
	        String field = inDto.getAsString("field");
	        if("EAMA".equals(field)){
	        	inDto.put("fieldname", "体检");
	        }else if("SOC_PROV".equals(field)){
	        	inDto.put("fieldname", "社保|公积金");
	        }
	        outDto = resourceService.updateCodeItem(inDto);
	        
	        //更新到内存
	        List codeList = g4Reader.queryForList("getCodeList");
		    getServlet().getServletContext().removeAttribute("EACODELIST");
		    getServlet().getServletContext().setAttribute("EACODELIST", codeList);
	        
	        String jsonString = JsonHelper.encodeObject2Json(outDto);
	        response.getWriter().write(jsonString);
        } catch (ApplicationException e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            //outDto.put("msg", "人员信息导入失败，" + e.getMessage());
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }catch (Exception e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            //outDto.put("msg", "人员信息导入失败，" + e.getMessage());
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }
		
		return mapping.findForward(null);
	}
	
	
	/**
	 * 系统图标页面初始化
	 * 
	 * @param
	 * @return
	 */
	public ActionForward iconInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		return mapping.findForward("manageIconView");
	}
	
	/**
	 * 查询系统图标
	 * 
	 * @param
	 * @return
	 */
	public ActionForward queryIconItems(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		Dto outDto = resourceService.queryIconsForManage(inDto);
		String jsonStrList = outDto.getAsString("jsonString");
		response.getWriter().write(jsonStrList);
		return mapping.findForward(null);
	}
	
	/**
	 * 调色板页面初始化
	 * 
	 * @param
	 * @return
	 */
	public ActionForward colorPaletteInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		return mapping.findForward("colorPaletteView");
	}
}
