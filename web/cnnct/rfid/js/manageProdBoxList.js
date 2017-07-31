/************************************************
 * 创建日期: 2013-05-23
 * 创建作者：lingm
 * 功能：产品装箱确认
 * 最后修改时间：
 * 修改记录：
 *************************************************/
Ext.onReady(function () {
	var re = '<span style="color:red">*</span>'
	var rs = '<span style="color:Red">(*为必填项)</span>'

	var prodBox_flag;

	// 定义列模型
	var prodBoxsm = new Ext.grid.CheckboxSelectionModel({
		singleSelect: false
	});
	var dataStore = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: './manageProdBox.ered?reqCode=queryProdBoxDetail'
		}),
		reader: new Ext.data.JsonReader({
			root: 'ROOT' // Json中的列表数据根节点
		}, [
			{
				name: 'amount'
			},
			{
				name: 'product_id'
			},
			{
				name: 'box_no'
			}
		])
	});
	var prodBoxcm = new Ext.grid.ColumnModel([ prodBoxsm, {
		header: '装箱箱号',
		dataIndex: 'box_no',
		align: 'center',
		width: 100,
		editor: new Ext.form.TextField({
			allowBlank: false
		})
	}, {
		header: '产品编号',
		dataIndex: 'product_id',
		align: 'center',
		width: 100,
		sortable: true,
		editor: new Ext.form.TextField({
			allowBlank: false
		})
	}, {
		header: '数量',
		dataIndex: 'amount',
		align: 'center',
		width: 40,
		sortable: true,
		editor: new Ext.form.NumberField()
	}]);

	// 表格工具栏
	var prodBoxbar = new Ext.Toolbar({
		items: [
			{
				text: '添加装箱单信息',
				id: 'prodOrd_submit_button',
				iconCls: 'page_edit_1Icon',
				handler: function () {
					enterAddForm();
				}
			},
			'-',
			{
				text: '删除装箱单信息',
				id: 'prodOrd_cancel_button',
				iconCls: 'page_edit_1Icon',
				handler: function () {
					deleteData();
				}
			}
		]
	});

	// 表格实例
	var prodBoxGrid = new Ext.grid.EditorGridPanel(
		{
			title: '<img src="./resource/image/ext/application_view_list.png" align="top" class="IEPNG"><span style="font-weight:normal">装箱单信息</span>',
			height: 500,
			frame: true,
			autoEncode: true,
			region: 'center', // 和VIEWPORT布局模型对应，充当center区域布局
			store: dataStore, // 数据存储
			pruneModifiedRecords: true,
			stripeRows: true, // 斑马线
			cm: prodBoxcm, // 列模型
			sm: prodBoxsm,
			tbar: prodBoxbar, // 表格工具栏
			viewConfig: {
				forceFit: true
			},
			loadMask: {
				msg: '正在加载表格数据,请稍等...'
			}
		});

	var prodBoxStore = new Ext.data.SimpleStore({
		proxy: new Ext.data.HttpProxy({
			url: './manageProdBox.ered?reqCode=queryProdBoxInfo'
		}),
		reader: new Ext.data.JsonReader({
			totalProperty: 'TOTALCOUNT', // 记录总数
			root: 'ROOT' // Json中的列表数据根节点
		}, [
			{
				name: 'seq_no'
			},
			{
				name: 'prod_box_no'
			},
			{
				name: 'ord_seq_no'
			},
			{
				name: 'batch'
			},
			{
				name: 'box_no'
			},
			{
				name: 'product_id'
			},
			{
				name: 'amount'
			},
			{
				name: 'opr_id'
			},
			{
				name: 'opr_date'
			},
			{
				name: 'state'
			}
		])
	});

	/**
	 * 订单下拉框
	 */
	var boxStore = new Ext.data.SimpleStore({
		proxy: new Ext.data.HttpProxy({
			url: './prodOrd.ered?reqCode=getOrdIdCombox'
		}),
		reader: new Ext.data.JsonReader({}, [
			{
				name: 'value'
			},
			{
				name: 'text'
			}
		])
	});
	boxStore.load();

	var boxCombo = new Ext.form.ComboBox({
		name: 'order_id',
		hiddenName: 'order_id',
		id: 'order_ids',
		store: boxStore,
		mode: 'local',
		triggerAction: 'all',
		valueField: 'value',
		displayField: 'text',
		value: '0',
		fieldLabel: '订单号' + re,
		emptyText: '请选择...',
		allowBlank: true,
		forceSelection: true,
		editable: false,
		typeAhead: true,
		anchor: "95%"
	});
	boxCombo.on('select', function () {
		var value = boxCombo.getValue();
		prodBoxStore.load({
			params: {
				seq_no: value
			}
		});
		var recoder = prodBoxStore.getAt(0);
		Ext.getCmp('cust_name').setValue(recoder.get('cust_name'));
		Ext.getCmp('cust_id').setValue(recoder.get('cust_id'));
		Ext.getCmp('style_no').setValue(recoder.get('style_no'));
		Ext.getCmp('classify').setValue(recoder.get('classify'));
		Ext.getCmp('order_num').setValue(recoder.get('order_num'));
		Ext.getCmp('delivery_date').setValue(recoder.get('delivery_date'));
		Ext.getCmp('contract_id').setValue(recoder.get('contract_id'));
		Ext.getCmp('batch').setValue(recoder.get('batch'));
		Ext.getCmp('article').setValue(recoder.get('article'));
		Ext.getCmp('prod').setValue(recoder.get('percent'));
		Ext.getCmp('material').setValue(recoder.get('material'));
		Ext.getCmp('notity_date').setValue(recoder.get('notity_date'));
	});

	var boxsPanel = new Ext.Panel({
		title: "装箱资料",
		layout: "form",
		region: 'center',
		labelAlign: "right",
		labelWidth: 70,
		height: 280,
		frame: true,
		items: [
			{
				layout: 'column',
				anchor: '100%',
				width: 100,
				bodyStyle: 'padding:0 0 0 5', // 表单元素和表单面板的边距
				border: false,
				frame: false,
				items: [
					{
						columnWidth: 0.5,
						layout: 'form',
						labelWidth: 70, // 标签宽度
						border: false,
						items: [
							{
								xtype: "textfield",
								fieldLabel: "款号",
								allowBlank: false,
								id: 'prod_box_no',
								name: 'prod_box_no',
								anchor: "84%"
							},
							{
								xtype: "textfield",
								fieldLabel: "色号",
								allowBlank: false,
								id: 'style_no',
								name: 'style_no',
								anchor: "84%"
							},
							{
								xtype: "textfield",
								fieldLabel: "批次",
								allowBlank: false,
								id: 'batch',
								name: 'batch',
								anchor: "84%"
							},
							{
								xtype: "textfield",
								fieldLabel: "Po",
								allowBlank: false,
								id: 'ord_seq_no',
								name: 'ord_seq_no',
								anchor: "84%"
							}
						]
					},
					{
						columnWidth: 0.5,
						layout: 'form',
						labelWidth: 75, // 标签宽度
						border: false,
						items: [
							{
								xtype: "textfield",
								fieldLabel: "出运地",
								allowBlank: false,
								id: 'place',
								name: 'place',
								anchor: "84%"
							},
							{
								xtype: "textfield",
								fieldLabel: "订单数量",
								allowBlank: false,
								id: 'allAmount',
								name: 'allAmount',
								anchor: "84%"
							},
							{
								xtype: "textfield",
								fieldLabel: "出货数",
								allowBlank: false,
								id: 'article',
								name: 'article',
								anchor: "84%"
							},
							{
								xtype: "textfield",
								fieldLabel: "短溢装",
								allowBlank: false,
								id: 'prod',
								name: 'prod',
								anchor: "84%"
							}
						]
					}
				]
			}
		]
	});


	/**
	 * 布局
	 */

	var boxPanel = new Ext.Panel({
		layout: "border",
		height: 240,
		frame: true,
		items: [
			{
				region: 'center',
				width: 450,
				items: [ boxsPanel ]
			}
		]
	});

	var prodBoxPanel = new Ext.FormPanel({
		layout: 'border',
		labelAlign: 'right',
		title: '基本信息',
		id: 'prodBoxPanel_id',
		name: 'prodBoxPanel',
		items: [
			{
				region: 'north',
				height: 160,
				items: [ boxPanel ]
			},
			{
				region: 'center',
				items: [ prodBoxGrid ]
			}
		],
		buttons: [
			{
				text: '保存',
				iconCls: 'acceptIcon',
				handler: function () {
					enterOrdAddForm();
				}
			},
			{
				text: '重置',
				iconCls: 'deleteIcon',
				handler: function () {
					clearForm(prodBoxPanel.getForm());
					dataStore.removeAll();

				}
			}
		]
	});

	/**
	 * 表单数据---确定增加
	 */
	function enterAddForm() {
		var p = new Ext.data.Record({
			box_no: "",
			product_id: "",
			amount: ""
		});
		dataStore.add(p);
	}

	// 删除数据
	function deleteData() {
		var rows = prodBoxGrid.getSelectionModel().getSelections();
		if (Ext.isEmpty(rows)) {
			Ext.MessageBox.alert('提示', '您没有选中任何数据!');
			return;
		}
		dataStore.remove(rows);
	}

	/**
	 * 表单数据---确定增加
	 */
	function enterOrdAddForm() {
		var rows = prodBoxGrid.getStore().getCount();
		for (var i = 0; i < rows; i++) {
			prodBoxGrid.getSelectionModel().selectRow(i, true);
		}
		var mr = prodBoxGrid.getSelectionModel().getSelections();
		var strChecked = tableCells2JsonString(mr, ['box_no', 'product_id', 'amount']);
		Ext.Ajax.request({
			url: './manageProdBox.ered?reqCode=saveProdBoxInfo',
			success: function (response) { // 回调函数有1个参数
				var resultArray = Ext.util.JSON.decode(response.responseText);
				Ext.Msg.alert('提示', resultArray.msg);
				store.reload();
				dataStore.removeAll();
				clearForm(prodBoxPanel.getForm());
			},
			failure: function (response) {
				Ext.Msg.alert('提示通知单保存失败');
			},
			params: {
				prod_box_no: Ext.getCmp('prod_box_no').getValue(),
				ord_seq_no: Ext.getCmp('ord_seq_no').getValue(),
				batch: Ext.getCmp('batch').getValue(),
				prodBox_flag: prodBox_flag,
				strChecked: strChecked
			}
		});
	}

	var tabid = '';
	// 定义列模型
	var sm = new Ext.grid.CheckboxSelectionModel({
		singleSelect: true
	});

	var cm = new Ext.grid.ColumnModel([ sm, new Ext.grid.RowNumberer(), {
		header: '序号',
		dataIndex: 'seq_no',
		align: 'center',
		hidden: true,
		width: 120
	}, {
		header: '装箱单编号',
		dataIndex: 'prod_box_no',
		align: 'center',
		width: 120
	}, {
		header: '订单号',
		dataIndex: 'ord_seq_no',
		align: 'center',
		width: 120
	}, {
		header: '批次',
		dataIndex: 'batch',
		align: 'center',
		width: 120
	}, {
		header: '登记员',
		dataIndex: 'opr_id',
		align: 'center',
		width: 120,
		sortable: true
	}, {
		header: '登记时间',
		dataIndex: 'opr_date',
		align: 'center',
		width: 120,
		sortable: true
	}, {
		header: '状态',
		dataIndex: 'state',
		align: 'center',
		hidden: true,
		width: 120,
		sortable: true
	} ]);
	/**
	 * 数据存储
	 */
	var store = new Ext.data.Store({
		// 获取数据的方式
		proxy: new Ext.data.HttpProxy({
			url: './manageProdBox.ered?reqCode=queryProdBoxList'
		}),
		// 数据读取器
		reader: new Ext.data.JsonReader({
			totalProperty: 'TOTALCOUNT', // 记录总数
			root: 'ROOT' // Json中的列表数据根节点
		}, [
			{
				name: 'seq_no'
			},
			{
				name: 'prod_box_no'
			},
			{
				name: 'ord_seq_no'
			},
			{
				name: 'batch'
			},
			{
				name: 'box_no'
			},
			{
				name: 'product_id'
			},
			{
				name: 'amount'
			},
			{
				name: 'opr_id'
			},
			{
				name: 'opr_date'
			},
			{
				name: 'state'
			}
		])
	});

	// 翻页排序时带上查询条件
	store.on('beforeload', function () {
		this.baseParams = {
		};
	});

	// 每页显示条数下拉选择框
	var pagesize_combo = new Ext.form.ComboBox({
		name: 'pagesize',
		triggerAction: 'all',
		mode: 'local',
		store: new Ext.data.ArrayStore(
			{
				fields: [ 'value', 'text' ],
				data: [
					[ 10, '10条/页' ],
					[ 20, '20条/页' ],
					[ 50, '50条/页' ],
					[ 100, '100条/页' ],
					[ 250, '250条/页' ],
					[ 500, '500条/页' ]
				]
			}),
		valueField: 'value',
		displayField: 'text',
		value: '20',
		editable: false,
		width: 85
	});
	var number = parseInt(pagesize_combo.getValue());
	// 改变每页显示条数reload数据
	pagesize_combo.on("select", function (comboBox) {
		bbar.pageSize = parseInt(comboBox.getValue());
		number = parseInt(comboBox.getValue());
		store.reload({
			params: {
				start: 0,
				limit: bbar.pageSize
			}
		});
	});

	// 分页工具栏
	var bbar = new Ext.PagingToolbar({
		pageSize: number,
		store: store,
		displayInfo: true,
		displayMsg: '显示{0}条到{1}条,共{2}条',
		plugins: new Ext.ux.ProgressBarPager(), // 分页进度条
		emptyMsg: "没有符合条件的记录",
		items: [ '-', '&nbsp;&nbsp;', pagesize_combo ]
	});
	var codeWindow;

	// 表格工具栏
	var tbar = new Ext.Toolbar({
		items: [
			{
				text: '新增',
				id: 'new_button',
				iconCls: 'page_addIcon',
				handler: function () {
					if (tabid == "prodBoxPanel_id") {
						dataStore.removeAll();
					}
					clearForm(prodBoxPanel.getForm());
					dataStore.removeAll();
					codeWindow.show();
				}
			},
			'-',
			{
				text: '修改',
				id: 'modify_button',
				iconCls: 'page_edit_1Icon',
				handler: function () {
					updateProdOrdDataInit();
				}
			},
			'-',
			{
				text: '删除',
				id: 'delete_button',
				iconCls: 'page_delIcon',
				handler: function () {
					deleteProdBoxData();
				}
			},
			{
				xtype: 'tbseparator',
				id: 'check_seqarator'
			},
			{
				text: '刷新',
				iconCls: 'page_refreshIcon',
				handler: function () {
					store.reload();
				}
			}
		]
	});

	var grid = new Ext.grid.GridPanel(
		{
			title: '<img src="./resource/image/ext/application_view_list.png" align="top" class="IEPNG"><span style="font-weight:normal">装箱单管理</span>',
			height: 590,
			store: store,
			region: 'center',// 和VIEWPORT布局模型对应，充当center区域布局
			loadMask: {
				msg: '正在加载表格数据,请稍等...'
			},
			stripeRows: true,// 斑马线 True表示为显示行的分隔符（默认为true）。
			frame: true,// True表示为面板的边框外框可自定义的
			cm: cm,
			sm: sm,
			tbar: tbar,
			bbar: bbar,
			listeners: {
				render: function () {
					setColumn(cm);
					var hd_checker = this.getEl().select(
						'div.x-grid3-hd-checker');
					if (hd_checker.hasClass('x-grid3-hd-checker')) {
						hd_checker.removeClass('x-grid3-hd-checker'); // 去掉全选框
					}
				}
			}
		});

	bbar.on("change", function () {
		grid.getSelectionModel().selectFirstRow();
	});

	store.load({
		params: {
			start: 0,
			limit: bbar.pageSize
		}
	});

	grid.on('rowdblclick', function (grid, rowIndex, event) {
		var record = grid.getSelectionModel().getSelected();
		if (Ext.isEmpty(record)) {
			Ext.Msg.alert('提示:', '请先选中项目');
			return;
		}
		Ext.getCmp('prod_box_no').setValue(record.get("prod_box_no"));
		Ext.getCmp('prod_box_no').setReadOnly(true);
		Ext.getCmp('ord_seq_no').setValue(record.get("ord_seq_no"));
		Ext.getCmp('batch').setValue(record.get("batch"));
		prodBox_flag = 'update';
		dataStore.load({
			params: {
				prod_box_no: record.get("prod_box_no")
			}
		});
		codeWindow.show();
	});

	var empTab = new Ext.TabPanel({
		region: 'center',
		collapsed: false,
		deferredRender: false,
		layoutOnTabChange: true,
		activeTab: 0,
		autoScroll: true,
		items: [ prodBoxPanel ]
	});

	codeWindow = new Ext.Window({
		layout: 'fit',
		width: 1360,
		height: 400,
		resizable: false,
		draggable: true,
		title: '<span style="font-weight:normal">新增装箱单 <span>' + rs,
		iconCls: 'page_addIcon',
		modal: true,
		closeAction: 'hide',
		closable: true,
		collapsible: false,
		titleCollapse: true,
		maximizable: false,
		maximized: true,
		labelAlign: 'center',
		buttonAlign: 'center',
		border: false,
		animCollapse: true,
		animateTarget: Ext.getBody(),
		constrain: true,
		items: [ empTab ]
	});

	/**
	 * 布局
	 */
	var viewport = new Ext.Viewport({
		layout: 'border',
		items: [
			{
				region: 'center',
				layout: 'fit',
				items: [ grid ]
			}
		]
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
		codeWindow.show();
		//把记录传到panel
		boxsPanel.getForm().loadRecord(record);
		//把上传的附件转化成store传到panel
		tabid = empTab.getActiveTab().id;
	}

	// 删除数据
	function deleteProdBoxData() {
		var record = grid.getSelectionModel().getSelected();
		if (Ext.isEmpty(record)) {
			Ext.MessageBox.alert('提示', '您没有选中任何数据!');
			return;
		}
		// 获得选中数据后则可以传入后台继续处理
		Ext.Msg.confirm('请确认', '确认删除选中的装箱单信息吗?', function (btn, text) {
			if (btn == 'yes') {
				Ext.Ajax.request({
					url: 'manageProdBox.ered?reqCode=deleteProdBoxInfo',
					success: function (response) {
						var resultArray = Ext.util.JSON.decode(response.responseText);
						Ext.Msg.alert('提示', resultArray.msg);
						store.reload();
					},
					failure: function (response) {
						var resultArray = Ext.util.JSON.decode(response.responseText);
						Ext.MessageBox.alert('提示', resultArray.msg);
					},
					params: {
						prod_box_no: record.get('prod_box_no').toString()
					}
				});
			}
		});
	}

});