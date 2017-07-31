/**
 * 考勤班次设置
 */
Ext.onReady(function() {
	var re = '<span style="color:red">*</span>';
	var rs = '<span style="color:Red">(*为必填项)</span>';

	var team_grp_no = deptid;//班组号 root*-父部门   dept*-本级部门 user*-用户群组号
	var team_grp_name = deptname;//
	var state = 'query';
	var teamGrpNode;
	var grp_type ="";//班组类型  dept-部门 user-员工组
	
	var s_cm = new Ext.grid.ColumnModel( [new Ext.grid.RowNumberer(),{
			header : '群组名称',
			align : 'center',
			dataIndex : 'name',
			width : 140
		}, {
			header : '所属部门',
			align : 'center',
			dataIndex : 'deptname',
			width : 130
		}, {
			header : '登记人',
			align : 'center',
			dataIndex : 'opr_name',
			width : 90
		},{
			header : '状态',
			align : 'center',
			dataIndex : 'state',
			width : 50
		},{
			header : '群组描述',
			align : 'center',
			dataIndex : 'remark',
			width : 200
		}]);


		/**
		 * 数据存储
		 */
		var s_store = new Ext.data.Store( {
			proxy : new Ext.data.HttpProxy( {
				url : './manageTeam.ered?reqCode=queryTeamGrpInfo'
			}),
			reader : new Ext.data.JsonReader( {
				totalProperty : 'TOTALCOUNT',
				root : 'ROOT'
			}, [ {
				name : 'name'
			}, {
				name : 'type'
			}, {
				name : 'deptname'
			},{
				name : 'opr_name'
			},{
				name: 'remark'
			},{
				name: 'state'
			}])
		});
		
		
		var s_grid = new Ext.grid.GridPanel(
				{
					title : "详细信息",
					height : 500,
					hidden:true,
					autoScroll : true,
					region : 'center',
					store : s_store,
					loadMask : {
						msg : '正在加载表格数据,请稍等...'
					},
					stripeRows : true,
					frame : true,
					cm : s_cm,
					tbar:[ '-', {
					text : '关闭',
					iconCls : 'deleteIcon',
					handler : function() {
							manageTeamCenter.getLayout().setActiveItem(0);
						}
						
					}]
				});
	
	teamGrpNode = new Ext.tree.AsyncTreeNode( {
		text : deptname,
		expanded : true,
		iconCls:"folder_userIcon",
		id : 'root'+deptid
	});
	
	var areaTree = new Ext.tree.TreePanel( {
		loader : new Ext.tree.TreeLoader( {
			dataUrl : './manageTeam.ered?reqCode=teamGrpListTreeInit'
		}),
		animate : false,
		root:teamGrpNode,
		autoScroll : false,
		useArrows : false,
		border : false,
		rootVisible : false,
		title:""
	});
	
	areaTree.on('click', function(node) {
			teamGrpNode = node;
			var id = node.id;
			team_grp_no = id.substring(4,id.length);
			grp_type = id.substring(0,4);
			
			if (node.text.lastIndexOf('(') == -1) {
				team_grp_name = node.text;
			} else {
				team_grp_name = node.text.substring(0, node.text.lastIndexOf('('));
			}
			
			var title = setTitleString(teamGrpNode,"查询");
			deptTree.setTitle(title);
			
			state = 'query';
			setButtonStatus();//设置按钮状态
			
			deptTree.root.reload();
			manageTeamCenter.getLayout().setActiveItem(0);
		});
		
		areaTree.on('append', function(tree, node){ //如果有子节点的话,
	       	Ext.getCmp("addButton").setDisabled(true);
			Ext.getCmp("delButton").setDisabled(true);
   		});
		
		var tree_root = new Ext.tree.AsyncTreeNode({
						text : '部门树',
						expanded : true,
						id : '001'
					});
		
		var treeLoader = new Ext.tree.TreeLoader({
									dataUrl : './manageTeam.ered?reqCode=queryTeamGrpList'
								});
		treeLoader.on("beforeload", function(treeLoader, node) {
	        treeLoader.baseParams.team_grp_no =team_grp_no;
	        treeLoader.baseParams.grp_type =grp_type;
	        treeLoader.baseParams.state =state;
	    }, this);

		var deptTree = new Ext.tree.TreePanel({
				loader : treeLoader,
				title : setTitleString(teamGrpNode,"查询"),
				root : tree_root,
				autoScroll : true,
				animate : false,
				tbar : [ {
				text : '新增',
				id:'addButton',
				iconCls : 'page_addIcon',
				handler : function() {
					state = 'add';
					deptTree.root.reload();
					var title = setTitleString(teamGrpNode,"新增");
					deptTree.setTitle(title);
					setButtonStatus();
					}
				}, '-', {
				text : '删除',
				iconCls : 'page_delIcon',
				id:'delButton',
				handler : function() {
					if(!tree_root.hasChildNodes()){
						Ext.Msg.alert('提示','该班组下没有数据!');
						return;
					}
					var title = setTitleString(teamGrpNode,"删除");
					deptTree.setTitle(title);
						
					state = 'del';//用于保存时判断
					deptTree.root.reload();
					
					setButtonStatus();
					}
			}, '-', {
				text : '刷新',
				id:'queryButton',
				iconCls : 'previewIcon',
				handler : function() {
					state = 'query';
					setButtonStatus();
					deptTree.root.reload();
				}
			}, '->', {
				text : '保存',
				id:'saveButton',
				disabled:true,
				iconCls : 'acceptIcon',
				handler : function() {
					
					var userInfo = ""+deptTree.getChecked('id');
					
					if(Ext.isEmpty(userInfo)){
						Ext.Msg.alert('提示',"您没有选中任何数据!");
						return;
					}
					
					if(state=='add'){
						Ext.Msg.confirm('提示','&nbsp;&nbsp;你确定要新增所选数据吗?</span>',
							function(btn, text) {
								if (btn == 'yes') {
										saveCtrlDoorInfo(userInfo);
									}else{
										return;
									}
								});
						}else if(state=='del'){
							Ext.Msg.confirm('请确认','<span style="color:red">&nbsp;&nbsp;你确定做<删除>操作吗?</span>',
							function(btn, text) {
								if (btn == 'yes') {
										delCtrlDoorInfo(userInfo);
									}else{
										return;
									}
								});
						}
					
				}
			}, '-', {
				text : '取消',
				iconCls : 'deleteIcon',
				id:'cancelButton',
				disabled:true,
				handler : function() {
					var title = setTitleString(teamGrpNode,"查询");
					deptTree.setTitle(title);
					
					state = 'query';
					setButtonStatus();
					deptTree.root.reload();
				}
			} ],
				renderTo : 'treeDiv',
				width : 650, // 必须指定,否则显示有问题
				//height : 400,
				useArrows : true,
				border : true,
				rootVisible : false
			});
		
		deptTree.on("click",function(node){
			
		});
		
		
		/** 添加区域 */
		var addAreaFormPanel = new Ext.form.FormPanel( {
			id : 'addAreaFormPanel',
			name : 'addAreaFormPanel',
			defaultType : 'textfield',
			labelAlign : 'right',
			labelWidth : 70,
			frame : true,
			items : [ {
				fieldLabel : '所属部门'+re,
				name : 'deptname',
				id:'deptname',
				readOnly:true,
				allowBlank : false,
				anchor : '99%'
			},{
				fieldLabel : '班组名称'+re,
				name : 'name',
				allowBlank : false,
				anchor : '99%'
			},{
				fieldLabel : '班组描述',
				name : 'remark',
				anchor : '99%'
			},{
				name : 'deptid',
				hidden:true,
				id : 'deptid',
				anchor : '99%'
			}]
		});
		
		var grpDefWindow = new Ext.Window( {
			layout : 'fit',
			width : 390, // 添加子窗口 高度
			height : 200, // 添加 窗口宽度
			resizable : false,
			draggable : true,
			closeAction : 'hide',
			title : '新增班组'+rs,
			iconCls : 'page_addIcon',
			modal : true,
			collapsible : true,
			titleCollapse : true,
			maximizable : false,
			buttonAlign : 'right',
			border : false,
			animCollapse : true,
			pageY : 60,
			pageX : document.body.clientWidth / 2 - 600 / 2,
			animateTarget : Ext.getBody(),
			constrain : true,
			items : [ addAreaFormPanel ],
			buttons : [ {
				text : '保存',
				iconCls : 'acceptIcon',
				handler : function() {
					if (!addAreaFormPanel.form.isValid()) {
						return;
					}
					addAreaFormPanel.form.submit( {
						url : './manageTeam.ered?reqCode=saveTeamGrpInfo',
						waitTitle : '提示',
						method : 'POST',
						waitMsg : '正在处理数据,请稍候...',
						success : function(form, action) {
							grpDefWindow.hide();
							form.reset();
							teamGrpNode.parentNode.reload();
					},
					failure : function(form, action) {
						var msg = action.result.msg;
						Ext.MessageBox.alert('提示', msg);
					}
					});
				}
			}, {
				text : '关闭',
				iconCls : 'deleteIcon',
				handler : function() {
					addAreaFormPanel.form.reset();
					grpDefWindow.hide();
				}
			} ]
		});
		/**
		 * 班组管理中间部分
		 */
		var manageTeamCenter = new Ext.Panel({
			title:'',
			region: 'center',
			layout: 'card',
			activeItem: 0,
			labelAlign: "right",
			labelWidth: 70,
			frame: false,
            border : false,
            margins : '3 3 3 0',
			items: [
				deptTree, s_grid
			]
		});
		/**
		 * 批量导入文件选择界面 -from
		 */
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
				html: "<SPAN STYLE='COLOR:blue'><a href='./cnnct/template/teamInfo.xlsx' target='_blank'>Excel模板文件</a></SPAN>",
				anchor: '99%'
			}
		]
	});
		/**
		 * 批量导入文件选择界面
		 */
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
						url: 'manageTeam.ered?reqCode=importTeamInfo',
						waitTitle: '提示',
						method: 'POST',
						waitMsg: '正在处理数据,请稍候...',
						success: function (form, action) {
							importwindow.hide();
							clearFormPanel(importformpanel);	
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
		var viewport = new Ext.Viewport( {
			layout : 'border',
			items : [{
				title : '<span style="font-weight:bold">班组管理</span>',
				iconCls : 'chart_organisationIcon',
				tools : [ {
					id : 'refresh',
					handler : function() {
						areaTree.root.reload();
				}
				}],
				width : 220,
				minSize : 220,
				maxSize : 280,
				split : true,
				collapsible : true,
				region : 'west',
                margins : '3 0 3 3',
				autoScroll : true,
				items : [ areaTree ],
				tbar : [{
							text : '新增',
							iconCls : 'page_addIcon',
							id:'grp_addButton',
							disabled:true,
							handler : function() {
								Ext.getCmp("deptname").setValue(team_grp_name);
								Ext.getCmp("deptid").setValue(team_grp_no);
								grpDefWindow.show();
							}
						}, '-',{
							text:'增加班组导入',
							iconCls:'page_excelIcon',
							id:'team_excelAddButton',
							handler : function(){
								importwindow.show();
							}
							
						},'-', {
							text : '删除',
							iconCls : 'page_delIcon',
							id:'grp_delButton',
							disabled:true,
							handler : function() {
								delTeamGrpInfo();
							}
						}, '-', {
							text : '详细',
							iconCls : 'page_edit_1Icon',
							id:'grp_detailButton',
							disabled:true,
							handler : function() {
								if(team_grp_no==''){
									Ext.Msg.alert('提示','没有选中的班组信息');
									return;
								}
								s_store.load( {
										params : {
											team_grp_no:team_grp_no
											}
									});
								s_grid.setTitle(setDetailTitle(team_grp_name));
								manageTeamCenter.getLayout().setActiveItem(1);

						}
				}]
			}, 
			manageTeamCenter
			]
		});

		/*
		 * 删除班组信息
		 * @return {TypeName} 
		 */
		function delTeamGrpInfo(){
			var name ="";
			if(grp_type=='grps'){
				name = team_grp_name+"班组";
			}else{
				name = team_grp_name+"下所有班组";
			}
			Ext.Msg.confirm('请确认','<span style="color:red">&nbsp;&nbsp;&nbsp;&nbsp;你确定要删除</br>'+name+'吗?</span>',
				function(btn, text) {
					if (btn == 'yes') {
						Ext.Ajax.request({
							url : './manageTeam.ered?reqCode=delTeamGrpInfo',
							success : function(response) {
								var resultArray = Ext.util.JSON.decode(response.responseText);
								if(!resultArray.success){
									Ext.Msg.alert('提示',resultArray.msg );
								}
								teamGrpNode = areaTree.root;
								team_grp_no = areaTree.root.id.substring(4,id.length);
								areaTree.root.reload();
								var title = setTitleString(teamGrpNode,"查询");
								deptTree.setTitle(title);
								state ='query';
								
								deptTree.root.reload();
							},
							failure : function(response) {
								var resultArray = Ext.util.JSON.decode(response.responseText);
								Ext.Msg.alert('提示', "班组删除失败");
							},
							params : {
								team_grp_no : team_grp_no
							}
						});
					} else {
						return;
					}
				});
		}
		
		/**
		 * 删除区域门禁信息
		 * @return {TypeName} 
		 */
		function delCtrlDoorInfo(userInfo){
			showWaitMsg("正在删除数据");
			Ext.Ajax.request({
				url : './manageTeam.ered?reqCode=delTeamGrpList',
				success : function(response) {
					hideWaitMsg();
					var title = setTitleString(teamGrpNode,"查询");
					deptTree.setTitle(title);
					state = 'query';
					setButtonStatus();
					deptTree.root.reload();
					areaTree.root.reload();
				},
				failure : function(response) {
					hideWaitMsg();
					var resultArray = Ext.util.JSON.decode(response.responseText);
					Ext.Msg.alert('提示', "班组信息设置删除失败");
				},
				params : {
					team_grp_no : team_grp_no,
					userInfo:userInfo
				}
			});
					
		}
		
		/**
		 * 保存班组人员信息
		 * @return {TypeName} 
		 */
		function saveCtrlDoorInfo(userInfo){
			showWaitMsg("正在保存数据");
			Ext.Ajax.request({
				url : './manageTeam.ered?reqCode=saveTeamGrpList',
				success : function(response) {
//					var resultArray = Ext.util.JSON.decode(response.responseText);
//					Ext.Msg.alert('提示', resultArray.msg);
					hideWaitMsg();
					var title = setTitleString(teamGrpNode,"查询");
					deptTree.setTitle(title);
					state = 'query';
					setButtonStatus();
					deptTree.root.reload();
					areaTree.root.reload();
				},
				failure : function(response) {
					hideWaitMsg();
					var resultArray = Ext.util.JSON.decode(response.responseText);
					Ext.Msg.alert('提示', "班组信息保存失败");
				},
				params : {
					team_grp_no : team_grp_no,
					userInfo:userInfo
				}
			});
		}
		
		//设置按钮状态
		function setButtonStatus(){
			if(state=='query'){
				if(grp_type=='grps'){
					Ext.getCmp("grp_addButton").setDisabled(true);
					Ext.getCmp("grp_delButton").setDisabled(false);
					Ext.getCmp("grp_detailButton").setDisabled(false);
					Ext.getCmp("addButton").setDisabled(false);
					Ext.getCmp("delButton").setDisabled(false);	
				}else if (grp_type=='leav'){
					Ext.getCmp("grp_addButton").setDisabled(true);
					Ext.getCmp("grp_delButton").setDisabled(true);
					Ext.getCmp("grp_detailButton").setDisabled(true);
					Ext.getCmp("addButton").setDisabled(true);
					Ext.getCmp("delButton").setDisabled(true);
				}else if (grp_type=='dept'){
					Ext.getCmp("grp_addButton").setDisabled(false);
					Ext.getCmp("grp_delButton").setDisabled(false);
					Ext.getCmp("grp_detailButton").setDisabled(true);
					Ext.getCmp("addButton").setDisabled(true);
					Ext.getCmp("delButton").setDisabled(true);
				}else if (grp_type=='root'){
					Ext.getCmp("grp_addButton").setDisabled(true);
					Ext.getCmp("grp_delButton").setDisabled(true);
					Ext.getCmp("grp_detailButton").setDisabled(true);
					Ext.getCmp("addButton").setDisabled(true);
					Ext.getCmp("delButton").setDisabled(true);
				}
				Ext.getCmp("queryButton").setDisabled(false);
				Ext.getCmp("saveButton").setDisabled(true);
				Ext.getCmp("cancelButton").setDisabled(true);
			}else{
				Ext.getCmp("addButton").setDisabled(true);
				Ext.getCmp("delButton").setDisabled(true);
				Ext.getCmp("queryButton").setDisabled(true);
				Ext.getCmp("saveButton").setDisabled(false);
				Ext.getCmp("cancelButton").setDisabled(false);
			}
		}
		
		function setTitleString(teamGrpNode,model){
			var name;
			if (teamGrpNode.text.lastIndexOf('(') == -1) {
				name = teamGrpNode.text;
			} else {
				name = teamGrpNode.text.substring(0, teamGrpNode.text.lastIndexOf('('));
			}
			var titleString ="<table width='100%' style='font-weight:bold;color:#15428B;font-size:13px;'><tr><td align='left'>" +
			"<img src='./resource/image/ext/building.png' align='bottom' class='IEPNG'>人员信息" +
			"</td><td align='center'>当前部门: "+name+
			"</td><td align='right'>编辑状态:"+model+"</td></tr></table>";
			return titleString;
		}
		
		//设置详细的头标题
		function setDetailTitle(team_grp_name){
			var titleString ="<table width='100%' style='font-weight:bold;color:#15428B;font-size:13px;'>" +
			"<tr><td align='left'></td><td align='center'>"+
			"<img src='./resource/image/ext/folder_wrench.png' align='bottom' class='IEPNG'>"+team_grp_name+"详细信息"+
			"</td><td align='right'></td></tr></table>";
			return titleString;
		}
		
	});