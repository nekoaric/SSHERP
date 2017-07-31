/************************************************
 * 创建日期: 2013-05-24
 * 创建作者：lingm
 * 功能：标签绑定
 * 最后修改时间：
 * 修改记录：
 *************************************************/
Ext.onReady(function () {
	var sm = new Ext.grid.CheckboxSelectionModel({
		singleSelect: true
	});
	// 定义自动当前页行号
	var rownum = new Ext.grid.RowNumberer({
		header: 'NO',
		width: 28
	});
	var cm = new Ext.grid.ColumnModel([sm, rownum, {
		header: '产品编号',
		width: 200,
		id: 'product_id',
		dataIndex: 'product_id'
	}, {
		header: '生产通知单序号',
		hidden: true,
		width: 100,
		dataIndex: 'prod_ord_seq'
	}, {
		header: '颜色',
		dataIndex: 'color',
		width: 100
	}, {
		header: '内长',
		dataIndex: 'in_length',
		width: 100
	}, {
		header: '腰围',
		dataIndex: 'waist',
		width: 100
	}, {
		header: '印花',
		dataIndex: 'print',
		width: 100
	}, {
		header: '水洗',
		dataIndex: 'wash',
		width: 100
	}, {
		header: '订单数',
		dataIndex: 'ord_num',
		width: 100
	}, {
		header: '指令数',
		dataIndex: 'ins_num',
		width: 100
	}, {
		header: '实际要求数量',
		dataIndex: 'real_num',
		width: 120
	}, {
		header: '裁剪数量',
		dataIndex: 'cut_num',
		width: 150
	}, {
		header: '备注',
		dataIndex: 'remark',
		width: 200
	}, {
		header: '状态',
		dataIndex: 'state',
		hidden: true,
		renderer : function(value) {
			if (value == '0')
				return '正常';
			else if (value == '1')
				return '取消';
			else
				return value;
		}
	}]);

	var store = new Ext.data.Store({
		// 获取数据的方式
		proxy: new Ext.data.HttpProxy({
			url: './manageEpc.ered?reqCode=queryProdBasInfo'
		}),
		reader: new Ext.data.JsonReader({
			totalProperty: 'TOTALCOUNT',
			root: 'ROOT'
		}, [
			{
				name: 'product_id'
			},
			{
				name: 'prod_ord_seq'
			},
			{
				name: 'epc'
			},
			{
				name: 'color'
			},
			{
				name: 'count'
			},
			{
				name: 'in_length'
			},
			{
				name: 'waist'
			},
			{
				name: 'print'
			},
			{
				name: 'wash'
			},
			{
				name: 'ord_num'
			},
			{
				name: 'ins_num'
			},
			{
				name: 'real_num'
			},
			{
				name: 'cut_num'
			},
			{
				name: 'remark'
			},
			{
				name: 'state'//以上为服装信息
			}
		])
	});

	store.on('beforeload', function () {
		this.baseParams = {
			product_id: Ext.getCmp('product_id').getValue()
		}
	});

	var pagesize_combo = new Ext.form.ComboBox({
		name: 'pagesize',
		triggerAction: 'all',
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

	var bbar = new Ext.PagingToolbar({
		pageSize: number,
		store: store,
		displayInfo: true,
		displayMsg: '显示{0}条到{1}条,共{2}条',
		plugins: new Ext.ux.ProgressBarPager(), // 分页进度条
		emptyMsg: "没有符合条件的记录",
		items: ['-', '&nbsp;&nbsp;', pagesize_combo]
	});

	// 表格工具栏
	var tbar = new Ext.Toolbar({
		items: [
			{
				text: '绑定',
				id: 'fk_button',
				iconCls: 'addIcon',
				disabled: true,
				handler: function () {
					writeCrdCatalogItem();
				}
			},
			'->',
			'产品编号：',
			{
				fieldLabel: '产品编号',
				name: 'product_id',
				id: 'product_id',
				width: 100,
				xtype: 'textfield', //
				allowBlank: true, // 是否允许为空
				maxLength: 50, // 可输入的最大文本长度,不区分中英文字符
				anchor: '100%' // 宽度百分比
			},
			{
				text: '查询',
				iconCls: 'previewIcon',
				xtype: "button",
				handler: function () {
					queryRewritecrdInfoDatas();
				}
			},
			{
				text: '查看详情',
				id: 'showDetail',
				iconCls: 'arrow_refreshIcon',
				handler: function () {
					showDetail();
				}
			}
		]
	});

	var grid = new Ext.grid.GridPanel({
		// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
		title: '<span style="font-weight:normal">服装绑定信息</span>',
		height: 500,
		autoScroll: true,
		frame: true,
		region: 'center', // 和VIEWPORT布局模型对应，充当center区域布局
		store: store, // 数据存储
		stripeRows: true, // 斑马线
		cm: cm, // 列模型
		sm: sm,
		tbar: tbar, // 表格工具栏
		bbar: bbar,// 分页工具栏
		viewConfig: {
		},
		loadMask: {
			msg: '正在加载表格数据,请稍等...'
		}
	});

	// 监听行选中事件
	grid.on('rowclick', function (pGrid, rowIndex, event) {
		Ext.getCmp('fk_button').enable();
	});

	grid.on('rowdblclick', function (grid, rowIndex, event) {
		writeCrdCatalogItem();
	});

	var rownum_xq = new Ext.grid.RowNumberer({
		header: 'NO',
		width: 28
	});
	// 定义列模型
	var cm_xq = new Ext.grid.ColumnModel([rownum_xq, {
		header: 'TID',
		width: 300,
		dataIndex: 'tid'
	}, {
		header: '标签编号',
		width: 200,
		dataIndex: 'epc'
	}, {
		header: '产品编号',
		hidden: true,
		width: 100,
		dataIndex: 'product_id'
	}, {
		header: '绑定人员',
		dataIndex: 'user_name',
		width: 100
	}, {
		header: '绑定日期',
		dataIndex: 'opr_date',
		width: 100
	}, {
		header: '状态',
		dataIndex: 'state',
		width: 100
	}]);
	/**
	 * 数据存储
	 */
	var store_xq = new Ext.data.Store({
		// 获取数据的方式
		proxy: new Ext.data.HttpProxy({
			url: './manageEpc.ered?reqCode=queryProdBasDetailInfo'
		}),
		reader: new Ext.data.JsonReader({
			totalProperty: 'TOTALCOUNT',
			root: 'ROOT'
		}, [
			{
				name: 'product_id'
			},
			{
				name: 'seq_no'
			},
			{
				name: 'tid'
			},
			{
				name: 'epc'
			},
			{
				name: 'user_name'
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

	store_xq.on('beforeload', function () {
		var record = grid.getSelectionModel().getSelected();
		this.baseParams = {
			product_id: record.get('product_id')

		}
	});
	// 每页显示条数下拉选择框
	var pagesize_combo_xq = new Ext.form.ComboBox({
		name: 'pagesize_xq',
		triggerAction: 'all',
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
	var number_xq = parseInt(pagesize_combo_xq.getValue());
	// 改变每页显示条数reload数据
	pagesize_combo_xq.on("select", function (comboBox) {
		bbar_xq.pageSize_xq = parseInt(comboBox.getValue());
		number_xq = parseInt(comboBox.getValue());
		store_xq.reload({
			params: {
				start: 0,
				limit: bbar_xq.pageSize
			}
		});
	});
	// 分页工具栏
	var bbar_xq = new Ext.PagingToolbar({
		pageSize: number_xq,
		store: store_xq,
		displayInfo: true,
		displayMsg: '显示{0}条到{1}条,共{2}条',
		plugins: new Ext.ux.ProgressBarPager(), // 分页进度条
		emptyMsg: "没有符合条件的记录",
		items: ['-', '&nbsp;&nbsp;', pagesize_combo_xq]
	});
	// 表格实例
	var grid_xq = new Ext.grid.GridPanel({
		// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
		title: '<span style="font-weight:normal">服装绑定信息</span>',
		height: 500,
		autoScroll: true,
		frame: true,
		region: 'center', // 和VIEWPORT布局模型对应，充当center区域布局
		store: store_xq, // 数据存储
		stripeRows: true, // 斑马线
		cm: cm_xq, // 列模型
		//tbar : tbar_xq, // 表格工具栏
		bbar: bbar_xq,// 分页工具栏
		viewConfig: {
		},
		loadMask: {
			msg: '正在加载表格数据,请稍等...'
		}
	});

	var writeCrdForm = new Ext.form.FormPanel({
		collapsible: false,
		border: true,
		labelWidth: 110, // 标签宽度
		// frame : true, //是否渲染表单面板背景色
		labelAlign: 'right', // 标签对齐方式
		bodyStyle: 'padding:5 5 0', // 表单元素和表单面板的边距
		buttonAlign: 'center',
		height: 300,
		items: [
			{
				xtype: "panel",
				title: "服装信息",
				height: 185,
				layout: "column",
				width: 842,
				items: [
					{
						xtype: "panel",
						title: "",
						width: 260,
						height: 300,
						border: false,
						padding: "3px",
						layout: "form",
						defaults: {
							xtype: "textfield",
							readOnly: true,
							anchor: "100%"
						},
						items: [
							{
								fieldLabel: "生产通知单序号",
								name: "prod_ord_seq",
								readOnly: true,
								fieldClass: 'x-custom-field-disabled'
							},
							{
								fieldLabel: "颜色",
								name: "color",
								readOnly: true,
								fieldClass: 'x-custom-field-disabled'
							},
							{
								fieldLabel: "内长",
								name: "in_length",
								readOnly: true,
								fieldClass: 'x-custom-field-disabled'
							},
							{
								fieldLabel: "腰围",
								name: "waist",
								readOnly: true,
								fieldClass: 'x-custom-field-disabled'
							}
						]
					},
					{
						xtype: "panel",
						title: "",
						width: 260,
						height: 300,
						border: false,
						layout: "form",
						padding: "3px",
						defaults: {
							xtype: "textfield",
							readOnly: true,
							anchor: "100%"
						},
						items: [
							{
								name: "product_id",
								readOnly: true,
								fieldLabel: "产品编号",
								fieldClass: 'x-custom-field-disabled'
							},{
								fieldLabel: "印花",
								name: "print",
								readOnly: true,
								fieldClass: 'x-custom-field-disabled'
							},
							{
								fieldLabel: "水洗",
								name: "wash",
								readOnly: true,
								fieldClass: 'x-custom-field-disabled'
							},
							{
								fieldLabel: "备注",
								name: "remark",
								readOnly: true,
								fieldClass: 'x-custom-field-disabled'
							}
						]
					},
					{
						xtype: "panel",
						title: "",
						width: 260,
						height: 300,
						border: false,
						layout: "form",
						padding: "3px",
						defaults: {
							xtype: "textfield",
							readOnly: true,
							anchor: "100%"
						},
						items: [
							{
								fieldLabel: "订单数",
								name: "ord_num",
								readOnly: true,

								fieldClass: 'x-custom-field-disabled'
							},
							{
								fieldLabel: "指令数",
								name: "ins_num",
								readOnly: true,

								fieldClass: 'x-custom-field-disabled'
							},
							{
								fieldLabel: "实际要求数量",
								name: "real_num",
								readOnly: true,

								fieldClass: 'x-custom-field-disabled'
							},
							{
								fieldLabel: "状态",
								name: "state",
								id:'state',
								fieldClass: 'x-custom-field-disabled',
								readOnly: true
							
							}
						]
					}
				]
			},
			{
				xtype: "panel",
				title: "写卡信息",
				height: 60,
				layout: "column",
				width: 842,
				items: [
					{
						columnWidth: 0.40,
						layout: 'form',
						padding: "3px",
						defaultType: 'textfield',
						border: false,
						items: [
							{
								name: "tid",
								hidden:true,
								id: 'tid',
//								fieldLabel: "TID",
								xtype: "textfield",
								fieldClass: 'x-custom-field-disabled'
							}
						]
					},
					{
						columnWidth: 0.40,
						layout: 'form',
						padding: "3px",
						defaultType: 'textfield',
						border: false,
						items: [
							{
								fieldLabel: "标签编号",
								name: "epc",
								id: "epc",
								xtype: "textfield",
								fieldClass: 'x-custom-field-disabled'
							}
						]
					}
				]
			}
		]
	});

	var writeDetailWindow = new Ext.Window({
		title: '<span style="font-weight:normal">绑定信息详情<span>', // 窗口标题
		layout: 'fit', // 设置窗口布局模式
		width: 880, // 窗口宽度
		height: 330, // 窗口高度
		closable: true, // 是否可关闭
		collapsible: false, // 是否可收缩
		maximizable: false, // 设置是否可以最大化
		border: false, // 边框线设置
		constrain: true, // 设置窗口是否可以溢出父容器
		animateTarget: Ext.getBody(),
		items: [grid_xq], // 嵌入的表单面板
		buttons: [
			{
				text: '关闭',
				iconCls: 'deleteIcon',
				handler: function () {
					writeDetailWindow.hide();
					store.reload();
				}
			}
		]
	});

	var writeCrdWindow = new Ext.Window({
		title: '<span style="font-weight:normal">绑定信息<span>', // 窗口标题
		layout: 'fit', // 设置窗口布局模式
		width: 880, // 窗口宽度
		height: 330, // 窗口高度
		closable: false, // 是否可关闭
		collapsible: true, // 是否可收缩
		maximizable: true, // 设置是否可以最大化
		border: false, // 边框线设置
		constrain: true, // 设置窗口是否可以溢出父容器
		animateTarget: Ext.getBody(),
		items: [writeCrdForm], // 嵌入的表单面板
		buttons: [
			{
				text: '绑定',
				iconCls: 'acceptIcon',
				handler: function () {
					writeCardInfo();
				}
			},
			{
				text: '关闭',
				iconCls: 'deleteIcon',
				handler: function () {
					writeCrdForm.getForm().reset();
					writeCrdForm.getForm().remove();
					writeCrdWindow.hide();
					store.reload();
				}
			}
		]
	});

	var selectTab = new Ext.Panel({
		title: '<img src="./resource/image/ext/config.png" align="top" class="IEPNG">服装绑定',
		titleCollapse: false,
		id: 'selectTab',
		floating: false,
		layout: 'border',
		region: 'center',
		items: [
			{
				region: 'center',
				layout: 'fit',
				items: [grid]
			}
		]
	});

	var tabPanel = new Ext.TabPanel({
		activeTab: 0,
		id: 'tab',
		items: [selectTab]
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
				id: 'center',
				items: [ tabPanel ]
			}
		]
	});

	store.reload({
		params: {
			start: 0,
			limit: bbar.pageSize
		}
	});
	/**
	 * 查询项目列表
	 */
	function queryRewritecrdInfoDatas() {
		store.load({
			params: {
				product_id: Ext.getCmp('product_id').getValue(),
				start: 0,
				limit: bbar.pageSize
			}
		});
	}

	function writeCardInfo() {
//		if(Ext.isEmpty(Ext.getCmp('tid').getValue())){
			var rfid = ReadTidCode();
			if (rfid.state != '0') {
				Ext.Msg.alert('提示', rfid.returnCode);
				return;
			}
			Ext.getCmp('tid').setValue(rfid.returnCode);
//		}

		writeCrdForm.getForm().submit({
			url: './manageEpc.ered?reqCode=saveProdBasInfo',
			waitTitle: '提示',
			method: 'POST',
			waitMsg: '正在处理数据,请稍候...',
			success: function (form, action) {
				var epc = action.result.epc;
				Ext.getCmp('epc').setValue(epc);
				rfid = WriteEpcCode(epc);
				if (rfid.state != '0') {
//					Ext.Msg.alert("提示", rfid.returnCode);
//					//todo 失败时撤销记录
				} else {
					Ext.Msg.alert("提示", '绑定成功!');
				}
			},
			failure: function (form, action) {
				Ext.Msg.alert('提示', action.result.msg);
			}
		});
	}

	function writeCrdCatalogItem() {
		var record = grid.getSelectionModel().getSelected();
		if (Ext.isEmpty(record)) {
			Ext.Msg.alert('提示:', '请先选中记录');
			return;
		}
		Ext.getCmp('fk_button').disable();

		writeCrdForm.getForm().loadRecord(record);
		if(record.get('state')=='0'){
			Ext.getCmp('state').setValue('正常');
		}else if(record.get('state')=='1'){
			Ext.getCmp('state').setValue('取消');
		}
		writeCrdWindow.show(); // 显示窗口
	}

	//显示详细绑定信息
	function showDetail() {
		var record = grid.getSelectionModel().getSelected();

		if (Ext.isEmpty(record)) {
			Ext.Msg.alert('提示:', '请先选中记录');
			return;
		}
		store_xq.load({
			params: {
				product_id: record.get('product_id')
			}
		});
		writeDetailWindow.show();
	}

	//监听按钮点击事件
	function document.onkeydown(){
		if (event.keyCode == 13) {
			if (writeCrdWindow.isVisible()) {
				writeCardInfo();
			}
		}
	}

});