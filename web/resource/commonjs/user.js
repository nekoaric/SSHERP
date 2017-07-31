/**
 *
 * @param config config 中属性有 sm_check_model-grid单选多选;dept_id-部门树部门id;dept_name-部门树名称
 *                             crdNoIsNull-查询时卡号是否为空;userState:查询时人员状态
 * @return {Ext.grid.GridPanel}
 */
function createUserWindow(config) {
	var deptid = config.dept_id;

	var s_sm = new Ext.grid.CheckboxSelectionModel({
		singleSelect: config.sm_check_model
	});

	/** 定义列表显示区块 */
	var s_cm = new Ext.grid.ColumnModel([ s_sm, {
		header: '',
		align: 'center',
		dataIndex: 'account',
		width: 99,
		hidden: true
	}, {
		header: '部门编号',
		align: 'center',
		dataIndex: 'deptid',
		width: 99,
		hidden: true
	}, {
		header: '部门',
		align: 'center',
		dataIndex: 'deptname',
		width: 99,
		sortable: true
	}, {
		header: '工号',
		align: 'center',
		dataIndex: 'per_no',
		width: 99,
		sortable: true
	}, {
		header: '姓名',
		align: 'center',
		dataIndex: 'username',
		width: 99,
		sortable: true
	}, {
		header: '身份证号',
		align: 'center',
		dataIndex: 'id_crd',
		width: 120,
		sortable: true,
		renderer: function (value) {
			var str = new String(value);
			if (str != '') {
				var len = str.length;
				if (len >= 15) {
					var str1 = value.substr(0, 5);
					var str2 = '******';
					var str3 = value.substr(10, len - 10);
					return str1 + str2 + str3;
				}
				return value;
			} else {
				return value;
			}
		}
	}, {
		header: '卡号',
		align: 'center',
		dataIndex: 'crd_no',
		width: 130,
		sortable: true
	}]);
	/**
	 * 数据存储
	 */
	var s_store = new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: './user.ered?reqCode=getUserInfo'
		}),
		reader: new Ext.data.JsonReader({
			totalProperty: 'TOTALCOUNT',
			root: 'ROOT'
		}, [
			{
				name: 'deptid'
			},
			{
				name: 'deptname'
			},
			{
				name: 'account'
			},
			{
				name: 'per_no'
			},
			{
				name: 'username'
			},
			{
				name: 'crd_no'
			},
			{
				name: 'id_crd'
			}
		]),
		remoteSort: true
	});

	s_store.on('beforeload', function () {
		this.baseParams = {
			deptid: deptid,
			perno: Ext.getCmp("perno").getValue(),
			username: Ext.getCmp("username").getValue(),
			id_crd: Ext.getCmp("id_crd").getValue(),
			crdNoIsNull: config.crdNoIsNull,
			userState: config.userState
		};
	});

	var s_pagesize_combo = new Ext.form.ComboBox({
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

	var s_number = parseInt(s_pagesize_combo.getValue());
	s_pagesize_combo.on("select", function (comboBox) {
		s_bbar.pageSize = parseInt(comboBox.getValue());
		s_number = parseInt(comboBox.getValue());
		s_store.reload({
			params: {
				start: 0,
				limit: s_bbar.pageSize
			}
		});
	});

	var s_bbar = new Ext.PagingToolbar({
		pageSize: s_number,
		store: s_store,
		displayInfo: true,
		displayMsg: '显示{0}条到{1}条,共{2}条',
		plugins: new Ext.ux.ProgressBarPager(), // 分页进度条
		emptyMsg: "没有符合条件的记录",
		items: ['-', '&nbsp;&nbsp;', s_pagesize_combo]
	});

	var addRoot = new Ext.tree.AsyncTreeNode({
		text: config.dept_name,
		id: config.dept_id,
		expanded: true
	});

	var addDeptTree = new Ext.tree.TreePanel({
		loader: new Ext.tree.TreeLoader({
			dataUrl: './user.ered?reqCode=deptTreeInit'
		}),
		root: addRoot,
		autoScroll: true,
		animate: false,
		useArrows: false,
		border: false
	});

	// 监听下拉树的节点单击事件
	addDeptTree.on('click', function (node) {
		comboxWithTree.setValue(node.text);
		deptid = node.id;
		comboxWithTree.collapse();
	});

	var comboxWithTree = new Ext.form.ComboBox({
		id: 'deptid',
		store: new Ext.data.SimpleStore({
			fields: [],
			data: [
				[]
			]
		}),
		editable: false,
		value: ' ',
		emptyText: '请选择...',
		anchor: '100%',
		mode: 'local',
		triggerAction: 'all',
		maxHeight: 390,
		// 下拉框的显示模板,addDeptTreeDiv作为显示下拉树的容器
		tpl: "<tpl for='.'><div style='height:390px'><div id='addDeptTreeDiv'></div></div></tpl>",
		allowBlank: false,
		onSelect: Ext.emptyFn
	});
	// 监听下拉框的下拉展开事件
	comboxWithTree.on('expand', function () {
		// 将UI树挂到treeDiv容器
		addDeptTree.render('addDeptTreeDiv');
		addDeptTree.root.expand(); //只是第一次下拉会加载数据
		//						addDeptTree.root.reload(); // 每次下拉都会加载数据

	});

	var s_grid = new Ext.grid.GridPanel({
		store: s_store,
		id: 'userGrid',
		border: true,
		title: "选择人员",
		loadMask: {
			msg: '正在加载表格数据,请稍等...'
		},
		stripeRows: true,
		frame: true,
		cm: s_cm,
		sm: s_sm,
		bbar: s_bbar,
		tbar: ['-', "<SPAN STYLE='font:normal 10pt Arial'>部门：</SPAN>",
			comboxWithTree,
			'-', "<SPAN STYLE='font:normal 10pt Arial'>工号：</SPAN>",
			new Ext.form.TextField({
				id: 'perno',
				name: 'perno',
				enableKeyEvents: true,
				listeners: {
					specialkey: function (field, e) {
						if (e.getKey() == Ext.EventObject.ENTER) {
							queryUserInfo();
						}
					}
				},
				width: 60
			}),
			'-', "<SPAN STYLE='font:normal 10pt Arial'>姓名：</SPAN>",
			new Ext.form.TextField({
				id: 'username',
				name: 'username',
				enableKeyEvents: true,
				listeners: {
					specialkey: function (field, e) {
						if (e.getKey() == Ext.EventObject.ENTER) {
							queryUserInfo();
						}
					}
				},
				width: 60
			}) ,
			'-', "<SPAN STYLE='font:normal 10pt Arial'>身份证号:</SPAN>",
			new Ext.form.TextField({
				id: 'id_crd',
				name: 'id_crd',
				enableKeyEvents: true,
				listeners: {
					specialkey: function (field, e) {
						if (e.getKey() == Ext.EventObject.ENTER) {
							queryUserInfo();
						}
					}
				},
				width: 100
			}),
			'->', {
				text: '查询',
				id: 'queryButton',
				iconCls: 'previewIcon',
				handler: function () {
					queryUserInfo();
				}},
			'-', {
				text: '重置',
				iconCls: 'tbar_synchronizeIcon',
				handler: function () {
					comboxWithTree.reset();
					deptid = '';
					Ext.getCmp('perno').setValue("");
					Ext.getCmp('username').setValue("");
					Ext.getCmp('id_crd').setValue("");
				}}]
	});

	function queryUserInfo() {
		s_store.load({
			params: {
				start: 0,
				limit: s_bbar.pageSize,
				deptid: deptid,
				perno: Ext.getCmp("perno").getValue(),
				username: Ext.getCmp("username").getValue(),
				id_crd: Ext.getCmp("id_crd").getValue(),
				crdNoIsNull: config.crdNoIsNull,
				vstDept: config.vstDept,
				userState: config.userState
			}
		});
	};
	return s_grid;
}
