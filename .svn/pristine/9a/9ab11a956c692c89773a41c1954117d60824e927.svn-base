/**
 * QC位置选择界面 
 */
window.onload = function(){
    // 参数 
    var qcInfo = {};
    // qc位置信息表
    var qcPositionTble = getElementById('qcPositionTable')
    
    // URL
    var queryQCPositionURL = './manageQC.mobile?reqCode=queryQCPositionInfo';
    var nextStepURL = './manageQC.mobile?reqCode=queryView';   // 查询样式和订单
    
    var qcPositions = [];
    
    /**
     * 生成QC位置信息
     * 每行三列
     * 每列占据1/3位置
     */    
    function createQCPositionTable(arr){
        // 计算行数
        var beanNums = arr.length;
        var tr = document.createElement('tr');
        for(var idx=0; idx<beanNums; idx++){
            var beanPo = arr[idx];
            
            if(idx%3==0 && idx != 0){   // 遇三换行除了第一行
                qcPositionTble.appendChild(tr);
                tr = document.createElement('tr');
            }
            var td = createOneTd4Table(beanPo);
            tr.appendChild(td);
        }
        // 结束换行
        if(beanNums%3 != 0){    // 添加最后一行信息
            qcPositionTble.appendChild(tr);
        }
    }
    /**
     * 创建一个TD的单元格
     */
    function createOneTd4Table(beanInfo){
        var td = document.createElement('td');
        td.style.width = '30%';
        td.style.height = '60px';
        td.onclick = callBackPosition(beanInfo.id,beanInfo.text);
        var qcPODiv = '<div style="width:100%; height:100%; background-color:#378ccf;text-align:center">'
               + '<div style="position:relative; top:40%;">'
               + '<span style=" font-size:18px">' + beanInfo.text + '</span>'
               + '</div>'
               + '</div>';
       td.innerHTML = qcPODiv;
       return td;
    }
 
    /**
     * 点击事件回调函数
     */
    function callBackPosition(posId,name){
        return function(){
            clickQCPosition(posId,name);
        }
    }
    /**
     * qc位置点击事件
     */
    function clickQCPosition(posId,name){
        // 保存点击位置信息
        qcInfo.qcPosition = posId;
        qcInfo.qcPositionName = name;
        localStorage.qcInfo = JSON.stringify(qcInfo);
        
        // 跳到查询订单 样式信息
        window.location.href = nextStepURL;
        
    }
    //================================AJAX请求
   /**
    * 查询qc位置信息
    */
    function  queryQCPositionInfo(){
        sendAjaxRequest(queryQCPositionURL,'',queryPositionInfo_callBack);
    }
    
    /**
     * 保存QC信息回调函数
     */
    function queryPositionInfo_callBack(){
        if (XMLHttpReq.readyState == 4) {
            if (XMLHttpReq.status == 200) {
                var text = XMLHttpReq.responseText;
                text = eval('('+text+')');
                
                if(text.success){   // 成功查询
                    parsePositionsInfo(eval(text.qcPositions));
                    createQCPositionTable(qcPositions);
                }else { 
                    alert("查询失败")
                }
            }
         }
    }
    /**
     * 解析查询的QC位置信息
     */
    function parsePositionsInfo(info){
        qcPositions = [];   // 初始化赋值
        
        info = info || [];
        if(info.length == 0){
            alert('目前尚未设置QC位置信息.请设置QC位置信息后使用');
            return ;
        }
        for(var idx=0;idx < info.length; idx++){
            var bean = info[idx];
            qcPositions.push({
                text : bean.short_name,
                id : bean.seq_no
            })
        }
    }
    //~==================================AJAX请求结束
    
     /**
      * 获取元素
      * @param {} eId
      * @return {}
      */
    function getElementById(eId){
            return document.getElementById(eId);
    };
    /**
     * 初始化localStorage.qcInfo
     * localStorage.qcInfo将在qc处理过程中保存相关信息
     * qcInfo.qcPosition: qc位置
     * qcInfo.qcClass qc样式
     * qcInfo.ords qc订单 
     */
    (function(){
        localStorage.qcInfo = JSON.stringify(qcInfo);
        queryQCPositionInfo();  // 初始化QC位置信息
    })();
}
