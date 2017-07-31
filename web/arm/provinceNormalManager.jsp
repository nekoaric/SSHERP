<%@ page contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<eRedG4:html title="省级人员管理与授权">
<eRedG4:ext.codeRender fields="USERTYPE"/>
<eRedG4:import src="/arm/js/provinceNormalManager.js"/>
<eRedG4:body>
<eRedG4:div key="deptTreeDiv"></eRedG4:div>
<eRedG4:div key="userGridDiv"></eRedG4:div>
</eRedG4:body>
<eRedG4:script>
   var root_deptid = '<eRedG4:out key="rootDeptid" scope="request"/>';
   var root_deptname = '<eRedG4:out key="rootDeptname" scope="request"/>';
   var root_usertype = '<eRedG4:out key="rootusertype" scope="request"/>';
</eRedG4:script>
</eRedG4:html>