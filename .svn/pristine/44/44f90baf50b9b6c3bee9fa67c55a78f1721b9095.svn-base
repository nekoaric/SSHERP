/************************************************
 * 创建日期: 2015-07-18
 * 创建作者：xtj
 * 功能：salesfocus报表
 * 最后修改时间：
 * 修改记录：
 *************************************************/
 Ext.onReady(function(){
 	var old_params={};
 	// 构造ColumnModel    
 	var operater_id=[];
 	var namePassFlag=false;
 	var sm = new Ext.grid.CheckboxSelectionModel({
		singleSelect: true
	});    
    var cm = new Ext.ux.grid.LockingColumnModel([
    		sm,new Ext.grid.RowNumberer(),{
    			header:'seq_no',
    			dataIndex:'seq_no',
    			hidden : true
    		},{
    			header:'组别',
    			dataIndex:'team',
    			width:150
    		},{
    			header:'客户',
    			dataIndex:'brand',
    			width:150
    		},{
    			header:'负责人',
    			dataIndex:'leader',
    			width:150
    		},{
    			header:'产地',
    			dataIndex:'location',
    			width:150
    		},{
    			header:'操作人',
    			dataIndex:'operater',
    			width:200
    		},{
    			header:'备注',
    			dataIndex:'remark',
    			width:80
    		},{
    			header:'建议',
    			dataIndex:'sugesstion',
    			width:80
    		},{
    			header:'状态',
    			dataIndex:'state',
    			width:80,
    			renderer:function(v){
    				if(v==0){
    					return '正常';
    				}else{
    					return '删除';
    				}
    			}
    		}
        ]);
        
    var store= new Ext.data.Store({
    	proxy : new Ext.data.HttpProxy({
    		url:'./salesFocus.ered?reqCode=querySalesFocusBrandInfo'
    	}),
    	reader: new Ext.data.JsonReader({
    		totalProperty : 'TOTALCOUNT',
    		root:'ROOT'
    	},['seq_no','team','brand','leader','operater','location','remark','suggestion','state'])
    	});
    
    
    
    var pagesize_combo = new Ext.form.ComboBox({
        name : 'pagesize',
        hiddenName : 'pagesize',
        typeAhead : true,
        triggerAction : 'all',
        lazyRender : true,
        mode : 'local',
        store : new Ext.data.ArrayStore({
                    fields : ['value', 'text'],
                    data : [[10, '10条/页'], [20, '20条/页'], [50, '50条/页'],
                            [100, '100条/页'], [250, '250条/页'], [500, '500条/页']]
                }),
        valueField : 'value',
        displayField : 'text',
        value : '50',
        editable : false,
        width : 85
    });
	var number = parseInt(pagesize_combo.getValue());
    
    var Bbar = new Ext.PagingToolbar({
        pageSize : number,
        store : store,
        displayInfo : true,
        displayMsg : '显示{0}条到{1}条,共{2}条',
        plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
        emptyMsg : "没有符合条件的记录",
        items : ['-', '&nbsp;&nbsp;', pagesize_combo]
    });
 // 改变每页显示条数reload数据
    pagesize_combo.on("select", function(comboBox) {
    	Bbar.pageSize = parseInt(comboBox.getValue());
                number = parseInt(comboBox.getValue());
                querySalesFocusBrandInfo();
            });
    var form=new Ext.form.FormPanel({
    	labelAlign : 'right',
                height : 150,
                padding : '5,5,5,5',
                defaults : {
                    bodyStyle : 'padding-top:5'
                },
                items : [{
                            xtype : 'textfield',
                            lable : 'seq',
                            id : 'seq_no',
                            name : 'seq_no',
                            hidden:true,
                            hideLabel:true
                        },{
                            xtype : 'textfield',
                            fieldLabel : '品牌',
                            id : 'brand',
                            name : 'brand',
                            width : 400,
                            allowBlank : false
                        }, {
                            xtype : 'textfield',
                            fieldLabel : '组别',
                            id : 'team',
                            name : 'team',
                            width : 400,
                            allowBlank : false
                        }, {
                            xtype : 'textfield',
                            fieldLabel : '负责人',
                            id : 'leader',
                            name : 'leader',
                            width : 400,
                            allowBlank : false
                        }, {
                            xtype : 'textfield',
                            fieldLabel : '操作人',
                            id : 'operater',
                            name : 'operater',
                            width : 400,
                            allowBlank : false,
                            emptyText:"请填写订单操作人在系统中的中文名，以“,”(英文)分隔多人。",
                            listeners : {
							       change : function(field,newValue,oldValue){
							               Ext.Ajax.request({
                                    url : './salesFocus.ered?reqCode=checkOperater',
                                    success : function(value) {
                                        var result = Ext.util.JSON.decode(value.responseText);
                                        if (result.msg.length<=10) {
                                        	Ext.Msg.alert("提示信息","验证通过");
                                        	namePassFlag=true;
                                        } else {
                                            Ext.Msg.alert("提示信息", result.msg);
                                            namePassFlag=false;
                                        }
                                    },
                                    failure : function() {
                                        Ext.Msg.alert("提示信息", "验证失败"+ result.msg);
                                    },
                                    params : {
                                        operater : newValue
                                    }
                                })
							       }
							}
                        }, {
                            xtype : 'textfield',
                            fieldLabel : '产地',
                            id : 'location',
                            name : 'location',
                            width : 400,
                            allowBlank : false
                        }, {
                            xtype : 'textfield',
                            fieldLabel : '备注',
                            id : 'remark',
                            name : 'remark',
                            width : 400
                        }, {
                            xtype : 'textfield',
                            fieldLabel : '建议',
                            id : 'sugesstion',
                            name : 'sugesstion',
                            width : 400
                        }]
            });
    // 修改新增用窗口
    var infoWindow = new Ext.Window({
                id : 'infoWindow',
                layout : "fit",
                title : '新增品牌信息',
                width : 600,
                height : 300,
                resizable : false,
                draggable : true,
                closeAction : 'hide',
                modal : true,
                collapsible : true,
                titleCollapse : true,
                maximizable : false,
                buttonAlign : 'right',
                border : false,
                animCollapse : true,
                animateTarget : Ext.getBody(),
                defaults : {
                    bodyStyle : 'padding-top:5'
                },
                constrain : true,
                padding : '5,5,5,5',
                items : [form],
                bbar : ['->',{
                    id : 'saveButton_update',
                    xtype : 'button',
                    hidden:true,
                    text : '确认修改',
                    handler : function() {
                    	if(!namePassFlag){
                    		Ext.Msg.alert("提示信息", "操作员验证不通过，请修改姓名");
                    		return;
                    	}
                        Ext.Ajax.request({
                                    url : './salesFocus.ered?reqCode=updateSalesFocusBrandInfo',
                                    success : function(value) {
                                        var result = Ext.util.JSON.decode(value.responseText);
                                        if (result.success) {
                                            Ext.Msg.alert("提示信息", "修改成功");
                                            Ext.getCmp('infoWindow').hide();
                                            querySalesFocusBrandInfo();
                                        } else {
                                            Ext.Msg.alert("提示信息", "保存失败");
                                        }
                                    },
                                    failure : function() {
                                        Ext.Msg.alert("提示信息", "保存失败"+result.msg);
                                    },
                                    params : {
                                        seq_no : Ext.getCmp('seq_no').getValue(),
                                        brand : Ext.getCmp('brand').getValue(),
                                        team : Ext.getCmp('team').getValue(),
                                        leader : Ext.getCmp('leader').getValue(),
                                        operater : Ext.getCmp('operater').getValue(),
                                        location : Ext.getCmp('location').getValue(),
                                        remark : Ext.getCmp('remark').getValue(),
                                        sugesstion : Ext.getCmp('sugesstion').getValue()
                                    }
                                })
                    }
                }, {
                    id : 'saveButton_add',
                    xtype : 'button',
                    text : '保存',
                    hidden:true,
                    handler : function() {
                    	if(!namePassFlag){
                    		Ext.Msg.alert("提示信息", "操作员验证不通过，请修改姓名");
                    		return;
                    	}
                        Ext.Ajax.request({
                                    url : './salesFocus.ered?reqCode=addSalesFocusBrandInfo',
                                    success : function(response) {
                                        var result = Ext.util.JSON
                                                .decode(response.responseText);
                                        if (result.success) {
                                            Ext.Msg.alert("提示信息", "保存成功");
                                            infoWindow.hide();
                                            querySalesFocusBrandInfo();
                                        } else {
                                            Ext.Msg.alert("提示信息", "保存失败");
                                        }
                                    },
                                    failure : function() {
                                        Ext.Msg.alert("提示信息", "保存失败");
                                    },
                                    params : {
                                        seq_no : Ext.getCmp('seq_no').getValue(),
                                        brand : Ext.getCmp('brand').getValue(),
                                        team : Ext.getCmp('team').getValue(),
                                        leader : Ext.getCmp('leader').getValue(),
                                        operater : Ext.getCmp('operater').getValue(),
                                        location : Ext.getCmp('location').getValue(),
                                        remark : Ext.getCmp('remark').getValue(),
                                        sugesstion : Ext.getCmp('sugesstion').getValue()
                                    }
                                })
                    }
                }, {
                    id : 'close',
                    xtype : 'button',
                    text : '关闭',
                    handler : function() {
						infoWindow.hide();
                    }
                }]
            })
    
    var grid = new Ext.grid.GridPanel({    
        sm: sm,    
        store: store,    
        cm: cm,    
        height: 700,
        width:600,
        border : false,
        region : 'center',
        stripeRows : true,
        title: 'SalesFocusBrandInfo',    
        frame: true,
        bbar: Bbar,
        tbar: [{    
            text: "新增",    
            iconCls : 'page_addIcon',
            handler: function() {   
             infoWindow.show();
             Ext.getCmp('saveButton_add').show();
             Ext.getCmp('saveButton_update').hide();
             clearForm();
            }    
        },'-',    
            {    
            	xtype:'button',
                text: "修改",    
                iconCls : 'page_edit_1Icon',
                handler: function() {    
                	var record = grid.getSelectionModel().getSelected();
                	if (Ext.isEmpty(record)) {
                                    Ext.Msg.alert('提示', '请选择一行有效记录！');
                                    return;
                                }
                    Ext.getCmp('infoWindow').title="修改品牌信息";            
                    infoWindow.show();
                    Ext.getCmp('saveButton_add').hide();
             		Ext.getCmp('saveButton_update').show();
                    Ext.getCmp('seq_no').setValue(record.get('seq_no'));
                    Ext.getCmp('team').setValue(record.get('team'));
					Ext.getCmp('brand').setValue(record.get('brand'));
					Ext.getCmp('leader').setValue(record.get('leader'));
					Ext.getCmp('operater').setValue(record.get('operater'));
					Ext.getCmp('location').setValue(record.get('location'));
					Ext.getCmp('remark').setValue(record.get('remark'));
					Ext.getCmp('sugesstion').setValue(record.get('sugesstion'));
                }    
            },    
            " ",    
            {    
                text: "删除", 
                iconCls : 'page_delIcon',
                handler: function() {    
                    var selModel = grid.getSelectionModel();    
                    if (selModel.hasSelection()) {    
                        Ext.Msg.confirm("警告", "确定要删除吗？", function(button) {    
                            if (button == "yes") {    
                                  Ext.Ajax.request({
                                    url : './salesFocus.ered?reqCode=deleteSalesFocusBrandInfo',
                                    success : function(value) {
                                        var result = Ext.util.JSON.decode(value.responseText);
                                        if (result.success) {
                                            Ext.Msg.alert("提示信息", "删除成功");
                                            Ext.getCmp('infoWindow').hide();
                                            store.reload();
                                            form.reset();
                                        } else {
                                            Ext.Msg.alert("提示信息", "删除失败");
                                        }
                                    },
                                    failure : function() {
                                        Ext.Msg.alert("提示信息", "删除失败");
                                    },
                                    params : {
                                        seq_no : selModel.getSelected().get("seq_no")
                                    }
                                })
                            }    
                        });    
                    }    
                    else {    
                        Ext.Msg.alert("错误", "没有任何行被选中，无法进行删除操作！");    
                    }    
                }    
            },'-','组别:',{
                id : 'team_query',
                name : 'team_query',
                xtype : 'textfield',
                emptyText : '请输入组别',
                width:100,
                enableKeyEvents : true,
                listeners : {
                    specialkey : function(field, e) {
                        if (e.getKey() == Ext.EventObject.ENTER) {
                        	querySalesFocusBrandInfo();
                        }
                    }
                }
            } ,'-','客户:',{
                id : 'brand_query',
                name : 'brand_query',
                xtype : 'textfield',
                emptyText : '请输入客户',
                width:100,
                enableKeyEvents : true,
                listeners : {
                    specialkey : function(field, e) {
                        if (e.getKey() == Ext.EventObject.ENTER) {
                        	querySalesFocusBrandInfo();
                        }
                    }
                }
            } ,'-','负责人:',{
                id : 'leader_query',
                name : 'leader_query',
                xtype : 'textfield',
                emptyText : '请输入负责人',
                width:100,
                enableKeyEvents : true,
                listeners : {
                    specialkey : function(field, e) {
                        if (e.getKey() == Ext.EventObject.ENTER) {
                        	querySalesFocusBrandInfo();
                        }
                    }
                }
            } ,'-','产地:',{
                id : 'location_query',
                name : 'location_query',
                xtype : 'textfield',
                emptyText : '请输入产地',
                width:100,
                enableKeyEvents : true,
                listeners : {
                    specialkey : function(field, e) {
                        if (e.getKey() == Ext.EventObject.ENTER) {
                        	querySalesFocusBrandInfo();
                        }
                    }
                }
            } , {
                text : '查询',
                iconCls : 'page_findIcon',
                handler : function() {
                    querySalesFocusBrandInfo();
                }
            }
                ]    
 	})
 	
 	// 查询
    function querySalesFocusBrandInfo(params){
        //保存现有的查询条件
        if(Ext.isEmpty(params)){
            params = {};   //如果为空 则构建一个空对象
            Ext.apply(params,old_params); //不是首次查询的条件，赋予旧参数
        }else {
            old_params = {}; //清空旧数据
            Ext.apply(old_params,params); //保存第一次查询的条件
        }
        params.start = 0;
        params.limit = Bbar.pageSize;
        params.brand = Ext.getCmp("brand_query").getValue();
        params.team = Ext.getCmp("team_query").getValue();
        params.leader = Ext.getCmp("leader_query").getValue();
        params.location = Ext.getCmp("location_query").getValue();
        store.load({
			params : params
		});
    }
 	
    //清空表单
    function clearForm(){
    	Ext.getCmp('seq_no').setValue('');
		Ext.getCmp('brand').setValue('');
		Ext.getCmp('team').setValue('');
		Ext.getCmp('leader').setValue('');
		Ext.getCmp('operater').setValue('');
		Ext.getCmp('location').setValue('');
		Ext.getCmp('remark').setValue('');
		Ext.getCmp('sugesstion').setValue('');
    }
 	/**
     * 布局
     */
    var viewport = new Ext.Viewport({
                layout : 'border',
                items : [{
                            region : 'center',
                            layout : 'fit',
                            margins : '3 3 3 3',
                            items : [grid]
                        }]
            });
 	querySalesFocusBrandInfo();
 });