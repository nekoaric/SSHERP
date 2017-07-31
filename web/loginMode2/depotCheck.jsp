<%@ page contentType="text/html; charset=utf-8"%>
<html>
    <head>
        <title>仓库盘点输入</title>
        <meta http-equiv="pragma" content="no-cache"/>
        <meta http-equiv="cache-control" content="no-cache,must-revalidate"/>
        <meta content="width=device-width,user-scalable=no" name="viewport"/>
        <style type="text/css">
            table{border-collapse:collapse;border-spacing:0;border-left:1px solid #888;border-top:1px solid #888;background:#efefef;}
            th,td{border-right:1px solid #888;border-bottom:1px solid #888;padding:5px 15px;}
            th{font-weight:bold;background:#ccc;}
            .ordnumInp{
                width : 70px;
            }
        </style>
        <script type="text/javascript" src="./loginMode2/js/depotCheck.js" ></script>
        <script type="text/javascript" src="./loginMode2/js/XMLHttpRequest.js"></script>
        <script type="text/javascript" src="./resource/jquery/jquery-1.9.1.js"></script>
    </head>
    <body>
<%--  隐藏DIV用来保存JS所需的信息  --%>
        <div align="center">
        <div align="center" style="color:#FF0000">仓库盘点输入
        </div>
        <div align="center">工号:${requestScope.account}  姓名:${requestScope.name}</div>
        <div align="center">
            <input type="button" value="设置工厂" id="setFacButton"/>
            <input type="button" value="返回菜单" id="requestMenu"/>
            <input type="button" value="退出" id="quitButton"/>
        </div>
        <div style="color:#999999">
        </div>
        <div id="selectFacAndDateDiv">
            <table>
            <form id="form"  method="post">
                <tr>
                    <td align="right">工厂:</td>
                    <td >
                        <select id="myGrpsSelect" name="factory">
                            <option>一分厂</option>
                        </select>
                    </td>
                    <td>
                    	<span id="cur_date_show" name="tr_date"></span>
                    </td>
                </tr>
                <tr >
                    <td align="right"><font color="#ff0000">*</font>款号:</td>
                    <td>
                        <input type="text"  id="style_no_read"/>
                    <td>
                        <select id="style_noSelect"  >
                        </select>
                        <input type="button"  value="查询" id="selectStyleNo"/>
                    </td>
                </tr>
                
                <tr>
                    <td align="right"><font color="#ff0000">*</font>品牌:</td>
                    <td >
                    	<input type="text"  id="brandInput"/></td>
                    <td>
                        <select id="brandSelect" >
                        </select>
                    </td>
                </tr>
                <tr> 
                	<td align="right">品名:</td> 
                    <td ><input type="text" name="article" id="article"/></td>
                    <td></td>
                </tr>
                <tr><td colspan="3"></tr>
                <tr>
                    <td align="center"></td>
                    <td align="center">本次盘点数</td>
                    <td align="center">累计盘点数</td>
                </tr>
                </thead>
                <tbody>
	                <tr><td align="right">良余</td><td><input id="good_num" type="text"  name="good_num" /></td><td id="good_num_show"></td></tr>
	                <tr><td align="right">B品</td><td><input id="b_num" type="text"  name="b_num" /></td><td id="b_num_show"></td></tr>
	                <tr><td align="right">报废</td><td><input id="c_num" type="text"  name="c_num" /></td><td id="c_num_show"></td></tr>
                </tbody>
                <tfoot>
                    <td align="right">备注:</td>
                    <td colspan="2">
                        <textarea rows="5" cols="40" id="ordNumRemark"></textarea>
                    </td>
                </tr>
                <tr>
                	<td><input type="button" value="重填" id="resetButton" style="height:30px; width:70px;" /></td>
                    <td colspan="2" align="center"><input type="button" value="提交数量" id="submitButton"  style="height:30px; width:70px;"/></td>
                </tr>
                </tfoot>
                </form>
            </table>
            
        </div>
        </div>
        <div style="height:200px;">
        
        </div>
        <form action="#" style="display:none">
            <input type="text" value="${requestScope.ordNumFlag}" id="ordNumFlag"/>
        </form>
    </body>
</html>
