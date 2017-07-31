<%@ page language="java" contentType="text/xml; charset=GBK"%>
<%

    String xmlStr = "<chart formatNumberScale='0' xAxisName='数量流程' baseFontSize='12' decimalPrecision='0' baseFont='宋体' animation='0' formatNumber='0' caption='订单短缺图' numberPrefix='' canvasBorderThickness='1'><set color='AFD8F8' name='领片短缺' value='0'/><set color='F6BD0F' name='下线短缺' value='0'/><set color='8BBA00' name='水洗收短缺' value='0'/><set color='008E8E' name='水洗交短缺' value='0'/><set color='D64646' name='后整少收' value='0'/><set color='8E468E' name='后整短缺' value='0'/></chart>";

    out.write(xmlStr);

%>