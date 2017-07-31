package com.cnnct.sys.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.upload.FormFile;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.report.excel.ExcelReader;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;
import org.springframework.aop.ThrowsAdvice;

import com.cnnct.common.ApplicationException;
import com.cnnct.sys.service.ManageTeamService;
import com.cnnct.sys.vo.UserInfoVo;
import com.cnnct.util.BusiConst;
import com.cnnct.util.G4Utils;

/******************************************
 * 创建日期：2013-9-2
 * 创建作者：zhouww
 * 功能：班组管理
 * 最后修改时间：
 * 修改内容：
 ******************************************/
@SuppressWarnings("unchecked")
public class ManageTeamAction extends BaseAction {
	private ManageTeamService manageTeamService = (ManageTeamService) super.getService("manageTeamService");

	/***
	 * 考勤群组初始化页面
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward manageTeamInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
	        throws Exception {
		Dto dto = new BaseDto();
		String deptid = super.getSessionContainer(request).getUserInfo().getDeptid();
		
		dto.put("deptid", deptid.substring(0, 8));
		
		Dto parentDto = (Dto) g4Reader.queryForObject("getParentDeptInfo", dto);
		
		request.setAttribute("deptid", parentDto.getAsString("dept_id"));
		request.setAttribute("deptname", parentDto.getAsString("dept_name"));

		return mapping.findForward("mangeTeamView");
	}

	/**
	 * 班组树初始化
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward teamGrpListTreeInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
	        throws Exception {
		Dto dto = new BaseDto(request);
		String node = request.getParameter("node");
		
		List deptList = new ArrayList();
		
		UserInfoVo user = super.getSessionContainer(request).getUserInfo();
		
		if (node.indexOf("root") != -1) {
			dto.put("deptid", node.replace("root", ""));

			// 查询状态为正常的部门
			dto.put("deptstate", BusiConst.DEPT_STATE_NORMAL);
			deptList = g4Reader.queryForList("getDeptInfo4TeamGrp", dto);
			for (int i = 0; i < deptList.size(); i++) {
				Dto deptDto = (BaseDto) deptList.get(i);
				if (deptDto.getAsInteger("leaf") == 0) {
					deptDto.put("leaf", new Boolean(false));
					deptDto.put("id", "root" + deptDto.getAsString("id"));
				} else {
					if (deptDto.getAsInteger("num") != null) {
						deptDto.put("leaf", new Boolean(false));
					} else {
						deptDto.put("leaf", new Boolean(true));
					}
					deptDto.put("id", "dept" + deptDto.getAsString("id"));
				}
				deptDto.put("iconCls", "folder_userIcon");
				deptDto.put("expanded", new Boolean(false));
			}
		} else if (node.indexOf("dept") != -1) {
			dto.put("deptid", node.replace("dept", ""));
			// 查询状态为正常的部门
			dto.put("deptstate", BusiConst.DEPT_STATE_NORMAL);
			deptList = g4Reader.queryForList("getGrpInfo4TeamGrp", dto);
			
			for (int i = 0; i < deptList.size(); i++) {
				Dto deptDto = (BaseDto) deptList.get(i);
				deptDto.put("leaf", new Boolean(true));
				deptDto.put("iconCls", "folder_userIcon");
				deptDto.put("expanded", new Boolean(false));
			}
			
			if(deptList.size()>0){
				Dto grpDto = new BaseDto();
				grpDto.put("id", "leav" + node.replace("dept", ""));
				Integer num = (Integer) g4Reader.queryForObject("queryRemainUserCount4TeamGrp", dto);
				grpDto.put("text", "未分配人员(" + (num == null ? 0 : num) + ")");
				grpDto.put("leaf", new Boolean(true));
				deptList.add(grpDto);
			}
		}
		String jsonString = JsonHelper.encodeObject2Json(deptList);
		super.write(jsonString, response);

		return mapping.findForward(null);
	}

	/**
	 * 保存班组信息
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward saveTeamGrpInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
	        throws Exception {
		Dto outDto = new BaseDto();
		try {
			CommonActionForm aform = (CommonActionForm) form;
			Dto dto = aform.getParamAsDto(request);

			UserInfoVo user = getSessionContainer(request).getUserInfo();
			dto.put("grp_id", user.getGrpId());
			dto.put("opr_id", user.getAccount());
			dto.put("state", "0");// 状态 0-正常 1-取消
			dto.put("type", "2");

			// dto.put("opn_date", G4Utils.getCurDate());
			outDto = manageTeamService.saveTeamGrpInfo(dto);

			String jsonString = JsonHelper.encodeObject2Json(outDto);
			super.write(jsonString, response);
		} catch (ApplicationException e) {
			outDto.put("msg", "班组数据新增失败");
			outDto.put("success", new Boolean(false));
			String jsonString = JsonHelper.encodeObject2Json(outDto);
			response.getWriter().write(jsonString);
		} catch (Exception e) {
			outDto.put("msg", "班组数据新增失败");
			outDto.put("success", new Boolean(false));
			String jsonString = JsonHelper.encodeObject2Json(outDto);
			response.getWriter().write(jsonString);
		}
		return mapping.findForward(null);
	}

	/**
	 * 删除班组信息
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward delTeamGrpInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
	        throws Exception {
		Dto outDto = new BaseDto();
		try {
			Dto dto = new BaseDto();
			dto.put("team_grp_no", request.getParameter("team_grp_no"));
			dto.put("grp_id", getSessionContainer(request).getUserInfo().getGrpId());
			// dto.put("cls_date", G4Utils.getCurDate());//设置取消日期
			outDto = manageTeamService.delTeamGrpInfo(dto);

			String jsonString = JsonHelper.encodeObject2Json(outDto);
			super.write(jsonString, response);
		} catch (ApplicationException e) {
			outDto.put("msg", "班组数据删除失败");
			outDto.put("success", new Boolean(false));
			String jsonString = JsonHelper.encodeObject2Json(outDto);
			response.getWriter().write(jsonString);
		} catch (Exception e) {
			outDto.put("msg", "班组数据删除失败");
			outDto.put("success", new Boolean(false));
			String jsonString = JsonHelper.encodeObject2Json(outDto);
			response.getWriter().write(jsonString);
		}
		return mapping.findForward(null);
	}
	/**
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward queryTeamGrpInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
	        throws Exception {
		Dto outDto = new BaseDto();
		Dto dto = new BaseDto();
		String team_grp_no = request.getParameter("team_grp_no");

		dto.put("grp_id", getSessionContainer(request).getUserInfo().getGrpId());
		dto.put("team_grp_no", team_grp_no);
		dto.put("start", 0);
		dto.put("end", 1000);
		List list = g4Reader.queryForPage("queryTeamGrpInfo", dto);

		String jsonString = JsonHelper.encodeList2PageJson(list, 1000, "");
		super.write(jsonString, response);

		return mapping.findForward(null);
	}

	/**
	 * 查询群组详细信息
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward queryTeamGrpList(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
	        throws Exception {
		Dto outDto = new BaseDto();
		CommonActionForm aform = (CommonActionForm) form;
		Dto dto = aform.getParamAsDto(request);
		dto.put("grp_id", getSessionContainer(request).getUserInfo().getGrpId());

		String grp_type = dto.getAsString("grp_type");// dept-部门请求 grps-群组请求 leav-未分配群组请求
		String state = dto.getAsString("state");// 模式

		List teamGrpList = new ArrayList();

		if ("dept".equals(grp_type) ) {// 班组树点击的是部门时
			dto.put("deptid", dto.getAsString("team_grp_no"));
			dto.remove("team_grp_no");
			dto.put("user_type",0);
			teamGrpList = g4Reader.queryForList("queryRemainUserInfo4TeamGrp", dto);
		} else if ("leav".equals(grp_type)) {// 班组树点击的是未分配群组
			dto.put("deptid", dto.getAsString("team_grp_no"));
			dto.remove("team_grp_no");
			dto.put("flag", "remain");
			teamGrpList = g4Reader.queryForList("queryRemainUserInfo4TeamGrp", dto);
		} else if ("grps".equals(grp_type)) {
			if ("add".equals(state)) {
				Dto grpDefDto = (Dto) g4Reader.queryForObject("queryTeamGrpInfo", dto);
				dto.put("parentid", grpDefDto.getAsString("deptid"));
				teamGrpList = g4Reader.queryForList("queryTeamGrpUserList4Add", dto);
			} else {
				teamGrpList = g4Reader.queryForList("queryTeamGrpUserInfo", dto);
			}
		}

		Dto teamGrpDto = new BaseDto();
		for (int i = 0; i < teamGrpList.size(); i++) {
			teamGrpDto = (BaseDto) teamGrpList.get(i);
			if ("del".equals(state) || "add".equals(state)) {
				teamGrpDto.put("checked", false);
			}
			teamGrpDto.put("expanded", new Boolean(true));
			teamGrpDto.put("iconCls", "userIcon");
			teamGrpDto.put("leaf", new Boolean(true));
		}

		String jsonString = JsonHelper.encodeObject2Json(teamGrpList);
		super.write(jsonString, response);
		return mapping.findForward(null);
	}

	/**
	 * 保存班组明细信息
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward saveTeamGrpList(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
	        throws Exception {
		Dto outDto = new BaseDto();
		try {
			CommonActionForm aform = (CommonActionForm) form;
			Dto inDto = aform.getParamAsDto(request);
			UserInfoVo user = getSessionContainer(request).getUserInfo();
			inDto.put("grp_id", user.getGrpId());
			inDto.put("opr_id", user.getAccount());
			inDto.put("state", "0");
			inDto.put("remark", G4Utils.getCurDate());//添加日期

			List list = new ArrayList();
			String[] userInfo = inDto.getAsString("userInfo").split(",");
			for (int i = 0; i < userInfo.length; i++) {
				Dto dto = new BaseDto();
				dto.putAll(inDto);
				if (userInfo[i].indexOf("user") != -1) {
					dto.put("type", "2");
					dto.put("per_id", userInfo[i].substring(4));
				}
				list.add(dto);
			}
            inDto.setDefaultAList(list);

			outDto = manageTeamService.saveTeamGrpList(inDto);

			String jsonString = JsonHelper.encodeObject2Json(outDto);
			super.write(jsonString, response);
		} catch (ApplicationException e) {
			outDto.put("msg", "群组数据新增失败");
			outDto.put("success", new Boolean(false));
			String jsonString = JsonHelper.encodeObject2Json(outDto);
			response.getWriter().write(jsonString);
		} catch (Exception e) {
			outDto.put("msg", "群组数据新增失败");
			outDto.put("success", new Boolean(false));
			String jsonString = JsonHelper.encodeObject2Json(outDto);
			response.getWriter().write(jsonString);
		}
		return mapping.findForward(null);
	}

	/**
	 * 删除群组明细信息
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward delTeamGrpList(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
	        throws Exception {
		Dto outDto = new BaseDto();
		try {
			CommonActionForm aform = (CommonActionForm) form;
			Dto inDto = aform.getParamAsDto(request);
			UserInfoVo user = getSessionContainer(request).getUserInfo();
			inDto.put("grp_id", user.getGrpId());
			inDto.put("state", "1");

			List list = new ArrayList();
			String[] userInfo = inDto.getAsString("userInfo").split(",");
			for (int i = 0; i < userInfo.length; i++) {
				Dto dto = new BaseDto();
				dto.putAll(inDto);
				if (userInfo[i].indexOf("user") != -1) {
					dto.put("per_id", userInfo[i].substring(4));
				}
				list.add(dto);
			}

			outDto = manageTeamService.delTeamGrpList(list);

			String jsonString = JsonHelper.encodeObject2Json(outDto);
			super.write(jsonString, response);
		} catch (ApplicationException e) {
			outDto.put("msg", "班组数据删除失败");
			outDto.put("success", new Boolean(false));
			String jsonString = JsonHelper.encodeObject2Json(outDto);
			response.getWriter().write(jsonString);
		} catch (Exception e) {
			outDto.put("msg", "班组数据删除失败");
			outDto.put("success", new Boolean(false));
			String jsonString = JsonHelper.encodeObject2Json(outDto);
			response.getWriter().write(jsonString);
		}
		return mapping.findForward(null);
	}
	/**
	 * 班组信息导入
	 * @param mapping
	 * @param from
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward importTeamInfo(ActionMapping mapping,ActionForm from,
			HttpServletRequest request,HttpServletResponse response) throws Exception {
		CommonActionForm cForm = (CommonActionForm)from;
		FormFile teamExcel = cForm.getTheFile();
		UserInfoVo user = super.getSessionContainer(request).getUserInfo();
        String opr_id = user.getAccount();
        String opr_date = G4Utils.getCurrentTime("yyyy-MM-dd");
		
		String teamInfo = "grp_name,dept_name,team_name,team_remark";
		ExcelReader excelReader = new ExcelReader(teamInfo, teamExcel.getInputStream());
		List teams = excelReader.read(0, 0);
		if(teams.size()>0) {
			Dto dto = (Dto)teams.get(0);
			if(dto.size()!=teamInfo.split(",").length) {
				throw new ApplicationException("Excel导入格式不正确，请参考模板");
			}
		}
		//过滤工厂部门为空的数据
		int allTeamsSize = teams.size();
		for(int k=teams.size()-1;k>0;k--){
			Dto dto = (Dto)teams.get(k);
			String grp_name = dto.getAsString("grp_name");
			String dept_name = dto.getAsString("dept_name");
			if(grp_name==null ||grp_name=="" ||dept_name==null||dept_name==""){
				teams.remove(dto);
			}
		}
		Dto outDto = new BaseDto();
		try{
			//导入班组信息操作
			Map<String,Map<String,List<Dto>>>  teamsMap = new HashMap<String,Map<String,List<Dto>>>();
			//需要导入班组的信息集合
			List<Dto> teamDtos = new ArrayList<Dto>();
			int teamSize = teams.size();
			String dept_name="";
			String team_name="";
			String grp_name="";
			//已经加
			int maxno = (Integer)g4Reader.queryForObject("queryTeamGrpNo");
			for(int i=1;i<teamSize;i++){
				Dto dto = (Dto)teams.get(i);
				grp_name = dto.getAsString("grp_name");
				dept_name = dto.getAsString("dept_name");
				team_name = dto.getAsString("team_name");
				if(team_name==null||team_name==""){
					throw new ApplicationException("第"+(i+1)+"行数据 班组不能为空");
				}
				if(!teamsMap.containsKey(grp_name)){
					List ls = g4Reader.queryForList("queryTeams4Import", dto);
					if(ls.size()<=0) {
						throw new ApplicationException("第"+(i+1)+"行数据不存在工厂或部门,请核对数据");
					}
					int lsSize = ls.size(); 
					//将一个工厂下的部门 班组添加到teamsMap
					for(int k=0;k<lsSize;k++) {
						Dto checkDto = (Dto)ls.get(k);
						Map<String, List<Dto>> checkDept = teamsMap.get(checkDto.get("grp_name"));
						if(checkDept==null){
							checkDept = new HashMap<String, List<Dto>>();
							List<Dto> checkDtos = checkDept.get(checkDto.get("dept_name"));
							if(checkDtos==null) {
								checkDtos = new ArrayList<Dto>();
								checkDtos.add(checkDto);
								checkDept.put(checkDto.getAsString("dept_name"), checkDtos);
							}else {
								checkDtos.add(checkDto);
							}
							teamsMap.put(checkDto.getAsString("grp_name"), checkDept);
						}else {
							List<Dto> checkDtos = checkDept.get(checkDto.get("dept_name"));
							if(checkDtos==null) {
								checkDtos = new ArrayList<Dto>();
								checkDtos.add(checkDto);
								checkDept.put(checkDto.getAsString("dept_name"), checkDtos);
							}else {
								checkDtos.add(checkDto);
							}
						}
					}
					
					// 判断有无相同的部门，班组
					// 有：不能添加
					// 无：能够添加
					boolean notExistDept = true;			
					for(int k=0;k<lsSize;k++){
						Dto teamDto = (Dto)ls.get(k);
						if(dept_name.equals(teamDto.getAsString("dept_name")) &&
								team_name.equals(teamDto.getAsString("team_name"))){
							notExistDept = false;
							break;
						}
					}
					if(notExistDept){
						dto.put("grp_id", teamsMap.get(grp_name).get(dept_name).get(0).getAsString("grp_id"));
						dto.put("dept_id", teamsMap.get(grp_name).get(dept_name).get(0).getAsString("dept_id"));
						dto.put("team_no", ++maxno);
						dto.put("opr_id", opr_id);
						dto.put("opr_date", opr_date);
						dto.put("type", "1");
						dto.put("state", "0");
						teamDtos.add(dto);
					}else {
						throw new ApplicationException("第"+(i+1)+"行数据有错误 请核对部门和班组");
					}
	
				}else {
					Map<String, List<Dto>> deptFullMap = teamsMap.get(grp_name);
					if(deptFullMap.containsKey(dept_name)){
						List<Dto> teamFullInfo  = deptFullMap.get(dept_name);
						int teamFullInfoSize = teamFullInfo.size();
						for(int k=0;k<teamFullInfoSize;k++){
							Dto teamDto = teamFullInfo.get(k);
							if(team_name.equals(teamDto.getAsString("team_name"))){
								throw new ApplicationException("第"+(i+1)+"行数据 已经存在该班组");
							}
						}
						dto.put("grp_id", teamFullInfo.get(0).getAsString("grp_id"));
						dto.put("dept_id", teamFullInfo.get(0).getAsString("dept_id"));
						dto.put("team_no", ++maxno);
						dto.put("opr_id", opr_id);
						dto.put("opr_date", opr_date);
						dto.put("type", "1");
						dto.put("state", "0");
						teamDtos.add(dto);
					}else {
						throw new ApplicationException("第"+(i+1)+"行数据不存在该部门");
					}
				}
			}
			Dto pDto = new BaseDto();
			pDto.setDefaultAList(teamDtos);
			manageTeamService.importTeamsList(pDto);
			outDto.put("success", true);
			outDto.put("msg", "班组导入成功!</br>" +
                    "总计"+(allTeamsSize-1)+"条记录,过滤"+(allTeamsSize-teamSize)+"条记录,有效记录"+(teamSize-1)+"条!");
			String jsonString = JsonHelper.encodeObject2Json(outDto);
	        super.write(jsonString,response);
		}catch(Exception e){
			e.printStackTrace();
	        outDto.put("success", new Boolean(false));
	        outDto.put("msg", "班组导入失败，" + e.getMessage());
	        String jsonString = JsonHelper.encodeObject2Json(outDto);
	        super.write(jsonString,response);
		}
		return mapping.findForward(null);
	}
}























