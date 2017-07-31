/************************************************
 * 创建日期: 2013-05-08
 * 创建作者：may
 * 功能：订单短缺
 * 最后修改时间：
 * 修改记录：
 *************************************************/
Ext.onReady(function () {

	var check_ord_seq_no='';//选中的订单记录

//	var order_sm = new Ext.grid.CheckboxSelectionModel({
//		singleSelect: true
//	});
//	var order_cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), order_sm,
//		{
//			header: '订单号',
//			dataIndex: 'order_id',
//			width: 100
//		},  {
//			header: '订单日期',
//			dataIndex: 'order_date',
//			width: 100
//		}, {
//			header: '客户',
//			dataIndex: 'cust_id',
//			width: 100
//		},{
//			header: '品名',
//			dataIndex: 'article',
//			width: 80
//		}, {
//			header: '品牌',
//			dataIndex: 'brand',
//			width: 90
//		}, {
//			hidden:true,
//			dataIndex: 'seq_no',
//			width: 180
//		}]);
//
//	var order_store = new Ext.data.Store({
//		proxy: new Ext.data.HttpProxy({
//			url: './ordBas.ered?reqCode=queryOrdBasInfo'
//		}),
//		reader: new Ext.data.JsonReader({
//			totalProperty: 'TOTALCOUNT',
//			root: 'ROOT'
//		}, [
//			{
//				name: 'seq_no'
//			},
//			{
//				name: 'order_id'
//			},
//			{
//				name: 'article'
//			},
//			{
//				name: 'brand'
//			},
//			{
//				name: 'order_date'
//			},
//			{
//				name: 'cust_id'
//			}
//		])
//	});
//	// 翻页排序时带上查询条件
//	order_store.on('beforeload', function () {
//		this.baseParams = {
//			startdate: Ext.getCmp('startdate').getValue(),
//			enddate: Ext.getCmp('enddate').getValue()
//		};
//	});
//
//	var order_pagesize_combo = new Ext.form.ComboBox({
//		name: 'pagesize',
//		hiddenName: 'pagesize',
//		typeAhead: true,
//		triggerAction: 'all',
//		lazyRender: true,
//		mode: 'local',
//		store: new Ext.data.ArrayStore({
//			fields: ['value', 'text'],
//			data: [
//				[10, '10条/页'],
//				[20, '20条/页'],
//				[50, '50条/页'],
//				[100, '100条/页'],
//				[250, '250条/页'],
//				[500, '500条/页']
//			]
//		}),
//		valueField: 'value',
//		displayField: 'text',
//		value: '20',
//		editable: false,
//		width: 85
//	});
//
//	var order_number = parseInt(order_pagesize_combo.getValue());
//	order_pagesize_combo.on("select", function (comboBox) {
//		order_bbar.pageSize = parseInt(comboBox.getValue());
//		order_number = parseInt(comboBox.getValue());
//		order_store.load({
//			params: {
//				start: 0,
//				limit: order_bbar.pageSize,
//				startdate: Ext.getCmp('startdate').getValue(),
//				enddate: Ext.getCmp('enddate').getValue()
//			}
//		});
//	});
//
//	var order_bbar = new Ext.PagingToolbar({
//		pageSize: order_number,
//		store: order_store,
//		displayInfo: true,
//		displayMsg: '显示{0}条到{1}条,共{2}条',
//		plugins: new Ext.ux.ProgressBarPager(), // 分页进度条
//		emptyMsg: "没有符合条件的记录",
//		items: ['-', '&nbsp;&nbsp;', order_pagesize_combo]
//	})

//	var order_grid = new Ext.grid.GridPanel({
//		title:'订单选择',
//		width : 250,
//		heigth:500,
//		minSize : 160,
//		maxSize : 500,
//		split : true,
//		collapsible : true,
//		autoScroll : true,
//		region : 'west',
//		store: order_store,
//		loadMask: {
//			msg: '正在加载表格数据,请稍等...'
//		},
//		stripeRows: true,
//		frame: true,
//		cm: order_cm,
//		sm: order_sm,
//		tbar: [],
//		bbar: order_bbar,
//		listeners: {
//			render: function () {
//				var tbar = new Ext.Toolbar({
//					items: ['-', {
//						text: "<SPAN STYLE='font:normal 10pt Arial'>查询</SPAN>",
//						iconCls: 'page_findIcon',
//						xtype: "button",
//						handler: function () {
//							order_store.reload({
//								params:{
//									start: 0,
//									limit: order_bbar.pageSize,
//									startdate: Ext.getCmp('startdate').getValue(),
//									enddate: Ext.getCmp('enddate').getValue()
//								}
//							})
//						}
//					}, '-', {
//						text: "<SPAN STYLE='font:normal 10pt Arial'>重置</SPAN>",
//						iconCls: 'tbar_synchronizeIcon',
//						xtype: "button",
//						handler: function () {
//							Ext.getCmp('startdate').reset();
//							Ext.getCmp('enddate').reset();
//						}
//					},'->',{
//						text: '导出',
//						id: 'import_button',
//						iconCls: 'page_excelIcon',
//						handler: function () {
//							exportExcel('./ordSche.ered?reqCode=exportOrdShortInfo&flag=all');
//						}
//					}]
//				});
//				tbar.render(this.tbar);
//			}
//		}
//	});
//
//	order_grid.on('sortchange', function () {
//		order_grid.getSelectionModel().selectFirstRow();
//	});
//
//	order_bbar.on("change", function () {
//		order_grid.getSelectionModel().selectFirstRow();
//	});
//
//	order_grid.getSelectionModel().on('rowselect',function(rsm,rowIndex,record){
//		check_ord_seq_no = record.get('order_id');
//		updateChartData();
//	});

	var detail_sm = new Ext.grid.CheckboxSelectionModel({
		singleSelect: true
	});

	var detail_cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), detail_sm,
		{
			header: '订单号',
			dataIndex: 'ord_seq_no',
			width: 100
		},{
			header: '订单日期',
			dataIndex: 'order_date',
			width: 100
		},{
			header: '客户',
			dataIndex: 'cust_id',
			width: 100
		},{
			header: '品名',
			dataIndex: 'article',
			width: 80
		},{
			header: '品牌',
			dataIndex: 'brand',
			width: 90
		},{
			header: '订单数',
			dataIndex: 'order_num',
			width: 60
		},{
			header: '指令数',
			dataIndex: 'ins_num',
			width: 60
		},{
			header: '实裁数',
			dataIndex: 'real_cut_num',
			width: 60
		},{
			header: '裁片短缺',
			dataIndex: 'draw_short_num',
			width: 60
		},{
			header: '缝制短缺',
			dataIndex: 'sew_short_num',
			width: 60
		},{
			header: '水洗收短缺',
			dataIndex: 'bach_accept_short_num',
			width: 60
		},{
			header: '水洗交短缺',
			dataIndex: 'bach_delivery_short_num',
			width: 60
		},{
			header: '后整收短缺',
			dataIndex: 'pack_accept_short_num',
			width: 60
		}, {
			header: '后整交短缺',
			dataIndex: 'product_short_num',
			width: 60
		}, {
			header: '查看图表',
			dataIndex: 'queryView',
			width: 60,
			renderer:function(value){
				return "<a href='javascript:void(0);'><img src='" + webContext
					+ "/resource/image/ext/edit1.png'/></a>";
			}
		}]);

	var detail_store = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'ordSche.ered?reqCode=getOrdShortInfo'
		}),
		reader: new Ext.data.JsonReader({
			totalProperty: 'TOTALCOUNT',
			root: 'ROOT'
		}, ['ord_seq_no',
			'ins_num','order_id','article','brand','order_date','cust_id','order_num',
			'real_cut_num','draw_short_num','sew_short_num','bach_accept_short_num',
			'bach_delivery_short_num','pack_accept_short_num','product_short_num'
		])
	});
	// 翻页排序时带上查询条件
	detail_store.on('beforeload', function () {
		this.baseParams = {
			startdate: Ext.getCmp('startdate').getValue(),
			enddate: Ext.getCmp('enddate').getValue()
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
				startdate: Ext.getCmp('startdate').getValue(),
				enddate: Ext.getCmp('enddate').getValue(),
				flag:'ord_seq_no'
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
	})

	var detail_grid = new Ext.grid.GridPanel({
		title:'进度短缺详情',
		height: 510,
		store: detail_store,
		region: 'center',
		loadMask: {
			msg: '正在加载表格数据,请稍等...'
		},
		stripeRows: true,
		frame: true,
		border:true,
		cm: detail_cm,
		sm: detail_sm,
		tbar: [new Ext.form.DateField({
			id: 'startdate',
			name: 'startdate',
			format: 'Y-m-d',
			emptyText:'订单开始日期',
			editable: false,
			enableKeyEvents: true,
			width: 100
		}), '-', new Ext.form.DateField({
			id: 'enddate',
			name: 'enddate',
			format: 'Y-m-d',
			emptyText:'订单结束日期',
			editable: false,
			enableKeyEvents: true,
			width: 100
		}),{
			text: '查询',
			iconCls: 'page_findIcon',
			handler: function () {
				detail_store.reload({
					params:{
						start:0,
						limit:detail_bbar.pageSize,
						flag:'ord_seq_no'
					}
				});
			}
		},'->',{
			text: '导出',
			id: 'import_button',
			iconCls: 'page_excelIcon',
			handler: function () {
				exportExcel('./ordSche.ered?reqCode=exportOrdShortInfo&flag=cur');
			}
		}],
		bbar: detail_bbar
	});

	detail_grid.on("cellclick", function(grid, rowIndex, columnIndex, e) {
		var store = grid.getStore();
		var record = store.getAt(rowIndex);
		var fieldName = grid.getColumnModel().getDataIndex(columnIndex);
		if (fieldName == 'queryView') {
			check_ord_seq_no = record.get('ord_seq_no');
			tabPabel.setActiveTab(1);
		}
	});

	var detail_window = new Ext.Window({
		title: '<span style="font-weight:normal">订单选择<span>', // 窗口标题
		layout: 'fit', // 设置窗口布局模式
		maximized: false,
		width: 600,
		height: 400,
		closable: false, // 是否可关闭
		collapsible: true, // 是否可收缩
		maximizable: true, // 设置是否可以最大化
		maximized: true,
		border: false, // 边框线设置
		constrain: true, // 设置窗口是否可以溢出父容器
		animateTarget: Ext.getBody(),
		pageY: 20, // 页面定位Y坐标
		pageX: document.body.clientWidth / 2 - 200 / 2, // 页面定位X坐标
		items: [ detail_grid],
		buttons: [
			{
				text: '关闭',
				iconCls: 'deleteIcon',
				handler: function () {
					detail_window.hide();
				}
			}
		]
	});

	var panel = new Ext.Panel({
		title:'订单进度短缺图',
		id:'shortView',
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
		items: [  detail_grid,panel]
	});

	tabPabel.on('tabchange',function(tab,panel){
		if(panel.getId()=='shortView'){
			Ext.Ajax.request({
				url: './ordSche.ered?reqCode=getOrdShortInfoView',
				params: {
					ord_seq_no:check_ord_seq_no,
					flag:'ord_seq_no'
				},
				method: 'POST',
				success: function (response) {
					var resultArray = Ext.util.JSON.decode(response.responseText);
					var xmlString = resultArray.xmlString;
					if(getChartFromId("myC2DChart")){
						updateChartXML("myC2DChart", xmlString);
					}
				}
			});
		}
	});

	var viewport = new Ext.Viewport({
		layout: 'border',
		items: [tabPabel]
	});


});