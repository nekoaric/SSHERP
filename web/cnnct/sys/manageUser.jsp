<%@ page contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<%@ include file="/common/include/ocxtaglib.jsp"%>
<eRedG4:html title="用户管理与授权">
<eRedG4:import src="/cnnct/cardinterface/cardinterface.js"/>
<eRedG4:import src="/cnnct/sys/js/manageUser.js"/>
<eRedG4:body>
</eRedG4:body>
<eRedG4:script>
   var root_deptid = '<eRedG4:out key="rootDeptid" scope="request"/>';
   var root_deptname = '<eRedG4:out key="rootDeptname" scope="request"/>';
   var root_usertype = '<eRedG4:out key="rootusertype" scope="request"/>';
   var manageDeptRoleId = '<eRedG4:out key="manageDeptRoleId" scope="request"/>';
</eRedG4:script>
</eRedG4:html>