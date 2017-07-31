package com.cnnct.rfid.web;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
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
import com.cnnct.rfid.service.impl.FinanceSendOutService;
import com.cnnct.sys.vo.UserInfoVo;
import com.cnnct.util.G4Utils;
/**
 * *********************************************
 * 创建日期: 2015-09-29
 * 创建作者：xtj
 * 功能：财务报表的导入，导出，匹配，增删改查
 * 最后修改时间：
 * 修改记录：
 * ***********************************************
 */
@SuppressWarnings({"unchecked"})
public class FinanceSendOutAction extends BaseAction {
	Log log = LogFactory.getLog(FinanceSendOutAction.class);
	FinanceSendOutService financeSendOutService =(FinanceSendOutService)super.getService("financeSendOutService");
	/**
     * 报表页面初始化
     *
     * @param
     * @return
     */
    public ActionForward financeSendOutInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                        HttpServletResponse response) throws Exception {
        return mapping.findForward("financeSendOutView");
    }
    
    
    /**
     * 查询
     * @param
     * @return
     */
    public ActionForward queryfinanceSendOutReport(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                        HttpServletResponse response) throws Exception {
        Dto outDto=new BaseDto();
    	try {
        	 String user_id = super.getSessionContainer(request).getUserInfo().getUserid();
        	 CommonActionForm cForm = (CommonActionForm)form;
             Dto inDto = cForm.getParamAsDto(request);
             inDto.put("opr_id", user_id);
             outDto=financeSendOutService.queryFinanceSendOut(inDto);
             String jsonStrList = outDto.getAsString("jsonStrList");
             response.getWriter().write(jsonStrList);
    	} catch (Exception e) {
			e.printStackTrace();
		}
    	return mapping.findForward(null);
    }

    /**
     * 新增
     */
    public ActionForward addfinanceSendOut(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
		Dto outDto=new BaseDto();
		try {
       	 	String user_id = super.getSessionContainer(request).getUserInfo().getAccount();
			CommonActionForm cForm = (CommonActionForm)form;
			Dto inDto = cForm.getParamAsDto(request);
			inDto.put("opr_id", user_id);
			inDto.put("opr_date",G4Utils.getCurDate());
			outDto=financeSendOutService.addFinanceSendOut(inDto);
			String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
    	} catch (Exception e) {
			 e.printStackTrace();
			 outDto.put("failure", new Boolean(true));
	         outDto.put("msg", "新增失败");
	         String jsonString = JsonHelper.encodeObject2Json(outDto);
	         response.getWriter().write(jsonString);
		}
    	return mapping.findForward(null);
    }
    
 
    /**
     * 修改信息
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward updateFinanceSendOut(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
    	Dto outDto=new BaseDto();
    	try {
       	 	String account = super.getSessionContainer(request).getUserInfo().getAccount();
            CommonActionForm cForm = (CommonActionForm)form;
            Dto inDto = cForm.getParamAsDto(request);
            inDto.put("opr_id", account);
            inDto.put("edt_date",G4Utils.getCurDate());
            outDto=financeSendOutService.updateFinanceSendOut(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);;
    	} catch (Exception e) {
			 e.printStackTrace();
			 outDto.put("failure", new Boolean(true));
	         outDto.put("msg", "修改失败");
	         String jsonString = JsonHelper.encodeObject2Json(outDto);
	         response.getWriter().write(jsonString);
		}
    	return mapping.findForward(null);
    }
    
    /**
     * 删除信息
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward deleteFinanceSendOut(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
    	Dto outDto=new BaseDto();
    	try {
       	 	String account = super.getSessionContainer(request).getUserInfo().getAccount();
            CommonActionForm cForm = (CommonActionForm)form;
            Dto inDto = cForm.getParamAsDto(request);
            inDto.put("opr_id", account);
            outDto=financeSendOutService.deleteFinanceSendOut(inDto);
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
    	} catch (Exception e) {
			 e.printStackTrace();
			 outDto.put("failure", new Boolean(true));
	         outDto.put("msg", "删除失败");
	         String jsonString = JsonHelper.encodeObject2Json(outDto);
	         response.getWriter().write(jsonString);
		}
    	return mapping.findForward(null);
    }
    
    /**
     *import
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward importFinaceReport(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
    	CommonActionForm aform = (CommonActionForm) form;
		FormFile file = aform.getTheFile();
		Dto outDto = new BaseDto();
		try {
			UserInfoVo user = super.getSessionContainer(request).getUserInfo();
			String opr_id = user.getAccount();
			//报表解析
			Workbook wb=WorkbookFactory.create(file.getInputStream());
			Sheet sheet=wb.getSheetAt(0);
			String metaData = "ord_seq_no,real_cut_num,bach_accept_num,product_num,leave_deal_date";
			ExcelReader excelReader = new ExcelReader(metaData,
					file.getInputStream());
			List list = excelReader.read(0, 0);
			for (int i = 0; i < list.size(); i++) {
				Dto dto=(Dto)list.get(i);
				Dto rDto=(Dto)g4Reader.queryForObject("getOrdInfo",dto);
				dto.put("style_no", rDto.getAsString("style_no"));
				dto.put("cust_id", rDto.getAsString("cust_id"));
				dto.put("fob_deal_date", rDto.getAsString("fob_deal_date"));
				dto.put("real_cut_num_fin", rDto.getAsString("real_cut_num"));
				dto.put("bach_accept_num_fin", rDto.getAsString("pack_accept_num"));
				dto.put("product_num_fin", rDto.getAsString("f_product_num"));
				dto.put("country", rDto.getAsString("country"));
				dto.put("transportation_way", rDto.getAsString("transportation_way"));
			}
		} catch (Exception e) {
			e.printStackTrace();
			outDto.put("success",new Boolean(false));
			outDto.put("msg","导入失败"+e.getMessage());
			String json=JsonHelper.encodeObject2Json(outDto);
			super.write(json, response);
		}
    	return mapping.findForward(null);
    }
    /**
     *export
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward exportFinaceReport(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
    	Dto parametersDto = new BaseDto();
    	parametersDto.put("reportTitle", "记录流水信息"); // parameter
        CommonActionForm cForm = (CommonActionForm)form;
        Dto inDto = cForm.getParamAsDto(request);
        List list= g4Reader.queryForList("queryFinanceSendOut", inDto);
        ExcelExporter excelExporter = new ExcelExporter();
        excelExporter.setTemplatePath("/report/excel/financeSendOutComp.xls");
        excelExporter.setData(parametersDto, list);
        excelExporter.setFilename("财务出货汇总校对表" + ".xls");
        excelExporter.export(request, response);
    	return mapping.findForward(null);
    }
}
