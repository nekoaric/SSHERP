<%@ page contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<eRedG4:html title="部门管理">
<eRedG4:import src="/cnnct/rfid/js/getSysDeptInfo.js"/>
<eRedG4:body>
</eRedG4:body>
<eRedG4:ext.uiGrant/>
<eRedG4:script>
   var root_dept_id = '<eRedG4:out key="root_dept_id" scope="request"/>';
   var root_dept_name = '<eRedG4:out key="root_dept_name" scope="request"/>';
   var root_usertype = '<eRedG4:out key="root_usertype" scope="request"/>';
</eRedG4:script>
</eRedG4:html>