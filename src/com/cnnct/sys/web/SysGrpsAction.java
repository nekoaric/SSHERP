package com.cnnct.sys.web;
import java.util.ArrayList;
import java.util.List;

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

import com.cnnct.sys.service.SysGrpsService;
import com.cnnct.sys.vo.UserInfoVo;
import com.cnnct.util.ArmConstants;
import com.cnnct.util.BusiConst;
import com.cnnct.util.GlobalConstants;

@SuppressWarnings("unchecked")
public class SysGrpsAction extends BaseAction {
    private SysGrpsService sysGrpsService = (SysGrpsService) super.getService("sysGrpsService");

    /**
     * 分管企业管理
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward belongGrpsInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
    	System.out.println("in!");
        return mapping.findForward("belongGrpsView");
    }

    /***
     * 所属企业查询
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward queryBelongGrpsInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto inDto = aForm.getParamAsDto(request);

        List sysGrpList = g4Reader.queryForPage("queryBelongGrpsInfo", inDto);
        Integer pageCount = g4Reader.queryForPageCount("queryBelongGrpsInfo", inDto);
        String jsonString = JsonHelper.encodeList2PageJson(sysGrpList, pageCount, GlobalConstants.FORMAT_Date);
        super.write(jsonString,response);
        return mapping.findForward(null);
    }

    /**
     * 所属企业树初始化
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward belongGrpsTreeInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        CommonActionForm aform = (CommonActionForm)form;
        Dto inDto = aform.getParamAsDto(request);
        String grp_id = super.getSessionContainer(request).getUserInfo().getGrpId();

        List list = g4Reader.queryForList("belongGrpsTreeInit",inDto);

        String node = inDto.getAsString("node");
        for(Object o: list){
            Dto dto = (Dto)o;

            if(!"001".equals(node)){
                dto.put("iconCls","houseIcon");
            }
            if(dto.getAsInteger("num")==1){
                dto.put("leaf",true);
            }else{
                dto.put("expanded",true);
                dto.put("leaf",false);
            }
        }

        String jsonString = JsonHelper.encodeObject2Json(list);
        response.getWriter().write(jsonString);
        return mapping.findForward(null);
    }

    /**
     * 所属企业树初始化
     * 带有选择框的树
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward belongGrpsTreeInitWithChecked(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        CommonActionForm aform = (CommonActionForm)form;
        Dto inDto = aform.getParamAsDto(request);
        String grp_id = super.getSessionContainer(request).getUserInfo().getGrpId();

        List list = g4Reader.queryForList("belongGrpsTreeInit",inDto);

        String node = inDto.getAsString("node");
        for(Object o: list){
            Dto dto = (Dto)o;
            dto.put("checked", false);
            if(!"001".equals(node)){
                dto.put("iconCls","houseIcon");
            }
            if(dto.getAsInteger("num")==1){
                dto.put("leaf",true);
            }else{
                dto.put("expanded",true);
                dto.put("leaf",false);
            }
        }

        String jsonString = JsonHelper.encodeObject2Json(list);
        response.getWriter().write(jsonString);
        return mapping.findForward(null);
    }
    
    
    /**
     * 所属企业订单树初始化
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward belongGrpsOrdTreeInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        CommonActionForm aform = (CommonActionForm)form;
        Dto inDto = aform.getParamAsDto(request);
        //保存登录人信息
        inDto.put("account", super.getSessionContainer(request).getUserInfo().getAccount());
        //处理订单状态和是否我的订单的参数
        String myorder = inDto.getAsString("ismyorder");
        if(!"yes".equals(myorder)){
            inDto.remove("ismyorder");
        }
        // 9标识是所有的订单状态，为9时去除订单状态参数
        String ordStatus = inDto.getAsString("orderstatus");
        if("9".equals(ordStatus)){
            inDto.remove("orderstatus");
        }
        String node = inDto.getAsString("node");	
        inDto.put("isOnlyRFID", "yes");
        List list = new ArrayList();
        if(node.startsWith("root")){
            inDto.put("node",node.substring(4));
            if(inDto.getAsString("node").equals("001")){
            	inDto.remove("order_id");
            }
            if(inDto.getAsString("node").length()>=13){
            	list = g4Reader.queryForList("belongGrpsDeptTreeInit",inDto);
            }else {
            	list = g4Reader.queryForList("belongGrpsTreeInit",inDto);
            }
        }else if(node.startsWith("grps")){//分厂树的根节点 开始查询订单信息
            inDto.put("belong_grp",node.substring(4));
            list = g4Reader.queryForList("getOrdBasInfoByGrpId",inDto);
        }else if(node.startsWith("ord")){//分厂树的根节点 开始查询订单信息
            inDto.put("ord_seq_no",node.substring(3,node.indexOf("_grps")));//订单序号
            //通过客户信息查询订单信息
            list = g4Reader.queryForList("getProdOrdInfoByOrdSeqNO", inDto);
        }

        for(Object o: list){
            Dto dto = (Dto)o;

            if(node.startsWith("root")){
                if(!"root001".equals(node)){
                    dto.put("iconCls","houseIcon");
                }
                if(dto.getAsInteger("num")==1){
                    dto.put("id","grps"+dto.getAsString("id"));
                    dto.put("leaf",false);
                }else{
                    dto.put("id","root"+dto.getAsString("id"));
                    dto.put("expanded",true);
                    dto.put("leaf",false);
                }
            }else if(node.startsWith("grps")){//分厂树的根节点 开始查询订单信息
                dto.put("id","ord"+dto.getAsString("id")+"_"+node);
                dto.put("leaf",false);
            }else if(node.startsWith("ord")){//分厂树的根节点 开始查询订单信息
                dto.put("id","prod"+dto.getAsString("id")+"_"+node);
                dto.put("leaf",true);
            }
        }

        String jsonString = JsonHelper.encodeObject2Json(list);
        response.getWriter().write(jsonString);
        return mapping.findForward(null);
    }

    /**
     * 所属企业树初始化
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward matchDeptTreeInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        try {
            CommonActionForm aform = (CommonActionForm)form;
            Dto dto = aform.getParamAsDto(request);
            String nodeid = request.getParameter("node");
            dto.put("parentid", nodeid);
            dto.put("grp_id", getSessionContainer(request).getUserInfo().getGrpId());
            List deptList = new ArrayList();
            if(nodeid.equals("001")){
                Dto deptDto = new BaseDto();
                deptDto.put("id",dto.getAsString("belong_deptid"));
                deptDto.put("text",dto.getAsString("belong_deptname"));
                deptDto.put("expanded", true);
                deptDto.put("iconCls", "folder_userIcon");
                deptList.add(deptDto);
            }else{
                // 查询状态为正常的部门
                dto.put("deptstate", BusiConst.DEPT_STATE_NORMAL);
                //查找没有被关联的部门信息
                deptList = g4Reader.queryForList("matchDeptTreeInit", dto);

                for (Object aDeptList : deptList) {
                    Dto deptDto = (BaseDto) aDeptList;
                    if (deptDto.getAsString("leaf").equals(ArmConstants.LEAF_Y))
                        deptDto.put("leaf", true);
                    else
                        deptDto.put("leaf", false);

                    if (deptDto.getAsString("id").length() == 8)
                        deptDto.put("expanded", true);

                    deptDto.put("iconCls", "folder_userIcon");
                }
            }
            String jsonString = JsonHelper.encodeObject2Json(deptList);
            super.write(jsonString, response);
        } catch (Exception e) {
            throw new Exception(e);
        }

        return mapping.findForward(null);
    }

    /***
     * 单位信息保存
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward saveSysGrpsItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto inDto = aForm.getParamAsDto(request);

        Dto outDto = new BaseDto();

        UserInfoVo user= super.getSessionContainer(request).getUserInfo();
        String opr_id = user.getAccount();// 操作用户编号
        String grp_id = user.getGrpId();// 企业编号

        inDto.put("opn_opr_id", opr_id);
        inDto.put("grp_id", grp_id);

        String[] apps = {"bas","flw","cnt","arm"};

        String app ="";
        for(String key:apps){
            if(inDto.containsKey(key)){
                app =app+ "1,";
            }else{
                app =app+ "0,";
            }
        }
        if (app.length() != 0)
            app = app.substring(0, app.length() - 1);
        inDto.put("apps",app);

        try {
            outDto = sysGrpsService.saveSysGrpsItem(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (Exception e) {
            outDto.put("success", false);
            outDto.put("msg", "单位信息保存失败");
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }
        return mapping.findForward(null);
    }

    /***
     * 单位信息删除
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward deleteSysGrpsItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        Dto outDto = new BaseDto();
        try {
            CommonActionForm aform = (CommonActionForm)form;
            Dto inDto =aform.getParamAsDto(request);

            outDto = sysGrpsService.deleteSysGrpsItem(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (Exception e) {
            outDto.put("success", false);
            outDto.put("msg", "单位信息删除失败");
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }
        return mapping.findForward(null);
    }

    /***
     * 单位信息修改
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward updateSysGrpsItem(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                           HttpServletResponse response)
            throws Exception {
        Dto outDto = new BaseDto();
        try {
            CommonActionForm aForm = (CommonActionForm) form;
            Dto inDto = aForm.getParamAsDto(request);

            String[] apps = {"bas", "flw", "cnt", "arm"};

            String app ="";
            for(String key:apps){
                if(inDto.containsKey(key)){
                    app =app+ "1,";
                }else{
                    app =app+ "0,";
                }
            }
            if (app.length() != 0)
                app = app.substring(0, app.length() - 1);
            inDto.put("apps",app);
            inDto.put("opr_userid",super.getSessionContainer(request).getUserInfo().getUserid());

            outDto = sysGrpsService.updateSysGrpsItem(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (Exception e) {
            e.printStackTrace();
            outDto.put("success", false);
            outDto.put("msg", "单位信息修改失败");
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }
        return mapping.findForward(null);
    }


}