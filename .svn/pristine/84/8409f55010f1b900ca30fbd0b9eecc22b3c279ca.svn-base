/************************************************
 * 创建日期: 2013-05-26
 * 创建作者：lingm
 * 功能：RFID解绑
 * 最后修改时间：
 * 修改记录：
 *************************************************/

Ext.onReady(function () {
	// 定义自动当前页行号
	var rownum = new Ext.grid.RowNumberer({
		header: 'NO',
		width: 28
	});

	// 定义列模型
	var cm = new Ext.grid.ColumnModel([rownum, {
		header: 'RFID标签编号',
		width:140,
		dataIndex: 'epc'
	}, {
		header: '产品编号',
		dataIndex: 'product_id',
		width:120
	}, {
		header: '生产通知单序号',
		hidden: true,
		dataIndex: 'prod_ord_seq'
	}, {
		header: '颜色',
		dataIndex: 'color',
		width: 100
	}, {
		header: '内长',
		dataIndex: 'in_length',
		width: 50
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
		width: 60
	}, {
		header: '实际要求数量',
		dataIndex: 'real_num',
		width: 60
	}, {
		header: '备注',
		dataIndex: 'remark',
		width: 180
	}, {
		header: '状态',
		dataIndex: 'state',
		hidden: true
	}]);

	/**
	 * 数据存储
	 */
	var store = new Ext.data.Store({
		// 获取数据的方式
		proxy: new Ext.data.HttpProxy({
			url: './manageEpc.ered?reqCode=queryProdBasBaseInfo'
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
				name: 'remark'
			},
			{
				name: 'state'//以上为服装信息
			}
		])

	});

	store.on('beforeload', function () {
		this.baseParams = {
			epc: Ext.getCmp('epc_query').getValue()
		}
	});

	// 每页显示条数下拉选择框
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
		items: ['-', '&nbsp;&nbsp;', pagesize_combo]
	});

	// 表格工具栏
	var tbar = new Ext.Toolbar({
		items: [
			'标签编号：',
			{
				fieldLabel: '标签编号',
				name: 'epc_query',
				id: 'epc_query',
				width: 140,
				xtype: 'textfield',
				allowBlank: true, // 是否允许为空
				maxLength: 50, // 可输入的最大文本长度,不区分中英文字符
				anchor: '100%' // 宽度百分比
			},
			{
				text: '查询',
				iconCls: 'previewIcon',
				xtype: "button",
				handler: function () {
					queryEpcProdList();
				}
			},{
				text: '解绑',
				iconCls: 'addIcon',
				handler: function () {
					var epc =Ext.getCmp('epc_query').getValue();
					if(!Ext.isEmpty(epc)){
						loadEpcProdInfo(epc);
					}

				}
			},
			{
				text: '读卡解绑',
				id: 'fk_button',
				iconCls: 'addIcon',
				handler: function () {
					var rfid = ReadEpcCode();
					if (rfid.state != 0) {
						Ext.Msg.alert('提示', rfid.returnCode);
						return;
					}

					var epc = rfid.returnCode;
					loadEpcProdInfo(epc);
				}
			},
			'->',
			{
				text: '刷新',
				iconCls: 'arrow_refreshIcon',
				handler: function () {
					store.reload();
				}
			}
		]
	});

	// 表格实例
	var grid = new Ext.grid.GridPanel({
		title: '<span style="font-weight:normal">该编号的服装信息</span>',
		height: 500,
		frame: true,
		region: 'center', // 和VIEWPORT布局模型对应，充当center区域布局
		store: store, // 数据存储
		stripeRows: true, // 斑马线
		cm: cm, // 列模型
		tbar: tbar, // 表格工具栏
		bbar: bbar,// 分页工具栏
		viewConfig: {
		},
		loadMask: {
			msg: '正在加载表格数据,请稍等...'
		}
	});

	var writeCrdForm = new Ext.form.FormPanel({
		collapsible: false,
		border: true,
		labelWidth: 120, // 标签宽度
		// frame : true, //是否渲染表单面板背景色
		labelAlign: 'left', // 标签对齐方式
		bodyStyle: 'padding:5 5 0', // 表单元素和表单面板的边距
		buttonAlign: 'center',
		height: 300,
		items: [
			{
				xtype: "panel",
				title: "服装信息",
				// border : false,
				height: 250,
				layout: "form",
				width: 842,
				items: [
					{
						xtype: "panel",
						border: false,
						padding: "8px",
						layout: "form",
						items: [
							{
								fieldLabel: "标签编号",
								name: "epc",
								xtype: "textfield"
							}
						]
					},
					{
						layout: "column",
						border: false,
						padding: "3px",
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
										fieldLabel: "生产序列号",
										name: "prod_ord_seq",
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
										fieldClass: 'x-custom-field-disabled'
									},
									{
										fieldLabel: "腰围",
										name: "waist",
										id: 'waist',
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
										fieldLabel: "印花",
										name: "print",
										fieldClass: 'x-custom-field-disabled'
									},
									{
										fieldLabel: "水洗",
										name: "wash",
										fieldClass: 'x-custom-field-disabled'
									},
									{
										fieldLabel: "备注",
										name: "remark",
										fieldClass: 'x-custom-field-disabled'
									},
									{
										fieldLabel: "状态",
										name: "state",
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
										fieldClass: 'x-custom-field-disabled'
									},
									{
										fieldLabel: "指令数",
										name: "ins_num",
										fieldClass: 'x-custom-field-disabled'
									},
									{
										fieldLabel: "实际要求数量",
										name: "real_num",
										fieldClass: 'x-custom-field-disabled'
									},
									{
										name: "product_id",
										hidden: true,
										fieldClass: 'x-custom-field-disabled'
									}
								]
							}
						]
					}
				]
			}
		]
	});

	var writeCrdWindow = new Ext.Window({
		title: '<span style="font-weight:normal">写卡信息<span>', // 窗口标题
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
				text: '解除绑定',
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

	function writeCardInfo() {
		if (!writeCrdForm.getForm().isValid())
			return;
		writeCrdForm.getForm().submit({
			url: './manageEpc.ered?reqCode=removeProdBasInfo',
			waitTitle: '提示',
			method: 'POST',
			waitMsg: '正在处理数据,请稍候...',
			success: function (form, action) { // 回调函数有2个参数
				writeCrdWindow.hide();
				store.reload({
					params: {
						start: 0,
						limit: bbar.pageSize
					}
				});
				Ext.Msg.alert("提示", action.result.msg);
			},
			failure: function (form, action) {
				Ext.Msg.alert('提示', action.result.msg);
			}
		});
	}

	/**
	 * 写卡项目
	 */
	function loadEpcProdInfo(epc) {
		writeCrdWindow.show();
		writeCrdForm.getForm().load({
			url: './manageEpc.ered?reqCode=queryProdBasBaseFormInfo',
			params: {
				epc: epc
			},
			waitTitle: '提示',
			method: 'POST',
			waitMsg: '正在处理数据,请稍候...',
			success: function (form, action) { // 回调函数有2个参数
			},
			failure: function (form, action) {
				Ext.Msg.alert('提示', action.result.msg);
			}
		});
	}

	var selectTab = new Ext.Panel({
		title: '<img src="./resource/image/ext/config.png" align="top" class="IEPNG">解除绑定',
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

	// 布局
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
	function queryEpcProdList() {
		store.load({
			params: {
				start: 0,
				limit: bbar.pageSize,
				epc: Ext.getCmp('epc_query').getValue()
			}
		});
	}

});