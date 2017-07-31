<%@ page contentType="text/html; charset=utf-8"%>
<html>
    <head>
<%--  qC检查项  --%>
        <meta http-equiv="pragma" content="no-cache"/>
        <meta http-equiv="cache-control" content="no-cache,must-revalidate"/>
        <meta content="width=device-width,user-scalable=no" name="viewport"/>
        <script type="text/javascript" src="./loginMode2/QC/js/qcNum.js"></script>
    <script type="text/javascript" src="./loginMode2/js/XMLHttpRequest.js"></script>
<%--    图标所需JS    --%>
        <script type="text/javascript"  src="./resource/jquery/jquery-1.9.1.min.js"></script>
        <script type="text/javascript" src="./resource/chartJs/highcharts.js"></script>
        <style type="text/css">
            .middleDiv{
                text-align:center;
                vertical-align:middle;
            }
        </style>
    </head>
    <body>
        <div style="width:100%;height:20%;">
<%--    logo    --%>    
            <img style="width: 100%;height:100%" src="./loginMode2/QC/picture/jduLOGO.png"/>
        </div>
        <div style="width:100%;height:40px;position: relative;background-color: #f8bf59">
            <div style="top:20%;position: absolute;width:80%;height:60%;left:20%">
                <input type="button" id="showQcPieChart4totalNum" style="font-size:15px;" value="统计饼图"/>
                <input type="button" id="showQcPieChart4detailNum" style="font-size: 15px;" value="详细饼图" />
                <input type="button" id="hideQcPieChart" style="font-size:15px;display:none;" value="隐藏饼图" />
            </div>
        </div>
        <div style="widht;100%;height:40px;position: relative;background-color: #f8bf59">
            <div style="position:absolute;top:20%;position: relative;">
                <span id="showCascadeInfoSpan" style="font-size:18px;"></span>
            </div>
        </div>
        
<%--    饼图DIV    --%>
        <div id="pieChartDiv" style="display:none">
            
        </div>
<%--    数量信息div    --%>
        <div id="qcNumDiv">
            <div id="qcNumViewDiv" class="middleDiv" style="position:relative;width: 100%">
            </div>
            <div style="height:20px"></div>
            <div id="backButtonDiv" style="width: 100%;height:40px;position: relative;vertical-align: bottom;display: none">
                <input type="button" id="backPreviousButton" value="返回上一级" style="width: 100%;height: 100%"/>
            </div> 
            <div id="cancelButtonDiv" style="width: 100%;height:40px;position: relative;vertical-align: bottom;display:none">
                <input type="button" id="cancelButton" value="撤销" style="width: 100%;height: 100%"/>
            </div>
            <div id="submitButtonDiv" style="width: 100%;height:40px;position: relative;vertical-align: bottom;">
                <input type="button" id="submitButton" value="保存QC数据" style="width: 100%;height: 100%"/>
            </div>
        </div>
    </body>
    
    
</html>
