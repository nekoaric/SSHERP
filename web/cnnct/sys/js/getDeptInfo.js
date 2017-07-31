/*********************************
 * 创建日期：2013-8-5
 * 创建作者：zhouww
 * 功能：部门信息管理
 * 最后修改日期：2013-8-5
 * 修改记录：
**********************************/

Ext.onReady(function(){
	var re = "<span style='color:red'>*</span>";
	var tmp_user_cnt  = 0 ;	//该部门下的用户个数
	var tmp_subdept_cnt = 0; // 该部门下子部门个数
	var dept_id = root_dept_id;
	var flag;

	var userCntStore = new Ext.data.Store({
			proxy:new Ext.data.HttpProxy({
				url: './sysDept.ered?reqCode=getUserCntInDept'
				}),
			reader:new Ext.data.JsonReader({},[
				{
					name:'cnt'
				}
				])
	});
	
	var subDeptCntStore = new Ext.data.Store({
			proxy:new Ext.data.HttpProxy({
				url: './sysDept.ered?reqCode=getSubDeptCntInDept'
			}),
			reader:new Ext.data.JsonReader({},[{
					//定义后台返回数据格式
					name:'cnt'
				}])
	});
	
	var root = new Ext.tree.AsyncTreeNode({
			text:root_dept_name,
			expanded:true,
			iconCls: 'folder_userIcon',
			id: root_dept_id
	});
		
	var deptTree = new Ext.tree.TreePanel({
			loader:new Ext.tree.TreeLoader({
				baseAttrs: {},
				dataUrl: './sysDept.ered?reqCode=departmentTreeInit'	
			}),
			root:root,
			title:'',
			autoScroll: false,
			animate: false,
			useArrows: false,
			border: false
	});
	
	deptTree.on("click",function(node){
		Ext.getCmp('queryParam').setValue('');
		dept_id =  node.attribute.id;
		store.load({
			params:{
				start:0,
				limit:bbar.pageSize,
				dept_id:dept_id
			}
		});
		//获取单位下用户个数
		userCntStore.load({
			params:{
				dept_id:dept_id
				}
		});
		//获取单位下部门个数
		deptCntStore.load({
				params:{
					dept_id:dept_id
				}
		});
	});
	
	var sm = new Ext.grid.CheckboxSelectionModel({
		singleSelect : true
	});

	var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),sm,{
		header: "部门编号",
		dataIndex: "dept_id",
		width: 130,
		sortable: true
	},{
		header:"部门名称",
		dataIndex:"dept_name",
		width:130,
		sortable:true
	},{
		header:"上级部门",
		dataIndex:"parentdept_name",
		width:130,
		sortable:true
	},{
		header:"部门地址",
		dataIndex:"address",
		width:130,
		sortable:true
	},{
		header:"部门联系人",
		dataIndex:"lnk_name",
		width:130,
		sortable:true
	},{
		header:"联系电话",
		dataIndex:"lnk_telno",
		width:130,
		sortable:true
	},{
		header:" 备注",
		dataIndex:"remark"
	},{
		header:"节点类型",
		dataIndex:"leaf",
		hidden:true,
		renderer:function(value){
			if(value==1){
				return "叶子节点";
			}else if(value==0) {
				return "树枝节点";
			}else {
				return value;
			}
		}
	},{
		id:"parent_id",
		header:"父节点",
		hidden:true,
		dataIndex:"parent_id"
	},{
		id:"usercount",
		header:"下属用户数量"
	}]);

/**
* 数据存储
* grid
*/
var store = new Ext.data.Store({
		proxy:new Ext.data.HttpProxy({
				url: './sysDept.ered?reqCode=queryDeptsForManage'
			}),
		reader:new Ext.data.JsonReader({
				totalProperty:'TOTALCOUNT',
				root: 'ROOT'
			},[{
				name:"dept_id"
			},{
				name:"dept_name"
			},{
				name:"parentdept_name"
			},{
				name:"address"
			},{
				name:"lnk_name"
			},{
				name:"lnk_telno"
			},{
				name:"leaf"
			},{
				name:"remark"
			},{				
				name: 'parent_id'
			},{
				name: 'usercount'
			},{
				name: 'customid'
			},{
				name: 'opr_id'
			},{
				name: 'grp_id'
			}])
	});

	//翻页排序时带上查询条件
store.on("beforeload",function(){
	this.baseParams = { 
		queryParam:Ext.getCmp("queryParam").getValue(),
		dept_id:dept_id
		}
	});
/**
 * 定义下拉框
 */
var pagesize_combo = new Ext.form.ComboBox({
		name:"pagesize",
		hiddenName:'pagesize',
		typeAhead:true,
		triggerAction:'all',
		lazyRender:true,
		mode:'local',
		store:new Ext.data.ArrayStore({
			fields:['vlaue','text'],
			data:[
			      [10,'10条/页'],
			      [20,'20条/页'],
			      [50,'50条/页'],
			      [100,'100条/页'],
			      [200,'200条/页'],
			      [500,'500条/页']
			]
		}),
		valueField:'value',
		displayField:'text',
		value:'20',
		editable:false,
		width:85
	});
	// ComboBox触发执行的任务
	var number = parseInt(pagesize_combo.getValue());
	pagesize_combo.on("select",function(combo){
		bbar.pagesize = parseInt(pagesize_combo.getValue());
		number = parseInt(pagesize_combo.getValue());
		store.reload({
			params:{
				start:0,
				limit:bbar.pagesize,
				dept_id:dept_id
			}
		});
	});

	/**
	 * 定义翻页工具栏
	 */
	var bbar = new Ext.PagingToolbar({
		pagesize:number,
		store:store,
		displayInfo:true,
		displayMsg:'显示{0}条到{1}条,总共{2}条',
		emptyMsg:"没有查询记录",
		plugins:new Ext.ux.ProgressBarPager(),	//分页进度条
		items:['--','&nbsp;&nbsp;',pagesize_combo]
	});

	/**
	 * 定义数据展现grid
	 */
	var grid = new Ext.grid.GridPanel({
		title:'<img src="./resource/image/ext/building.png" align="top" class="IEPNG"><span style="font-weight:normal">部门信息表</span>',
		height:500,
		autoScroll:true,
		region:'center',
		store:store,
		loadMask:{
			msg:'数据正在加载中'
		},
		stripeRows:true,
		frame:true,
		autExpandColumn:'remark',
		cm:cm,
		sm:sm,
		tbar:[{
			text:"新增",
			id:'new_button',
			iconCls:'page_addIcon',
			handler:function(){
				addInit();
			}
		},'-',{
			text:'修改',
			id:'modify_button',
			iconCls:'page_edit_Icon',
			handler:function(){
				editInit();
			}
		},'-',{
			text:'删除',
			id:'delete_button',
			iconCls:'page_delIcon',
			handler:function(){
				deleteDeptItems();
			}
		},'-',{
			text:'批量导入',
			id:'dept_batch_import',
			iconCls:'page_addIcon',
			handler:function(){
				deptInfoImpWindow.show();
			}
		},'-',{
			text:'导出',
			iconCls:'page_refreshIcon',
			handler:function(){
				exportExcel('./sysDept.ered?reqCode=excleDeptInfoAction');
			}
		},'-',{
			text:'刷新',
			iconCls:'page_refreshIcon',
			handler:function(){
				queryDeptItem();
			}
		},'->',{
			xtype:'textfield',
			id:'queryParam',
			name:'queryParam',
			emptyText:'输入部门号',
			enableKeyEvents:true,
			listeners:{
				specialkey:function(field,e){
					if(e.getKey== Ext.EventObject.ENTER){
						queryDeptItem();
					}
				}
			}
		},{
			text:'查询',
			iconCls:'page_findIcon',
			handler:function(){
				queryDeptItem();
			}
		}],
		bbar:bbar
	});

	//第一次加载store
store.load({
	params:{
		start:0,
		limit:bbar.pagesize,
		dept_id:dept_id,
		firstload:'true'
	}
});

	//grid添加监听
	grid.addListener('rowclick',rowClickFn);
	grid.addListener('rowdbclick',rowDBClick);
	grid.addListener('sortchange',sortChange);
	
	//bbar添加监听
	bbar.addListener('change',bbarChange);
	
	
	//单击事件
	function rowClickFn(field,rowIndex,e){
		e.getSelectionModel().each(function(rowInfo){
			userCntStore.load({
				params:{
					dept_id:rowInfo.get('dept_id')
				}
			});
			deptCntStore.load({
				params:{
					dept_id:rowInfo.get('dept_id')
				}
			});
			
			store.load({
				params:{
					dept_id:rowInfo.get('dept_id')
				}
			})
		})
	}

	//grid双击事件
	function rowDBClick(field,rowIndex,e) {
		editInit();
	}
	//grid排序事件
	function sortChange(field,rowIndex,e){
		grid.getSelectionModel().selectFirstRow();
	}
	//bbar改变事件
	function bbarChange(){
		grid.getSelectionModel().selectFirstRow();
	};
	
	/**
	 * 加载树根节点
	 */
	var addRoot = new Ext.tree.AsyncTreeNode({
		text:root_dept_name,
		expanded:true,
		iconCls:'folder_userIcon',
		id:root_dept_id
	});
	
	/**
	 * 加载树节点
	 */
	var addDeptTree = new Ext.tree.TreePanel({
		root:addRoot,
		loader:new Ext.tree.TreeLoader({
			baseAttrs:{},
			dataUrl:'./sysDept.ered?reqCode=departmentTreeInit'
		}),
		autoScroll:true,
		animate:false,
		useArrows:false,
		border:false
	});
	//节点添加监听
	addDeptTree.on("click",deptTreeOpen);
	/**
	 * 节点点击事件
	 */
	function deptTreeOpen(node){
		comboxWithTree.setValue(node.attributes.text);
		Ext.getCmp('parent_id').setValue(node.attributes.id);
		comboxWithTree.collapse();
	}
	
	/**
	 * 下拉列表树
	 */
	var comboxWithTree = new Ext.form.ComboBox({
		id:'parentdept_name',
		store:new Ext.data.SimpleStore({
			fields:[],
			data:[[]]
		}),
		editable:false,
		value:'',
		emptyText:'请选择..',
		fieldLabel:'上级部门'+re,
		anchor:'95%',
		triggerAction:'all',
		mode:'local',
		maxHeight:390,
		tpl:"<tpl for='.'><div style='height:390px'><div id='addDeptTreeDiv'></div></div></tpl>",
		allowBlank:false,
		onSelect:Ext.emptyFn
	});
	//添加下拉框事件
	comboxWithTree.on('expand',comboxTreeClick);
	/**
	 * 下拉框点击事件
	 */
	function comboxTreeClick(){
		// 将UI树挂到treeDiv容器
		addDeptTree.render('addDeptTreeDiv');
		// addDeptTree.root.expand(); //只是第一次下拉会加载数据
		addDeptTree.root.reload(); // 每次下拉都会加载数据
	}
	
	/**
	 * 部门信息form
	 */
	var addDeptFormPanel = new Ext.form.FormPanel({
		id:'addDeptFormPanel',
		name:'addDeptFormPanel',
		defaultType: 'textfield',
		labelAlign: 'right',
		labelWidth: 70,
		frame: true,
		items:[{
			fieldLabel:'部门名称'+re,
			id:'dept_name',
			name:'dept_name',
			allowBlank:false,
			anchor:'95%'
		},comboxWithTree,{
			fieldLabel:'部门地址',
			id:'address',
			name:'address',
			allowBlank:true,
			anchor:'95%'
		},{
			fieldLabel:'部门联系人',
			id:'lnk_name',
			name:'lnk_name',
			allowBlank:true,
			anchor:'95%'
		},{
			fieldLabel:'联系电话',
			id:'lnk_telno',
			name:'lnk_telno',
			allowBlank:true,
			anchor:'95%'
		},{
			fieldLabel:'备注',
			id:'remark',
			name:'remark',
			height:70,
			anchor:'95%',
			xtype:'textarea',
			allowBlank:true
		},{
			id:'parent_id',
			name:'parent_name',
			hidden:true
		},{
			id:'dept_id',
			name:'dept_id',
			hidden:true
		},{
			id:'parent_id_old',
			name:'parent_id_old',
			hidden:true
		}]
	});

	/**
	 * 新增部门窗口
	 */
	var addDeptWindow = new Ext.Window({
		layout: 'fit',
		width: 350, // 添加子窗口 高度
		height: 320, // 添加 窗口宽度
		resizable: false, //窗口不可拉缩
		draggable: true,	//面板可拖动
		closeAction: 'hide',
		title: '新增部门',
		iconCls: 'page_addIcon',
		modal: false,
		collapsible: true, //窗口缩小
		titleCollapse: true,	//点击标题就可以缩小窗口
		maximizable: false,
		buttonAlign: 'right',
		border: false,
		animCollapse: true, 	//关闭面板附动画效果
		animateTarget: Ext.getBody(),
		constrain: true,	//约束在视图中显示
		items: [ addDeptFormPanel ],
		buttons: [
			{
				text: '保存',
				iconCls: 'acceptIcon',
				id: 'btn_id_save_update',
				handler: function () {
					if (flag == 'add') {
						saveDeptItem();
					} else if (flag == 'update') {
						updateDeptItem();
					}
				}
			},
			{
				text: '重置',
				id: 'btnReset',
				iconCls: 'tbar_synchronizeIcon',
				handler: function () {
					Ext.getCmp("dept_name").setValue("");
					Ext.getCmp("remark").setValue("");
				}
			},
			{
				text: '关闭',
				iconCls: 'deleteIcon',
				handler: function () {
					addDeptWindow.hide();
				}
			}
		]
	});
	
	/**
	 * 文件导入Form
	 */
	var deptInfoImpForm = new Ext.form.FormPanel({
		id: 'formpanel4Imp',
		name: 'formpanel4Imp',
		defaultType: 'textfield',
		labelAlign: 'right',
		labelWidth: 99,
		frame: true,
		labelAlign: 'right',
		fileUpload: true,
		items: [
			{
				fieldLabel: '请选择导入文件',
				name: 'theFile',
				id: 'EmpInfoTheFile',
				inputType: 'file',
				allowBlank: true,
				anchor: '99%'
			},
			{
				xtype: "label",
				fieldLabel: '说明',
				id: 'impId',
				html: "第一行标题请勿改动;<br/>中间不要有空行;<br/>红色的列为必填项"
					+ "<br/><span style='color:red'>当前导入需要验证身份证状态,如果港澳台及其他人员请选择对应导入功能</span>",
				anchor: '99%'
			},
			{
				xtype: "label",
				labelStyle: 'color:red;width=60px;',
				id: 'download_id',
				html: "<SPAN STYLE='COLOR:blue'><a href='./cnnct/template/deptInfo.xls' target='_blank'>下载Excel导入模板</a></SPAN>",
				anchor: '99%'
			}
		]
	});
	/**
	 * 文件导入窗口
	 */
	var deptInfoImpWindow = new Ext.Window({
		layout: 'fit',
		width: 380,
		height: 260,
		resizable: false,
		draggable: true,
		closeAction: 'hide',
		title: '导入部门信息',
		modal: true,
		collapsible: true,
		titleCollapse: true,
		maximizable: false,
		buttonAlign: 'right',
		border: false,
		animCollapse: true,
		animateTarget: Ext.getBody(),
		constrain: true,
		items: [ deptInfoImpForm ],
		buttons: [
			{
				text: '导入',
				iconCls: 'acceptIcon',
				handler: function () {
					var theFile = Ext.getCmp('EmpInfoTheFile').getValue();
					if (Ext.isEmpty(theFile)) {
						Ext.Msg.alert('提示', '请先选择您要导入的xls文件或.xlsx文件。');
						return;
					}

					if (theFile.substring(theFile.length - 4, theFile.length) != ".xls"
						&& theFile.substring(theFile.length - 5, theFile.length) != ".xlsx") {
						Ext.Msg.alert('提示', '您选择的文件格式不对,只能导入.xls文件或.xlsx文件!');
						return;
					}

					deptInfoImpForm.getForm().submit({
						url: './sysDept.ered?reqCode=importDeptInfo',
						waitTitle: '提示',
						method: 'POST',
						waitMsg: '正在处理数据,请稍候...',
						success: function (form, action) {
							deptTree.root.reload();
							Ext.MessageBox.alert('提示', action.result.msg);
							deptInfoImpWindow.hide();
						},
						failure: function (form, action) {
							var msg = action.result.msg;
							Ext.MessageBox.alert('提示', '部门导入失败:<br>' + msg);
						}
					});
				}
			},
			{
				text: '关闭',
				iconCls: 'deleteIcon',
				handler: function () {
					deptInfoImpWindow.hide();
				}
			}
		]
	});
	
	/**
	 * 部门信息管理布局
	 */
	var viewport = new Ext.Viewport({
		layout: 'border',
		items: [
			{
				title: '<span style="font-weight:normal">企业部门信息</span>',
				iconCls: 'chart_organisationIcon',
				tools: [
					{
						id: 'refresh',
						handler: function () {
							deptTree.root.reload()
						}
					}
				],
				collapsible: true,
				width: 210,
				minSize: 160,
				maxSize: 280,
				split: true,
				region: 'west',
				autoScroll: true,
				items: [ deptTree ]
			},
			{
				region: 'center',
				layout: 'fit',
				items: [ grid ]
			}
		]
	});//~部门信息管理布局结束
	
	/**
	 * 查询部门
	 */
	function queryDeptItem(){
		store.load({
			params:{
				start:0,
				limit:bbar.pagesize,
				queryParam:Ext.getCmp('queryParam').getValue(),
				dept_id:dept_id
			}
		});
	}//~查询部门结束

	/**
	 * 新增部门初始化
	 */
	function addInit() {
		flag = 'add';
		clearFormPanel(addDeptFormPanel);

		var selectModel = deptTree.getSelectionModel();
		var selectNode = selectModel.getSelectedNode();

		if (Ext.isEmpty(selectNode)) {
			Ext.getCmp('parentdept_name').setValue(root_dept_name);
			Ext.getCmp('parent_id').setValue(root_dept_id);
		} else {
			Ext.getCmp('parentdept_name').setValue(selectNode.attributes.text);
			Ext.getCmp('parent_id').setValue(selectNode.attributes.id);
		}
		addDeptWindow.show();
		addDeptWindow.setTitle('新增部门<span style="color:Red">(*为必填项)</span>');
		comboxWithTree.setDisabled(false);

		Ext.getCmp('btnReset').show();
	}	//~新增部门初始化结束

	/**
	 * 保存部门数据
	 */
	function saveDeptItem() {
		if (!addDeptFormPanel.form.isValid()) {
			return;
		}
		addDeptFormPanel.getForm().submit({
			url: './sysDept.ered?reqCode=saveDeptItem',
			waitTitle: '提示',
			method: 'POST',
			waitMsg: '正在处理数据,请稍候...',
			success: function (form, action) {
				addDeptWindow.hide();
				store.reload();
				refreshNode(Ext.getCmp('parent_id').getValue());
				form.reset();
				Ext.MessageBox.alert('提示', action.result.msg);
			},
			failure: function (form, action) {
				var msg = action.result.msg;
				Ext.MessageBox.alert('提示', '部门数据保存失败:<br>' + msg);
			}
		});
	}

	/**
	 * 修改部门初始化
	 */
	function editInit() {
		flag = 'update';
		var record = grid.getSelectionModel().getSelected();

		if (Ext.isEmpty(record)) {
			grid.getSelectionModel().selectFirstRow();
		}
		record = grid.getSelectionModel().getSelected();
		if (record.get('leaf') == '0' || record.get('usercount') != '0'
			|| record.get('rolecount') != '0') {
			comboxWithTree.setDisabled(true);
		} else {
			comboxWithTree.setDisabled(false);
		}
		if (record.get('dept_id') == '001') {
			var a = Ext.getCmp('parentdept_name');
			a.emptyText = '已经是顶级部门';
		}
		addDeptFormPanel.getForm().loadRecord(record);
		addDeptWindow.show();
		addDeptWindow.setTitle('修改部门<span style="color:Red">(*为必填项)</span>');
		Ext.getCmp('parent_id_old').setValue(record.get('parent_id'));
		Ext.getCmp('btnReset').hide();
	}

	/**
	 * 修改部门数据
	 */
	function updateDeptItem() {
		if (!addDeptFormPanel.form.isValid()) {
			return;
		}
		var parent_id = Ext.getCmp('parent_id').getValue();
		var parent_id_old = Ext.getCmp('parent_id_old').getValue();
		var dept_id = Ext.getCmp('dept_id').getValue();
		if (parent_id == dept_id) {
			Ext.MessageBox.alert('提示', "上级部门不能为部门本身");
			return;
		}
		addDeptFormPanel.getForm().submit({
			url: './sysDept.ered?reqCode=updateDeptItem',
			waitTitle: '提示',
			method: 'POST',
			waitMsg: '正在处理数据,请稍候...',
			success: function (form, action) {
				addDeptWindow.hide();
				store.reload();
				refreshNode(parent_id);
				if (parent_id != parent_id_old) {
					refreshNode(parent_id_old);
				}
				form.reset();
				Ext.MessageBox.alert('提示', action.result.msg);
			},
			failure: function (form, action) {
				var msg = action.result.msg;
				Ext.MessageBox.alert('提示', '部门数据修改失败:<br>' + msg);
			}
		});
	}


	/**
	 * 删除部门
	 */
	function deleteDeptItems() {
		var record = grid.getSelectionModel().getSelected();

		if (record.get('parent_id') == '001') {// 操作部门为单位根部门，不允许删除
			Ext.MessageBox.alert('提示', '根部门无法删除!');
			return;
		}

		// 判断：如将要删除部门下有子部门信息，则提示需要删除子部门信息
		if (tmp_subdept_cnt > 0) {
			Ext.Msg.alert('提示', '该部门下包含子部门信息，请先删除子部门！');
			return;
		}
		// 判断：如将要删除部门下有用户信息，则不允许删除
		if (tmp_user_cnt > 0) {
			Ext.Msg.alert('提示', '该部门下包含用户信息，无法删除！');
			return;
		}

		if (Ext.isEmpty(record)) {
			Ext.Msg.alert('提示', '请先选中要删除的部门!');
			return;
		}
		Ext.Msg.confirm('请确认',
			'<span style="color:red"><b>提示:</b>您确定删除该部门信息吗?', function (btn, text) {
				if (btn == 'yes') {
					showWaitMsg();
					Ext.Ajax.request({
						url: './sysDept.ered?reqCode=deleteDeptItems',
						success: function (response) {
							var resultArray = Ext.util.JSON.decode(response.responseText);
							store.reload();
							deptTree.root.reload();
							Ext.Msg.alert('提示', resultArray.msg);
						},
						failure: function (response) {
							var resultArray = Ext.util.JSON.decode(response.responseText);
							Ext.Msg.alert('提示', resultArray.msg);
						},
						params: {
							dept_id: record.get('dept_id')
						}
					});
				}
			});
	}

	userCntStore.on('load', function (obj) {// 返回数据格式不能写错
		tmp_user_cnt = obj.getAt(0).get('cnt');
	});
	subDeptCntStore.on('load', function (obj) {// 返回数据格式不能写错
		tmp_subdept_cnt = obj.getAt(0).get('cnt');
	});

	/**
	 * 刷新指定节点
	 */
	function refreshNode(nodeid) {
		var node = deptTree.getNodeById(nodeid);
		/* 异步加载树在没有展开节点之前是获取不到对应节点对象的 */
		if (Ext.isEmpty(node)) {
			deptTree.root.reload();
			return;
		}
		if (node.attributes.leaf) {
			node.parentNode.reload();
		} else {
			node.reload();
		}
	}
	
});//~Ext.onLoad结束
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	



