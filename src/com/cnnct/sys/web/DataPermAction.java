package com.cnnct.sys.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.cnnct.sys.vo.UserInfoVo;
import com.cnnct.util.BusiConst;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import com.cnnct.sys.service.DataPermService;
import org.eredlab.g4.arm.service.OrganizationService;
import com.cnnct.util.ArmConstants;
import com.cnnct.util.DataPermUtil;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;
import com.cnnct.common.ApplicationException;

/**
 * *********************************************
 * 创建日期: 2013-9-5
 * 创建作者：may
 * 功能：数据权限授权
 * 最后修改时间：
 * 修改记录：
 * ***********************************************
 */

@SuppressWarnings({"unchecked"})
public class DataPermAction extends BaseAction{
    Log log = LogFactory.getLog(DataPermAction.class);
    private DataPermService dataPermService = (DataPermService) super.getService("dataPermService");
    private OrganizationService organizationService = (OrganizationService) super.getService("organizationService");

    /**
     * 角色授权部门树初始化(有选择框)
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward departmentTreeInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
           HttpServletResponse response) throws Exception {
        CommonActionForm aform = (CommonActionForm)form;
        Dto dto = aform.getParamAsDto(request);

        String deptid = super.getSessionContainer(request).getUserInfo().getDeptid();
        String rootDept = deptid.substring(0, BusiConst.GRP_ROOT_DEPTID_LENGTH);

        dto.put("type", BusiConst.DATA_AUTHORITY_TYPE_DEPT);

        List deptList = g4Reader.queryForList("queryDeptTree4RolePerm", dto);
        Dto deptDto =null;

        Dto rootDto = new BaseDto();
        Dto outDto = new BaseDto();

        for (int i = 0; i < deptList.size(); i++) {
            deptDto = (BaseDto) deptList.get(i);
            if (deptDto.getAsString("leaf").equals(ArmConstants.LEAF_Y)){
                deptDto.put("leaf", true);
            }else{
                deptDto.put("leaf", false);
                deptDto.put("expanded", true);
            }
            deptDto.put("iconCls", "folder_userIcon");

            if (deptDto.getAsString("num").equals("1")){
                deptDto.put("checked", true);
            }else{
                deptDto.put("checked", false);
            }


            if(deptDto.getAsString("id").length()==BusiConst.GRP_ROOT_DEPTID_LENGTH){
                rootDto.putAll(deptDto);
            }

            String parent_id = deptDto.getAsString("parent_id");
            Object o = outDto.get(parent_id);
            if(o!=null){
                List list = (List)o;
                list.add(deptDto);
            }else{
                List list = new ArrayList();
                list.add(deptDto);
                outDto.put(parent_id,list);
            }
        }

        Dto d = getDeptChildList(outDto, rootDept,"id");//获取根节点子信息
        rootDto.put("children",d.get(rootDept));

        String jsonString = "["+JsonHelper.encodeObject2Json(rootDto)+"]";
        response.getWriter().write(jsonString);
        return mapping.findForward(null);
    }

    /**
     * 查询人员信息的部门树初始化(无选择框)
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward departmentInfoInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
           HttpServletResponse response) throws Exception {
        CommonActionForm aform = (CommonActionForm)form;
        Dto dto = aform.getParamAsDto(request);

        String deptid = super.getSessionContainer(request).getUserInfo().getDeptid();
        String rootDept = deptid.substring(0, BusiConst.GRP_ROOT_DEPTID_LENGTH);

        dto.put("grp_id", super.getSessionContainer(request).getUserInfo().getGrpId());

        List deptList = g4Reader.queryForList("queryDeptTree4RolePerm", dto);
        Dto deptDto =null;

        Dto rootDto = new BaseDto();
        Dto outDto = new BaseDto();

        for (int i = 0; i < deptList.size(); i++) {
            deptDto = (BaseDto) deptList.get(i);
            if (deptDto.getAsString("leaf").equals(ArmConstants.LEAF_Y)){
                deptDto.put("leaf", true);
            }else{
                deptDto.put("leaf", false);
            }

            deptDto.put("iconCls", "folder_userIcon");

            if(deptDto.getAsString("id").length()==BusiConst.GRP_ROOT_DEPTID_LENGTH){
                deptDto.put("expanded", true);
                rootDto.putAll(deptDto);
            }

            String parent_id = deptDto.getAsString("parent_id");
            Object o = outDto.get(parent_id);
            if(o!=null){
                List list = (List)o;
                list.add(deptDto);
            }else{
                List list = new ArrayList();
                list.add(deptDto);
                outDto.put(parent_id,list);
            }
        }

        Dto d = getDeptChildList(outDto, rootDept,"id");//获取根节点子信息
        rootDto.put("children",d.get(rootDept));

        String jsonString = "["+JsonHelper.encodeObject2Json(rootDto)+"]";
        response.getWriter().write(jsonString);
        return mapping.findForward(null);
    }

    /**
     * 角色授权人员信息查询
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward queryUserInfo4RoleGrant(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                                 HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm)form;
        Dto inDto = aForm.getParamAsDto(request);
        inDto.put("grp_id",super.getSessionContainer(request).getUserInfo().getGrpId());
        inDto.put("type",BusiConst.DATA_AUTHORITY_TYPE_USER);

        List userInfoList = g4Reader.queryForPage("queryUserInfo4RoleGrant", inDto);
        Integer count = g4Reader.queryForPageCount("queryUserInfo4RoleGrant", inDto);

        response.getWriter().write(JsonHelper.encodeList2PageJson(userInfoList,count,"yyyy-MM-dd"));
        return mapping.findForward(null);
    }


    /**
     * 职务授权信息查询
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward getCustBasInfoTree(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                                 HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm)form;
        Dto inDto = aForm.getParamAsDto(request);

        inDto.put("type",BusiConst.DATA_AUTHORITY_TYPE_CUST);
        String node = inDto.getAsString("node");
        List list;
        if(node.equals("001")){
            //查询地区信息
            list = g4Reader.queryForList("queryCustCountryInfo4RoleGrant", inDto);
        }else{
            inDto.put("country",node.substring(4));
            inDto.put("isArea", "yes");
            //查询客户信息
            list = g4Reader.queryForList("queryCustInfo4RoleGrant", inDto);
        }

        for(Object obj:list){
            Dto dto = (Dto)obj;
            if(node.equals("001")){
                dto.put("leaf",false);
                dto.put("expanded",true);
            }else{
                dto.put("leaf",true);
                dto.put("iconCls","groupIcon");
            }

            if("1".equals(dto.getAsString("checked"))){
                dto.put("checked",true);
            }else{
                dto.put("checked",false);
            }
        }
        String jsonString =JsonHelper.encodeObject2Json(list);

        super.write(jsonString,response);

        return mapping.findForward(null);
    }

    /**
     * 生产通知单授权信息查询
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward getProdOrdInfo4DataPerm(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                                 HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm)form;
        Dto inDto = aForm.getParamAsDto(request);
        inDto.put("grp_id",super.getSessionContainer(request).getUserInfo().getGrpId());
        inDto.put("type",BusiConst.DATA_AUTHORITY_TYPE_PROD_ORD);
        List list = g4Reader.queryForList("getProdOrdInfo4DataPerm", inDto);

        String jsonString = JsonHelper.encodeList2PageJson(list,list.size(),"");

        super.write(jsonString,response);

        return mapping.findForward(null);
    }

    /**
     * 生产通知单客户授权信息查询
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward getCustInfo4DataPerm(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                              HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm)form;
        Dto inDto = aForm.getParamAsDto(request);
        inDto.put("grp_id",super.getSessionContainer(request).getUserInfo().getGrpId());

        //获取客户信息
        inDto.put("type",BusiConst.DATA_AUTHORITY_TYPE_CUST);
        Dto custDto = (Dto)g4Reader.queryForObject("getCustInfo4DataPerm", inDto);

        inDto.put("type",BusiConst.DATA_AUTHORITY_TYPE_PROD_ORD);
        List list = g4Reader.queryForList("getProdOrdInfo4DataPerm", inDto);

        String cust_type = "0";//全部数据
        for(Object obj:list){
            Dto dto = (Dto)obj;
            if("1".equals(dto.getAsString("checked"))){
                cust_type = "1";
                break;
            }
        }
        custDto.put("cust_type",cust_type);
        custDto.put("success",true);
        String jsonString = JsonHelper.encodeObject2Json(custDto);

        super.write(jsonString,response);

        return mapping.findForward(null);
    }

    /**
     * 查询分类授权信息
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward queryClassifyInfo4RoleGrant(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                                     HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        try{
            CommonActionForm aForm = (CommonActionForm)form;
            Dto inDto = aForm.getParamAsDto(request);
            inDto.put("grp_id",super.getSessionContainer(request).getUserInfo().getGrpId());
            inDto.put("type",BusiConst.DATA_AUTHORITY_TYPE_RELATIVE);//相对授权
            outDto = (Dto)g4Reader.queryForObject("queryRoleDataAuthorizeInfo4RoleGrant", inDto);

//            inDto.put("type",BusiConst.DATA_AUTHORITY_TYPE_GROUP);//集团授权
            List groupList = g4Reader.queryForList("queryRoleDataAuthorizeInfo4RoleGrant", inDto);
            String grouptype = "";
            for(int i=0;i<groupList.size();i++){
                Dto groupDto = (BaseDto)groupList.get(i);
                grouptype =grouptype + groupDto.getAsString("other")+";";
            }
            if(grouptype.length()!=0){
                grouptype = grouptype.substring(0,grouptype.length());
            }
            outDto.put("group",grouptype);

            outDto.put("flagtype",outDto.getAsString("other"));

            String jsonString = JsonHelper.encodeDto2FormLoadJson(outDto, "yyyy-MM-dd");
            response.getWriter().write(jsonString);

        } catch (ApplicationException e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "集团权限查询失败!");
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }catch (Exception e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "集团权限查询失败!");
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }

        return mapping.findForward(null);
    }

    /**
     * 详细数据角色授权
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward saveDataRoleGrant(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                           HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        try {
            CommonActionForm aForm = (CommonActionForm) form;
            Dto inDto = aForm.getParamAsDto(request);
            String role_id = inDto.getAsString("role_id");

            List list = new ArrayList();

            //保存部门授权信息
            String deptidString =inDto.getAsString("deptids");
            if(!"".equals(deptidString)){
                String[] deptids = deptidString.split(",");
                for (String dept_id : deptids) {
                    Dto dto = new BaseDto();
                    dto.put("role_id", role_id);
                    dto.put("dept_id", dept_id);
                    dto.put("type", BusiConst.DATA_AUTHORITY_TYPE_DEPT);//部门授权
                    dto.put("per_id", "1");
                    dto.put("other", "1");
                    list.add(dto);
                }
            }
            //保存人员授权信息
            String peridString =inDto.getAsString("perids");
            if(!"".equals(peridString)){
                String[] perids = peridString.split(",");

                for (String perid : perids) {
                    Dto dto = new BaseDto();
                    dto.put("role_id", role_id);
                    dto.put("per_id", perid);
                    dto.put("type", BusiConst.DATA_AUTHORITY_TYPE_USER);//人员授权
                    dto.put("dept_id", "1");
                    dto.put("other", "1");
                    list.add(dto);
                }
            }

            //保存客户授权信息
            String cust_id_str =inDto.getAsString("cust_id_str");
            if(!"".equals(cust_id_str)){
                String[] cust_ids = cust_id_str.split(",");

                for (String cust_id : cust_ids) {
                    Dto dto = new BaseDto();
                    dto.put("role_id", role_id);
                    dto.put("type", BusiConst.DATA_AUTHORITY_TYPE_CUST);
                    dto.put("per_id", "1");
                    dto.put("dept_id", "1");
                    dto.put("other", cust_id);
                    list.add(dto);
                }
            }
            //保存生产通知单授权信息
            String prod_ord_seq_str =inDto.getAsString("prod_ord_seq_str");
            if(!"".equals(prod_ord_seq_str)){
                String[] prod_ord_seqs = prod_ord_seq_str.split(",");

                for (String prod_ord_seq : prod_ord_seqs) {
                    Dto dto = new BaseDto();
                    dto.put("role_id", role_id);
                    dto.put("type", BusiConst.DATA_AUTHORITY_TYPE_PROD_ORD);
                    dto.put("per_id", "1");
                    dto.put("dept_id", "1");
                    dto.put("other", prod_ord_seq);
                    list.add(dto);
                }
            }


            inDto.setDefaultAList(list);
            inDto.put("flag","detail");//详细授权里的新增

            outDto = dataPermService.saveDataRoleGrant(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (ApplicationException e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "数据角色授权失败!");
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }catch (Exception e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "数据角色授权失败!");
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }

        return mapping.findForward(null);
    }

    /**
     * 分类数据角色授权
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward saveDataRoleGrant4Classify(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        try {
            CommonActionForm aForm = (CommonActionForm) form;
            Dto inDto = aForm.getParamAsDto(request);
            String roleid = inDto.getAsString("roleid");

            List list = new ArrayList();


            String other = inDto.getAsString("other");
            if(!"".equals(other)){
                //保存分类授权信息
                Dto dto = new BaseDto();
                dto.put("roleid",roleid);
                dto.put("other",other);
                dto.put("type",BusiConst.DATA_AUTHORITY_TYPE_RELATIVE);//相对授权
                dto.put("deptid","1");
                dto.put("per_id","1");
                list.add(dto);
            }

            String group = inDto.getAsString("group");
            if(!"".equals(group)){
                //保存集团授权信息
                String[] groups = group.split(";");

                for(int i=0;i<groups.length;i++){
                    Dto dto = new BaseDto();
                    dto.put("roleid",roleid);
                    dto.put("other",groups[i]);
//                    dto.put("type",BusiConst.DATA_AUTHORITY_TYPE_GROUP);//集团授权
                    dto.put("deptid","1");
                    dto.put("per_id","1");
                    list.add(dto);
                }
            }

            inDto.setDefaultAList(list);
            inDto.put("flag","relative");//相对授权里的新增

            outDto = dataPermService.saveDataRoleGrant(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (ApplicationException e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "数据角色授权失败!");
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }catch (Exception e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "数据角色授权失败!");
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }

        return mapping.findForward(null);
    }

    /**
     * 角色授权删除授予的用户信息
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward delUserInfo4RoleData(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                              HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        try {
            CommonActionForm aForm = (CommonActionForm) form;
            Dto inDto = aForm.getParamAsDto(request);
            String role_id = inDto.getAsString("role_id");

            List list = new ArrayList();
            //保存人员授权信息
            String peridString =inDto.getAsString("perids");
            String[] perids = peridString.split(",");

            for (String perid : perids) {
                Dto dto = new BaseDto();
                dto.put("role_id", role_id);
                dto.put("per_id", perid);
                dto.put("type", BusiConst.DATA_AUTHORITY_TYPE_USER);//人员授权
                list.add(dto);
            }
            inDto.setDefaultAList(list);

            outDto = dataPermService.delUserInfo4RoleData(inDto);
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
     * 查询角色列表
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward queryEaUsersRoleMap(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                 HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        UserInfoVo userInfo = getSessionContainer(request).getUserInfo();
        dto.put("grp_id", userInfo.getGrpId());//当前用户编号
//        dto.remove("currentLoginedUserId");

        List userList = g4Reader.queryForPage("queryEaUsersRoleMap", dto);
        Integer pageCount = g4Reader.queryForPageCount("queryEaUsersRoleMap", dto);
        String jsonString = JsonHelper.encodeList2PageJson(userList, pageCount,"yyyy-MM-dd");
        response.getWriter().write(jsonString);
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
    public ActionForward  queryAllDataRole(ActionMapping mapping, ActionForm form, HttpServletRequest request,
           HttpServletResponse response) throws Exception {
        Dto dto = new BaseDto(request);
        UserInfoVo userInfo =  super.getSessionContainer(request).getUserInfo();
        String deptid =userInfo.getDeptid();
        dto.put("deptid",deptid.substring(0,BusiConst.GRP_ROOT_DEPTID_LENGTH));

        //企业主管能看到本企业操作员角色
        if(userInfo.getUsertype().equals(ArmConstants.ROLETYPE_ADMIN)){
            dto.put("roletype", "'"+ArmConstants.ROLETYPE_INITIALIZATION+"','"+ArmConstants.ROLETYPE_ADMIN+"','"
                +ArmConstants.ROLETYPE_GRPMANAGE+"'");
            dto.put("grp_id", userInfo.getGrpId());
        }
        //分厂主管看到其对应部门的角色信息
        if(userInfo.getUsertype().equals(ArmConstants.ROLETYPE_GRPMANAGE)){
            dto.put("roletype", "'"+ArmConstants.ROLETYPE_INITIALIZATION+"','"+ArmConstants.ROLETYPE_GRPMANAGE+"'");
            dto.put("grp_id", userInfo.getGrpId());
        }

        List roletyepList = g4Reader.queryForList("getAllDataRole",dto);
        String jsonString = JsonHelper.encodeObject2Json(roletyepList);
        super.write(jsonString, response);
        return mapping.findForward(null);
    }

    /**
     * 用户授权部门树初始化
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward departmentTree4UserGrantInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        CommonActionForm aform = (CommonActionForm)form;
        Dto dto = aform.getParamAsDto(request);

        String deptid = super.getSessionContainer(request).getUserInfo().getDeptid();
        String rootDept = deptid.substring(0, BusiConst.GRP_ROOT_DEPTID_LENGTH);

        dto.put("type", BusiConst.DATA_AUTHORITY_TYPE_DEPT);

        List deptList = g4Reader.queryForList("queryDeptTree4UserPerm", dto);
        Dto deptDto =null;

        Dto rootDto = new BaseDto();
        Dto outDto = new BaseDto();

        for (int i = 0; i < deptList.size(); i++) {
            deptDto = (BaseDto) deptList.get(i);
            if (deptDto.getAsString("leaf").equals(ArmConstants.LEAF_Y)){
                deptDto.put("leaf", new Boolean(true));
            }else{
                deptDto.put("leaf", new Boolean(false));
            }
            deptDto.put("iconCls", "folder_userIcon");
            deptDto.put("expanded", new Boolean(true));
            if (deptDto.getAsString("num").equals("1")){
                deptDto.put("checked", new Boolean(true));
            }else{
                deptDto.put("checked", new Boolean(false));
            }

            if(deptDto.getAsString("id").length()==BusiConst.GRP_ROOT_DEPTID_LENGTH){
                rootDto.putAll(deptDto);
            }

            String parent_id = deptDto.getAsString("parent_id");
            Object o = outDto.get(parent_id);
            if(o!=null){
                List list = (List)o;
                list.add(deptDto);
            }else{
                List list = new ArrayList();
                list.add(deptDto);
                outDto.put(parent_id,list);
            }
        }

        Dto d = getDeptChildList(outDto, rootDept,"id");//获取根节点子信息
        rootDto.put("children",d.get(rootDept));

        String jsonString = "["+JsonHelper.encodeObject2Json(rootDto)+"]";
        response.getWriter().write(jsonString);
        return mapping.findForward(null);
    }

    /**
     * 用户授权人员信息查询
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward queryUserInfo4UserGrant(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                                 HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm)form;
        Dto inDto = aForm.getParamAsDto(request);
        inDto.put("grp_id",super.getSessionContainer(request).getUserInfo().getGrpId());
        inDto.put("type",BusiConst.DATA_AUTHORITY_TYPE_USER);

        List userInfoList = g4Reader.queryForPage("queryUserInfo4UserGrant", inDto);
        Integer count = g4Reader.queryForPageCount("queryUserInfo4UserGrant", inDto);

        response.getWriter().write(JsonHelper.encodeList2PageJson(userInfoList,count,"yyyy-MM-dd"));
        return mapping.findForward(null);
    }

    /**
     * 用户授权删除授予的用户信息
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward delUserInfo4UserData(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        try {
            CommonActionForm aForm = (CommonActionForm) form;
            Dto inDto = aForm.getParamAsDto(request);
            String userid = inDto.getAsString("userid");

            List list = new ArrayList();
            //保存人员授权信息
            String peridString =inDto.getAsString("perids");
            String[] perids = peridString.split(",");

            for (String perid : perids) {
                Dto dto = new BaseDto();
                dto.put("userid", userid);
                dto.put("per_id", perid);
                dto.put("type", BusiConst.DATA_AUTHORITY_TYPE_USER);//人员授权
                list.add(dto);
            }
            inDto.setDefaultAList(list);

            outDto = dataPermService.delUserInfo4UserData(inDto);
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
     * 数据权限用户授权
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward saveDataUserGrant(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                           HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        try {
            CommonActionForm aForm = (CommonActionForm) form;
            Dto inDto = aForm.getParamAsDto(request);
            String userid = inDto.getAsString("userid");

            List list = new ArrayList();

            //保存部门授权信息
            String deptidString =inDto.getAsString("deptids");
            if(!"".equals(deptidString)){
                String[] deptids = deptidString.split(",");
                for (String deptid : deptids) {
                    Dto dto = new BaseDto();
                    dto.put("userid", userid);
                    dto.put("deptid", deptid);
                    dto.put("type", BusiConst.DATA_AUTHORITY_TYPE_DEPT);//部门授权
                    dto.put("per_id", "1");
                    dto.put("other", "1");
                    list.add(dto);
                }
            }
            //保存人员授权信息
            String peridString =inDto.getAsString("perids");
            if(!"".equals(peridString)){
                String[] perids = peridString.split(",");

                for (String perid : perids) {
                    Dto dto = new BaseDto();
                    dto.put("userid", userid);
                    dto.put("per_id", perid);
                    dto.put("type", BusiConst.DATA_AUTHORITY_TYPE_USER);//人员授权
                    dto.put("deptid", "1");
                    dto.put("other", "1");
                    list.add(dto);
                }
            }

            inDto.setDefaultAList(list);

            outDto = dataPermService.saveDataUserGrant(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (ApplicationException e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "数据角色授权失败!");
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }catch (Exception e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "数据角色授权失败!");
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }

        return mapping.findForward(null);
    }

    /**
     * 获取根节点下的所有子部门信息
     * @param parentDto 需要有所有的键值对 key:parent_id value:属于该父节点的list
     * @param rootId 根id
     * @param param 部门参数 表示dto中哪个key是对应的部门属性
     * @return 已添加过children属性的parentDto
     */
    public static Dto getDeptChildList(Dto parentDto,String rootId,String param){
        Object o = parentDto.get(rootId);
        if(o !=null){//当前根节点rootId下有部门列表
            List l = (List)o;
            for(int i=0;i<l.size();i++){
                Dto deptDto = (BaseDto)l.get(i);
                String deptid = deptDto.getAsString(param);

                Dto parentDto_update = getDeptChildList(parentDto,deptid,param);//所有的子部门信息
                if(parentDto_update!=null){//节点deptid下有子部门列表
                    deptDto.put("leaf",false);//设置当前节点为非叶子节点
                    deptDto.put("children",parentDto_update.get(deptid));
                }

            }
        }else{
            return null;
        }
        return  parentDto;//返回修改过根节点信息的parentDto
    }

    /**
     * 分管部门树初始化
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward manageDepartmentInfoInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                                  HttpServletResponse response) throws Exception {
        CommonActionForm aform = (CommonActionForm)form;
        Dto dto = aform.getParamAsDto(request);

        String deptid = super.getSessionContainer(request).getUserInfo().getDeptid();
        String rootDept = deptid.substring(0, BusiConst.GRP_ROOT_DEPTID_LENGTH);

        dto.put("grp_id", super.getSessionContainer(request).getUserInfo().getGrpId());

        List deptList = g4Reader.queryForList("queryManageDeptInfo", dto);
        Dto deptDto =null;

        Dto rootDto = new BaseDto();
        Dto outDto = new BaseDto();

        for (int i = 0; i < deptList.size(); i++) {
            deptDto = (BaseDto) deptList.get(i);
            if (deptDto.getAsString("leaf").equals(ArmConstants.LEAF_Y)){
                deptDto.put("leaf", new Boolean(true));
                if("0".equals(deptDto.getAsString("num"))){
                    deptDto.put("checked", new Boolean(false));
                }else{
                    deptDto.put("checked", new Boolean(true));
                }
            }else{
                deptDto.put("leaf", new Boolean(false));
            }

            deptDto.put("iconCls", "folder_userIcon");
            deptDto.put("expanded", new Boolean(true));

            if(deptDto.getAsString("id").length()==BusiConst.GRP_ROOT_DEPTID_LENGTH){
                rootDto.putAll(deptDto);
            }

            String parent_id = deptDto.getAsString("parent_id");
            Object o = outDto.get(parent_id);
            if(o!=null){
                List list = (List)o;
                list.add(deptDto);
            }else{
                List list = new ArrayList();
                list.add(deptDto);
                outDto.put(parent_id,list);
            }
        }

        Dto d = getDeptChildList(outDto, rootDept,"id");//获取根节点子信息
        rootDto.put("children",d.get(rootDept));

        String jsonString = "["+JsonHelper.encodeObject2Json(rootDto)+"]";
        response.getWriter().write(jsonString);
        return mapping.findForward(null);
    }

    /**
     * 权限查询 - 菜单权限树展示
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward userMenuTreeInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        CommonActionForm aform = (CommonActionForm)form;
        Dto dto = aform.getParamAsDto(request);

        List menuList = g4Reader.queryForList("getMenuTreeByUserid", dto);
        String rootNode="01";
        Dto menuDto;

        Dto rootDto = new BaseDto();
        Dto outDto = new BaseDto();

        for (Object aMenuDto : menuList) {
            menuDto = (BaseDto) aMenuDto;
            if (menuDto.getAsString("leaf").equals(ArmConstants.LEAF_Y)) {
                menuDto.put("leaf", new Boolean(true));
            } else {
                menuDto.put("leaf", new Boolean(false));
            }
            menuDto.put("iconCls", menuDto.getAsString("iconcls"));
            menuDto.remove("iconcls");

            menuDto.put("expanded", new Boolean(true));

            if (menuDto.getAsString("id").length() == 2) {
                rootDto.putAll(menuDto);
            }

            String parent_id = menuDto.getAsString("parent_id");
            Object o = outDto.get(parent_id);
            if (o != null) {
                List list = (List) o;
                list.add(menuDto);
            } else {
                List list = new ArrayList();
                list.add(menuDto);
                outDto.put(parent_id, list);
            }
        }

        Dto d = getDeptChildList(outDto, rootNode,"id");//获取根节点子信息
        rootDto.put("children",d.get(rootNode));

        String jsonString = "["+JsonHelper.encodeObject2Json(rootDto)+"]";
        response.getWriter().write(jsonString);
        return mapping.findForward(null);
    }

    /**
     * 权限查询 - 数据权限树展示
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward userDataTreeInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                      HttpServletResponse response) throws Exception {

        Dto inDto = new BaseDto();
        inDto.put("userid",request.getParameter("userid"));
        inDto.put("lock", ArmConstants.LOCK_N);
//        inDto.put("group_type", BusiConst.DATA_AUTHORITY_TYPE_GROUP);
        inDto.put("relative_type", BusiConst.DATA_AUTHORITY_TYPE_RELATIVE);
//        inDto.put("duty_type", BusiConst.DATA_AUTHORITY_TYPE_DUTY);
        UserInfoVo queryUser = (UserInfoVo)g4Reader.queryForObject("getUserInfo",inDto);

        String parent_id = request.getParameter("node");

        String flag = parent_id.substring(0,4);
        inDto.put("parent_id",parent_id.substring(4));
        List deptUserList = new ArrayList();
        if(flag.equals("root")){
            Map<String,String> columnMap = new HashMap<String, String>();
            columnMap.put("deptid","deptid");
            String userDataPermString = DataPermUtil.getDataQuerySqlByUserInfo(columnMap,queryUser);
            inDto.put("dataPermStr",userDataPermString);

            deptUserList = g4Reader.queryForList("getDeptDataTreeByUserid",inDto);
        }else if (flag.equals("dept")){
            Map<String,String> columnMap = new HashMap<String, String>();
            columnMap.put("account","account");
            String userDataPermString = DataPermUtil.getDataQuerySqlByUserInfo(columnMap,queryUser);
            inDto.put("dataPermStr",userDataPermString);

            deptUserList = g4Reader.queryForList("getUserDataTreeByUserid",inDto);
        }
        for (Object o:deptUserList){
            Dto deptUserDto = (Dto)o;
            if(flag.equals("root")){
                if(deptUserDto.getAsString("leaf").equals(ArmConstants.LEAF_N)){
                    deptUserDto.put("expanded",true);
                    deptUserDto.put("leaf",false);
                    deptUserDto.put("id","root"+deptUserDto.getAsString("id"));
                }else{
                    deptUserDto.put("expanded",false);
                    if(deptUserDto.getAsInteger("num")!=0){
                        deptUserDto.put("leaf",false);
                    }else{
                        deptUserDto.put("leaf",true);
                    }

                    deptUserDto.put("id","dept"+deptUserDto.getAsString("id"));
                }
                deptUserDto.put("iconCls","folder_userIcon");
            }else{
                deptUserDto.put("leaf",true);
                deptUserDto.put("iconCls","userIcon");
            }
        }

        String jsonString = JsonHelper.encodeObject2Json(deptUserList);
        response.getWriter().write(jsonString);
        return mapping.findForward(null);
    }

}
