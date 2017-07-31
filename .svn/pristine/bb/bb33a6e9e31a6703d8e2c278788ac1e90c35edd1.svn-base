package com.cnnct.sys.web;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.cnnct.util.ArmConstants;
import com.cnnct.util.BusiConst;
import com.cnnct.util.DataPermUtil;
import com.cnnct.util.G4Utils;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
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

import com.cnnct.common.ApplicationException;
import com.cnnct.sys.service.SysDeptInfoService;
import com.cnnct.sys.vo.UserInfoVo;

/**
 * *********************************************
 * 创建日期: 2013-02-28
 * 创建作者：may
 * 功能：部门信息管�?
 * 最后修改时间：
 * 修改记录�?
 * ***********************************************
 */
@SuppressWarnings({ "unchecked" })
public class SysDeptInfoAction extends BaseAction {
    
    Log log = LogFactory.getLog(SysDeptInfoAction.class);
	
	private SysDeptInfoService sysDeptService = (SysDeptInfoService) super.getService("sysDeptInfoService");
	
	/**
	 * 查询所有的数量性质的数据
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward queryNatures4dept(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		//查询所有此部门的数量性质 
		CommonActionForm cform = (CommonActionForm)form;
		Dto inDto = cform.getParamAsDto(request);
		String parent_id = inDto.getAsString("node");
		List<Dto> resultList = g4Reader.queryForList("queryNatures4dept",inDto);
		for(Dto dto : resultList){
			String isChecked = dto.getAsString("checked");
			
			dto.put("parent_id",parent_id);
			dto.put("text", dto.getAsString("code_desc"));
			dto.put("id", dto.getAsString("code"));
			dto.put("leaf", true);
			dto.put("checked", isChecked.equals("1")?true:false);
		}
		String resultStr = JsonHelper.encodeObject2Json(resultList);
		super.write(resultStr, response);
		return mapping.findForward(null);
	}
	
	/**
	 * 保存部门绑定的数量性质
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward saveNatures4dept(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		Dto outDto = new BaseDto();
		try{
			CommonActionForm cform = (CommonActionForm)form;
			Dto inDto = cform.getParamAsDto(request);
			String opr_id = super.getSessionContainer(request).getUserInfo().getAccount();
			inDto.put("opr_id",opr_id);
			outDto = sysDeptService.saveDeptNatures(inDto);
		}catch(Exception e){
			e.printStackTrace();
			outDto = new BaseDto();
			outDto.put("success", false);
			outDto.put("msg", "出现未知操作结果");
		}
		String resultStr = JsonHelper.encodeObject2Json(outDto);
		super.write(resultStr, response);
		return mapping.findForward(null);
	}
	
	/**
	 * 部门管理页面初始�?
	 * 
	 * @param
	 * @return
	 */
	public ActionForward sysDeptInfoInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		super.removeSessionAttribute(request, "dept_id");
		Dto inDto = new BaseDto();
		String deptid = super.getSessionContainer(request).getUserInfo().getDeptid();
		inDto.put("dept_id", deptid);

		Dto outDto = sysDeptService.queryDeptinfoByDeptid(inDto);
		request.setAttribute("root_dept_id", outDto.getAsString("dept_id"));
		request.setAttribute("root_dept_name", outDto.getAsString("dept_name"));
		return mapping.findForward("sysDeptInfoView");
	}
	
	/**
	 * 部门管理树初始化
	 * 
	 * @param
	 * @return
	 */
	public ActionForward departmentTreeInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		Dto dto = new BaseDto(request);
		String nodeid = request.getParameter("node");
		dto.put("parent_id", nodeid);
		// 查询状态为正常的部�?
		dto.put("dept_state", BusiConst.DEPT_STATE_NORMAL);
		Dto outDto = sysDeptService.queryDeptItems(dto);
		response.getWriter().write(outDto.getAsString("jsonString"));
		return mapping.findForward(null);
	}
	
	/**
     * 部门管理树查询
     * 带有选择框
     * @param
     * @return
     */
    public ActionForward departmentTreeInitWithChecked(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Dto dto = new BaseDto(request);
        String nodeid = request.getParameter("node");
        dto.put("parent_id", nodeid);
        // 查询状态为正常的部�?
        dto.put("dept_state", BusiConst.DEPT_STATE_NORMAL);

        List deptList = g4Reader.queryForList("querySysDeptItemsByDto", dto);
        Dto deptDto;
        for (int i = 0; i < deptList.size(); i++) {
            deptDto = (BaseDto) deptList.get(i);
            deptDto.put("checked", false);
            if (deptDto.getAsString("leaf").equals(ArmConstants.LEAF_Y)) {
                deptDto.put("leaf", new Boolean(true));
            } else {
                deptDto.put("leaf", new Boolean(false));
            }
            if (deptDto.getAsString("id").length() == 8) {
                deptDto.put("expanded", new Boolean(true));
            }
            deptDto.put("iconCls", "folder_userIcon");
        }
        
        String resultStr = JsonHelper.encodeObject2Json(deptList);
        response.getWriter().write(resultStr);
        return mapping.findForward(null);
    }
	
	/**
	 * 查询部门列表信息
	 * 
	 * @param
	 * @return
	 */
	
	public ActionForward queryDeptsForManage(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm)form;
		Dto dto = aForm.getParamAsDto(request);
		 super.setSessionAttribute(request, "QUERYDEPT_DTO", dto);
		Dto outDto = sysDeptService.queryDeptsForManage(dto);
		response.getWriter().write(outDto.getAsString("jsonString"));
		return mapping.findForward(null);
	}
	
	/**
	 * 保存部门
	 * 
	 * @param
	 * @return
	 */
	public synchronized ActionForward saveDeptItem(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
	    Dto outDto = new BaseDto();
	    try {
	        CommonActionForm aForm = (CommonActionForm) form;
	        Dto inDto = aForm.getParamAsDto(request);
	        String grp_id = getSessionContainer(request).getUserInfo().getGrpId();
	        String userid = getSessionContainer(request).getUserInfo().getUserid();
	        inDto.put("grp_id", grp_id);
	        inDto.put("user_id", userid);
	        inDto.put("opr_date", G4Utils.getCurDate());
	        inDto.put("opr_id", userid);

	        outDto = sysDeptService.saveDeptItem(inDto);
	        String jsonString = JsonHelper.encodeObject2Json(outDto);
	        response.getWriter().write(jsonString);
        } catch (ApplicationException e) {
            log.info(e.getMessage());
            outDto.put("msg", "部门数据新增失败");
            outDto.put("success", new Boolean(false));
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }catch (Exception e) {
            log.info(e.getMessage());
            outDto.put("msg", "部门数据新增失败");
            outDto.put("success", new Boolean(false));
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }
		return mapping.findForward(null);
	}
	
	/**
	 * 修改部门
	 * 
	 * @param
	 * @return
	 */
	public synchronized ActionForward updateDeptItem(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
	    Dto outDto = new BaseDto();
	    try {
	        CommonActionForm aForm = (CommonActionForm) form;
	        Dto inDto = aForm.getParamAsDto(request);
	        String grp_id = getSessionContainer(request).getUserInfo().getGrpId();
            inDto.put("grp_id", grp_id);
            inDto.put("oprUserInfo",getSessionContainer(request).getUserInfo());//操作人员信息
	        outDto = sysDeptService.updateDeptItem(inDto);
	        String jsonString = JsonHelper.encodeObject2Json(outDto);
	        response.getWriter().write(jsonString);
        }  catch (ApplicationException e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }catch (Exception e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }
		
		return mapping.findForward(null);
	}
	
	/**
	 * 删除部门�?
	 * 
	 * @param
	 * @return
	 */
	public ActionForward deleteDeptItems(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
	    Dto outDto = new BaseDto();
        CommonActionForm aform = (CommonActionForm)form;
        Dto inDto = aform.getParamAsDto(request);
	    try {
	        outDto = sysDeptService.deleteDeptItems(inDto);
	        String jsonString = JsonHelper.encodeObject2Json(outDto);
	        response.getWriter().write(jsonString);
        } catch (ApplicationException e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }catch (Exception e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }
		
		return mapping.findForward(null);
	}
	
	/**
     * 查询部门下用户总数
     * 
     * @param
     * @return
     */
    public ActionForward getUserCntInDept(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
    	System.out.println("----------查询部门下用户总数-------------");
        Dto dto = new BaseDto();
        String deptid = request.getParameter("dept_id");
        dto.put("dept_id", deptid);
        String grp_id = getSessionContainer(request).getUserInfo().getGrpId();
        dto.put("grp_id", grp_id);
        Integer cnt = (Integer) g4Reader.queryForObject("getSysUserCntInDept", dto);
        String jsonStr = "[{cnt:" + cnt + "}]"; // 如果没有id，格式为[{name : value}]，有id则为:{id:[{name,value}]}
        response.getWriter().write(jsonStr);
        return mapping.findForward(null);
    }
    /**
     * 查询部门下子部门总数
     * 
     * @param
     * @return
     */
    public ActionForward getSubDeptCntInDept(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Dto dto = new BaseDto();
        String deptid = request.getParameter("dept_id");
        dto.put("dept_id", deptid);
        String grp_id = getSessionContainer(request).getUserInfo().getGrpId();
        dto.put("grp_id", grp_id);
        Integer cnt = (Integer) g4Reader.queryForObject("getSysSubDeptCntInDept", dto);
        String jsonStr = "[{cnt:" + cnt + "}]"; // 如果没有id，格式为[{name : value}]，有id则为:{id:[{name,value}]}
        response.getWriter().write(jsonStr);
        return mapping.findForward(null);
    }
	
	/**
	 * 根据用户所属部门编号查询部门对�?br>
	 * 用于构造组织机构树的根节点
	 * @param
	 * @return
	 */
	public ActionForward queryDeptinfoByDeptid(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto inDto = new BaseDto();
		String deptid = super.getSessionContainer(request).getUserInfo().getDeptid();
		inDto.put("dept_id", deptid);
		Dto outDto = sysDeptService.queryDeptinfoByDeptid(inDto);
		String jsonString = JsonHelper.encodeObject2Json(outDto);
		response.getWriter().write(jsonString);
		return mapping.findForward(null);
	}
	
	  /**
     * 部门信息导入
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward importDeptInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        CommonActionForm actionForm = (CommonActionForm) form;
        UserInfoVo user = super.getSessionContainer(request).getUserInfo();
        Dto outDto = new BaseDto();
        try {
            FormFile theFile = actionForm.getTheFile();

            String metaData = "dept_name,parent_name,address,lnk_name,lnk_telno,remark";
            ExcelReader excelReader = new ExcelReader(metaData, theFile.getInputStream());
            List list = excelReader.read(0, 0);
            if (list.size() > 0) {
                Dto impList = (Dto) list.get(0);
                if (impList.size() != metaData.trim().split(",").length) {
                    throw new ApplicationException("Excel文件格式有误,请对照下载的模版文件的格式填写文");
                }
            } else {
                throw new ApplicationException("Excel文件格式有误,请对照下载的模版文件的格式填写文");
            }

            list.remove(0);//去除第一列的信息
            Dto dto = new BaseDto();
            dto.put("grp_id", user.getGrpId());

            List deptNamesList = g4Reader.queryForList("queryDept4Import",dto);
            for (Integer i =0;i<list.size();i++) {
                Dto deptDto = (BaseDto) list.get(i);
                deptDto.put("opr_date", G4Utils.getCurDate());
                deptDto.put("opr_id", user.getUserid());//登记人员
                deptDto.put("grp_id", user.getGrpId());

                //查找父部门信�?
                for(Object o:deptNamesList){
                    Dto deptNamesDto = (Dto)o;
                    if(deptNamesDto.getAsString("deptnames").equals(deptDto.getAsString("parent_name"))){
                        deptDto.put("parent_id",deptNamesDto.getAsString("dept_id"));
                        break;
                    }
                }

                if("".equals(deptDto.getAsString("parent_id"))){
                    throw new ApplicationException("第"+(i+2)+"行上级部门格式错误?请检查部门的信息,逗号为英文半角逗号!");
                }

            }
            outDto=sysDeptService.importDeptInfo(list);
            super.write(outDto.toJson(), response);
        } catch (ApplicationException e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "部门信息导入失败" + e.getMessage());
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        } catch (Exception e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            outDto.put("msg", "部门信息导入失败" + e.getMessage());
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }

        return mapping.findForward(null);
    }
  //导出部门信息
  	public ActionForward excleDeptInfoAction(ActionMapping mapping,
  			ActionForm form, HttpServletRequest request,
  			HttpServletResponse response) throws Exception {
  		Dto parametersDto = new BaseDto();
  		Dto devDto = new BaseDto();
  		Dto inDto = (BaseDto)super.getSessionAttribute(request, "QUERYDEPT_DTO");
  		parametersDto.put("reportTitle", "部门信息"); // parameter
  		inDto.remove("queryForPageCountFlag");
  		List list = g4Reader.queryForList("querySysDeptsForManage", inDto);
  		ExcelExporter excelExporter = new ExcelExporter();
  		excelExporter.setTemplatePath("/report/excel/sysDeptInfo.xls");
  		excelExporter.setData(parametersDto, list);
  		excelExporter.setFilename("部门信息表" + ".xls");
  		excelExporter.export(request, response);
  		return mapping.findForward(null);
  	}
}
