var cllcre = '<span style="color:red">*</span>'
var cllc_flag;

// 定义列模型
var cllcsm = new Ext.grid.CheckboxSelectionModel();

var cllccm = new Ext.grid.ColumnModel([ cllcsm, new Ext.grid.RowNumberer(), {
	header: '主色',
	dataIndex: 'deptname',
	align: 'center',
	width: 30
}, {
	header: '衣领色',
	dataIndex: 'cwa_mon',
	align: 'center',
	width: 30
}, {
	header: '罗纹色',
	dataIndex: 'cwa_mon1',
	align: 'center',
	width: 30
}, {
	header: 'S',
	dataIndex: 'cwa_mon2',
	align: 'center',
	width: 30
}, {
	header: 'M',
	dataIndex: 'cwa_mon3',
	align: 'center',
	width: 30
}, {
	header: 'L',
	dataIndex: 'cwa_mon4',
	align: 'center',
	width: 30
}, {
	header: '合计',
	dataIndex: 'dept_id',
	align: 'center',
	width: 30,
	//	hidden : true,
	sortable: true
} ]);
/**
 * 数据存储
 */
var cllcStore = new Ext.data.Store({
	// 获取数据的方式
	proxy: new Ext.data.HttpProxy({
		url: './gymBook.ered?reqCode=getGymBookList'
	}),
	// 数据读取器
	reader: new Ext.data.JsonReader({
		totalProperty: 'TOTALCOUNT', // 记录总数
		root: 'ROOT' // Json中的列表数据根节点
	}, [
		{
			name: 'rn1'
		},
		{
			name: 'cwa_mon1'
		},
		{
			name: 'deptname1'
		},
		{
			name: 'dept_id1'
		}
	])
});

// 表格工具栏
var cllctbar = new Ext.Toolbar({
	items: [
		{
			text: '新增',
			id: 'cllc_new_button',
			iconCls: 'page_addIcon',
			handler: function () {
				cllc_flag = 'add';
				cllcWindow.show();
			}
		},
		'-',
		{
			text: '删除',
			id: 'cllc_delete_button',
			iconCls: 'page_delIcon',
			handler: function () {
				//			deleteCodeItems();
			}
		}
	]
});

// 表格实例
var cllcGrid = new Ext.grid.GridPanel(
	{
		title: '<img src="./resource/image/ext/application_view_list.png" align="top" class="IEPNG"><span style="font-weight:normal">颜色尺寸搭配表</span>',
		//				renderTo : 'gridDiv1',
		height: 500,
		autoScroll: true,
		frame: true,
		// autoExpandColumn : 'notes',
		region: 'center', // 和VIEWPORT布局模型对应，充当center区域布局
		store: cllcStore, // 数据存储
		stripeRows: true, // 斑马线
		cm: cllccm, // 列模型
		tbar: cllctbar, // 表格工具栏
		viewConfig: {
			forceFit: true
		},
		loadMask: {
			msg: '正在加载表格数据,请稍等...'
		}
	});

cllcStore.load();

cllcGrid.on('rowdblclick', function (grid, rowIndex, event) {
	var record = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(record)) {
		Ext.Msg.alert('提示:', '请先选中项目');
		return;
	}
	cllc_flag = 'modify';
	//			ininEditCodeWindow();
});

var ratiocm = new Ext.grid.ColumnModel([ cllcsm, new Ext.grid.RowNumberer(), {
	header: '编号',
	dataIndex: 'deptname',
	align: 'center',
	width: 30
}, {
	header: '颜色',
	dataIndex: 'cwa_mon',
	align: 'center',
	width: 30
}, {
	header: 'S',
	dataIndex: 'cwa_mon',
	align: 'center',
	width: 30
}, {
	header: 'M',
	dataIndex: 'cwa_mon',
	align: 'center',
	width: 30
}, {
	header: 'L',
	dataIndex: 'cwa_mon',
	align: 'center',
	width: 30
}, {
	header: '件数',
	dataIndex: 'cwa_mon',
	align: 'center',
	width: 30
}, {
	header: '配比数/包数',
	dataIndex: 'cwa_mon',
	align: 'center',
	width: 30
}, {
	header: '合计',
	dataIndex: 'dept_id',
	align: 'center',
	width: 30,
	//	hidden : true,
	sortable: true
} ]);
/**
 * 数据存储
 */
var ratioStore = new Ext.data.Store({
	// 获取数据的方式
	proxy: new Ext.data.HttpProxy({
		url: './gymBook.ered?reqCode=getGymBookList'
	}),
	// 数据读取器
	reader: new Ext.data.JsonReader({
		totalProperty: 'TOTALCOUNT', // 记录总数
		root: 'ROOT' // Json中的列表数据根节点
	}, [
		{
			name: 'rn1'
		},
		{
			name: 'cwa_mon1'
		},
		{
			name: 'deptname1'
		},
		{
			name: 'dept_id1'
		}
	])
});

// 表格工具栏
var ratiotbar = new Ext.Toolbar({
	items: [
		{
			text: '新增',
			id: 'ratio_new_button',
			iconCls: 'page_addIcon',
			handler: function () {
				cllc_flag = 'add';
				ratioWindow.show();
			}
		},
		'-',
		{
			text: '删除',
			id: 'ratio_delete_button',
			iconCls: 'page_delIcon',
			handler: function () {
				//			deleteCodeItems();
			}
		}
	]
});

// 表格实例
var ratioGrid = new Ext.grid.GridPanel(
	{
		title: '<img src="./resource/image/ext/application_view_list.png" align="top" class="IEPNG"><span style="font-weight:normal">配比表</span>',
		//				renderTo : 'gridDiv1',
		height: 500,
		autoScroll: true,
		frame: true,
		// autoExpandColumn : 'notes',
		region: 'center', // 和VIEWPORT布局模型对应，充当center区域布局
		store: ratioStore, // 数据存储
		stripeRows: true, // 斑马线
		cm: ratiocm, // 列模型
		tbar: ratiotbar, // 表格工具栏
		viewConfig: {
			forceFit: true
		},
		loadMask: {
			msg: '正在加载表格数据,请稍等...'
		}
	});

/**
 * 窗口实例
 */
var cllcFormPanel = new Ext.form.FormPanel({
	labelAlign: 'right',
	labelWidth: 80,
	frame: true,
	id: 'cllcFormPanel',
	name: 'cllcFormPanel',
	items: [
		{
			layout: 'column',
			items: [
				{
					columnWidth: 0.5,
					layout: 'form',
					defaultType: 'textfield',
					items: [
						{
							fieldLabel: '主色' + basere,
							name: 'mc',
							id: 'mc',
							allowBlank: false,
							anchor: '100%',
							//						readOnly: true,
							allowNegative: false,
							maxLength: 14
						},
						{
							fieldLabel: '罗纹色' + basere,
							name: 'ribc',
							id: 'ribc',
							allowBlank: false,
							anchor: '100%',
							//						readOnly: true,
							allowNegative: false,
							maxLength: 14
						},
						{
							fieldLabel: 'M',
							name: 'M',
							id: 'M',
							allowBlank: false,
							anchor: '100%',
							//						readOnly: true,
							allowNegative: false,
							maxLength: 14
						}
					]
				},
				{
					columnWidth: 0.5,
					layout: 'form',
					defaultType: 'textfield',
					items: [
						{
							fieldLabel: '衣领色' + basere,
							name: 'cc',
							id: 'cc',
							allowBlank: false,
							anchor: '100%',
							//						readOnly: true,
							allowNegative: false,
							maxLength: 14
						},
						{
							fieldLabel: 'S',
							name: 'S',
							id: 'S',
							allowBlank: false,
							anchor: '100%',
							//						readOnly: true,
							allowNegative: false,
							maxLength: 14
						},
						{
							fieldLabel: 'L',
							name: 'L',
							id: 'L',
							allowBlank: false,
							anchor: '100%',
							//						readOnly: true,
							allowNegative: false,
							maxLength: 14
						}
					]
				}
			]
		}
	]
});

// addData－－新增数据窗口
var cllcWindow = new Ext.Window({
	layout: 'fit',
	width: 400,
	height: 160,
	resizable: false,
	draggable: false,
	closeAction: 'hide',
	title: '新增颜色尺寸搭配信息',
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
	items: [ cllcFormPanel ], // 嵌入的表单面板
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
			iconCls: 'deleteIcon',
			handler: function () {
				clearForm(cllcFormPanel.getForm());
			}
		},
		{
			text: '关闭',
			iconCls: 'deleteIcon',
			handler: function () {
				cllcWindow.hide();
			}
		}
	]
});

/**
 * 颜色下拉框
 */
var colorStore = new Ext.data.SimpleStore({
	fields: [ 'value', 'text' ],
	data: [
		[ '0', '红色/蓝色/紫色' ],
		[ '1', '黄色/蓝色/红色' ]
	]
});

var colorCombo = new Ext.form.ComboBox({
	name: 'color',
	hiddenName: 'color',
	store: colorStore,
	mode: 'local',
	triggerAction: 'all',
	valueField: 'value',
	displayField: 'text',
	value: '0',
	fieldLabel: '颜色',
	emptyText: '请选择...',
	allowBlank: false,
	forceSelection: true,
	editable: false,
	typeAhead: true,
	anchor: "100%"
});

/**
 * 窗口实例
 */
var ratioFormPanel = new Ext.form.FormPanel({
	labelAlign: 'right',
	labelWidth: 80,
	frame: true,
	id: 'ratioFormPanel',
	name: 'ratioFormPanel',
	items: [
		{
			layout: 'column',
			items: [
				{
					columnWidth: 0.5,
					layout: 'form',
					defaultType: 'textfield',
					items: [ colorCombo, {
						fieldLabel: 'M' + basere,
						name: 'ratioM',
						id: 'ratioM',
						allowBlank: false,
						anchor: '100%',
						//						readOnly: true,
						allowNegative: false,
						maxLength: 14
					}, {
						fieldLabel: '件数' + basere,
						name: 'ratio_num',
						id: 'ratio_num',
						allowBlank: false,
						anchor: '100%',
						//						readOnly: true,
						allowNegative: false,
						maxLength: 14
					} ]
				},
				{
					columnWidth: 0.5,
					layout: 'form',
					defaultType: 'textfield',
					items: [
						{
							fieldLabel: 'S' + basere,
							name: 'ratioS',
							id: 'ratioS',
							allowBlank: false,
							anchor: '100%',
							//						readOnly: true,
							allowNegative: false,
							maxLength: 14
						},
						{
							fieldLabel: 'L' + basere,
							name: 'ratioL',
							id: 'ratioL',
							allowBlank: false,
							anchor: '100%',
							//						readOnly: true,
							allowNegative: false,
							maxLength: 14
						},
						{
							fieldLabel: '配比数/包数' + basere,
							name: 'ratio_package',
							id: 'ratio_package',
							allowBlank: false,
							anchor: '100%',
							//						readOnly: true,
							allowNegative: false,
							maxLength: 14
						}
					]
				}
			]
		}
	]
});

// addData－－新增数据窗口
var ratioWindow = new Ext.Window({
	layout: 'fit',
	width: 400,
	height: 160,
	resizable: false,
	draggable: false,
	closeAction: 'hide',
	title: '新增配比信息',
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
	items: [ ratioFormPanel ], // 嵌入的表单面板
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
			iconCls: 'deleteIcon',
			handler: function () {
				clearForm(ratioFormPanel.getForm());
			}
		},
		{
			text: '关闭',
			iconCls: 'deleteIcon',
			handler: function () {
				ratioWindow.hide();
			}
		}
	]
});

/**
 * 布局
 */

var cllcPanel = new Ext.FormPanel({
	layout: 'border',
	labelAlign: 'right',
	title: '搭配表',
	id: 'cllcPanel_id',
	name: 'cllcPanel',
	items: [
		{
			region: 'center',
			//			height: 300,
			//		width : 600,
			items: [ cllcGrid ]
		},
		{
			region: 'south',
			width: 1140,
			height: 190,
			items: [ ratioGrid ]
		}
	]
});