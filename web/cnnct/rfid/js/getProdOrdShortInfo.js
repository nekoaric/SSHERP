/************************************************
 * 创建日期: 2013-05-08
 * 创建作者：may
 * 功能：完单号短缺
 * 最后修改时间：
 * 修改记录：
 *************************************************/
Ext.onReady(function () {

	var formPanel = new Ext.form.FormPanel({
		collapsible: false,
		border: false,
		region: 'north',
		labelWidth: 70, // 标签宽度
		frame: false, //是否渲染表单面板背景色
		labelAlign: 'right', // 标签对齐方式
		bodyStyle: 'padding:5 5 0', // 表单元素和表单面板的边距
		buttonAlign: 'center',
		name: 'codeForm',
		height: 70,
		tbar:[
			{
				xtype: 'datefield',
				id: 'startdate',
				name: 'startdate',
				format: 'Y-m-d',
				emptyText: '订单交货起始日期',
				editable: false,
				width: 120
			},
			'-',
			{
				xtype: 'datefield',
				id: 'enddate',
				name: 'enddate',
				format: 'Y-m-d',
				emptyText: '订单交货结束日期',
				editable: false,
				enableKeyEvents: true,
				width: 120
			}
		],
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
										checked:true,
										disabledClass: 'x-item'
									},
									{
										inputValue: '2',
										name: 'leavRadio',
										boxLabel: '按订单号',
										disabledClass: 'x-item'
									}
								]
							}
						]
					}
				]
			}
		]
	});

	var click_grp_id;

	var grp_root = new Ext.tree.AsyncTreeNode({
		text: '分厂',
		expanded: true,
		id: '001'
	});

	var grp_tree = new Ext.tree.TreePanel({
		animate: false,
		root: grp_root,
		loader: new Ext.tree.TreeLoader({
			dataUrl: './sysGrps.ered?reqCode=belongGrpsTreeInit'
		}),
		width: 400,
		autoScroll: true,
		useArrows: false,
		border: false,
		rootVisible: false
	});

	grp_tree.on('click', function (node) {
		click_grp_id = node.attributes.id;//点击的分厂编号

		prodOrdStore.reload({
			params: {
				start: 0,
				limit: prodOrdBbar.pageSize,
				belong_grp: click_grp_id
			}
		});
	});

	var click_cust_id;

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
			dataUrl: './custBas.ered?reqCode=getCustBasInfoTreeAction'
		}),
		autoScroll: true,
		useArrows: false,
		border: false,
		rootVisible: false
	});

	cust_tree.on('click', function (node) {
		var id = node.attributes.id;//点击的客户编号
		var type = id.substring(0, 4);
		click_cust_id = id.substring(4);

		if (type == 'area') {
			prodOrdStore.reload({
				params: {
					start: 0,
					limit: prodOrdBbar.pageSize,
					country: click_cust_id
				}
			});
		} else {
			prodOrdStore.reload({
				params: {
					start: 0,
					limit: prodOrdBbar.pageSize,
					cust_id: click_cust_id
				}
			});
		}

	});

	var ord_query_panel = new Ext.form.FormPanel({
		collapsible: false,
		border: false,
		region:'center',
		labelWidth: 70, // 标签宽度
		frame: false, //是否渲染表单面板背景色
		labelAlign: 'right', // 标签对齐方式
		bodyStyle: 'padding:5 5 0', // 表单元素和表单面板的边距
		buttonAlign: 'right',
		items: [
			{
				xtype: 'textfield',
				fieldLabel: '订单号',
				name: 'order_id',
				id: 'order_id',
				anchor: '100%',
				listeners:{
					specialkey : function(field, e) {
						if (e.getKey() == Ext.EventObject.ENTER) {
							prodOrdStore.reload({
								params: {
									start: 0,
									limit: prodOrdBbar.pageSize,
									order_name: field.getValue()
								}
							});
						}
					}
				}
			}
		],
		buttons: [
			{
				text: '查询',
				iconCls: 'page_findIcon',
				handler: function () {
					prodOrdStore.reload({
						params: {
							start: 0,
							limit: prodOrdBbar.pageSize,
							order_name: Ext.getCmp('order_id').getValue()
						}
					});
				}
			},
			{
				text: '重置',
				iconCls: 'tbar_synchronizeIcon',
				handler: function () {
					Ext.getCmp('order_id').setValue();
				}
			}
		]
	});

	//卡片布局的显示信息
	var detaiQueryPanel = new Ext.Panel({
		title: "客户信息",
		layout: 'card',
		activeItem: 1,
		region: 'center',
		labelAlign: "right",
		labelWidth: 70,
		frame: false,
        margins : '3 3 3 3',
		items: [
			grp_tree,cust_tree,ord_query_panel
		]
	});

	var queryPanel = new Ext.Panel({
		title: "查询选择窗口",
		region: 'west',
		layout: 'border',
		border: true,
		labelAlign: "right",
		collapsible: true,
		labelWidth: 70,
		width: 400,
		minSize: 160,
		maxSize: 580,
		split: true,
		frame: false,
		items: [formPanel, detaiQueryPanel]
	});

	var prodOrdSm = new Ext.grid.CheckboxSelectionModel({
		singleSelect: true
	});

	var prodOrdCm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), prodOrdSm,
		{
			header: '完单号',
			dataIndex: 'prod_ord_seq',
			width: 80
		},{
			header: '订单号',
			dataIndex: 'order_id',
			width: 80
		}, {
			header: '交货日期',
			dataIndex: 'deli_date',
			width: 90
		}, {
			header: '客户',
			dataIndex: 'cust_name',
			width: 80
		}, {
			header: '品名',
			dataIndex: 'article',
			width: 80
		}, {
			header: '开始生产日期',
			dataIndex: 'start_date',
			width: 80
		},{
			header: '订单标志',
			dataIndex: 'flag',
			width: 80
		}, {
			hidden: true,
			dataIndex: 'seq_no',
			width: 180
		}, {
			hidden: true,
			dataIndex: 'column_value',
			width: 180
		}]);

	var prodOrdStore = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: './prodOrd.ered?reqCode=queryProdOrdInfo'
		}),
		reader: new Ext.data.JsonReader({
			totalProperty: 'TOTALCOUNT',
			root: 'ROOT'
		}, [
			'prod_ord_seq','seq_no', 'order_id', 'article', 'deli_date', 
			'order_date', 'cust_name','column_value'
		])
	});

	prodOrdStore.on('beforeload',function(){
		this.baseParams = {
			startdate: Ext.getCmp('startdate').getValue(),
			enddate: Ext.getCmp('enddate').getValue()
		};
	});

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
				[500, '500条/页']
			]
		}),
		valueField: 'value',
		displayField: 'text',
		value: '50',
		editable: false,
		width: 85
	});

	var prodOrdNumber = parseInt(ordPagesize_combo.getValue());
	ordPagesize_combo.on("select", function (comboBox) {
		prodOrdBbar.pageSize = parseInt(comboBox.getValue());
		prodOrdNumber = parseInt(comboBox.getValue());
		prodOrdStore.load({
			params: {
				start: 0,
				limit: prodOrdBbar.pageSize,
				startdate: Ext.getCmp('startdate').getValue(),
				enddate: Ext.getCmp('enddate').getValue()
			}
		});
	});

	var prodOrdBbar = new Ext.PagingToolbar({
		pageSize: prodOrdNumber,
		store: prodOrdStore,
		displayInfo: true,
		displayMsg: '显示{0}条到{1}条,共{2}条',
		plugins: new Ext.ux.ProgressBarPager(), // 分页进度条
		emptyMsg: "没有符合条件的记录",
		items: ['-', '&nbsp;&nbsp;', ordPagesize_combo]
	});

	var prodOrdGrid = new Ext.grid.GridPanel({
		autoScroll: true,
		region: 'center',
		store: prodOrdStore,
		title: '订单信息',
		loadMask: {
			msg: '正在加载表格数据,请稍等...'
		},
		stripeRows: true,
		cm: prodOrdCm,
		sm: prodOrdSm,
		bbar: prodOrdBbar
	});

	var codeWindow = new Ext.Window({
		layout: 'border',
		width: 1000, // 窗口宽度
		height: 500, // 窗口高度
		resizable: false,
		draggable: false,
		closeAction: 'hide',
		title: '订单查询窗口',
		modal: false,
		collapsible: true,
		titleCollapse: true,
		maximizable: false,
		buttonAlign: 'right',
		border: false,
		animCollapse: true,
		animateTarget: Ext.getBody(),
		constrain: true,
		items: [ queryPanel, prodOrdGrid],
		buttons: [
			{
				text: '确认',
				iconCls: 'acceptIcon',
				handler: function () {
					var record = prodOrdGrid.getSelectionModel().getSelected();
					if (Ext.isEmpty(record)) {
						Ext.Msg.alert('提示', '请选择一条记录!');
						return;
					}
					check_prod_ord_seq = record.get('prod_ord_seq');

					var task = new Ext.util.DelayedTask(showCharts);
					task.delay(10);

					codeWindow.hide();

					check_column_value = record.get('column_value');

					short_detail_grid.setTitle(check_prod_ord_seq + '短缺详情');

					detail_store.reload({
						params:{
							start:0,
							limit:detail_bbar.pageSize,
							flag:'prod_ord_seq',
							prod_ord_seq:check_prod_ord_seq
						}
					})
				}
			},
			{
				text: '关闭',
				iconCls: 'deleteIcon',
				handler: function () {
					codeWindow.hide();
				}
			}
		]
	});

	var check_prod_ord_seq = '';//选中的订单记录
	var check_column_value = '';

	var detail_sm = new Ext.grid.CheckboxSelectionModel({
		singleSelect: true
	});

	var detail_cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), detail_sm,
		{
			header: '订单号',
			dataIndex: 'ord_seq_no',
			width: 100
		}, {
			header: '完单号',
			dataIndex: 'prod_ord_seq',
			width: 100
		}, {
			header: '客户',
			dataIndex: 'cust_id',
			width: 100
		}, {
			header: '品名',
			dataIndex: 'article',
			width: 80
		}, {
			header: '品牌',
			dataIndex: 'brand',
			width: 90
		}, {
			header: '订单数',
			dataIndex: 'order_num',
			width: 60
		}, {
			header: '指令数',
			dataIndex: 'ins_num',
			width: 60
		}, {
			header: '实裁数',
			dataIndex: 'real_cut_num',
			width: 60
		}, {
			header: '领片短缺',
			dataIndex: 'draw_short_num',
			width: 60
		}, {
			header: '下线短缺',
			dataIndex: 'sew_short_num',
			width: 60
		}, {
			header: '水洗少收',
			dataIndex: 'bach_accept_short_num',
			width: 60
		}, {
			header: '水洗少交',
			dataIndex: 'bach_delivery_short_num',
			width: 60
		}, {
			header: '后整少收',
			dataIndex: 'pack_accept_short_num',
			width: 60
		}, {
			header: '后整短缺',
			dataIndex: 'product_short_num',
			width: 60
		}, {
			dataIndex: 'column_value',
			hidden: true,
			width: 60
		}]);

	var detail_store = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'ordSche.ered?reqCode=getOrdShortInfo'
		}),
		reader: new Ext.data.JsonReader({
			totalProperty: 'TOTALCOUNT',
			root: 'ROOT'
		}, ['ord_seq_no', 'prod_ord_seq', 'column_value',
			'ins_num', 'order_id', 'article', 'brand', 'order_date', 'cust_id', 'order_num',
			'real_cut_num', 'draw_short_num', 'sew_short_num', 'bach_accept_short_num',
			'bach_delivery_short_num', 'pack_accept_short_num', 'product_short_num'
		])
	});
	// 翻页排序时带上查询条件
	detail_store.on('beforeload', function () {
		this.baseParams = {
			startdate: Ext.getCmp('detail_enddate').getValue(),
			enddate: Ext.getCmp('detail_enddate').getValue(),
			flag: 'prod_ord_seq'
		};
	});

	var detail_pagesize_combo = new Ext.form.ComboBox({
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
				[500, '500条/页']
			]
		}),
		valueField: 'value',
		displayField: 'text',
		value: '20',
		editable: false,
		width: 85
	});

	var detail_number = parseInt(detail_pagesize_combo.getValue());
	detail_pagesize_combo.on("select", function (comboBox) {
		detail_bbar.pageSize = parseInt(comboBox.getValue());
		detail_number = parseInt(comboBox.getValue());
		detail_store.load({
			params: {
				start: 0,
				limit: detail_bbar.pageSize,
				startdate: Ext.getCmp('detail_enddate').getValue(),
				enddate: Ext.getCmp('detail_enddate').getValue()
			}
		});
	});

	var detail_bbar = new Ext.PagingToolbar({
		pageSize: detail_number,
		store: detail_store,
		displayInfo: true,
		displayMsg: '显示{0}条到{1}条,共{2}条',
		plugins: new Ext.ux.ProgressBarPager(), // 分页进度条
		emptyMsg: "没有符合条件的记录",
		items: ['-', '&nbsp;&nbsp;', detail_pagesize_combo]
	});

	var detail_grid = new Ext.grid.GridPanel({
		title: '进度短缺详情',
		height: 510,
		store: detail_store,
		region: 'center',
		loadMask: {
			msg: '正在加载表格数据,请稍等...'
		},
		stripeRows: true,
		//frame: true,
		border: false,
		cm: detail_cm,
		sm: detail_sm,
		tbar: [{
			xtype:'datefield',
			id: 'detail_startdate',
			name: 'detail_startdate',
			format: 'Y-m-d',
			emptyText: '订单交货起始日期',
			editable: false,
			width: 120
		}, '-', {
			xtype:'datefield',
			id: 'detail_enddate',
			name: 'detail_enddate',
			format: 'Y-m-d',
			emptyText: '订单交货结束日期',
			editable: false,
			width: 120
		}, {
			text: '查询',
			iconCls: 'page_findIcon',
			handler: function () {
				detail_store.reload({
					params: {
						start: 0,
						limit: detail_bbar.pageSize,
						flag: 'prod_ord_seq',
						startdate: Ext.getCmp('detail_enddate').getValue(),
						enddate: Ext.getCmp('detail_enddate').getValue()
					}
				});
			}
		}, '->', {
			text: '导出',
			id: 'import_button',
			iconCls: 'page_excelIcon',
			handler: function () {
				exportExcel('./ordSche.ered?reqCode=exportOrdShortInfo&flag=cur');
			}
		}],
		bbar: detail_bbar
	});

	var short_detail_sm = new Ext.grid.CheckboxSelectionModel({
		singleSelect: true
	});
	var short_detail_cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), short_detail_sm,
		{
			header: '订单号',
			dataIndex: 'ord_seq_no',
			width: 100
		}, {
			header: '完单号',
			dataIndex: 'prod_ord_seq',
			width: 100
		}]);

	var short_detail_store = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: './ordSche.ered?reqCode=getDetailShortInfo'
		}),
		reader: new Ext.data.JsonReader({
			totalProperty: 'TOTALCOUNT',
			root: 'ROOT'
		}, [
			{
				name: 'nature'
			},
			{
				name: 'nature_value'
			},
			{
				name: 'color'
			},
			{
				name: 'country'
			},
			{
				name: 'in_length'
			},
			{
				name: 'waist1'
			},
			{
				name: 'waist2'
			},
			{
				name: 'waist3'
			},
			{
				name: 'waist4'
			},
			{
				name: 'waist5'
			},
			{
				name: 'waist6'
			},
			{
				name: 'waist7'
			},
			{
				name: 'waist8'
			},
			{
				name: 'waist9'
			},
			{
				name: 'waist10'
			},
			{
				name: 'waist11'
			},
			{
				name: 'waist12'
			},
			{
				name: 'waist13'
			},
			{
				name: 'waist14'
			},
			{
				name: 'waist15'
			},
			{
				name: 'waist16'
			}
		])
	});
	// 翻页排序时带上查询条件
	short_detail_store.on('beforeload', function () {
		this.baseParams = {
			prod_ord_seq: check_prod_ord_seq
		};
	});
	short_detail_store.on('load', function (store) {
		short_back_store.removeAll();
		short_back_store.add(store.getRange());
	});

	var short_nature_combo = new Ext.ux.form.LovCombo({
		name: 'value',
		id: 'nature_combo',
		hiddenName: 'value',
		store: new Ext.data.ArrayStore({
			fields: ['value', 'text'],
			data: [
				['draw_short_num', '领片短缺'],
				['sew_short_num', '下线短缺'],
				['bach_accept_short_num', '水洗收短缺'],
				['bach_delivery_short_num', '水洗交短缺'],
				['pack_accept_short_num', '后整少收'],
				['product_short_num', '后整短缺']
			]
		}),
		mode: 'local',
		hideTrigger: false,
		triggerAction: 'all',
		valueField: 'value',
		displayField: 'text',
		emptyText: '请选择...',
		allowBlank: true,
		editable: false,
		anchor: "99%"
	});

	var short_back_store = new Ext.data.Store();
	var short_detail_grid = new Ext.grid.GridPanel({
		title: '短缺详情',
		height: 510,
		store: short_detail_store,
		region: 'center',
		loadMask: {
			msg: '正在加载表格数据,请稍等...'
		},
		viewConfig: {
			forceFit: true
		},
		stripeRows: true,
		//frame: true,
		border: false,
		cm: short_detail_cm,
		sm: short_detail_sm,
		tbar: ['短缺类型:', short_nature_combo, '-', {
			text: '查询',
			iconCls: 'page_findIcon',
			handler: function () {
				var size = short_back_store.getCount();

				var short_natures = short_nature_combo.getValue();
				if (short_natures != '') {
					var removeRecords = [];
					for (var i = 0; i < size; i++) {
						var record = short_back_store.getAt(i);
						if (short_natures.indexOf(record.get('nature').toString()) != -1) {
							removeRecords.push(record);
						}
					}
					short_detail_store.removeAll();
					short_detail_store.add(removeRecords);
				} else {
					short_detail_store.removeAll();
					short_detail_store.add(short_back_store.getRange());
				}

			}
		}, '->', {
			text: '导出',
			iconCls: 'page_excelIcon',
			handler: function () {
				var url = './ordSche.ered?reqCode=exportProdDetailShortInfo' +
					'&shortNatures=' + short_nature_combo.getValue() +
					'&columnValue=' + check_column_value + '&prod_ord_seq=' + check_prod_ord_seq;
				exportExcel(url);
			}
		}]
	});
	var view_panel = new Ext.Panel({
		title: '订单进度短缺图',
		tbar: ['-', {
			text: "<SPAN STYLE='font:normal 10pt Arial'>查询窗口</SPAN>",
			iconCls: 'page_findIcon',
			xtype: "button",
			handler: function () {
				codeWindow.show();
			}
		}],
		contentEl: 'myC2DChart_div',
		region: 'center'
	});

	/**
	 * 布局
	 */
	var tabPabel = new Ext.TabPanel({
		region: 'center',
		border: false,
		collapsed: false,
		deferredRender: false,
		layoutOnTabChange: true,
		activeTab: 1,
		autoScroll: true,
		items: [detail_grid, view_panel, short_detail_grid]
	});

	function showCharts() {
		var obj = getChartFromId("myC2DChart");
		if (obj) {
			var str = "./ordSche.ered?reqCode=getOrdShortInfoView&prod_ord_seq=" + check_prod_ord_seq + "&flag=prod_ord_seq";
			obj.setDataURL(escape(str));
		}
	}

	tabPabel.on('tabchange', function (tab, panel) {
		if (check_prod_ord_seq != '') {
			if (panel.title.indexOf("订单进度短缺图") != -1) {

				var task = new Ext.util.DelayedTask(showCharts);
				task.delay(10);

			} else if (panel.title.indexOf("短缺详情") != -1) {
				var columnsIns = [];
				columnsIns.push({
					header: '短缺性质',
					dataIndex: 'nature_value',
					align: 'center',
					width: 40
				});
				columnsIns.push({
					header: '国家',
					dataIndex: 'country',
					align: 'center',
					width: 40
				});
				columnsIns.push({
					header: '颜色',
					dataIndex: 'color',
					align: 'center',
					width: 40
				});
				columnsIns.push({
					header: '内长',
					dataIndex: 'in_length',
					align: 'center',
					width: 40,
					sortable: true
				});
				var columns = check_column_value.split(",");
				for (var i = 0; i < columns.length; i++) {
					columnsIns.push({
						header: columns[i],
						dataIndex: 'waist' + (i + 1),
						align: 'center',
						width: 40
					});
				}
				columnsIns.push({
					dataIndex: 'nature',
					align: 'center',
					hidden: true,
					width: 40
				});

				short_detail_grid.getColumnModel().setConfig(columnsIns);

				short_detail_store.load({
					params: {
						start: 0,
						limit: 9999,
						prod_ord_seq: check_prod_ord_seq
					}
				});

			}
		}
	});

	var viewport = new Ext.Viewport({
        layout : 'border',
        items : [{
            region : 'center',
            layout : 'fit',
            margins : '3 3 3 3',
            items : [tabPabel]
        }]
    });

	viewport.on('render', function () {
		detail_grid.setHeight(document.body.clientHeight - 28);
	});

	//显示查询窗口
	var task2 = new Ext.util.DelayedTask(function(){
		codeWindow.show();
	});
	task2.delay(300);


});