<%@page import="com.cnnct.api.compymngplatform.busiinterface.BusiDataStructure"%>
<%@page import="com.cnnct.util.BusiConst"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.cnnct.common.pubbusi.service.CnsVersInfoService"%>
<%@page import="com.cnnct.sys.service.SysGrpsService"%>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="org.eredlab.g4.bmf.util.SpringBeanLoader"%>
<%@page import="org.eredlab.g4.bmf.base.IDao"%>
<%@page import="org.eredlab.g4.ccl.datastructure.Dto"%>
<%@page import="org.eredlab.g4.ccl.datastructure.impl.BaseDto"%>
<%@page import="org.eredlab.g4.arm.util.idgenerator.IdGenerator"%>
<%@page import="org.eredlab.g4.arm.util.idgenerator.IDHelper"%>
<%@page import="com.cnnct.util.G4Utils"%>
<%@page import="com.cnnct.util.ArmConstants"%>

<%
    // 获取登录地址
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
%>

<%
    String result = "";
    String systemTitle = "浙江移动政企一卡通应用系统";

    List<String> msgList = new ArrayList<String>();

    // 页面参数
    String grp_id = request.getParameter("grp_id"); // 单位代码
    String grp_name = request.getParameter("grp_name"); // 单位名称
    String grp_size = request.getParameter("grp_size"); // 单位规模
    String issu_num = request.getParameter("issu_num"); // 发卡人数
    String city_code = request.getParameter("city_code"); // 所属城市
    String apl_type = request.getParameter("apl_type"); // 行业类型，现默认为001
    apl_type = "001";
    String _dev4_num = request.getParameter("dev4_num"); // 消费机数量
    String _dev2_num = request.getParameter("dev2_num"); // 考勤机数量
    String username = request.getParameter("username"); // 管理员用户名
    String account = request.getParameter("account"); // 管理员编号
    String password = request.getParameter("password"); // 管理员密码
    String[] apptype = request.getParameterValues("apptype"); // 开通应用

    String action = request.getParameter("action"); // 操作
    if (action != null && action.equals("init")) {
        boolean flag = true;
        // 验证用户输入
        if (grp_id == null || grp_id.equals("")) {
            msgList.add("单位代码必须填写！");
            flag = false;
        } else if (!grp_id.matches("\\d+")) {
            msgList.add("单位代码必须全部为数字！");
            flag = false;
        }
        if (grp_name == null || grp_name.equals("")) {
            msgList.add("单位名称必须填写！");
            flag = false;
        }
        if (grp_id == null || grp_id.equals("")) {
            msgList.add("单位规模必须填写！");
            flag = false;
        }
        if (issu_num == null || issu_num.equals("")) {
            msgList.add("持卡人数必须填写！");
            flag = false;
        }
        if (username == null || username.equals("")) {
            msgList.add("管理员姓名必须填写！");
            flag = false;
        }
        if (account == null || account.equals("")) {
            msgList.add("管理员编号必须填写！");
            flag = false;
        } else if (!account.matches("[a-zA-Z0-9]+")) {
            msgList.add("管理员编号必须为数字或字母！");
            flag = false;
        }
        if (password == null || password.equals("")) {
            msgList.add("管理员密码必须填写！");
            flag = false;
        }
        if (apptype == null || apptype.length == 0) {
            msgList.add("应用类型必须选择一个！");
            flag = false;
        }

        // 验证通过，保存企业信息，主管用户，初始化菜单，设置考勤模块基础设置
        if (flag) {
            grp_id = grp_id.trim();
            //grp_name = new String(grp_name.trim().getBytes("ISO-8859-1"), "UTF-8");
            grp_name = grp_name.trim();
            //username = new String(username.trim().getBytes("ISO-8859-1"), "UTF-8");
            username = username.trim();
            account = account.trim();
            password = password.trim();

            try {
                IDao g4Dao = (IDao) SpringBeanLoader.getSpringBean("g4Dao");
                SysGrpsService sysGrpsService = (SysGrpsService) SpringBeanLoader.getSpringBean("sysGrpsService");
                CnsVersInfoService cnsVersInfoService = (CnsVersInfoService) SpringBeanLoader.getSpringBean("cnsVersInfoService");

                Dto pDto = new BaseDto();
                pDto.put("grp_id", grp_id);
                pDto.put("dev4_num", _dev4_num);
                pDto.put("dev2_num", _dev2_num);
                String deptid = (String) g4Dao.queryForObject("getGrpsDeptInfo", pDto);

                // 企业信息不存在，则新增
                if (deptid == null) {
                    g4Dao.update("clearParentDeptName");

                    // 保存企业信息
                    Dto dto = new BaseDto();
                    dto.put("grp_id", grp_id);
                    dto.put("name", grp_name);
                    dto.put("grp_size", Integer.parseInt(grp_size));
                    dto.put("issu_num", Integer.parseInt(issu_num));
                    dto.put("city_code", city_code);
                    dto.put("apl_type", apl_type);
                    dto.put("dev4_num", _dev4_num);
                    dto.put("dev2_num", _dev2_num);
                    dto.put("state", "0");
                    //dto.put("",)
                    sysGrpsService.batchSaveCnsTrdKind(dto);

                    g4Dao.insert("createSysGrpsDomainMySql", dto);

                    // 新增版本控制表（CNS_VERS_INFO）
                    Dto dto4CnsVer = new BaseDto();
                    dto4CnsVer.put("blk_ver_no", 0);// 黑名单版本号
                    dto4CnsVer.put("allw_ver_no", 0);// 补贴版本号
                    dto4CnsVer.put("disc_ver_no", 0);// 折扣率版本号
                    dto4CnsVer.put("pay_ver_no", 0);// 搭伙率版本号
                    dto4CnsVer.put("grp_ver_no", 0);// 单位组版本号
                    dto4CnsVer.put("ver_no1", 0);// 保留1
                    dto4CnsVer.put("ver_no2", 0);// 保留2
                    dto4CnsVer.put("ver_no3", 0);// 保留3
                    dto4CnsVer.put("city_code", dto.getAsString("city_code"));// 保留2
                    dto4CnsVer.put("apl_type", dto.getAsString("apl_type"));// 保留3
                    cnsVersInfoService.saveCnsVersInfo(dto4CnsVer);

                    // 保存部门信息
                    if (null == deptid) {
                        deptid = IdGenerator.getDeptIdGenerator("001");
                        pDto.put("deptid", deptid);
                        pDto.put("parentid", "001");
                        pDto.put("deptname", grp_name);
                        pDto.put("sortno", 1);
                        pDto.put("grp_id", pDto.getAsString("grp_id"));
                        pDto.put("leaf", ArmConstants.LEAF_N);
                        g4Dao.insert("saveDeptItem", pDto);
                    }
                    // 保存主管信息
                    pDto.put("userid", IDHelper.getUserID());
                    pDto.put("username", username);
                    pDto.put("account", account);
                    pDto.put("sex", "1");
                    String mPasswor = G4Utils.encryptBasedDes(password);
                    pDto.put("password", mPasswor);
                    pDto.put("usertype", "3");// 3-单位系统管理员
                    pDto.put("deptid", deptid);// 部门
                    pDto.put("opn_date", G4Utils.getCurrentTime("yyyy-MM-dd"));// 状态
                    pDto.put("locked", "0");// 锁定标志
                    pDto.put("nation", "1");
                    pDto.put("state", "0");// 状态
                    g4Dao.insert("saveGrpZGItem", pDto);// 生成单位主管
                    pDto.put("deptid", deptid);
                    
                    // 保存企业管理员角色
                    String roleid = (String) g4Dao.queryForObject("getGrpsZGQX", pDto);
                    if (null == roleid) {
                        roleid = IDHelper.getRoleID();
                        pDto.put("roleid", roleid);
                        pDto.put("rolename", "企业管理员");
                        pDto.put("deptid", deptid);
                        pDto.put("roletype", "3");
                        pDto.put("remark", "");
                        pDto.put("locked", "0");
                        g4Dao.insert("saveRoleItem", pDto);// 角色表
                    }

                    pDto.put("roleid", roleid);// 给单位主管分配角色权限
                    pDto.put("authorizeid", IDHelper.getAuthorizeid4User());
                    g4Dao.insert("saveSelectedRole", pDto);
                    g4Dao.insert("saveEausersubinfoItem", pDto);

                    // 保存菜单
                    g4Dao.delete("deleteEausermenumapByUserId", pDto); // 
                    List<String> menuLst = g4Dao.queryForList("getMenuId4Init", "01");
                    menuLst.addAll(g4Dao.queryForList("getMenuId4Init", "12"));
                    for (String menuPattern : apptype) {
                        menuLst.addAll(g4Dao.queryForList("getMenuId4Init", menuPattern));
                    }

                    List toSaveMenuLst = new ArrayList();
                    for (String menuId : menuLst) {
                        if (G4Utils.isEmpty(menuId))
                            continue;
                        if (G4Utils.isEmpty(menuId))
                            continue;
                        if (menuId.equals("01010105")) // 菜单维护
                            continue;
                        if (menuId.equals("01010301")) // 字典维护
                            continue;
                        if (menuId.equals("01010303")) // 全局参数表维护
                            continue;
                        if (menuId.equals("01010302")) // 异常信息维护
                            continue;
                        if (menuId.equals("01010304")) // 地区信息维护
                            continue;
                        if (menuId.equals("01010305")) // 行业类别维护
                            continue;
                        if (menuId.equals("01010106")) // 地市管理员管理与授权
                            continue;
                        if (menuId.equals("01010107")) // 客户经理管理与授权
                            continue;
                        if (menuId.equals("01010108")) // 省级人员管理与授权
                            continue;
                        Dto _pDto = new BaseDto();
                        _pDto.put("userid", pDto.get("userid"));
                        _pDto.put("menuid", menuId);
                        _pDto.put("authorizeid", IDHelper.getAuthorizeid4Usermenumap());
                        _pDto.put("authorizelevel", ArmConstants.AUTHORIZELEVEL_ACCESS);
                        toSaveMenuLst.add(_pDto);
                        //g4Dao.insert("saveSelectedMenu", pDto);
                    }
                    // 菜单根节点
                    Dto _pDto = new BaseDto();
                    _pDto.put("userid", pDto.get("userid"));
                    _pDto.put("menuid", "01");
                    _pDto.put("authorizeid", IDHelper.getAuthorizeid4Usermenumap());
                    _pDto.put("authorizelevel", ArmConstants.AUTHORIZELEVEL_ACCESS);
                    toSaveMenuLst.add(_pDto);
                    g4Dao.batchInsertBaseDto("saveSelectedMenu", toSaveMenuLst);

                    // 自动生成企业终端信息,根据终端数量
                    // 自动新增考勤机
                    int num1 = dto.getAsInteger("dev4_num");
                    List alist = new ArrayList();
                    if (num1 > 0) {
                        for (int i = 0; i < num1; i++) {
                            Dto map = new BaseDto();
                            map.put("grp_id", dto.getAsString("grp_id"));// 单位编号
                            map.put("trm_no", String.valueOf((10000001 + i)));// 机具编号
                            map.put("trm_kind", BusiConst.TRMKIND_KQ_CODE);// 机具型号
                            map.put("trm_name", BusiConst.TRMKIND_KQ_CHINESE);// 机具名称
                            map.put("state", "0");// 状态
                            map.put("down_flag", "0");// 状态
                            map.put("ins_date", G4Utils.getCurrentTime("yyyy-MM-dd"));// 安装日期
                            alist.add(map);
                        }
                        g4Dao.batchInsertBaseDto("createDevTrmDomain", alist);
                    }
                    // 自动新增消费机
                    int num2 = dto.getAsInteger("dev2_num");
                    List alist2 = new ArrayList();

                    if (num1 > 0) {
                        for (int i = 0; i < num2; i++) {
                            Dto map2 = new BaseDto();
                            map2.put("grp_id", dto.getAsString("grp_id"));// 单位编号
                            map2.put("trm_no", String.valueOf((20000001 + i)));// 机具编号
                            map2.put("trm_kind", BusiConst.TRMKIND_XF_CODE);// 机具型号
                            map2.put("trm_name", BusiConst.TRMKIND_XF_CHINESE);// 机具名称
                            map2.put("state", "0");// 状态
                            map2.put("down_flag", "0");// 状态
                            map2.put("ins_date", G4Utils.getCurrentTime("yyyy-MM-dd"));// 安装日期
                            alist2.add(map2);
                        }
                        g4Dao.batchInsertBaseDto("createDevTrmDomain", alist2);
                        // 初始化短信下发
                        g4Dao.insert("insertMessOpenInfo", pDto);
                        // 初始化企业考勤模块基础信息（考勤制度，基本班次）
                        String _appTypes = StringUtils.join(apptype, ",");
                        if (StringUtils.contains(_appTypes, "08")) {
                            Dto dto4Cwa = new BaseDto();
                            dto4Cwa.put("grp_id", dto.getAsString("grp_id"));
                            String current_date = G4Utils.getDate(new Date(), "yyyy-mm-dd");
                            String current_time = current_date + " " + new java.sql.Time(System.currentTimeMillis()).toString();
                            dto4Cwa.put("current_date", current_date);
                            dto4Cwa.put("current_time", current_time);
                            dto4Cwa.put("per_id", ArmConstants.ACCOUNT_ID);

                            // 考勤制度
                            g4Dao.insert("insertCwaSysBaseInfo4Later", dto4Cwa);
                            g4Dao.insert("insertCwaSysBaseInfo4EarlyOut", dto4Cwa);
                            g4Dao.insert("insertCwaSysBaseInfo4Hour", dto4Cwa);
                            g4Dao.insert("insertCwaSysBaseInfo4Day", dto4Cwa);
                            g4Dao.insert("insertCwaSysBaseInfo4Leave", dto4Cwa);
                            g4Dao.insert("insertCwaSysBaseInfo4Overtime", dto4Cwa);

                            // 基本班次
                            g4Dao.insert("insertCwaRunDef4Init1", dto4Cwa);
                            g4Dao.insert("insertCwaRunDef4Init2", dto4Cwa);
                            g4Dao.insert("insertCwaRunBase4Init1", dto4Cwa);
                            g4Dao.insert("insertCwaRunBase4Init2", dto4Cwa);

                            // 请假种类
                            g4Dao.insert("createLeavType4init1", dto4Cwa);
                            g4Dao.insert("createLeavType4init2", dto4Cwa);
                            g4Dao.insert("createLeavType4init3", dto4Cwa);
                            g4Dao.insert("createLeavType4init4", dto4Cwa);
                            g4Dao.insert("createLeavType4init5", dto4Cwa);
                            g4Dao.insert("createLeavType4init6", dto4Cwa);
                        }
                    }
                } else {
                    //根据企业代码查询原有的终端信息
                    Dto dto = (Dto) g4Dao.queryForObject("getGrpDevInfoById", pDto);
                    //考勤机
                    int dev4_num = pDto.getAsInteger("dev4_num");
                    int pre_dev4_num = dto.getAsInteger("dev4_num");
                    List alist = new ArrayList();
                    if (dev4_num > pre_dev4_num) {//新增
                        Dto dto1 = new BaseDto();
                        dto1.put("grp_id", pDto.getAsString("grp_id"));
                        dto1.put("trm_kind", BusiConst.TRMKIND_KQ_CODE);
                        int maxDevNo = 10000000;
                        if (g4Dao.queryForObject("getMaxDevTrmNo", dto1) != null) {
                            maxDevNo = (Integer) g4Dao.queryForObject("getMaxDevTrmNo", dto1);
                        }
                        for (int i = 0; i < dev4_num - pre_dev4_num; i++) {
                            Dto map = new BaseDto();
                            map.put("grp_id", pDto.getAsString("grp_id"));//单位编号
                            map.put("trm_no", String.valueOf((maxDevNo + i + 1)));//机具编号
                            map.put("trm_kind", BusiConst.TRMKIND_KQ_CODE);//机具型号
                            map.put("trm_name", BusiConst.TRMKIND_KQ_CHINESE);//机具名称
                            map.put("state", "0");//状态
                            map.put("down_flag", "0");//状态
                            map.put("ins_date", G4Utils.getCurrentTime("yyyy-MM-dd"));//安装日期
                            alist.add(map);
                        }
                        g4Dao.batchInsertBaseDto("createDevTrmDomain", alist);
                    }
                    if (dev4_num < pre_dev4_num) {//删除
                        Dto dto1 = new BaseDto();
                        dto1.put("grp_id", pDto.getAsString("grp_id"));
                        dto1.put("trm_kind", BusiConst.TRMKIND_KQ_CODE);
                        int maxDevNo = 10000000;
                        if (g4Dao.queryForObject("getMaxDevTrmNo", dto1) != null) {
                            maxDevNo = (Integer) g4Dao.queryForObject("getMaxDevTrmNo", dto1);
                        }
                        for (int i = 0; i < pre_dev4_num - dev4_num; i++) {
                            Dto map = new BaseDto();
                            map.put("grp_id", pDto.getAsString("grp_id"));//单位编号
                            map.put("trm_no", String.valueOf((maxDevNo - i)));//机具编号
                            alist.add(map);
                        }
                        g4Dao.batchDelBaseDto(alist, "deleteDevTrmItem");
                    }
                    //消费机
                    int dev2_num = pDto.getAsInteger("dev2_num");
                    int pre_dev2_num = dto.getAsInteger("dev2_num");
                    List alist1 = new ArrayList();
                    List alist2 = new ArrayList();
                    if (dev2_num > pre_dev2_num) {//新增
                        Dto dto1 = new BaseDto();
                        dto1.put("grp_id", pDto.getAsString("grp_id"));
                        dto1.put("trm_kind", BusiConst.TRMKIND_XF_CODE);
                        int maxDevNo = 20000000;
                        if (g4Dao.queryForObject("getMaxDevTrmNo", dto1) != null) {
                            maxDevNo = (Integer) g4Dao.queryForObject("getMaxDevTrmNo", dto1);
                        }
                        for (int i = 0; i < dev2_num - pre_dev2_num; i++) {
                            Dto map = new BaseDto();
                            map.put("grp_id", pDto.getAsString("grp_id"));//单位编号
                            map.put("trm_no", String.valueOf((maxDevNo + i + 1)));//机具编号
                            map.put("trm_kind", BusiConst.TRMKIND_XF_CODE);//机具型号
                            map.put("trm_name", BusiConst.TRMKIND_XF_CHINESE);//机具名称
                            map.put("state", "0");//状态
                            map.put("down_flag", "0");//状态
                            map.put("ins_date", G4Utils.getCurrentTime("yyyy-MM-dd"));//安装日期
                            alist1.add(map);
                        }
                        g4Dao.batchInsertBaseDto("createDevTrmDomain", alist1);
                    }
                    if (dev2_num < pre_dev2_num) {//删除
                        Dto dto1 = new BaseDto();
                        dto1.put("grp_id", pDto.getAsString("grp_id"));
                        dto1.put("trm_kind", BusiConst.TRMKIND_XF_CODE);
                        int maxDevNo = 20000000;
                        if (g4Dao.queryForObject("getMaxDevTrmNo", dto1) != null) {
                            maxDevNo = (Integer) g4Dao.queryForObject("getMaxDevTrmNo", dto1);
                        }
                        for (int i = 0; i < pre_dev2_num - dev2_num; i++) {
                            Dto map = new BaseDto();
                            map.put("grp_id", pDto.getAsString("grp_id"));//单位编号
                            map.put("trm_no", String.valueOf((maxDevNo - i)));//机具编号
                            alist2.add(map);
                        }
                        g4Dao.batchDelBaseDto(alist2, "deleteDevTrmItem");
                    }
                    // 查询该企业下的主管用户
                    Dto managerDto = (BaseDto) g4Dao.queryForObject("getManagerInfo", pDto);
                    if (managerDto != null) {
                        // 更新菜单
                        g4Dao.delete("deleteEausermenumapByUserId", managerDto); //
                        List<String> menuLst = g4Dao.queryForList("getMenuId4Init", "01");
                        menuLst.addAll(g4Dao.queryForList("getMenuId4Init", "07"));
                        for (String menuPattern : apptype) {
                            if (menuPattern != null) {
                                menuLst.addAll(g4Dao.queryForList("getMenuId4Init", menuPattern));
                            }
                        }
                        List toSaveMenuLst = new ArrayList();
                        for (String menuId : menuLst) {
                            if (G4Utils.isEmpty(menuId))
                                continue;
                            if (menuId.equals("01010105")) // 菜单维护
                                continue;
                            if (menuId.equals("01010301")) // 字典维护
                                continue;
                            if (menuId.equals("01010303")) // 全局参数表维护
                                continue;
                            if (menuId.equals("01010302")) // 异常信息维护
                                continue;
                            if (menuId.equals("01010304")) // 地区信息维护
                                continue;
                            if (menuId.equals("01010305")) // 行业类别维护
                                continue;
                            Dto _pDto = new BaseDto();
                            _pDto.put("userid", managerDto.get("userid"));
                            _pDto.put("menuid", menuId);
                            _pDto.put("authorizeid", IDHelper.getAuthorizeid4Usermenumap());
                            _pDto.put("authorizelevel", ArmConstants.AUTHORIZELEVEL_ACCESS);
                            toSaveMenuLst.add(_pDto);
                        }
                        // 菜单根节点
                        Dto _pDto = new BaseDto();
                        _pDto.put("userid", managerDto.get("userid"));
                        _pDto.put("menuid", "01");
                        _pDto.put("authorizeid", IDHelper.getAuthorizeid4Usermenumap());
                        _pDto.put("authorizelevel", ArmConstants.AUTHORIZELEVEL_ACCESS);
                        toSaveMenuLst.add(_pDto);
                        g4Dao.batchInsertBaseDto("saveSelectedMenu", toSaveMenuLst);
                    }
                    //更新企业信息
                    //如果状态为注销，企业应用开通为停用
                    //g4Dao.update("updateSysGrpsInfo", iDto);
                }

                result = "恭喜您，应用程序初始化成功，请点击[<a href=\"" + basePath + "\">登录</a>]使用系统，^^";
            } catch (Exception e) {
                e.printStackTrace();
                //result = "应用程序安装失败！";
            }

        }
    }
%>
<html>
	<head>
		<title><%=systemTitle%></title>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<link rel="stylesheet" type="text/css" href="style.css">
	</head>
	<body bgcolor="#7CB7E4" text="#000000">
		<table width="95%" border="0" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" align="center">
			<tr>
				<td>
					<table width="98%" border="0" cellspacing="0" cellpadding="0" align="center">
						<tr><td class="install" height="30" valign="bottom"><font color="#FF0000">&gt;&gt;</font> <%=systemTitle%>&nbsp;安装向导</td></tr>
						<tr><td><hr noshade align="center" width="100%" size="1"></td></tr>
<tr>
	<td>
		<font color="#0000EE"> 初始化企业信息及默认管理员帐户</font>
	</td>
</tr>
<tr>
	<td>
		<hr noshade align="center" width="100%" size="1">
	</td>
</tr>
<tr>
	<td>
		<br />
<tr>
	<td align="center">
		<table width="80%" cellspacing="1" bgcolor="#000000" border="0"
			align="center">
			<tr bgcolor="#7CB7E4">
				<td style="color: #FFFFFF; padding-left: 10px" width="32%">
					提示信息
				</td>
			</tr>
			<tr>
				<td class="message">
					<%
					    if (result != null && !result.equals("")) {
					%>
						    <li><font color="#FF0000"><b><%=result%></b></font></li>
					<%
					    }
					%>
					
					<li>设置企业信息</li>
					<li>设置默认管理员帐户</li>
					<li>设置应用类型</li>
					<%
					    for (String msg : msgList) {
					        out.println("<font color=\"#FF0000\"><li>" + msg + "</li></font>");
					    }
					%>
				</td>
			</tr>
		</table>
		<br />
	</td>
</tr>
<tr>
	<td align="center">
		<form method="post" action="init.jsp" onsubmit="return validateFrm();">
			<table width="80%" cellspacing="1" bgcolor="#000000" border="0"
				align="center">
				<tr bgcolor="#7CB7E4">
					<td style="color: #FFFFFF; padding-left: 10px" colspan="2">
						设置企业信息（<font color="#FF0000">输入项全为必填</font>）
					</td>
				</tr>
				<tr>
					<td class="altbg1" width="20%">
						&nbsp;单位代码:
					</td>
					<td class="altbg2" width="80%">
						&nbsp;
						<input type="text" name="grp_id" id="grp_id" size="30" maxlength="10">&nbsp;（<font color="#FF0000">长度10位，只能为数字</font>）
					</td>
				</tr>
				<tr>
					<td class="altbg1">
						&nbsp;单位名称:
					</td>
					<td class="altbg2">
						&nbsp;
						<input type="text" name="grp_name" id="grp_name" size="30" maxlength="20">
					</td>
				</tr>
				<tr>
					<td class="altbg1">
						&nbsp;单位规模（人数）:
					</td>
					<td class="altbg2">
						&nbsp;
						<input type="text" name="grp_size" id="grp_size" size="30" maxlength="7">&nbsp;（<font color="#FF0000">只能为数字</font>）
					</td>
				</tr>
				<tr>
					<td class="altbg1">
						&nbsp;持卡人数:
					</td>
					<td class="altbg2">
						&nbsp;
						<input type="text" name="issu_num" id="issu_num" size="30" maxlength="7">&nbsp;（<font color="#FF0000">只能为数字</font>）
					</td>
				</tr>
				<tr>
					<td class="altbg1">
						&nbsp;所属城市:
					</td>
					<td class="altbg2">
						&nbsp;
						<select id="city_code" name="city_code">
							<option value="5700">衢州</option>
							<option value="5710">杭州</option>
							<option value="5720">湖州</option>
							<option value="5730">嘉兴</option>
							<option value="5740">宁波</option>
							<option value="5750">绍兴</option>
							<option value="5760">台州</option>
							<option value="5770">温州</option>
							<option value="5780">丽水</option>
							<option value="5790">金华</option>
							<option value="5800">舟山</option>
						</select>
					</td>
				</tr>
				<tr>
                    <td class="altbg1">
                        &nbsp;消费机数量:
                    </td>
                    <td class="altbg2">
                        &nbsp;
                        <select id="dev2_num" name=dev2_num>
                            <option value="0">0</option>
                            <option value="1" selected="selected">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td class="altbg1">
                        &nbsp;考勤机数量:
                    </td>
                    <td class="altbg2">
                        &nbsp;
                        <select id="dev4_num" name=dev4_num>
                            <option value="0">0</option>
                            <option value="1" selected="selected">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                        </select>
                    </td>
                </tr>
				<!--<tr>
					<td class="altbg1">
						&nbsp;行业类别:
					</td>
					<td class="altbg2">
						&nbsp;
						<select id="apl_type" name="apl_type">
							<option value="001">党委政府</option>
							<option value="002">城管</option>
							<option value="003">水利</option>
							<option value="004">环保</option>
							<option value="005">税务</option>
							<option value="006">社保</option>
							<option value="007">公安</option>
							<option value="008">司法</option>
							<option value="009">医卫 </option>
							<option value="010">教育</option>
							<option value="011">农业(含海渔)</option>
							<option value="012">林业</option>
							<option value="013">金融保险 </option>
							<option value="014">交通物流</option>
							<option value="015">电力</option>
							<option value="016">烟草</option>
						</select>
					</td>
				</tr>-->
			</table>
			<br />
			<table width="80%" cellspacing="1" bgcolor="#000000" border="0"
				align="center">
				<tr bgcolor="#7CB7E4">
					<td style="color: #FFFFFF; padding-left: 10px" colspan="2">
						设置默认管理员帐户（<font color="#FF0000">输入项全为必填</font>）
					</td>
				</tr>
				<tr>
					<td class="altbg1" width="20%">
						&nbsp;管理员姓名:
					</td>
					<td class="altbg2" width="80%">
						&nbsp;
						<input type="text" name="username" id="username" size="30" maxlength="5">
					</td>
				</tr>
				<tr>
					<td class="altbg1" width="20%">
						&nbsp;管理员编号:
					</td>
					<td class="altbg2" width="80%">
						&nbsp;
						<input type="text" name="account" id="account" size="30" maxlength="10">&nbsp;（<font color="#FF0000">长度不能超过10位（数字加字母）</font>）
					</td>
				</tr>
				<tr>
					<td class="altbg1">
						&nbsp;管理员密码:
					</td>
					<td class="altbg2">
						&nbsp;
						<input type="password" name="password" id="password" size="30" maxlength="6">
					</td>
				</tr>
				<tr>
					<td class="altbg1">
						&nbsp;重复密码:
					</td>
					<td class="altbg2">
						&nbsp;
						<input type="password" name="password2" id="password2" size="30" maxlength="6">
					</td>
				</tr>
			</table>
			<br/>
			<table width="80%" cellspacing="1" bgcolor="#000000" border="0"
				align="center">
				<tr bgcolor="#7CB7E4">
					<td style="color: #FFFFFF; padding-left: 10px" colspan="6">
						设置应用类型
					</td>
				</tr>
				<tr>
					<td class="altbg1" width="20%">
						&nbsp;应用类型:
					</td>
					<td class="altbg2" width="16%">
						&nbsp;
						<input type="checkbox" name="apptype" value="07">卡务
					</td>
					<td class="altbg2" width="16%">
						&nbsp;
						<input type="checkbox" name="apptype"  value="04">考勤
					</td>
					<td class="altbg2" width="16%">
						&nbsp;
						<input type="checkbox" name="apptype" value="08">门禁
					</td>
					<td class="altbg2" width="16%">
						&nbsp;
						<input type="checkbox" name="apptype" value="05">消费
					</td>
					<td class="altbg2" width="16%">
						<!--&nbsp;
						<input type="checkbox" name="apptype" value="09">会议-->
					</td>
				</tr>
			</table>
			<input type="hidden" name="action" value="init">
			<input type="submit" name="submit" id="submitbtn" value="设置 " style="height: 25">
		</form>
	</td>
</tr>
<script type="text/javascript">
	function $(id){
		return document.getElementById(id);		
	}
	
	function isNumber(sText)
	{ 
		var ValidChars = "0123456789.-";
		var IsNumber=true;
		var Char;
		for (i = 0;i < sText.length && IsNumber == true;i++){ 
			Char = sText.charAt(i);
			if (ValidChars.indexOf(Char) == -1){
				IsNumber = false;
			}
		}
		return IsNumber;  
	}
	
	function validateFrm(){
		var grp_id = $("grp_id");
		if (!isNumber(grp_id.value)) {
            alert("请填写正确的单位代码.");
            grp_id.focus();
            return false;
        }
	 	if (grp_id.value.length != 10) {
        	alert("请填写10位的单位代码.");
            grp_id.focus();
            return false;
        }
		
		var grp_name=$("grp_name");
		if(grp_name.value==''){
        	alert("请填写单位名称的中文名！");
            grp_name.focus();
        	return false;
        }
        obj=grp_name.value.match(/^[\u4e00-\u9fa5]*$/g);
        if(obj==null)
        {
            alert("请填写单位名称的中文名！");
            grp_name.focus();
            return false;
        }
        
        var grp_size = $("grp_size");
        if(grp_size.value==''){
        	alert("请填写正确的单位规模.");
            grp_size.focus();
        	return false;
        }
		if (!isNumber(grp_size.value)) {
            alert("请填写正确的单位规模.");
            grp_size.focus();
            return false;
        }
        
        var issu_num = $("issu_num");
        if(issu_num.value==''){
        	alert("请填写正确的持卡人数.");
            issu_num.focus();
        	return false;
        }
		if (!isNumber(issu_num.value)) {
            alert("请填写正确的持卡人数.");
            issu_num.focus();
            return false;
        }
        
        var username=$("username");
        if(username.value==''){
        	alert("请填写管理员的中文名！");
            username.focus();
        	return false;
        }
        
        obj=username.value.match(/^[\u4e00-\u9fa5]*$/g);
        if(obj==null)
        {
            alert("请填写管理员的中文名！");
            username.focus();
            return false;
        }
        
        var account = $("account");
        if(account.value==''){
            alert("请填写管理员编号！");
            account.focus();
            return false;
        }
        obj = account.value.match(/^[a-zA-Z0-9]+$/g);
        if(obj==null)
        {
            alert("请填写正确的管理员编号！");
            username.focus();
            return false;
        }
        
		/*if (!isNumber(account.value)) {
            alert("请填写正确的管理员编号.");
            account.focus();
            return false;
        }*/
	 	/*if (account.value.length != 10) {
        	alert("请填写10位的管理员编号.");
            account.focus();
            return false;
        }*/
	 	
	 	var password1 = $('password');
	 	var password2 = $('password2');
	 	if(password1.value==''){
			alert("请填写管理员密码.");
			password1.focus();
			return false;
		}
	 	if(password2.value==''){
			alert("请填写重复密码.");
			password2.focus();
			return false;
		}
		if(password1.value != password2.value){
			alert("密码不一致.");
			password1.focus();
			return false;
		}
		
		var checkarr = document.getElementsByName("apptype");
		var checkedcnt = 0;
		for(i=0;i<checkarr.length;i++){
			if(checkarr[i].checked == true){
				checkedcnt++;
			}
		}
		if(checkedcnt==0){
			alert("应用类型必须选择一项.");
			return false;
		}
		
		document.getElementById("submitbtn").disabled = true;
		return true;
	}
</script>