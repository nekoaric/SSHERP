package com.cnnct.rfid.web;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.cnnct.rfid.service.EpcBookListService;
import com.cnnct.util.G4Utils;
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
 * *********************************************
 * 创建日期: 2013-05-08
 * 创建作者：lingm
 * 功能：电子标签入库
 * 最后修改时间：
 * 修改记录：
 * ***********************************************
 */

@SuppressWarnings({"unchecked"})
public class EpcBookListAction extends BaseAction {

    EpcBookListService epcBookListService = (EpcBookListService) super.getService("epcBookListService");


    /**
     * RFID电子标签管理页面初始化
     *
     * @param
     * @return
     */
    public ActionForward manageEpcBookListInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                               HttpServletResponse response) throws Exception {
        return mapping.findForward("manageEpcBookListView");
    }

    /**
     * 查询RFID电子标签基本信息带分页
     *
     * @param
     * @return
     */
    public ActionForward queryEpcBookListInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                              HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        String grp_id = super.getSessionContainer(request).getUserInfo().getGrpId();
        Dto inDto = aForm.getParamAsDto(request);
        inDto.put("state", '0');
        Dto outDto = epcBookListService.queryEpcBookListInfo(inDto);
        String jsonStrList = outDto.getAsString("jsonStrList");
        response.getWriter().write(jsonStrList);
        return mapping.findForward(null);
    }


    /**
     * RFID电子标签入库及绑定
     *
     * @param
     * @return
     */
    public ActionForward saveEpcBookListInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                             HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        try {
            CommonActionForm aForm = (CommonActionForm) form;
            Dto inDto = aForm.getParamAsDto(request);
            String opr_id = super.getSessionContainer(request).getUserInfo().getUserid();
            String grp_id = super.getSessionContainer(request).getUserInfo().getGrpId();
            inDto.put("opr_id", opr_id);
            inDto.put("opr_date", G4Utils.getCurrentTime("yyyy-MM-dd"));
            inDto.put("tr_date", G4Utils.getCurrentTime("yyyy-MM-dd"));
            inDto.put("grp_id", grp_id);
            //设备编号
            inDto.put("trm_no", "");
            inDto.put("flow", 0);
            inDto.put("state", 1);//空闲
            outDto = epcBookListService.saveEpcBookListInfo(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (ApplicationException e) {
            e.printStackTrace();
            outDto.put("msg", "电子标签保存失败!");
            outDto.put("success", new Boolean(false));
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (Exception e) {
            e.printStackTrace();
            outDto.put("msg", "电子标签保存失败!");
            outDto.put("success", new Boolean(false));
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }
        return mapping.findForward(null);
    }

    /**
     * 删除标签
     *
     * @param
     * @return
     */
    public synchronized ActionForward deleteEpcInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                                    HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        try {
            CommonActionForm aForm = (CommonActionForm) form;
            Dto inDto = aForm.getParamAsDto(request);
            outDto = epcBookListService.deleteEpcItems(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (ApplicationException e) {
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "标签删除失败" + e.getMessage());
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (Exception e) {
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "标签删除失败，" + e.getMessage());
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }

        return mapping.findForward(null);
    }


}
