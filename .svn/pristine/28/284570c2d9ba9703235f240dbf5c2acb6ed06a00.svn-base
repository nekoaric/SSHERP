/************************************************
 * 创建日期: 2013-04-10
 * 创建作者：tangfh
 * 功能：订单管理
 * 最后修改时间：
 * 修改记录：
 *************************************************/

Ext.onReady(function () {
	var re = '<span style="color:red">*</span>'
	var rs = '<span style="color:Red">(*为必填项)</span>'
	var base_flag;

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
		width: 140
	}, {
		header: '订单号',
		dataIndex: 'order_id',
		align: 'center',
		width: 140,
		sortable: true
	}, {
		header: '客户',
		dataIndex: 'cust_id',
		hidden: true,
		align: 'center',
		width: 60
	}, {
		header: '客户名称',
		dataIndex: 'cust_name',
		align: 'center',
		width: 60
	}, {
		header: '订单日期',
		dataIndex: 'order_date',
		align: 'center',
		width: 80
	}, {
		header: '品牌',
		dataIndex: 'brand',
		align: 'center',
		width: 60
	}, {
		header: '款号',
		dataIndex: 'style_no',
		align: 'center',
		width: 60
	}, {
		header: '合同号',
		dataIndex: 'contract_id',
		align: 'center',
		width: 60
	}, {
		header: '品名',
		dataIndex: 'article',
		align: 'center',
		width: 90,
		sortable: true
	}, {
		header: '类型',
		dataIndex: 'classify',
		align: 'center',
		width: 90,
		sortable: true
	}, {
		header: '面料',
		dataIndex: 'material',
		align: 'center',
		width: 160,
		sortable: true
	}, {
		header: '溢短装%',
		dataIndex: 'percent',
		align: 'center',
		width: 100,
		sortable: true
	}, {
		header: '数量',
		dataIndex: 'order_num',
		align: 'center',
		width: 60,
		sortable: true
	}, {
		header: '交货日期',
		dataIndex: 'deli_date',
		align: 'center',
		sortable: true,
		width: 90
	}, {
		header: '业务跟单',
		dataIndex: 'merchandier',
		align: 'center',
		width: 120,
		sortable: true
	}, {
		header: '批复人',
		dataIndex: 'approved',
		align: 'center',
		width: 90,
		sortable: true
	}, {
		header: '数量分配',
		dataIndex: 'assign_num',
		align: 'center',
		width: 60,
		sortable: true
	}, {
		header: '装箱指示',
		dataIndex: 'box_ins',
		align: 'center',
		hidden: true,
		width: 120,
		sortable: true
	}, {
		header: '要点说明',
		dataIndex: 'point_notes',
		align: 'center',
		hidden: true,
		width: 60,
		sortable: true
	}, {
		header: '款式图',
		dataIndex: 'style_drawing',
		align: 'center',
		hidden: true,
		width: 90,
		sortable: true
	}, {
		header: '尺寸表',
		dataIndex: 'size_chart',
		align: 'center',
		hidden: true,
		width: 90,
		sortable: true
	}, {
		header: '辅料清单及说明',
		dataIndex: 'accessory_list',
		align: 'center',
		hidden: true,
		width: 120,
		sortable: true
	}, {
		header: '工序定额表',
		dataIndex: 'process_quota',
		align: 'center',
		hidden: true,
		width: 120,
		sortable: true
	}, {
		header: '工艺说明书',
		dataIndex: 'process_desc',
		align: 'center',
		hidden: true,
		width: 60,
		sortable: true
	}, {
		header: '纸样推码',
		dataIndex: 'pattern_code',
		align: 'center',
		hidden: true,
		width: 60,
		sortable: true
	}, {
		header: '埋价审核',
		dataIndex: 'verify',
		align: 'center',
		hidden: true,
		width: 60,
		sortable: true
	}, {
		header: '订单计划',
		dataIndex: 'prod_plan',
		align: 'center',
		hidden: true,
		width: 60,
		sortable: true
	}, {
		header: '数量明细清单',
		dataIndex: 'num_detail_list',
		align: 'left',
		hidden: true,
		width: 60,
		sortable: true
	}, {
		header: '订单状态',
		dataIndex: 'state',
		align: 'center',
		width: 60,
		sortable: true,
		renderer: function (value) {
			if (value == '0')
				return '正常';
			else if (value == '1')
				return '撤销';
		}
	} ]);
	/**
	 * 数据存储
	 */
	var store = new Ext.data.Store({
		// 获取数据的方式
		proxy: new Ext.data.HttpProxy({
			url: './ordBas.ered?reqCode=queryOrdBasInfo'
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
				name: 'order_date'
			},
			{
				name: 'cust_id'
			},
			{
				name: 'cust_name'
			},
			{
				name: 'brand'
			},
			{
				name: 'contract_id'
			},
			{
				name: 'order_id'
			},
			{
				name: 'style_no'
			},
			{
				name: 'article'
			},
			{
				name: 'classify'
			},
			{
				name: 'material'
			},
			{
				name: 'order_num'
			},
			{
				name: 'percent'
			},
			{
				name: 'deli_date'
			},
			{
				name: 'merchandier'
			},
			{
				name: 'approved'
			},
			{
				name: 'assign_num'
			},
			{
				name: 'box_ins'
			},
			{
				name: 'point_notes'
			},
			{
				name: 'style_drawing'
			},
			{
				name: 'size_chart'
			},
			{
				name: 'accessory_list'
			},
			{
				name: 'process_quota'
			},
			{
				name: 'process_desc'
			},
			{
				name: 'pattern_code'
			},
			{
				name: 'verify'
			},
			{
				name: 'prod_plan'
			},
			{
				name: 'num_detail_list'
			},
			{
				name: 'state'
			}
		])
	});

	store.on('beforeload', function () {
		this.baseParams = {};
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

	// 表格工具栏
	var tbar = new Ext.Toolbar({
		items: [
			{
				text: '新增',
				id: 'new_button',
				iconCls: 'page_addIcon',
				handler: function () {
					if (tabid == "basePanel_id") {
						dataStore.removeAll();
						clearForm(basePanel.getForm());
					}
					codeWindow.show();
				}
			},
			'-',
			{
				text: '修改',
				id: 'modify_button',
				iconCls: 'page_edit_1Icon',
				handler: function () {
					updateOrdBasDataInit();
				}
			},
			'-',
			{
				text: '删除',
				id: 'delete_button',
				iconCls: 'page_delIcon',
				handler: function () {
					deleteOrdBasData();
				}
			},
			'-',
			{
				text: '打印/导出',
				id: 'submit_button',
				iconCls: 'page_edit_1Icon',
				handler: function () {
					exportExcel('./ordBas.ered?reqCode=excleOrderInfoAction');
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
			},
			'->',
			new Ext.form.NumberField({
				id: 'orderId',
				name: 'order_id',
				emptyText: '请输入订单号',
				enableKeyEvents: true,
				listeners: {
					specialkey: function (field, e) {
						if (e.getKey() == Ext.EventObject.ENTER) {
							queryOrdItem();
						}
					}
				},
				width: 130
			}),
			new Ext.form.TextField({
				id: 'cust_name',
				name: 'cust_name',
				emptyText: '请输入客户名称',
				enableKeyEvents: true,
				listeners: {
					specialkey: function (field, e) {
						if (e.getKey() == Ext.EventObject.ENTER) {
							queryOrdItem();
						}
					}
				},
				width: 130
			}),
			{
				text: '查询',
				iconCls: 'page_findIcon',
				handler: function () {
					queryOrdItem();
				}
			}
		]
	});
	var grid = new Ext.grid.GridPanel(
		{
			title: '<img src="./resource/image/ext/application_view_list.png" align="top" class="IEPNG"><span style="font-weight:normal">订单管理</span>',
			renderTo: 'gridDiv',
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
		updateOrdBasDataInit();
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
	function updateOrdBasDataInit() {
		var record = grid.getSelectionModel().getSelected();
		if (Ext.isEmpty(record)) {
			Ext.MessageBox.alert('提示', '您没有选中任何数据!');
			return;
		}
		codeWindow.show();
		//把记录传到panel
		basePanel.getForm().loadRecord(record);
		//把上传的附件转化成store传到panel
		tabid = empTab.getActiveTab().id;
		if (tabid == "basePanel_id") {
			dataStore.removeAll();
			if (record.get('box_ins').toString() == ' '
				|| record.get('box_ins').toString() == '') {

			} else {
				var p = new Ext.data.Record({
					item: 0,
					file: record.get('box_ins').toString()
				});
				dataStore.add(p);
			}
			if (record.get('point_notes').toString() == ' '
				|| record.get('point_notes').toString() == '') {

			} else {
				var p = new Ext.data.Record({
					item: 1,
					file: record.get('point_notes').toString()
				});
				dataStore.add(p);
			}
			if (record.get('style_drawing').toString() == ' '
				|| record.get('style_drawing').toString() == '') {

			} else {
				var p = new Ext.data.Record({
					item: 2,
					file: record.get('style_drawing').toString()
				});
				dataStore.add(p);
			}
			if (record.get('size_chart').toString() == ' '
				|| record.get('size_chart').toString() == '') {

			} else {
				var p = new Ext.data.Record({
					item: 3,
					file: record.get('size_chart').toString()
				});
				dataStore.add(p);
			}
			if (record.get('accessory_list').toString() == ' '
				|| record.get('accessory_list').toString() == '') {
			} else {
				var p = new Ext.data.Record({
					item: 4,
					file: record.get('accessory_list').toString()
				});
				dataStore.add(p);
			}
			if (record.get('process_quota').toString() == ' '
				|| record.get('process_quota').toString() == '') {

			} else {
				var p = new Ext.data.Record({
					item: 5,
					file: record.get('process_quota').toString()
				});
				dataStore.add(p);
			}
			if (record.get('process_desc').toString() == ' '
				|| record.get('process_desc').toString() == '') {

			} else {
				var p = new Ext.data.Record({
					item: 6,
					file: record.get('process_desc').toString()
				});
				dataStore.add(p);
			}
			if (record.get('pattern_code').toString() == ' '
				|| record.get('pattern_code').toString() == '') {

			} else {
				var p = new Ext.data.Record({
					item: 7,
					file: record.get('pattern_code').toString()
				});
				dataStore.add(p);
			}
			if (record.get('verify').toString() == ' '
				|| record.get('verify').toString() == '') {

			} else {
				var p = new Ext.data.Record({
					item: 8,
					file: record.get('verify').toString()
				});
				dataStore.add(p);
			}
			if (record.get('prod_plan').toString() == ' '
				|| record.get('prod_plan').toString() == '') {

			} else {
				var p = new Ext.data.Record({
					item: 9,
					file: record.get('prod_plan').toString()
				});
				dataStore.add(p);
			}
			if (record.get('num_detail_list').toString() == ' '
				|| record.get('num_detail_list').toString() == '') {

			} else {
				var p = new Ext.data.Record({
					item: 10,
					file: record.get('num_detail_list').toString()
				});
				dataStore.add(p);
			}
		}

	}

	/**
	 * 根据条件查询订单
	 */
	function queryOrdItem() {
		store.load({
			params: {
				start: 0,
				limit: bbar.pageSize,
				order_id: Ext.getCmp('orderId').getValue(),
				cust_name: Ext.getCmp('cust_name').getValue()
			}
		});
	}

	// 删除数据
	function deleteOrdBasData() {
		var record = grid.getSelectionModel().getSelected();
		if (Ext.isEmpty(record)) {
			Ext.MessageBox.alert('提示', '您没有选中任何数据!');
			return;
		}
		// 获得选中数据后则可以传入后台继续处理
		Ext.Msg.confirm('请确认', '确认删除选中的订单信息吗?', function (btn, text) {
			if (btn == 'yes') {
				Ext.Ajax.request({
					url: 'ordBas.ered?reqCode=deleteClothBasInfoAction',
					success: function (response) {
						var resultArray = Ext.util.JSON
							.decode(response.responseText);
						Ext.Msg.alert('提示', resultArray.msg);
						store.reload();
					},
					failure: function (response) {
						Ext.MessageBox.alert('提示', resultArray.msg);
					},
					params: {
						seq_no: record.get('seq_no').toString()
					}
				});
			}
		});
	}

	// 定义列模型
	var basesm = new Ext.grid.CheckboxSelectionModel({
		singleSelect: false
	});
	var dataStore = new Ext.data.Store({});
	var basecm = new Ext.grid.ColumnModel([ basesm, {
		header: '项目',
		dataIndex: 'item',
		align: 'center',
		width: 130,
		renderer: function (value) {
			if (value == '0')
				return '装箱指示';
			else if (value == '1')
				return '要点说明';
			else if (value == '2')
				return '款式图';
			else if (value == '3')
				return '尺寸表';
			else if (value == '4')
				return '辅料清单及说明';
			else if (value == '5')
				return '工序定额表';
			else if (value == '6')
				return '工艺说明书';
			else if (value == '7')
				return '纸样推码';
			else if (value == '8')
				return '埋架审核';
			else if (value == '9')
				return '生产计划';
			else if (value == '10')
				return '数量明细清单';
		}
	}, {
		header: '附件',
		dataIndex: 'file',
		align: 'center',
		width: 130,
		//	hidden : true,
		sortable: true
	} ]);

	// 表格工具栏
	var basetbar = new Ext.Toolbar({
		items: [
			{
				text: '添加附件',
				id: 'base_submit_button',
				iconCls: 'page_edit_1Icon',
				handler: function () {
					base_flag = 'add';
					baseWindow.show();
				}
			},
			'-',
			{
				text: '取消附件',
				id: 'base_cancel_button',
				iconCls: 'page_edit_1Icon',
				handler: function () {
					deleteData();
				}
			},
			'-',
			{
				text: '下载附件',
				id: 'base_down_button',
				iconCls: 'page_edit_1Icon',
				handler: function () {
					enterOrdDownForm();
				}
			}
		]
	});

	// 表格实例
	var baseGrid = new Ext.grid.GridPanel({
		title: '<span style="font-weight:normal">附件上传</span>',
		height: 500,
		autoScroll: true,
		frame: true,
		region: 'center', // 和VIEWPORT布局模型对应，充当center区域布局
		store: dataStore, // 数据存储
		stripeRows: true, // 斑马线
		cm: basecm, // 列模型
		sm: basesm,
		tbar: basetbar, // 表格工具栏
		viewConfig: {
			forceFit: true
		},
		loadMask: {
			msg: '正在加载表格数据,请稍等...'
		}
	});

	baseGrid.on('rowdblclick', function (grid, rowIndex, event) {
		var record = grid.getSelectionModel().getSelected();
		if (Ext.isEmpty(record)) {
			Ext.Msg.alert('提示:', '请先选中项目');
			return;
		}
		base_flag = 'modify';
	});

	/**
	 * 客户下拉框
	 */
	var custStore = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: './ordBas.ered?reqCode=getCustIdCombox'
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
	custStore.load();

	var custCombo = new Ext.form.ComboBox({
		name: 'cust_id',
		hiddenName: 'cust_id',
		store: custStore,
		mode: 'local',
		triggerAction: 'all',
		valueField: 'value',
		displayField: 'text',
		fieldLabel: '客户' + re,
		emptyText: '请选择...',
		allowBlank: false,
		forceSelection: false,
		editable: true,
		typeAhead: true,
		anchor: "84%"
	});

	var ordersPanel = new Ext.Panel({
		title: "订单资料",
		layout: "form",
		region: 'center',
		labelAlign: "right",
		labelWidth: 70,
		height: 180,
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
								fieldLabel: "订单号" + re,
								allowBlank: false,
								id: 'order_id',
								name: 'order_id',
								anchor: "84%"
							},
							{
								fieldLabel: '订单时间'+re,
								xtype: 'datefield',
								name: 'order_date',
								id: 'order_date',
								format: 'Y-m-d', // 日期格式化
								editable: false,
								anchor: '84%',
								allowBlank: false
							},
							custCombo,
							{
								xtype: 'datefield',
								fieldLabel: '交货日期' + re,
								name: 'deli_date',
								id: 'deli_date',
								allowBlank: false,
								editable: false,
								format: 'Y-m-d', // 日期格式化
								maxLength: 128,
								anchor: '84%'
							}
						]
					},
					{
						columnWidth: 0.5,
						layout: 'form',
						labelWidth: 70, // 标签宽度
						border: false,
						items: [
							{
								xtype: "textfield",
								fieldLabel: "合同号" + re,
								allowBlank: false,
								id: 'contract_id',
								name: 'contract_id',
								anchor: "84%"
							},
							{
								xtype: "textfield",
								fieldLabel: "数量" + re,
								allowBlank: false,
								id: 'order_num',
								name: 'order_num',
								anchor: "84%"
							},
							{
								xtype: "textfield",
								fieldLabel: "业务跟单" + re,
								allowBlank: false,
								id: 'merchandier',
								name: 'merchandier',
								anchor: "84%"
							},
							{
								xtype: "textfield",
								fieldLabel: "批复人" + re,
								allowBlank: false,
								id: 'approved',
								name: 'approved',
								anchor: "84%"
							}
						]
					}
				]
			}

		]
	});

	var clothPanel = new Ext.Panel({
		title: "服装资料",
		border: false,
		layout: "form",
		region: 'east',
		labelAlign: "right",
		labelWidth: 70,
		height: 180,
		frame: true,
		items: [
			{
				layout: 'column',
				border: false,
				items: [
					{
						columnWidth: 0.5,
						layout: 'form',
						labelWidth: 70, // 标签宽度
						border: false,
						items: [
							{
								xtype: "textfield",
								fieldLabel: "品名",
								id: 'article',
								name: 'article',
								anchor: "84%"
							},
							{
								xtype: "textfield",
								fieldLabel: "类型",
								id: 'classify',
								name: 'classify',
								anchor: "84%"
							},
							{
								xtype: "textfield",
								fieldLabel: "款号",
								id: 'style_no',
								name: 'style_no',
								anchor: "84%"
							},
							{
								xtype: "textfield",
								fieldLabel: "数量分配",
								id: 'assign_num',
								name: 'assign_num',
								anchor: "84%"
							}
						]
					},
					{
						columnWidth: 0.5,
						layout: 'form',
						labelWidth: 70, // 标签宽度
						border: false,
						items: [
							{
								xtype: "textfield",
								fieldLabel: "品牌",
								id: 'brand',
								anchor: "84%"
							},
							{
								xtype: "textfield",
								fieldLabel: "面料",
								id: 'material',
								name: 'material',
								anchor: "84%"
							},
							{
								xtype: "textfield",
								fieldLabel: "溢短装%",
								id: 'percent',
								name: 'percent',
								anchor: "84%"
							},
							{
								xtype: "textfield",
								hidden: true,
								id: 'seq_no',
								name: 'seq_no',
								anchor: "84%"
							}
						]
					}
				]
			}
		]
	});

	/**
	 * 项目下拉框
	 */
	var itemStore = new Ext.data.SimpleStore({
		fields: [ 'value', 'text' ],
		data: [
			[ '0', '装箱指示' ],
			[ '1', '要点说明' ],
			[ '2', '款式图' ],
			[ '3', '尺寸表' ],
			[ '4', '辅料清单及说明' ],
			[ '5', '工序定额表' ],
			[ '6', '工艺说明书' ],
			[ '7', '纸样推码' ],
			[ '8', '埋架审核' ],
			[ '9', '生产计划' ],
			[ '10', '数量明细清单' ]
		]
	});
	var itemCombo = new Ext.form.ComboBox({
		name: 'item',
		hiddenName: 'item',
		id: 'items',
		store: itemStore,
		mode: 'local',
		triggerAction: 'all',
		valueField: 'value',
		displayField: 'text',
		value: '0',
		fieldLabel: '附件项目',
		emptyText: '请选择...',
		allowBlank: true,
		forceSelection: true,
		editable: false,
		typeAhead: true,
		anchor: "95%"
	});

	/**
	 * 窗口实例
	 */
	var addFormPanel = new Ext.form.FormPanel({
		labelAlign: 'right',
		labelWidth: 80,
		frame: true,
		id: 'addFormPanel',
		name: 'addFormPanel',
		fileUpload: true,
		items: [
			{
				layout: 'column',
				items: [
					{
						columnWidth: 1,
						layout: 'form',
						defaultType: 'textfield',
						items: [ itemCombo, new Ext.ux.form.FileUploadField({
							fieldLabel: '请选择上传文件',
							buttonText: '上传',
							name: 'theFile',
							id: 'EmpInfoTheFile',
							blankText: "上传文件",
							anchor: '94%'
						}) ]
					}
				]
			}
		]
	});

	// addData－－新增数据窗口
	var baseWindow = new Ext.Window({
		layout: 'fit',
		width: 330,
		height: 170,
		resizable: false,
		draggable: false,
		closeAction: 'hide',
		title: '上传附件',
		iconCls: 'page_addIcon',
		modal: true,
		//collapsible : true,
		titleCollapse: true,
		maximizable: false,
		buttonAlign: 'right',
		border: false,
		animCollapse: true,
		animateTarget: Ext.getBody(),
		constrain: true,
		items: [ addFormPanel ], // 嵌入的表单面板
		buttons: [
			{
				text: '保存',
				iconCls: 'acceptIcon',
				handler: function () {
					enterAddForm();
				}
			},
			{
				text: '重置',
				iconCls: 'tbar_synchronizeIcon',
				handler: function () {
					clearForm(addFormPanel.getForm());
				}
			},
			{
				text: '关闭',
				iconCls: 'deleteIcon',
				handler: function () {
					baseWindow.hide();
				}
			}
		]
	});

	var orderPanel = new Ext.Panel({
		layout: "border",
		height: 200,
		frame: true,
		items: [
			{
				region: 'east',
				width: 700,
				items: [ clothPanel ]
			},
			{
				region: 'center',
				items: [ ordersPanel ]
			}
		]
	});

	var basePanel = new Ext.FormPanel({
		layout: 'border',
		labelAlign: 'right',
		title: '基本信息',
		id: 'basePanel_id',
		frame: true,
		name: 'basePanel',
		items: [
			{
				region: 'north',
				layout: 'fit',
				height: 160,
				items: [ orderPanel ]
			},
			{
				region: 'center',
				layout: 'fit',
				items: [ baseGrid ]
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
				iconCls: 'tbar_synchronizeIcon',
				handler: function () {
					clearForm(basePanel.getForm());
					dataStore.removeAll();
				}
			},
			{
				text: '关闭',
				iconCls: 'deleteIcon',
				handler: function () {
					Ext.getCmp('addOrdBasInfoWindow').hide();
				}
			}
		]
	});
	var empTab = new Ext.TabPanel({
		region: 'center',
		collapsed: false,
		deferredRender: false,
		layoutOnTabChange: true,
		activeTab: 0,
		autoScroll: true,
		items: [ basePanel ]
	});

	var codeWindow = new Ext.Window({
		id: 'addOrdBasInfoWindow',
		layout: 'fit',
		width: 800,
		height: 400,
		resizable: false,
		draggable: true,
		title: '<span style="font-weight:normal">新增订单<span>' + rs,
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
	 * 表单数据---确定增加
	 */
	function enterAddForm() {
		if (!addFormPanel.form.isValid())
			return;
		var p = new Ext.data.Record({
			item: Ext.getCmp('items').getValue(),
			file: Ext.getCmp('EmpInfoTheFile').getValue()
		});
		equalsData(p);
		var theFile = new String(Ext.getCmp('EmpInfoTheFile').getValue());
		if (Ext.isEmpty(theFile)) {
			Ext.Msg.alert('提示', '请先选择您要导入文件。');
			return;
		}
		addFormPanel.form.submit({
			url: './ordBas.ered?reqCode=uploadFile4CSR',
			waitTitle: '提示',
			method: 'POST',
			waitMsg: '正在处理数据,请稍候...',
			success: function (form, action) {
				Ext.MessageBox.alert('提示', action.result.msg);
				baseWindow.hide();
			},
			failure: function (form, action) {
				var msg = action.result.msg;
				Ext.MessageBox.alert('提示', '文件上传失败:<br>' + msg);
			}
		});
	}

	// 删除数据
	function deleteData() {
		var rows = baseGrid.getSelectionModel().getSelections();
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
		//	var row = dataStore.egetCount();// 行数
		var item = getString('item');
		var file = getFile('file');
		Ext.Ajax.request({
			url: './ordBas.ered?reqCode=saveOrdBasInfo',
			success: function (response) { // 回调函数有1个参数
				var resultArray = Ext.util.JSON
					.decode(response.responseText);
				Ext.Msg.alert('提示', resultArray.msg);
				dataStore.removeAll();
				clearForm(basePanel.getForm());
				Ext.getCmp('addOrdBasInfoWindow').hide();
				queryOrdItem();
			},
			failure: function (response) {
				Ext.Msg.alert('提示订单失败');
			},
			params: {
				order_id: Ext.getCmp('order_id').getValue(),
				order_date: Ext.getCmp('order_date').getValue(),
				cust_id: custCombo.getValue(),
				style_no: Ext.getCmp('style_no').getValue(),
				brand: Ext.getCmp('brand').getValue(),
				article: Ext.getCmp('article').getValue(),
				contract_id: Ext.getCmp('contract_id').getValue(),
				classify: Ext.getCmp('classify').getValue(),
				material: Ext.getCmp('material').getValue(),
				percent: Ext.getCmp('percent').getValue(),
				order_num: Ext.getCmp('order_num').getValue(),
				deli_date: Ext.getCmp('deli_date').getValue(),
				merchandier: Ext.getCmp('merchandier').getValue(),
				approved: Ext.getCmp('approved').getValue(),
				assign_num: Ext.getCmp('assign_num').getValue(),
				seq_no: Ext.getCmp('seq_no').getValue(),
				item: item,
				file: file
			}
		});
	}

	/**
	 * 表单数据---确定增加
	 */
	function enterOrdDownForm() {
		var record = baseGrid.getSelectionModel().getSelected();
		if (Ext.isEmpty(record)) {
			Ext.MessageBox.alert('提示', '您没有选中任何数据!');
			return;
		}
		seq_no = Ext.getCmp('seq_no').getValue();
		item = record.get("item").toString();
		window.location.href = './ordBas.ered?reqCode=downFileInfo&seq_no=' + seq_no + "&item=" + item;
	}

	// 比较数据
	function equalsData(record) {
		var item = record.get('item');
		var flag = -1;
		var row = dataStore.getCount();// 行数
		for (var i = 0; i < row; i++) {
			//		alert(item);
			var oldItem = dataStore.getAt(i).get('item');
			//		alert(oldItem);
			if (oldItem == item) {
				flag = i;
			}
		}
		if (flag != -1) {
			dataStore.remove(dataStore.getAt(flag));
		}
		dataStore.add(record);
		baseWindow.hide();
	}

	function getString(String) {
		var string = '';
		var row = dataStore.getCount();// 行数
		for (var i = 0; i < row; i++) {
			if (i == (row - 1)) {
				string = string + dataStore.getAt(i).get(String);
			} else {
				string = string + dataStore.getAt(i).get(String) + ',';
			}

		}
		return string;
	}

	function getFile(String) {
		var string = '';
		var row = dataStore.getCount();// 行数
		for (var i = 0; i < row; i++) {
			var data = dataStore.getAt(i).get(String);
			var file = data.split("\\");
			if (i == (row - 1)) {
				string = string + file[file.length - 1];
			} else {
				string = string + file[file.length - 1] + ',';
			}

		}
		return string;
	}

});