<%@ page contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<eRedG4:html title="操作员事件跟踪" uxEnabled="true">
<eRedG4:ext.codeRender fields="USERTYPE"/>
<eRedG4:import src="/arm/js/eventTrack.js"/>
<eRedG4:body>
<!--<eRedG4:div key="areaTreeDiv"></eRedG4:div>-->
<eRedG4:div key="eventGridDiv"></eRedG4:div>
</eRedG4:body>
<eRedG4:script>
   var root_areaid = '<eRedG4:out key="rootAreaid" scope="request"/>';
   var root_areaname = '<eRedG4:out key="rootAreaname" scope="request"/>';
</eRedG4:script>
</eRedG4:html>