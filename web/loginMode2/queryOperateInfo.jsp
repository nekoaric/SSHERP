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
        <script type="text/javascript" src="./loginMode2/js/queryOperateInfo.js" ></script>
        <script type="text/javascript" src="./loginMode2/js/XMLHttpRequest.js"></script>
    </head>
    <body>
        <div align="center">
	        <div align="center" style="color:#FF0000">查询当天操作信息</div>
	        <div align="center">工号:${requestScope.account}  姓名:${requestScope.name}</div>
        </div>
        <div align="center">
            <input type="button" disabled="disabled" value="返回菜单" id="requestMenu"/>
            <input type="button" value="退出" id="quitButton"/>
        </div>
        <div>
            <ul>
                <div  style="background-color:#0d7ae7"><li>款号:</li></div>
                    <ul>
                        <div style="background-color:#429cf5"><li> 订单号  / 标记号</li></div>
	                        <ul>
	                            <li style="background-color:#8ac2f9">数量日期  / 数量性质 / 数量</li>
	                        </ul>
                    </ul>
            </ul>
            <ul id="rootTree"></ul>
        </div>
    </body>
</html>
