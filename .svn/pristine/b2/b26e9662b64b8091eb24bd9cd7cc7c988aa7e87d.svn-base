/************************************************
 * 创建日期: 2013-07-22
 * 创建作者：may
 * 功能：订单记录流水表
 * 最后修改时间：
 * 修改记录：
 *************************************************/
Ext.onReady(function () {

	// 定义自动当前页行号
	var rownum = new Ext.grid.RowNumberer({
		header: 'NO',
		width: 28
	});
    var sg = new Ext.grid.CheckboxSelectionModel({
        singleSelect:false
    })
	var cm = new Ext.grid.ColumnModel([rownum,sg, {
		header: '流水号',
		dataIndex: 'seq_no',
		align: 'right',
		width: 60,
		sortable: true // 是否可排序
	}, {
		header: '分厂',
		dataIndex: 'grp_name',
		align:'center',
		width: 100
	},{
		header: '部门',
		dataIndex: 'dept_name',
		align:'center',
		width: 100
	},{
		header: '班组',
		dataIndex: 'team_name',
		align:'center',
		width: 100
	}, {
		header: '日期',
		dataIndex: 'tr_date',
		align:'center',
		width: 80
	}, {
		header: '订单',
		dataIndex: 'order_id',
		width: 150
	}, {
		header: '款号',
		dataIndex: 'style_no',
		width: 100
	}, {
		header: '数量性质',
		dataIndex: 'nature',
		align:'center',
		width: 80,
		renderer: transformNatureValue
	}, {
		header: '登记数量',
		dataIndex: 'amount',
		width: 80
	}, {
		header: '操作员',
		dataIndex: 'opr_name',
		width: 100
	}, {
		header: '操作时间',
		dataIndex: 'opr_time',
		align: 'center',
		width: 130
	}, {
		header: '记录状态',
		dataIndex: 'state',
		align: 'center',
		hidden:true,
		width: 130,
		renderer: function (value) {
			if (value == '0') {
				return '正常'
			} else {
				return value
			}
		}
	}]);

	/**
	 * 数据存储
	 */
	var store = new Ext.data.Store({
		// 获取数据的方式
		proxy: new Ext.data.HttpProxy({
			url: 'http://localhost:8080/jdurfid/ordDayList.ered?reqCode=queryOrdDayList'
		}),
		reader: new Ext.data.JsonReader({
			totalProperty: 'TOTALCOUNT',
			root: 'ROOT'
		}, [
			{
				name: 'seq_no'
			},
			{
				name: 'tr_date'
			},
			{
				name: 'grp_name'
			},
			{
				name: 'dept_name'
			},
			{
				name: 'team_name'
			},
			{
				name: 'order_id'
			},
			{
				name: 'brand'
			},
			{
				name: 'style_no'
			},
			{
				name: 'nature'
			},
			{
				name: 'amount'
			},
			{
				name: 'opr_id'
			},
			{
				name: 'opr_time'
			},
			{
				name: 'state'
			},
			{
				name: 'opr_name'
			},
			{
				name: 'ord_status'
			},
			{
				name: 'dept_status'
			}
		])
	});


	// 翻页排序时带上查询条件
	store.on('beforeload', function () {
		this.baseParams = {
            order_id:Ext.getCmp('ord_seq_no').getValue(),
            tr_date:Ext.getCmp('tr_date').getValue(),
			natures: nature_combo.getValue()
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
		value: '100',
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

	var nature_combo = new Ext.ux.form.LovCombo({
		name: 'value',
		id: 'nature_combo',
		hiddenName: 'value',
		store: new Ext.data.ArrayStore({
			fields: ['value', 'text'],
			data: [
				['0', '标签入库'],
				['1', '裁出数量'],
				['2', '缝制领片'],
				['3', '缝制下线'],
				['4', '水洗收货'],
				['5', '水洗移交'],
				['6', '后整收货'],
				['7', '移交成品'],
				['8', '移交B品'],
                ['10','收成品'],
                ['11','收B品'],
                ['12','中间领用'],
                ['13','送水洗']
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
		anchor: "99%"
	});

	// 表格工具栏
	var tbar = new Ext.Toolbar({
		items: ['订单号 ',{
                xtype:'textfield',
                id:'ord_seq_no',
                emptyText:'订单号'
            },
			'数量性质', nature_combo,'日期 ',{
                xtype:'datefield',
                id:'tr_date',
                format:'Y-m-d',
                emptyText:'选择日期',
                editable:true
            }, '-', {
                text: '查询',
                iconCls: 'previewIcon',
                xtype: "button",
                handler: function () {
                    queryEpcDayList();
                }
            }, '->', {
				text: '导入记录',
				iconCls: 'page_excelIcon',
				xtype: "button",
				handler: function () {
					importwindow.show();
				}
			}, {
				text: '导出记录',
				id: 'import_button',
				hidden: true,
				iconCls: 'page_excelIcon',
				handler: function () {
					exportExcel('./manageEpcDay.ered?reqCode=excleDeptInfoAction');
				}
			}]
	});

	// 表格实例
	var grid = new Ext.grid.GridPanel({
		// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
		height: 500,
		//frame: true,
        border:false,
		region: 'center', // 和VIEWPORT布局模型对应，充当center区域布局
        margins : '3 3 3 3',
		store: store, // 数据存储
		stripeRows: true, // 斑马线
		cm: cm, // 列模型
        sm:sg,
		tbar: tbar, // 表格工具栏
		bbar: bbar,// 分页工具栏
		loadMask: {
			msg: '正在加载表格数据,请稍等...'
		}
	});

	//导入
	var importformpanel = new Ext.form.FormPanel({
		id: 'importformpanel',
		name: 'importformpanel',
		defaultType: 'textfield',
		labelAlign: 'right',
		labelWidth: 105,
		width: 280,
		height: 220,
		frame: true,
		fileUpload: true,
		items: [
			{
				fieldLabel: '导入文件(Excel)',
				name: 'theFile',
				id: 'theFile',
				inputType: 'file',
				allowBlank: false,
				blankText: "请选择导入文件",
				anchor: '94%'
			},
			{
				xtype: "label",
				labelStyle: 'color:red;width=60px;',
				html: "<SPAN STYLE='COLOR:blue'><a href='./cnnct/template/ordDayList.xlsx' target='_blank'>Excel模板文件</a></SPAN>",
				anchor: '99%'
			}
		]
	});

	var importwindow = new Ext.Window({
		layout: 'fit',
		width: 400,
		height: 200,
		resizable: false,
		draggable: false,
		closeAction: 'hide',
		title: '导入Excel',
		modal: false,
		collapsible: true,
		titleCollapse: true,
		maximizable: false,
		buttonAlign: 'right',
		border: false,
		animCollapse: true,
		animateTarget: Ext.getBody(),
		constrain: true,
		items: [importformpanel],
		buttons: [
			{
				text: '导入',
				iconCls: 'acceptIcon',
				handler: function () {
					var theFile = Ext.getCmp('theFile').getValue();
					if (Ext.isEmpty(theFile)) {
						Ext.Msg.alert('提示', '请先选择您要导入的xls文件或.xlsx文件。');
						return;
					}

					if (theFile.substring(theFile.length - 4, theFile.length) != ".xls" &&
						theFile.substring(theFile.length - 5, theFile.length) != ".xlsx") {
						Ext.Msg.alert('提示', '您选择的文件格式不对,只能导入.xls文件或.xlsx文件!');
						return;
					}

					importformpanel.getForm().submit({
						url: 'ordDayList.ered?reqCode=importOrdScheList',
						waitTitle: '提示',
						method: 'POST',
						waitMsg: '正在处理数据,请稍候...',
						success: function (form, action) {
							importwindow.hide();
							clearFormPanel(importformpanel);
							queryEpcDayList();
							Ext.Msg.alert('提示', action.result.msg);
						},
						failure: function (form, action) {
							Ext.Msg.alert('提示', action.result.msg);
						}
					});
				}
			},
			{
				text: '关闭',
				id: 'btnReset',
				iconCls: 'deleteIcon',
				handler: function () {
					importwindow.hide();
				}
			}
		]
	});

	/**
	 * 布局
	 */
	var viewport = new Ext.Viewport({
		layout: 'border',
		items : [{
            region : 'center',
            layout : 'fit',
            margins : '3 3 3 3',
            items : [grid]
        }]
	});

	/**
	 * 查询项目列表
	 */
	function queryEpcDayList() {
		var natures = nature_combo.getValue();
		store.load({
			params: {
                order_id:Ext.getCmp('ord_seq_no').getValue(),
                tr_date:Ext.getCmp('tr_date').getValue(),
				natures: natures,
				start: 0,
				limit: bbar.pageSize
			}
		});
	}

	queryEpcDayList();

	function transformNatureValue(value) {
		if (value == '0') {
			return '标签入库';
		} else if (value == '1') {
			return '裁出数量';
		} else if (value == '2') {
			return '缝制领片';
		} else if (value == '3') {
			return '缝制下线';
		} else if (value == '4') {
			return '水洗收货';
		} else if (value == '5') {
			return '水洗移交';
		} else if (value == '6') {
			return '后整收货';
		} else if (value == '7') {
			return '移交成品';
		} else if (value == '8') {
			return '移交B品';
		} else if (value == '9') {
			return '标签解绑';
		} else if (value == '10'){
            return '收成品';
        } else if (value == '11'){
            return '收B品';
        } else if (value == '12'){
            return '中间领用';
        } else if(value == '13'){
            return '送水洗';
        }
	}
});