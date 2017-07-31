/*******************************************************************************
 * 创建日期: 2015-07-18 创建作者：xtj 功能：salesfocus报表 最后修改时间： 修改记录：
 ******************************************************************************/
Ext.onReady(function() {
	var brandList = {};
	var old_params = {};
	var sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : false
			});

	// 品牌汇总表store
	var store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : './hungProgress.ered?reqCode=queryhungProgressReport'
						}),
				reader : new Ext.data.JsonReader({
					totalProperty : 'TOTALCOUNT',
					root : 'ROOT'
						}, ['seq_no', 'brand', 'factory', 'area', 'style',
								'style_no', 'team', 'member_outline',
								'member_inline', 'leader', 'work_time',
								'work_amount', 'work_price', 'work_date',
								'opr_date', 'edt_date'])
			});

	var cm = new Ext.ux.grid.LockingColumnModel([new Ext.grid.RowNumberer(),
			sm, {
				dataIndex : 'seq_no',
				hidden : true
			}, {
				header : '日期',
				dataIndex : 'work_date',
				width : 100
			}, {
				header : '地区',
				dataIndex : 'area',
				width : 100
			}, {
				header : '工厂',
				dataIndex : 'factory',
				width : 100
			}, {
				header : '品牌',
				dataIndex : 'brand',
				width : 50
			}, {
				header : '款号',
				dataIndex : 'style_no',
				width : 100
			}, {
				header : '款式',
				dataIndex : 'style',
				width : 100
			}, {
				header : '组别',
				dataIndex : 'team',
				width : 50
			}, {
				header : '负责人',
				dataIndex : 'leader',
				width : 100
			}, {
				header : '线外人数',
				dataIndex : 'member_outline',
				width : 50
			}, {
				header : '线内人数',
				dataIndex : 'member_inline',
				width : 50
			}, {
				header : '工时',
				dataIndex : 'work_time',
				width : 50
			}, {
				header : '产量',
				dataIndex : 'work_amount',
				width : 100
			}, {
				header : '产值',
				dataIndex : 'work_price',
				width : 100
			}, {
				header : '平均台产',
				dataIndex : 'avg_work_amount',
				width : 100,
				renderer : function(val, param, record) {
					var outM = record.get('member_outline');
					var inM = record.get('member_inline');
                    var work_amount = record.get('work_amount');
                    var avg_work_amount=work_amount/(parseInt(outM)+parseInt(inM));
                    return Ext.util.Format.number(avg_work_amount,'0.0');
				}
			}, {
				header : '平均产值',
				dataIndex : 'avg_work_price',
				width : 100,
				renderer : function(val, param, record) {
					var outM = record.get('member_outline');
					var inM = record.get('member_inline');
                    var work_price = record.get('work_price');
                    var avg_work_price=work_price/(parseInt(outM)+parseInt(inM));
                    return Ext.util.Format.number(avg_work_price, '0.00');
				}
			}]);

	var pagesize_combo = new Ext.form.ComboBox({
				name : 'pagesize',
				hiddenName : 'pagesize',
				typeAhead : true,
				triggerAction : 'all',
				lazyRender : true,
				mode : 'local',
				store : new Ext.data.ArrayStore({
							fields : ['value', 'text'],
							data : [[10, '10条/页'], [20, '20条/页'],
									[50, '50条/页'], [100, '100条/页'],
									[250, '250条/页'], [500, '500条/页'],
									[500, '500条/页']]
						}),
				valueField : 'value',
				displayField : 'text',
				value : '100',
				editable : false,
				width : 85
			});

	var ordNumber = parseInt(pagesize_combo.getValue());
	pagesize_combo.on("select", function(comboBox) {
				Bbar.pageSize = parseInt(comboBox.getValue());
				ordNumber = parseInt(comboBox.getValue());
				queryHungProgress();
			});

	var Bbar = new Ext.PagingToolbar({
				pageSize : ordNumber,
				store : store,
				displayInfo : true,
				displayMsg : '显示{0}条到{1}条,共{2}条',
				plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
				emptyMsg : "没有符合条件的记录",
				items : ['-', '&nbsp;&nbsp;', pagesize_combo]
			});

	var form = new Ext.form.FormPanel({
				labelAlign : 'right',
				height : 350,
				width : 800,
				layout : 'column',
				bodyStyle : 'padding:5 5 0', // 表单元素和表单面板的边距
				buttonAlign : 'center',
				items : [{
							xtype : 'textfield',
							id : 'seq_no',
							name : 'seq_no',
							hidden : true,
							hideLabel : true
						}, {
							columnWidth : .20,
							layout : 'form',
							labelWidth : 60, // 标签宽度
							defaultType : 'textfield',
							border : false,
							items : [{
										xtype : 'textfield',
										fieldLabel : '地区',
										id : 'area',
										name : 'area',
										width : 80,
										allowBlank : false
									}, {
										xtype : 'textfield',
										fieldLabel : '工厂',
										id : 'factory',
										name : 'factory',
										width : 80,
										allowBlank : false
									}]
						}, {
							columnWidth : .25,
							layout : 'form',
							labelWidth : 60, // 标签宽度
							defaultType : 'textfield',
							border : false,
							items : [{
										xtype : 'datefield',
										id : 'work_date',
										name : 'work_date',
										format : 'Y-m-d',
										fieldLabel : '日期',
										emptyText : '记录日期',
										editable : true,
										width : 120
									}, {
										xtype : 'textfield',
										fieldLabel : '品牌',
										id : 'brand',
										name : 'brand',
										width : 100,
										allowBlank : false
									}, {
										xtype : 'textfield',
										fieldLabel : '款式',
										id : 'style',
										name : 'style',
										width : 100,
										allowBlank : false
									}, {
										xtype : 'textfield',
										fieldLabel : '款号',
										id : 'style_no',
										name : 'style_no',
										width : 100,
										allowBlank : false
									}]
						}, {
							columnWidth : .25,
							layout : 'form',
							labelWidth : 80, // 标签宽度
							defaultType : 'textfield',
							border : false,
							items : [{
										xtype : 'textfield',
										fieldLabel : '组别',
										id : 'team',
										name : 'team',
										width : 100,
										allowBlank : false
									}, {
										xtype : 'textfield',
										fieldLabel : '组长',
										id : 'leader',
										name : 'leader',
										width : 100,
										allowBlank : false
									}, {
										xtype : 'textfield',
										fieldLabel : '线内人数',
										id : 'member_inline',
										name : 'member_inline',
										width : 100,
										allowBlank : false
									}, {
										xtype : 'textfield',
										fieldLabel : '线外人数',
										id : 'member_outline',
										name : 'member_outline',
										width : 100,
										allowBlank : false
									}]
						}, {
							columnWidth : .25,
							layout : 'form',
							labelWidth : 80, // 标签宽度
							defaultType : 'textfield',
							border : false,
							items : [{
										xtype : 'textfield',
										fieldLabel : '产量',
										id : 'work_amount',
										name : 'work_amount',
										width : 100,
										allowBlank : false
									}, {
										xtype : 'textfield',
										fieldLabel : '产值',
										id : 'work_price',
										name : 'work_price',
										width : 100,
										allowBlank : false
									}, {
										xtype : 'textfield',
										fieldLabel : '工时',
										id : 'work_time',
										name : 'work_time',
										width : 100
									}]
						}, {
							xtype : 'textfield',
							fieldLabel : '备注',
							id : 'remark',
							name : 'remark',
							width : 100,
							hidden : true
						}]
			});
	// 修改新增用窗口
	var infoWindow = new Ext.Window({
		id : 'infoWindow',
		layout : "fit",
		title : '新增吊挂信息',
		width : 800,
		height : 200,
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
		items : [form],
		bbar : ['->', {
			id : 'saveButton_update',
			xtype : 'button',
			hidden : true,
			text : '确认修改',
			handler : function() {
				Ext.Ajax.request({
					url : './hungProgress.ered?reqCode=updateHungProgress',
					success : function(value) {
						var result = Ext.util.JSON.decode(value.responseText);
						if (result.success) {
							Ext.Msg.alert("提示信息", "修改成功");
							Ext.getCmp('infoWindow').hide();
							queryHungProgress();
						} else {
							Ext.Msg.alert("提示信息", "保存失败");
						}
					},
					failure : function() {
						Ext.Msg.alert("提示信息", "保存失败" + result.msg);
					},
					params : {
						seq_no : Ext.getCmp('seq_no').getValue(),
						brand : Ext.getCmp('brand').getValue(),
						team : Ext.getCmp('team').getValue(),
						style : Ext.getCmp('style').getValue(),
						style_no : Ext.getCmp('style_no').getValue(),
						leader : Ext.getCmp('leader').getValue(),
						style : Ext.getCmp('style').getValue(),
						style_no : Ext.getCmp('style_no').getValue(),
						// remark : Ext.getCmp('remark').getValue(),
						member_outline : Ext.getCmp('member_outline')
								.getValue(),
						member_inline : Ext.getCmp('member_inline').getValue(),
						work_time : Ext.getCmp('work_time').getValue(),
						work_amount : Ext.getCmp('work_amount').getValue(),
						work_price : Ext.getCmp('work_price').getValue(),
						work_date : Ext.util.Format.date(Ext.getCmp('work_date').getValue(),'Y-m-d'),
						area : Ext.getCmp('area').getValue(),
						factory : Ext.getCmp('factory').getValue()
					}
				})
			}
		}, {
			id : 'saveButton_add',
			xtype : 'button',
			text : '保存',
			hidden : true,
			handler : function() {
				Ext.Ajax.request({
							url : './hungProgress.ered?reqCode=addHungProgress',
							success : function(response) {
								var result = Ext.util.JSON
										.decode(response.responseText);
								if (result.success) {
									Ext.Msg.alert("提示信息", "保存成功");
									infoWindow.hide();
									queryHungProgress();
								} else {
									Ext.Msg.alert("提示信息", "保存失败");
								}
							},
							failure : function() {
								Ext.Msg.alert("提示信息", "保存失败");
							},
							params : {
								brand : Ext.getCmp('brand').getValue(),
								team : Ext.getCmp('team').getValue(),
								style : Ext.getCmp('style').getValue(),
								style_no : Ext.getCmp('style_no').getValue(),
								leader : Ext.getCmp('leader').getValue(),
								member_outline : Ext.getCmp('member_outline').getValue(),
								member_inline : Ext.getCmp('member_inline').getValue(),
								work_time : Ext.getCmp('work_time').getValue(),
								work_amount : Ext.getCmp('work_amount').getValue(),
								work_price : Ext.getCmp('work_price').getValue(),
								work_date : Ext.util.Format.date(Ext.getCmp('work_date').getValue(), 'Y-m-d'),
								area : Ext.getCmp('area').getValue(),
								factory : Ext.getCmp('factory').getValue()
							}
						})
			}
		}, {
			id : 'close',
			xtype : 'button',
			text : '关闭',
			handler : function() {
				infoWindow.hide();
				clearForm();
			}
		}]
	})

	// 汇总报表窗口
	var grid = new Ext.grid.EditorGridPanel({
		sm : sm,
		id : 'grid',
		store : store,
		stripeRows : true,
		cm : cm,
		width : 600,
		height : 300,
		title : '吊挂信息表',
		region : 'center',
		frame : true,
		autoScroll : true,
		bbar : Bbar,
		stripeRows : true,
		tbar : [{
					text : "刷新",
					iconCls : 'page_refreshIcon',
					handler : function() {
						queryHungProgress();
					}
				}, '-', {
					text : "新增",
					iconCls : 'page_addIcon',
					handler : function() {
						infoWindow.show();
						Ext.getCmp('infoWindow').title = "新增品牌信息";
						Ext.getCmp('saveButton_add').show();
						Ext.getCmp('saveButton_update').hide();
						clearForm();
					}
				}, '-', {
					text : "模板新增",
					iconCls : 'page_addIcon',
					handler : function() {
						var record = grid.getSelectionModel().getSelected();
						if (Ext.isEmpty(record)) {
							Ext.Msg.alert('提示', '请选择一条记录来复制新增！');
							return;
						}
						infoWindow.show();
						Ext.getCmp('infoWindow').title = "新增品牌信息";
						Ext.getCmp('saveButton_add').show();
						Ext.getCmp('saveButton_update').hide();
						Ext.getCmp('brand').setValue(record.get('brand'));
						Ext.getCmp('team').setValue(record.get('team'));
						Ext.getCmp('leader').setValue(record.get('leader'));
						Ext.getCmp('style').setValue(record.get('style'));
						Ext.getCmp('style_no').setValue(record.get('style_no'));
						Ext.getCmp('member_outline').setValue(record.get('member_outline'));
						Ext.getCmp('member_inline').setValue(record.get('member_inline'));
						Ext.getCmp('work_time').setValue(record.get('work_time'));
						Ext.getCmp('work_amount').setValue(record.get('work_amount'));
						Ext.getCmp('work_price').setValue(record.get('work_price'));
						Ext.getCmp('work_date').setValue(record.get('work_date'));
						Ext.getCmp('area').setValue(record.get('area'));
						Ext.getCmp('factory').setValue(record.get('factory'))
					}
				}, '-', {
					xtype : 'button',
					text : "修改",
					iconCls : 'page_edit_1Icon',
					handler : function() {
						var record = grid.getSelectionModel().getSelected();
						if (Ext.isEmpty(record)) {
							Ext.Msg.alert('提示', '请选择一行有效记录！');
							return;
						}
						infoWindow.show();
						Ext.getCmp('infoWindow').title = "修改信息";
						Ext.getCmp('saveButton_add').hide();
						Ext.getCmp('saveButton_update').show();
						
						Ext.getCmp('seq_no').setValue(record.get('seq_no'));
						Ext.getCmp('brand').setValue(record.get('brand'));
						Ext.getCmp('team').setValue(record.get('team'));
						Ext.getCmp('leader').setValue(record.get('leader'));
						Ext.getCmp('style').setValue(record.get('style'));
						Ext.getCmp('style_no').setValue(record.get('style_no'));
						Ext.getCmp('member_outline').setValue(record.get('member_outline'));
						Ext.getCmp('member_inline').setValue(record.get('member_inline'));
						Ext.getCmp('work_time').setValue(record.get('work_time'));
						Ext.getCmp('work_amount').setValue(record.get('work_amount'));
						Ext.getCmp('work_price').setValue(record.get('work_price'));
						Ext.getCmp('work_date').setValue(record.get('work_date'));
						Ext.getCmp('area').setValue(record.get('area'));
						Ext.getCmp('factory').setValue(record.get('factory'))
					}
				}, "-", {
					text : "删除",
					iconCls : 'page_delIcon',
					handler : function() {
						var selModel = grid.getSelectionModel();
						if (selModel.hasSelection()) {
							Ext.Msg.confirm("警告", "确定要删除吗？", function(button) {
								if (button == "yes") {
									Ext.Ajax.request({
										url : './hungProgress.ered?reqCode=deleteHungProgress',
										success : function(value) {
											var result = Ext.util.JSON
													.decode(value.responseText);
											if (result.success) {
												Ext.Msg.alert("提示信息", "删除成功");
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
											seq_no : selModel.getSelected()
													.get("seq_no")
										}
									})
								}
							});
						} else {
							Ext.Msg.alert("错误", "没有任何行被选中，无法进行删除操作！");
						}
					}
				}, '-', {
					xtype : 'datefield',
					id : 'query_date',
					name : 'query_date',
					format : 'Y-m-d',
					emptyText : '请选择日期',
					width : 120,
					listeners : {
						select : function() {
							queryHungProgress();
						}
					}
				}]
	});

	// 清空表单
	function clearForm() {
		Ext.getCmp('seq_no').setValue('');
		Ext.getCmp('brand').setValue('');
		Ext.getCmp('team').setValue('');
		Ext.getCmp('leader').setValue('');
		Ext.getCmp('style').setValue('');
		Ext.getCmp('style_no').setValue('');
		Ext.getCmp('member_outline').setValue('');
		Ext.getCmp('member_inline').setValue('');
		Ext.getCmp('work_time').setValue('');
		Ext.getCmp('work_amount').setValue('');
		Ext.getCmp('work_price').setValue('');
		Ext.getCmp('area').setValue('');
		Ext.getCmp('factory').setValue('');
	}

	// 查询
	function queryHungProgress(params) {
		// 保存现有的查询条件
		params=params||{};
		params.start = 0;
		params.limit = Bbar.pageSize;
		params.query_date = Ext.util.Format.date(Ext.getCmp('query_date').getValue(), 'Y-m-d');
		store.load({params:params});
	}

	/**
	 * 布局
	 */
	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [{
							region : 'center',
							layout : 'fit',
							items : [grid]
						}]
			});

	queryHungProgress();
})