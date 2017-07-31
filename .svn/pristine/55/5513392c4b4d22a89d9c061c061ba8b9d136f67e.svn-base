package com.cnnct.sys.web;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.upload.FormFile;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.report.excel.ExcelReader;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import com.cnnct.common.ApplicationException;
import com.cnnct.sys.service.ManageUserInfoService;
import com.cnnct.sys.service.SysDeptInfoService;
import com.cnnct.sys.service.SysGrpsService;
import com.cnnct.sys.vo.UserInfoVo;
import com.cnnct.util.ArmConstants;
import com.cnnct.util.BusiConst;
import com.cnnct.util.DataPermUtil;
import com.cnnct.util.G4Utils;

/**
 * *********************************************
 * 创建日期: 2013-06-17
 * 创建作者：may
 * 功能：用户管理
 * 最后修改时间：
 * 修改记录：
 * ***********************************************
 */
@SuppressWarnings({ "unchecked", "rawtypes" })
public class ManageUserInfoAction extends BaseAction {
    Log log = LogFactory.getLog(SysUserInfoAction.class);
    private ManageUserInfoService manageUserService = (ManageUserInfoService) super.getService("manageUserService");
    private SysDeptInfoService sysDeptService = (SysDeptInfoService)super.getService("sysDeptInfoService");

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
        System.out.println(nodeid);
        dto.put("parent_id", nodeid);
        dto.put("dept_state", BusiConst.DEPT_STATE_NORMAL);
        Dto outDto = sysDeptService.queryDeptItems(dto);
        response.getWriter().write(outDto.getAsString("jsonString"));
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
            inDto.put("opn_user_type",userInfo.getUsertype());//操作员usertype
            outDto = manageUserService.saveUserItem(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto, "yyyy-MM-dd");
            response.getWriter().write(jsonString);
        } catch (ApplicationException e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }catch (Exception e) {
        	e.printStackTrace();
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            String jsonString = JsonHelper.encodeObject2Json(outDto);
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
            inDto.put("opn_user_type",userInfo.getUsertype());//操作员usertype
            //设置验厂属性
        	inDto.put("is_audit", G4Utils.getSysIsAudit());
            
            outDto = manageUserService.updateUserItem(inDto);
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
        String userid = request.getParameter("user_id");
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


    public ActionForward loadUserInfo(ActionMapping mapping, ActionForm form,
            HttpServletRequest request, HttpServletResponse response) throws Exception {
        Dto inDto = new BaseDto();
        String userid = request.getParameter("userid");
        inDto.put("user_id", userid);
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
            dto.put("parent_id", nodeid);
            dto.put("grp_id", getSessionContainer(request).getUserInfo().getGrpId());
            
            // 查询状态为正常的部门
			dto.put("dept_state", BusiConst.DEPT_STATE_NORMAL);
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
     * 删除角色用户关联信息
     *
     * @param
     * @return
     */
    public ActionForward delSysUserRoleMap(ActionMapping mapping, ActionForm form, HttpServletRequest request,
           HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm)form;
        Dto inDto = aForm.getParamAsDto(request);
        Dto outDto = new BaseDto();
        try {
            outDto = manageUserService.delSysUserRoleMap(inDto);
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
        String deptid = request.getParameter("dept_id");
        dto.put("dept_id", deptid);

        List list = g4Reader.queryForList("queryGrpUserList",dto);
        Integer pageCount = g4Reader.queryForPageCount("queryGrpUserList",dto);

        String jsonString = JsonHelper.encodeList2PageJson(list,pageCount,"yyyy-MM-dd");
        write(jsonString, response);
        return mapping.findForward(null);
    }

}
