<%@ page contentType="text/html; charset=utf-8" %>
<%@ include file="/common/include/taglib.jsp" %>
<eRedG4:html title="订单总进度" uxEnabled="true" fcfEnabled="true">
<eRedG4:import src="/cnnct/rfid/js/getDeptDaySche.js"/>
<%--<eRedG4:import src="/resource/chartJs/jquery-2.0.3.js"/>--%>
<eRedG4:import src="/resource/jquery/jquery-1.9.1.js"/>
<eRedG4:import src="/resource/chartJs/highcharts.js"/>
<eRedG4:import src="/resource/chartJs/exporting.js"/>
<eRedG4:body>
    <eRedG4:flashReport type="2DC" dataVar="xmlString" id="my2DCChart" align="center" height="450" width="1000"
                        visible="false"/>
</eRedG4:body>
</eRedG4:html>