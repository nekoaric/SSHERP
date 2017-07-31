package org.eredlab.g4.arm.web;

import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.arm.service.AreaService;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import com.cnnct.util.GlobalConstants;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

@SuppressWarnings("unchecked")
public class AreaInfoAction extends BaseAction {
    private AreaService areaService = (AreaService) super.getService("areaService");

    /**
     * 地区页面初始化
     * 
     * @param
     * @return
     */
    public ActionForward areaInfoInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        super.removeSessionAttribute(request, "menuid");
        return mapping.findForward("manageAreaView");
    }

    /**
     * 查询地区信息
     * 
     * @param
     * @return
     */
    public ActionForward queryAreaItemsForManage(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        List list = g4Reader.queryForPage("queryAreaForManage", dto);
        Integer pageCount = (Integer) g4Reader.queryForObject("queryAreaForManageForPageCount", dto);
        String jsonString = JsonHelper.encodeList2PageJson(list, pageCount, GlobalConstants.FORMAT_Date);
        super.write(jsonString, response);
        return mapping.findForward(null);
    }

    /**
     * 查询地区信息 生成菜单树
     * 
     * @param
     * @return
     */
    public ActionForward queryAreaItems(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        Dto dto = new BaseDto();
        String nodeid = request.getParameter("node");
        dto.put("parentid", nodeid);
        Dto outDto = areaService.queryAreaItems(dto);
        response.getWriter().write(outDto.getAsString("jsonString"));
        return mapping.findForward(null);
    }

    /**
     * 保存地区信息
     * 
     * @param
     * @return
     */
    public ActionForward saveAreaItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        Dto outDto = new BaseDto();
        try {
            CommonActionForm aForm = (CommonActionForm) form;
            Dto inDto = aForm.getParamAsDto(request);
            outDto = areaService.saveAreaItem(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (Exception e) {
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "地区信息保存失败");
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }
        return mapping.findForward(null);
    }

    /**
     * 修改地区信息
     * 
     * @param
     * @return
     */
    public ActionForward updateAreaItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        Dto outDto = new BaseDto();
        try {
            CommonActionForm aForm = (CommonActionForm) form;
            Dto inDto = aForm.getParamAsDto(request);
            outDto = areaService.updateAreaItem(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (Exception e) {
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "地区信息修改失败");
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }
        return mapping.findForward(null);
    }

    /**
     * 行业类别页面初始化
     * 
     * @param
     * @return
     */
    public ActionForward aplCodeInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        return mapping.findForward("manageAplCodeView");
    }

    /**
     * 查询行业类别
     * 
     * @param
     * @return
     */
    public ActionForward queryAplCodeItemsForManage(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        List list = g4Reader.queryForPage("queryAplCodeForManage", dto);
        Integer pageCount = (Integer) g4Reader.queryForObject("queryAplCodeForManageForPageCount", dto);
        String jsonString = JsonHelper.encodeList2PageJson(list, pageCount, GlobalConstants.FORMAT_Date);
        super.write(jsonString, response);
        return mapping.findForward(null);
    }

    /**
     * 保存行业类别信息
     * 
     * @param
     * @return
     */
    public ActionForward saveAplCodeItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        Dto outDto = new BaseDto();
        try {
            CommonActionForm aForm = (CommonActionForm) form;
            Dto inDto = aForm.getParamAsDto(request);
            outDto = areaService.saveAplCodeItem(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (Exception e) {
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "行业类别信息保存失败");
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }
        return mapping.findForward(null);
    }

    /***
     * 行业类别验证
     * 
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward validateAplCode(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        Dto dto1 = new BaseDto();
        Dto dto2 = new BaseDto();
        dto1.put("menuid", dto.getAsString("prv_code"));
        dto2.put("menuid", dto.getAsString("city_code"));
        dto.put("prv_code", (String) g4Reader.queryForObject("getAreaIdByMenuId", dto1));
        dto.put("city_code", (String) g4Reader.queryForObject("getAreaIdByMenuId", dto2));
        if (dto.getAsString("apl_code").length() == 1) {
            dto.put("apl_code", "00" + dto.getAsString("apl_code"));
        }
        if (dto.getAsString("apl_code").length() == 2) {
            dto.put("apl_code", "0" + dto.getAsString("apl_code"));
        }
        List areaList = g4Reader.queryForList("checkAplCodeByIndex", dto);
        String jsonString = JsonHelper.encodeObject2Json(areaList);
        String newJson = "{ROOT:" + jsonString + "}";
        super.write(newJson, response);
        return mapping.findForward(null);
    }

    /***
     * 地区编号验证
     * 
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward validateAreaId(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto dto = aForm.getParamAsDto(request);
        List areaList = g4Reader.queryForList("checkAreaIdByIndex", dto);
        String jsonString = JsonHelper.encodeObject2Json(areaList);
        String newJson = "{ROOT:" + jsonString + "}";
        //System.out.println(newJson);
        super.write(newJson, response);
        return mapping.findForward(null);
    }

    /**
     * 修改行业信息
     * 
     * @param
     * @return
     */
    public ActionForward updateAplCodeItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        Dto outDto = new BaseDto();
        try {
            CommonActionForm aForm = (CommonActionForm) form;
            Dto inDto = aForm.getParamAsDto(request);
            Dto dto1 = new BaseDto();
            Dto dto2 = new BaseDto();
            dto1.put("menuid", inDto.getAsString("prv_code"));
            dto2.put("menuid", inDto.getAsString("city_code"));
            inDto.put("prv_code", (String) g4Reader.queryForObject("getAreaIdByMenuId", dto1));
            inDto.put("city_code", (String) g4Reader.queryForObject("getAreaIdByMenuId", dto2));
            outDto = areaService.updateAplCodeItem(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (Exception e) {
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "行业类别信息修改失败");
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }
        return mapping.findForward(null);
    }

    /***
     * 删除行业信息
     * 
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward deleteAplCodeItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        Dto outDto = new BaseDto();
        try {
            String strChecked = request.getParameter("strChecked");
            Dto inDto = new BaseDto();
            inDto.put("strChecked", strChecked);
            List memberList = JsonHelper.parseJson2List(strChecked);
            outDto = areaService.deleteAplCodeItem(memberList);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (Exception e) {
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "行业类别信息删除失败");
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }
        return mapping.findForward(null);
    }
}
