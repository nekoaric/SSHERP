package com.cnnct.rfid.web;

import java.util.ArrayList;
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

import com.cnnct.common.ApplicationException;
import com.cnnct.rfid.service.ArrangeInfoService;
import com.cnnct.sys.vo.UserInfoVo;
import com.cnnct.util.ArmConstants;
import com.cnnct.util.TimeUtil;

/**
 * 排数请求类
 * 
 * @author zhouww
 * @since 2015-06-16
 */
public class ArrangeAction extends BaseAction {
    Log log = LogFactory.getLog(OrdDayListAction.class);

    ArrangeInfoService arrangeService = (ArrangeInfoService) super
            .getService("arrangeService");

    /**
     * 页面初始化
     * 
     * @param
     * @return
     */
    public ActionForward initView(ActionMapping mapping, ActionForm form,
            HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        // 需要添加usertype和isgrpUser标识
        UserInfoVo user = super.getSessionContainer(request).getUserInfo();
        String account = user.getAccount();
        String userType = user.getUsertype();
        Dto dbDto = new BaseDto();
        dbDto.put("account", account);
        dbDto.put("state", "0");

        List<Dto> resList = g4Reader.queryForList("queryArrangeUser", dbDto);
        if (resList.size() > 0) {
            request.setAttribute("isGrpUser", "1");
        } else {
            request.setAttribute("isGrpUser", "0");
        }

        request.setAttribute("userType", userType);

        return mapping.findForward("arrangeInit");
    }

    /**
     * 查询我的工厂信息
     */
    public ActionForward queryMyGrpInfo(ActionMapping mapping, ActionForm form,
            HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm cForm = (CommonActionForm) form;
        Dto inDto = cForm.getParamAsDto(request);
        List resList = g4Reader.queryForList("queryArrangeGrp", inDto);
        super.write(JsonHelper.encodeObject2Json(resList), response);
        return null;
    }

    /**
     * 增加我的工厂信息
     * 
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward insertMyGrpInfo(ActionMapping mapping,
            ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        try {
            // 获取登录人员信息
            String account = super.getSessionContainer(request).getUserInfo()
                    .getAccount();
            CommonActionForm cForm = (CommonActionForm) form;
            Dto inDto = cForm.getParamAsDto(request);
            String grpsStr = inDto.getAsString("grps");
            List<Dto> grpList = JsonHelper.parseJson2List(grpsStr);
            // 为所有的工厂添加用户姓名，并且判断工厂长度
            List<Dto> resList = new ArrayList<Dto>();
            for (Dto dto : grpList) {
                String tGrp_id = dto.getAsString("grp_id");
                if (tGrp_id.length() == 16) { // 16位长度的为工厂，由于BusiConst中没有工厂级别的长度信息，所以这里采用固定数值代替
                    dto.put("account", account);
                    dto.put("state", "0");
                    resList.add(dto);
                }
            }
            Dto dbDto = new BaseDto();
            dbDto.setDefaultAList(resList);
            arrangeService.insertArrangeGrp(dbDto);
            outDto.put("success", true);
            outDto.put("msg", "成功添加我的工厂");
        } catch (Exception e) {
            outDto.put("success", false);
            outDto.put("msg", "添加工厂信息失败");
        }
        String resStr = JsonHelper.encodeObject2Json(outDto);
        super.write(resStr, response);
        return null;
    }

    /**
     * 删除工厂信息
     * 
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward deleteMyGrpInfo(ActionMapping mapping,
            ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        try {
            String account = super.getSessionContainer(request).getUserInfo()
                    .getAccount();
            CommonActionForm cForm = (CommonActionForm) form;
            Dto inDto = cForm.getParamAsDto(request);

            inDto.put("account", account);
            inDto.put("state", "1");

            arrangeService.deleteArrangeGrp(inDto);

            outDto.put("success", true);
            outDto.put("msg", "成功删除工厂信息");
        } catch (Exception e) {
            outDto.put("success", false);
            outDto.put("msg", "删除工厂信息失败");

        }
        super.write(JsonHelper.encodeObject2Json(outDto), response);
        return null;
    }

    /**
     * 添加工厂操作员
     * 
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward insertGrpUser(ActionMapping mapping, ActionForm form,
            HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        Dto outDto = new BaseDto();
        try {
            UserInfoVo user = super.getSessionContainer(request).getUserInfo();
            String userType = user.getUsertype();
            if (!userType.equals(ArmConstants.ACCOUNTTYPE_SUPER)) {
                // 非超级管理员不能够执行此项操作
                throw new ApplicationException("操作权限不够");
            }
            String account = user.getAccount();
            CommonActionForm cForm = (CommonActionForm) form;
            Dto inDto = cForm.getParamAsDto(request);
            inDto.put("state", "0");

            arrangeService.insertGrpUser(inDto);

            outDto.put("success", true);
            outDto.put("msg", "成功添加人员");
        } catch (Exception e) {
            outDto.put("success", false);
            outDto.put("msg", "添加人员失败");
        }
        super.write(JsonHelper.encodeObject2Json(outDto), response);
        return null;
    }

    /**
     * 删除工厂操作员
     * 
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward deleteGrpUser(ActionMapping mapping, ActionForm form,
            HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        Dto outDto = new BaseDto();
        try {
            UserInfoVo user = super.getSessionContainer(request).getUserInfo();
            String userType = user.getUsertype();
            if (!userType.equals(ArmConstants.ACCOUNTTYPE_SUPER)) {
                // 非超级管理员不能够执行此项操作
                throw new ApplicationException("操作权限不够");
            }
            String account = user.getAccount();
            CommonActionForm cForm = (CommonActionForm) form;
            Dto inDto = cForm.getParamAsDto(request);
            inDto.put("state", "1");
            arrangeService.deleteGrpUser(inDto);

            outDto.put("success", true);
            outDto.put("msg", "成功删除工厂人员");
        } catch (Exception e) {
            outDto.put("success", false);
            outDto.put("msg", "删除工厂人员失败");
        }
        super.write(JsonHelper.encodeObject2Json(outDto), response);
        return null;
    }

    /**
     * 新增工厂排数
     * 
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward insertGrpArrangePlan(ActionMapping mapping,
            ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        try {
            CommonActionForm cForm = (CommonActionForm) form;
            Dto inDto = cForm.getParamAsDto(request);
            String account = super.getSessionContainer(request).getUserInfo()
                    .getAccount();

            String grp_id = inDto.getAsString("grp_id");
            String team_no = inDto.getAsString("team_no");
            String inStr = inDto.getAsString("grpArrange");
            Dto grpArrange = JsonHelper.parseSingleJson2Dto(inStr);
            // TODO 增加添加排数的合规性判断， 前端在请求前判断数据。这里看情况添加判断

            Dto dbDto = new BaseDto();
            dbDto.put("grp_id", grp_id);
            dbDto.put("team_no", team_no);
            dbDto.put("title", grpArrange.getAsString("Title"));
            dbDto.put("amount", grpArrange.getAsString("amount"));
            dbDto.put("ins_num", grpArrange.getAsString("insnum"));
            dbDto.put("style_no", grpArrange.getAsString("styleno"));
            dbDto.put("start_date", grpArrange.getAsString("SimpleStartDate"));
            dbDto.put("end_date", grpArrange.getAsString("SimpleEndDate"));
            dbDto.put("calendarid", grpArrange.getAsString("CalendarId"));
            dbDto.put("opr_type", "0");
            dbDto.put("opr_date", TimeUtil.getCurrentDate("yyyy-MM-dd"));
            dbDto.put("opr_time", TimeUtil.getCurrentDate("HH:mm:ss"));
            dbDto.put("create_dt", TimeUtil.getCurrentDate());
            dbDto.put("status", "0");
            dbDto.put("opr_id", account);
            dbDto.put("state", "0");

            arrangeService.insertGrpArrangePlan(dbDto);

            outDto.put("success", true);
        }catch(ApplicationException e){
            outDto.put("msg", e.getMessage());  // 如果是 ApplicationException异常，返回给请求的信息里面包含这些信息
            outDto.put("success", false);
        } catch (Exception e) {
            outDto.put("success", false);
        }
        super.write(JsonHelper.encodeObject2Json(outDto), response);
        return null;
    }

    /**
     * 新增业务员排数
     * 
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward insertArrangePlan(ActionMapping mapping,
            ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        try {
            CommonActionForm cForm = (CommonActionForm) form;
            Dto inDto = cForm.getParamAsDto(request);

            String account = super.getSessionContainer(request).getUserInfo()
                    .getAccount();

            String arrangeStr = inDto.getAsString("grpArrange");
            Dto arrangeDto = JsonHelper.parseSingleJson2Dto(arrangeStr);
            Dto dbDto = new BaseDto();
            dbDto.put("title", arrangeDto.getAsString("Title"));
            dbDto.put("order_no", arrangeDto.getAsString("order"));
            dbDto.put("style_no", arrangeDto.getAsString("styleno"));
            dbDto.put("materiel_date", arrangeDto.getAsString("SimpleMaterielDate"));
            dbDto.put("ins_num", arrangeDto.getAsString("insnum"));
            dbDto.put("calendarid", arrangeDto.getAsString("CalendarId"));
            dbDto.put("start_date", arrangeDto.getAsString("SimpleStartDate"));
            dbDto.put("end_date", arrangeDto.getAsString("SimpleStartDate")); // 因为业务员排数没有范围选择，结束日期就是当前
            dbDto.put("amount", arrangeDto.getAsString("amount"));
            dbDto.put("grp_id", inDto.getAsString("grp_id"));
            dbDto.put("team_no", inDto.getAsString("team_no"));
            dbDto.put("opr_type", "0");
            dbDto.put("opr_date", TimeUtil.getCurrentDate("yyyy-MM-dd"));
            dbDto.put("opr_time", TimeUtil.getCurrentDate("HH:mm:ss"));
            dbDto.put("create_dt", TimeUtil.getCurrentDate());
            dbDto.put("opr_id", account);
            dbDto.put("state", "0");

            arrangeService.insertGrpArrangePlan(dbDto);

            outDto.put("success", true);
        } catch(ApplicationException e){
            e.printStackTrace();
            outDto.put("msg", e.getMessage());
            outDto.put("success", false);
        }catch (Exception e) {
            e.printStackTrace();
            outDto.put("success", false);
        }
        super.write(JsonHelper.encodeObject2Json(outDto), response);
        return null;
    }

    /**
     * 查询工厂安排的数量信息
     * 
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward queryGrpArrangePlan(ActionMapping mapping,
            ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        List<Dto> planList = new ArrayList<Dto>();
        try {
            CommonActionForm cForm = (CommonActionForm) form;
            Dto inDto = cForm.getParamAsDto(request);
            inDto.put("state", "0");
            // 查询工厂的安排
            planList = g4Reader.queryForList("queryGrpArrangePlan", inDto);
            for (Dto dto : planList) {
                dto.put("ad", true); // 添加全天标识
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        // 查询结果返回给客户端
        super.write(JsonHelper.encodeObject2Json(planList), response);

        return null;
    }

    /**
     * 修改排数
     * 
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward updateGrpArrangePlan(ActionMapping mapping,
            ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {

        Dto outDto = new BaseDto();
        try {
            CommonActionForm cForm = (CommonActionForm) form;
            Dto inDto = cForm.getParamAsDto(request);

            String account = super.getSessionContainer(request).getUserInfo()
                    .getAccount();

            String arrangeStr = inDto.getAsString("grpArrange");
            Dto arrangeDto = JsonHelper.parseSingleJson2Dto(arrangeStr);
            Dto dbDto = new BaseDto();
            dbDto.put("seq_no", arrangeDto.getAsString("EventId"));
            dbDto.put("title", arrangeDto.getAsString("Title"));
            dbDto.put("order_no", arrangeDto.getAsString("order"));
            dbDto.put("style_no", arrangeDto.getAsString("styleno"));
            dbDto.put("ins_num",  arrangeDto.getAsString("insnum"));
            dbDto.put("materiel_date", arrangeDto.getAsString("SimpleMaterielDate"));
            dbDto.put("calendarid", arrangeDto.getAsString("CalendarId"));
            dbDto.put("start_date", arrangeDto.getAsString("SimpleStartDate"));
            dbDto.put("end_date", arrangeDto.getAsString("SimpleEndDate"));
            dbDto.put("amount", arrangeDto.getAsString("amount"));
            dbDto.put("opr_type", "1");
            dbDto.put("opr_date", TimeUtil.getCurrentDate("yyyy-MM-dd"));
            dbDto.put("opr_time", TimeUtil.getCurrentDate("HH:mm:ss"));
            dbDto.put("opr_id", account);

            arrangeService.updateGrpArrangePlan(dbDto);
            outDto.put("success", true);
        } catch (Exception e) {
            outDto.put("success", false);
            outDto.put("msg", "操作失败");
            outDto.put("msg2", e.getMessage());
        }
        super.write(JsonHelper.encodeObject2Json(outDto), response);
        return null;
    }

    /**
     * 删除工厂排数
     * 
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward deleteGrpArrangePlan(ActionMapping mapping,
            ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        try {
            CommonActionForm cForm = (CommonActionForm) form;
            Dto inDto = cForm.getParamAsDto(request);

            String account = super.getSessionContainer(request).getUserInfo()
                    .getAccount();

            String arrangeStr = inDto.getAsString("grpArrange");
            Dto arrangeDto = JsonHelper.parseSingleJson2Dto(arrangeStr);
            Dto dbDto = new BaseDto();
            dbDto.put("seq_no", arrangeDto.getAsString("EventId"));
            dbDto.put("opr_type", "2");
            dbDto.put("opr_date", TimeUtil.getCurrentDate("yyyy-MM-dd"));
            dbDto.put("opr_time", TimeUtil.getCurrentDate("HH:mm:ss"));
            dbDto.put("opr_id", account);
            dbDto.put("state", "1");

            arrangeService.deleteGrpArrangePlan(dbDto);

            outDto.put("success", true);
        } catch (Exception e) {
            e.printStackTrace();
            outDto.put("success", false);
            outDto.put("msg", "删除失败");
            outDto.put("msg2", e.getMessage());
        }
        super.write(JsonHelper.encodeObject2Json(outDto), response);
        return null;
    }

    /**
     * 设置实际生产数量值
     * 
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward insertRealAmount(ActionMapping mapping,
            ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        try {
            CommonActionForm cForm = (CommonActionForm) form;
            Dto inDto = cForm.getParamAsDto(request);

            String account = super.getSessionContainer(request).getUserInfo().getAccount();

            String arrangeStr = inDto.getAsString("grpArrange");
            Dto arrangeDto = JsonHelper.parseSingleJson2Dto(arrangeStr);

            Dto dbDto = new BaseDto();
            dbDto.put("arrange_no", arrangeDto.getAsString("EventId"));
            dbDto.put("real_amount", arrangeDto.getAsString("realamount"));
            dbDto.put("arrange_date", arrangeDto.getAsString("SimpleStartDate"));
            dbDto.put("opr_date", TimeUtil.getCurrentDate("yyyy-MM-dd"));
            dbDto.put("opr_time", TimeUtil.getCurrentDate("HH:mm:ss"));
            dbDto.put("opr_id", account);

            arrangeService.insertRealAmount(dbDto);

            outDto.put("success", true);
        } catch (Exception e) {
            outDto.put("success", false);
        }
        super.write(JsonHelper.encodeObject2Json(outDto), response);

        return null;
    }
    

    /**
     * 工厂号查询班组
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward queryTeams4GrpId(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        List<Dto> resList = new ArrayList<Dto>();
        try{
            CommonActionForm cForm = (CommonActionForm)form;
            Dto inDto = cForm.getParamAsDto(request);
            String nodeStr = inDto.getAsString("node");
            // 如果node是001 那么采用工厂查询部门
            // 如果node不是001 那么采用部门查询班组的数据
            if("001".equals(nodeStr)){
                // 查询部门
                resList = g4Reader.queryForList("queryDeptInfo4Arrange",inDto);
                for(Dto dto : resList){
                    dto.put("expanded", new Boolean(true));
                    dto.put("iconCls", "userIcon");
                    dto.put("leaf", new Boolean(false));
                    dto.put("parent_id", "001");
                }
            }else {
                // 查询班组
                inDto.put("dept_id", nodeStr);
                resList = g4Reader.queryForList("queryTeamsInfo4DeptId",inDto);
                for(Dto dto : resList){
                    dto.put("expanded", new Boolean(true));
                    dto.put("iconCls", "userIcon");
                    dto.put("leaf", new Boolean(true));
                }
            }
            
            
            
        }catch(Exception e){
            
        }
        String resStr = JsonHelper.encodeObject2Json(resList);
        System.out.println(resStr);
        super.write(resStr, response);
        return null;
    }
    
    
    /**
     * 查询排期数的工厂信息
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward queryGrpsInfo4Arrange(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        CommonActionForm aform = (CommonActionForm)form;
        Dto inDto = aform.getParamAsDto(request);
        String grp_id = super.getSessionContainer(request).getUserInfo().getGrpId();

        List<Dto> list = g4Reader.queryForList("queryGrpsInfo4Arrange",inDto);
        
        // 处理工厂的叶子节点标识
        
        for(Dto dto : list){
            String id = dto.getAsString("id");
            if(id.length() < 16){   
                // 不是叶子节点
                dto.put("expanded",true);
                dto.put("leaf",false);
            }else { // 16位
                // 叶子节点
                dto.put("leaf",true);
            }
        }
        
        String node = inDto.getAsString("node");
        if(!"001".equals(node)){
            for(Dto dto: list){
                dto.put("iconCls","houseIcon");
            }
        }

        String jsonString = JsonHelper.encodeObject2Json(list);
        System.out.println(jsonString);
        response.getWriter().write(jsonString);
        return mapping.findForward(null);
    }

}
