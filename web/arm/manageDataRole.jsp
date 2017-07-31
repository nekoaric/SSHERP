<%@ page contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<eRedG4:html title="数据角色管理与授权">
<eRedG4:import src="/arm/js/manageDataRole.js"/>

<cc:import src="/resource/extjs3.1/ux/css/lovcombo.css"/>
<cc:import src="/resource/extjs3.1/ux/lovcombo.js"/>

<eRedG4:body>
<eRedG4:div key="deptTreeDiv"></eRedG4:div>
<eRedG4:div key="roleGridDiv"></eRedG4:div>
<input type="hidden" id="operatorTab_roleid" name="operatorTab_roleid" value="8888" />
</eRedG4:body>
<eRedG4:script>
   var deptid = '<eRedG4:out key="deptid" scope="request"/>';
   var deptname = '<eRedG4:out key="deptname" scope="request"/>';
   var root_usertype = '<eRedG4:out key="rootusertype" scope="request"/>';
</eRedG4:script>
</eRedG4:html>