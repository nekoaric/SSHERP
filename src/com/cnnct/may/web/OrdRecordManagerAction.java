package com.cnnct.may.web;


import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
import com.cnnct.may.data.process.ordrecordmanager.OrdRecordmanagerProcessContorl;
import com.cnnct.may.data.valide.ordrecordmanager.OrdRecordmanagerValideContorl;
import com.cnnct.may.service.OrdRecordManagerService;
import com.cnnct.sys.vo.UserInfoVo;
import com.cnnct.util.ArmConstants;
import com.cnnct.util.BusiConst;
import com.cnnct.util.G4Utils;
import com.cnnct.util.NatureUtil;

/**
 * *********************************************
 * 创建日期: 2013-11-28
 * 创建作者：梅访
 * 功能：订单记录管理
 * 最后修改时间：
 * 修改记录：
 * ***********************************************
 */
@SuppressWarnings("unchecked")
public class OrdRecordManagerAction extends BaseAction{
    /**
     * 需实现功能
     * 1.工厂部门班组树信息
     * 2.订单款号记录树
     * 3.订单记录查询
     * 4.订单信息载入
     * 5.保存记录信息
     * 6.修改记录信息
     * 7.人员信息卡CSN绑定
     * 8.读卡载入人员信息
     * 9.查询人员信息
     */

    private OrdRecordManagerService ordRecordManager = (OrdRecordManagerService) super.getService("ordRecordManager");
    
    
    
    public ActionForward ordRecordInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                       HttpServletResponse response) throws Exception {
        request.setAttribute("user_name", super.getSessionContainer(request).getUserInfo().getUsername());
        return mapping.findForward("ordRecordView");
    }

    public ActionForward ordRecord4AddInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                           HttpServletResponse response) throws Exception {
        request.setAttribute("user_name", super.getSessionContainer(request).getUserInfo().getUsername());
        return mapping.findForward("ordRecord4AddView");
    }

    public ActionForward manageUserCardInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                            HttpServletResponse response) throws Exception {
        Dto inDto = new BaseDto();
        String deptid = super.getSessionContainer(request).getUserInfo().getDeptid();

        String usertype = super.getSessionContainer(request).getUserInfo().getUsertype();
        if (usertype.equals(ArmConstants.ACCOUNTTYPE_ADMIN)) {
            inDto.put("dept_id", deptid.substring(0, BusiConst.GRP_ROOT_DEPTID_LENGTH));
        } else {
            //分厂及其他管理员的话只能看到他所属部门下的人员
            inDto.put("dept_id", deptid);
        }

        Dto outDto = (Dto) g4Reader.queryForObject("querySysDeptinfoByDeptid", inDto);
        request.setAttribute("root_dept_id", outDto.getAsString("dept_id"));
        request.setAttribute("root_dept_name", outDto.getAsString("dept_name"));

        return mapping.findForward("manageUserCardView");
    }

    /**
     * 1.工厂部门班组树信息
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward grpDeptTreeInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                         HttpServletResponse response) throws Exception {
        CommonActionForm aform = (CommonActionForm) form;
        Dto inDto = aform.getParamAsDto(request);
        String treetype = inDto.getAsString("treetype");
        Dto dbDto = new BaseDto();
        if("1".equals(treetype)){
        	dbDto.put("naturedept", "naturedept");
        }
        String loginDept = super.getSessionContainer(request).getUserInfo().getDeptid();
        Dto grpDbDto = new BaseDto();
        grpDbDto.put("dept_id", loginDept);
        // 查询登录人员所在的工厂，然后查询工厂下的部门
        Dto grpDto = (Dto)g4Reader.queryForObject("queryGrp4detpid",grpDbDto);
        
        // 为查询部门，工厂添加部门的信息 
        dbDto.put("cascadeDept_id", grpDto.getAsString("dept_id"));
        
        List grpDeptList = g4Reader.queryForList("getGrpDeptTreeByRecordManage",dbDto);
        List teamList = g4Reader.queryForList("getSysTeamTreeByRecordManage",dbDto);
        dbDto.put("dept_id", loginDept);
        // 查询登录人员的部门树信息
        List<Dto> deptTreeInfo = g4Reader.queryForList("queryTreeDeptInfo4deptid",dbDto);
        List<String> deptTree = new ArrayList<String>();
        for(Dto dto : deptTreeInfo){
        	deptTree.add(dto.getAsString("dept_id"));
        }
        
        String rootDept = "00100015";

        Dto deptDto = null;

        Dto rootDto = new BaseDto();
        Dto parentDto = new BaseDto();
        List<String> leafDept = parseDept2Leaf(grpDeptList);
        for (int i = 0; i < grpDeptList.size(); i++) {
        	
        	
            deptDto = (BaseDto) grpDeptList.get(i);
            deptDto.put("id", deptDto.getAsString("dept_id"));
            deptDto.put("text", deptDto.getAsString("dept_name"));

            String dept_id = deptDto.getAsString("dept_id");
        	if(leafDept.contains(dept_id)){
        		deptDto.put("leaf",ArmConstants.LEAF_Y);	//设置叶子部门
        	}else {
        		deptDto.put("leaf",ArmConstants.LEAF_N);	//设置非叶子部门
        	}
            
            
            if (!"".equals(deptDto.getAsString("name"))) {
                deptDto.put("type", "grps");//工厂节点
            } else {
                deptDto.put("type", "dept");//部门节点
            }
            
            if (deptDto.getAsString("leaf").equals(ArmConstants.LEAF_Y)) {
                deptDto.put("leaf", true);
                for (int j = 0; j < teamList.size(); j++) {
                    Dto teamDto = (BaseDto) teamList.get(j);
                    if (deptDto.getAsString("dept_id").equals(teamDto.getAsString("dept_id"))) {
                        deptDto.put("leaf", false);
                        break;
                    }
                }
            } else {
                deptDto.put("leaf", false);
                //长度为18位的为部门,展开到部门为止
//                if(deptDto.getAsString("dept_id").length()>=18){
//                	deptDto.put("expanded", false);
//                }else {
//                	deptDto.put("expanded", true);
//                }
                if(deptTree.contains(deptDto.getAsString("id"))){
                	deptDto.put("expanded", true);
                }else {
                    deptDto.put("expanded", false);
                }
            }
            deptDto.put("iconCls", "folder_userIcon");

            if (deptDto.getAsString("id").length() == BusiConst.GRP_ROOT_DEPTID_LENGTH) {
                rootDto.putAll(deptDto);
            }

            String parent_id = deptDto.getAsString("parent_id");
            Object o = parentDto.get(parent_id);
            if (o != null) {
                List<Dto> list = (List<Dto>) o;
                list.add(deptDto);
            } else {
                List<Dto> list = new ArrayList<Dto>();
                list.add(deptDto);
                parentDto.put(parent_id, list);
            }
        }

        for (int i = 0; i < teamList.size(); i++) {
            Dto teamDto = (BaseDto) teamList.get(i);
            teamDto.put("leaf", true);
            teamDto.put("id", "team" + teamDto.getAsString("dept_id") + "_" + teamDto.getAsString("team_no"));
            teamDto.put("text", teamDto.getAsString("name"));
            teamDto.put("iconCls", "folder_userIcon");

            teamDto.put("type", "team");//班组节点

            String parent_id = teamDto.getAsString("dept_id");

            Object o = parentDto.get(parent_id);
            if (o != null) {
                List<Dto> list = (List<Dto>) o;
                list.add(teamDto);
            } else {
                List<Dto> list = new ArrayList<Dto>();
                list.add(teamDto);
                parentDto.put(parent_id, list);
            }
        }

        Dto d = getDeptChildList(parentDto, rootDept, "id");//获取根节点子信息
        rootDto.put("children", d.get(rootDept));

        String jsonString = "[" + JsonHelper.encodeObject2Json(rootDto) + "]";
        response.getWriter().write(jsonString);
        return mapping.findForward(null);
    }

    /**
     * 获取根节点下的所有子部门信息
     *
     * @param parentDto 需要有所有的键值对 key:parent_id value:属于该父节点的list
     * @param rootId    根id
     * @param param     部门参数 表示dto中哪个key是对应的部门属性
     * @return 已添加过children属性的parentDto
     */
    public static Dto getDeptChildList(Dto parentDto, String rootId, String param) {
        Object o = parentDto.get(rootId);
        if (o != null) {//当前根节点rootId下有部门列表
            List l = (List) o;
            for (int i = 0; i < l.size(); i++) {
                Dto deptDto = (BaseDto) l.get(i);
                String deptid = deptDto.getAsString(param);

                Dto parentDto_update = getDeptChildList(parentDto, deptid, param);//所有的子部门信息
                if (parentDto_update != null) {//节点deptid下有子部门列表
                    deptDto.put("leaf", false);//设置当前节点为非叶子节点
                    deptDto.put("children", parentDto_update.get(deptid));
                }
            }
        } else {
            return null;
        }
        return parentDto;//返回修改过根节点信息的parentDto
    }

    /**
     * 2.订单款号记录树
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward ordStyleTreeInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                          HttpServletResponse response) throws Exception {
        CommonActionForm aform = (CommonActionForm) form;
        Dto inDto = aform.getParamAsDto(request);

        List ordList = g4Reader.queryForList("getOrdStyleTreeByRecordManage", inDto);

        for (Object obj : ordList) {
            Dto ordDto = (Dto) obj;
            ordDto.put("leaf", true);
            ordDto.put("id", ordDto.getAsString("order_id"));
            ordDto.put("text", ordDto.getAsString("order_id") + "　｜　" + ordDto.getAsString("style_no") + "　｜　" +ordDto.getAsString("ins_num")
            		+"("+ordDto.getAsString("ribbon_color")+")");
        }
        String jsonString = JsonHelper.encodeObject2Json(ordList);
        response.getWriter().write(jsonString);
        return mapping.findForward(null);
    }

    /**
     * 分厂树初始化
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward grpTreeInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                     HttpServletResponse response) throws Exception {
        CommonActionForm aform = (CommonActionForm) form;
        Dto inDto = aform.getParamAsDto(request);
        List grpList = g4Reader.queryForList("getGrpTreeByRecordManage", inDto);

        String root = "0519000001";
        Dto rootDto = new BaseDto();
        Dto parentDto = new BaseDto();
        for (int i = 0; i < grpList.size(); i++) {
            Dto grpDto = (BaseDto) grpList.get(i);
            grpDto.put("id", grpDto.getAsString("grp_id"));
            grpDto.put("text", grpDto.getAsString("name"));
            grpDto.put("expanded", true);
            if ("0".equals(grpDto.getAsString("isleaf"))) {
                grpDto.put("leaf", false);
            } else {
                grpDto.put("leaf", true);
            }
            grpDto.put("iconCls", "folder_userIcon");

            if (grpDto.getAsString("id").length() == 10) {
                rootDto.putAll(grpDto);
            }

            String parent_id = grpDto.getAsString("belong_grp_id");
            Object o = parentDto.get(parent_id);
            if (o != null) {
                List<Dto> list = (List<Dto>) o;
                list.add(grpDto);
            } else {
                List<Dto> list = new ArrayList<Dto>();
                list.add(grpDto);
                parentDto.put(parent_id, list);
            }
        }
        Dto d = getDeptChildList(parentDto, root, "id");//获取根节点子信息
        rootDto.put("children", d.get(root));

        String jsonString = "[" + JsonHelper.encodeObject2Json(rootDto) + "]";
        response.getWriter().write(jsonString);
        return mapping.findForward(null);
    }

    public ActionForward deptTreeInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                      HttpServletResponse response) throws Exception {
        CommonActionForm aform = (CommonActionForm) form;
        Dto inDto = aform.getParamAsDto(request);
        inDto.put("grp_id", inDto.getAsString("node"));
        //通过grp_id得到匹配的match_dept_id
        Dto grpDto = (Dto) g4Reader.queryForObject("getMatchDeptIdByGrpId", inDto);
        if (G4Utils.isEmpty(grpDto)) {
            return mapping.findForward(null);
        }
        inDto.put("dept_id", grpDto.getAsString("match_dept_id"));
        List deptList = g4Reader.queryForList("getDeptTreeByRecordManage", inDto);

        String root = grpDto.getAsString("match_dept_id");
        Dto rootDto = new BaseDto();
        Dto parentDto = new BaseDto();
        for (int i = 0; i < deptList.size(); i++) {
            Dto deptDto = (BaseDto) deptList.get(i);
            deptDto.put("id", deptDto.getAsString("dept_id"));
            deptDto.put("text", deptDto.getAsString("dept_name"));

            if (deptDto.getAsString("leaf").equals(ArmConstants.LEAF_Y)) {
                deptDto.put("leaf", true);
            } else {
                deptDto.put("leaf", false);
                deptDto.put("expanded", true);
            }
            deptDto.put("iconCls", "folder_userIcon");

            if (deptDto.getAsString("id").length() == root.length()) {
                rootDto.putAll(deptDto);
            }

            String parent_id = deptDto.getAsString("parent_id");
            Object o = parentDto.get(parent_id);
            if (o != null) {
                List<Dto> list = (List<Dto>) o;
                list.add(deptDto);
            } else {
                List<Dto> list = new ArrayList<Dto>();
                list.add(deptDto);
                parentDto.put(parent_id, list);
            }
        }
        Dto d = getDeptChildList(parentDto, root, "id");//获取根节点子信息
        rootDto.put("children", d.get(root));

        String jsonString = "[" + JsonHelper.encodeObject2Json(rootDto) + "]";
        response.getWriter().write(jsonString);
        return mapping.findForward(null);
    }

    public ActionForward teamTreeInit(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                      HttpServletResponse response) throws Exception {
        CommonActionForm aform = (CommonActionForm) form;
        Dto inDto = aform.getParamAsDto(request);
        inDto.put("dept_id", inDto.getAsString("node"));
        List teamList = g4Reader.queryForList("getSysTeamTreeByRecordManage", inDto);

        for (int i = 0; i < teamList.size(); i++) {
            Dto teamDto = (BaseDto) teamList.get(i);
            teamDto.put("leaf", true);
            teamDto.put("id", teamDto.getAsString("team_no"));
            teamDto.put("text", teamDto.getAsString("name"));
            teamDto.put("iconCls", "folder_userIcon");
        }
        String jsonString = JsonHelper.encodeObject2Json(teamList);
        response.getWriter().write(jsonString);
        return mapping.findForward(null);
    }

    /**
     * 3.订单记录查询
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward queryOrdDayList(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                         HttpServletResponse response) throws Exception {
        CommonActionForm aform = (CommonActionForm) form;
        Dto inDto = aform.getParamAsDto(request);

        if ("detailQuery".equals(inDto.getAsString("query_flag"))) {
            String natures = inDto.getAsString("natures");
            if (!"".equals(natures)) {
                StringBuffer sb = new StringBuffer();
                //nature格式 : '1','2'
                for (String nature : natures.split(";")) {
                    sb.append("'").append(nature).append("',");
                }
                if (sb.length() > 0) {
                    inDto.put("nature", sb.substring(0, sb.length() - 1));
                }
            }

            inDto.put("query_order", inDto.getAsString("order_id").toLowerCase());
            inDto.remove("order_id");

            inDto.put("style_no", inDto.getAsString("style_no").toLowerCase());
        }

        super.setSessionAttribute(request, "QUERYORDDAYLIST_DTO", inDto);

        List ordDayList = g4Reader.queryForPage("queryOrdDayListByRecordManage", inDto);
        Integer pageCount = g4Reader.queryForPageCount("queryOrdDayListByRecordManage", inDto);

        String jsonString = JsonHelper.encodeList2PageJson(ordDayList, pageCount, "");
        response.getWriter().write(jsonString);
        return mapping.findForward(null);
    }

    /**
     * 4.载入订单信息
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward loadOrdBasInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                        HttpServletResponse response) throws Exception {
        CommonActionForm aform = (CommonActionForm) form;
        Dto inDto = aform.getParamAsDto(request);

        Dto orderDto = (Dto) g4Reader.queryForObject("loadOrdBasInfoByRecordManage", inDto);
        orderDto.put("tr_date", G4Utils.getCurDate());
        orderDto.put("tr_time", G4Utils.getCurrentTime("HH:mm:ss"));
        String jsonString = JsonHelper.encodeDto2FormLoadJson(orderDto, "");
        response.getWriter().write(jsonString);
        return mapping.findForward(null);
    }
    

    /**
     * 载入订单数量信息
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward getOrdAmountByNuture(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                        HttpServletResponse response) throws Exception {
        CommonActionForm aform = (CommonActionForm) form;
        Dto inDto = aform.getParamAsDto(request);

        String nature = inDto.getAsString("nature");
        List<String> natureList = NatureUtil.getNatureCode();

        String pre_nature = "";
        for(int i=1;i<natureList.size();i++){
            if(natureList.get(i).equals(nature)){
                pre_nature = natureList.get(i-1);
                break;
            }
        }
        
        inDto.put("pre_nature",pre_nature);
        Dto orderDto = (Dto) g4Reader.queryForObject("queryordScheList4rollback", inDto);
        if(orderDto == null){	// 如果没有数据 则新建空数据
        	orderDto = new BaseDto();
        	orderDto.put("finish_num", 0);
        }else {	//如果已经有数据设置新数据
        	orderDto.put("finish_num", orderDto.getAsLong(NatureUtil.parseNC2natureEn(nature)));
        }
        if("".equals(pre_nature)){
            orderDto.put("pre_finish_num",orderDto.getAsString("ins_num"));
        }else {
            orderDto.put("pre_finish_num", orderDto.getAsLong(NatureUtil.parseNC2natureEn(pre_nature)));
        }


        String jsonString = JsonHelper.encodeObject2Json(orderDto);
        response.getWriter().write(jsonString);
        return mapping.findForward(null);
    }
    
    /**
     * 载入订单数量信息 及时生成模式
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward getOrdAmountByNuture2(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                        HttpServletResponse response) throws Exception {
        CommonActionForm aform = (CommonActionForm) form;
        Dto inDto = aform.getParamAsDto(request);

        try {
			// 获取流程状态
			Dto natureDto = new BaseDto();
	        natureDto.putAll(NatureUtil.getNatureCode2natureEn());
			// 获取标签流水记录
			Dto qDto = new BaseDto();
			qDto.put("order_id", inDto.getAsString("order_id"));
            //查询epc记录和流水记录 汇总成一张需要同步的流水表
			List ordDayList = g4Reader.queryForList("getStreamDataByProdordStatus", qDto);   //查询结果包含款号，交易日期，订单号
			for (Object obj : ordDayList) {
				Dto dto = (Dto) obj;
				String tr_date = dto.getAsString("tr_date");
				if (tr_date.length() > 10) {
					tr_date = tr_date.substring(0, 10);
					dto.put("tr_date", tr_date);
				}
				String nature = natureDto
				        .getAsString(dto.getAsString("nature"));
				dto.put(nature, dto.getAsInteger("amount"));
				// 将其他流程数据设置为0 为了插入数据
				Set<String> setKey = natureDto.keySet();
				for (String str : setKey) {
					String dtoNature = natureDto.getAsString(str);
					if (!dtoNature.equals(nature)) {
						dto.put(dtoNature, 0);
					}
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
        return null;
    }
    
    /**
     * 回退操作-适用于页面
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward rollbackOrdprod4web(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                        HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        try{
            CommonActionForm cForm = (CommonActionForm)form;
            Dto inDto = cForm.getParamAsDto(request);
            UserInfoVo user = super.getSessionContainer(request).getUserInfo();
            List baseData = new ArrayList();
            baseData.add(inDto);
            Dto baseDto = new BaseDto();
            baseDto.setDefaultAList(baseData);
            baseDto.put("userInfo",user);
            
            baseDto = OrdRecordmanagerProcessContorl.rollbackProcess(baseDto, g4Reader);    //处理数据
            OrdRecordmanagerValideContorl.rollbackValide(baseDto, g4Reader);    //校验数据
            
            ordRecordManager.rollbackProdInfo(baseDto);
            outDto.put("success", true);
            outDto.put("msg", "产品回退");
        }catch(ApplicationException e){
            e.printStackTrace();
            //出现异常处理返回前台的提示信息
            outDto = new BaseDto();
            outDto.put("success", false);
            outDto.put("msg", e.getMessage());
        }catch(Exception e){
            e.printStackTrace();
            //出现异常处理返回前台的提示信息
            outDto = new BaseDto();
            outDto.put("success", false);
            outDto.put("msg", "出现未知错误，请检查格式，或者联系管理员!");
        }finally{
            //传回前台的数据
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            super.write(jsonString, response);
        }
        return mapping.findForward(null);
    }
    /**
     * 回退操作 -适用于文件导入
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward rollbackOrdprod4excel(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {

    return mapping.findForward(null);
    }

    /**
     * 新增订单记录信息
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward addOrdRecordInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                          HttpServletResponse response) throws Exception {
        CommonActionForm aform = (CommonActionForm) form;
        Dto outDto = new BaseDto();
        try {
            Dto inDto = aform.getParamAsDto(request);
            UserInfoVo loginUser = super.getSessionContainer(request).getUserInfo(); 
            inDto.put("opr_id", loginUser.getAccount());
            inDto.put("loginName", loginUser.getUsername());
            inDto.put("loginDept", loginUser.getDeptid());
            
            outDto = ordRecordManager.addOrdRecordInfo(inDto);
            
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            super.write(jsonString, response);
        } catch (Exception e) {
            e.printStackTrace();
            outDto.put("success", false);
            outDto.put("msg", e.getMessage());
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            super.write(jsonString, response);
        }
        
        return mapping.findForward(null);
    }

    /**
     * 修改订单记录信息
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward updateOrdRecordInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                             HttpServletResponse response) throws Exception {
        CommonActionForm aform = (CommonActionForm) form;
        Dto outDto = new BaseDto();
        try {
            Dto inDto = aform.getParamAsDto(request);

            inDto.put("opr_id", super.getSessionContainer(request).getUserInfo().getAccount());
            inDto.put("opr_time", G4Utils.getCurrentTime());
            String natureType = inDto.getAsString("natureType");
            if(natureType.equals("1")){
                outDto = ordRecordManager.updateOrdRecordInfo(inDto);   //正常流程的修改
            }else if(natureType.equals("0")){
                outDto = ordRecordManager.rollbackChange(inDto);    //退货流程的修改
            }
            

            String jsonString = JsonHelper.encodeObject2Json(outDto);
            super.write(jsonString, response);
        } catch (Exception e) {
            outDto.put("success", false);
            outDto.put("msg", e.getMessage());
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            super.write(jsonString, response);
        }
        return mapping.findForward(null);
    }

    /**
     * 删除订单记录信息
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward deleteOrdRecordInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                             HttpServletResponse response) throws Exception {
        CommonActionForm aform = (CommonActionForm) form;
        Dto outDto = new BaseDto();
        try {
            Dto inDto = aform.getParamAsDto(request);

            inDto.put("opr_id", super.getSessionContainer(request).getUserInfo().getAccount());
            inDto.put("opr_time", G4Utils.getCurrentTime());
            String seq_no = inDto.getAsString("seq_no");
         // 获取原日记录信息
            Dto qDto = new BaseDto();
            qDto.put("seq_no", seq_no);
            Dto ordDayDto = (Dto) g4Reader.queryForObject("queryOrdDayListByRecordManage", qDto);
            if(ordDayDto==null){
                throw new ApplicationException("此记录不能操作");
            }
            String nature = ordDayDto.getAsString("nature");
            List<String> rollbackNature = NatureUtil.getRollbackNature();
            if(rollbackNature.contains(nature)){    //回退流程
                outDto = ordRecordManager.rollbackDelete(inDto);
            }else if(NatureUtil.getNatureCode().contains(nature)){   //正常流程
                outDto = ordRecordManager.deleteOrdRecordInfo(inDto);
            }

            String jsonString = JsonHelper.encodeObject2Json(outDto);
            super.write(jsonString, response);
        } catch (Exception e) {
        	e.printStackTrace();
            outDto.put("success", false);
            outDto.put("msg", e.getMessage());
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            super.write(jsonString, response);
        }
        return mapping.findForward(null);
    }

    /**
     * 导出订单记录信息
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward exportOrdRecordInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                             HttpServletResponse response) throws Exception {
        Dto parametersDto = new BaseDto();
        Dto inDto = (BaseDto) super.getSessionAttribute(request, "QUERYORDDAYLIST_DTO");
        inDto.remove("queryForPageCountFlag");

        List list = g4Reader.queryForList("queryOrdDayListByRecordManage", inDto);


        for (Object o : list) {
            Dto dto = (Dto) o;
            String status = dto.getAsString("status");
            if ("0".equals(status)) {
                status = "正常";
            } else if ("1".equals(status)) {
                status = "修改中";
            } else if ("2".equals(status)) {
                status = "修改完成";
            }
            dto.put("status", status);
            dto.put("nature_name", NatureUtil.parseNC2natureZh(dto.getAsString("nature")));
        }

        ExcelExporter excelExporter = new ExcelExporter();
        parametersDto.put("reportTitle", "订单交接记录");
        excelExporter.setTemplatePath("/report/excel/ordRecordInfo.xls");
        excelExporter.setFilename("订单交接记录.xls");
        excelExporter.setData(parametersDto, list);
        excelExporter.export(request, response);
        return mapping.findForward(null);
    }

    /**
     * 7.人员CSN绑定
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward bindUserAndCsn(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                        HttpServletResponse response) throws Exception {
        CommonActionForm aform = (CommonActionForm) form;
        Dto outDto = new BaseDto();
        try {
            Dto inDto = aform.getParamAsDto(request);

            outDto = ordRecordManager.bindUserAndCsn(inDto);

            String jsonString = JsonHelper.encodeObject2Json(outDto);
            super.write(jsonString, response);
        } catch (Exception e) {
            outDto.put("success", new Boolean(false));
            outDto.put("msg", e.getMessage());
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            super.write(jsonString, response);
        }
        return mapping.findForward(null);
    }

    /**
     * 8.人员CSN解绑定
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward unbindUserAndCsn(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                          HttpServletResponse response) throws Exception {
        CommonActionForm aform = (CommonActionForm) form;
        Dto outDto = new BaseDto();
        try {
            Dto inDto = aform.getParamAsDto(request);

            outDto = ordRecordManager.unbindUserAndCsn(inDto);

            String jsonString = JsonHelper.encodeObject2Json(outDto);
            super.write(jsonString, response);
        } catch (Exception e) {
            outDto.put("success", new Boolean(false));
            outDto.put("msg", e.getMessage());
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            super.write(jsonString, response);
        }
        return mapping.findForward(null);
    }

    /**
     * 9.读卡载入人员信息
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward loadUserInfoByCsn(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                           HttpServletResponse response) throws Exception {
        CommonActionForm aform = (CommonActionForm) form;
        Dto inDto = aform.getParamAsDto(request);

        Dto orderDto = (Dto) g4Reader.queryForObject("loadUserInfoByCsn", inDto);
        if (G4Utils.isEmpty(orderDto)) {	
        	orderDto = new BaseDto();
            orderDto.put("success", false);
            orderDto.put("msg", "该卡没有对应的人员信息或者该人员不在本部门下！");
        } else {
            orderDto.put("success", true);
        }

        String jsonString = JsonHelper.encodeObject2Json(orderDto, "");
        response.getWriter().write(jsonString);
        return mapping.findForward(null);
    }

    /**
     * 查询人员信息
     *
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward queryUserInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                       HttpServletResponse response) throws Exception {
        CommonActionForm aform = (CommonActionForm) form;
        Dto outDto = new BaseDto();
        try {
            Dto inDto = aform.getParamAsDto(request);
            List userList = g4Reader.queryForPage("queryUserInfoByRecordManage", inDto);
            Integer pageCount = g4Reader.queryForPageCount("queryUserInfoByRecordManage", inDto);

            String jsonString = JsonHelper.encodeList2PageJson(userList, pageCount, "");
            response.getWriter().write(jsonString);
        } catch (Exception e) {
            outDto.put("success", false);
            outDto.put("msg", e.getMessage());
            String jsonString = JsonHelper.encodeObject2Json(outDto);
            super.write(jsonString, response);
        }
        return mapping.findForward(null);
    }

    /**
     * 查询部门所允许数量性质的操作
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward queryNature(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                       HttpServletResponse response) throws Exception {
    	String resultStr = "";
        try{
        	CommonActionForm aform = (CommonActionForm) form;
            Dto inDto  = aform.getParamAsDto(request);
            String naturetype = inDto.getAsString("naturetype");
            if("1".equals(naturetype)){
            	naturetype = "NATURE";
            }else if("0".equals(naturetype)){
            	naturetype = "ROLLBACK";
            }
            String dept_id = inDto.getAsString("dept_id");
            Dto dbDto = new BaseDto();
            dbDto.put("dept_id", dept_id);
            dbDto.put("naturetype", naturetype);
        	List<Dto> resultDto = g4Reader.queryForList("queryBindNatures4dept", dbDto);
        	resultStr = JsonHelper.encodeList2PageJson(resultDto, resultDto.size(), null);
        }catch(Exception e){
        	e.printStackTrace();
        	//抛出异常时初始化
        	List<Dto> list = new ArrayList<Dto>();
            Dto dto = new BaseDto();
            dto.put("value","99999");
            dto.put("text","未能查询到可操作数量性质");
            list.add(dto);
            resultStr = JsonHelper.encodeObject2Json(list);
        }
        super.write(resultStr, response);
        return mapping.findForward(null);
    }
    /**
     * 处理叶子节点标志，相关参数dept_id,parent_id,leaf 
     * @return
     */
    private List<String> parseDept2Leaf(List<Dto> list){
    	Set<String> resultStr = new HashSet<String>();
    	//添加所有部门的id
    	for(Dto dto : list){
    		String dept_id = dto.getAsString("dept_id");
    		resultStr.add(dept_id);
    	}
    	//移除有子部门的部门
    	for(Dto dto : list){
    		String parent_id = dto.getAsString("parent_id");
    		if(resultStr.contains(parent_id)){
    			resultStr.remove(parent_id);
    		}
    	}
    	return new ArrayList<String>(resultStr);
    }
    /**
	 * 查询页面载入时所有产品信息
	 */
	public ActionForward queryProdInsInfo(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		Dto outDto = ordRecordManager.queryProdInsInfo(inDto);
		String jsonStrList = outDto.getAsString("jsonStrList");
		super.write(jsonStrList, response);
		return mapping.findForward(null);
	}
	/**
	 * 修改时载入交接记录的尺寸信息
	 */
	public ActionForward queryOrdSizeInfo(ActionMapping mapping,
			ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm) form;
		Dto inDto = aForm.getParamAsDto(request);
		Dto outDto = ordRecordManager.queryOrdSizeInfo(inDto);
		String jsonStrList = outDto.getAsString("jsonStrList");
		super.write(jsonStrList, response);
		return mapping.findForward(null);
	}
}
