<%@ page contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<eRedG4:html title="角色管理与授权" uxEnabled="true">
<eRedG4:import src="/cnnct/sys/js/manageRole4Admin.js"/>
<eRedG4:body>
</eRedG4:body>
<eRedG4:script>
   var root_deptid = '<eRedG4:out key="rootDeptid" scope="request"/>';
   var root_deptname = '<eRedG4:out key="rootDeptname" scope="request"/>';
   var root_usertype = '<eRedG4:out key="rootusertype" scope="request"/>';
</eRedG4:script>
</eRedG4:html>