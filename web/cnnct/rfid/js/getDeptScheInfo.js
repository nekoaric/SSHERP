/************************************************
 * 创建日期: 2013-05-08
 * 创建作者：may
 * 功能：部门总进度
 * 最后修改时间：
 * 修改记录：
 *************************************************/
Ext.onReady(function () {

	var check_dept_id,check_ord_seq_no;//grid选中的部门和订单信息
	var click_dept_id;//部门树点击的部门节点

	var root = new Ext.tree.AsyncTreeNode({
		text: '',
		expanded: true,
		iconCls: 'folder_userIcon',
		id: '001'
	});
	var deptTree = new Ext.tree.TreePanel({
		loader: new Ext.tree.TreeLoader({
			baseAttrs: {},
			dataUrl: './sysDept.ered?reqCode=departmentTreeInit'
		}),
		root: root,
		region: 'west',
		width:180,
		minSize : 160,
		maxSize : 300,
		title: '部门信息',
		animate : true,
		split : true,
		collapsible: true,
		autoScroll : true,
		rootVisible: false
	});

	deptTree.on('click', function (node) { // 左键单击
		click_dept_id = node.attributes.id;

		order_store.reload({
			params:{
				dept_id:click_dept_id
			}
		});

	});

	var order_sm = new Ext.grid.CheckboxSelectionModel({
		singleSelect: true
	});

	var order_cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), order_sm,
		{
			header: '部门',
			dataIndex: 'dept_name',
			width: 100
		},{
			header: '订单号',
			dataIndex: 'order_id',
			width: 100
		},{
			header: '品名',
			dataIndex: 'article',
			width: 100
		}, {
			header: '品牌',
			dataIndex: 'brand',
			width: 100
		}, {
			header: '订单日期',
			dataIndex: 'order_date',
			width: 100
		}, {
			header: '客户',
			dataIndex: 'cust_id',
			width: 100
		}, {
			header: '部门编号',
			dataIndex: 'dept_id',
			hidden:true,
			width: 100
		},{
			hidden:true,
			dataIndex: 'seq_no',
			width: 60
		}]);

	var order_store = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: './deptSche.ered?reqCode=getOrdBasInfoByDeptId'
		}),
		reader: new Ext.data.JsonReader({
			totalProperty: 'TOTALCOUNT',
			root: 'ROOT'
		}, [
			{
				name: 'seq_no'
			},
			{
				name: 'order_id'
			},
			{
				name: 'article'
			},
			{
				name: 'brand'
			},
			{
				name: 'order_date'
			},
			{
				name: 'cust_id'
			},
			{
				name: 'dept_id'
			},
			{
				name: 'dept_name'
			}
		])
	});

	// 翻页排序时带上查询条件
	order_store.on('beforeload', function () {
		this.baseParams = {
			startdate: Ext.getCmp('startdate').getValue(),
			enddate: Ext.getCmp('enddate').getValue()
		};
	});

	var order_pagesize_combo = new Ext.form.ComboBox({
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

	var order_number = parseInt(order_pagesize_combo.getValue());
	order_pagesize_combo.on("select", function (comboBox) {
		order_bbar.pageSize = parseInt(comboBox.getValue());
		order_number = parseInt(comboBox.getValue());
		order_store.load({
			params: {
				start: 0,
				limit: order_bbar.pageSize,
				startdate: Ext.getCmp('startdate').getValue(),
				enddate: Ext.getCmp('enddate').getValue()
			}
		});
	});

	var order_bbar = new Ext.PagingToolbar({
		pageSize: order_number,
		store: order_store,
		displayInfo: true,
		displayMsg: '显示{0}条到{1}条,共{2}条',
		plugins: new Ext.ux.ProgressBarPager(), // 分页进度条
		emptyMsg: "没有符合条件的记录",
		items: ['-', '&nbsp;&nbsp;', order_pagesize_combo]
	})

	var order_grid = new Ext.grid.GridPanel({
		split: true,
		autoScroll: true,
		region: 'center',
		store: order_store,
		loadMask: {
			msg: '正在加载表格数据,请稍等...'
		},
		stripeRows: true,
		frame: true,
		cm: order_cm,
		sm: order_sm,
		tbar: [new Ext.form.DateField({
			id: 'startdate',
			name: 'startdate',
			format: 'Y-m-d',
			emptyText: '订单开始日期',
			editable: false,
			enableKeyEvents: true,
			width: 100
		}), '-', new Ext.form.DateField({
			id: 'enddate',
			name: 'enddate',
			format: 'Y-m-d',
			emptyText: '订单结束日期',
			editable: false,
			enableKeyEvents: true,
			width: 100
		}),'-', {
			text: "<SPAN STYLE='font:normal 10pt Arial'>查询</SPAN>",
			iconCls: 'page_findIcon',
			xtype: "button",
			handler: function () {
				order_store.reload({
					params: {
						start: 0,
						limit: order_bbar.pageSize,
						startdate: Ext.getCmp('startdate').getValue(),
						enddate: Ext.getCmp('enddate').getValue(),
						dept_id:click_dept_id
					}
				})
			}
		}, '-', {
			text: "<SPAN STYLE='font:normal 10pt Arial'>重置</SPAN>",
			iconCls: 'tbar_synchronizeIcon',
			xtype: "button",
			handler: function () {
				Ext.getCmp('startdate').reset();
				Ext.getCmp('enddate').reset();
			}
		}],
		bbar: order_bbar
	});

	order_grid.on('sortchange', function () {
		order_grid.getSelectionModel().selectFirstRow();
	});

	order_bbar.on("change", function () {
		order_grid.getSelectionModel().selectFirstRow();
	});

	order_store.load({
		params:{
			start:0,
			limit:order_bbar.pageSize
		}
	});

	var check_window = new Ext.Window({
		title: '<span style="font-weight:normal;color:red">请选择一个部门订单进行查看<span>', // 窗口标题
		layout: 'border', // 设置窗口布局模式
		maximized: false,
		width: 600,
		height: 400,
		closable: true, // 是否可关闭
		collapsible: true, // 是否可收缩
		closeAction:'hide',
		maximized: true,
		maximizable: true, // 设置是否可以最大化
		border: false, // 边框线设置
		constrain: true, // 设置窗口是否可以溢出父容器
		animateTarget: Ext.getBody(),
		pageY: 20, // 页面定位Y坐标
		pageX: document.body.clientWidth / 2 - 550 / 2, // 页面定位X坐标
		items: [ deptTree, order_grid],
		buttons:[
			{
				text:'确定',
				iconCls:'acceptIcon',
				id:'btn_id_save_update',
				handler:function () {
					var record = order_grid.getSelectionModel().getSelected();
					if(Ext.isEmpty(record)){
						Ext.Msg.alert('提示','请选择一条有效订单记录!');
						return;
					}

					check_ord_seq_no = record.get('seq_no');
					check_dept_id = record.get('dept_id');
					updateChartData();
					check_window.hide();
				}
			},
			{
				text:'关闭',
				iconCls:'deleteIcon',
				handler:function () {
					check_window.hide();
				}
			}
		]
	});

	var detail_sm = new Ext.grid.CheckboxSelectionModel({
		singleSelect: true
	});
	var detail_cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), detail_sm,
		{
			header: '部门',
			dataIndex: 'dept_name',
			width: 120
		}, {
			header: '数量性质',
			dataIndex: 'nature',
			width: 60
		}, {
			header: '完成数',
			dataIndex: 'complete_num',
			width: 60
		}, {
			header: '总数',
			dataIndex: 'total_num',
			width: 60
		},{
			header: '品名',
			dataIndex: 'article',
			width: 100
		}, {
			header: '品牌',
			dataIndex: 'brand',
			width: 100
		}, {
			header: '订单号',
			dataIndex: 'ord_seq_no',
			width: 100
		}, {
			header: '订单日期',
			dataIndex: 'order_date',
			width: 100
		}, {
			header: '客户',
			dataIndex: 'cust_id',
			width: 100
		}]);

	var detail_store = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: './deptSche.ered?reqCode=getDeptScheInfo'
		}),
		reader: new Ext.data.JsonReader({
			totalProperty: 'TOTALCOUNT',
			root: 'ROOT'
		}, ['dept_name', 'nature','complete_num', 'total_num', 'article', 'brand', 'ord_seq_no', 'order_date',
			'cust_id','dept_id'
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
				enddate: Ext.getCmp('enddate').getValue()
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
		title:'部门进度详情',
		height: 510,
		store: detail_store,
		region: 'center',
		loadMask: {
			msg: '正在加载表格数据,请稍等...'
		},
		stripeRows: true,
		frame: true,
		cm: detail_cm,
		sm: detail_sm,
		tbar: [{
			text: '选择订单',
			iconCls: 'page_findIcon',
			handler: function () {
				check_window.show();
			}
		},
			'->',{
				text: '导出当前部门记录',
				id: 'import_button',
				iconCls: 'page_excelIcon',
				handler: function () {
					exportExcel('./deptSche.ered?reqCode=exportDeptSche&flag=cur');
				}
			},{
				text: '导出全部记录',
				id: 'import_button1',
				iconCls: 'page_excelIcon',
				handler: function () {
					exportExcel('./deptSche.ered?reqCode=exportDeptSche&flag=all');
				}
			}
		],
		bbar: detail_bbar
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
		title:'部门进度图',
		tbar: [
			{
				text: '选择订单',
				iconCls: 'page_findIcon',
				handler: function () {
					check_window.show();
				}
			}
		],
		contentEl: 'my2DCMSChart_div',
		region: 'center'
	});

	/**
	 * 布局
	 */
	var empTab = new Ext.TabPanel({
		region: 'center',
		border: false,
		collapsed: false,
		deferredRender: false,
		layoutOnTabChange: true,
		activeTab: 0,
		autoScroll: true,
		items: [  panel,detail_grid ]
	});
	var viewport = new Ext.Viewport({
		layout: 'border',
		items: [empTab]
	});

	check_window.show();

	/**
	 * 更新chart数据
	 */
	function updateChartData() {
		Ext.Ajax.request({
			url: './deptSche.ered?reqCode=getDeptScheInfoView',
			params: {
				ord_seq_no: check_ord_seq_no,
				dept_id:check_dept_id
			},
			method: 'POST',
			success: function (response) {
				var resultArray = Ext.util.JSON.decode(response.responseText);
				var xmlString = resultArray.xmlString;
				updateChartXML("my2DCMSChart", xmlString);
			}
		});
		detail_store.reload({
			params: {
				ord_seq_no: check_ord_seq_no
			}
		});
	}
});