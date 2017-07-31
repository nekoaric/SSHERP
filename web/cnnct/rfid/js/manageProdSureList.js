/************************************************
 * 创建日期: 2013-05-13
 * 创建作者：lingm
 * 功能：领片记录确认
 * 最后修改时间：
 * 修改记录：
 *************************************************/
Ext.onReady(function () {
	//以下为服装绑定
	// 定义自动当前页行号
	var rownum = new Ext.grid.RowNumberer({
		header: 'NO',
		width: 28
	});
	var rownum_sure = new Ext.grid.RowNumberer({
		header: 'NO',
		width: 28
	});
	// 定义列模型
	var cm = new Ext.grid.ColumnModel([rownum, {
//		header : 'RFID标签编号',
//		dataIndex : 'epc'
//		}, {
		header: '产品编号',
		dataIndex: 'id'
	}, {
		header: '订单号',
		hidden: true,
		dataIndex: 'order_id'
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
		width: 100
	}, {
		header: '裁剪数量',
		dataIndex: 'cut_num',
		width: 100
	}, {
		header: '已裁剪数量',
		dataIndex: 'realcutnum',
		width: 100
	}, {
		header: '备注',
		dataIndex: 'remark',
		width: 180
	}, {
		header: '状态',
		dataIndex: 'state',
		hidden: true
	}]);

	var cm_sure = new Ext.grid.ColumnModel([rownum_sure, {
		header: '订单编号',
		dataIndex: 'id',
		width: 100
	}, {
		header: '部门',
		dataIndex: 'dept_name',
		width: 140
	}, {
		header: '款号',
		dataIndex: 'style_no',
		width: 120
	}, {
		header: '品名',
		dataIndex: 'article',
		width: 80
	}, {
		header: '数量性质',
		dataIndex: 'nature',
		width: 80,
		renderer: transformNatureValue
	},{
		header: '数量',
		dataIndex: 'amount',
		width: 60
	},{
		header: '单据号',
		dataIndex: 'remark',
		width: 80
	},{
		header: '移交/记录人',
		dataIndex: 'submit_name',
		width: 100
	}, {
		header: '移交时间',
		dataIndex: 'submit_date',
		width: 100
	}, {
		header: '接受人',
		dataIndex: 'sure_name',
		width: 100
	}, {
		dataIndex: 'state',
		hidden: true,
		width: 100
	}]);
	/**
	 * 数据存储
	 */
	var store_sure = new Ext.data.Store({
		// 获取数据的方式
		proxy: new Ext.data.HttpProxy({
			url: './prodSure.ered?reqCode=queryProdSureList'
		}),
		reader: new Ext.data.JsonReader({
			totalProperty: 'TOTALCOUNT',
			root: 'ROOT'
		}, [
			{
				name: 'seq_no'
			},
			{
				name: 'id'
			},
			{
				name: 'dept_id'
			},
			{
				name: 'dept_name'
			},
			{
				name: 'amount'
			},
			{
				name: 'nature'
			},
			{
				name: 'article'
			},
			{
				name: 'style_no'
			},
			{
				name: 'submit_name'
			},
			{
				name: 'submit_date'
			},
			{
				name: 'sure_name'
			},
			{
				name: 'sure_date'
			},
			{
				name: 'flag'
			},
			{
				name: 'remark'
			},
			{
				name: 'state'
			}
		])
	});

	var store = new Ext.data.Store({
		// 获取数据的方式
		proxy: new Ext.data.HttpProxy({
			url: './prodSure.ered?reqCode=queryProdBasInfo'
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
				name: 'cut_num'
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
			},
			{
				name: 'seq_no'
			},
			{
				name: 'amount'
			},
			{
				name: 'realcutnum'
			},
			{
				name: 'nature'
			},
			{
				name: 'submit_name'
			},
			{
				name: 'submit_time'
			},
			{
				name: 'sure_name'
			},
			{
				name: 'sure_date'
			},
			{
				name: 'state'//以上为领片信息
			}
		])
	});

	/**
	 * 翻页排序时候的参数传递
	 */
	// 翻页排序时带上查询条件
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
	var pagesize_combo_sure = new Ext.form.ComboBox({
		name: 'pagesize_sure',
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
	var number_sure = parseInt(pagesize_combo_sure.getValue());
	// 改变每页显示条数reload数据
	pagesize_combo_sure.on("select", function (comboBox) {
		bbar_sure.pageSize = parseInt(comboBox.getValue());
		number_sure = parseInt(comboBox.getValue());
		store_sure.reload({
			params: {
				start: 0,
				limit: bbar_sure.pageSize
			}
		});
	});
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
	var bbar_sure = new Ext.PagingToolbar({
		pageSize: number_sure,
		store: store_sure,
		displayInfo: true,
		displayMsg: '显示{0}条到{1}条,共{2}条',
		plugins: new Ext.ux.ProgressBarPager(), // 分页进度条
		emptyMsg: "没有符合条件的记录",
		items: ['-', '&nbsp;&nbsp;', pagesize_combo_sure]
	});
	// 表格工具栏
	var tbar_sure = new Ext.Toolbar({
		items: ['->', {text: '确认领片',
			iconCls: 'previewIcon',
			xtype: "button",
			handler: function () {
				writeCrdCatalogItem();
			}
		}]
	});
	var tbar = new Ext.Toolbar({
		items: [
			{
				text: '领片确认',
				id: 'fk_button',
				hidden:true,
				iconCls: 'addIcon',
				handler: function () {
					prodSureList();
				}
			},
			'-',
			'订单编号：',
			{
				fieldLabel: '订单编号',
				name: 'id',
				id: 'id',
				width: 100,
				xtype: 'textfield', //
				allowBlank: true, // 是否允许为空
				maxLength: 50, // 可输入的最大文本长度,不区分中英文字符
				anchor: '100%' // 宽度百分比
			},'-',
			{
				text: '查询',
				iconCls: 'previewIcon',
				xtype: "button",
				handler: function () {
					queryRewritecrdInfoDatas();
				}
			},'-',
			{
				text: '刷新',
				iconCls: 'arrow_refreshIcon',
				handler: function () {
					store_sure.reload();
				}
			}
		]
	});

	// 表格实例
	var grid = new Ext.grid.GridPanel({
		// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
		height: 480,
		frame: true,
		region: 'center', // 和VIEWPORT布局模型对应，充当center区域布局
		store: store, // 数据存储
		stripeRows: true, // 斑马线
		cm: cm, // 列模型
		tbar: tbar_sure, // 表格工具栏
		bbar: bbar,// 分页工具栏
		viewConfig: {
			// 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
			// forceFit : true
		},
		loadMask: {
			msg: '正在加载表格数据,请稍等...'
		}
	});
	var grid_sure = new Ext.grid.GridPanel({
		// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
		height: 480,
		frame: true,
		region: 'center', // 和VIEWPORT布局模型对应，充当center区域布局
		store: store_sure, // 数据存储
		stripeRows: true, // 斑马线
		cm: cm_sure, // 列模型
		tbar: tbar, // 表格工具栏
		bbar: bbar_sure,// 分页工具栏
		viewConfig: {
// 不产横向生滚动条, 各列自动扩展自动压缩, 适用于列数比较少的情况
			// forceFit : true
		},
		loadMask: {
			msg: '正在加载表格数据,请稍等...'
		}
	});
	// 监听行选中事件
	grid.on('rowclick', function (pGrid, rowIndex, event) {
		//	Ext.getCmp('fk_button').enable();
	});

	grid.on('rowdblclick', function (grid, rowIndex, event) {
		writeCrdCatalogItem();
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
				height: 170,
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
								fieldLabel: "生产序列号",
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
							},
							{
								fieldLabel: "已裁剪数量",
								name: "realcutnum",
								readOnly: true,

								fieldClass: 'x-custom-field-disabled'
							}
							,
							{
								name: "state",
								hidden: true,
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
								fieldLabel: "裁剪数量",
								name: "cut_num",
								readOnly: true,
								fieldClass: 'x-custom-field-disabled'
							},
							{
								name: "product_id",
								readOnly: true,
								hidden: true,
								fieldClass: 'x-custom-field-disabled'
							}
						]
					}
				]
			},
			{
				xtype: "panel",
				title: "领片相关信息",
				height: 150,
				layout: "column",
				width: 842,
				items: [
					{
						columnwidth: .5,
						xtype: "panel",
						width: 320,
						height: 285,
						border: false,
						layout: "form",
						defaults: {
							anchor: "100%"
						},
						items: [
							{
								fieldLabel: "领取数量",
								name: "amount",
								allowBlank: false, // 是否允许为空
								xtype: "textfield",
								fieldClass: 'x-custom-field-disabled'
							},
							{
								fieldLabel: "领取人",
								name: "submit_name",
								allowBlank: false, // 是否允许为空
								xtype: "textfield",
								fieldClass: 'x-custom-field-disabled'
							}
						]
					},
					{
						cloumnwidth: .5,
						xtype: "panel",
						width: 320,
						height: 285,
						border: false,
						layout: "form",
						defaults: {
							anchor: "100%"
						},
						items: [new Ext.form.ComboBox(
							{
								hiddenName: 'nature',
								fieldLabel: '数量性质',
								emptyText: '',
								triggerAction: 'all',
								store: new Ext.data.SimpleStore(
									{
										fields: ['name', 'code' ],
										data: ['领片', '3']
									}),
								displayField: 'name',
								valueField: 'code',
								mode: 'local',
								forceSelection: false, // 选中内容必须为下拉列表的子项
								editable: false,
								typeAhead: true,
								resizable: true,
								allowBlank: false,
								anchor: '100%'
							}), {
							xtype: 'datefield',
							fieldLabel: '领取时间', // 标签
							name: 'submit_date', // name:后台根据此name属性取值
							id: 'submit_date',
							format: 'Y-m-d', // 日期格式化
							value: new Date(),
							anchor: '100%' // 宽度百分比
						}]
					}
				]
			}
		]
	});
	var prodInfoWindow = new Ext.Window({
		title: '<span style="font-weight:normal">产品信息<span>', // 窗口标题
		layout: 'fit', // 设置窗口布局模式
		width: 880, // 窗口宽度
		height: 450, // 窗口高度
		closable: true, // 是否可关闭
		collapsible: false, // 是否可收缩
		border: false, // 边框线设置
		constrain: true, // 设置窗口是否可以溢出父容器
		animateTarget: Ext.getBody(),
		closeAction: 'hide',
		items: [grid] // 嵌入的表单面板
	});

	var writeCrdWindow = new Ext.Window({
		title: '<span style="font-weight:normal">领片确认<span>', // 窗口标题
		layout: 'fit', // 设置窗口布局模式
		width: 880, // 窗口宽度
		height: 450, // 窗口高度
		closable: false, // 是否可关闭
		collapsible: true, // 是否可收缩
		maximizable: true, // 设置是否可以最大化
		border: false, // 边框线设置
		constrain: true, // 设置窗口是否可以溢出父容器
		animateTarget: Ext.getBody(),
		items: [writeCrdForm], // 嵌入的表单面板
		buttons: [
			{
				text: '确认',
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

		//document.getElementById("epc").value = document.getElementById("epc").value;

		if (!writeCrdForm.getForm().isValid())
			return;
		writeCrdForm.form.submit({
			url: './prodSure.ered?reqCode=saveProdSureList',
			waitTitle: '提示',
			method: 'POST',
			waitMsg: '正在处理数据,请稍候...',
			success: function (form, action) { // 回调函数有2个参数
				Ext.Msg.alert("提示", action.result.msg, result);
				function result(result) {
					if (result == 'ok') {
						writeCrdForm.getForm().reset();
						writeCrdForm.getForm().remove();
						writeCrdWindow.hide();
						store.reload();
					} else {
						writeCrdForm.getForm().reset();
						writeCrdForm.getForm().remove();
						writeCrdWindow.hide();
						store.reload();
					}
				}
			},
			failure: function (form, action) {
				Ext.Msg.alert('提示', action.result.msg, result);
				function result(result) {
					if (result == 'ok') {
					} else {
					}
				}
			}
		});

	}

	function prodSureList() {
		store.reload({
			params: {
				start: 0,
				limit: bbar.pageSize
			}
		});
		prodInfoWindow.show(); // 显示窗口
	}

	function writeCrdCatalogItem() {
		var record = grid.getSelectionModel().getSelected();

		if (Ext.isEmpty(record)) {
			Ext.Msg.alert('提示:', '请先选中记录');
			return;
		}
		writeCrdForm.getForm().loadRecord(record);
		writeCrdWindow.show(); // 显示窗口
	}


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
				items: [ grid_sure ]
			}
		]
	});
	store.reload({
		params: {
			start: 0,
			limit: bbar.pageSize
		}
	});

	store_sure.reload({
		params: {
			start: 0,
			limit: bbar.pageSize
		}
	});

	/**
	 * 查询项目列表
	 */
	function queryRewritecrdInfoDatas() {
		store_sure.load({
			params: {
				start: 0,
				limit: bbar.pageSize,
				id: Ext.getCmp('id').getValue()
			}
		});
	}

	function transformNatureValue(value){
		if(value == '0'){
			return '标签入库';
		}else if(value == '1'){
			return '裁出数量';
		}else if(value == '2'){
			return '缝制领片';
		}else if(value == '3'){
			return '缝制下线';
		}else if(value == '4'){
			return '水洗收货';
		}else if(value == '5'){
			return '水洗移交';
		}else if(value == '6'){
			return '后整收货';
		}else if(value == '7'){
			return '移交成品';
		}else if(value == '8'){
			return '移交B品';
		}else if(value == '9'){
			return '标签解绑';
		}else if (value == '10'){
            return '收成品';
        }else if (value == '11'){
            return '收B品';
        }else if (value == '12'){
            return '中间领用';
        }else if (value == '13'){
            return '送水洗';
        }
	}

});