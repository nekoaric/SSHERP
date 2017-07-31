/************************************************
 * 创建日期: 2013-05-24
 * 创建作者：lingm
 * 功能：标签登记维护
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
	var sm = new Ext.grid.CheckboxSelectionModel(
		{singleSelect: true});
	var cm = new Ext.grid.ColumnModel([sm, rownum, {
		header: 'TID',
		dataIndex: 'tid',
		sortable: true,
		width: 300
	}, {
		header: '标签编号',
		dataIndex: 'epc',
		sortable: true,
		width: 200
	}, {
		header: '所处流程',
		dataIndex: 'flow',
		width: 110
	}, {
		header: '操作员',
		dataIndex: 'user_name',
		width: 80
	}, {
		header: '操作日期',
		dataIndex: 'opr_date',
		width: 100
	}, {
		header: '状态',
		dataIndex: 'state',
		width: 60
	}]);

	/**
	 * 数据存储
	 */
	var store = new Ext.data.Store({
		// 获取数据的方式
		proxy: new Ext.data.HttpProxy({
			url: './manageEpcBook.ered?reqCode=queryEpcBookListInfo'
		}),
		reader: new Ext.data.JsonReader({
			totalProperty: 'TOTALCOUNT',
			root: 'ROOT'
		}, [
			{name: 'seq_no'
			},
			{
				name: 'tid'
			},
			{
				name: 'epc'
			},
			{
				name: 'flow'
			},
			{
				name: 'opr_id'
			},
			{
				name: 'opr_date'
			},
			{
				name: 'state'
			},
			{
				name: 'user_name'
			}
		])
	});

	/**
	 * 翻页排序时候的参数传递
	 */
		// 翻页排序时带上查询条件
	store.on('beforeload', function () {
		this.baseParams = {
			epc: Ext.getCmp('epc').getValue()
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
			{
				text: '标签登记',
				id: 'fk_button',
				iconCls: 'addIcon',
				handler: function () {
					writeCrdWindow.show();
				}
			},
			'-',
			{
				text: '删除',
				id: 'delIcon',
				iconCls: 'page_delIcon',
				handler: function () {
					deleteData();
				}
			},
			'->',
			'标签编号：',
			{
				fieldLabel: '标签编号',
				name: 'epc',
				id: 'epc',
				width: 150,
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
					queryEpcBookList();
				}
			}
		]
	});

	// 表格实例
	var grid = new Ext.grid.GridPanel({
		// 表格面板标题,默认为粗体，我不喜欢粗体，这里设置样式将其格式为正常字体
		title: '<span style="font-weight:normal">单位员工信息</span>',
		height: 500,
		region: 'center', // 和VIEWPORT布局模型对应，充当center区域布局
        margins : '3 3 3 3',
		store: store, // 数据存储
		stripeRows: true, // 斑马线
		cm: cm, // 列模型
		tbar: tbar, // 表格工具栏
		bbar: bbar,// 分页工具栏
		loadMask: {
			msg: '正在加载表格数据,请稍等...'
		}
	});

	var writeCrdForm = new Ext.form.FormPanel({
		collapsible: false,
		border: true,
		labelWidth: 70, // 标签宽度
		labelAlign: 'left', // 标签对齐方式
		bodyStyle: 'padding:5 5 0', // 表单元素和表单面板的边距
		buttonAlign: 'center',
		items: [
			{
				fieldLabel: "标签编号",
				name: "tid",
				id: 'tid',
				allowBlank: false, // 是否允许为空
				xtype: "textfield",
				anchor: '99%',
				enableKeyEvents: true,
				listeners: {
					specialkey: function (field, e) {
						if (e.getKey() == Ext.EventObject.ENTER) {
							writeCardInfo();
						}
					}
				},
				fieldClass: 'x-custom-field-disabled'
			}
		]
	});

	var writeCrdWindow = new Ext.Window({
		title: '<span style="font-weight:normal">登记RFID初始信息<span>', // 窗口标题
		layout: 'fit', // 设置窗口布局模式
		width: 550, // 窗口宽度
		height: 120, // 窗口高度
		closable: false, // 是否可关闭
		collapsible: true, // 是否可收缩
		maximizable: true, // 设置是否可以最大化
		border: false, // 边框线设置
		constrain: true, // 设置窗口是否可以溢出父容器
		animateTarget: Ext.getBody(),
		items: [writeCrdForm], // 嵌入的表单面板
		buttons: [
			{
				text: '读卡并保存',
				iconCls: 'acceptIcon',
				handler: function () {
					readAndSaveTidCode();
				},
				listeners: {
					specialkey: function (field, e) {
						if (e.getKey() == Ext.EventObject.ENTER) {
							readAndSaveTidCode();
						}
					}
				}
			},
			{
				text: '读卡',
				iconCls: 'acceptIcon',
				handler: function () {
					readTidCode();
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


	/**
	 * 布局
	 */
	var viewport = new Ext.Viewport({
		layout: 'border',
		items: [ {
            region : 'center',
            layout : 'fit',
            items:[grid]
        } ]
	});

	/**
	 * 查询项目列表
	 */
	function queryEpcBookList() {
		var epc = Ext.getCmp('epc').getValue();
		store.load({
			params: {
				epc: epc,
				start: 0,
				limit: bbar.pageSize
			}
		});
	}
	queryEpcBookList();

	function writeCardInfo() {
		writeCrdForm.getForm().submit({
			url: './manageEpcBook.ered?reqCode=saveEpcBookListInfo',
			waitTitle: '提示',
			method: 'POST',
			waitMsg: '正在处理数据,请稍候...',
			success: function (form, action) { // 回调函数有2个参数
				Ext.Msg.alert("提示", action.result.msg);
				store.reload();
			},
			failure: function (form, action) {
				Ext.Msg.alert('提示', action.result.msg);
			}
		});
	}

	function deleteData() {
		var record = grid.getSelectionModel().getSelected();
		if (Ext.isEmpty(record)) {
			Ext.MessageBox.alert('提示', '您没有选中任何数据!');
			return;
		}
		// 获得选中数据后则可以传入后台继续处理
		Ext.Msg.confirm('请确认', '确认删除选中的标签信息吗?', function (btn, text) {
			if (btn == 'yes') {
				Ext.Ajax.request({
					url: './manageEpcBook.ered?reqCode=deleteEpcInfo',
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
						tid: record.get('tid')
					}
				});
			}
		});
	}

	//读取tid
	function readTidCode(){
		var rfid = ReadTidCode();
		if (rfid.state != '0') {
			Ext.Msg.alert('提示', rfid.returnCode);
			return;
		}
		Ext.getCmp('tid').setValue(rfid.returnCode);
	}

	//读取tid并保存tid信息
	function readAndSaveTidCode(){
		readTidCode();
		writeCardInfo();
	}

	//监听按钮点击事件
	document.onkeydown = function(){
		if (event.keyCode == 13) {
			if(writeCrdWindow.isVisible()){
				readAndSaveTidCode();
			}
		}
	}

});