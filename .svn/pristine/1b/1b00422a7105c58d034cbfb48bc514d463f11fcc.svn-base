package com.cnnct.rfid.web;

import java.util.List;

import com.cnnct.rfid.service.DeptScheInfoService;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.report.excel.ExcelExporter;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * *********************************************
 * 创建日期: 2013-05-13
 * 创建作者：may
 * 功能：部门进度
 * 最后修改时间：
 * 修改记录：
 * ***********************************************
 */
public class DeptScheInfoAction extends BaseAction {

    private DeptScheInfoService deptScheInfoService = (DeptScheInfoService)super.getService("deptScheInfoService");

    /**
     * 部门进度页面初始化
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward deptScheInfoInit(ActionMapping mapping,ActionForm form,HttpServletRequest request,
                             HttpServletResponse response) throws  Exception{
        return mapping.findForward("deptScheInfoView");
    }

    /**
     * 部门日进度页面初始化
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward deptDayScheInit(ActionMapping mapping,ActionForm form,HttpServletRequest request,
                             HttpServletResponse response) throws  Exception{
        return mapping.findForward("deptDayScheView");
    }

    /**
     * 获取部门进度图信息
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward getDeptScheInfoView(ActionMapping mapping,ActionForm form,HttpServletRequest request,
                             HttpServletResponse response) throws  Exception{
        CommonActionForm aform = (CommonActionForm)form;
        Dto inDto = aform.getParamAsDto(request);

        Dto outDto = deptScheInfoService.getDeptScheInfoView(inDto);

        super.write(JsonHelper.encodeObject2Json(outDto),response);
    
        return mapping.findForward(null);
    }

    /**
     * 获取部门日进度图信息
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward getDeptDayScheView(ActionMapping mapping,ActionForm form,HttpServletRequest request,
                                         HttpServletResponse response) throws  Exception{
        CommonActionForm aform = (CommonActionForm)form;
        Dto inDto = aform.getParamAsDto(request);

        Dto outDto = deptScheInfoService.getDeptDayScheView(inDto);

        super.write(JsonHelper.encodeObject2Json(outDto),response);

        return mapping.findForward(null);
    }

    /**
     * 获取部门进度信息
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward getDeptScheInfo(ActionMapping mapping,ActionForm form,HttpServletRequest request,
                                         HttpServletResponse response) throws  Exception{
        CommonActionForm aform = (CommonActionForm)form;
        Dto inDto = aform.getParamAsDto(request);
        super.setSessionAttribute(request,"GETDEPTSCHE_DTO",inDto);
        Dto outDto = deptScheInfoService.getDeptScheInfo(inDto);

        super.write(outDto.getAsString("jsonString"),response);

        return mapping.findForward(null);
    }

    /**
     * 获取部门日进度信息
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward getDeptDaySche(ActionMapping mapping,ActionForm form,HttpServletRequest request,
                                        HttpServletResponse response) throws  Exception{
        CommonActionForm aform = (CommonActionForm)form;
        Dto inDto = aform.getParamAsDto(request);
        super.setSessionAttribute(request,"GETDEPTDAYSCHE_DTO",inDto);
        Dto outDto = deptScheInfoService.getDeptDaySche(inDto);

        super.write(outDto.getAsString("jsonString"),response);

        return mapping.findForward(null);
    }

    /**
     * 根据部门编号获取对应订单信息
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward getOrdBasInfoByDeptId(ActionMapping mapping,ActionForm form,HttpServletRequest request,
                             HttpServletResponse response) throws  Exception{
        CommonActionForm aform = (CommonActionForm)form;
        Dto inDto = aform.getParamAsDto(request);

        Dto outDto = deptScheInfoService.getOrdBasInfoByDeptId(inDto);

        super.write(outDto.getAsString("jsonString"),response);

        return mapping.findForward(null);
    }
    //导部门总进度记录
    public ActionForward exportDeptSche(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		Dto parametersDto = new BaseDto();
		Dto devDto = new BaseDto();
		Dto inDto = new BaseDto(request);
		String flag=request.getParameter("flag");
		if(flag.equals("cur")){
			inDto=(Dto) super.getSessionAttribute(request, "GETDEPTSCHE_DTO");
		}
		inDto.remove("queryForPageCountFlag");
		parametersDto.put("reportTitle", "部门总进度信息"); // parameter
		List list = g4Reader.queryForList("getDeptScheInfo", inDto);
		for (int i = 0; i < list.size(); i++) {
			devDto = (Dto) list.get(i);
			if (devDto.getAsString("nature").equals("1")) {
				devDto.put("nature", "裁出数量");
			} else if (devDto.getAsString("nature").equals("2")) {
				devDto.put("nature", "缝制领片");
			}else if (devDto.getAsString("nature").equals("3")) {
				devDto.put("nature", "缝制下线");
			}else if (devDto.getAsString("nature").equals("4")) {
				devDto.put("nature", "水洗收货");
			}else if (devDto.getAsString("nature").equals("5")) {
				devDto.put("nature", "水洗移交");
			}else if (devDto.getAsString("nature").equals("6")) {
				devDto.put("nature", "后整收货");
			}else if (devDto.getAsString("nature").equals("7")) {
				devDto.put("nature", "移交成品");
			}else if (devDto.getAsString("nature").equals("8")) {
				devDto.put("nature", "移交B品");
			}else if (devDto.getAsString("nature").equals("10")) {
				devDto.put("nature", "收成品");
			}else if (devDto.getAsString("nature").equals("11")) {
				devDto.put("nature", "收B品");
			}else if (devDto.getAsString("nature").equals("12")) {
				devDto.put("nature", "中间领用");
			}else if(devDto.getAsString("nature").equals("13")){
				devDto.put("nature", "送水洗");
			}
		}
		ExcelExporter excelExporter = new ExcelExporter();
		excelExporter.setTemplatePath("/report/excel/deptScheList.xls");
		excelExporter.setData(parametersDto, list);
		excelExporter.setFilename("部门总进度表" + ".xls");
		excelExporter.export(request, response);
		return mapping.findForward(null);
	}
    //导部门日进度记录
    public ActionForward exportDeptDaySche(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		Dto parametersDto = new BaseDto();
		Dto devDto = new BaseDto();
		Dto inDto = new BaseDto(request);
		String flag=request.getParameter("flag");
		if(flag.equals("cur")){
			inDto=(Dto) super.getSessionAttribute(request, "GETDEPTDAYSCHE_DTO");
		}
		inDto.remove("queryForPageCountFlag");
		parametersDto.put("reportTitle", "部门日进度信息"); // parameter
		List list = g4Reader.queryForList("getDeptDayScheInfo", inDto);
		for (int i = 0; i < list.size(); i++) {
			devDto = (Dto) list.get(i);
			if (devDto.getAsString("nature").equals("1")) {
				devDto.put("nature", "裁出数量");
			} else if (devDto.getAsString("nature").equals("2")) {
				devDto.put("nature", "缝制领片");
			}else if (devDto.getAsString("nature").equals("3")) {
				devDto.put("nature", "缝制下线");
			}else if (devDto.getAsString("nature").equals("4")) {
				devDto.put("nature", "水洗收货");
			}else if (devDto.getAsString("nature").equals("5")) {
				devDto.put("nature", "水洗移交");
			}else if (devDto.getAsString("nature").equals("6")) {
				devDto.put("nature", "后整收货");
			}else if (devDto.getAsString("nature").equals("7")) {
				devDto.put("nature", "移交成品");
			}else if (devDto.getAsString("nature").equals("8")) {
				devDto.put("nature", "移交B品");
			}else if (devDto.getAsString("nature").equals("10")) {
				devDto.put("nature", "收成品");
			}else if (devDto.getAsString("nature").equals("11")) {
				devDto.put("nature", "收B品");
			}else if (devDto.getAsString("nature").equals("12")) {
				devDto.put("nature", "中间领用");
			}else if(devDto.getAsString("nature").equals("13")){
				devDto.put("nature", "送水洗");
			}
		}
		ExcelExporter excelExporter = new ExcelExporter();
		excelExporter.setTemplatePath("/report/excel/deptDayScheList.xls");
		excelExporter.setData(parametersDto, list);
		excelExporter.setFilename("部门日进度信息表" + ".xls");
		excelExporter.export(request, response);
		return mapping.findForward(null);
	}
}
