package com.cnnct.rfid.web;

import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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
import com.cnnct.rfid.service.ExcelExportService;
import com.cnnct.util.G4Utils;
import com.cnnct.util.TimeUtil;

/**
 * 功能：报表导出功能
 * 创建时间:2013-10-21 
 * 创建作者：zhouww
 * 最后修改功能：
 * 最后修改时间：
 */
public class ExcelExportAction extends BaseAction{
	private ExcelExportService eeService = (ExcelExportService)super.getService("excelExportService");
	
	/**
	 *  
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws ApplicationException
	 */
    public ActionForward exportInit(ActionMapping mapping,ActionForm form,
                                                    HttpServletRequest request,HttpServletResponse response)throws ApplicationException{
        return mapping.findForward("exportView");
    }
	
	/**
	 * 水洗收送流程
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws ApplicationException
	 */
	public ActionForward washAcceptAndDeliveryExcel(ActionMapping mapping,ActionForm form,
													HttpServletRequest request,HttpServletResponse response)throws ApplicationException{
		try{
			CommonActionForm cForm = (CommonActionForm)form;
			Dto inDto = cForm.getParamAsDto(request);
			inDto.put("excel_request", request);
			inDto.put("excel_response", response);
			Dto outDto = eeService.acceptAndDeliveryExcel(inDto);
		}catch(Exception e){
			e.printStackTrace();
		}
		return mapping.findForward(null);
	}
	/**
	 * 水洗收送明细
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws ApplicationException
	 */
	public ActionForward washStatisticsData(ActionMapping mapping,ActionForm form,
				HttpServletRequest request,HttpServletResponse response)throws ApplicationException{
		try{
			CommonActionForm cForm = (CommonActionForm)form;
			Dto inDto = cForm.getParamAsDto(request);
			inDto.put("excel_request", request);
			inDto.put("excel_response", response);
			Dto outDto = eeService.washStatisticsData(inDto);
		}catch(Exception e){
			e.printStackTrace();
		}
		return mapping.findForward(null);
	}
	/**
	 * 订单跟踪表
	 * @param mapping
	 * @param from
	 * @param request
	 * @param response
	 * @return
	 */
	public ActionForward ordStatisticsExcel(ActionMapping mapping,ActionForm form,
										HttpServletRequest request,HttpServletResponse response){
		try{
			CommonActionForm cForm = (CommonActionForm)form;
			Dto inDto = cForm.getParamAsDto(request);
			String saveParames = inDto.getAsString("saveParames");
			String export = inDto.getAsString("export");
			if(saveParames.equals("true")){
			    super.setSessionAttribute(request, "export", inDto);
			    Dto resultDto = new BaseDto();
			    resultDto.put("success", true);
			    response.getWriter().write(JsonHelper.encodeObject2Json(resultDto));
			    return mapping.findForward(null);
			}
			if(export.equals("true")){
			    inDto = (Dto)super.getSessionAttribute(request, "export");
			}else {
			    return mapping.findForward(null);
			}
			inDto.put("excel_request", request);
			inDto.put("excel_response", response);
			Dto outDto = eeService.ordStatisticsExcel(inDto);
		}catch(Exception e){
			e.printStackTrace();
		}
		return mapping.findForward(null);
	}
	/**
	 * (贸易用)水洗厂大货进度表
	 * @param mapping
	 * @param from
	 * @param request
	 * @param response
	 * @return
	 */
	public ActionForward washExcelByWeekNum(ActionMapping mapping,ActionForm form,
			HttpServletRequest request,HttpServletResponse response){
		try{
			CommonActionForm cForm = (CommonActionForm)form;
			Dto inDto = cForm.getParamAsDto(request);
			inDto.put("excel_request", request);
			inDto.put("excel_response", response);
			eeService.washExcelByWeekNum(inDto);
		}catch(Exception e){
			e.printStackTrace();
		}
		return mapping.findForward(null);
	}
	/**
	 * 出货报表
	 * @param mapping
	 * @param from
	 * @param request
	 * @param response
	 * @return
	 */
	public ActionForward shipmentExcel(ActionMapping mapping,ActionForm form,
			HttpServletRequest request,HttpServletResponse response){
		try{
			CommonActionForm cForm = (CommonActionForm)form;
			Dto inDto = cForm.getParamAsDto(request);
			inDto = converParam(inDto);
			inDto.put("excel_request", request);
			inDto.put("excel_response", response);
			eeService.shipmentExcel(inDto);
		}catch(Exception e){
			e.printStackTrace();
		}
		return mapping.findForward(null);
	}
	
	/**
	 * 订单记录流水导出
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 */
	public ActionForward ordDayListExcel(ActionMapping mapping,ActionForm form,
			HttpServletRequest request,HttpServletResponse response){
		try{
			CommonActionForm cForm = (CommonActionForm)form;
			Dto inDto = cForm.getParamAsDto(request);
			inDto = converParam(inDto);
			inDto.put("excel_request", request);
			inDto.put("excel_response", response);
			eeService.ordDayListExcel(inDto);
		}catch(Exception e){
			e.printStackTrace();
		}
		return mapping.findForward(null);
	}
	
	/**
	 * B品流水报表
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 */
	public ActionForward BReportExcel(ActionMapping mapping,ActionForm form,
			HttpServletRequest request,HttpServletResponse response){
		try {
			CommonActionForm cForm = (CommonActionForm)form;
			Dto inDto = cForm.getParamAsDto(request);
			inDto = converParam(inDto);
			Dto reportDto= eeService.BReportExcel(inDto);
			List list=reportDto.getDefaultAList();
			ExcelExporter excelExporter = new ExcelExporter();
	        excelExporter.setTemplatePath("/report/excel/bReportList.xls");
	        excelExporter.setData(new BaseDto("reportTitle","B品流水报表"), list);
	        excelExporter.setFilename("B品流水报表" +TimeUtil.getCurrentDate()+ ".xls");
	        excelExporter.export(request, response);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return mapping.findForward(null);
	}
	
	/**
	 * B品库存报表
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 */
	public ActionForward BStorageExcel(ActionMapping mapping,ActionForm form,
			HttpServletRequest request,HttpServletResponse response){
		try {
			String curtime = G4Utils.getCurDate();
			CommonActionForm cForm = (CommonActionForm)form;
			Dto inDto = cForm.getParamAsDto(request);
			inDto = converParam(inDto);
			inDto.put("curdate", curtime.substring(0, 7));
			Dto dayDto= eeService.storageDayReport(inDto);
			inDto.put("curdate", curtime.substring(0, 4));
			Dto monthDto= eeService.storageMonthReport(inDto);
			List dlist=dayDto.getDefaultAList();
			List mlist=monthDto.getDefaultAList();
			if (dlist!=null && mlist!=null) {
				mlist.addAll(dlist);
			}
			ExcelExporter excelExporter = new ExcelExporter();
	        excelExporter.setTemplatePath("/report/excel/bStorageReport.xls");
	        excelExporter.setData(new BaseDto("reportTitle","B品库存报表"), mlist);
	        //excelExporter.setData(new BaseDto("reportTitle","B品管理报表"), mlist);
	        excelExporter.setFilename("B品库存报表" +TimeUtil.getCurrentDate()+ ".xls");
	        excelExporter.export(request, response);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return mapping.findForward(null);
	}
	
	private Dto converParam(Dto inDto)throws UnsupportedEncodingException{
		String osName = System.getProperty("os.name").toLowerCase();
        if(osName.indexOf("window")!=-1){
	        for(Object obj :inDto.keySet()){
	        	String str = (String)obj;
	        	String property = new String(inDto.getAsString(str).getBytes("iso8859-1"),"utf-8");
	        	inDto.put(str, property);
	        }
        }else if(osName.indexOf("window")==-1){
        	for(Object obj :inDto.keySet()){
	        	String str = (String)obj;
	        	String property = new String(inDto.getAsString(str).getBytes());
	        	inDto.put(str, property);
	        }
        }
        return inDto;
	}
}
