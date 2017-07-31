<%@ page contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<eRedG4:html title="人员管理与授权">
<eRedG4:ext.codeRender fields="USERTYPE"/>
<eRedG4:import src="/arm/js/provinceManager.js"/>
<eRedG4:body>
<eRedG4:div key="areaTreeDiv"></eRedG4:div>
<eRedG4:div key="userGridDiv"></eRedG4:div>
</eRedG4:body>
<eRedG4:script>
   var root_usertype = '<eRedG4:out key="rootusertype" scope="request"/>';
   var root_areaid = '<eRedG4:out key="rootAreaid" scope="request"/>';
   var root_areaname = '<eRedG4:out key="rootAreaname" scope="request"/>';
</eRedG4:script>
</eRedG4:html>