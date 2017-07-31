package com.cnnct.rfid.web;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.upload.FormFile;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.report.excel.ExcelExporter;
import org.eredlab.g4.rif.report.excel.ExcelReader;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import com.cnnct.common.ApplicationException;
import com.cnnct.rfid.service.ManageQCService;
import com.cnnct.sys.vo.UserInfoVo;
import com.cnnct.util.ExcelUtil;
import com.cnnct.util.G4Utils;
import com.cnnct.util.TimeUtil;

/**
 * ********************************************* 创建日期: 2015-2-3 
 * 功能：qc管理web部分 最后修改时间： 修改记录： ***********************************************
 */
@SuppressWarnings({ "unchecked", "rawtypes" })
public class ManageQCAction extends BaseAction {
	Log log = LogFactory.getLog(ManageQCAction.class);
	private ManageQCService manageQCService = (ManageQCService) super
			.getService("manageQCService");
	/**
     * 查询界面初始化
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward queryView(ActionMapping mapping, ActionForm form, 
            HttpServletRequest request,HttpServletResponse response) throws Exception {
        return mapping.findForward("queryView");
    }
   
    /**
     * qc数量操作界面
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward qcNumView(ActionMapping mapping, ActionForm form, 
            HttpServletRequest request,HttpServletResponse response) throws Exception {
        return mapping.findForward("qcNumView");
    }
    
	/**
	 * qc管理页面初始化
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward manageQCProcessInit(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {

		return mapping.findForward("ManageQCView");
	}
	
	/**
	 * qc流水记录页面初始化
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward manageQCScheInit(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		return mapping.findForward("ManageQCScheView");
	}
	
	 /**
     * 饼图界面初始化
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward manageQCReportInit(ActionMapping mapping, ActionForm form, 
            HttpServletRequest request,HttpServletResponse response) throws Exception {
        return mapping.findForward("qcPieView");
    }
    
	/**
	 * 查询所有qc
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward queryQCProcess(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		UserInfoVo user = super.getSessionContainer(request).getUserInfo();
		String grp_id = user.getGrpId();
		String opr_id = user.getAccount();
		Dto dto = aForm.getParamAsDto(request);
		dto.put("opr_id", opr_id);
		Dto outDto = manageQCService.queryQCProcess(dto);
		write(outDto.getAsString("jsonString"), response);
		return mapping.findForward(null);
	}
	
	
	/**
	 * 查询所有qc记录
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward queryQCScheList(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		UserInfoVo user = super.getSessionContainer(request).getUserInfo();
		String grp_id = user.getGrpId();
		String opr_id = user.getAccount();
		Dto dto = aForm.getParamAsDto(request);
		dto.put("opr_id", opr_id);
		Dto outDto = manageQCService.queryQCScheList(dto);
		write(outDto.getAsString("jsonString"), response);
		return mapping.findForward(null);
	}
	
	
	/**
	 * 页面新增qc检查项
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward saveQCItem(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		UserInfoVo user = super.getSessionContainer(request).getUserInfo();
		String opr_id = user.getAccount();
		Dto dto = aForm.getParamAsDto(request);
		dto.put("opr_id", opr_id);
		Dto outDto = manageQCService.saveQCItemFromB(dto);
		write(outDto.getAsString("jsonString"), response);
		return mapping.findForward(null);
	}
	/**
	 * 导入qc信息
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward importQCInfo(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		CommonActionForm aform = (CommonActionForm) form;
		FormFile file = aform.getTheFile();
		Dto outDto = new BaseDto();
		try {
			UserInfoVo user = super.getSessionContainer(request).getUserInfo();
			String opr_id = user.getAccount();
			//保存通用检查项
			Workbook wb=WorkbookFactory.create(file.getInputStream());
			Sheet sheet=wb.getSheetAt(0);
			int rows=sheet.getPhysicalNumberOfRows();
			for(int i=1;i<rows;i++){
				Dto dto = new BaseDto();
				Cell cell = sheet.getRow(i).getCell(7);
				if (cell==null) {
					continue;
				}
				switch(cell.getCellType()) {
	            case Cell.CELL_TYPE_BLANK:
	            	continue;
	            case Cell.CELL_TYPE_STRING:
	            	dto.put("name", cell.getStringCellValue().trim());
	            	dto.put("flag", "4");
	            	//重复行验证 
					Dto infoDto=manageQCService.getQCInfoByDto(dto);
					//有相同名字和标识的信息,检查项对应位置存入已有的序号
					if(infoDto!=null){
						continue;
					}
					dto.put("short_name", cell.getStringCellValue().trim());
					String max_seq_no = (String) g4Reader.queryForObject("selectMaxSeqFromQCBaseInfo");
					Integer in_seq_no=max_seq_no==null?1:(Integer.parseInt(max_seq_no) + 1);
					dto.put("seq_no", in_seq_no);
					//保存qc基本信息单元格信息
					manageQCService.saveQCprocess(dto);
	                break;
				}
			}
			
			//保存基本检查项
			StringBuffer sb = new StringBuffer();
			IReader iReader = (IReader) SpringBeanLoader
					.getSpringBean("g4Reader");
			String metaData = "no,specific_id,class,qc_position,parent_no,qc_item";
			ExcelReader excelReader = new ExcelReader(metaData,
					file.getInputStream());
			List list = excelReader.read(0, 0);
			if (list.size() > 0) {
				Dto dto = (Dto) list.get(0);
				if (dto.size() != metaData.split(",").length) {
					throw new ApplicationException("[模板一]导入文件格式有误,请下载最新文件格式!");
				}
			}
			
			list.remove(0);//去除第一行的信息
			//添加通用检查项
			List<Dto> addList=new ArrayList();
			List<Dto> baseInfos=g4Reader.queryForList("getBasQCInfo");
			for (Object obj : list) {
				Dto dto = (Dto) obj;
				for (int i = 0; i < baseInfos.size(); i++) {
					Dto baseInfo=baseInfos.get(i);
					Dto baseItem=new BaseDto();
					baseItem.put("qc_position", dto.getAsString("qc_position"));
					baseItem.put("class", dto.getAsString("class"));
					baseItem.put("qc_item", baseInfo.getAsString("name"));
					addList.add(baseItem);
				}
			}
			HashSet<Dto> hs = new HashSet<Dto>(addList);
			addList=new ArrayList<Dto>(hs);
			list.addAll(addList);
			//单元格目录,保存样式，位置，检查项，所属检查项
			String catalog = "class,qc_position,qc_item,parent_no";
			for (Object obj : list) {
				Dto dto = (Dto) obj;
				//检查项dto
				Dto qcItemDto= new BaseDto();
				qcItemDto.put("opr_date", G4Utils.getCurrentTime("yyyy-MM-dd"));
				qcItemDto.put("opr_id", opr_id);
				String[] catalogs = catalog.split(",");
				//保存单元格的基本信息
				for (int i = 0; i < catalogs.length; i++) {
					//去除空格
					dto.put(catalogs[i], dto.getAsString(catalogs[i]).replace(" ",""));
					//跳过空单元格
					if (("").equals(dto.getAsString(catalogs[i]))) {
						continue;
					}
					Dto pdto = new BaseDto();
					pdto.put("opr_date", G4Utils.getCurrentTime("yyyy-MM-dd"));
					pdto.put("opr_id", opr_id);
					pdto.put("name", dto.getAsString(catalogs[i]));
					//qc基本信息的序号
					String max_seq_no = (String) g4Reader.queryForObject("selectMaxSeqFromQCBaseInfo");
					Integer in_seq_no=max_seq_no==null?1:(Integer.parseInt(max_seq_no) + 1);
					//增加基本信息
					switch (i) {
					case 0:
						dto.put("flag", 3);
						break;
					case 1:
						dto.put("flag", 1);
						break;
					case 2:
						dto.put("flag", 2);
						break;
					case 3:
						dto.put("flag", 2);
						break;
					}
					dto.put("name", dto.getAsString(catalogs[i]));
					//重复行验证 
					Dto infoDto=manageQCService.getQCInfoByDto(dto);
					//有相同名字和标识的信息,检查项对应位置存入已有的序号
					if(infoDto!=null){
						qcItemDto.put(catalogs[i], infoDto.getAsString("seq_no"));
						continue;
					}else{
						pdto.put("flag", dto.getAsString("flag"));
						pdto.put("name", dto.getAsString(catalogs[i]));
						pdto.put("short_name", dto.getAsString(catalogs[i]));
						qcItemDto.put(catalogs[i],in_seq_no);
					}
					pdto.put("seq_no", in_seq_no);
					//保存qc基本信息单元格信息
					manageQCService.saveQCprocess(pdto);
				}
				//检查是否有父级
				//已经存在父级，获得父级的序号，保存
				//没有父级，或是父级单元格不为空，保存父级信息
				Dto parentQCItem= manageQCService.getPItemByDto(qcItemDto);
				if (parentQCItem!=null||qcItemDto.getAsString("parent_no").equals("")) {
					qcItemDto.put("parent_no", parentQCItem==null?"":parentQCItem.getAsString("seq_no"));
				}else{
					//保存父级信息
					Dto parentItem=new BaseDto();
					parentItem.put("class", qcItemDto.getAsString("class"));
					parentItem.put("qc_item",qcItemDto.getAsString("parent_no"));
					parentItem.put("qc_position",qcItemDto.getAsString("qc_position"));
					parentItem.put("opr_date",qcItemDto.getAsString("opr_date"));
					parentItem.put("opr_time",qcItemDto.getAsString("opr_time"));
					parentItem.put("opr_id",qcItemDto.getAsString("opr_id"));
					parentItem.remove("parent_no");
					manageQCService.saveQCItem(parentItem);
					String parentSeq=(String)g4Reader.queryForObject("selectMaxSeqFromQCItem");
					qcItemDto.put("parent_no", parentSeq);
				}
				//检查有无重复项，条件class, postion,item, parent_item
				int checknum=(Integer)g4Reader.queryForObject("checkQCItemByDto",qcItemDto);
				if (checknum>0) {
					continue;
				}
				//保存检查项信息
				manageQCService.saveQCItem(qcItemDto);
			}
			outDto.put("success", true);
			outDto.put("msg", "信息导入成功"+sb.toString() );
			String jsonString = JsonHelper.encodeObject2Json(outDto);
			super.write(jsonString, response);
		} catch (Exception e) {
			e.printStackTrace();
			outDto.put("success", new Boolean(false));
			outDto.put("msg", "信息导入失败，" + e.getMessage());
			String jsonString = JsonHelper.encodeObject2Json(outDto);
			super.write(jsonString, response);
		}
		return mapping.findForward(null);
	}
	
	/**
	 * 查询QC位置信息
	 * 查询系统中所有的QC位置信息
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward queryQCPositionInfo(ActionMapping mapping, ActionForm form, 
	        HttpServletRequest request,HttpServletResponse response) throws Exception {
	    Dto outDto;
	    try{
	        List<Dto>  qcPositions = g4Reader.queryForList("queryQCPosition");
	        String qpsStr = JsonHelper.encodeObject2Json(qcPositions);
	        
	        outDto = new BaseDto();
	        outDto.put("success", true);
	        outDto.put("qcPositions", qpsStr);
	    }catch(Exception e){
            e.printStackTrace();
            outDto = new BaseDto();
            outDto.put("success", false);
            outDto.put("msg", "查询QC位置异常");
	    }
	    String resultStr = JsonHelper.encodeObject2Json(outDto);
	    super.write(resultStr, response);
	    return mapping.findForward(null);
	}
	
	/**
	 * 查询样式信息
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward queryClassInfo(ActionMapping mapping, ActionForm form, 
            HttpServletRequest request,HttpServletResponse response) throws Exception {
        Dto outDto;
        try{
            CommonActionForm cForm = (CommonActionForm)form;
            Dto inDto = cForm.getParamAsDto(request);
            
            List<Dto>  qcClass = g4Reader.queryForList("queryClass4QcPosition",inDto);
            String qpsStr = JsonHelper.encodeObject2Json(qcClass);
            
            outDto = new BaseDto();
            outDto.put("success", true);
            outDto.put("qcClass", qpsStr);
        }catch(Exception e){
            e.printStackTrace();
            outDto = new BaseDto();
            outDto.put("success", false);
            outDto.put("msg", "查询QC位置异常");
        }
        String resultStr = JsonHelper.encodeObject2Json(outDto);
        super.write(resultStr, response);
        return mapping.findForward(null);
    }
	
	/**
	 * 查询QC检查项 
	 * <br/>传入样式和QC位置信息
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward queryQCItemInfo(ActionMapping mapping, ActionForm form, 
            HttpServletRequest request,HttpServletResponse response) throws Exception {
        Dto outDto;
        try{
            CommonActionForm cForm = (CommonActionForm)form;
            Dto inDto = cForm.getParamAsDto(request);
            
            // 组装订单查询
            String ords = inDto.getAsString("ords");
            String[] ordStr = ords.split(",");
            StringBuffer ordDBStr = new StringBuffer(100);
            for(String str : ordStr){
                str.replaceAll("'", "''");
                ordDBStr.append(",'").append(str).append("'");
            }
            // 如果有数据删除第一个逗号
            if (ordDBStr.length() > 0) {
                ordDBStr.deleteCharAt(0);
            }
            Dto dbDto = new BaseDto();
            dbDto.put("ords", ordDBStr.toString());
            
            // 查询 是否是同一批次的数据
            int ordLenght = ordStr.length;
            List<Dto> batchNoList = g4Reader.queryForList("queryBatchNo4order", dbDto);
            int batchNo = -1;
            for(Dto dto : batchNoList){
                if(dto.getAsInteger("num") == ordLenght){
                    batchNo = dto.getAsInteger("batch_no"); // 保存符合条件的批次号
                    break;
                }
            }
            
            inDto.put("batch_no", batchNo);
            
            List<Dto>  qcItem = g4Reader.queryForList("queryItem4QCPosition",inDto);
            String qpsStr = JsonHelper.encodeObject2Json(qcItem);
            
            outDto = new BaseDto();
            outDto.put("success", true);
            outDto.put("qcItem", qpsStr);
        }catch(Exception e){
            e.printStackTrace();
            outDto = new BaseDto();
            outDto.put("success", false);
            outDto.put("msg", "查询QC位置异常");
        }
        String resultStr = JsonHelper.encodeObject2Json(outDto);
        super.write(resultStr, response);
        return mapping.findForward(null);
    }
	
	/**
	 * 保存QC数量信息
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward saveQCNumInfo(ActionMapping mapping, ActionForm form, 
            HttpServletRequest request,HttpServletResponse response) throws Exception {
        Dto outDto;
        try{
            CommonActionForm cForm = (CommonActionForm)form;
            Dto inDto = cForm.getParamAsDto(request);
            // 添加操作日期，操作人员
            UserInfoVo userInfo = super.getSessionContainer(request).getUserInfo();
            String opr_id = userInfo.getAccount();
            String opr_date = TimeUtil.getCurrentDate("yyyy-MM-dd hh:mm:ss");
            inDto.put("opr_id", opr_id);
            inDto.put("opr_date", opr_date);
            
            manageQCService.saveQCNumInfo(inDto);
            
            outDto = new BaseDto();
            outDto.put("success", true);
            outDto.put("msg", "保存成功");
        }catch(Exception e){
            e.printStackTrace();
            outDto = new BaseDto();
            outDto.put("success", false);
            outDto.put("msg", "保存QC数量信息异常");
        }
        String resultStr = JsonHelper.encodeObject2Json(outDto);
        super.write(resultStr, response);
        return mapping.findForward(null);
    }
	/**
	 * 删除检查项
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	
	public ActionForward deleteQCItem(ActionMapping mapping, ActionForm form, 
            HttpServletRequest request,HttpServletResponse response) throws Exception {
		Dto outDto;
		try {
			 CommonActionForm cForm = (CommonActionForm)form;
	         Dto inDto = cForm.getParamAsDto(request);
	         manageQCService.deleteQCprocess(inDto);
	         outDto = new BaseDto();
	         outDto.put("success", true);
	         outDto.put("msg", "删除成功");
	         String jsonString = JsonHelper.encodeObject2Json(outDto);
	         response.getWriter().write(jsonString);
		} catch (Exception e) {
			e.printStackTrace();
            outDto = new BaseDto();
            outDto.put("success", false);
            outDto.put("msg", "删除QC信息失败");
            String jsonString = JsonHelper.encodeObject2Json(outDto);
	        response.getWriter().write(jsonString);
		}
		return mapping.findForward(null);
	}
	
	/**
	 * 删除qc记录
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	
	public ActionForward deleteQCNumInfo(ActionMapping mapping, ActionForm form, 
            HttpServletRequest request,HttpServletResponse response) throws Exception {
		Dto outDto;
		try {
			 CommonActionForm cForm = (CommonActionForm)form;
	         Dto inDto = cForm.getParamAsDto(request);
	         manageQCService.deleteQCNumInfo(inDto);
	         outDto = new BaseDto();
	         outDto.put("success", true);
	         outDto.put("msg", "删除成功");
	         String jsonString = JsonHelper.encodeObject2Json(outDto);
	         response.getWriter().write(jsonString);
		} catch (Exception e) {
			e.printStackTrace();
            outDto = new BaseDto();
            outDto.put("success", false);
            outDto.put("msg", "删除QC信息异常");
            String jsonString = JsonHelper.encodeObject2Json(outDto);
	        response.getWriter().write(jsonString);
		}
		return mapping.findForward(null);
	}
	/**
	 * 导出qc流水记录
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	
	public ActionForward exportQCSche(ActionMapping mapping, ActionForm form, 
            HttpServletRequest request,HttpServletResponse response) throws Exception {
		Dto parametersDto = new BaseDto();
		try {
			CommonActionForm cForm = (CommonActionForm)form;
	        Dto inDto = cForm.getParamAsDto(request);
			List list = g4Reader.queryForPage("queryQCScheList", inDto);
	        Dto itemDto;
	        Dto parentDto;
	        for (int i = 0; i < list.size(); i++) {
				itemDto=(BaseDto)list.get(i);
				parentDto=(Dto)g4Reader.queryForObject("getParentQCItemBySeq", itemDto);
				if (parentDto!=null) {
					itemDto.put("leaf", new Boolean(true));
					itemDto.put("parent_name", parentDto.getAsString("name"));
				}else{
					itemDto.put("leaf", new Boolean(false));
				}
			}
	        ExcelExporter excelExporter = new ExcelExporter();
			 parametersDto.put("reportTitle", "QC流水记录");
			 excelExporter.setTemplatePath("report/excel/QCSche.xls");
			 excelExporter.setFilename("QC流水记录.xls");
			 excelExporter.setData(parametersDto, list);
			 excelExporter.export(request, response);
			 return mapping.findForward(null);
		} catch (Exception e) {
			e.printStackTrace();
			 List list = new ArrayList();
			 String resultStr = JsonHelper.encodeList2PageJson(list, 0, null);
			 super.write(resultStr, response);
			 return mapping.findForward(null);
		}
	}
	
	/**
	 * 根据订单号获得qc饼图
	 * 获取一个po的一个样式下所有位置的qc数量信息
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward getQCSchePie(ActionMapping mapping, ActionForm form, 
            HttpServletRequest request,HttpServletResponse response) throws Exception {
		Dto outDto = new BaseDto();
		try {
			CommonActionForm cForm = (CommonActionForm)form;
	        Dto inDto = cForm.getParamAsDto(request);
	        outDto=manageQCService.getQCPieByOrderId(inDto);
	        outDto.put("success", true);
	        String jsonString = JsonHelper.encodeObject2Json(outDto);
	        response.getWriter().write(jsonString);
		}catch(Exception e){
			e.printStackTrace();
			super.write(e.toString(), response);
			outDto.put("success", false);
	        String jsonString = JsonHelper.encodeObject2Json(outDto);
	        response.getWriter().write(jsonString);
		}
		return mapping.findForward(null);
	}
}
