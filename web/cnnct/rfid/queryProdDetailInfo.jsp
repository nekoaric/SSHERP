<%@ page contentType="text/html; charset=utf-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<eRedG4:html title="产品在哪里"  fcfEnabled="true">
<%--<eRedG4:import src="/resource/chartJs/jquery-2.0.3.js"/>--%>
<eRedG4:import src="/resource/jquery/jquery-1.9.1.js"/>
<eRedG4:import src="/resource/chartJs/highcharts.js"/>
<eRedG4:import src="/resource/chartJs/exporting.js"/>
<eRedG4:import src="/cnnct/rfid/js/queryProdDetailInfo.js"/>
<eRedG4:import src="/resource/extjs3.1/ux/css/lovcombo.css"/>
<eRedG4:import src="/resource/extjs3.1/ux/lovcombo.js"/>
<eRedG4:ext.uiGrant/>
<eRedG4:script>
</eRedG4:script>
<style type="text/css">
    .x-grid3-row td,.x-grid3-summary-row td{
        border-right: 1px solid #eceff6 !important;/*控制表格列线*/
        border-top: 1px solid #eceff6 !important;/*控制表格行线*/
    }
</style>
</eRedG4:html>  