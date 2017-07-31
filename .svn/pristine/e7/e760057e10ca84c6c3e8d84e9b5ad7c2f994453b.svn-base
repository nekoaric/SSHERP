/************************************************
 * 创建日期: 2015-2-3
 * 创建作者：xutj
 * 功能：qc工序管理
 * 导入
 * 增删改查
 * 最后修改时间：
 * 修改记录：
 *************************************************/
 Ext.onReady(function () {
	
	
	var store= new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url:'./manageQC.ered?reqCode=queryQCProcess'
		}),
		reader:new Ext.data.JsonReader({
			totalProperty : 'TOTALCOUNT', // 记录总数
            root : 'ROOT' // Json中的列表数据根节点
		},[
			'seq_no','qc_position','class','qc_item','parent_no','parent_name','opr_date','state',
			'qc_position_name','class_name','qc_item_name','cc','ic'
			])
	});
	
	var pagesize_combo = new Ext.form.ComboBox({
		name : 'pagesize',
                triggerAction : 'all',
                mode : 'local',
                store : new Ext.data.ArrayStore({
                            fields : ['value', 'text'],
                            data : [[10, '10条/页'], [20, '20条/页'],
                                    [50, '50条/页'], [100, '100条/页'],
                                    [250, '250条/页'], [500, '500条/页']]
                        }),
                valueField : 'value',
                displayField : 'text',
                value : '50',
                editable : false,
                width : 85
	});
	 var number = parseInt(pagesize_combo.getValue());
    // 改变每页显示条数reload数据
    pagesize_combo.on("select", function(comboBox) {
                bbar.pageSize = parseInt(comboBox.getValue());
                number = parseInt(comboBox.getValue());
                loadStore();
            });
    // 分页工具栏
    var bbar = new Ext.PagingToolbar({
                pageSize : number,
                store : store,
                displayInfo : true,
                displayMsg : '显示{0}条到{1}条,共{2}条',
                plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
                emptyMsg : "没有符合条件的记录",
                items : ['-', '&nbsp;&nbsp;', pagesize_combo]
            });
	var tbar = new Ext.Toolbar({
        items : [
        {
                    text: '新增',
					id: 'new_button',
					iconCls: 'page_addIcon',
					hidden:true,
					handler: function () {
						addInit();
					}
        }
        ,'-',{
                    text: '修改',
					id: 'modify_button',
					iconCls: 'page_edit_1Icon',
					hidden:true,
					handler: function () {
						editInit();
					}
        }
        ,'-',{
                    text: '删除',
					id: 'delete_button',
					iconCls: 'page_delIcon',
					handler: function () {
						deleteQCItems();
					}
        }
        ,'-',{
                    text: '导入qc工序',
				iconCls: 'page_excelIcon',
				xtype:'button',
				handler: function () {
					importrolewindow.show();
				}
        },'->',new Ext.form.TextField({
					id: 'classParam',
					name: 'classParam',
					emptyText: '请输入样式名称',
					enableKeyEvents: true,
					listeners: {
						specialkey: function (field, e) {
							if (e.getKey() == Ext.EventObject.ENTER) {
								loadStore();
							}
						}
					},
					width: 130
				}),new Ext.form.TextField({
					id: 'positionParam',
					name: 'positionParam',
					emptyText: '请输入位置名称',
					enableKeyEvents: true,
					listeners: {
						specialkey: function (field, e) {
							if (e.getKey() == Ext.EventObject.ENTER) {
								loadStore();
							}
						}
					},
					width: 130
				}), {
                    text: '查询',
				iconCls: 'page_excelIcon',
				xtype:'button',
				handler: function () {
					loadStore();
				}
        }
        
        ]
	})
	
	var sm = new Ext.grid.CheckboxSelectionModel({
		singleSelect: true
	});
	
	var gcm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),sm, {
		header: '序号',
		dataIndex: 'seq_no',
		hidden: true
	}, {
		header: '样式',
		dataIndex: 'class_name',
		align: 'center',
		width: 120
	},  {
		header: 'qc位置',
		align: 'left',
		dataIndex: 'qc_position_name',
		width: 200
	}, {
		header: '检查项',
		align: 'left',
		dataIndex: 'qc_item_name',
		width: 200
	}, {
		header: '所属检查项',
		align: 'left',
		dataIndex: 'parent_name',
		width: 200
	}]);

	
	 var grid = new Ext.grid.GridPanel({
                id : 'prodOrdGrid',
                title : '<span style="font-weight:normal">qc工序管理</span>',
                height : 590,
                store : store,
                region : 'center',// 和VIEWPORT布局模型对应，充当center区域布局
                loadMask : {
                    msg : '正在加载表格数据,请稍等...'
                },
                stripeRows : true,// 斑马线 True表示为显示行的分隔符（默认为true）。
                // frame: true,// True表示为面板的边框外框可自定义的
                border : false,
                cm : gcm,
                tbar : tbar,
                bbar : bbar
               
            });
	
	//导入qcexcel 
	var importformpanel = new Ext.form.FormPanel({
		id: 'importformpanel',
		name: 'importformpanel',
		defaultType: 'textfield',
		labelAlign: 'right',
		labelWidth: 105,
		width: 280,
		height: 220,
		frame: true,
		fileUpload: true,
		items: [
			{
				fieldLabel: '导入文件(Excel)',
				name: 'theFile',
				id: 'theFile',
				inputType: 'file',
				allowBlank: false,
				blankText: "请选择导入文件",
				anchor: '94%'
			},
			{
				xtype: "label",
				labelStyle: 'color:red;width=60px;',
				html: "<SPAN STYLE='COLOR:blue'><a href='./cnnct/template/qcitem.xlsx' target='_blank'>qc模板文件</a></SPAN>",
				anchor: '99%'
			}
		]
	});

	var importrolewindow = new Ext.Window({
		layout: 'fit',
		width: 400,
		height: 200,
		resizable: false,
		draggable: false,
		closeAction: 'hide',
		title: '导入Excel',
		modal: false,
		collapsible: true,
		titleCollapse: true,
		maximizable: false,
		buttonAlign: 'right',
		border: false,
		animCollapse: true,
		animateTarget: Ext.getBody(),
		constrain: true,
		items: [importformpanel],
		buttons: [
			{
				text: '导入',
				iconCls: 'acceptIcon',
				handler: function () {
					var theFile = Ext.getCmp('theFile').getValue();
					if (Ext.isEmpty(theFile)) {
						Ext.Msg.alert('提示', '请先选择您要导入的xls文件或.xlsx文件。');
						return;
					}

					if (theFile.substring(theFile.length - 4, theFile.length) != ".xls" &&
						theFile.substring(theFile.length - 5, theFile.length) != ".xlsx") {
						Ext.Msg.alert('提示', '您选择的文件格式不对,只能导入.xls文件或.xlsx文件!');
						return;
					}

					importformpanel.getForm().submit({
						url: 'manageQC.ered?reqCode=importQCInfo',
						waitTitle: '提示',
						method: 'POST',
						waitMsg: '正在处理数据,请稍候...',
						success: function (form, action) {
							importrolewindow.hide();
							clearFormPanel(importformpanel);
							Ext.Msg.alert('提示', action.result.msg);
						},
						failure: function (form, action) {
							Ext.Msg.alert('提示', action.result.msg);
						}
					});
				}
			},
			{
				text: '关闭',
				id: 'btnReset',
				iconCls: 'deleteIcon',
				handler: function () {
					importrolewindow.hide();
				}
			}
		]
	});
	
	//addpanel
	var addQCItemPanel = new Ext.form.FormPanel({
		id:'addQCItemPanel',
		name:'addQCItemPanel',
		defaultType:'textfield',
		labelAlign:'right',
		lableWidth:70,
		frame:true,
		item:[
			{
				fieldLable:'分类',
				name:'class_name',
				id:'class_name',
				allowBlank:false,
				anchor:'95%'
			},{
				fieldLable:'位置',
				name:'qc_position_name',
				id:'qc_position_name',
				allowBlank:false,
				anchor:'95%'
			},{
				fieldLable:'检查项',
				name:'qc_item_name',
				id:'qc_item_name',
				allowBlank:false,
				anchor:'95%'
			},{
				fieldLable:'所属检查项',
				name:'parent_name',
				id:'parent_name',
				allowBlank:true,
				anchor:'95%'
			}
		]
	})
	
		var addQCWindow = new Ext.Window({
		layout: 'fit',
		width: 350, // 添加子窗口 高度
		height: 320, // 添加 窗口宽度
		resizable: false,
		draggable: true,
		closeAction: 'hide',
		title: '新增检查项',
		iconCls: 'page_addIcon',
		modal: false,
		collapsible: true,
		titleCollapse: true,
		maximizable: false,
		buttonAlign: 'right',
		border: false,
		animCollapse: true,
		animateTarget: Ext.getBody(),
		constrain: true,
		items: [ addQCItemPanel ],
		buttons: [
			{
				text: '保存',
				iconCls: 'acceptIcon',
				id: 'btn_id_save_update',
				handler: function () {
					if (flag == 'add') {
						saveQCItem();
					} else if (flag == 'update') {
						updateQCItem();
					}
				}
			},
			{
				text: '重置',
				id: 'btnReset',
				iconCls: 'tbar_synchronizeIcon',
				handler: function () {
				}
			},
			{
				text: '关闭',
				iconCls: 'deleteIcon',
				handler: function () {
					addQCWindow.hide();
				}
			}
		]
	});

	
	/**
	 * 新增初始化
	 */
	function addInit() {
		flag = 'add';
		clearFormPanel(addQCFormPanel);
		addQCWindow.show();
		addQCWindow.setTitle('新增部门<span style="color:Red">(*为必填项)</span>');
		Ext.getCmp('btnReset').show();
	}
	
	function saveQCItem(){
		if (!addQCItemPanel.form.isValid()) {
			return;
		}
		addDeptFormPanel.getForm().submit({
			url: './manageQC.ered?reqCode=saveQCItem',
			waitTitle: '提示',
			method: 'POST',
			waitMsg: '正在处理数据,请稍候...',
			success: function (form, action) {
				addDeptWindow.hide();
				store.reload();
				refreshNode(Ext.getCmp('parent_id').getValue());
				form.reset();
				Ext.MessageBox.alert('提示', action.result.msg);
			},
			failure: function (form, action) {
				var msg = action.result.msg;
				Ext.MessageBox.alert('提示', '数据保存失败:<br>' + msg);
			}
		});
	};
	function updateQCItem(){};
	
	/**
	 * 删除检查项
	 */
	function deleteQCItems() {
		var record = grid.getSelectionModel().getSelected();

		if (record.get('cc')!=0) {
			Ext.MessageBox.alert('提示', '该检查项下包含其他检查项!请先删除');
			return;
		}
		
		if (record.get('ic')!=0) {
			Ext.MessageBox.alert('提示', '该检查项下有数量信息!请先删除');
			return;
		}

		if (Ext.isEmpty(record)) {
			Ext.Msg.alert('提示', '请先选中要删除的检查项!');
			return;
		}
		Ext.Msg.confirm('请确认',
			'<span style="color:red"><b>提示:</b>您确定删除该检查项信息吗?', function (btn, text) {
				if (btn == 'yes') {
					showWaitMsg();
					Ext.Ajax.request({
						url: './manageQC.ered?reqCode=deleteQCItem',
						success: function (response) {
							var resultArray = Ext.util.JSON.decode(response.responseText);
							store.reload();
							Ext.Msg.alert('提示', resultArray.msg);
						},
						failure: function (response) {
							var resultArray = Ext.util.JSON.decode(response.responseText);
							Ext.Msg.alert('提示', resultArray.msg);
						},
						params: {
							seq_no: record.get('seq_no')
						}
					});
				}
			});
	}
	
	var viewport = new Ext.Viewport({
		layout: 'border',
		items: [	
			
			{
				region: 'center',
				layout: 'fit',
                margins : '3 3 3 0',
				items: [grid]
			}
		]
	});
	
	var loadStore=function (){
		var params = {   //如果为空 则构建一个空对象
        //添加一般参数
		class_name : Ext.getCmp("classParam").getValue(),
		qc_position_name:Ext.getCmp("positionParam").getValue(),
        start : 0,
        limit : bbar.pageSize
        };
		store.load({
		params:params
		});
	}
	
	
	
	});