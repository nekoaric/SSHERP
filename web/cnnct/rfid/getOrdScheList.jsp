<%@ page contentType="text/html; charset=utf-8" %>
<%@ include file="/common/include/taglib.jsp" %>
<eRedG4:html title="订单总进度" fcfEnabled="true">
<eRedG4:ext.myux uxType="gridsummary"/>
<eRedG4:import src="/baseComponent/srChartWindow.js"/>
<eRedG4:import src="/cnnct/rfid/js/getOrdScheList.js"/>
<eRedG4:import src="/resource/jquery/jquery-1.9.1.js"/>
<eRedG4:import src="/resource/chartJs/highcharts.js"/>
<eRedG4:import src="/resource/chartJs/exporting.js"/>
<eRedG4:import src="/resource/extjs3.1/ux/css/lovcombo.css"/>
<eRedG4:import src="/resource/extjs3.1/ux/lovcombo.js"/>
<eRedG4:import src="/resource/extjs3.1/ux/LockingGridView.js"/>
<eRedG4:import src="/resource/extjs3.1/ux/css/LockingGridView.css"/>
<eRedG4:import src="/baseComponent/queryOrderInfoDetail.js"/>
<eRedG4:body>
<%--    <eRedG4:flashReport type="2DC_MS" dataVar="xmlString" id="my2DCMSChart" align="center" height="100%" width="100%"--%>
<%--                        visible="false"/>--%>
</eRedG4:body>
</eRedG4:html>