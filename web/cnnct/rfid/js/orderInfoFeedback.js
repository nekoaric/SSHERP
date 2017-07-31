/**
 * 订单反馈信息处理
 * @author zhouww
 * @since 2015-03-17
*/

Ext.onReady(function(){
    // URL参数
    var queryFbOrderInfoURL = './orderFeedback.ered?reqCode=queryFbOrder';
    var updateFBInfoURL = './orderFeedback.ered?reqCode=upddateFbOrder'
    
    
    //====================================组件
    
     var store = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: queryFbOrderInfoURL
        }),
        autoLoad : true,
        reader: new Ext.data.JsonReader({
            totalProperty: 'TOTALCOUNT',
            root: 'ROOT'
        }, ['seq_no','order_id','style_no','ribbon_color','opr_name','opr_id','opr_date','opr_time',
            'handle_date','handle_time','handle_name','handle_id','state','remark'])
    });
    
    var ordPagesize_combo = new Ext.form.ComboBox({
        hiddenName : 'pagesize',
        typeAhead : true,
        triggerAction : 'all',
        lazyRender : true,
        mode : 'local',
        store : new Ext.data.ArrayStore({
                    fields : ['value', 'text'],
                    data : [[50, '50条/页'],[100, '100条/页'], 
                    [250, '250条/页'], [500, '500条/页']]
                }),
        valueField : 'value',
        displayField : 'text',
        value : '50',
        editable : false,
        width : 85
    });
    
    ordPagesize_combo.on("select", function(comboBox) {
        ordBbar.pageSize = parseInt(comboBox.getValue());
    });
    
    var ordBbar = new Ext.PagingToolbar({
        pageSize : 50,
        store : store,
        displayInfo : true,
        displayMsg : '显示{0}条到{1}条,共{2}条',
        plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
        emptyMsg : "没有符合条件的记录",
        items : ['-', '&nbsp;&nbsp;', ordPagesize_combo]
    });
    
    /**
     * 处理状态下拉框
     */
    var handleState_comboBox = new Ext.ux.form.LovCombo({
        name : 'state', 
        hiddenName : 'hadnleState',
        typeAhead : true,
        triggerAction : 'all',
        lazyRender : true,
        mode : 'local',
        store : new Ext.data.ArrayStore({
                    fields : ['value', 'text'],
                    data : [[0, '新提交'],[1, '不处理'], 
                    [2, '处理中'], [3, '处理完毕']]
                }),
        valueField : 'value',
        autoSelect: true,  
        value:'0,2,3',
        displayField : 'text',
        emptyText : '请选择...',
        editable : false,
        width : 85
    })
    
    var tbar = new Ext.Toolbar({
        items : ['处理状态:',handleState_comboBox,'-','提交人员姓名:', {
                    id : 'query_name',
                    name : 'query_name',
                    xtype : 'textfield',
                    emptyText : '人员姓名',
                    width:100
                },'-','提交人员工号:',{
                    id : 'query_opr_account',
                    name : 'query_opr_account',
                    xtype : 'numberfield',
                    emptyText : '提交人员的工号',
                    width : 100,    
                    style : 'text-align:left'
                },'-', '反馈编号:', {
                    id : 'query_seq_no',
                    name : 'query_seq_no',
                    xtype : 'numberfield',
                    emptyText : '反馈编号',
                    width:100,
                    style : 'text-align:left'
                },'-','处理人员姓名:',{
                    id : 'query_handle_name',
                    name : 'query_handle_name',
                    xtype : 'textfield',
                    emptyText : '姓名',
                    width : 100
                }]
    })
    
    var tbar2 = new Ext.Toolbar({
        items : ['-','开始日期:',{
            id : 'query_start_date',
            name : 'query_start_date',
            xtype : 'datefield',
            emptyText : '查询提交的开始日期',
            format : 'Y-m-d',
            width :120,
            editable : false
        },'-','结束日期:',{
            id : 'query_end_date',
            name : 'query_end_date',
            xtype : 'datefield',
            emptyText : '查询提交的结束日期',
            format : 'Y-m-d',
            width :120,
            editable : false
        },'-','处理人员工号:',{
                    id : 'query_handle_account',
                    name : 'query_handle_account',
                    xtype : 'numberfield',
                    emptyText  :'处理人员工号',
                    width : 100,
                    style : 'text-align:left'
                },'-',{
                    id : 'query_button',
                    name : 'query_button',
                    xtype : 'button',
                    text : '查询',
                    iconCls : 'page_findIcon',
                    width : 100,
                    handler :function(){
                        loadStore();
                    }
                },'-',{
            xtype : 'button',
            text : '修改',
            iconCls : 'page_edit_1Icon',
            handler : function(){
                updateFbInfo();
            }
        }]
    })
    
    var sm = new Ext.grid.CheckboxSelectionModel({
        singleSelect: true
    });

    /** 定义列头 */
    var cm = new Ext.grid.ColumnModel([sm,new Ext.grid.RowNumberer(), {
        header: '反馈编号',
        dataIndex: 'seq_no'
    },{
        header : '订单号',
        dataIndex : 'order_id'
    },{
        header : '款号',
        dataIndex : 'style_no'
    },{
        header : '丝带色号',
        dataIndex : 'ribbon_color'
    },{
        header : '处理状态',
        dataIndex : 'state',
        renderer : function(value){
            switch(value){
                case '0' : return '新提交';
                case '1' : return '不处理';
                case '2' : return '处理中';
                case '3' : return '处理完毕';
                default : return value;
            }
        }
    },{
        header : '处理日期',
        dataIndex : 'handle_date'
    },{
        header : '处理时间',
        dataIndex : 'handle_time'
    },{
        header : '处理人员',
        dataIndex  : 'handle_name'
    },{
        header : '处理备注',
        dataIndex : 'remark'
    },{
        header : '提交日期',
        dataIndex : 'opr_date'
    },{
        header : '提交时间',
        dataIndex : 'opr_time'
    },{
        header : '提交人员',
        dataIndex : 'opr_name'
    },{
        header : '提交人员编号',
        dataIndex : 'opr_id',
        hidden : true
    }]);
    
    
    var fbGrid = new Ext.grid.GridPanel({
        title: '订单信息反馈',
        height: '100%',
        autoScroll: true,
        region: 'center',
        store: store,
        loadMask: {
            msg: '正在加载表格数据,请稍等...'
        },
        stripeRows: true,
        frame: true,
        cm: cm,
        sm: sm,
        tbar : tbar,
        bbar: ordBbar,
        listeners : {
            render : function() {
                tbar2.render(this.tbar);
            }
        }
    })
    
    /**
     * 修改下的状态下拉框
     */
    var updateState_comboBox = new Ext.form.ComboBox({
        name : 'state',
        hiddenName : 'state',
        typeAhead : true,
        fieldLabel : '处理状态',
        triggerAction : 'all',
        lazyRender : true,
        mode : 'local',
        store : new Ext.data.ArrayStore({
                    fields : ['value', 'text'],
                    data : [[0, '新提交'],[1, '不处理'], 
                    [2, '处理中'], [3, '处理完毕']]
                }),
        valueField : 'value',
        displayField : 'text',
        emptyText : '请选择...',
        editable : false,
        width : 150
    })
    //   修改窗口
    var updateForm = new Ext.FormPanel({
        title : '',
        labelAlign : 'right',
        border : false,
        frame : true,
        items : [{
            xtype : 'textfield',
            fieldLabel : '编号',
            readOnly : true,
            name : 'seq_no',
            id : 'update_seq_no'
        },{
            xtype : 'textfield',
            fieldLabel : '订单号',
            readOnly : true,
            name : 'order_id'
        },{
            xtype : 'textfield',
            fieldLabel : '款号',
            readOnly : true,
            name : 'style_no'
        },{
            xtype : 'textfield',
            fieldLabel : '丝带色号',
            readOnly : true,
            name : 'ribbon_color'
        },updateState_comboBox,{
            xtype : 'textarea',
            fieldLabel : '备注',
            width : '100%',
            name : 'remark',
            id : 'update_remark'
        }]
        
    })
    
    var updateWindow = new Ext.Window({
        title : '修改订单反馈信息',
        closeAction : 'hide',
        width : 400,
        items : [updateForm],
        buttons :['->',{
            text : '保存',
            iconCls : 'acceptIcon',
            handler : function(){
                saveUpdateInfo();
            }
        },{
            text : '取消',
            iconCls : 'deleteIcon',
            handler : function(){
                updateWindow.hide();
            }
        }]
    })
    
    //~===================================组件结束
    //===================================函数
    //  保存修改信息
    function saveUpdateInfo(){
        var updateSeqNo = Ext.getCmp('update_seq_no').getValue();
        var updateState = updateState_comboBox.getValue();
        var updateRemark = Ext.getCmp('update_remark').getValue();
        //TODO
        Ext.Ajax.request({
                    url : updateFBInfoURL,
                    success : function(value) {
                        var result = Ext.util.JSON.decode(value.responseText);
                        if (result.success) {
                            Ext.Msg.alert("提示信息", "完成修改");
                            updateWindow.hide();
                            store.reload(); // 重新加载数据
                        } else {
                            Ext.Msg.alert("提示信息", "修改失败");
                        }
                    },
                    failure : function() {
                        Ext.Msg.alert("提示信息", "修改失败");
                    },
                    params : {
                        seq_no : updateSeqNo,
                        state : updateState,
                        remark : updateRemark
                    }
                })
    }
    // 修改订单反馈信息
    function updateFbInfo(){
        var arr = fbGrid.getSelectionModel().getSelections();
        if(arr.length==0){
            Ext.Msg.alert('提示','请选择一条修改数据');
            return; 
        }
        updateWindow.show();
        // 获取选择的数据
        var record = arr[0];
        updateForm.getForm().loadRecord(record);
        
    }
    
    var old_params = {};
    old_params.states="'0','2','3'";
    // 如果传入没有参数用旧参数，如果传入有新参数则使用新参数
    function loadStore(params){
        // 保存现有的查询条件
        if(Ext.isEmpty(params)){
            params = {};   //如果为空 则构建一个空对象
            Ext.apply(params,old_params); //不是首次查询的条件，赋予旧参数
        }else {
            old_params = {}; //清空旧数据
            Ext.apply(old_params,params); //保存第一次查询的条件
        }
        // 添加一般性的查询条件
        var query_opr_name = Ext.getCmp('query_name').getValue();
        var query_opr_account = Ext.getCmp('query_opr_account').getValue();
        var query_seq_no = Ext.getCmp('query_seq_no').getValue();
        var query_handle_name = Ext.getCmp('query_handle_name').getValue();
        var query_handle_account = Ext.getCmp('query_handle_account').getValue();
        var queryState = handleState_comboBox.getValue();
        var query_start_date = Ext.getCmp('query_start_date').getValue();
        query_start_date = query_start_date? query_start_date.format('Y-m-d') : '';
        var query_end_date = Ext.getCmp('query_end_date').getValue();
        query_end_date = query_end_date? query_end_date.format('Y-m-d') : '';
        
        // 处理状态字符串
        if(queryState.length>0){
            var arr = queryState.split(';');
            var states = arr.join("','");
            queryState = "'" + states + "'";
        }
        
        params.opr_name = query_opr_name;
        params.opr_id = query_opr_account;
        params.handle_name = query_handle_name;
        params.handle_id = query_handle_account;
        params.seq_no = query_seq_no;
        params.states = queryState;
        params.start_date = query_start_date
        params.end_date = query_end_date;
        
        params.start = 0;
        params.limit = ordBbar.pageSize;
        //加载数据
        store.baseParams = params;   // 查询条件赋值给store 在翻页查询中使用
        store.load({
            params: params
        });
    }
    //~==================================函数结束
    
    
     var viewport = new Ext.Viewport({
        layout : 'border',
        items : [fbGrid]
     }) 
})


