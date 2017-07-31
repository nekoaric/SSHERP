<%@ page contentType="text/html; charset=UTF-8" %>
<%
String incode = (String)request.getParameter("code");
String rightcode = (String)session.getAttribute("numrand");
if (incode != null && rightcode != null)
if (rightcode.equals(incode))
{
out.write("success");
}
else
{
out.write("wrong");
}
%>