/**
 * 生产通知单管理
 *
 * @author tangfh
 * @since 2013-05-13
 */
Ext.onReady(function() {
	var re = '<span style="color:red">*</span>'
	var rs = '<span style="color:Red">(*为必填项)</span>'
	var flag;

	var tabid = '';
	// 定义列模型
		var sm = new Ext.grid.CheckboxSelectionModel( {
			singleSelect : true
		});

		var cm = new Ext.grid.ColumnModel( [ sm, new Ext.grid.RowNumberer(), {
			header : '序号',
			dataIndex : 'seq_no',
			align : 'center',
			hidden : true,
			width : 140
		}, {
			header : '订单号',
			dataIndex : 'order_id',
			align : 'center',
			width : 140,
			sortable : true
		}, {
			header : '客户编号',
			dataIndex : 'cust_id',
			hidden : true,
			align : 'center',
			width : 100
		}, {
			header : '客户',
			dataIndex : 'cust_name',
			align : 'center',
			width : 60
		}, {
			header : '订单日期',
			dataIndex : 'order_date',
			align : 'center',
			width : 80
		}, {
			header : '品牌',
			dataIndex : 'brand',
			align : 'center',
			width : 60
		}, {
			header : '款号',
			dataIndex : 'style_no',
			align : 'center',
			width : 60
		}, {
			header : '合同号',
			dataIndex : 'contract_id',
			align : 'center',
			width : 60
		}, {
			header : '品名',
			dataIndex : 'article',
			align : 'center',
			width : 90,
			sortable : true
		}, {
			header : '总数',
			dataIndex : 'order_num',
			align : 'center',
			width : 60,
			sortable : true
		}, {
			header : '产品分类',
			dataIndex : 'classify',
			align : 'center',
			width : 90,
			sortable : true
		}, {
			header : '面料',
			dataIndex : 'material',
			align : 'center',
			width : 80,
			sortable : true
		}, {
			header : '面料缩率J',
			dataIndex : 'percent_j',
			align : 'center',
			width : 80,
			sortable : true
		}, {
			header : '面料缩率W',
			dataIndex : 'percent_w',
			align : 'center',
			width : 80,
			sortable : true
		}, {
			header : '交货日期',
			dataIndex : 'delivery_date',
			align : 'center',
			sortable : true,
			width : 90
		}, {
			header : '通知日期',
			dataIndex : 'notity_date',
			align : 'center',
			sortable : true,
			width : 90
		}, {
			header : '原始合同',
			dataIndex : 'orig_contract',
			align : 'center',
			width : 120,
			sortable : true
		}, {
			header : '装箱指示',
			dataIndex : 'box_ins',
			align : 'center',
			width : 120,
			sortable : true
		}, {
			header : '包装指示',
			dataIndex : 'pack_ins',
			align : 'center',
			width : 60,
			sortable : true
		}, {
			header : '款式图',
			dataIndex : 'style_drawing',
			align : 'center',
			width : 90,
			sortable : true
		}, {
			header : '尺寸表',
			dataIndex : 'size_chart',
			align : 'center',
			width : 90,
			sortable : true
		}, {
			header : '工序定额表',
			dataIndex : 'process_quota',
			align : 'center',
			width : 120,
			sortable : true
		}, {
			header : '工艺说明书',
			dataIndex : 'process_desc',
			align : 'center',
			width : 60,
			sortable : true
		}, {
			header : '纸样推码',
			dataIndex : 'pattern_code',
			align : 'center',
			width : 60,
			sortable : true
		}, {
			header : '制单员',
			dataIndex : 'opr_name',
			align : 'center',
			width : 60,
			sortable : true
		}, {
			header : '制单日期',
			dataIndex : 'opr_date',
			align : 'center',
			width : 60,
			sortable : true
		}, {
			header : '生产计划',
			dataIndex : 'prod_plan_seq',
			align : 'center',
			width : 60,
			sortable : true
		}, {
			header : '状态',
			dataIndex : 'status',
			align : 'center',
			hidden : true,
			width : 60,
			sortable : true
		}, {
			header : '标志',
			dataIndex : 'state',
			align : 'center',
			width : 60,
			sortable : true,
			renderer : function(value) {
				if (value == '0')
					return '正常';
				else if (value == '1')
					return '撤销';
			}
		}, {
			header : '缝制工厂',
			dataIndex : 'sew_fac',
			hidden : true,
			align : 'center',
			width : 60
		}, {
			header : '水洗工厂',
			dataIndex : 'bach_fac',
			hidden : true,
			align : 'center',
			width : 60
		}, {
			header : '后整工厂',
			dataIndex : 'pack_fac',
			hidden : true,
			align : 'center',
			width : 60
		}, {
			header : '交货时间',
			dataIndex : 'sew_delivery_date',
			hidden : true,
			align : 'center',
			width : 60
		}, {
			header : '交货时间',
			dataIndex : 'bach_delivery_date',
			hidden : true,
			align : 'center',
			width : 60
		}, {
			header : '交货时间',
			dataIndex : 'pack_delivery_date',
			hidden : true,
			align : 'center',
			width : 60
		}, {
			header : '计划审核',
			dataIndex : 'plan_check',
			hidden : true,
			align : 'center',
			width : 60
		}, {
			header : '采购审核',
			dataIndex : 'purchase_check',
			hidden : true,
			align : 'center',
			width : 60
		}, {
			header : '贸易审核',
			dataIndex : 'trade_check',
			hidden : true,
			align : 'center',
			width : 60
		}, {
			header : '计划审核时间',
			dataIndex : 'plan_check_date',
			hidden : true,
			align : 'center',
			width : 60
		}, {
			header : '采购审核时间',
			dataIndex : 'purchase_check_date',
			hidden : true,
			align : 'center',
			width : 60
		}, {
			header : '贸易审核时间',
			dataIndex : 'trade_check_date',
			hidden : true,
			align : 'center',
			width : 60
		} ]);
		/**
		 * 数据存储
		 */
		var store = new Ext.data.Store( {
			// 获取数据的方式
			proxy : new Ext.data.HttpProxy( {
				url : './prodOrd.ered?reqCode=queryProdOrdInfo'
			}),
			// 数据读取器
			reader : new Ext.data.JsonReader( {
				totalProperty : 'TOTALCOUNT', // 记录总数
				root : 'ROOT' // Json中的列表数据根节点
			}, [ {
				name : 'seq_no'
			}, {
				name : 'cust_id'
			}, {
				name : 'cust_name'
			}, {
				name : 'order_date'
			}, {
				name : 'brand'
			}, {
				name : 'batch'
			}, {
				name : 'add_proportion'
			}, {
				name : 'style_no'
			}, {
				name : 'contract_id'
			}, {
				name : 'ord_seq_no'
			}, {
				name : 'order_id'
			}, {
				name : 'article'
			}, {
				name : 'classify'
			}, {
				name : 'material'
			}, {
				name : 'order_num'
			}, {
				name : 'percent_j'
			}, {
				name : 'percent_w'
			}, {
				name : 'delivery_date'
			}, {
				name : 'notity_date'
			}, {
				name : 'orig_contract'
			}, {
				name : 'box_ins'
			}, {
				name : 'pack_ins'
			}, {
				name : 'style_drawing'
			}, {
				name : 'size_chart'
			}, {
				name : 'process_quota'
			}, {
				name : 'process_desc'
			}, {
				name : 'pattern_code'
			}, {
				name : 'opr_name'
			}, {
				name : 'opr_date'
			}, {
				name : 'prod_plan_seq'
			}, {
				name : 'status'
			}, {
				name : 'state'
			}, {
				name : 'sew_fac'
			}, {
				name : 'bach_fac'
			}, {
				name : 'pack_fac'
			}, {
				name : 'sew_delivery_date'
			}, {
				name : 'bach_delivery_date'
			}, {
				name : 'pack_delivery_date'
			}, {
				name : 'plan_check'
			}, {
				name : 'purchase_check'
			}, {
				name : 'trade_check'
			}, {
				name : 'plan_check_date'
			}, {
				name : 'purchase_check_date'
			}, {
				name : 'trade_check_date'
			} ])
		});

		// 翻页排序时带上查询条件
		store.on('beforeload', function() {
			this.baseParams = {};
		});
		// 每页显示条数下拉选择框
		var pagesize_combo = new Ext.form.ComboBox( {
			name : 'pagesize',
			triggerAction : 'all',
			mode : 'local',
			store : new Ext.data.ArrayStore(
					{
						fields : [ 'value', 'text' ],
						data : [ [ 10, '10条/页' ], [ 20, '20条/页' ],
								[ 50, '50条/页' ], [ 100, '100条/页' ],
								[ 250, '250条/页' ], [ 500, '500条/页' ] ]
					}),
			valueField : 'value',
			displayField : 'text',
			value : '20',
			editable : false,
			width : 85
		});
		var number = parseInt(pagesize_combo.getValue());
		// 改变每页显示条数reload数据
		pagesize_combo.on("select", function(comboBox) {
			bbar.pageSize = parseInt(comboBox.getValue());
			number = parseInt(comboBox.getValue());
			store.reload( {
				params : {
					start : 0,
					limit : bbar.pageSize
				}
			});
		});

		// 分页工具栏
		var bbar = new Ext.PagingToolbar( {
			pageSize : number,
			store : store,
			displayInfo : true,
			displayMsg : '显示{0}条到{1}条,共{2}条',
			plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
			emptyMsg : "没有符合条件的记录",
			items : [ '-', '&nbsp;&nbsp;', pagesize_combo ]
		});

		store.load( {
			params : {
				start : 0,
				limit : bbar.pageSize
			}
		});
		// 表格工具栏
		var tbar = new Ext.Toolbar(
				{
					items : [
							{
								text : '新增',
								id : 'new_button',
								iconCls : 'page_addIcon',
								handler : function() {
//									prodOrdStore.removeAll();
									ordStore.removeAll();
									insOrdStore.removeAll();

									Ext.getCmp('resetButton').show();
									codeWindow.show();
									clearFormPanel(prodOrdPanel);
								}
							},
							'-',
							{
								text : '修改',
								id : 'modify_button',
								iconCls : 'page_edit_1Icon',
								handler : function() {
									updateProdOrdDataInit();
								}
							},
							'-',
							{
								text : '删除',
								id : 'delete_button',
								iconCls : 'page_delIcon',
								handler : function() {
									deleteProdOrdData();
								}
							},
							'-',
							{
								text : '打印/导出',
								id : 'submit_button',
								iconCls : 'page_edit_1Icon',
								handler : function() {
									exportExcel('./prodOrd.ered?reqCode=excleProdOrderInfoAction');
								}
							},
							{
								xtype : 'tbseparator',
								id : 'check_seqarator'
							},
							{
								text : '刷新',
								iconCls : 'page_refreshIcon',
								handler : function() {
									store.reload();
								}
							},
							'->',
							new Ext.form.NumberField(
									{
										id : 'ord_seq_no',
										name : 'ord_seq_no',
										emptyText : '请输入订单号',
										enableKeyEvents : true,
										listeners : {
											specialkey : function(field, e) {
												if (e.getKey() == Ext.EventObject.ENTER) {
													queryOrdItem();
												}
											}
										},
										width : 130
									}),
							new Ext.form.TextField(
									{
										id : 'cust_name',
										name : 'cust_name',
										emptyText : '请输入客户名称',
										enableKeyEvents : true,
										listeners : {
											specialkey : function(field, e) {
												if (e.getKey() == Ext.EventObject.ENTER) {
													queryOrdItem();
												}
											}
										},
										width : 130
									}), {
								text : '查询',
								iconCls : 'page_findIcon',
								handler : function() {
									queryOrdItem();
								}
							} ]
				});
		var grid = new Ext.grid.GridPanel( {
			id : 'prodOrdGrid',
			title : '<span style="font-weight:normal">生产通知单管理</span>',
			height : 590,
			store : store,
			region : 'center',// 和VIEWPORT布局模型对应，充当center区域布局
			loadMask : {
				msg : '正在加载表格数据,请稍等...'
			},
			stripeRows : true,// 斑马线 True表示为显示行的分隔符（默认为true）。
			frame : true,// True表示为面板的边框外框可自定义的
			cm : cm,
			sm : sm,
			tbar : tbar,
			bbar : bbar,
			listeners : {
				render : function() {
					setColumn(cm);
				}
			}
		});

		grid.on('rowdblclick', function(grid, rowIndex, event) {
			updateProdOrdDataInit();
		});

		var codeWindow = new Ext.Window( {
			layout : 'fit',
			id : 'prodOrdWindow',
			width : 1360,
			height : 400,
			resizable : false,
			draggable : true,
			title : '<span style="font-weight:normal">新增生产通知单 <span>' + rs,
			iconCls : 'page_addIcon',
			modal : true,
			closeAction : 'hide',
			closable : true,
			collapsible : false,
			titleCollapse : true,
			maximizable : false,
			maximized : true,
			labelAlign : 'center',
			buttonAlign : 'right',
			border : false,
			animCollapse : true,
			animateTarget : Ext.getBody(),
			constrain : true,
			items : [ prodOrdPanel ],
			buttons : [ {
				text : '保存',
				iconCls : 'acceptIcon',
				handler : function() {
					enterOrdAddForm();
				}
			}, {
				text : '重置',
				id : 'resetButton',
				iconCls : 'tbar_synchronizeIcon',
				handler : function() {
					clearForm(prodOrdPanel.getForm());
					//清空3个数量
//				prodOrdStore.removeAll();
				ordStore.removeAll();
				insOrdStore.removeAll();
			}
			}, {
				text : '关闭',
				iconCls : 'deleteIcon',
				handler : function() {
					codeWindow.hide();
				}
			} ]
		});
//
//		//实际数量信息的查询
//		var prodOrdNumStore = new Ext.data.Store( {
//			// 获取数据的方式
//			proxy : new Ext.data.HttpProxy( {
//				url : './prodOrd.ered?reqCode=queryProdBasInfo'
//			}),
//			// 数据读取器
//			reader : new Ext.data.JsonReader( {
//				totalProperty : 'TOTALCOUNT', // 记录总数
//				root : 'ROOT' // Json中的列表数据根节点
//			}, [ {
//				name : 'color'
//			}, {
//				name : 'in_length'
//			}, {
//				name : 'real_num'
//			}, {
//				name : 'num'
//			} ])
//		});

		//指令数量信息的查询
		var prodInsNumStore = new Ext.data.Store( {
			// 获取数据的方式
			proxy : new Ext.data.HttpProxy( {
				url : './prodOrd.ered?reqCode=queryProdInsInfo'
			}),
			// 数据读取器
			reader : new Ext.data.JsonReader( {
				totalProperty : 'TOTALCOUNT', // 记录总数
				root : 'ROOT' // Json中的列表数据根节点
			}, [ {
				name : 'color'
			}, {
				name : 'in_length'
			}, {
				name : 'ins_num'
			}, {
				name : 'num'
			} ])
		});

		//订单数量信息的查询
		var ordNumStore = new Ext.data.Store( {
			// 获取数据的方式
			proxy : new Ext.data.HttpProxy( {
				url : './prodOrd.ered?reqCode=queryProdOrdBasInfo'
			}),
			// 数据读取器
			reader : new Ext.data.JsonReader( {
				totalProperty : 'TOTALCOUNT', // 记录总数
				root : 'ROOT' // Json中的列表数据根节点
			}, [ {
				name : 'color'
			}, {
				name : 'in_length'
			}, {
				name : 'ord_num'
			}, {
				name : 'num'
			} ])
		});

		/**
		 * 布局
		 */
		var viewport = new Ext.Viewport( {
			layout : 'border',
			items : [ {
				region : 'center',
				layout : 'fit',
				items : [ grid ]
			} ]
		});

//		prodOrdNumStore.on('load', function() {
////			prodOrdStore.removeAll()
//			var recordCount = prodOrdNumStore.getCount();
////			var columns = [];
////			columns.push(new Ext.grid.CheckboxSelectionModel( {
////				singleSelect : false
////			}));
////			columns.push( {
////				header : '颜色',
////				dataIndex : 'color',
////				align : 'center',
////				width : 100,
////				editor : new Ext.form.TextField( {
////					allowBlank : false
////				})
////			});
////			columns.push( {
////				header : '内长',
////				dataIndex : 'in_length',
////				align : 'center',
////				width : 100,
////				sortable : true,
////				editor : new Ext.form.TextField( {
////					allowBlank : false
////				})
////			});
//			columnKeyList.push('color');
//			columnKeyList.push('in_length');
//			columnsValue = prodOrdNumStore.getAt(0).get("num").split(',');
////			for ( var i = 0; i < columnsValue.length; i++) {
////				columns.push( {
////					header : columnsValue[i],
////					dataIndex : 'num' + columnsValue[i],
////					align : 'center',
////					width : 40,
////					sortable : true,
////					editor : new Ext.form.NumberField()
////				});
////				columnKeyList.push('num' + columnsValue[i]);
////			}
////			prodOrdGrid.getColumnModel().setConfig(columns);
//		
//
////			for ( var i = 0; i < recordCount; i++) {
////				var record = prodOrdNumStore.getAt(i);
////				var columnValue = record.get("real_num").split(',');
////				var column = record.get("num").split(',');
////				for ( var j = 0; j < column.length; j++) {
////					record.set("num" + column[j], columnValue[j]);
////				}
////				alert(record);
////				prodOrdStore.add(record);
////			}
////		});

		ordNumStore.on('load', function() {
			ordStore.removeAll();
			var recordCount = ordNumStore.getCount();
			columnKeyList.push('color');
			columnKeyList.push('in_length');
			columnsValue = ordNumStore.getAt(0).get("num").split(',');
			
				var columnsIns = [];
			columnsIns.push(new Ext.grid.CheckboxSelectionModel( {
				singleSelect : false
			}));
			columnsIns.push( {
				header : '颜色',
				dataIndex : 'color',
				align : 'center',
				width : 100,
				editor : new Ext.form.TextField( {
					allowBlank : false
				})
			});
			columnsIns.push( {
				header : '内长',
				dataIndex : 'in_length',
				align : 'center',
				width : 100,
				sortable : true,
				editor : new Ext.form.TextField( {
					allowBlank : false
				})
			});
			for ( var i = 0; i < columnsValue.length; i++) {
				columnsIns.push( {
					header : columnsValue[i],
					dataIndex : 'num' + columnsValue[i],
					align : 'center',
					width : 40,
					sortable : true,
					editor : new Ext.form.NumberField()
				});
			}
			insOrdGrid.getColumnModel().setConfig(columnsIns);
			var columnsOrd = [];
			columnsOrd.push(new Ext.grid.CheckboxSelectionModel( {
				singleSelect : false
			}));
			columnsOrd.push( {
				header : '颜色',
				dataIndex : 'color',
				align : 'center',
				width : 100,
				editor : new Ext.form.TextField( {
					allowBlank : false
				})
			});
			columnsOrd.push( {
				header : '内长',
				dataIndex : 'in_length',
				align : 'center',
				width : 100,
				sortable : true,
				editor : new Ext.form.TextField( {
					allowBlank : false
				})
			});
			for ( var i = 0; i < columnsValue.length; i++) {
				columnsOrd.push( {
					header : columnsValue[i],
					dataIndex : 'num' + columnsValue[i],
					align : 'center',
					width : 40,
					sortable : true,
					editor : new Ext.form.NumberField()
				});
			}
			ordGrid.getColumnModel().setConfig(columnsOrd);
			for ( var i = 0; i < recordCount; i++) {
				var record = ordNumStore.getAt(i);
				var columnValue = record.get("ord_num").split(',');
				var column = record.get("num").split(',');
				for ( var j = 0; j < column.length; j++) {
					record.set("num" + column[j], columnValue[j]);
				}
				alert(record);
				ordStore.add(record);
			}
		});

		prodInsNumStore.on('load', function() {
			insOrdStore.removeAll();
			var recordCount = prodInsNumStore.getCount();
			for ( var i = 0; i < recordCount; i++) {
				var record = prodInsNumStore.getAt(i);
				var columnValue = record.get("ins_num").split(',');
				var column = record.get("num").split(',');
				for ( var j = 0; j < column.length; j++) {
					record.set("num" + column[j], columnValue[j]);
				}
				alert(record);
				insOrdStore.add(record);
			}
		});

		/**
		 * 修改窗口 初始化
		 */
		function updateProdOrdDataInit() {
			var record = grid.getSelectionModel().getSelected();
			if (Ext.isEmpty(record)) {
				Ext.MessageBox.alert('提示', '您没有选中任何数据!');
				return;
			}
//			prodOrdNumStore.load( {
//				params : {
//					ord_seq_no : record.get('ord_seq_no').toString(),
//					prod_ord_no : record.get('seq_no').toString()
//				}
//			});
			ordNumStore.load( {
				params : {
					ord_seq_no : record.get('ord_seq_no').toString(),
					prod_ord_no : record.get('seq_no').toString()
				}
			});
			prodInsNumStore.load( {
				params : {
					ord_seq_no : record.get('ord_seq_no').toString(),
					prod_ord_no : record.get('seq_no').toString()
				}
			});

			Ext.getCmp('resetButton').hide();
			codeWindow.setTitle('修改生产通知单');
			codeWindow.show();
//			prodOrdPanel.getForm().loadRecord(record);
			//把记录传到panel
		}

		/**
		 * 根据条件查询生产通知单
		 */
		function queryOrdItem() {
			store.load( {
				params : {
					start : 0,
					limit : bbar.pageSize,
					ord_seq_no : Ext.getCmp('ord_seq_no').getValue(),
					cust_name : Ext.getCmp('cust_name').getValue()
				}
			});
		}

		// 删除数据
		function deleteProdOrdData() {
			var record = grid.getSelectionModel().getSelected();
			if (Ext.isEmpty(record)) {
				Ext.MessageBox.alert('提示', '您没有选中任何数据!');
				return;
			}
			// 获得选中数据后则可以传入后台继续处理
			Ext.Msg.confirm('请确认', '确认删除选中的生产通知单信息吗?', function(btn, text) {
				if (btn == 'yes') {
					Ext.Ajax.request( {
						url : 'prodOrd.ered?reqCode=deleteProdOrdInfoAction',
						success : function(response) {
							var resultArray = Ext.util.JSON
									.decode(response.responseText);
							Ext.Msg.alert('提示', resultArray.msg);
							store.reload();
						},
						failure : function(response) {
							var resultArray = Ext.util.JSON
									.decode(response.responseText);
							Ext.MessageBox.alert('提示', resultArray.msg);
						},
						params : {
							seq_no : record.get('seq_no').toString(),
							ord_seq_no : record.get('ord_seq_no').toString()
						}
					});
				}
			});
		}
	});