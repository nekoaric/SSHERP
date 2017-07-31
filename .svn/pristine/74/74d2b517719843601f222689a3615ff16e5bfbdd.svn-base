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
            .ordnumInp{
                width : 70px;
            }
        </style>
        <script type="text/javascript" src="./loginMode2/js/uploadPreview.js"></script>
        <script type="text/javascript" src="./loginMode2/js/ordNumOptions.js" ></script>
        <script type="text/javascript" src="./loginMode2/js/XMLHttpRequest.js"></script>
        <script type="text/javascript" src="./resource/jquery/jquery-1.9.1.js"></script>
        <script type="text/javascript" src="./resource/jquery/ajaxfileupload.js"></script>
    </head>
    <body>
<%--  隐藏DIV用来保存JS所需的信息  --%>
        <div align="center">
        <div align="center" style="color:#FF0000">流水数据输入
        </div>
        <div align="center">工号:${requestScope.account}  姓名:${requestScope.name}</div>
        <div align="center">
            <input type="button" value="设置工厂" id="setFacButton"/>
            <input type="button" value="设置我的订单" id="setMyOrders"/>
            <input type="button" disabled="disabled" value="返回菜单" id="requestMenu"/>
            <input type="button" value="退出" id="quitButton"/>
        </div>
        <div style="color:#999999">
          <span id="selectFacAndDateInfo">选择工厂/日期</span>
              -><span id="selectPOInfo">选择PO,款号</span>
          -><span id="ordNumInfo">输入数量</span>
        </div>
        <div id="selectFacAndDateDiv">
            <table>
                <tr>
                    <td align="right">工厂:</td>
                    <td>
                        <select id="myGrpsSelect">
                            <option>一分厂</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td align="right">记录发生日期:</td>
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
                	<td></td>
                    <td><input type="button" value="下一步" id="firstStepNext" style="height:40px; width:100px;"/></td>
                </tr>
            </table>
        </div>
        <div id="selectPODiv" >
            <table>
                <tr>
                    <td align="right">款号:</td>
                    <td>
                        <select id="styleSelect">
                        </select>
                    </td>
                </tr>
                <tr style="display:none">
                    <td align="right">款号(只读):</td>
                    <td>
                        <input type="text" readonly="true" id="style_no_read"/>
                    </td>
                </tr>
                <tr>
                    <td align="right">PO#:</td>
                    <td>
                        <select id="orderSelect">
                        </select>
                    </td>
                </tr>
                <tr>
                    <td align="right">标记号(只读):</td>
                    <td>
                        <input type="text" readonly="true" id="mark_read"/>
                    </td>
                </tr>
                <tr>
                    <td align="right">FOB交期:</td>
                    <td>
                        <input type="text" readonly="readonly" id="fob_deal_date"/>
                    </td>
                </tr>
                <tr>
                    <td align="right">客户:</td>
                    <td>
                        <input type="text" readonly="readonly" id="cust_name"/>
                    </td>
                </tr>
                <tr>
                	<td>
                        <input type="button" value="上一步" id="secondStepPrevious" style="height:40px; width:100px;"/>
                    </td>
                    <td>
                        <input type="button" value="下一步"/ id="secondStepNext" style="height:40px; width:100px;">
                    </td>
                    
                </tr>
            </table>
        </div>
        <div id="ordNumDiv">
            <!-- <div>PO号信息PO号信息PO号信息</div>
            <div>款号信息款号信息款号信息</div>
            <div>丝带色号</div> 
             -->
            <table id="numTable">
                <thead>
                <tr>
                    <td>当前日期:</td>
                    <td colspan="2" id="cur_date_show">2014-12-24</td>
                </tr>
                <tr>
                    <td>记录发生日期:</td>
                    <td colspan="2" id="opr_date_show">2014-12-24</td>
                </tr>
                <tr>
                    <td id="mark_show" align="center">丝带色号</td>
                    <td align='right'>开单数:</td>
                    <td id="ins_num_show">0000000</td>
                </tr>
                <tr>
                    <td align="right">PO#:</td>
                    <td colspan="2" id="order_id_show">PO号信息PO号信息</td>
                </tr>
                <tr>
                    <td align="right">款号:</td>
                    <td colspan="2" id="style_no_show">款号信息款号信息</td>
                </tr>
                <tr>
                    <td align="right">客户:<span id="cust_name_show">客户信息</span></td>
                    <td colspan="2" >品名：<span id="article_show">品名</span></td>
                </tr>
                <tr>
                    <td align="center">数量性质</td>
                    <td align="center">累计数</td>
                    <td align="center">本次数</td>
                </tr>
                </thead>
                <tbody>
	                <tr id="trNature1"><td>裁出数量</td><td id="real_cut_numcount"></td><td><input type="text" id="real_cut_num" name="curnum" class="ordnumInp"/></td></tr>
	                <tr id="trNature2"><td>缝制下线</td><td id="sew_numcount"></td><td><input type="text" id="sew_num" name="curnum" class="ordnumInp"/></td></tr>
	                <tr id="trNature3"><td>送水洗</td><td id="sew_delivery_numcount"></td><td><input type="text" id="sew_delivery_num" name="curnum" class="ordnumInp"/></td></tr>
	                <tr id="trNature4"><td>后整收货</td><td id="pack_accept_numcount"></td><td><input type="text" id="pack_accept_num" name="curnum" class="ordnumInp"/></td></tr>
	                <tr id="trNature5"><td>缝制领片</td><td id="draw_numcount"></td><td><input type="text" id="draw_num" name="curnum" class="ordnumInp"/></td></tr>
	                <tr id="trNature6"><td>水洗收货</td><td id="bach_accept_numcount"></td><td><input type="text" id="bach_accept_num" name="curnum" class="ordnumInp"/></td></tr>
	                <tr id="trNature7"><td>水洗移交</td><td id="bach_delivery_numcount"></td><td><input type="text" id="bach_delivery_num" name="curnum" class="ordnumInp"/></td></tr>
	                <tr id="trNature8"><td>移交成品</td><td id="f_product_numcount"></td><td><input type="text" id="f_product_num" name="curnum" class="ordnumInp"/></td></tr>
	                <tr id="trNature9"><td>移交B品</td><td id="b_product_numcount"></td><td><input type="text" id="b_product_num" name="curnum" class="ordnumInp"/></td></tr>
	                <tr id="trNature10"><td>收成品</td><td id="receive_f_productcount"></td><td><input type="text" id="receive_f_product" name="curnum" class="ordnumInp"/></td></tr>
	                <tr id="trNature11"><td>收B品</td><td id="receive_b_productcount"></td><td><input type="text" id="receive_b_product" name="curnum" class="ordnumInp"/></td></tr>
	                <tr id="trNature12"><td>中间领用</td><td id="middle_takecount"></td><td><input type="text" id="middle_take" name="curnum" class="ordnumInp"/></td></tr>
	                <tr id="trNature13"><td>出运成品</td><td id="sendout_f_productcount"></td><td><input type="text" id="sendout_f_product" name="curnum" class="ordnumInp"/></td></tr>
	                <tr id="trNature14"><td>出运B品</td><td id="sendout_b_productcount"></td><td><input type="text" id="sendout_b_product" readonly="true" style="border: 0px" name="curnum" class="ordnumInp"/></td></tr>
	                <tr id="trNature15"><td>B品库收录B品数</td><td id="receive_b_depotcount"></td><td><input type="text" id="receive_b_depot" readonly="true" style="border: 0px" name="curnum" class="ordnumInp"/></td></tr>
	                <tr id="trNature16"><td>B品库出运B品数</td><td id="sendout_b_depotcount"></td><td><input type="text" id="sendout_b_depot" readonly="true" style="border: 0px"  name="curnum" class="ordnumInp"/></td></tr>
	                <tr id="imgRow">
	                	<td><div id="imgdiv"><img id="imgShow" width="100" height="100" /></div></td>
	    				<td colspan="2"><input type="file" name='theFile' id="up_img" /></td>
	    			</tr>
                </tbody>
                <tfoot>
                    <td align="right">备注:</td>
                    <td colspan="2">
                        <textarea rows="5" cols="25" id="ordNumRemark"></textarea>
                    </td>
                </tr>
                <tr>
                    
                    <td align="center"><input type="button" value="上一步" id="thirdStepPrevious" style="height:30px; width:70px;"/></td>
                    <td colspan="2" align="center"><input type="button" value="提交数量" id="submitButton"  style="height:30px; width:70px;"/></td>
                </tr>
                </tfoot>
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
