package com.cnnct.rfid.web;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.cnnct.common.ApplicationException;
import com.cnnct.rfid.service.CustBasInfoService;
import com.cnnct.sys.vo.UserInfoVo;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.upload.FormFile;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.report.excel.ExcelExporter;
import org.eredlab.g4.rif.report.excel.ExcelReader;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

/**
 * *********************************************
 * 创建日期: 2013-04-26 13:38:00
 * 创建作者：唐芳海
 * 功能：客户信息管理
 * 最后修改时间：2013-06-03
 * 修改记录：lingm 导入导出修改
 * ***********************************************
 */
@SuppressWarnings("unchecked")
public class CustBasInfoAction extends BaseAction {
    private CustBasInfoService custBasInfoService = (CustBasInfoService) super.getService("custBasInfoService");

    /**
     * 客户信息初始化页面
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward CustBasInit(ActionMapping mapping, ActionForm form,
                                     HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        return mapping.findForward("CustBasView");
    }

    /**
     * 客户信息查询
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */

    public ActionForward loadCustBasListByCustId(ActionMapping mapping,ActionForm form, HttpServletRequest request,
                                                   HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto inDto = aForm.getParamAsDto(request);
        Dto outDto = custBasInfoService.loadCustBasListByCustId(inDto);
        String jsonStrList = outDto.getAsString("jsonStrList");
        response.getWriter().write(jsonStrList);
        return mapping.findForward(null);
    }

    /**
     * 客户基本信息树初始话
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward getCustBasInfoTreeAction(ActionMapping mapping,ActionForm form, HttpServletRequest request,
                                                   HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto inDto = aForm.getParamAsDto(request);
        Dto outDto = custBasInfoService.getCustBasInfoTree(inDto);
        String jsonStrList = outDto.getAsString("jsonStrList");
        response.getWriter().write(jsonStrList);
        return mapping.findForward(null);
    }
    
    /**
     * 客户基本信息树初始话
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward getCustBasInfoTreeActionWithChecked(ActionMapping mapping,ActionForm form, HttpServletRequest request,
                                                   HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto inDto = aForm.getParamAsDto(request);
        
        String node = inDto.getAsString("node");
        List list;
        if(node.equals("001")){
            //查询地区信息
            list = g4Reader.queryForList("getCountryInCustBasInfo", inDto);
        }else{
            inDto.put("country",node.substring(4));
            inDto.put("isArea", "yes");
            //查询客户信息
            list = g4Reader.queryForList("getCustBasInfoTree", inDto);
        }

        for(Object obj:list){
            Dto dto = (Dto)obj;
            if(node.equals("001")){
                dto.put("checked", false);
                dto.put("leaf",false);
                dto.put("id",dto.getAsString("id"));
                dto.put("expanded",true);
                dto.put("iconCls","groupIcon");
            }else{
                dto.put("checked", false);
                dto.put("id","cust"+dto.getAsString("id"));
                dto.put("leaf",true);
            }
        }
        String jsonStrList = JsonHelper.encodeObject2Json(list);
    
        response.getWriter().write(jsonStrList);
        return mapping.findForward(null);
    }

    /**
     * 客户信息新增
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward insertCustBasList(ActionMapping mapping,ActionForm form, HttpServletRequest request,
                                                    HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        try {
            CommonActionForm aForm = (CommonActionForm) form;
            Dto inDto = aForm.getParamAsDto(request);
            if(inDto.getAsString("alias").equals("多个别名之间用\",\"隔开")){
                inDto.put("alias","");
            }

            outDto = custBasInfoService.insertCustBasList(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (Exception e) {
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "客户信息新增失败");
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }
        return mapping.findForward(null);
    }

    /**
     * 客户信息删除
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward deleteCustBasList(ActionMapping mapping,
                                                    ActionForm form, HttpServletRequest request,
                                                    HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        try {
            CommonActionForm aForm = (CommonActionForm) form;
            Dto inDto = aForm.getParamAsDto(request);
            inDto.put("state", "1");
            outDto = custBasInfoService.deleteCustBasList(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (Exception e) {
            outDto.put("failure", new Boolean(true));
            outDto.put("msg", "客户信息删除失败");
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }
        return mapping.findForward(null);
    }

    /**
     * 客户信息修改
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward updateCustBasList(ActionMapping mapping,ActionForm form, HttpServletRequest request,
                                                    HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        try {
            CommonActionForm aForm = (CommonActionForm) form;
            Dto inDto = aForm.getParamAsDto(request);

            if(inDto.getAsString("alias").equals("多个别名之间用\",\"隔开")){
                inDto.put("alias","");
            }
            outDto = custBasInfoService.updateCustBasList(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (Exception e) {
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "客户信息修改失败");
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }
        return mapping.findForward(null);
    }

    /**
     * 导入客户信息
     */
    public ActionForward importCustBasList(ActionMapping mapping,ActionForm form, HttpServletRequest request,
                                                 HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        CommonActionForm actionForm = (CommonActionForm) form;
        Dto inDto = actionForm.getParamAsDto(request);
        UserInfoVo user = super.getSessionContainer(request).getUserInfo();
        String grp_id = user.getGrpId();// 单位代码
        try {
            FormFile theFile = actionForm.getTheFile();
            String metaData = "cust_name,tel_no,fax,Email,country,address,web_site,"
                    + "opn_bank,bank_account,tax_id,lnk_name,lnk_tel_no,msn,qq";
            ExcelReader excelReader = new ExcelReader(metaData, theFile.getInputStream());
            List list = excelReader.read(0, 0);

            if (list.size() > 0) {
                Dto impList = (Dto) list.get(0);

                if (impList.size() != metaData.trim().split(",").length) {
                    outDto.put("success", false);
                    outDto.put("msg", "导入失败！Excel文件格式有误,请对照下载的模版文件的格式填写文件");
                    response.getWriter().println(outDto.toJson());
                    return mapping.findForward(null);
                }
            } else {
                outDto.put("success", false);
                outDto.put("msg", "导入失败！Excel文件格式有误,请对照下载的模版文件的格式填写文件");
                response.getWriter().println(outDto.toJson());
                return mapping.findForward(null);
            }

            list.remove(0);// 去除第一列的信息
            Dto custDto;
            //判断国家和 客户名称不能为空
            int listSize = list.size();
            for(int i =0;i<listSize;i++){
            	Dto checkDto = (Dto)list.get(i);
            	String custName = checkDto.getAsString("cust_name");
            	String countryName = checkDto.getAsString("country");
            	if("".equals(custName)||"".equals(countryName)){
            		throw new ApplicationException("国家，客户名字 不能为空");
            	}
            }
            
            for (int i = 0; i < listSize; i++) {
                custDto = (Dto) list.get(i);
                custDto.put("state", "0");
                custBasInfoService.insertCustBasList(custDto);
            }
            outDto.put("msg", "导入客户信息成功!");
            outDto.put("success", true);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (Exception e) {
            e.printStackTrace();
            outDto.put("success", false);
            outDto.put("msg", "导入客户信息失败!");
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }

        return mapping.findForward(null);
    }

    /**
     * 导出客户信息
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward exportBasCustList(ActionMapping mapping,ActionForm form, HttpServletRequest request,
                                                   HttpServletResponse response) throws Exception {
        Dto parametersDto = new BaseDto();
        Dto devDto = new BaseDto();
        Dto inDto = new BaseDto(request);
        parametersDto.put("reportTitle", "客户信息"); // parameter
        List list = g4Reader.queryForList("queryBasCustListInfo", inDto);
        for (int i = 0; i < list.size(); i++) {
            devDto = (Dto) list.get(i);
            if (devDto.getAsString("state").equals("0")) {
                devDto.put("state", "登记");
            } else if (devDto.getAsString("state").equals("1")) {
                devDto.put("state", "注销");
            }
        }
        ExcelExporter excelExporter = new ExcelExporter();
        excelExporter.setTemplatePath("/report/excel/custBasInfo.xls");
        excelExporter.setData(parametersDto, list);
        excelExporter.setFilename("客户信息表" + ".xls");
        excelExporter.export(request, response);
        return mapping.findForward(null);
    }

    /**
     * 客户常用信息查询
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */

    public ActionForward queryCustBasInfoAction(ActionMapping mapping,
                                                ActionForm form, HttpServletRequest request,
                                                HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto inDto = aForm.getParamAsDto(request);
        Dto outDto = custBasInfoService.queryCustBasInfo(inDto);
        String jsonStrList = outDto.getAsString("jsonStrList");
        response.getWriter().write(jsonStrList);
        return mapping.findForward(null);
    }

    /**
     * 客户常用信息新增
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward insertCustBasInfoAction(ActionMapping mapping,
                                                 ActionForm form, HttpServletRequest request,
                                                 HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        try {
            CommonActionForm aForm = (CommonActionForm) form;
            Dto inDto = aForm.getParamAsDto(request);
            outDto = custBasInfoService.insertCustBasInfo(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (Exception e) {
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "客户常用信息新增失败");
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }
        return mapping.findForward(null);
    }

    /**
     * 客户常用信息删除
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward deleteCustBasInfoAction(ActionMapping mapping,
                                                 ActionForm form, HttpServletRequest request,
                                                 HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        try {
            CommonActionForm aForm = (CommonActionForm) form;
            Dto inDto = aForm.getParamAsDto(request);
            inDto.put("state", "1");
            outDto = custBasInfoService.deleteCustBasInfo(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (Exception e) {
            outDto.put("failure", new Boolean(true));
            outDto.put("msg", "客户常用信息删除失败");
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }
        return mapping.findForward(null);
    }

    /**
     * 客户常用信息修改
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward updateCustBasInfoAction(ActionMapping mapping,
                                                 ActionForm form, HttpServletRequest request,
                                                 HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        try {
            CommonActionForm aForm = (CommonActionForm) form;
            Dto inDto = aForm.getParamAsDto(request);
            outDto = custBasInfoService.updateCustBasInfo(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (Exception e) {
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "客户常用信息修改失败");
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }
        return mapping.findForward(null);
    }

    /**
     * 客户编号 下拉框查询 新增中的
     */
    public ActionForward getCustIDCombox(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        Dto inDto = aForm.getParamAsDto(request);
        String grpid = getSessionContainer(request).getUserInfo().getGrpId();
        inDto.put("grp_id", grpid);//企业代码
        inDto.put("state", "0");
        List list = g4Reader.queryForList("getCustIDCombox", inDto);
        String jsonString = JsonHelper.encodeObject2Json(list);
        super.write(jsonString, response);
        return mapping.findForward(null);
    }

    /**
     * 客户订单树查询
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward getCustOrdInfoTree(ActionMapping mapping,ActionForm form, HttpServletRequest request,
                                                  HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        CommonActionForm aForm = (CommonActionForm) form;
        Dto inDto = aForm.getParamAsDto(request);
        
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
        outDto= custBasInfoService.getCustOrdInfoTree(inDto);

        String jsonStrList = outDto.getAsString("jsonStrList");
        response.getWriter().write(jsonStrList);
        return mapping.findForward(null);
    }

}
