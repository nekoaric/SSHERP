package org.eredlab.g4.arm.web;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.cnnct.sys.service.SysDeptInfoService;
import com.cnnct.sys.service.SysGrpsService;
import com.cnnct.sys.vo.UserInfoVo;
import com.cnnct.util.ArmConstants;
import com.cnnct.util.BusiConst;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.arm.service.UserService;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import com.cnnct.util.G4Utils;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import com.cnnct.common.ApplicationException;

/**
 * 用户管理与授权
 * 
 * @author XiongChun
 * @since 2010-04-21
 * @see BaseAction
 */
@SuppressWarnings({ "unchecked", "rawtypes" })
public class UserAction extends BaseAction {
    Log log = LogFactory.getLog(UserAction.class);
    private UserService userService = (UserService) super.getService("userService");
    private SysDeptInfoService sysDeptInfoService = (SysDeptInfoService) super.getService("sysDeptInfoService");
    private SysGrpsService sysGrpsService = (SysGrpsService) super.getService("sysGrpsService");
    

	/**
     * 用户管理与授权页面初始化
     * 
     * @param
     * @return
     */
    public ActionForward userInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        super.removeSessionAttribute(request, "deptid");
        Dto inDto = new BaseDto();
        String deptid = super.getSessionContainer(request).getUserInfo().getDeptid();

		String usertype = super.getSessionContainer(request).getUserInfo().getUsertype();
		if(usertype.equals(ArmConstants.ACCOUNTTYPE_ADMIN)){
			inDto.put("deptid", deptid.substring(0, BusiConst.GRP_ROOT_DEPTID_LENGTH));
		}else{
			inDto.put("deptid", deptid);
		}
		request.setAttribute("rootusertype", usertype);
		
        Dto outDto = sysDeptInfoService.queryDeptinfoByDeptid(inDto);
        request.setAttribute("rootDeptid", outDto.getAsString("deptid"));
        request.setAttribute("rootDeptname", outDto.getAsString("deptname"));

        inDto.put("notes","managedept");
        String manageDeptRoleId = (String)g4Reader.queryForObject("getEaDataRoleIdByNotes",inDto);
        request.setAttribute("manageDeptRoleId",manageDeptRoleId);
        return mapping.findForward("manageUserView");
    }

	/**
     * 分厂管理员管理与授权页面初始化
     *
     * @param
     * @return
     */
    public ActionForward grpUserInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        super.removeSessionAttribute(request, "deptid");
        Dto inDto = new BaseDto();
        String deptid = super.getSessionContainer(request).getUserInfo().getDeptid();

		String usertype = super.getSessionContainer(request).getUserInfo().getUsertype();
		if(usertype.equals(ArmConstants.ACCOUNTTYPE_ADMIN)){
			inDto.put("deptid", deptid.substring(0, BusiConst.GRP_ROOT_DEPTID_LENGTH));
		}else{
			inDto.put("deptid", deptid);
		}
		request.setAttribute("rootusertype", usertype);

        Dto outDto = sysDeptInfoService.queryDeptinfoByDeptid(inDto);
        request.setAttribute("rootDeptid", outDto.getAsString("deptid"));
        request.setAttribute("rootDeptname", outDto.getAsString("deptname"));

        inDto.put("notes","managedept");
        String manageDeptRoleId = (String)g4Reader.queryForObject("getEaDataRoleIdByNotes",inDto);
        request.setAttribute("manageDeptRoleId",manageDeptRoleId);

        return mapping.findForward("manageGrpUserView");
    }

	/**
     * 用户管理与授权页面初始化
     *
     * @param
     * @return
     */
    public ActionForward userPermInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        Dto inDto = new BaseDto();
        String dept_id = super.getSessionContainer(request).getUserInfo().getDeptid();

        String usertype = super.getSessionContainer(request).getUserInfo().getUsertype();
        inDto.put("dept_id", dept_id);

        request.setAttribute("rootusertype", usertype);
        Dto outDto = sysDeptInfoService.queryDeptinfoByDeptid(inDto);
        request.setAttribute("deptid", outDto.getAsString("dept_id"));
        request.setAttribute("deptname", outDto.getAsString("dept_name"));

        inDto.put("notes","managedept");
        String manageDeptRoleId = (String)g4Reader.queryForObject("getEaDataRoleIdByNotes",inDto);
        request.setAttribute("manageDeptRoleId",manageDeptRoleId);

        return mapping.findForward("manageUserPermView");
    }

    /**
     * 部门管理树初始化
     * 
     * @param
     * @return
     */
    public ActionForward departmentTreeInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        Dto dto = new BaseDto(request);
        String nodeid = request.getParameter("node");
        dto.put("parent_id", nodeid);
        
        dto.put("dept_state", BusiConst.DEPT_STATE_NORMAL);
        Dto outDto = sysDeptInfoService.queryDeptItems(dto);
        response.getWriter().write(outDto.getAsString("jsonString"));
        return mapping.findForward(null);
    }

    /**
     * 查询用户列表
     * 
     * @param
     * @return
     */
    public ActionForward queryUsersForManage(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        String deptid = request.getParameter("deptid");
        dto.put("deptid", deptid);
        UserInfoVo userInfo = getSessionContainer(request).getUserInfo();
//        if (!userInfo.getUsertype().equals(ArmConstants.ACCOUNTTYPE_DEVELOP)) {
//            dto.put("grp_id_pattern", userInfo.getGrpId());
//        }
//        if (userInfo.getUsertype().equals(ArmConstants.ACCOUNTTYPE_PROVINCE)||userInfo.getUsertype().equals(ArmConstants.ACCOUNTTYPE_PROVINCE_OPERATOE)) {
//            dto.put("grp_id_pattern", request.getParameter("grp_id_pattern"));
//            dto.put("local_mng_opr_id", null);
//        }
        dto.put("localuserid", userInfo.getUserid());//当前用户编号
        super.setSessionAttribute(request, "QUERYUSER_QUERYDTO", dto);
        Dto outDto = userService.queryUsersForManage(dto);
        write(outDto.getAsString("jsonString"), response);
        return mapping.findForward(null);
    }

    /**
     * 验证用户account
     */
    public ActionForward validateAcc(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        UserInfoVo userInfo = getSessionContainer(request).getUserInfo();
        String grp_id = userInfo.getGrpId();
        BaseDto inDto = new BaseDto();
        inDto.put("grp_id", grp_id);
        inDto.put("account", request.getParameter("account"));
        Integer cnt = Integer.parseInt(g4Reader.queryForObject("checkAccount", inDto).toString());
        String jsonString = "";
        jsonString = cnt > 0 ? "[{'cnt':" + cnt + "}]" : "[]";
        response.getWriter().write(jsonString);
        return mapping.findForward(null);
    }
    
    /**
     * 保存用户
     * 
     * @param
     * @return
     */
    public synchronized ActionForward saveUserItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        Dto outDto = new BaseDto();
        try {
            CommonActionForm aForm = (CommonActionForm) form;
            Dto inDto = aForm.getParamAsDto(request);
            UserInfoVo userInfo = getSessionContainer(request).getUserInfo();
            String grp_id = userInfo.getGrpId();
            inDto.put("grp_id", grp_id);
            inDto.put("opn_opr_id", userInfo.getUserid()); 

            inDto.put("opn_usertype",userInfo.getUsertype());//操作员usertype
            //设置验厂属性
        	inDto.put("is_audit", G4Utils.getSysIsAudit());
        	
            outDto = userService.saveUserItem(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto, "yyyy-MM-dd");
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
     * 删除用户
     * 
     * @param
     * @return
     */
    public synchronized ActionForward deleteUserItems(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        Dto inDto = new BaseDto();
        try {
            String strChecked = request.getParameter("strChecked");
            inDto.put("strChecked", strChecked);
            Dto outDto = userService.deleteUserItems(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (ApplicationException e) {
            log.info(e.getMessage());
            inDto.put("success", new Boolean(false));
            //inDto.put("msg", "人员信息导入失败，" + e.getMessage());
            String jsonString = JsonHelper.encodeObject2Json(inDto);
            response.getWriter().write(jsonString);
        }catch (Exception e) {
            log.info(e.getMessage());
            inDto.put("success", new Boolean(false));
            //inDto.put("msg", "人员信息导入失败，" + e.getMessage());
            String jsonString = JsonHelper.encodeObject2Json(inDto);
            response.getWriter().write(jsonString);
        }
        
        return mapping.findForward(null);
    }

    /**
     * 修改用户
     * 
     * @param
     * @return
     */
    public synchronized ActionForward updateUserItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        Dto outDto = new BaseDto();
        try {
            CommonActionForm aForm = (CommonActionForm) form;
            Dto inDto = aForm.getParamAsDto(request);
            UserInfoVo userInfo = getSessionContainer(request).getUserInfo();
            inDto.put("grp_id", userInfo.getGrpId());
            Integer temp = (Integer) g4Reader.queryForObject("checkPerNo", inDto);
            if(temp>1){
            	outDto.put("success", new Boolean(false));
                outDto.put("msg", "存在重复的工号!");
                String jsonString = JsonHelper.encodeObject2Json(outDto);
                response.getWriter().write(jsonString);
                return mapping.findForward(null);
            }

            inDto.put("opn_opr_id", userInfo.getUserid());
            inDto.put("opn_usertype",userInfo.getUsertype());//操作员usertype
            //设置验厂属性
        	inDto.put("is_audit",G4Utils.getSysIsAudit());
            
            outDto = userService.updateUserItem(inDto);
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
     * 用户授权页面初始化:选择角色
     * 
     * @param
     * @return
     */
    public ActionForward userGrantInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        super.removeSessionAttribute(request, "USERID_USERACTION");
        String userid = request.getParameter("userid");
        super.setSessionAttribute(request, "USERID_USERACTION", userid);
        return mapping.findForward("selectRoleTreeView");
    }

    /**
     * 用户授权页面初始化:选择菜单
     * 
     * @param
     * @return
     */
    public ActionForward selectMenuInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        return mapping.findForward("selectMenuTreeView");
    }

    /**
     * 保存用户角色关联信息
     * 
     * @param
     * @return
     */
    public ActionForward saveSelectedRole(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        Dto inDto = new BaseDto();
        Dto outDto = new BaseDto();
        try {
            inDto.put("roleid", request.getParameter("roleid"));
            inDto.put("userid", super.getSessionAttribute(request, "USERID_USERACTION"));
            outDto = userService.saveSelectedRole(inDto);
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
     * 保存用户菜单关联信息
     * 
     * @param
     * @return
     */
    public ActionForward saveSelectedMenu(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        Dto inDto = new BaseDto();
        Dto outDto = new BaseDto();
        try {
            inDto.put("menuid", request.getParameter("menuid"));
            inDto.put("userid", super.getSessionAttribute(request, "USERID_USERACTION"));
            outDto = userService.saveSelectedMenu(inDto);
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


    /****
     * 查询所有角色
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward queryAllRole(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        UserInfoVo userInfo = getSessionContainer(request).getUserInfo();
        dto.put("grp_id", userInfo.getGrpId());
        //企业主管能看到本企业操作员角色
        if (userInfo.getUsertype().equals(ArmConstants.ACCOUNTTYPE_ADMIN)) {
            dto.put("roletype", "'3','4','5'");
        }
        //分厂主管看到其对应部门的角色信息
        if (userInfo.getUsertype().equals(ArmConstants.ACCOUNTTYPE_GRPMANAGE)) {
            dto.put("roletype", "'3','5'");
        }
        List roleList = g4Reader.queryForList("getAllRole", dto);
        String jsonString = JsonHelper.encodeObject2Json(roleList);
        super.write(jsonString, response);
        return mapping.findForward(null);
    }

    
    /**
     * 发送密码
     * 
     * @param
     * @return
     */
    public synchronized ActionForward sendPwd(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        Dto inDto = new BaseDto();
        try {
            String userid = request.getParameter("userid");
            String account = request.getParameter("account");
            String usertype = request.getParameter("usertype");
            inDto.put("userid", userid);
            inDto.put("account", account);
            inDto.put("usertype", usertype);
            Dto outDto = userService.sendPwd(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (ApplicationException e) {
            log.info(e.getMessage());
            inDto.put("success", new Boolean(false));
            inDto.put("msg", "密码发送失败，" + e.getMessage());
            String jsonString = JsonHelper.encodeObject2Json(inDto);
            response.getWriter().write(jsonString);
        }catch (Exception e) {
            log.info(e.getMessage());
            inDto.put("success", new Boolean(false));
            //inDto.put("msg", "人员信息导入失败，" + e.getMessage());
            String jsonString = JsonHelper.encodeObject2Json(inDto);
            response.getWriter().write(jsonString);
        }
        
        return mapping.findForward(null);
    }

    public ActionForward loadUserInfo(ActionMapping mapping, ActionForm form,
            HttpServletRequest request, HttpServletResponse response) throws Exception {
        Dto inDto = new BaseDto();
        String userid = request.getParameter("userid");
        inDto.put("userid", userid);
        Dto outDto = (BaseDto)g4Reader.queryForObject("getUserInfoByKey", inDto);
        outDto.put("password", G4Utils.decryptBasedDes(outDto.getAsString("password")));
        String jsonString = JsonHelper.encodeDto2FormLoadJson(outDto, null);
        write(jsonString, response);
        return mapping.findForward(null);
    }
    
    public ActionForward getUserInfo(ActionMapping mapping, ActionForm form,
            HttpServletRequest request, HttpServletResponse response) throws Exception {
    	CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        dto.put("grp_id", super.getSessionContainer(request).getUserInfo().getGrpId());
        List userList = g4Reader.queryForPage("getUserInfo4Temp", dto);
        Integer userCount = g4Reader.queryForPageCount("getUserInfo4Temp", dto);
        
        String jsonString = JsonHelper.encodeList2PageJson(userList, userCount, "yyyy-MM-dd");
        write(jsonString, response);
        return mapping.findForward(null);
    }
    
    /**
     * 查询部门列表(表格树数据)
     * 
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward deptTreeInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        try {
            Dto dto = new BaseDto(request);
            String nodeid = request.getParameter("node");
            dto.put("parentid", nodeid);
            dto.put("grp_id", getSessionContainer(request).getUserInfo().getGrpId());
            
            // 查询状态为正常的部门
			dto.put("deptstate", BusiConst.DEPT_STATE_NORMAL);
            List deptList = g4Reader.queryForList("queryDeptTree4Temp", dto);
            Dto deptDto = new BaseDto();
            for (int i = 0; i < deptList.size(); i++) {
                deptDto = (BaseDto) deptList.get(i);
//                deptDto.put("checked", new Boolean(false));//设置树选择为选择框形式
                if (deptDto.getAsString("leaf").equals(ArmConstants.LEAF_Y))
                    deptDto.put("leaf", new Boolean(true));
                else
                    deptDto.put("leaf", new Boolean(false));
                
                if (deptDto.getAsString("id").length() == 8)
                    deptDto.put("expanded", new Boolean(true));
                
                deptDto.put("iconCls", "folder_userIcon");
            }
            String jsonString = JsonHelper.encodeObject2Json(deptList);
            super.write(jsonString, response);
        } catch (Exception e) {
            throw new Exception(e);
        }

        return mapping.findForward(null);
    }

    /**
     * 查询角色列表
     *
     * @param
     * @return
     */
    public ActionForward queryEaUserAuthorize(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        UserInfoVo userInfo = getSessionContainer(request).getUserInfo();
        dto.put("grp_id", userInfo.getGrpId());//当前用户编号

        List userList = g4Reader.queryForPage("queryEaUserAuthorize", dto);
        Integer pageCount = g4Reader.queryForPageCount("queryEaUserAuthorize", dto);
        String jsonString = JsonHelper.encodeList2PageJson(userList, pageCount,"yyyy-MM-dd");
        response.getWriter().write(jsonString);
        return mapping.findForward(null);
    }

    /**
     * 保存角色用户关联信息
     *
     * @param
     * @return
     */
    public ActionForward saveEaUserAuthorize(ActionMapping mapping, ActionForm form, HttpServletRequest request,
           HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm)form;
        Dto inDto = aForm.getParamAsDto(request);
        inDto.put("grp_id",super.getSessionContainer(request).getUserInfo().getGrpId());
        Dto outDto = new BaseDto();
        try {
            outDto = userService.saveEaUserAuthorize(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (ApplicationException e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "用户角色关联失败!");
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }catch (Exception e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            outDto.put("msg",  "用户角色关联失败!");
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }

        return mapping.findForward(null);
    }

    /**
     * 删除角色用户关联信息
     *
     * @param
     * @return
     */
    public ActionForward delEaUserAuthorize(ActionMapping mapping, ActionForm form, HttpServletRequest request,
           HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm)form;
        Dto inDto = aForm.getParamAsDto(request);
        Dto outDto = new BaseDto();
        try {
            outDto = userService.delEaUserAuthorize(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (ApplicationException e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "用户角色数据关联失败!");
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }catch (Exception e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            outDto.put("msg",  "用户角色数据关联失败!");
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }

        return mapping.findForward(null);
    }

    /**
     * 查询分厂管理员信息
     *
     * @param
     * @return
     */
    public ActionForward queryGrpUserList(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        String deptid = request.getParameter("deptid");
        dto.put("deptid", deptid);

        List list = g4Reader.queryForList("queryGrpUserList",dto);
        Integer pageCount = g4Reader.queryForPageCount("queryGrpUserList",dto);

        String jsonString = JsonHelper.encodeList2PageJson(list,pageCount,"yyyy-MM-dd");
        write(jsonString, response);
        return mapping.findForward(null);
    }
    


}
