package org.eredlab.g4.arm.web;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.cnnct.common.ApplicationException;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.arm.service.DutyService;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

public class DutyAction extends BaseAction {
    private DutyService dutyService = (DutyService) super.getService("dutyService");

    /**
     * 页面初始化
     * 
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward dutyGrpsinit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        return mapping.findForward("dutyGrpsView");
    }

    /**
     * 查询职务列表
     * 
     * @param
     * @return
     */
    public ActionForward queryDutyList(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        Dto outDto = new BaseDto();
        String grp_id = super.getSessionContainer(request).getUserInfo().getGrpId();// 单位代码
        dto.put("grp_id", grp_id);
        List dutyList = g4Reader.queryForPage("queryDutyForManage", dto);
        String jsonString = JsonHelper.encodeObject2Json(dutyList);
        Integer pageCount = (Integer) g4Reader.queryForObject("queryDutyForManageForPageCount", dto);
        outDto.put("jsonString", JsonHelper.encodeJson2PageJson(jsonString, pageCount));
        response.getWriter().write(outDto.getAsString("jsonString"));
        return mapping.findForward(null);
    }

    /**
     * 保存职务信息
     * 
     * @param
     * @return
     */
    public synchronized ActionForward saveDutyItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto inDto = aForm.getParamAsDto(request);

        String deptperm = inDto.getAsString("deptperm");
        if("".equals(deptperm)){
            deptperm = "0";
            inDto.put("deptperm",deptperm);
        }
        Dto outDto= new BaseDto();
        String grp_id = super.getSessionContainer(request).getUserInfo().getGrpId();// 单位代码
        inDto.put("grp_id", grp_id);
        int count=(Integer) g4Reader.queryForObject("getDutyName",inDto);
        if(count>0){
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "职务信息保存失败：该职务名称已经存在!");
        }else{
           outDto=dutyService.saveDutyItem(inDto);
        }
        String jsonString = JsonHelper.encodeObject2Json(outDto);
        response.getWriter().write(jsonString);
        return mapping.findForward(null);
    }

    /**
     * 删除职务信息
     * 
     * @param
     * @return
     */
    public synchronized ActionForward deleteDutyItems(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        String strChecked = request.getParameter("strChecked");
        Dto inDto = new BaseDto();
        inDto.put("strChecked", strChecked);
        String grp_id = super.getSessionContainer(request).getUserInfo().getGrpId();// 单位代码
        inDto.put("grp_id", grp_id);
        Dto outDto = dutyService.deleteDutyItem(inDto);
        String jsonString = JsonHelper.encodeObject2Json(outDto);
        response.getWriter().write(jsonString);
        return mapping.findForward(null);
    }

    /**
     * 修改职务信息
     * 
     * @param
     * @return
     */
    public synchronized ActionForward updateDutyItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto inDto = aForm.getParamAsDto(request);

        String deptperm = inDto.getAsString("deptperm");
        if("".equals(deptperm)){
            deptperm = "0";
            inDto.put("deptperm",deptperm);
        }
        Dto outDto=new BaseDto();
        String grp_id = super.getSessionContainer(request).getUserInfo().getGrpId();// 单位代码
        inDto.put("grp_id", grp_id);
        if(inDto.getAsString("remark")==null){
          inDto.put("remark", ""); 
        }
        if(inDto.getAsString("old_duty_name").equals(inDto.getAsString("duty_name"))||inDto.getAsString("old_duty_name")==inDto.getAsString("duty_name")){
            outDto=dutyService.updateDutyItem(inDto);
        }else{
        int count=(Integer) g4Reader.queryForObject("getDutyName",inDto);
        if(count>0){
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "职务信息保存失败：该职务名称已经存在!");
        }else{
           outDto=dutyService.updateDutyItem(inDto);
        }
        }
         String jsonString = JsonHelper.encodeObject2Json(outDto);
        response.getWriter().write(jsonString);
        return mapping.findForward(null);
    }

    /**
     * 删除职务信息
     *
     * @param
     * @return
     */
    public synchronized ActionForward updateUserPerm4DutyUpdate(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        Dto outDto = new BaseDto();
        try{
            CommonActionForm aform = (CommonActionForm)form;
            Dto inDto = aform.getParamAsDto(request);
            String grp_id = super.getSessionContainer(request).getUserInfo().getGrpId();// 单位代码
            inDto.put("grp_id", grp_id);
            dutyService.updateUserPerm4DutyUpdate(inDto);
            outDto.put("success", new Boolean(true));
            outDto.put("msg", "权限更新成功!");
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }catch (ApplicationException e) {
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "权限更新失败!");
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }

        return mapping.findForward(null);
    }

    /**
     * 查询本单位的所有职务信息
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward queryAllDuty(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        String grp_id = super.getSessionContainer(request).getUserInfo().getGrpId();// 单位代码
        dto.put("grp_id", grp_id);
        List areaList = g4Reader.queryForList("getAllDuty", dto);
        String jsonString = JsonHelper.encodeObject2Json(areaList);
        super.write(jsonString, response);
        return mapping.findForward(null);
    }

}
