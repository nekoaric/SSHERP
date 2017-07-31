var basere = '<span style="color:red">*</span>'
var base_flag;

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
	fieldLabel: '客户' + basere,
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
							fieldLabel: "订单号" + basere,
							allowBlank: false,
							id: 'order_id',
							name: 'order_id',
							anchor: "84%"
						},
						{
							fieldLabel: '订单时间',
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
							fieldLabel: '交货日期' + basere,
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
							fieldLabel: "合同号" + basere,
							allowBlank: false,
							id: 'contract_id',
							name: 'contract_id',
							anchor: "84%"
						},
						{
							xtype: "textfield",
							fieldLabel: "数量" + basere,
							allowBlank: false,
							id: 'order_num',
							name: 'order_num',
							anchor: "84%"
						},
						{
							xtype: "textfield",
							fieldLabel: "业务跟单" + basere,
							allowBlank: false,
							id: 'merchandier',
							name: 'merchandier',
							anchor: "84%"
						},
						{
							xtype: "textfield",
							fieldLabel: "批复人" + basere,
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
	items: [
		{
			layout: 'column',
			items: [
				{
					columnWidth: 1,
					layout: 'form',
					defaultType: 'textfield',
					items: [ itemCombo, {
						fieldLabel: '上传文件' + basere,
						name: 'theFile',
						id: 'theFile',
						inputType: 'file',
						allowBlank: false,
						blankText: "请选择导入文件",
						anchor: '94%'
					} ]
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
/**
 * 布局
 */

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
	frame:true,
	name: 'basePanel',
	items: [
		{
			region: 'north',
			layout:'fit',
			height: 160,
			items: [ orderPanel ]
		},
		{
			region: 'center',
			layout:'fit',
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

/**
 * 表单数据---确定增加
 */
function enterAddForm() {
	if (!addFormPanel.form.isValid())
		return;
	var p = new Ext.data.Record({
		item: Ext.getCmp('items').getValue(),
		file: Ext.getCmp('theFile').getValue()
	});
	equalsData(p);
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
			var resultArray = Ext.util.JSON.decode(response.responseText);
			Ext.Msg.alert('提示', resultArray.msg);
			dataStore.removeAll();
			clearForm(basePanel.getForm());
			Ext.getCmp('addOrdBasInfoWindow').hide();

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
