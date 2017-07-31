<%@ page contentType="text/html; charset=utf-8"%>
<html>
    <head>
        <title>流水数据输入</title>
        <meta http-equiv="pragma" content="no-cache"/>
        <meta http-equiv="cache-control" content="no-cache,must-revalidate"/>
        <meta content="width=device-width,user-scalable=no" name="viewport"/>
        <style type="text/css">
            table{border-collapse:collapse;border-spacing:0;border-left:1px solid #888;border-top:1px solid #888;background:#efefef;}
            th,td{border-right:1px solid #888;border-bottom:1px solid #888;padding:5px 15px;}
            th{font-weight:bold;background:#ccc;}
        </style>
        <script type="text/javascript" src="./loginMode2/QC/js/qcQueryInfo.js" ></script>
        <script type="text/javascript" src="./loginMode2/js/XMLHttpRequest.js"></script>
        <script type="text/javascript" src="./loginMode2/js/orderInfoFeedback.js"></script>
    </head>
    <body>
        <div style="width:100%;height:20%">
            <img style="width: 100%;height:100%" src="./loginMode2/QC/picture/jduLOGO.png"/>
        </div>
        <div align="center" style="width:100%; text-align: right; display:none">
            <input type="button" value="返回" id=""/>
            <input type="button" value="退出"/>
        </div>
        <div align="center" >
            <input id="fbOrderInfoButton" type="button" value="订单反馈(找不到订单时使用)"/>
        </div>
        <div style="height:2px;"></div>
        <div id="prodordViewDiv" align="center">
            <table>
                <tr>
                    <td align="right">选择样式：</td>
                    <td>
                        <select id="qcClass">
                            <option value="">请选择...</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td align="right">款号(查询):</td>
                    <td>
                        <input type="text" id="styleNo"/>
                    </td>
                </tr>
                <tr>
                    <td align="right">PO#(查询):</td> 
                    <td>
                       <input type="text" id="orderId" />
                     </td>
                </tr>
                <tr>
                    <td colspan="2">
                     <input type="button" id="queryPOButton" value="查询PO#(输入出货数量)" style="width:100%; height:30px;" />
                    </td>
                </tr>
              
            </table>
        </div>
        </div>
        <div>
                <div>
                    <p>
                        <span style="background-color:#dbb20f">-- 款号</span>
                        <br>
                        <span style="background-color:#a3ebfa">---- PO# / 标记 / 指令数 </span>
                    </p>
                </div>
                <ul id="productTreeDiv"></ul>
        </div>
        <div align="center">
            <input type="button" id="nextStep" value="下一步" style="width:300px; height:30px;"/>
        </div>
<%--    底部留出空格    --%>
        <div style="height:200px;"></div>
    </body>
</html>
