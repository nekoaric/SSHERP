<%@ page contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<eRedG4:html title="完单报告管理">
<eRedG4:script>
    var login_id = '<eRedG4:out key="login_id" scope="request"/>';
    var login_name = '<eRedG4:out key="login_name" scope="request"/>';
</eRedG4:script>
    <eRedG4:import src="/baseComponent/queryGrpAndDeptDetail.js"/>
    <eRedG4:import src="/resource/jquery/jquery-1.9.1.js"/>
    <eRedG4:import src="/resource/chartJs/highcharts.js"/>
    <eRedG4:import src="/resource/chartJs/exporting.js"/>
	<eRedG4:import src="/baseComponent/queryFactoryInfo.js"/>
	<eRedG4:import src="/baseComponent/srChartWindow.js"/>
	<eRedG4:import src="/baseComponent/queryOrderInfoDetail.js"/>
	<eRedG4:import src="/cnnct/rfid/js/orderReportInfo.js"/>
<eRedG4:body>
</eRedG4:body>
</eRedG4:html>