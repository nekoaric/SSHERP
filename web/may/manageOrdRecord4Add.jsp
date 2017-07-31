<%@ page contentType="text/html; charset=utf-8" %>
<%@ include file="/common/include/taglib.jsp" %>
<%@ include file="/common/include/ocxtaglib_card.jsp" %>
<eRedG4:html title="订单记录管理" uxEnabled="true">
    <object id="LODOP_OB" classid="clsid:2105C259-1E0C-4534-8141-A753534CB4CA" width="0" height="0" style="position:absolute;left:0px;top:-10px;"> </object>
    <object id="LODOP_EM" type="application/x-print-lodop" width="0" height="0" style="position:absolute;left:0px;top:-10px;"></object>
    <!--  
    <object  id="LODOP_OB" classid="clsid:2105C259-1E0C-4534-8141-A753534CB4CA" width="0" height="0"> 
        <embed id="LODOP_EM" type="application/x-print-lodop" width="0" height="0" pluginspage="install_lodop.exe"/>
    </object>
    -->
	<eRedG4:import src="/resource/lodop/LodopFuncs.js"/> 
    <eRedG4:import src="/resource/extjs3.1/ux/css/lovcombo.css"/>
    <eRedG4:import src="/resource/extjs3.1/ux/lovcombo.js"/>
    <eRedG4:script>
        var user_name = '<eRedG4:out key="user_name" scope="request"/>';
    </eRedG4:script>
    <eRedG4:import src="/may/js/manageOrdRecord4AddMode2.js"/>
<%--    <eRedG4:import src="/may/js/manageOrdRecord4Add.js"/>--%>
    <eRedG4:import src="/baseComponent/queryOrderInfoDetailMode2.js"/>
    <eRedG4:import src="/may/js/ordQueryWindow.js"/>
    <eRedG4:import src="/cnnct/cardinterface/readCard.js"/>
</eRedG4:html>