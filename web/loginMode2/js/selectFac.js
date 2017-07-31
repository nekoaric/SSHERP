window.onload = function(){
    
    // 请求工厂信息
    var queryGrpsUrl = './accountMobile.mobile?reqCode=queryGrps';
    // 保存我的工厂信息 URl
    var saveGrpsUrl = './accountMobile.mobile?reqCode=updateGrps'; 
    // 数量操作请求URL
    var ordnumUrl = './menuMobile.mobile?reqCode=initView';
    
    function queryFac_Back(){
         if (XMLHttpReq.readyState == 4) {
                     if (XMLHttpReq.status == 200) {
                         var text = XMLHttpReq.responseText;
                          text = eval('('+text+')');
                          text = text || []; 
                          var d = getElementById('ulRoot');
                          var treeInfo = text.allGrps;
                          var resultObj = creatTreeDiv(treeInfo,'001',d);
                          
                          // 选择已经选择的内容
                          var selectGrps = text.myGrps;
                          initSelectFac(selectGrps);
                          
                          // 添加修改事件
                          addListener4tree();
                     }
         }
    };
    sendAjaxRequest(queryGrpsUrl,'',queryFac_Back);
    
    /**
     * 为树添加级联事件
     */
    function addListener4tree(){
        // 添加事件
        var eleArr = document.getElementsByName('grps');
        for(var idx=0;idx<eleArr.length;idx++){
            eleArr[idx].onchange = treeCheckedChange;
        }
    }
    /**
     * 树选择发生改变时
     */
    function treeCheckedChange(node){
        // 取消时的操作
        // 选择时的操作
        var eleTarget = node.target || node.srcElement;
        if(eleTarget.checked){
            treeCheckedChange_checked(eleTarget);
        }else {
            treeCheckedChange_unChecked(eleTarget);
        }
        
    }
    
    /**
     * 选中时事件操作 
     */
    function treeCheckedChange_checked(eleNode){
        console.info(eleNode.getAttribute('data-id'));
        var arrs = document.getElementsByTagName('input');
        
        // 选中所有的上级， 选中所有的下级
        var id = eleNode.getAttribute('data-id');
        var parentId = eleNode.getAttribute('data-parentid');
        selectChildren(id);
        selectParent(parentId);
        
        // 选择父节点
        function selectParent(nodeId){
            var pId = '';
            for(var idx=0;idx<arrs.length;idx++){
                if(arrs[idx].getAttribute('data-id') == nodeId) {
                    arrs[idx].checked = 'checked';
                    pId = arrs[idx].getAttribute('data-parentid');
                    break;
                }
            }
            if(pId){
                selectParent(pId);
            }
        }
        // 选择子节点
        function selectChildren(nodeId){
            //记录处理节点信息
            var doEleArr = [];
            
            for(var idx=0;idx<arrs.length;idx++){
                if(arrs[idx].getAttribute('data-parentid') == nodeId) {
                    arrs[idx].checked = 'checked';
                    doEleArr.push(arrs[idx].getAttribute('data-id'))
                }
            }
            
            for(var idx=0;idx<doEleArr.length;idx++) {
                selectChildren(doEleArr[idx])
            }
        }
    }
    /**
     * 取消选择事件操作
     */
    function treeCheckedChange_unChecked(eleNode){
        // 取消所有的下级，不处理上级
        var arrs = document.getElementsByTagName('input');
         var id = eleNode.getAttribute('data-id');
        unSelectChildren(id);
        
        function unSelectChildren(nodeId){
            //记录处理节点信息
            var doEleArr = [];
            
            for(var idx=0;idx<arrs.length;idx++){
                if(arrs[idx].getAttribute('data-parentid') == nodeId) {
                    arrs[idx].checked = null;
                    doEleArr.push(arrs[idx].getAttribute('data-id'))
                }
            }
            
            for(var idx=0;idx<doEleArr.length;idx++) {
                unSelectChildren(doEleArr[idx])
            }
        }
    }
    
    /**
     *  选择已经选择的工厂
     */
    function initSelectFac(arr){
        for(var idx=0;idx < arr.length;idx++) {
            var beanId = arr[idx].grp_id + 'checkbox';
            var checkBoxBean = getElementById(beanId);
            checkBoxBean.checked = true;
        }
    }
    
    /**
    arr ： 需要生成树结构的源数据(数组格式)
    每一个数据包含，id，parentid,text,leaf
    元素id为数据的id，并且为元素添加其他的额外信息，如父节点id等等
    返回是一个对象：1）包含结果的未过滤节点信息 2）生成的文档碎片
    **/
    function creatTreeDiv(arr,rootId,rootEle){
        // 找到此rootId下的所有子节点，并添加到文档碎片
        // 如果元素还有子元素，增加此节点的子节点信息
        // 如果元素是叶子元素，则结束
        var temp_addEle = [];   // 需要便利子节点的节点信息
        var temp_residue = []; // 此次便利结束的剩余节点信息
        
        
        for(var idx=0;idx<arr.length;idx++){
            var beanEle = arr[idx]; // beanEle是对象类型不是html元素 
            if(beanEle.parentid == rootId){
                var childEle = '';
                childEle = document.createElement('li');
                childEle.id = beanEle.id;
                childEle.innerHTML = '<div><input type="checkbox" name="grps" '
                    + ' id=' + beanEle.id + 'checkbox'
                    + ' data-id=' + beanEle.id 
                    + ' data-parentid=' + beanEle.parentid
                    + ' data-text=' + beanEle.text
                    +'>'+beanEle.text+'</div>';
                if(!beanEle.leaf){  // 如果不是叶子节点添加UL节点 ,并且添加到处理节点集合中
                    var ulEle = document.createElement('ul');
                    ulEle.id = beanEle.id+"root";
                    childEle.appendChild(ulEle);
                    temp_addEle.push(beanEle);
                }
                // 处理完添加到fragment中
                rootEle.appendChild(childEle);
            }else {
                // 如果不是此id的子节点，那么添加到剩余节点集合中
                temp_residue.push(beanEle);
            }
        }
        // 遍历处理待处理节点
        for(var idx=0;idx<temp_addEle.length;idx++){
            var beanAdd = temp_addEle[idx];
            var  childRoot = document.getElementById(beanAdd.id+'root');
            var resultObj = creatTreeDiv(temp_residue,beanAdd.id,childRoot);
            temp_residue = resultObj.residue;
        }
        var resultObj = {
            residue : temp_residue,
            fragment : null
        }
        return resultObj;
    }
    
        // 确认按钮
        var sureButton = getElementById('sureButton');
        // 取消按钮
        var cancelButton = getElementById('cancelButton');
        
        sureButton.onclick = function(){
            var grps = document.getElementsByName('grps');
            var checkedArr = [];
            for(var idx=0;idx<grps.length;idx++){
                var beanEle = grps[idx];
                if(beanEle.checked){
                    checkedArr.push(beanEle);
                }
            }
            var checkedGrpIds = [];
            for(var idx=0;idx<checkedArr.length;idx++){
                checkedGrpIds.push(checkedArr[idx].getAttribute('data-id'));
            }
            // 处理选中的工厂id
            var params = checkedGrpIds.join(',');
            // ajax保存信息
            saveSelectGrpInfo('grps='+params)
        };
        
        cancelButton.onclick = function(){
            // 工厂取消后 直接转到数量操作界面
            window.location.href = ordnumUrl;
        };
    /**
     * 保存选中的工厂信息
     */
    function saveSelectGrpInfo(params){
        sendAjaxRequest(saveGrpsUrl,params,saveInfo_callback);
    }
    
    /**
     * 保存的操作的回调函数
     */
    function saveInfo_callback(){
        if (XMLHttpReq.readyState == 4) {
                     if (XMLHttpReq.status == 200) {
                        // 保存成功后跳转至菜单界面
                        window.location.href = 'javascript:history.go(-1)';
                     }
         }
    }
    
        
     function getElementById(eId){
        return document.getElementById(eId);
    };
}
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    