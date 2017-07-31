package com.cnnct.rfid.web;


import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.collections.map.HashedMap;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.report.excel.ExcelExporter;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import com.cnnct.common.ApplicationException;
import com.cnnct.rfid.service.EpcProdInfoService;
import com.cnnct.sys.vo.UserInfoVo;
import com.cnnct.util.G4Utils;


/**
 * *********************************************
 * 创建日期: 2013-05-09
 * 创建作者：lingm
 * 功能：电子标签绑定及解绑 标签详细位置
 * 最后修改时间：2013-05-10
 * 修改记录：
 * ***********************************************
 */
@SuppressWarnings({"unchecked"})
public class EpcProdInfoAction extends BaseAction {

    EpcProdInfoService epcProdInfoService = (EpcProdInfoService) super.getService("epcProdInfoService");

    public ActionForward manageEpcProdInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                           HttpServletResponse response) throws Exception {
        return mapping.findForward("manageEpcProdView");
    }

    public ActionForward removeEpcProdInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                           HttpServletResponse response) throws Exception {
        return mapping.findForward("removeEpcProdView");
    }

    public ActionForward queryProdDetailInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                           HttpServletResponse response) throws Exception {
        return mapping.findForward("queryProdDetailView");
    }

    /**
     * 查询产品绑定服装信息	带分页
     *
     * @param
     * @return
     */
    public ActionForward queryProdBasInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                          HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        String grp_id = super.getSessionContainer(request).getUserInfo().getGrpId();
        Dto inDto = aForm.getParamAsDto(request);
        inDto.put("state", "0");
        Dto outDto = epcProdInfoService.queryProdBasInfo(inDto);
        String jsonStrList = outDto.getAsString("jsonStrList");
        response.getWriter().write(jsonStrList);
        return mapping.findForward(null);
    }

    public ActionForward queryProdBasDetailInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                                HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        String grp_id = super.getSessionContainer(request).getUserInfo().getGrpId();
        Dto inDto = aForm.getParamAsDto(request);
        Dto outDto = epcProdInfoService.queryProdBasDetailInfo(inDto);
        String jsonStrList = outDto.getAsString("jsonStrList");
        response.getWriter().write(jsonStrList);
        return mapping.findForward(null);
    }

    /**
     * 查询单件产品绑定服装信息
     *
     * @param
     * @return
     */
    public ActionForward queryProdBasBaseInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                              HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        String grp_id = super.getSessionContainer(request).getUserInfo().getGrpId();
        Dto inDto = aForm.getParamAsDto(request);
        inDto.put("state", '0');
        Dto outDto = epcProdInfoService.queryProdBasBaseInfo(inDto);
        String jsonStrList = outDto.getAsString("jsonStrList");
        response.getWriter().write(jsonStrList);
        return mapping.findForward(null);
    }

    public ActionForward queryProdBasBaseFormInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                                  HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        String grp_id = super.getSessionContainer(request).getUserInfo().getGrpId();
        Dto inDto = aForm.getParamAsDto(request);
        Dto outDto = new BaseDto();
        try {
            inDto.put("state", '0');
            outDto = (Dto) g4Reader.queryForObject("queryProdAndEpcInfo", inDto);
            String jsonString = JsonHelper.encodeDto2FormLoadJson(outDto, "");
            super.write(jsonString,response);
            return mapping.findForward(null);
        } catch (Exception e) {
            e.printStackTrace();
            outDto.put("success",false);
            outDto.put("msg","查询失败!");
            String jsonString = JsonHelper.encodeDto2FormLoadJson(outDto, "");
            super.write(jsonString,response);
            return mapping.findForward(null);
        }
    }

    /**
     * RFID电子标签绑定
     *
     * @param
     * @return
     */
    public ActionForward saveProdBasInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                         HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        try {
            CommonActionForm aForm = (CommonActionForm) form;
            Dto inDto = aForm.getParamAsDto(request);
            UserInfoVo user = super.getSessionContainer(request).getUserInfo();
            String opr_id = user.getUserid();
            String grp_id = user.getGrpId();
            inDto.put("opr_id", opr_id);
            inDto.put("grp_id", grp_id);

            inDto.put("opr_date", G4Utils.getCurDate());
            inDto.put("tr_date", G4Utils.getCurDate());

            inDto.put("trm_no", "");
            inDto.put("state", 0);
            outDto = epcProdInfoService.saveProdBasInfo(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (ApplicationException e) {
            e.printStackTrace();
            outDto.put("msg", "电子标签绑定失败");
            outDto.put("success", new Boolean(false));
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (Exception e) {
            e.printStackTrace();
            outDto.put("msg", "电子标签绑定失败");
            outDto.put("success", new Boolean(false));
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }
        return mapping.findForward(null);
    }

    /**
     * 电子标签解绑
     *
     * @param
     * @return
     */
    public ActionForward removeProdBasInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                           HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        try {
            CommonActionForm aForm = (CommonActionForm) form;
            String opr_id = super.getSessionContainer(request).getUserInfo().getAccount();
            String grp_id = super.getSessionContainer(request).getUserInfo().getGrpId();
            Dto inDto = aForm.getParamAsDto(request);
            inDto.put("opr_id", opr_id);
            inDto.put("opr_date", G4Utils.getCurrentTime("yyyy-MM-dd"));
            inDto.put("tr_date", G4Utils.getCurrentTime("yyyy-MM-dd"));
            inDto.put("grp_id", grp_id);
            //设备编号
            inDto.put("trm_no", "");
            outDto = epcProdInfoService.updateProdEpcInfo(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            System.out.println(jsonString);
            response.getWriter().write(jsonString);
        } catch (ApplicationException e) {
            e.printStackTrace();
            outDto.put("msg", "电子标签解除绑定失败");
            outDto.put("success", new Boolean(false));
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (Exception e) {
            e.printStackTrace();
            outDto.put("msg", "电子标签解除绑定失败");
            outDto.put("success", new Boolean(false));
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }
        return mapping.findForward(null);
    }

    /**
     * 查询产品在哪里
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward queryProdDetailInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                           HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        try {
            CommonActionForm aForm = (CommonActionForm) form;
            Dto inDto = aForm.getParamAsDto(request);
            // 修改  2013-8-14 zhouww  保存导出查询条件Dto
            super.setSessionAttribute(request, "GETPRODSTATE_DTO", inDto);
            //~end
            
            //订单状态处理
            String orderstatus = inDto.getAsString("orderstatus");
            if("9".equals(orderstatus)){
                inDto.remove("orderstatus");
            }
            //我的订单状态处理
            String myorder = inDto.getAsString("ismyorder");
            if(!"yes".equals(myorder)){
                inDto.remove("ismyorder");
            }
            inDto.put("account", super.getSessionContainer(request).getUserInfo().getAccount());
            outDto = epcProdInfoService.queryProdDetailInfo(inDto);

            super.write(outDto.getAsString("jsonString"),response);
        } catch (ApplicationException e) {
            e.printStackTrace();
            outDto.put("msg", "电子标签解除绑定失败");
            outDto.put("success", new Boolean(false));
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (Exception e) {
            e.printStackTrace();
            outDto.put("msg", "电子标签解除绑定失败");
            outDto.put("success", new Boolean(false));
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }
        return mapping.findForward(null);
    }
    
    /**
     * 导出产品状态
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     * @create 2013-8-14
     * @author zhouww
     */
    public ActionForward prodStateExport(ActionMapping mapping,ActionForm form,HttpServletRequest request,
    									HttpServletResponse response) throws Exception {
    	 Dto parametersDto = new BaseDto();
         Dto inDto = (BaseDto) super.getSessionAttribute(request, "GETPRODSTATE_DTO");
         inDto.remove("queryForPageCountFlag");
         inDto.remove("start");
         Dto outDto =  epcProdInfoService.prodStateExport(inDto);
         //如果有订单号信息 查询fob_deal_date
         String ordSeqNo = inDto.getAsString("ord_seq_no");
         String fobDate = "";
         if(ordSeqNo!=null&&!"".equals(ordSeqNo)){
        	 Dto paramDto = new BaseDto();
        	 paramDto.put("ord_seq_no", ordSeqNo);
        	 Object prodOrdDto = g4Reader.queryForObject("queryProdOrdInfo",paramDto);
        	 if(prodOrdDto!=null){
        		 fobDate = ((Dto)prodOrdDto).getAsString("fob_deal_date");
        	 }
        	 if(fobDate.length()>10){
        		 fobDate = fobDate.substring(0,10);
        	 }
         }
         fobDate = "FOB "+fobDate;
         String showFlag = inDto.getAsString("showFlag");
         List list = (List)outDto.get("prodInfo");
         ExcelExporter excelExporter = new ExcelExporter();
         String currentDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
         if("1".equals(showFlag)){
        	 parametersDto.put("reportTitle", fobDate+"具体产品"); // parameter
        	 excelExporter.setTemplatePath("/report/excel/prodFullInfo.xls");
             excelExporter.setFilename(" 具体产品" +currentDate+ ".xls");
         }else if("2".equals(showFlag)){
        	 parametersDto.put("reportTitle", fobDate+"生产通知单"); // parameter
        	 excelExporter.setTemplatePath("/report/excel/prodOrdInfo.xls");
             excelExporter.setFilename(" 生产通知单" +currentDate+ ".xls");
         }else if("3".equals(showFlag)){
        	 parametersDto.put("reportTitle", fobDate+"订单"); // parameter
        	 excelExporter.setTemplatePath("/report/excel/ordBasInfo.xls");
             excelExporter.setFilename(" 订单" +currentDate+ ".xls");
         }
         excelExporter.setData(parametersDto, list);
         excelExporter.export(request, response);
         return mapping.findForward(null);
    }
    /**
     * 查询产品在哪里通过生产通知单
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward queryProdDetailInfoByProdOrd(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                             HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        try {
            CommonActionForm aForm = (CommonActionForm) form;
            Dto inDto = aForm.getParamAsDto(request);

            outDto = epcProdInfoService.queryProdDetailInfoByProdOrd(inDto);
            super.write(outDto.getAsString("jsonString"),response);
        } catch (Exception e) {
            e.printStackTrace();
            outDto.put("msg", "电子标签解除绑定失败");
            outDto.put("success", new Boolean(false));
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }
        return mapping.findForward(null);
    }


}
