package com.cnnct.sys.web;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
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
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.report.excel.ExcelExporter;
import org.eredlab.g4.rif.report.excel.ExcelReader;
import org.eredlab.g4.rif.util.WebUtils;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import com.cnnct.common.ApplicationException;
import com.cnnct.rfid.web.excelParse.OrdDayExcelParseFactory;
import com.cnnct.sys.service.SysDeptInfoService;
import com.cnnct.sys.service.SysGrpsService;
import com.cnnct.sys.service.SysUserInfoService;
import com.cnnct.sys.vo.UserInfoVo;
import com.cnnct.util.ArmConstants;
import com.cnnct.util.BusiConst;
import com.cnnct.util.DataPermUtil;
import com.cnnct.util.ExcelUtil;
import com.cnnct.util.G4Utils;
import com.cnnct.util.NatureUtil;

/**
 * *********************************************
 * 创建日期: 2013-01-18
 * 创建作者：may
 * 功能：用户管理
 * 最后修改时间：
 * 修改记录：
 * ***********************************************
 */

@SuppressWarnings({"unchecked", "rawtypes"})
public class SysUserInfoAction extends BaseAction {
    Log log = LogFactory.getLog(SysUserInfoAction.class);
    private SysUserInfoService sysUserService = (SysUserInfoService) super.getService("sysUserInfoService");
    private SysDeptInfoService sysDeptService = (SysDeptInfoService) super.getService("sysDeptInfoService");

    /**
     * 企业人员管理页面初始化
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward sysUserInfoInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        super.removeSessionAttribute(request, "dept_id");
        Dto inDto = new BaseDto();
        String deptid = super.getSessionContainer(request).getUserInfo().getDeptid();

        String usertype = super.getSessionContainer(request).getUserInfo().getUsertype();
        if (usertype.equals(ArmConstants.ACCOUNTTYPE_ADMIN)) {
            inDto.put("dept_id", deptid.substring(0, BusiConst.GRP_ROOT_DEPTID_LENGTH));
        } else {
            inDto.put("dept_id", deptid);
        }
        request.setAttribute("rootusertype", usertype);

        Dto outDto = sysDeptService.queryDeptinfoByDeptid(inDto);
        request.setAttribute("root_dept_id", outDto.getAsString("dept_id"));
        request.setAttribute("root_dept_name", outDto.getAsString("dept_name"));

        return mapping.findForward("sysUserInfoView");
    }

    /**
     * 用户(操作员)管理与授权页面初始化
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward manageUserInfoInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        super.removeSessionAttribute(request, "dept_id");
        Dto inDto = new BaseDto();
        String deptid = super.getSessionContainer(request).getUserInfo().getDeptid();

        String usertype = super.getSessionContainer(request).getUserInfo().getUsertype();
        if(usertype.equals(ArmConstants.ACCOUNTTYPE_ADMIN)){
            inDto.put("dept_id", deptid.substring(0, BusiConst.GRP_ROOT_DEPTID_LENGTH));
        }else{
            //分厂及其他管理员的话只能看到他所属部门下的人员
            inDto.put("dept_id", deptid);
        }
        request.setAttribute("rootusertype", usertype);

        Dto outDto = sysDeptService.queryDeptinfoByDeptid(inDto);
        request.setAttribute("rootDeptid", outDto.getAsString("dept_id"));
        request.setAttribute("rootDeptname", outDto.getAsString("dept_name"));

        return mapping.findForward("manageUserView");
    }

    /**
     * 分厂管理员管理与授权页面初始化
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward manageGrpUserInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        Dto inDto = new BaseDto();
        String deptid = super.getSessionContainer(request).getUserInfo().getDeptid();

        String usertype = super.getSessionContainer(request).getUserInfo().getUsertype();
        if(usertype.equals(ArmConstants.ACCOUNTTYPE_ADMIN)){
            inDto.put("dept_id", deptid.substring(0, BusiConst.GRP_ROOT_DEPTID_LENGTH));
        }else{
            inDto.put("dept_id", deptid);
        }

        Dto outDto = sysDeptService.queryDeptinfoByDeptid(inDto);
        request.setAttribute("root_dept_name", outDto.getAsString("dept_name"));

        inDto.put("notes","managedept");
        String manageDeptRoleId = (String)g4Reader.queryForObject("getEaDataRoleIdByNotes",inDto);
        request.setAttribute("manageDeptRoleId",manageDeptRoleId);

        return mapping.findForward("manageGrpUserView");
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
        System.out.println(nodeid);
        dto.put("parent_id", nodeid);
        dto.put("dept_state", BusiConst.DEPT_STATE_NORMAL);
        Dto outDto = sysDeptService.queryDeptItems(dto);
        response.getWriter().write(outDto.getAsString("jsonString"));
        return mapping.findForward(null);
    }

    /**
     * 查询普通员工列表
     * @param
     * @return
     * @throws Exception
     */
    public ActionForward querySysUserInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                             HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        UserInfoVo userInfo = getSessionContainer(request).getUserInfo();
        dto.put("localuser_id", userInfo.getUserid());//当前用户编号
        dto.put("user_type", ArmConstants.ACCOUNTTYPE_NORMAL);//查找正常人员信息
        super.setSessionAttribute(request, "QUERYSYSUSERINFO_QUERYDTO", dto);
        Dto outDto = sysUserService.queryUsersForManage(dto);
        write(outDto.getAsString("jsonString"), response);
        return mapping.findForward(null);
    }

    /**
     * 查询操作员列表
     *
     * @param
     * @return
     */
    public ActionForward queryUsersForManage(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                             HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        UserInfoVo userInfo = getSessionContainer(request).getUserInfo();
        dto.put("localuser_id", userInfo.getUserid());//当前用户编号

        dto.put("user_type",ArmConstants.ACCOUNTTYPE_OPERATOR);
        super.setSessionAttribute(request, "QUERYUSER_QUERYDTO", dto);
        Dto outDto = sysUserService.queryUsersForManage(dto);
        write(outDto.getAsString("jsonString"), response);
        return mapping.findForward(null);
    }

    /**
     * 验证用户account
     */
    public ActionForward validateAcc(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto inDto = aForm.getParamAsDto(request);

        UserInfoVo userInfo = getSessionContainer(request).getUserInfo();
        inDto.put("grp_id", userInfo.getGrpId());
        Integer cnt = Integer.parseInt(g4Reader.queryForObject("checkAccount", inDto).toString());
        String jsonString = cnt > 0 ? "[{'cnt':" + cnt + "}]" : "[]";
        response.getWriter().write(jsonString);
        return mapping.findForward(null);
    }

    /**
     * 保存系统用户信息
     *
     * @param
     * @return
     */
    public synchronized ActionForward saveSysUserInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        Dto outDto = new BaseDto();
        try {
            CommonActionForm aForm = (CommonActionForm) form;
            Dto inDto = aForm.getParamAsDto(request);
            UserInfoVo userInfo = getSessionContainer(request).getUserInfo();
            inDto.put("grp_id", userInfo.getGrpId());
            inDto.put("opn_opr_id", userInfo.getUserid());//操作人员userid

            outDto = sysUserService.saveSysUserInfo(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto, "yyyy-MM-dd");
            response.getWriter().write(jsonString);
        } catch (ApplicationException e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (Exception e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }

        return mapping.findForward(null);
    }

    /**
     * 修改员工信息
     *
     * @param
     * @return
     */
    public synchronized ActionForward updateSysUserInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        Dto outDto = new BaseDto();
        try {
            CommonActionForm aForm = (CommonActionForm) form;
            Dto inDto = aForm.getParamAsDto(request);
            UserInfoVo userInfo = getSessionContainer(request).getUserInfo();
            inDto.put("grp_id", userInfo.getGrpId());
            Integer temp = (Integer) g4Reader.queryForObject("checkPerNo", inDto);
            if (temp > 1) {
                outDto.put("success", new Boolean(false));
                outDto.put("msg", "存在重复的工号!");
                String jsonString = JsonHelper.encodeObject2Json(outDto);
                response.getWriter().write(jsonString);
                return mapping.findForward(null);
            }

            inDto.put("opn_opr_id", userInfo.getUserid());
            inDto.put("opn_user_type", userInfo.getUsertype());//操作员usertype

            outDto = sysUserService.updateSysUserInfo(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (ApplicationException e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (Exception e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }

        return mapping.findForward(null);
    }

    /**
     * 保存用户信息(操作员)
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
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
            outDto = sysUserService.saveUserItem(inDto);
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
     * 修改操作员
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
            if (temp > 1) {
                outDto.put("success", new Boolean(false));
                outDto.put("msg", "存在重复的工号!");
                String jsonString = JsonHelper.encodeObject2Json(outDto);
                response.getWriter().write(jsonString);
                return mapping.findForward(null);
            }

            inDto.put("opn_opr_id", userInfo.getUserid());
            inDto.put("opn_user_type", userInfo.getUsertype());//操作员usertype

            outDto = sysUserService.updateUserItem(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (ApplicationException e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (Exception e) {
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
            //todo 删除用户时不删除数据
            String strChecked = request.getParameter("strChecked");
            inDto.put("strChecked", strChecked);//选择的人员列表
            Dto outDto = sysUserService.deleteUserItems(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (ApplicationException e) {
            log.info(e.getMessage());
            inDto.put("success", new Boolean(false));
            String jsonString = JsonHelper.encodeObject2Json(inDto);
            response.getWriter().write(jsonString);
        } catch (Exception e) {
            log.info(e.getMessage());
            inDto.put("success", new Boolean(false));
            String jsonString = JsonHelper.encodeObject2Json(inDto);
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
    public ActionForward delSysUserRoleMap(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                           HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm)form;
        Dto inDto = aForm.getParamAsDto(request);
        Dto outDto = new BaseDto();
        try {
            outDto = sysUserService.delSysUserRoleMap(inDto);
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
     * 载入用户密码信息
     * @param
     * @return
     * @throws Exception
     */
    public ActionForward loadUserInfo(ActionMapping mapping, ActionForm form,
                                      HttpServletRequest request, HttpServletResponse response) throws Exception {
        Dto inDto = new BaseDto();
        String userid = request.getParameter("user_id");
        inDto.put("user_id", userid);
        Dto outDto = (BaseDto) g4Reader.queryForObject("getUserInfoByKey", inDto);
        outDto.put("password", G4Utils.decryptBasedDes(outDto.getAsString("password")));
        String jsonString = JsonHelper.encodeDto2FormLoadJson(outDto, null);
        write(jsonString, response);
        return mapping.findForward(null);
    }

    /**
     * user.js中查询员工信息
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
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
     * 人员信息导入
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward importUserInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm actionForm = (CommonActionForm) form;
        UserInfoVo user = super.getSessionContainer(request).getUserInfo();
        Dto outDto = new BaseDto();
        try {
            FormFile theFile = actionForm.getTheFile();

            //姓名	部门	性别	地址	身份证号	出生年月	联系电话	手机号码	备注
            String metaData = "user_name,deptnames,sex,address,id_crd,birthday,tel_no,mbl_no,remark";
            ExcelReader excelReader = new ExcelReader(metaData, theFile.getInputStream());
            List list = excelReader.read(0, 0);

            if (list.size() > 0) {
                Dto impList = (Dto) list.get(0);
                if (impList.size() != metaData.trim().split(",").length) {
                    outDto.put("success", new Boolean(false));
                    outDto.put("msg", "导入失败！Excel文件格式有误,请对照下载的模版文件的格式填写文件");
                    response.getWriter().println(outDto.toJson());
                    return mapping.findForward(null);
                }
            } else {
                outDto.put("success", new Boolean(false));
                outDto.put("msg", "导入失败！Excel文件格式有误,请对照下载的模版文件的格式填写文件");
                response.getWriter().println(outDto.toJson());
                return mapping.findForward(null);
            }

            list.remove(0);//去除第一列的信息
            Dto dto = new BaseDto();
            dto.put("grp_id", user.getGrpId());

            // 验证人员信息
            list = validateUserInfo(list, dto);

            for (Object aList : list) {
                Dto userDto = (BaseDto) aList;
                userDto.put("grp_id", user.getGrpId());
                userDto.put("opn_opr_id", user.getUserid());

                sysUserService.saveSysUserInfo(userDto);
            }

            outDto.put("success", new Boolean(true));
            outDto.put("msg", "人员信息导入成功！");
            super.write(outDto.toJson(), response);
        } catch (ApplicationException e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "人员信息导入失败，" + e.getMessage());
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (Exception e) {
            e.printStackTrace();
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "人员信息导入失败，" + e.getMessage());
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }

        return mapping.findForward(null);
    }

    //导出人员信息
	public ActionForward excleUserInfoAction(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		Dto parametersDto = new BaseDto();
		Dto devDto = new BaseDto();
		Dto inDto = (BaseDto)super.getSessionAttribute(request, "QUERYSYSUSERINFO_QUERYDTO");
		parametersDto.put("reportTitle", "人员信息"); // parameter
		inDto.remove("queryForPageCountFlag");
		List list = g4Reader.queryForList("querySysUsersForManage", inDto);
		for (int i = 0; i < list.size(); i++) {
			devDto = (Dto) list.get(i);
			if (devDto.getAsString("state").equals("0")) {
				devDto.put("state", "正常");
			} else if (devDto.getAsString("state").equals("1")) {
				devDto.put("state", "注销");
			}
		}
		ExcelExporter excelExporter = new ExcelExporter();
		excelExporter.setTemplatePath("/report/excel/sysUserInfo.xls");
		excelExporter.setData(parametersDto, list);
		excelExporter.setFilename("人员信息表" + ".xls");
		excelExporter.export(request, response);
		return mapping.findForward(null);
	}

    /**
     * 验证用户信息导入数据合法性
     *
     * @param list
     * @param inDto
     * @return
     * @throws ApplicationException
     */
    public List validateUserInfo(List list, Dto inDto) throws ApplicationException {
        try {
            String grp_id = inDto.getAsString("grp_id");

            Dto qDto = new BaseDto();
            qDto.put("grp_id", grp_id);
            qDto.put("leaf", 1);
            List deptList = g4Reader.queryForList("queryDept4Import", qDto);
            int size = list.size();
            for (int i = 0; i < size; i++) {
                BaseDto dto = (BaseDto) list.get(i);

                String deptnames = dto.getAsString("deptnames");
                String user_name = dto.getAsString("user_name");
                dto.put("user_name", user_name.trim());

                String birthday = dto.getAsString("birthday");

                if (!birthday.equals("")) {
                    if (!isValidDate(birthday)) {
                        throw new ApplicationException("[出生年月]格式错误（日期格式格式为\"1988-08-08\"），" +
                                "请核对第" + (i + 2) + "日期格式");
                    }
                }

                String sex = dto.getAsString("sex");//1-男 2-女
                if ("男".equals(sex)) {
                    dto.put("sex", "1");
                } else if ("女".equals(sex)) {
                    dto.put("sex", "2");
                } else {
                    dto.put("sex", 1);
                }

                if (!deptnames.equals("")) {
                    for (Object aDeptList : deptList) {
                        Dto deptDto = (BaseDto) aDeptList;
                        if (deptnames.equalsIgnoreCase(deptDto.getAsString("deptnames"))) {
                            dto.put("dept_id", deptDto.getAsString("dept_id"));
                            break;
                        }
                    }
                } else {
                    throw new ApplicationException("[部门]必须填写，请核对第" + (i + 2) + "行部门信息");
                }
                if ("".equals(dto.getAsString("dept_id"))) {
                    throw new ApplicationException("[部门]格式填写错误，请核对第" + (i + 2) + "行部门信息");
                }

            }
        } catch (ApplicationException e) {
            throw new ApplicationException(e.getMessage());
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage());
        }
        return list;
    }

    public static boolean isValidDate(String s) {
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date date = dateFormat.parse(s);
            return s.equals(dateFormat.format(date));
        } catch (Exception e) {
            // 如果throw java.text.ParseException或者NullPointerException，就说明格式不对
            return false;
        }
    }

    /**
     * 管理员绑定epc
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward bindEpc4User(ActionMapping mapping,ActionForm form,HttpServletRequest request,
                                      HttpServletResponse response) throws  Exception{
        CommonActionForm aform = (CommonActionForm)form;
        Dto outDto = new BaseDto();
        try{
            Dto inDto = aform.getParamAsDto(request);
            outDto = sysUserService.bindEpc4User(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            super.write(jsonString,response);
        }catch (Exception e) {
            outDto.put("success", new Boolean(false));
            outDto.put("msg", e.getMessage());
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            super.write(jsonString,response);
        }
        return mapping.findForward(null);
    }

    /**
     * 外发权限管理页面初始化
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward outUserInfoInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {

        return mapping.findForward("manageUserOutView");
    }
    
    /**
     * 查询所有员工权限
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward queryUserOutList(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
    	CommonActionForm aForm = (CommonActionForm) form;
    	UserInfoVo user = super.getSessionContainer(request).getUserInfo();
        String grp_id = user.getGrpId();
        String opr_id = user.getAccount();
        Dto dto = aForm.getParamAsDto(request);
        dto.put("opr_id", opr_id);
        Dto outDto=sysUserService.queryUserOut(dto);
        write(outDto.getAsString("jsonString"), response);
        return mapping.findForward(null);
    }
    /**
     * 导入订单进度信息
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward importRoleList(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                           HttpServletResponse response) throws Exception {
        CommonActionForm aform = (CommonActionForm) form;
        FormFile file = aform.getTheFile();
        Dto outDto = new BaseDto();
        try {
            Dto inDto = new BaseDto();
            UserInfoVo user = super.getSessionContainer(request).getUserInfo();
            String grp_id = user.getGrpId();
            String opr_id = user.getAccount();
            IReader iReader = (IReader)SpringBeanLoader.getSpringBean("g4Reader");
            String metaData = "grp_id,grp_name,dep_name,account_name";
            ExcelReader excelReader = new ExcelReader(metaData, file.getInputStream());
            List list = excelReader.read(0, 0);
            if (list.size() > 0) {
                Dto dto = (Dto) list.get(0);
                if (dto.size() != metaData.split(",").length) {
                    throw new ApplicationException("[模板一]导入文件格式有误,请下载最新文件格式!");
                }
            }
            Dto dbDto = new BaseDto();
            dbDto.setDefaultAList(list);
            dbDto.put("grp_id", grp_id);
            dbDto.put("opr_id", opr_id);
            outDto = sysUserService.importRoleList(dbDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            super.write(jsonString, response);

        } catch (Exception e) {
            e.printStackTrace();
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "信息导入失败，" + e.getMessage());
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            super.write(jsonString, response);
        }

        return mapping.findForward(null);
    }
    
   

}
