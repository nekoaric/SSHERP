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
        <script type="text/javascript" src="./loginMode2/js/productMobile.js" ></script>
        <script type="text/javascript" src="./loginMode2/js/XMLHttpRequest.js"></script>
        <script type="text/javascript" src="./loginMode2/js/orderInfoFeedback.js"></script>
        <script type="text/javascript">
        /*设置操作的数量性质*/
        var natureFlag = '${requestScope.natureFlag}';
        </script>
    </head>
    <body>
<%--  隐藏DIV用来保存JS所需的信息  --%>
        <div align="center">
        <div align="center" style="color:#FF0000">出运数量操作
        </div>
        <div align="center">工号:${requestScope.account}  姓名:${requestScope.name}</div>
        <div align="center">
            <input type="button" value="设置工厂" id="setFacButton"/>
            <input type="button" disabled="disabled" value="返回菜单" id="requestMenu"/>
            <input type="button" value="订单反馈(找不到订单时使用)" id="fbOrderInfoButton"/>
            <input type="button" value="退出" id="quitButton"/>
        </div>
        <div id="prodordViewDiv">
            <table>
                <tr>
                    <td align="right">工厂:</td>
                    <td>
                        <select id="myGrpsSelect">
                        </select>
                    </td>
                </tr>
                <tr>
                    <td align="right">操作日期:</td>
                    <td>
                        <input type="text"  placeholder="请用标准格式" id="opr_date"/>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        操作日期标准格式为：2000-01-02或20000102
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
                        <span style="background-color:#a3ebfa">---- PO# / 标记 / 客户 / 指令数 / 出运数量累计数</span>
                    </p>
                </div>
                <ul id="productTreeDiv"></ul>
                <table align="center">
                    <tr>
                        <td align="right">备注:</td>
                        <td>
                            <textarea rows="10" cols="30" id="ordNumRemark"></textarea>
                        </td>
                    </tr>
                </table>
        </div>
        <div align="center">
            <input type="button" id="saveProductNums" value="保存数量" style="width:300px; height:30px;"/>
        </div>
<%--    底部留出空格    --%>
        <div style="height:200px;"></div>
    </body>
</html>
