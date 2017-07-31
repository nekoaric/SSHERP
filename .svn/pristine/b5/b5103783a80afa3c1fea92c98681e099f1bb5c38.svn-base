/**
 * author : zhouww
 * since : 2014.12.09
 * 功能 : 独立查询部门，企业信息的组件。
 * 方便维护，和修改查询企业，部门的信息，
 * ！限制单选时不能够级联选择
 * TODO ： 1）提供设置默认的工厂，部门的选择接口
 *  2）返回结果提供树状结构
 *  3)提供默认的tab选择
 */

 var queryGrpAndDeptDetail = null;
 /**
  * 查询组件的构造函数
  * @param {} flag flag: 'grp|1'--企业查询，'dept|0'--部门查询(默认)
  */
 //TODO 是否添加单选的选择
 function QueryGrpAndDeptDetail(flag){
    // 如果已经创建了则使用创建的组件对象
    //TODO Q:是否需要在新创建时初始化组件的设置？
    if( !Ext.isEmpty(queryGrpAndDeptDetail)){
        return queryGrpAndDeptDetail;
    }
    //===================================组件变量=====================================
    flag = flag || '0'; //设置默认的查询为部门查询
    
    // 部门跟节点
    var deptRootId = '001';
    // 部门信息请求
    var deptLoadUrl = './sysDept.ered?reqCode=departmentTreeInitWithChecked';
    // 工厂跟节点
    var grpRootId = '001';
    // 工厂信息请求
    var grpLoadUrl = './sysGrps.ered?reqCode=belongGrpsTreeInitWithChecked';
    
    
    //~==================================变量结束=====================================
    
    //===================================组件Store=====================================
    //~==================================Store结束=====================================
    
    //===================================显示组件=====================================
    //查询FormPanel
    var queryFormPanel = new Ext.form.FormPanel({
       title : '查询块',
       region : 'north',
       height : 100,
       style : 'margins : 0 10 0 0',
       items : [{
            hidden : true,
            layout : 'column',
            defaults : {
                border : false,
                labelAlign:'right',
                labelWidth:50,
                style : 'marginTop : 1px'
            },
            items : [{
                layout : 'form',
                columnWidth : .5,
                items : [{
                    xtype : 'textfield',
                    fieldLabel : '工厂名',
                    id : 'queryGrpAndDept_grpName'
                }]
            },{
                layout : 'form',
                columnWidth : .5,
                items : [{
                    xtype : 'textfield',
                    fieldLabel : '部门名',
                    id : 'queryGrpAndDept_deptName'
                }]
            
            }]
        },{
            layout : 'column',
            defaults : {
                border : false,
                labelAlign:'right',
                labelWidth:70,
                style : 'marginTop : 1px'
            },
            items : [{
                layout : 'form',
                columnWidth : .4,
                items : [{
                    xtype : 'checkbox',
                    fieldLabel : '限制单选',
                    name : 'queryGrpAndDept_single',
                    checked : true,
                    id : 'queryGrpAndDept_single'
                }]
            },{
                layout : 'form',
                columnWidth : .4,
                items : [{
                    xtype : 'checkbox',
                    fieldLabel : '级联选择',
                    name : 'queryGrpAndDept_cascade',
                    checked : false,
                    id : 'queryGrpAndDept_cascade'
                }]
            },{
                layout : 'form',
                columnWidth : .2,
                hidden : true,
                items : [{
                    xtype : 'button',
                    text : '查询',
                    id : 'queryGrpAndDept_query'
                }]
            }]
        }]
    });
    
    //部门信息
    var deptRoot = new Ext.tree.AsyncTreeNode({
        text: '',
        expanded: true,
        iconCls: 'folder_userIcon',
        id: deptRootId
    });
    var deptTree = new Ext.tree.TreePanel({
        loader: new Ext.tree.TreeLoader({
            baseAttrs: {},
            dataUrl: deptLoadUrl
        }),
        title : '部门信息',
        root: deptRoot,
        animate : true,
        split : true,
        collapsible: false,
        autoScroll : true,
        rootVisible: false,
        id : 'queryGrpAndDept_deptTree'
    });
    //工厂信息
    var grpRoot = new Ext.tree.AsyncTreeNode({
        text: '',
        expanded: true,
        iconCls: 'folder_userIcon',
        id: grpRootId
    });
    var grpTree = new Ext.tree.TreePanel({
        
        loader: new Ext.tree.TreeLoader({
            baseAttrs: {},
            dataUrl: grpLoadUrl
        }),
        title : '工厂信息',
        root: grpRoot,
        animate : true,
        split : true,
        collapsible: false,
        autoScroll : true,
        rootVisible: false,
        id : 'queryGrpAndDept_grpTree'
    });
    //TODO ? 是否需要加入班组信息
    
    //树的tab
    var treeTabPanel = new Ext.TabPanel({
        region : 'center',
        activeItem : 0,
        id : 'queryGrpAndDept_treeTabPanel',
        items : [deptTree,grpTree]
    })
    
    //功能按钮块
    
    // 显示的window
    var queryWindow = new Ext.Window({
        layout : 'border',
        width : 300,
        height : 400,
        closeAction : 'hide',
        closable : false,
        items : [queryFormPanel,treeTabPanel],
        buttons : [{
            xtype : 'button',
            text : '确定',
            id : 'queryGrpAndDept_sure'
        },{
            xtype : 'button',
            text : '取消',
            id : 'queryGrpAndDept_cancel'
        }]
    });
    //~==================================组件结束=====================================
    
    //===================================组件事件=====================================
    
    // 确定按钮-点击事件
    Ext.getCmp('queryGrpAndDept_sure').addListener('click',function(){
        // 触发事件
        triggerListener();
        // 隐藏
        hideWindow();
    });
    // 取消按钮-点击事件
    Ext.getCmp('queryGrpAndDept_cancel').addListener('click',function(){
       hideWindow();
    });
    // 查询按钮-点击事件
    Ext.getCmp('queryGrpAndDept_query').addListener('click',function(){
        queryInfo4params();
    });
    
    // 显示单选->改变事件
    Ext.getCmp('queryGrpAndDept_single').addListener('check',function(field,newValue){
        // 取消限制不需要做处理
        if(!newValue){
            return;
        }
        // 添加限制单选后需要取消级联选择
        Ext.getCmp('queryGrpAndDept_cascade').setValue(false);
        
        // 处理单选限制
        singleConstraint();
    })
    
    // 级联选择->改变事件
    Ext.getCmp('queryGrpAndDept_cascade').addListener('check',function(field,newValue){
        // 不是级联选择的不需要做处理
        if(!newValue){
            return;
        }
        var singleC = Ext.getCmp('queryGrpAndDept_single');
        // 如果是限制单选，那么不能够选择级联选择
        if(singleC.checked){
            field.setValue(false);
            return;
        }
        
//        // 处理级联限制
//        cascadeConstraint();
    })
    // 如果不是当前窗口则隐藏
    queryWindow.on('deactivate',function(){
        hideWindow();
    })
    //~==================================事件结束=====================================
    
    //==================================组件内函数=====================================
    /**
     * 查询新的部门信息和工厂信息
     */
    function queryInfo4params(){
        //TODO 增加查询的功能
        return;
        var grp_name = Ext.getCmp('queryGrpAndDept_grpName').getValue();
        var dept_name = Ext.getCmp('queryGrpAndDept_deptName').getValue();
        var paramsObj = {
            grp_name : grp_name,
            dept_name : dept_name
        };
        // 重新加载工厂树
        grpTree.load(paramsObj);
        // 重新加载部门树
        deptTree.load(paramsObj);
    }
    /**
     * 单选条件设置
     * 当选择单选限制条件后的初步处理
     * 如果不是单选条件，那么应该在上一层（调用此函数的地方）判断不调用此函数
     * 
     * 处理现有的选择
     * 1)如果是多选的那么将所有的选择取消
     * 2）如果是单选的那么保留原来选择
     */
    function singleConstraint(node){
        if(treeTabPanel.getItem("queryGrpAndDept_deptTree")){
            cancelMultiChecked('queryGrpAndDept_deptTree',node);  // 处理部门树
        }
        if(treeTabPanel.getItem("queryGrpAndDept_grpTree")){
            cancelMultiChecked('queryGrpAndDept_grpTree',node);   // 处理工厂树
        }
    }
    /**
     * 取消多选
     * @param {} treeid
     */
    function cancelMultiChecked(treeid,node){
        node = node || {};  // 设置node一个默认空对象
        var nodeArr = Ext.getCmp(treeid).getChecked();
        // 小于2个的选择不用处理
       for(var idx=0;idx<nodeArr.length; idx++){
            var nodeBean = nodeArr[idx]
            // 适用于extjs3.x版本
            if(node.id != nodeBean.id){
                nodeBean.attributes.checked=false; 
                nodeBean.getUI().toggleCheck(false);
            }
       }
       
    }
    
    /**
     * 级联选择设置
     * 对级联节点进行处理
     */
    function cascadeConstraint(node){
        var cascade = Ext.getCmp('queryGrpAndDept_cascade').checked;
        // 处理父级联
        if(cascade){
            var temp_node = node;
            while(node && node.attributes.checked){ //只有选择节点后才处理父节点
                var parent = temp_node.parentNode;
                if(!Ext.isEmpty(parent)){
                    parent.attributes.checked=true; 
                    parent.getUI().toggleCheck(true);
                }else {
                    break;
                }
                temp_node = parent;
            }
            // 处理子节点
            cascadeChilds(node);
        }
    }
    
    /**
     * 选择节点，有限制单选和级联选择的关系判断
     * @param {} node
     */
    function selectNode(node){
        // 如果是单选，1）取消所有的选择 2）选择指定的node
        // 如果是级联的，1）选择所有node的子节点 2）选择素有node节点的父节点
        var single = Ext.getCmp('queryGrpAndDept_single').checked;
        // 取消已有选择 是单选的条件和目标节点选择
        if(single){
            singleConstraint(node);
        }
        
        cascadeConstraint(node);
    }
    
    /**
     * 级联子节点
     * 和父节点保持一致的选择
     * @param {} node
     */
    function cascadeChilds(node){
        // 先把节点展开
        var checked = node.attributes.checked;
        var childs = node.childNodes;
        var childLength = childs.length;
        for(var idx=0;idx<childLength; idx++){
            var childBean = childs[idx];
            childBean.attributes.checked=checked; 
            childBean.getUI().toggleCheck(checked);
            cascadeChilds(childBean);
        }
    }
    
    /**
     * 取消选择节点，有限制单选和级联选择的关系判断
     * @param {} node
     */
    function cancelNode(node){
        cascadeConstraint(node);
    }
    
    /********************级联选中支持开始 ******************** */
    // Checkbox被点击后级联父节点和子节点 ，选择框单击事件
    Ext.override(Ext.tree.TreeEventModel, {
        onCheckboxClick: Ext.tree.TreeEventModel.prototype.onCheckboxClick
            .createSequence(function (e, node) {
                if(node.attributes.checked){
                    selectNode(node);
                }else {
                    cancelNode(node);
                }
            })
    });
    /** ***************** 级联选中支持结束 ******************** */
    
    /**
     * 部门树选择节点信息
     */
    function getDeptParameter(){
        var nodeArr = Ext.getCmp('queryGrpAndDept_deptTree').getChecked();
        return parseNodeToArr(nodeArr);
    }
    
    /**
     * 工厂树选择节点信息
     */
    function getGrpParameter(){
        var nodeArr = Ext.getCmp('queryGrpAndDept_grpTree').getChecked();
        return parseNodeToArr(nodeArr);
    }
    /**
     * 处理选择的node转化为数组
     */
    function parseNodeToArr(arr){
        var resultArr = [];
        
        for(var idx=0;idx<arr.length;idx++){
            var nb = arr[idx];
            var parent = nb.parentNode;
            var resultBean = {};
            resultBean.id = nb.id;
            resultBean.text = nb.text;
            resultBean.parentId = parent ? parent.id : '';
            resultBean.parentText = parent ? parent.text : '';
            resultArr.push(resultBean);
        }
        return resultArr;
    }
    //~==================================组件内函数结束================================
    
    
    //===================================组件功能接口=====================================
    
    // 注册函数编号
    var registerCode = [];
    // 注册函数
    var registerFun = {};
    /**
     * 部门，工厂查询注册回调函数
     * 
     * @param {} code 注册函数编号（可随意）
     * @param {} fun 注册函数
     */
    function addListeners4query(code,fun,isExists){
        // 如果存在相同编号的则返回
        if(registerCode.indexOf(code)>-1){
            if(isExists){
                registerFun[code] = fun;    // 如果是true就覆盖
                return ;
            }else {
                return false;
            }
        }
        registerCode.push(code);
        registerFun[code] = fun;
    }
    
    /**
     * 触发监听事件
     */
    function triggerListener(){
        var tabPanel = Ext.getCmp('queryGrpAndDept_treeTabPanel');
        var tabId = tabPanel.activeTab.id;
        var param = []; 
        if(tabId == 'queryGrpAndDept_deptTree'){
            param = getDeptParameter();
        }else if(tabId == 'queryGrpAndDept_grpTree'){
            param = getGrpParameter();
        }
        for(var idx=0;idx<registerCode.length;idx++){
            try{
                registerFun[registerCode[idx]](param);
            }catch(e){
            }
        }
    }
    
    function showWindow(){
        queryWindow.show();
    }
    
    function hideWindow(){
        initWindow();
        // 3)关闭窗口
        queryWindow.hide();
    }
    
    /**
     * 初始化窗口
     */
    function initWindow(param){
         // 1)清空所有选择
        singleConstraint();
        // 2)设置默认按钮
        Ext.getCmp('queryGrpAndDept_single').setValue(true);
        Ext.getCmp('queryGrpAndDept_cascade').setValue(false);
        // 3)设置组件的显示
        if(param && param.hideDept){
            treeTabPanel.remove(deptTree,false);
        }else {
            treeTabPanel.add(deptTree);
        }
        if(param && param.hideGrp){
            treeTabPanel.remove(grpTree,false);
        }else{
            treeTabPanel.add(grpTree);
        }
        
        treeTabPanel.doLayout();
    }
    
    function QueryConstructrol(){
        this.hideWindow = hideWindow;
        this.showWindow = showWindow;
        this.addListeners4query = addListeners4query;
        this.init = initWindow;
    }
    queryGrpAndDeptDetail = new QueryConstructrol();
    return queryGrpAndDeptDetail;
    //~==================================组件功能接口=====================================
    
    
 }
 
 
 
 
 
 
 
 
 
 