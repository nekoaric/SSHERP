
/**
 * 登陆页面
 *
 * @author may
 * @since 2013-05-03
 */
Ext.onReady(function () {
	/**
	 * 账号下拉框
	 */
	var store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : './index.ered?reqCode=userInit'
						}),
				reader : new Ext.data.JsonReader({}, [{
									name : 'value'
								}, {
									name : 'text'
								}])
			});
	store.load();
	/**
	 * 账号下拉框
	 */
	var userCombo = new Ext.form.ComboBox({
		cls: 'user',
		fieldLabel:'帐&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号',
        name:'account',
        id:'account',
        store:store,
        displayField:'text',
        valueField:'value',
        mode:'local',
        emptyText:'请输入登录账号',
        listeners:{
			specialkey: function (field, e) {
				if (e.getKey() == Ext.EventObject.ENTER) {
					Ext.getCmp('password').focus();
				}
			}
		}
	});
	
//	userCombo.addListener('blur',function(combo,record,opts) { 
//		var temp = Ext.getCmp('password').getValue();
//		Ext.getCmp('password').setValue('');
//	})
	
	var panel = new Ext.Panel({
		el : 'hello-tabs',
		autoTabs: true,
		deferredRender: false,
		border: false,
		items: {
			xtype: 'tabpanel',
			activeTab: 0,
			height: 180,
			border: false,
			items: [
				{
					title: "身份认证",
					xtype: 'form',
					id: 'loginForm',
					defaults: {
						width: 260
					},
					bodyStyle: 'padding:20 0 0 50',
					defaultType: 'textfield',
					labelWidth: 65,
					labelSeparator: '：',
					items: [userCombo,
//						{
//							fieldLabel: '帐&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号',
//							name: 'account',
//							id: 'account',
//							cls: 'user',
//							blankText: '帐号不能为空,请输入!',
//							allowBlank: false,
//							listeners: {
//								specialkey: function (field, e) {
//									if (e.getKey() == Ext.EventObject.ENTER) {
//										Ext.getCmp('password').focus();
//									}
//								}
//							}
//						},
						{
							fieldLabel: '密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码',
							name: 'password',
							id: 'password',
							cls: 'key',
							inputType: 'textField',
							blankText: '密码不能为空,请输入!',
							autocomplete:"off",
							maxLength: 20,
							maxLengthText: '密码的最大长度为20个字符',
							allowBlank: false,
							listeners: {
								specialkey: function (field, e) {
									if (e.getKey() == Ext.EventObject.ENTER) {
										login();
									}
								}
							}
						},
						{		xtype : "label",
								labelStyle : 'color:red;width=60px;',
//								fieldLabel : '说明',
								html : "<SPAN STYLE='COLOR:red'>初次登录请及时修改密码！！！</SPAN>",
								anchor : '99%'
						},{
							name:'grp_id',
							hidden:true,
							value:'0519000001'
						}
					]
				}
//                ,
//				{   
//					title: '关于',
//					contentEl: 'aboutDiv',
//					defaults: {
//						width: 230
//					}
//				}
			]
		}
	});
	
	Ext.getCmp('password').addListener('focus',function(combo,record,opts) {
		
		var s=document.getElementById('password');
		s.type='password'
	});
	
	var win = new Ext.Window({
//		title: '常州东奥服装有限公司RFID系统',
        title : '',
		renderTo: Ext.getBody(),
		layout: 'fit',
		width: 460,
		height: 300,
		closeAction: 'hide',
		plain: true,
		modal: true,
		maximizable: false,
		draggable: false,
		closable: false,
		resizable: false,
		animateTarget: document.body,
		items: panel,
		buttons: [
			{
				text: '&nbsp;登录',
				iconCls: 'acceptIcon',
				handler: function () {
					login();
				}
			},
			{
				text: '&nbsp;重置',
				iconCls: 'tbar_synchronizeIcon',
				handler: function () {
					loginFrmReset()
				}
			}
		]
	});

	win.show();

	win.on('show', function() {
		setTimeout(function() {
			Ext.getCmp('account').focus();
		}, 200);
	}, this);
	/**
	 * 提交登陆请求
	 */
	function login() {
		if (Ext.getCmp('loginForm').form.isValid()) {
			Ext.getCmp('loginForm').getForm().submit({
				url: 'login.ered?reqCode=login',
				waitTitle: '提示',
				method: 'POST',
				waitMsg: '正在验证您的身份,请稍候.....',
				success: function (form, action) {
					window.location.href = 'index.ered?reqCode=indexInit';
				},
				failure: function (form, action) {
					var errmsg = action.result.msg;
					var errtype = action.result.errorType;
					Ext.Msg.alert('提示', errmsg, function () {
						if (errtype == '1') {
							//win.getComponent('loginForm').form.reset();
							loginFrmReset();
							var account = Ext.getCmp('loginForm').findById('account');
							account.focus();
							account.validate();
						} else {
							var password = Ext.getCmp('loginForm').findById('password');
							password.focus();
							password.setValue('');
						}
					});
				}
			});
		}
	}

	function loginFrmReset() {
		Ext.getCmp('loginForm').findById('account').reset();
		Ext.getCmp('loginForm').findById('password').reset();
	}
});
