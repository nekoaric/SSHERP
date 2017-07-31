 /**
  * 订单详细查询的窗口
  * <观察者模式>
  * @author zhouww
  * @since 2014年8月28日
  * 功能:提供详细查询条件的组件
  * 说明：对外提供注册函数 addListener4suerOrder()
  * 参数：参数为Record数组
  * 
  * <
       2014.11.18 新增锁定列模式
       @param flag : 提供锁定列模式和非锁定列模式(默认)，flag ： lock 锁定列模式，其他的都为非锁定列模式
  * >
  * <
  * showQueryWindow : 显示界面
    hideQueryWindow : 隐藏界面
    addListener : 添加监听函数
    clearListener ： 清空监听函数
    setOrderState : 设置订单状态
  * >
  */
  var queryWindow ;
  var QueryWindowConstruct = function(flag){
    
  	if(!Ext.isEmpty(queryWindow)){
  		return queryWindow;
  	}
    
    /**
     * 锁定列标志
     */
    flag = flag || 'unlock';    // grid模型默认为非锁定列
    
    
    
  	queryWindow = {};
  	//需要订单号，完单数，指令数，客户id，客户name，款号
    var ordStore = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: './ordBas.ered?reqCode=queryOrdBasInfo'
        }),
        reader: new Ext.data.JsonReader({
            totalProperty: 'TOTALCOUNT',
            root: 'ROOT'
        }, ['seq_no', 'order_id','prod_ord_seq','article', 'deli_date','ins_num','ord_num',
            'order_date', 'cust_name','start_date','style_no','ribbon_color'])
    });
    
    
     //订单查询第二栏
    var  ordstateCombo = new Ext.form.ComboBox({
                id:'orderState',
                hiddenName:'orderStateName',
                name:'orderStateName',
                width:85,
                mode:'local',
                store:new Ext.data.ArrayStore({
                    fields:['value','text'],
                    data:[['','全部'],['0','未排产'],
                            ['1','在产中'],['2','已交货']]
                    }),
                displayField:'text',
                valueField:'value',
                triggerAction:'all',
                value:'',
                editable:false
    });
    ordstateCombo.on('select',function(){
        queryStore4queryButton();
    });
    
    var tbar4Query2 = new Ext.Toolbar({
            items:['-','订单状态:',ordstateCombo,
            '-',
        		{   xtype : 'checkbox',
                    boxLabel : '我的订单',
                    name : 'myorder',
                    checked : true,
                    id : 'myorder_qw',
                    listeners:{
                        check:function(checkbox,checked){
                            queryStore4queryButton();
                        }
                    }
                },'-',{   
                    xtype : 'checkbox',
                    boxLabel : '已做完单报告',
                    name : 'isReportOrder',
                    checked : true,
                    id : 'isReportOrder',
                    listeners:{
                        check:function(checkbox,checked){
                            queryStore4queryButton();
                        }
                    }
                }
            ]
    })
    var grp_root = new Ext.tree.AsyncTreeNode({
        text: '分厂',
        expanded: true,
        id: '001'
    });
     var grp_tree = new Ext.tree.TreePanel({
        animate: false,
        root: grp_root,
        loader: new Ext.tree.TreeLoader({
            dataUrl: './sysGrps.ered?reqCode=belongGrpsTreeInitWithChecked'
        }),
        width: 400,
        autoScroll: true,
        useArrows: false,
        border: false,
        rootVisible: false
    });
    
    
     var cust_root = new Ext.tree.AsyncTreeNode({
        text: '客户',
        expanded: true,
        id: '001'
    });

    var cust_tree = new Ext.tree.TreePanel({
        animate: false,
        width: 400,
        root: cust_root,
        loader: new Ext.tree.TreeLoader({
            dataUrl: './custBas.ered?reqCode=getCustBasInfoTreeActionWithChecked'
        }),
        autoScroll: true,
        useArrows: false,
        border: false,
        rootVisible: false
    });
    var ord_query_panel = new Ext.form.FormPanel({
        collapsible: false,
        border: false,
        region: 'center',
        labelWidth: 70, // 标签宽度
        frame: false, // 是否渲染表单面板背景色
        labelAlign: 'right', // 标签对齐方式
        bodyStyle: 'padding:5 5 0', // 表单元素和表单面板的边距
        buttonAlign: 'right',
        items: [
            {
                xtype: 'textfield',
                fieldLabel: '订单号',
                name: 'order_id',
                id: 'order_id_queryWindow',
                anchor: '100%',
                listeners: {
                    specialkey: function (field, e) {
                        if (e.getKey() == Ext.EventObject.ENTER) {
                            queryStore4detailInfo();
                        }
                    }
                }
            },{
                 xtype:'textfield',
                  fieldLabel:'款号',
                  name:'style_no',
                  id:'style_no_queryWindow',
                  anchor:'100%',
                  listeners:{
                    specialkey:function(field,e){
                        if (e.getKey() == Ext.EventObject.ENTER) {
                                 queryStore4detailInfo();  
                            }
                    }
                 } 
            },{
                 xtype:'textfield',
                  fieldLabel:'客户/品牌',
                  name:'cust_name',
                  id:'cust_name_queryWindow',
                  anchor:'100%',
                  listeners:{
                    specialkey:function(field,e){
                        if (e.getKey() == Ext.EventObject.ENTER) {
                                 queryStore4detailInfo();  
                            }
                    }
                 } 
            }
            
        ],
        buttons: [
            {
                text: '查询',
                hidden : true,
                iconCls: 'page_findIcon',
                handler: function () {
                    queryStore4detailInfo();
                }
            },
            {
                text: '重置',
                hidden : true,
                iconCls: 'tbar_synchronizeIcon',
                handler: function () {
                    Ext.getCmp('order_id_queryWindow').setValue('');
                    Ext.getCmp('cust_name_queryWindow').setValue('');
                    Ext.getCmp('startdate_queryWindow').setValue('');
                    Ext.getCmp('enddate_queryWindow').setValue('');
                    Ext.getCmp('style_no_queryWindow').setValue('');
                }
            }
        ]
    });

     // 卡片布局的显示信息
    var detaiQueryPanel = new Ext.Panel({
        title: "客户信息",
        layout: 'card',
        activeItem: 2,
        region: 'center',
        labelAlign: "right",
        labelWidth: 70,
        border: false,
        items: [grp_tree, cust_tree, ord_query_panel]
    });
    
 var formPanel = new Ext.form.FormPanel({
        collapsible: false,
        border: false,
        region: 'north',
        labelWidth: 70, // 标签宽度
        frame: false, // 是否渲染表单面板背景色
        labelAlign: 'right', // 标签对齐方式
        bodyStyle: 'padding:5 5 0', // 表单元素和表单面板的边距
        buttonAlign: 'center',
        name: 'codeForm',
        height: 80,
        tbar: [
            {
                xtype: 'datefield',
                id: 'startdate_queryWindow',
                name: 'startdate_queryWindow',
                format: 'Y-m-d',
                emptyText: '起始日期',
                editable: true,
                width: 120
            },
            '-',
            {
                xtype: 'datefield',
                id: 'enddate_queryWindow',
                name: 'enddate',
                format: 'Y-m-d',
                emptyText: '结束日期',
                editable: true,
                width: 120
            },'-',{
               xtype : 'combo',
                	id:'dateTypeCombo',
               	 	hiddenName:'orderStateName',
                	name:'orderStateName',
                	width:85,
                	mode:'local',
                	store:new Ext.data.ArrayStore({
                    fields:['value','text'],
                    data : [['0', '日期类型'], ['1', 'FOB交期'],
							['2', '开裁日期'], ['3', '生产日期'],
							['4', '出运日期'], ['5', '记录出运日期'],['6','尾查期']]
                    }),
                	displayField:'text',
                	valueField:'value',
                	triggerAction:'all',
                	value:'0',
                	editable:false
                }],
        items: [
            {
                layout: 'column',
                border: false,
                items: [
                    {
                        columnWidth: 1,
                        layout: 'form',
                        border: false,
                        items: [
                            {
                                xtype: 'radiogroup',
                                id: 'leavRadio',
                                name: 'leavRadio',
                                columns: [.18, .18, .27],
                                hideLabel: true,
                                listeners: {
                                    'change': function (radiogroup) {
                                        var value = formPanel.getForm().getValues()["leavRadio"];
                                        if (value == 0) {
                                            detaiQueryPanel.getLayout().setActiveItem(0);
                                            detaiQueryPanel.setTitle('工厂信息');
                                        } else if (value == 1) {
                                            detaiQueryPanel.getLayout().setActiveItem(1);
                                            detaiQueryPanel.setTitle('客户信息');
                                        } else if (value == 2) {
                                            detaiQueryPanel.getLayout().setActiveItem(2);
                                            detaiQueryPanel.setTitle('订单基本信息(支持模糊查询)');
                                        }
                                    }
                                },
                                items: [
                                    {
                                        inputValue: '0',
                                        boxLabel: '按工厂',
                                        name: 'leavRadio',
                                        disabledClass: 'x-item'
                                    },
                                    {
                                        inputValue: '1',
                                        name: 'leavRadio',
                                        boxLabel: '按客户',
                                        disabledClass: 'x-item'
                                    },
                                    {
                                        inputValue: '2',
                                        name: 'leavRadio',
                                        checked: true,
                                        boxLabel: '按订单号,款号',
                                        disabledClass: 'x-item'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        listeners:{
            render:function(component){
                tbar4Query2.render(this.tbar);
            }
        }
    });
 
 
  var queryPanel = new Ext.Panel({
        title: "查询选择窗口",
        region: 'west',
        layout: 'border',
        border: true,
        labelAlign: "right",
        collapsible: true,
        labelWidth: 70,
        width: 360,
        minSize: 160,
        maxSize: 580,
        split: true,
        frame: false,
        items: [formPanel, detaiQueryPanel]
    });
  var ordSm = new Ext.grid.CheckboxSelectionModel({
    });

    var ordCm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), ordSm, {
//    var ordCm = new Ext.ux.grid.LockingColumnModel([new Ext.grid.RowNumberer(), ordSm, {
        header: '订单号',
        dataIndex: 'order_id',
        width: 90
    },{
        header : '完单号',
        dataIndex : 'prod_ord_seq',
        width : 70
    }, {
        header:'款号',
        dataIndex:'style_no',
        width : 100
    }, {
       header:'丝带色号',
       dataIndex:'ribbon_color',
       width : 70
    }, {
       header:'指令数',
       dataIndex:'ins_num',
       width : 50
    },{
        header: '客户',
        dataIndex: 'cust_name',
        width: 80
    }, {
        header: '开始生产日期',
        dataIndex: 'start_date',
        width: 100
    },  {
        header: '品名',
        dataIndex: 'article',
        width: 80
    }, {
        header: '交货日期',
        dataIndex: 'deli_date',
        width: 90
    }, {
        header: '订单标志',
        dataIndex: 'flag',
        width: 80
    }, {
        hidden: true,
        dataIndex: 'seq_no',
        width: 180
    }]);
 var ordPagesize_combo = new Ext.form.ComboBox({
        name: 'pagesize',
        hiddenName: 'pagesize',
        typeAhead: true,
        triggerAction: 'all',
        lazyRender: true,
        mode: 'local',
        store: new Ext.data.ArrayStore({
            fields: ['value', 'text'],
            data: [
                [10, '10条/页'],
                [20, '20条/页'],
                [50, '50条/页'],
                [100, '100条/页'],
                [250, '250条/页'],
                [500, '500条/页'],
                [1000, '1000条/页']
            ]
        }),
        valueField: 'value',
        displayField: 'text',
        value: '50',
        editable: false,
        width: 85
    });
    ordPagesize_combo.on("select", function (comboBox) {
        ordBbar.pageSize = parseInt(comboBox.getValue());
        loadStore4ordStore();
    });
    
    var ordBbar = new Ext.PagingToolbar({
        pageSize: 50,
        store: ordStore,
        displayInfo: true,
        displayMsg: '显示{0}条到{1}条,共{2}条',
        emptyMsg: "没有符合条件的记录",
        items: ['-', '&nbsp;&nbsp;', ordPagesize_combo]
    });
    /**
     * 工具按钮
     */
    var grid_tbar = new Ext.Toolbar({
        items : [
            	{
            	   text:'全选',
            	   iconCls : 'acceptIcon',
            	   handler:function(){
            	       ordGrid.getSelectionModel().selectAll();
            	   }
            	},
        	'-',{
        	       text:'反选',
        	       iconCls : 'ckrkdjIcon',
        	       handler:function(){
        	       	var selectionModel = ordGrid.getSelectionModel();
        	       	  //获取现有选择的行
        	          var records = selectionModel.getSelections();
        	          //选取所有的行
        	          selectionModel.selectAll();
                      //取消前一选择的行
        	          var recordSize = records.length;
        	          for(var idx=0;idx<recordSize;idx++){
        	          	var record = records[idx];
        	          	var num = record.json.rn;
        	          	selectionModel.deselectRow(num-1);  //grid行号从0开始 record的rn数据从1开始
        	          }
        	          
        	       }
    	       },
        	'-',{
        	       text : '取消',
        	       iconCls : 'deleteIcon',
        	       handler:function(){
        	           ordGrid.getSelectionModel().clearSelections();
        	       }
        	   }
//        	   ,'-',{
//        	       text : '添加到记录本',
//        	   	   handler : function(){
//        	   	   	
//        	   	   }
//        	   },'-',{
//        	       text : '查看记录本',
//        	       handler : function(){
//        	           
//        	       }
//        	   }
        	   ]
    })
 var ordGrid = new Ext.grid.GridPanel({
        autoScroll: true,
        region: 'center',
        store: ordStore,
        title: '订单信息',
        loadMask: {
            msg: '正在加载表格数据,请稍等...'
        },
        stripeRows: true,
        cm: ordCm,
        sm: ordSm,
        tbar : grid_tbar,
        bbar: ordBbar
//        view : new Ext.ux.grid.LockingGridView()
    });
 var window_queryWindow = new Ext.Window({
        layout: 'border',
        width: 1000, // 窗口宽度
        height: 422, // 窗口高度
        resizable: true,
        draggable: true,
        closeAction: 'hide',
        title: '订单查询窗口',
        modal: true,
        collapsible: false,
        titleCollapse: false,
        maximizable: true,
        buttonAlign: 'right',
        border: false,
        animCollapse: true,
        animateTarget: Ext.getBody(),
        constrain: true,
        items: [queryPanel, ordGrid],
        listeners : {  "beforehide" : function() {window_queryWindow.restore(); } },
        buttonAlign : 'left',
        buttons: [{
                text : '查询',
                iconCls  : 'page_findIcon',
                id : 'query_queryWindow'
            },'->',
            {
                text: '确认',
                iconCls: 'acceptIcon',
                id:'sure_queryWindow'
            },
            {
                text: '关闭',
                iconCls: 'deleteIcon',
                id:'close_queryWindow'
            }
        ]
    });
    /**
     * 订单号，款号详细详细信息查询数据
     */
    function queryStore4detailInfo(){
    	var params = {};
    	params.order_name = getValueNoNullById('order_id_queryWindow');
    	params.style_no = getValueNoNullById('style_no_queryWindow');
    	params.cust_name = getValueNoNullById('cust_name_queryWindow');
    	loadStore4ordStore(params);
    }
    
    /**
     * 按工厂查询
     * 封装工厂的查询
     */
    function queryStore4facInfo(){
        var grpArr = grp_tree.getChecked();
        // 封装查询的工厂信息
        var grps = [];
        for(var idx=0;idx<grpArr.length;idx++){
            if(grpArr[idx].leaf){
                grps.push(grpArr[idx].id)
            }
        }
        var params = {
            belong_grps : grps.join(',')
        };
        loadStore4ordStore(params);
    }
    
    /**
     * 按客户查询
     */
    function queryStore4custInfo(){
         var custArr = cust_tree.getChecked();
        // 封装查询的工厂信息
        var custs = [];
        for(var idx=0;idx<custArr.length;idx++){
            if(custArr[idx].leaf){
                var custBean = custArr[idx];
                custs.push(custBean.id.substr(4,custBean.length))
            }
        }
        var params = {
            cust_ids : custs.join(',')
        }
        loadStore4ordStore(params);
    }
    
    
     /**
      * ordStore 加载函数
      * @param {} params   个性参数
      */
     var old_params = {};   //保存首次查询的参数
     function loadStore4ordStore(/**传入特定参数*/params){
     	//保存现有的查询条件
     	if(Ext.isEmpty(params)){
     		params = {};   //如果为空 则构建一个空对象
     		Ext.apply(params,old_params); //不是首次查询的条件，赋予旧参数
     	}else {
     		old_params = {}; //清空旧数据
     		Ext.apply(old_params,params); //保存第一次查询的条件
     	}
     	
        var prodstatus = ordstateCombo.getValue();
        //添加一般参数
        params.start = 0;
        params.limit = ordBbar.pageSize;
        params.startdate =  Ext.getCmp('startdate_queryWindow').getValue();
        params.enddate =  Ext.getCmp('enddate_queryWindow').getValue();
        // 增加完单报告
        var isReportOrder = Ext.getCmp('isReportOrder').checked;
        params.report_order = isReportOrder ? 'yes' : '';
        params.ismyorder = addmyorderQuery();
        params.prodstatus = prodstatus;
         //添加日期定义参数  0： FOB交期 1：缝制起始日期 2：生产范围日期 
        params.dateType=Ext.getCmp("dateTypeCombo").value;
        
        //加载数据
        ordStore.baseParams = params;   // 查询条件赋值给store 在翻页查询中使用
        ordStore.load({
            params: params
        });
    }
    /**
     * 获取我的订单的信息
     * @return {}
     */
    function addmyorderQuery(){
        var ischecked = Ext.getCmp('myorder_qw').checked;
        var myorder = ischecked?"yes":"";    //1表示我的订单
        return myorder;
    }
    /**
     * 获取选择项的条件
     */
    function queryStore4queryButton(){
    	var params = {};
        var radioValue = Ext.getCmp('leavRadio').getValue().inputValue;
        if(radioValue==0){
            queryStore4facInfo();
        }else if(radioValue==1){
            queryStore4custInfo();
        }else if(radioValue==2){
            queryStore4detailInfo();
        }
        
    }
     /**
     * 通过id获取值
     * @param {} idval 传入的id
     */
    var getValueNoNullById = function(idval){
        var value = Ext.getCmp(idval).getValue();
        return value?value:'';
    }
    window_queryWindow.on('deactivate',function(){
    	window_queryWindow.hide();
    })
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~为元素提供事件~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
    var listeners = {}
    Ext.getCmp('sure_queryWindow').addListener('click',function(){
        var records = ordGrid.getSelectionModel().getSelections();
        if (Ext.isEmpty(records)) {
            alert('提示:请选择一条记录!');
            return;
        }
        for(var idx in listeners){
        	var fun = listeners[idx];
        	try{
        	   setTimeout(rollbackFun(fun,records),50);   //加上try/catch 防止执行函数出错对程序执行顺序发生变化
        	}catch(e){
        	   console.error(e);
        	}
        }
        hideQueryWindow();  //完成隐藏界面
    });
    /**
     * 回调的函数
     * fun:执行的函数
     * records:参数 
     */
    function rollbackFun(fun,records){
    	return function(){
    	   fun(records);
    	}
    }
    
    //=====================================添加事件===============================
    Ext.getCmp('close_queryWindow').addListener('click',function(){
        window_queryWindow.hide();
        window_queryWindow.restore();
        Ext.getCmp('order_id_queryWindow').setValue('');
        Ext.getCmp('cust_name_queryWindow').setValue('');
        Ext.getCmp('startdate_queryWindow').setValue('');
        Ext.getCmp('enddate_queryWindow').setValue('');
        Ext.getCmp('style_no_queryWindow').setValue('');
        ordStore.removeAll();
    });
    /**
     * 查询-点击事件
     */
    Ext.getCmp('query_queryWindow').addListener('click',function(){
        queryStore4queryButton();   // 查询信息
    });
    
    
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~对传入参数进行初始化操作~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
    function setLockColumnModle(){  // lock：锁定列模型，unlock：是非锁定列模型
        // 设置列模型试图
        ordGrid.view = new Ext.ux.grid.LockingGridView();
        // 设置锁定类模型
        
        var lockCm = new Ext.ux.grid.LockingColumnModel(ordGrid.getColumnModel().config)
        ordGrid.reconfigure(ordGrid.getStore(), lockCm);
    }
    
    if('lock'==flag) {  //如果是锁定列模型就修改
        setLockColumnModle();
    }
   /********************级联选中支持开始 ******************** */
    function cascadeParent() {
        var treeId = '' + this.attributes.id;
        if (treeId.indexOf('part') != -1) {
            return;
        }
        var pn = this.parentNode;
        if (!pn || !Ext.isBoolean(this.attributes.checked))
            return;
        if (this.attributes.checked) {// 级联选中
            pn.getUI().toggleCheck(true);
        } else {// 级联未选中
            var b = true;
            Ext.each(pn.childNodes, function (n) {
                if (n.getUI().isChecked()) {
                    return b = false;
                }
                return true;
            });
            if (b)
                pn.getUI().toggleCheck(false);
        }
        pn.cascadeParent();
    }

    function cascadeChildren() {
        var ch = this.attributes.checked;
        if (!Ext.isBoolean(ch))
            return;
        Ext.each(this.childNodes, function (n) {
            n.getUI().toggleCheck(ch);
            n.cascadeChildren();
        });
    }

    // 为TreeNode对象添加级联父节点和子节点的方法
    Ext.apply(Ext.tree.TreeNode.prototype, {
        cascadeParent: cascadeParent,
        cascadeChildren: cascadeChildren
    });
    // Checkbox被点击后级联父节点和子节点
    Ext.override(Ext.tree.TreeEventModel, {
        onCheckboxClick: Ext.tree.TreeEventModel.prototype.onCheckboxClick
            .createSequence(function (e, node) {
                node.cascadeParent();
                node.cascadeChildren();
            })
    });
    
    
    
    
    
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~提供操作接口~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
    /**
     * 显示窗口
     */
    function showQueryWindow(){
        window_queryWindow.show();
    }
    /**
     * 隐藏窗口
     */
    function hideQueryWindow(){
    	window_queryWindow.hide();
    }
    /**
     * 添加确认事件
     * 参数为record集合
     */
    function addListener(code,fun){
    	if(Ext.isEmpty(listeners[code])){
    		listeners[code] = fun;
    		return true;
    	}
    	return false;
    }
    /**
     * 移除事件
     */
    function removeListener(code){
    	delete listeners[code];
    }
    
    /**
     *  设置订单状态的值
     *  
     */
    function setOrderState(value){
    	var cmp = Ext.getCmp('orderState');
    	cmp.setValue(value);
    }
    /**
     * 设置我的订单状态 
     */
    function setMyOrderState(value){
        //TODO
        Ext.getCmp('myorder_qw').setValue(value);
    }
    /**
     * 清除事件
     */
    function clearListener(){
        listeners = {}; // 初始化事件
    }
    
    queryWindow.showQueryWindow = showQueryWindow;
    queryWindow.hideQueryWindow = hideQueryWindow;
    queryWindow.addListener = addListener;
    queryWindow.setOrderState = setOrderState;
    queryWindow.setMyOrderState = setMyOrderState;
    queryWindow.clearListener = clearListener;
    
    return queryWindow;
    
   
    
  }
  
    