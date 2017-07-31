var check_ord_seq_no;// 选中的订单记录
var query_grp_id = '', query_dept_id = '', query_team_no = '';
var query_params = {};

var formPanel = new Ext.form.FormPanel({
	collapsible: false,
	border: false,
	region: 'north',
	labelWidth: 70, // 标签宽度
	frame: false, // 是否渲染表单面板背景色
	labelAlign: 'right', // 标签对齐方式
	bodyStyle: 'padding:5 5 0', // 表单元素和表单面板的边距
	buttonAlign: 'center',
	name: 'codeForm',
	height: 70,
	tbar: [
		{
			xtype: 'datefield',
			id: 'startdate',
			name: 'startdate',
			format: 'Y-m-d',
			emptyText: '订单交货起始日期',
			editable: true,
			width: 120
		},
		'-',
		{
			xtype: 'datefield',
			id: 'enddate',
			name: 'enddate',
			format: 'Y-m-d',
			emptyText: '订单交货结束日期',
			editable: true,
			width: 120
		},
		'-',
		'订单状态:',
		{
			xtype: 'combo',
			width: 70,
			hiddenName: 'prodstatus',
			id: 'query_prodstatus',
			store: new Ext.data.SimpleStore({
				fields: ['value', 'text'],
				data: [
					['0', '未排产'],
					['1', '在产中'],
					['2', '已交货'],
					['', '所有']
				]
			}),
			mode: 'local',
			triggerAction: 'all',
			valueField: 'value',
			displayField: 'text',
			value: '',
			forceSelection: true,
			editable: false,
			typeAhead: true
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
									disabledClass: 'x-item'
								},
								{
									inputValue: '2',
									name: 'leavRadio',
									boxLabel: '按订单号,款号',
									checked: true,
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
	click_grp_id = node.attributes.id;// 点击的分厂编号

	ordStore.reload({
		params: {
			start: 0,
			limit: ordBbar.pageSize,
			belong_grp: click_grp_id,
			startdate: Ext.getCmp('startdate').getValue(),
			enddate: Ext.getCmp('enddate').getValue(),
			prodstatus: Ext.getCmp('query_prodstatus').getValue()
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
var queryCustPanelType = '';
cust_tree.on('click', function (node) {
	var id = node.attributes.id;// 点击的客户编号
	queryCustPanelType = id.substring(0, 4);
	click_cust_id = id.substring(4);

	if (queryCustPanelType == 'area') {
		ordStore.reload({
			params: {
				start: 0,
				limit: ordBbar.pageSize,
				country: click_cust_id,
				startdate: Ext.getCmp('startdate').getValue(),
				enddate: Ext.getCmp('enddate').getValue(),
				prodstatus: Ext.getCmp('query_prodstatus').getValue()
			}
		});
	} else {
		ordStore.reload({
			params: {
				start: 0,
				limit: ordBbar.pageSize,
				cust_id: click_cust_id,
				startdate: Ext.getCmp('startdate').getValue(),
				enddate: Ext.getCmp('enddate').getValue(),
				prodstatus: Ext.getCmp('query_prodstatus').getValue()
			}
		});
	}

});

var ord_query_panel = new Ext.form.FormPanel({
	collapsible: false,
	border: false,
	region: 'center',
	labelWidth: 70, // 标签宽度
	frame: false, // 是否渲染表单面板背景色
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
			listeners: {
				specialkey: function (field, e) {
					if (e.getKey() == Ext.EventObject.ENTER) {
						ordQuery4ordInfo();
					}
				}
			}
		},{
		  xtype:'textfield',
		  fieldLabel:'款号',
		  name:'style_no',
		  id:'style_no',
		  anchor:'100%',
		  listeners:{
		  	specialkey:function(field,e){
		  		if (e.getKey() == Ext.EventObject.ENTER) {
		  			     ordQuery4ordInfo();  
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
				ordQuery4ordInfo();
			}
		},
		{
			text: '重置',
			iconCls: 'tbar_synchronizeIcon',
			handler: function () {
				Ext.getCmp('order_id').setValue('');
				Ext.getCmp('startdate').setValue('');
				Ext.getCmp('enddate').setValue('');
				Ext.getCmp('style_no').setValue('');
			}
		}
	]
});

// 卡片布局的显示信息
var detaiQueryPanel = new Ext.Panel({
	title: "客户信息",
	layout: 'card',
	activeItem: 2,
	region: 'center',
	labelAlign: "right",
	labelWidth: 70,
	border: false,
	items: [grp_tree, cust_tree, ord_query_panel]
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

var ordSm = new Ext.grid.CheckboxSelectionModel({
	singleSelect: false
});

var ordCm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), ordSm, {
	header: '订单号',
	dataIndex: 'order_id',
	width: 80
}, {
	header: '交货日期',
	dataIndex: 'deli_date',
	width: 90
}, {
    header:'款号',
    dataIndex:'style_no',
    width:90
},{
    header:'丝带色号',
    dataIndex:'ribbon_color',
    width:90
},{
    header:'指令数',
    dataIndex:'ins_num'
},{
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
}, {
	header: '订单状态',
	dataIndex: 'prodstatus',
	width: 80,
	renderer: function (value) {
		if (value == '0') {
			return '未排产';
		} else if (value == '1') {
			return '在产中';
		} else if (value == '2') {
			return '已交货';
		} else {
			return '未知';
		}
	}
}, {
	hidden: true,
	dataIndex: 'seq_no',
	width: 180
}]);

var ordStore = new Ext.data.Store({
	proxy: new Ext.data.HttpProxy({
		url: './ordBas.ered?reqCode=queryOrdBasInfo'
	}),
	reader: new Ext.data.JsonReader({
		totalProperty: 'TOTALCOUNT',
		root: 'ROOT'
	}, ['seq_no', 'order_id', 'article', 'deli_date','ribbon_color','ins_num',
		'order_date', 'cust_name', 'start_date', 'prodstatus','style_no'])
});

ordStore.on('beforeload', function () {
	this.baseParams = {
		startdate: Ext.getCmp('startdate').getValue(),
		enddate: Ext.getCmp('enddate').getValue()
	};
	var radioValue = Ext.getCmp('leavRadio').getValue().inputValue;
	if (radioValue == 0) {
		this.baseParams.belong_grp = click_grp_id;
	} else if (radioValue == 1) {
		if (queryCustPanelType == 'area') {
			this.baseParams.country = click_cust_id;
		} else {
			this.baseParams.cust_id = click_cust_id;
		}
	} else if (radioValue == 2) {
		this.baseParams.order_name = getValueNoNullById('order_id');
		this.baseParams.style_no = getValueNoNullById('style_no');
	}
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

var ordNumber = parseInt(ordPagesize_combo.getValue());
ordPagesize_combo.on("select", function (comboBox) {
	ordBbar.pageSize = parseInt(comboBox.getValue());
	ordNumber = parseInt(comboBox.getValue());
	ordStore.load({
		params: {
			start: 0,
			limit: ordBbar.pageSize,
			startdate: Ext.getCmp('startdate').getValue(),
			enddate: Ext.getCmp('enddate').getValue()
		}
	});
});

var ordBbar = new Ext.PagingToolbar({
	pageSize: ordNumber,
	store: ordStore,
	displayInfo: true,
	displayMsg: '显示{0}条到{1}条,共{2}条',
	plugins: new Ext.ux.ProgressBarPager(), // 分页进度条
	emptyMsg: "没有符合条件的记录",
	items: ['-', '&nbsp;&nbsp;', ordPagesize_combo]
});

var ordGrid = new Ext.grid.GridPanel({
	autoScroll: true,
	region: 'center',
	store: ordStore,
	title: '订单信息',
	loadMask: {
		msg: '正在加载表格数据,请稍等...'
	},
	stripeRows: true,
	cm: ordCm,
	sm: ordSm,
	bbar: ordBbar
});
ordGrid.on('rowdblclick', function () {

	var record = ordGrid.getSelectionModel().getSelected();
	var order_id = record.get('order_id');
	loadCenterPanelInfo(order_id);
	ordSelectWindow.hide();
});

var ordSelectWindow = new Ext.Window({
	layout: 'border',
	width: 1000, // 窗口宽度
	height: 422, // 窗口高度
	resizable: true,
	draggable: false,
	closeAction: 'hide',
	title: '订单选择窗口',
	modal: false,
	collapsible: true,
	titleCollapse: true,
	maximizable: true,
	buttonAlign: 'right',
	border: false,
	animCollapse: true,
	animateTarget: Ext.getBody(),
	constrain: true,
	items: [queryPanel, ordGrid],
	listeners: {
		"beforehide": function () {
			ordSelectWindow.restore();
		}
	},
	buttons: [
		{
			text: '确认',
			iconCls: 'acceptIcon',
			handler: function () {
				var record = ordGrid.getSelectionModel().getSelected();
				if (Ext.isEmpty(record)) {
					Ext.Msg.alert('提示', '请选择一条记录!');
					return;
				}
				var order_id = record.get('order_id');
				loadCenterPanelInfo(order_id);
				ordSelectWindow.hide();
			}
		},
		{
			text: '关闭',
			iconCls: 'deleteIcon',
			handler: function () {
				ordSelectWindow.hide();
				ordSelectWindow.restore();
				Ext.getCmp('order_id').setValue('');
				Ext.getCmp('startdate').setValue('');
				Ext.getCmp('enddate').setValue('');
				ordStore.removeAll();
			}
		}
	]
});


var grpQueryRoot = new Ext.tree.AsyncTreeNode({
	text: '',
	expanded: true,
	iconCls: 'folder_userIcon',
	id: '001'
});

var grpQueryTree = new Ext.tree.TreePanel({
	loader: new Ext.tree.TreeLoader({
		baseAttrs: {},
		dataUrl: './ordRecord.ered?reqCode=grpTreeInit'
	}),
	root: grpQueryRoot,
	autoScroll: true,
	animate: false,
	useArrows: false,
	rootVisible: false,
	border: false
});

// 监听下拉树的节点单击事件
grpQueryTree.on('click', function (node) {
	grpQueryTreeCombox.setValue(node.text);
	query_grp_id = node.attributes.id;
	grpQueryTreeCombox.collapse();

	deptQueryRoot.setId(query_grp_id);
	deptQueryRoot.setText(node.attributes.text);
	teamQueryRoot.setId('001');

	deptQueryTreeCombox.setValue('');
	teamQueryTreeCombox.setValue('');
	query_dept_id = '';
	query_team_no = '';
});

var grpQueryTreeCombox = new Ext.form.ComboBox({
	id: 'grp_query_tree',
	name: 'grp_name',
	store: new Ext.data.SimpleStore({
		fields: [],
		data: [
			[]
		]
	}),
	editable: false,
	value: ' ',
	fieldLabel: '工厂',
	anchor: '100%',
	mode: 'local',
	triggerAction: 'all',
	maxHeight: 390,
	listWidth: 200,
	tpl: "<tpl for='.'><div style='height:390px'><div id='grpQueryTreeDiv'></div></div></tpl>",
	onSelect: Ext.emptyFn
});
// 监听下拉框的下拉展开事件
grpQueryTreeCombox.on('expand', function () {
	// 将UI树挂到treeDiv容器
	grpQueryTree.render('grpQueryTreeDiv');
	grpQueryTree.root.reload(); // 每次下拉都会加载数
});

var deptQueryRoot = new Ext.tree.AsyncTreeNode({
	text: '',
	expanded: true,
	iconCls: 'folder_userIcon',
	id: '001'
});

var deptQueryTree = new Ext.tree.TreePanel({
	loader: new Ext.tree.TreeLoader({
		baseAttrs: {},
		dataUrl: './ordRecord.ered?reqCode=deptTreeInit'
	}),
	root: deptQueryRoot,
	autoScroll: true,
	animate: false,
	useArrows: false,
	rootVisible: false,
	border: false
});

// 监听下拉树的节点单击事件
deptQueryTree.on('click', function (node) {
	deptQueryTreeCombox.setValue(node.text);
	query_dept_id = node.attributes.id;

	teamQueryRoot.setId(query_dept_id);
	teamQueryRoot.setText(node.attributes.text);
	deptQueryTreeCombox.collapse();

	teamQueryTreeCombox.setValue('');
	query_team_no = '';
});

var deptQueryTreeCombox = new Ext.form.ComboBox({
	id: 'dept_query_tree',
	name: 'dept_name',
	store: new Ext.data.SimpleStore({
		fields: [],
		data: [
			[]
		]
	}),
	editable: false,
	value: ' ',
	fieldLabel: '部门',
	anchor: '100%',
	mode: 'local',
	triggerAction: 'all',
	maxHeight: 390,
	listWidth: 200,
	tpl: "<tpl for='.'><div style='height:390px'><div id='deptQueryTreeDiv'></div></div></tpl>",
	onSelect: Ext.emptyFn
});
// 监听下拉框的下拉展开事件
deptQueryTreeCombox.on('expand', function () {
//	if (!Ext.isEmpty(update_dept_id)) {
	// 将UI树挂到treeDiv容器
	deptQueryTree.render('deptQueryTreeDiv');
	deptQueryTree.root.reload(); // 每次下拉都会加载数
//	}
});

var teamQueryRoot = new Ext.tree.AsyncTreeNode({
	text: '',
	expanded: true,
	iconCls: 'folder_userIcon',
	id: '001'
});

var teamQueryTree = new Ext.tree.TreePanel({
	loader: new Ext.tree.TreeLoader({
		baseAttrs: {},
		dataUrl: './ordRecord.ered?reqCode=teamTreeInit'
	}),
	root: teamQueryRoot,
	autoScroll: true,
	animate: false,
	useArrows: false,
	rootVisible: false,
	border: false
});

// 监听下拉树的节点单击事件
teamQueryTree.on('click', function (node) {
	teamQueryTreeCombox.setValue(node.text);
	query_team_no = node.attributes.id;
	teamQueryTreeCombox.collapse();
});

var teamQueryTreeCombox = new Ext.form.ComboBox({
	id: 'team_query_tree',
	name: 'team_name',
	store: new Ext.data.SimpleStore({
		fields: [],
		data: [
			[]
		]
	}),
	editable: false,
	value: ' ',
	fieldLabel: '班组',
	anchor: '100%',
	mode: 'local',
	triggerAction: 'all',
	maxHeight: 390,
	listWidth: 200,
	tpl: "<tpl for='.'><div style='height:390px'><div id='teamQueryTreeDiv'></div></div></tpl>",
	onSelect: Ext.emptyFn
});
// 监听下拉框的下拉展开事件
teamQueryTreeCombox.on('expand', function () {
//	if (!Ext.isEmpty(update_team_no)) {
	// 将UI树挂到treeDiv容器
	teamQueryTree.render('teamQueryTreeDiv');
	teamQueryTree.root.reload(); // 每次下拉都会加载数
//	}
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

var ordQueryPanel = new Ext.form.FormPanel({
	region: 'center',
	frame: false, //是否渲染表单面板背景色
	labelAlign: 'right', // 标签对齐方式
	bodyStyle: 'padding:5 5 0', // 表单元素和表单面板的边距
	buttonAlign: 'right',
	items: [
		{
			layout: 'column',
			border: false,
			items: [
				{
					layout: 'form',
					border: false,
					columnWidth: .5,
					items: [
						{
							anchor: '98%',
							xtype: 'datefield',
							name: 'start_date',
							format: 'Y-m-d',
							labelWidth: 100,
							editable: false,
							fieldLabel: '记录开始日期'
						}
					]
				},
				{
					layout: 'form',
					border: false,
					columnWidth: .5,
					items: [
						{
							anchor: '98%',
							xtype: 'datefield',
							name: 'end_date',
							format: 'Y-m-d',
							editable: false,
							labelWidth: 100,
							fieldLabel: '记录结束日期'
						}
					]
				}
			]
		},
		{
			layout: 'column',
			border: false,
			labelWidth: 70, // 标签宽度
			items: [
				{
					layout: 'form',
					border: false,
					columnWidth: .33,
					items: [
						grpQueryTreeCombox,
						{
							anchor: '100%',
							xtype: 'textfield',
							fieldLabel: '订单号',
							name: 'order_id'
						}
					]
				},
				{
					layout: 'form',
					border: false,
					columnWidth: .33,
					items: [
						deptQueryTreeCombox,
						{
							anchor: '100%',
							xtype: 'textfield',
							fieldLabel: '款号',
							name: 'style_no'
						}
					]
				},
				{
					layout: 'form',
					border: false,
					columnWidth: .33,
					items: [
						teamQueryTreeCombox,
						{
							anchor: '100%',
							xtype: 'textfield',
							fieldLabel: '单据号',
							name: 'seq_no'
						}
					]
				}
			]
		},
		{
			layout: 'column',
			border: false,
			labelWidth: 70, // 标签宽度
			items: [
				{
					layout: 'form',
					border: false,
					columnWidth: 0.33,
					items: [
						{
							xtype: 'combo',
							name: 'cust_id',
							hiddenName: 'cust_id',
							store: custStore,
							mode: 'local',
							triggerAction: 'all',
							valueField: 'value',
							displayField: 'text',
							fieldLabel: '客户/品牌',
							forceSelection: false,
							editable: false,
							typeAhead: false,
							anchor: "100%"
						}
					]
				},
				{
					layout: 'form',
					border: false,
					columnWidth: 0.33,
					items: [
						{
							xtype: 'lovcombo',
							name: 'value',
							id: 'nature_combo',
							hiddenName: 'natures',
							fieldLabel: '数量性质',
							store: new Ext.data.ArrayStore({
								fields: ['value', 'text'],
								data: [
									['1', '裁出数量'],
									['2', '缝制领片'],
									['3', '缝制下线'],
									['13', '送水洗'],
									['4', '水洗收货'],
									['5', '水洗移交'],
									['6', '后整收货'],
									['7', '移交成品'],
									['8', '移交B品'],
									['10', '收成品'],
									['11', '收B品'],
									['12', '中间领用'],
									['14','出运成品'],
									['15','出运B品'],
									['16','B品库收录B品数'],
									['17','B品库出运B品数']
									
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
							anchor: "100%"
						}
					]
				},
				{
					layout: 'form',
					border: false,
					columnWidth: 0.33,
					items: [
						{
							xtype: 'combo',
							anchor: "100%",
							hiddenName: 'prodstatus',
							fieldLabel: '订单状态',
							store: new Ext.data.SimpleStore({
								fields: ['value', 'text'],
								data: [
									['0', '未排产'],
									['1', '在产中'],
									['2', '已交货'],
									['', '所有']
								]
							}),
							mode: 'local',
							triggerAction: 'all',
							valueField: 'value',
							displayField: 'text',
							value: '',
							forceSelection: true,
							editable: false,
							typeAhead: true
						}
					]
				}
			]
		}
	]
});

var ordQueryWindow = new Ext.Window({
	layout: 'border',
	width: 700, // 窗口宽度
	height: 250, // 窗口高度
	resizable: true,
	draggable: false,
	closeAction: 'hide',
	title: '订单查询窗口',
	modal: false,
	buttonAlign: 'right',
	border: false,
	animCollapse: true,
	animateTarget: Ext.getBody(),
	constrain: true,
	items: [ordQueryPanel],
	listeners: {
		"beforehide": function () {
			ordQueryWindow.restore();
		}
	},
	buttons: [
		{
			text: '确认查询',
			iconCls: 'acceptIcon',
			handler: function () {
				ordQueryWindow.hide();
				query_params = ordQueryPanel.getForm().getValues();
				query_params.start = 0;
				query_params.grp_id = query_grp_id;
				query_params.dept_id = query_dept_id;
				query_params.team_no = query_team_no;
				query_params.query_flag = 'detailQuery';
				query_params.limit = ordDayListBbar.pageSize;
				ordDayListStore.reload({
					params: query_params
				});
			}
		},
		{
			text: '重置',
			iconCls: 'tbar_synchronizeIcon',
			handler: function () {
				clearFormPanel(ordQueryPanel);
				query_grp_id = '';
				query_dept_id = '';
				query_team_no = '';
				deptQueryRoot.setId('');
				teamQueryRoot.setId('001');
				ordQueryWindow.restore();
			}
		},
		{
			text: '关闭',
			iconCls: 'deleteIcon',
			handler: function () {
				ordQueryWindow.hide();
				ordQueryWindow.restore();
			}
		}
	]
});
    //按照指定的订单信息来查询
    var ordQuery4ordInfo = function(){
       ordStore.reload({
            params: {
                start: 0,
                limit: ordBbar.pageSize,
                order_name:getValueNoNullById('order_id'),
                startdate: Ext.getCmp('startdate').getValue(),
                enddate: Ext.getCmp('enddate').getValue(),
                prodstatus: getValueNoNullById('query_prodstatus'),
                style_no:getValueNoNullById('style_no')
            }
       });
    }
    /**
     * 通过id获取值
     * @param {} idval 传入的id
     */
    var getValueNoNullById = function(idval){
    	var value = Ext.getCmp(idval).getValue();
    	return value?value:'';
    }