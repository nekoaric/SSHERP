<%@ page contentType="text/html; charset=UTF-8"%>
<%@ include file="/common/include/taglib.jsp"%>
<eRedG4:html showLoading="false" extDisabled="true">
<style type="text/css" ref="stylesheet">
body {
scrollbar-face-color: #ed0c0f ; 
scrollbar-highlight-color: #ed0c0f; 
scrollbar-darkshadow-color: #ed0c0f;
scrollbar-3dlight-color: #ed0c0f; 
scrollbar-arrow-color: #ed0c0f; 
scrollbar-track-color: #ed0c0f; 
scrollbar-darkshadow-color: #ed0c0f;
}
</style>
<eRedG4:import src="/arm/js/welcome.js"/>
<eRedG4:body>
    <% Object loginFlag = request.getAttribute("loginFlag");
        if (loginFlag!=null&&"csr".equals(loginFlag)){%>
    <fieldset style="width:180px; height:40px;">
        <legend>验厂文件操作</legend>
        <p id='clickCsrFile' style="color:blue"><U>打开验厂文件上传菜单</U></p>
    </fieldset>
    <%}%>
<eRedG4:div key="qsInfoDiv"></eRedG4:div>
</eRedG4:body>
<eRedG4:script>
    function FireEvent(controlID, eventName){
        if (document.all){// For IE.
            eval("document.getElementById(\"" + controlID + "\")." + eventName + "();");
        }else{// For Nescape
            var e = document.createEvent('HTMLEvents');
            e.initEvent(eventName, false, false);
            document.getElementById(controlID).dispatchEvent(e);
        }
    }

    //当welcome页面载入时触发index页面中id为"showCsrFileId"的点击事件(即告之welcome载入完成)
    //处理这个事件的程序在ArmViewportTag.tpl文件中
    FireEvent("showCsrFileId", "click");

</eRedG4:script>
</eRedG4:html>
