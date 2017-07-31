<%@ page contentType="text/html; charset=utf-8"%>
<html>
    <head>
        <title>设置我的订单</title>
        <meta http-equiv="pragma" content="no-cache"/>
        <meta http-equiv="cache-control" content="no-cache,must-revalidate"/>
        <meta content="width=device-width,user-scalable=yes" name="viewport"/>
        <script type="text/javascript" src="./loginMode2/js/selectMyOrder.js"></script>
        <script type="text/javascript" src="./loginMode2/js/XMLHttpRequest.js"></script>
        <script type="text/javascript" src="./loginMode2/js/orderInfoFeedback.js"></script>
    </head>
    <body>
        <div align="center" style="color:#FF0000">设置我的订单</div>
        <div align="center">工号:${requestScope.account}  姓名:${requestScope.name}</div>
        <div align="center"><input id="fbOrderInfoButton" type="button" value="订单反馈(找不到订单时使用)"></div>
        <div align="center">
            <table>
                <tr>
                    <td align="right">款号:</td>
					<td>
						<input type="text" placeholder="查询款号"  id="style"/>
					</td>
				</tr>
				<tr>
					<td align="right">PO#:</td>
					<td>
						<input type="text" placeholder="查询PO号" id="orderId"/>
					</td>
                </tr>
				<tr>
					<td></td>
					<td>
						<input type="button" value="      查询     " id="queryButton"/>
					</td>
				</tr>
				<tr>
					<td  style="color:red">红色字体为已经出货的订单</td>
				</tr>
				<tr style="display:none">
					<td align="right">查询结果PO号:</td>
					<td>
						<select id="resultOrders">
							<option>选择结果</option>
						</select>
					</td>
				</tr>
				<tr style="display:none">
					<td colspan="2">
						<input type="button" value="添加我的订单" id="addMyOrder"/>
						<input type="button" value="取消我的订单" id="cancelMyOrder"/>
					</td>
				</tr>
            </table>
        </div>
        <div>
            <ul id="selectMyOrderTree"></ul>
        </div>
        <div>
            <input type="button" value="保存我的订单 " id="saveMyOrderButton"/>
            <input type="button" value="去数量操作页面" id="backButton"/>
        </div>
    </body>
</html>
