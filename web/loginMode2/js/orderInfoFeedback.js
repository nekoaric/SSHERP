/**
 * 订单信息反馈
 *  通过一个函数来提供功能
 * @author zhouww
 * @since 2015-03-16
 */
var saveFeedbackInfo = './orderFeedback.mobile?reqCode=saveFeedbackInfo'

/**
 * 显示反馈窗口
 */
function showOrderFB() {
    //创建一个DIV  让这个div覆盖当前的界面
    var top = document.body.scrollTop || document.documentElement.scrollTop;
    var left = document.body.scrollLeft || document.documentElement.scrollLeft;

    var div = document.createElement('div');
    div.style.width = '100%';
    div.style.height = '100%';
    div.style.position = 'absolute';
    div.style['background-color'] = '#2e96ff';
    div.style.left = left;
    div.style.top = top;
    div.id = 'orderInfoFb'; // 赋值id好操作

    //增加DIV样式
    div.innerHTML = '<div align="center">PO#反馈信息</div>'
            + '<div align="center"">'
            + '   <table>'
            + '       <tr style="width:30px;">'
            + '           <td align="right" style="width:30px;">PO#:</td>'
            + '           <td><input id="fb_orderNo" type="text"/></td>'
            + '       </tr>'
            + '       <tr><td colspan="2">或</td></tr>'
            + '       <tr>'
            + '           <td align="right">款号:</td>'
            + '           <td><input id="fb_styleNo" type="text" /></td>'
            + '       </tr>'
            + '       <tr>'
            + '           <td align="right">丝带色号:</td>'
            + '           <td><input id="fb_ribbon_color" type="text"/></td>'
            + '       </tr>'
            + '       <tr>'
            + '           <td><input type="button" value="提交" style="width:100%;" onclick="javascript:void submitFun();"/></td>'
            + '           <td><input type="button" value="取消" style="width:100%;"onclick="javascript:void cancelFun();"</td>'
            + '       </tr>' + '   </table>' + '</div>'

    document.body.appendChild(div);

}
/**
 * 检测数据合规性
 */
function valide() {
    var fb_order = document.getElementById('fb_orderNo').value;
    var fb_styleNo = document.getElementById('fb_styleNo').value;
    var fb_ribbon_color = document.getElementById('fb_ribbon_color').value;
    if((fb_order.trim().length==0) && (fb_styleNo.trim().length==0 || fb_ribbon_color.trim().length==0)){
        return false;
    }
    return {
        'order_id' : fb_order,
        'style_no' : fb_styleNo,
        'ribbon_color' : fb_ribbon_color
        }
}

/**
 * 点击提交事件
 */
function submitFun() {
    var resultObj = valide();
    if(resultObj){
        var resultStr = '';
        resultStr = 'order_id='+resultObj.order_id
                + '&style_no=' + resultObj.style_no
                + '&ribbon_color=' + resultObj.ribbon_color
        sendAjaxRequest(saveFeedbackInfo, resultStr, submitFun_callBack);
    }else {
        alert('请填写PO#或者 填写款号和丝带色号');
    }
}
/**
 * 保存信息的回调函数
 */
function submitFun_callBack(){
    try{
        if (XMLHttpReq.readyState == 4) {
            if (XMLHttpReq.status == 200) {
                var text = XMLHttpReq.responseText;
                text = eval('('+text+')');
                
                if(text.success){
                    alert('反馈信息保存成功')
                    submitFun_callBack_success(text);
                }else { // 失败
                    alert('操作失败'+text.msg2)
                    return;
                }
            }
         }
    }catch(e){
        console.log(e);
    }
}

function submitFun_callBack_success(text){
    var div = document.getElementById('orderInfoFb');
    div && div.parentNode.removeChild(div);
}


/**
 * 点击取消事件
 */
function cancelFun() {
    var div = document.getElementById('orderInfoFb');
    
    div && div.parentNode.removeChild(div);
}