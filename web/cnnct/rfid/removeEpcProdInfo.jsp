<%@ page contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<%@ include file="/common/include/ocxtaglib.jsp"%>
<eRedG4:html title="标签产品解绑">
<eRedG4:import src="/cnnct/cardinterface/cardinterface.js"/>
<eRedG4:import src="/cnnct/rfid/js/removeEpcProdInfo.js"/>
<eRedG4:body>
<eRedG4:div key="deptTreeDiv"></eRedG4:div>
<eRedG4:div key="deptGridDiv"></eRedG4:div>
</eRedG4:body>
<eRedG4:ext.uiGrant/>
<eRedG4:script>
   var root_dept_id = '<eRedG4:out key="root_dept_id" scope="request"/>';
   var root_dept_name = '<eRedG4:out key="root_dept_name" scope="request"/>';
   var root_usertype = '<eRedG4:out key="root_usertype" scope="request"/>';
</eRedG4:script>
</eRedG4:html>  