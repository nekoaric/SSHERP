package com.cnnct.rfid.web;


import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.cnnct.rfid.service.ProdBoxListService;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import com.cnnct.common.ApplicationException;
import com.cnnct.util.G4Utils;
import com.cnnct.util.GlobalConstants;


/**
 * *********************************************
 * 创建日期: 2013-05-17
 * 创建作者：lingm
 * 功能：成品管理
 * 最后修改时间：
 * 修改记录：
 * ***********************************************
 */
@SuppressWarnings({"unchecked"})
public class ProdBoxListAction extends BaseAction {

    ProdBoxListService prodBoxListService = (ProdBoxListService) super.getService("prodBoxListService");

    public ActionForward manageProdBoxListInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                               HttpServletResponse response) throws Exception {
        return mapping.findForward("manageProdBoxListView");
    }

    /**
     * 订单保存和修改相关操作
     */
    public ActionForward saveProdBoxInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        Dto outDto = new BaseDto();
        try {
            CommonActionForm aForm = (CommonActionForm) form;
            Dto inDto = aForm.getParamAsDto(request);
            String seq_no = inDto.getAsString("seq_no");
            String strChecked = inDto.getAsString("strChecked");
            String prodBox_flag = inDto.getAsString("prodBox_flag");
            System.out.println("prodBox_flag :" + prodBox_flag + prodBox_flag.length());
            //新增
            if (prodBox_flag == "") {
                inDto.put("opr_date", G4Utils.getCurDate());
                inDto.put("opr_id", super.getSessionContainer(request).getUserInfo().getUserid());
                List memberList = JsonHelper.parseJson2List(strChecked);
                System.out.println(memberList.size());
                for (int i = 0; i < memberList.size(); i++) {
                    Dto dto = (Dto) memberList.get(i);
                    inDto.put("box_no", dto.getAsString("box_no"));
                    inDto.put("product_id", dto.getAsString("product_id"));
                    inDto.put("amount", dto.getAsString("amount"));
                    outDto = prodBoxListService.addProdBoxDef(inDto);
                }
            } else {
                //修改
                inDto.put("opr_date", G4Utils.getCurDate());
                inDto.put("opr_id", super.getSessionContainer(request).getUserInfo().getUserid());
                List memberList = JsonHelper.parseJson2List(strChecked);
                prodBoxListService.deleteForEdit(inDto);
                for (int i = 0; i < memberList.size(); i++) {
                    Dto dto = (Dto) memberList.get(i);
                    inDto.put("box_no", dto.getAsString("box_no"));
                    inDto.put("product_id", dto.getAsString("product_id"));
                    inDto.put("amount", dto.getAsString("amount"));
                    List list = g4Reader.queryForList("queryProdBoxDetail", inDto);
                    if (list.size() > 0) {
                    }
                    outDto = prodBoxListService.addProdBoxDef(inDto);
                }
            }
            String jsonStrList = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonStrList);
        } catch (ApplicationException e) {
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "装箱信息登记失败");
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }
        return mapping.findForward(null);
    }

    /**
     * 查询产品绑定服装信息	带分页
     * @param
     * @return
     */
    public ActionForward queryProdBoxList(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto inDto = aForm.getParamAsDto(request);
        String grp_id = super.getSessionContainer(request).getUserInfo().getGrpId();
        Dto outDto = prodBoxListService.queryProdBoxInfo(inDto);
        String jsonStrList = outDto.getAsString("jsonStrList");
        response.getWriter().write(jsonStrList);
        return mapping.findForward(null);
    }

    public ActionForward queryProdBoxDetail(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto inDto = aForm.getParamAsDto(request);
        String grp_id = super.getSessionContainer(request).getUserInfo().getGrpId();
        List list = g4Reader.queryForList("queryProdBoxDetail", inDto);
        String jsonStrList = JsonHelper.encodeList2PageJson(list, 2, GlobalConstants.FORMAT_Date);
        response.getWriter().write(jsonStrList);
        return mapping.findForward(null);
    }

    /**
     * 装箱单信息删除
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward deleteProdBoxInfo(ActionMapping mapping,
                                           ActionForm form, HttpServletRequest request,
                                           HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        try {
            CommonActionForm aForm = (CommonActionForm) form;
            Dto inDto = aForm.getParamAsDto(request);
            inDto.put("state", "1");
            outDto = prodBoxListService.deleteProdBoxInfo(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (Exception e) {
            outDto.put("failure", new Boolean(true));
            outDto.put("msg", "服务信息删除失败");
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }
        return mapping.findForward(null);
    }
}
