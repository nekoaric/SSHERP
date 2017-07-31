package com.cnnct.sys.web;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.cnnct.sys.service.RoleService;
import com.cnnct.sys.vo.UserInfoVo;
import com.cnnct.util.ArmConstants;
import com.cnnct.util.BusiConst;
import com.cnnct.util.G4Utils;
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
import com.cnnct.common.ApplicationException;

/**
 * 角色管理与授权
 * 
 * @author XiongChun
 * @since 2010-04-21
 * @see BaseAction
 */
public class RoleAction extends BaseAction{
    Log log = LogFactory.getLog(RoleAction.class);
	private RoleService roleService = (RoleService) super.getService("roleService");

    /**
	 * 角色管理与授权页面初始化
	 * 
	 * @param
	 * @return
	 */
	public ActionForward roleInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		    return mapping.findForward("manageRole4AdminView");
	}
	
	/**
	 * 部门树初始化
	 * 
	 * @param
	 * @return
	 */
	public ActionForward departmentTreeInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		Dto dto = new BaseDto();
		String nodeid = request.getParameter("node");
		dto.put("parentid", nodeid);

		return mapping.findForward(null);
	}
	
	/**
	 * 查询角色列表
	 * 
	 * @param
	 * @return
	 */
	public ActionForward queryRolesForManage(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm)form;
		Dto dto = aForm.getParamAsDto(request);
		UserInfoVo userInfo = getSessionContainer(request).getUserInfo();
	    String grpid = super.getSessionContainer(request).getUserInfo().getGrpId();
        dto.put("grp_id", grpid);

		Dto outDto = roleService.queryRolesForManage(dto);
		response.getWriter().write(outDto.getAsString("jsonString"));
		return mapping.findForward(null);
	}

    /**
     * 菜单授权树初始化
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public synchronized ActionForward menuGrantTreeInit(ActionMapping mapping,ActionForm form,HttpServletRequest request,
                             HttpServletResponse response) throws  Exception{
        CommonActionForm aform = (CommonActionForm)form;
        Dto inDto = aform.getParamAsDto(request);

        inDto.put("user_id",super.getSessionContainer(request).getUserInfo().getUserid());
        Dto outDto = roleService.menuGrantTreeInit(inDto);

        String jsonString = "["+JsonHelper.encodeObject2Json(outDto)+"]";

        super.write(jsonString,response);

        return mapping.findForward(null);
    }
	
	/**
	 * 保存角色
	 * 
	 * @param
	 * @return
	 */
	public ActionForward saveRoleItem(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
	    Dto outDto = new BaseDto();
	    try {
	        CommonActionForm aForm = (CommonActionForm) form;
	        Dto inDto = aForm.getParamAsDto(request);
	        UserInfoVo userInfo = getSessionContainer(request).getUserInfo();

            inDto.put("opr_id",userInfo.getUserid());
            inDto.put("opr_date", G4Utils.getCurDate());
            inDto.put("locked","0");//正常
            inDto.put("flag","0");//正常
            inDto.put("state","0");//正常

	        outDto = roleService.saveRoleItem(inDto);
	        String jsonString = JsonHelper.encodeObject2Json(outDto);
	        response.getWriter().write(jsonString);
        } catch (ApplicationException e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }catch (Exception e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }
		
		return mapping.findForward(null);
	}
	
	/**
	 * 删除角色
	 * 
	 * @param
	 * @return
	 */
	public ActionForward deleteRoleItems(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
	    Dto outDto = new BaseDto();
	    try {
	        CommonActionForm aForm = (CommonActionForm) form;
            Dto inDto = aForm.getParamAsDto(request);
	        outDto = roleService.deleteRoleItems(inDto);
	        String jsonString = JsonHelper.encodeObject2Json(outDto);
	        response.getWriter().write(jsonString);
        } catch (ApplicationException e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }catch (Exception e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }
		
		return mapping.findForward(null);
	}
	
	/**
	 * 修改角色
	 * 
	 * @param
	 * @return
	 */
	public ActionForward updateRoleItem(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
	    Dto outDto = new BaseDto();
	    try {
	        CommonActionForm aForm = (CommonActionForm) form;
	        Dto inDto = aForm.getParamAsDto(request);
	        outDto = roleService.updateRoleItem(inDto);
	        String jsonString = JsonHelper.encodeObject2Json(outDto);
	        response.getWriter().write(jsonString);
        } catch (ApplicationException e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }catch (Exception e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }
		
		return mapping.findForward(null);
	}
	
	/**
	 * 保存角色授权信息
	 * 
	 * @param
	 * @return
	 */
	public ActionForward saveRoleMenuGrant(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto inDto = aForm.getParamAsDto(request);
		Dto outDto = new BaseDto();
		try {
	        outDto = roleService.saveRoleMenuGrant(inDto);

	        String jsonString = JsonHelper.encodeObject2Json(outDto);
	        response.getWriter().write(jsonString);
        } catch (ApplicationException e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }catch (Exception e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }
		
		return mapping.findForward(null);
	}
	
	/**
	 * 保存角色用户关联信息
	 * 
	 * @param
	 * @return
	 */
	public ActionForward saveUser(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		Dto inDto = new BaseDto();
		Dto outDto = new BaseDto();
		try {
		    inDto.put("userid", request.getParameter("userid"));
	        inDto.put("roleid", super.getSessionAttribute(request, "ROLEID_ROLEACTION"));
	        outDto = roleService.saveSelectUser(inDto);
	        String jsonString = JsonHelper.encodeObject2Json(outDto);
	        response.getWriter().write(jsonString);
        } catch (ApplicationException e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }catch (Exception e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }
		
		return mapping.findForward(null);
	}
	
	 /****
     * 查询所有角色类型
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
     public ActionForward queryAllRoleType(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
             throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        UserInfoVo userInfo = getSessionContainer(request).getUserInfo();


        List roletyepList = g4Reader.queryForList("getAllRole", dto);
        String jsonString = JsonHelper.encodeObject2Json(roletyepList);
        super.write(jsonString, response);
        return mapping.findForward(null);
    }
}
