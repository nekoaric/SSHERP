/**
 * 首页部分JS
 *
 * @author XiongChun
 * @since 2010-03-13
 */
Ext.onReady(function () {
	var themeButton = new Ext.Button({
		text: '全屏显示',
		iconCls: 'themeIcon',
		iconAlign: 'left',
		scale: 'medium',
		width: 50,
		tooltip: '<span style="font-size:12px">切换系统主题样式</span>',
		pressed: true,
		arrowAlign: 'right',
		renderTo: 'themeDiv',
		handler: function () {
			Ext.getCmp('northPanel').collapse();
			Ext.getCmp('westPanel').collapse();
		}
	});

	var mainMenu = new Ext.menu.Menu({
		id: 'mainMenu',
		items: [
			{
				text: '修改个人信息',
				iconCls: 'userIcon',
				handler: function () {
					Ext.getCmp('closeBtm').setVisible(true);
					updateUserInit();
				}
			},
			{
				text: '布局设置',
				iconCls: 'layout_contentIcon',
				handler: function () {
					layoutWindowInit();
				}
			}
		]
	});

	var configButton = new Ext.Button({
		text: '修改个人信息',
		iconCls: 'config2Icon',
		iconAlign: 'left',
		scale: 'medium',
		width: 50,
		tooltip: '<span style="font-size:12px">修改个人信息</span>',
		pressed: true,
		renderTo: 'configDiv',
//		handler: function () {
//			updateUserInit();
//		}
		menu: mainMenu
	});

	var closeButton = new Ext.Button({
		text: '退出',
		iconCls: 'cancel_48Icon',
		iconAlign: 'left',
		scale: 'medium',
		width: 30,
		tooltip: '<span style="font-size:12px">切换用户,安全退出系统</span>',
		pressed: true,
		arrowAlign: 'right',
		renderTo: 'closeDiv',
		handler: function () {
			window.location.href = './login.ered?reqCode=logout';
		}
	});

	var root = new Ext.tree.TreeNode({
		text: '根节点',
		id: '00'
	});
	var node01 = new Ext.tree.TreeNode({
		text: '蓝色妖姬',
		theme: 'default',
		id: '01'
	});
	var node02 = new Ext.tree.TreeNode({
		text: '粉红之恋',
		theme: 'lightRed',
		id: '02'
	});
	var node03 = new Ext.tree.TreeNode({
		text: '金碧辉煌',
		theme: 'lightYellow',
		id: '03'
	});
	var node04 = new Ext.tree.TreeNode({
		text: '钢铁战士',
		theme: 'gray',
		id: '04'
	});
	var node05 = new Ext.tree.TreeNode({
		text: '绿水青山',
		theme: 'lightGreen',
		id: '05'
	});
	var node06 = new Ext.tree.TreeNode({
		text: '紫色忧郁',
		theme: 'purple2',
		id: '06'
	});
	root.appendChild(node01);
	root.appendChild(node02);
	root.appendChild(node03);
	root.appendChild(node04);
	root.appendChild(node05);
	root.appendChild(node06);
	var themeTree = new Ext.tree.TreePanel({
		autoHeight: false,
		autoWidth: false,
		autoScroll: false,
		animate: false,
		rootVisible: false,
		border: false,
		containerScroll: true,
		applyTo: 'themeTreeDiv',
		root: root
	});
	themeTree.expandAll();
	themeTree
		.on(
		'click',
		function (node) {
			var theme = node.attributes.theme;
			var o = document.getElementById('previewDiv');
			o.innerHTML = '<img src="./resource/image/theme/' + theme + '.jpg" />';
		});

	var previewPanel = new Ext.Panel({
		region: 'center',
		title: '<span style="font-weight:normal">主题预览</span>',
		margins: '3 3 3 0',
		activeTab: 0,
		defaults: {
			autoScroll: true
		},
		contentEl: 'previewDiv'
	});

	var themenav = new Ext.Panel(
		{
			title: '<span style="font-weight:normal">主题列表</span>',
			region: 'west',
			split: true,
			width: 120,
			minSize: 120,
			maxSize: 150,
			collapsible: true,
			margins: '3 0 3 3',
			contentEl: 'themeTreeDiv',
			bbar: [
				{
					text: '保存',
					iconCls: 'acceptIcon',
					handler: function () {
						var o = themeTree.getSelectionModel().getSelectedNode();
						saveUserTheme(o);
					}
				},
				'->',
				{
					text: '关闭',
					iconCls: 'deleteIcon',
					handler: function () {
						themeWindow.hide();
					}
				}
			]
		});

	var themeWindow = new Ext.Window({
		title: '<span style="font-weight:normal">主题设置</span>',
		closable: true,
		width: 500,
		height: 350,
		closeAction: 'hide',
		iconCls: 'theme2Icon',
		collapsible: true,
		titleCollapse: true,
		border: true,
		maximizable: false,
		resizable: false,
		modal: true,
		// border:false,
		plain: true,
		layout: 'border',
		items: [ themenav, previewPanel ]
	});

	/**
	 * 主题窗口初始化
	 */
	function themeWindowInit() {
		for (i = 0; i < root.childNodes.length; i++) {
			var child = root.childNodes[i];
			if (default_theme == child.attributes.theme) {
				child.select();
			}
		}
		var o = document.getElementById('previewDiv');
		o.innerHTML = '<img src="./resource/image/theme/' + default_theme + '.jpg" />';
		themeWindow.show();
	}

	/**
	 * 保存用户自定义主题
	 */
	function saveUserTheme(o) {
		showWaitMsg();
		Ext.Ajax.request({
			url: './index.ered?reqCode=saveUserTheme',
			success: function (response) {
				var resultArray = Ext.util.JSON.decode(response.responseText);
				Ext.MessageBox.confirm(
					'请确认',
					'您选择的[' + o.text + ']主题保存成功,立即应用该主题吗?<br>提示：页面会被刷新,请先确认是否有尚未保存的业务数据,以免丢失!',
					function (btn, text) {
						if (btn == 'yes') {
							showWaitMsg('正在为您应用主题...');
							location.reload();
						} else {
							Ext.Msg.alert(
								'提示',
								'请在任何时候按[F5]键刷新页面或者重新登录系统以启用[' + o.text + ']主题!',
								function () {
									themeWindow
										.hide();
								});

						}
					});
			},
			failure: function (response) {
				var resultArray = Ext.util.JSON.decode(response.responseText);
				Ext.Msg.alert('提示', '数据保存失败');
			},
			params: {
				theme: o.attributes.theme
			}
		});
	}

	var sexStore = new Ext.data.SimpleStore({
		fields: [ 'value', 'text' ],
		data: [
			[ '1', '男' ],
			[ '2', '女' ],
			[ '0', '未知' ]
		]
	});
	var sexCombo = new Ext.form.ComboBox({
		name: 'sex',
		hiddenName: 'sex',
		store: sexStore,
		mode: 'local',
		triggerAction: 'all',
		valueField: 'value',
		displayField: 'text',
		value: '1',
		fieldLabel: '性别',
		emptyText: '请选择...',
		allowBlank: false,
		forceSelection: true,
		editable: false,
		typeAhead: true,
		anchor: "99%"
	});
	var userFormPanel = new Ext.form.FormPanel({
		defaultType: 'textfield',
		labelAlign: 'right',
		labelWidth: 65,
		frame: false,
		bodyStyle: 'padding:5 5 0',
		items: [
			{
				fieldLabel: '系统号',
				name: 'account',
				id: 'account',
				allowBlank: false,
				readOnly: true,
				fieldClass: 'x-custom-field-disabled',
				anchor: '99%'
			},
			{
				fieldLabel: '姓名',
				name: 'user_name',
				id: 'user_name',
				allowBlank: false,
				readOnly : true,
				fieldClass: 'x-custom-field-disabled',
				anchor: '99%'
			},
			{
			     fieldLabel : '账号',
			     name : 'login_name',
			     id : 'login_name',
			     allowBlank : true,
			     anchor : '99%'
			},
			sexCombo,
			{
				fieldLabel: '原密码',
				name: 'oldpswd',
				id: 'oldpswd',
				inputType: 'password',
				allowBlank: false,
				anchor: '99%'
			},
			{
				fieldLabel: '新密码',
				name: 'password',
				id: 'password',
				inputType: 'password',
				allowBlank: false,
				anchor: '99%'
			},
			{
				fieldLabel: '确认密码',
				name: 'password1',
				id: 'password1',
				inputType: 'password',
				allowBlank: false,
				anchor: '99%'
			},
			{
				id: 'user_id',
				name: 'user_id',
				hidden: true
			}
		]
	});

	var userWindow = new Ext.Window({
		layout: 'fit',
		width: 300,
		height: 250,
		resizable: false,
		draggable: true,
		closeAction: 'hide',
		closable:false,
		modal: true,
		title: '<span style="font-weight:normal">修改个人信息</span>',
		iconCls: 'configIcon',
		collapsible: true,
		titleCollapse: true,
		maximizable: false,
		buttonAlign: 'right',
		border: false,
		animCollapse: true,
		animateTarget: Ext.getBody(),
		constrain: true,
		items: [ userFormPanel ],
		buttons: [
			{
				text: '保存',
				iconCls: 'acceptIcon',
				handler: function () {
					updateUser();
				}
			},
			{
				id:'closeBtm',
				text: '关闭',
				iconCls: 'deleteIcon',
				handler: function () {
					userWindow.hide();
				}
			}
		]
	});

	/**
	 * 加载当前登录用户信息
	 */
	function updateUserInit() {
		userFormPanel.form.reset();
		userWindow.show();
		userWindow.on('show', function () {
			setTimeout(function () {
				userFormPanel.form.load({
					waitTitle: '提示',
					waitMsg: '正在读取用户信息,请稍候...',
					url: 'index.ered?reqCode=loadUserInfo',
					success: function (form, action) {
					},
					failure: function (form, action) {
						Ext.Msg.alert('提示',
							'数据读取失败:' + action.failureType);
					}
				});
			}, 5);
		});
	}

	/**
	 * 修改用户信息
	 */
	function updateUser() {
		if (!userFormPanel.form.isValid()) {
			return;
		}
		oldpswd = Ext.getCmp('oldpswd').getValue();
		password1 = Ext.getCmp('password1').getValue();
		password = Ext.getCmp('password').getValue();
		if (oldpswd == '' || oldpswd == null) {
			Ext.Msg.alert('提示', '请输入原密码!');
			return;
		}
		if (password1 != password) {
			Ext.Msg.alert('提示', '两次输入的密码不匹配,请重新输入!');
			Ext.getCmp('password').setValue('');
			Ext.getCmp('password1').setValue('');
			return;
		}
		userFormPanel.form.submit({
			url: 'index.ered?reqCode=updateUserInfo',
			waitTitle: '提示',
			method: 'POST',
			waitMsg: '正在处理数据,请稍候...',
			success: function (form, action) {
				Ext.MessageBox.alert('提示', '登录帐户信息修改成功,请重新登入!', function () {
					window.location.href = './login.ered?reqCode=logout';
				});

			},
			failure: function (form, action) {
				var msg = action.result.msg;
				Ext.MessageBox.alert('提示', '人员数据保存失败:' + msg);
				Ext.getCmp('password').setValue('');
				Ext.getCmp('password1').setValue('');
			}
		});
	}

	/**布局设置**/
	var layout_root = new Ext.tree.TreeNode({
		text : '根节点',
		id : '00'
	});
	var layout_node01 = new Ext.tree.TreeNode({
		text : '传统经典布局',
		layout : '1',
		id : '01'
	});
	var layout_node02 = new Ext.tree.TreeNode({
		text : '个性桌面布局',
		layout : '2',
		id : '02'
	});
	layout_root.appendChild(layout_node01);
	layout_root.appendChild(layout_node02);
	var layoutTree = new Ext.tree.TreePanel({
		autoHeight : false,
		autoWidth : false,
		autoScroll : false,
		animate : false,
		rootVisible : false,
		border : false,
		containerScroll : true,
		applyTo : 'layoutTreeDiv',
		root : layout_root
	});
	layoutTree.expandAll();
	layoutTree.on('click', function(node) {
		var layout = node.attributes.layout;
		var o = document.getElementById('layout_previewDiv');
		o.innerHTML = '<img src="./resource/image/theme/layout/' + layout
			+ '.jpg" />';
	});

	var layout_previewPanel = new Ext.Panel({
		region : 'center',
		title : '<span class="commoncss">布局预览</span>',
		margins : '3 3 3 0',
		defaults : {
			autoScroll : true
		},
		contentEl : 'layout_previewDiv'
	});

	var layoutnav = new Ext.Panel({
		title : '<span class="commoncss">布局列表</span>',
		region : 'west',
		split : true,
		width : 120,
		minSize : 120,
		maxSize : 150,
		collapsible : true,
		margins : '3 0 3 3',
		contentEl : 'layoutTreeDiv',
		bbar : [{
			text : '保存',
			iconCls : 'acceptIcon',
			handler : function() {
				var o = layoutTree.getSelectionModel().getSelectedNode();
				saveUserLayout(o);
			}
		}, '->', {
			text : '关闭',
			iconCls : 'deleteIcon',
			handler : function() {
				layoutWindow.hide();
			}
		}]
	});

	var layoutWindow = new Ext.Window({
		title : '<span class="commoncss">布局设置</span>',
		closable : true,
		width : 723,
		height : 350,
		closeAction : 'hide',
		iconCls : 'app_rightIcon',
		collapsible : true,
		titleCollapse : true,
		border : true,
		maximizable : false,
		resizable : false,
		//modal : true,
		animCollapse : true,
		animateTarget : Ext.getBody(),
		// border:false,
		plain : true,
		layout : 'border',
		items : [layoutnav, layout_previewPanel]
	});

	/**
	 * 布局窗口初始化
	 */
	function layoutWindowInit() {
		for (var i = 0; i < layout_root.childNodes.length; i++) {
			var child = layout_root.childNodes[i];
			if (default_layout == child.attributes.layout) {
				child.select();
			}
		}
		var o = document.getElementById('previewDiv');
		o.innerHTML = '<img src="./resource/image/theme/layout/' + default_layout+ '.jpg" />';
		layoutWindow.show();

	}

	/**
	 * 保存用户自定义布局
	 */
	function saveUserLayout(o) {
		showWaitMsg();
		Ext.Ajax.request({
			url : './index.ered?reqCode=saveUserLayout',
			success : function(response) {
				var resultArray = Ext.util.JSON.decode(response.responseText);
				Ext.MessageBox.confirm('请确认',
					'您选择的['+ o.text+ ']' +
						'布局保存成功,立即应用该布局吗?<br>提示：页面会被刷新,请先确认是否有尚未保存的业务数据,以免丢失!',
					function(btn, text) {
						if (btn == 'yes') {
							showWaitMsg('正在为您应用布局...');
							location.reload();
						} else {
							Ext.Msg.alert('提示',
								'请在任何时候按[F5]键刷新页面或者重新登录系统以启用['
									+ o.text + ']布局!',
								function() {
									themeWindow.hide();
								});

						}
					});
			},
			failure : function(response) {
				var resultArray = Ext.util.JSON.decode(response.responseText);
				Ext.Msg.alert('提示', '数据保存失败');
			},
			params : {
				layout : o.attributes.layout
			}
		});
	}
	//首页加载完毕后，如果是初始用户，弹出修改密码的窗体
	   if(info != 'null' && info != '' && info != null){
		   alert('系统检测您为默认密码，请重置后再登入系统');
		   userFormPanel.form.reset();
		   Ext.getCmp('oldpswd').setValue('111111');
		   Ext.getCmp('closeBtm').setVisible(false);
		   userWindow.closable='false';
			userWindow.show();
			userWindow.on('show', function () {
				setTimeout(function () {
					userFormPanel.form.load({
						waitTitle: '提示',
						waitMsg: '正在读取用户信息,请稍候...',
						url: 'index.ered?reqCode=loadUserInfo',
						success: function (form, action) {
						},
						failure: function (form, action) {
							Ext.Msg.alert('提示',
								'数据读取失败:' + action.failureType);
						}
					});
				}, 5);
			});
	   }
});

/**
 * 显示系统时钟
 */
function showTime() {
	var date = new Date();
	var h = date.getHours();
	h = h < 10 ? '0' + h : h;
	var m = date.getMinutes();
	m = m < 10 ? '0' + m : m;
	var s = date.getSeconds();
	s = s < 10 ? '0' + s : s;
	document.getElementById('rTime').innerHTML = h + ":" + m + ":" + s;
}

window.onload = function () {
	setInterval("showTime()", 1000);
}