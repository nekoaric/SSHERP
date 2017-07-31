package org.eredlab.g4.arm.web;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.arm.service.OrganizationService;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import com.cnnct.common.ApplicationException;
import com.cnnct.util.BusiConst;

/**
 * 组织机构模型
 * 
 * @author XiongChun
 * @since 2010-04-10
 * @see BaseAction
 */
@SuppressWarnings({ "unchecked" })
public class OrganizationAction extends BaseAction {
    
    Log log = LogFactory.getLog(OrganizationAction.class);
	
	private OrganizationService organizationService = (OrganizationService) super.getService("organizationService");
	
	/**
	 * 部门管理页面初始化
	 * 
	 * @param
	 * @return
	 */
	public ActionForward departmentInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		super.removeSessionAttribute(request, "deptid");
		Dto inDto = new BaseDto();
		String deptid = super.getSessionContainer(request).getUserInfo().getDeptid();
		inDto.put("deptid", deptid);
		
		Dto outDto = organizationService.queryDeptinfoByDeptid(inDto);
		request.setAttribute("rootDeptid", outDto.getAsString("deptid"));
		request.setAttribute("rootDeptname", outDto.getAsString("deptname"));
		return mapping.findForward("manageDepartmentView");
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
		dto.put("parentid", nodeid);
		
		// 查询状态为正常的部门
		dto.put("deptstate", BusiConst.DEPT_STATE_NORMAL);
		Dto outDto = organizationService.queryDeptItems(dto);
		response.getWriter().write(outDto.getAsString("jsonString"));
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
		String deptid = request.getParameter("deptid");
		/*if (G4Utils.isNotEmpty(deptid)) {
			super.setSessionAttribute(request, "deptid", deptid);
		}
		if(!G4Utils.isEmpty(request.getParameter("firstload"))){
			dto.put("deptid", super.getSessionContainer(request).getUserInfo().getDeptid());
		}else{
			dto.put("deptid", super.getSessionAttribute(request, "deptid"));
		}*/	
		dto.put("deptid", deptid);
		Dto outDto = organizationService.queryDeptsForManage(dto);
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
	        inDto.put("userid", userid);

            inDto.put("oprUserInfo",getSessionContainer(request).getUserInfo());//操作人员信息
	        outDto = organizationService.saveDeptItem(inDto);
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
	        outDto = organizationService.updateDeptItem(inDto);
	        String jsonString = JsonHelper.encodeObject2Json(outDto);
	        response.getWriter().write(jsonString);
        }  catch (ApplicationException e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            //outDto.put("msg", "人员信息导入失败，" + e.getMessage());
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }catch (Exception e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            //outDto.put("msg", "人员信息导入失败，" + e.getMessage());
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }
		
		return mapping.findForward(null);
	}
	
	/**
	 * 删除部门项
	 * 
	 * @param
	 * @return
	 */
	public synchronized ActionForward deleteDeptItems(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
	    Dto outDto = new BaseDto();
	    try {
	        String strChecked = request.getParameter("strChecked");
	        String type = request.getParameter("type");
	        String deptid = request.getParameter("deptid");
	        Dto inDto = new BaseDto();
	        inDto.put("strChecked", strChecked);
	        inDto.put("type", type);
	        inDto.put("deptid", deptid);
	        outDto = organizationService.deleteDeptItems(inDto);
	        String jsonString = JsonHelper.encodeObject2Json(outDto);
	        response.getWriter().write(jsonString);
        } catch (ApplicationException e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            //outDto.put("msg", "人员信息导入失败，" + e.getMessage());
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            response.getWriter().write(jsonString);
        }catch (Exception e) {
            log.info(e.getMessage());
            outDto.put("success", new Boolean(false));
            //outDto.put("msg", "人员信息导入失败，" + e.getMessage());
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
        Dto dto = new BaseDto();
        String deptid = request.getParameter("deptid");
        dto.put("deptid", deptid);
        String grp_id = getSessionContainer(request).getUserInfo().getGrpId();
        dto.put("grp_id", grp_id);
        Integer cnt = (Integer) g4Reader.queryForObject("getUserCntInDept", dto);
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
        String deptid = request.getParameter("deptid");
        dto.put("deptid", deptid);
        String grp_id = getSessionContainer(request).getUserInfo().getGrpId();
        dto.put("grp_id", grp_id);
        Integer cnt = (Integer) g4Reader.queryForObject("getSubDeptCntInDept", dto);
        String jsonStr = "[{cnt:" + cnt + "}]"; // 如果没有id，格式为[{name : value}]，有id则为:{id:[{name,value}]}
        response.getWriter().write(jsonStr);
        return mapping.findForward(null);
    }
	
	/**
	 * 根据用户所属部门编号查询部门对象<br>
	 * 用于构造组织机构树的根节点
	 * @param
	 * @return
	 */
	public ActionForward queryDeptinfoByDeptid(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto inDto = new BaseDto();
		String deptid = super.getSessionContainer(request).getUserInfo().getDeptid();
		inDto.put("deptid", deptid);
		Dto outDto = organizationService.queryDeptinfoByDeptid(inDto);
		String jsonString = JsonHelper.encodeObject2Json(outDto);
		response.getWriter().write(jsonString);
		return mapping.findForward(null);
	}
	
	/**
	 * 查询区域信息
	 * 
	 * @param
	 * @return
	 */
	public ActionForward queryAreaInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		Dto inDto = new BaseDto();
		inDto.put("field", "AREA_NAME");
		List list  = g4Reader.queryForList("queryAreaInfo",inDto);
		String jsonString = JsonHelper.encodeObject2Json(list);
		response.getWriter().write(jsonString);
		return mapping.findForward(null);
	}
}
