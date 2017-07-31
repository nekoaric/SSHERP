/**
 * 地级操作员与授权
 * 
 * @author cnnct
 * @since 2010-04-20
 */
Ext.onReady(function() {
	var pwdStore = new Ext.data.Store( {
		proxy : new Ext.data.HttpProxy( {
			url : './sysGrps.ered?reqCode=randomPwd' // 后台请求地址
			}),
		reader : new Ext.data.JsonReader( {}, [ { // 定义后台返回数据格式
					name : 'newpassword'
				} ])
	});

	var re = '<span style="color:red">*</span>'
	/** 民族下拉框定义 */
	var nationStore = new Ext.data.SimpleStore( {
		fields : [ 'value', 'text' ],
		data : [ [ '1', '汉族' ], [ '2', '蒙古族' ], [ '3', '回族' ], [ '4', '藏族' ],
				[ '5', '维吾尔族' ], [ '6', '苗族' ], [ '7', '彝族' ], [ '8', '壮族' ],
				[ '9', '布依族' ], [ '10', '朝鲜族' ], [ '11', '满族' ],
				[ '12', '侗族' ], [ '13', '瑶族' ], [ '14', '白族' ],
				[ '15', '土家族' ], [ '16', '哈尼族' ], [ '17', '哈萨克族' ],
				[ '18', '傣族' ], [ '19', '黎族' ], [ '20', '傈僳族' ],
				[ '21', '佤族' ], [ '22', '畲族' ], [ '23', '高山族' ],
				[ '24', '拉祜族' ], [ '25', '水族' ], [ '26', '东乡族' ],
				[ '27', '纳西族' ], [ '28', '景颇族' ], [ '29', '柯尔克孜族' ],
				[ '30', '土族' ], [ '31', '达斡尔族' ], [ '32', '仫佬族' ],
				[ '33', '羌族' ], [ '34', '布朗族' ], [ '35', '撒拉族' ],
				[ '36', '毛南族' ], [ '37', '仡佬族' ], [ '38', '锡伯族' ],
				[ '39', '阿昌族' ], [ '40', '普米族' ], [ '41', '塔吉克族' ],
				[ '42', '怒族' ], [ '43', '乌孜别克族' ], [ '44', '俄罗斯族' ],
				[ '45', '鄂温克族' ], [ '46', '德昂族' ], [ '47', '保安族' ],
				[ '48', '裕固族' ], [ '49', '京族' ], [ '50', '塔塔尔族' ],
				[ '51', '独龙族' ], [ '52', '鄂伦春族' ], [ '53', '赫哲族' ],
				[ '54', '门巴族' ], [ '55', '珞巴族' ], [ '56', '基诺族' ] ]
	});
	var validateAccStore = new Ext.data.Store( {
		proxy : new Ext.data.HttpProxy( {
			url : './user.ered?reqCode=validateAcc4ProvinceAdded' // 后台请求地址
			}),
		reader : new Ext.data.JsonReader( {}, [ { // 定义后台返回数据格式
					name : 'cnt' // 数量
			} ])
	});
	var sm = new Ext.grid.CheckboxSelectionModel();

	/** 定义列头 */
	var cm = new Ext.grid.ColumnModel( [
			new Ext.grid.RowNumberer(),
			sm,
			{
				header : '人员编号',
				dataIndex : 'userid',
				hidden : true
			},
			{
				header : '操作员编号',
				dataIndex : 'account',
				width : 80
			},
			{
				header : '操作员姓名',
				dataIndex : 'username',
				width : 80
			},{
						header : '所属角色',
						dataIndex : 'rolename',
						width : 80
			},
			{
				id : 'deptname',
				header : '部门名称',
				dataIndex : 'deptname',
				width : 120
			},
			{
				id : 'usertype',
				header : '员工类型',
				dataIndex : 'usertype',
				width : 60,
				hidden : true,
				renderer : USERTYPERender
			/*function(value) {
						if (value == '1')
							return '员工';
						else if (value == '2')
							return '主管员';
						else if (value == '3')
							return '系统操作员'
						else
							return value;
					}*/
			},
			{
				header : '性别',
				dataIndex : 'sex',
				width : 50,
				renderer : function(value) {
					if (value == '1')
						return '男';
					else if (value == '2')
						return '女';
					else if (value == '0')
						return '未知';
					else
						return value;
				}
			},
			{
				header : '人员状态',
				dataIndex : 'locked',
				width : 50,
				renderer : function(value) {
					if (value == '1')
						return '锁定';
					else if (value == '0')
						return '正常';
					else
						return value;
				}
			},
			{
				id : 'id_crd',
				header : '身份证号',
				dataIndex : 'id_crd'
			},
			{
				id : 'tmp_crd',
				header : '暂住证号',
				hidden : true,
				dataIndex : 'tmp_crd'
			},
			{
				header : '手机号码',
				dataIndex : 'mbl_no',
				width : 85
			},
			{
				id : 'birthday',
				header : '出生日期',
				hidden : true,
				dataIndex : 'birthday'
			},
			{
				header : '民族',
				dataIndex : 'nation',
				width : 60,
				renderer : function(value) {
					return nationStore.getAt(nationStore.findExact('value',
							value)).data['text'];
				}
			}, {
				id : 'nat_plc',
				header : '籍贯',
				hidden : true,
				dataIndex : 'nat_plc'
			}, {
				header : '运营商',
				dataIndex : 'carrier',
				hidden : true,
				renderer : function(value) {
					if (value == '1')
						return '联通';
					else if (value == '2')
						return '电信';
					else if (value == '0')
						return '移动';
					else
						return value;
				}
			}, {
				id : 'duty_name',
				header : '职务',
				hidden : true,
				dataIndex : 'duty_name',
				width : 120
			}, {
				id : 'remark',
				header : '备注',
				hidden : true,
				dataIndex : 'remark'
			}, {
				id : 'deptid',
				header : '所属部门编号',
				dataIndex : 'deptid',
				hidden : true
			}, {
				id : 'duty',
				dataIndex : 'duty',
				hidden : true
			}, {
				dataIndex : 'grp_city',
				hidden : true
			}, {
				dataIndex : 'grp_id',
				hidden : true
			}, {
				id : 'bank_no',
				dataIndex : 'bank_no',
				hidden : true
			}, {
				dataIndex : 'roleid',
				hidden : true
			} ]);

	/**
	 * 数据存储
	 */
	var store = new Ext.data.Store( {
		proxy : new Ext.data.HttpProxy( {
			url : './user.ered?reqCode=queryUsersForManage'
		}),
		reader : new Ext.data.JsonReader( {
			totalProperty : 'TOTALCOUNT',
			root : 'ROOT'
		}, [ {
			name : 'userid'
		}, {
			name : 'grpname'
		}, {
			name : 'username'
		}, {
			name : 'sex'
		}, {
			name : 'account'
		}, {
			name : 'locked'
		}, {
			name : 'deptid'
		}, {
			name : 'deptname'
		}, {
			name : 'remark'
		}, {
			name : 'usertype'
		}, {
			name : 'id_crd'
		}, {
			name : 'tmp_crd'
		}, {
			name : 'mbl_no'
		}, {
			name : 'birthday'
		}, {
			name : 'nation'
		}, {
			name : 'nat_plc'
		}, {
			name : 'carrer'
		}, {
			name : 'duty_name'
		}, {
			name : 'tech_post'
		}, {
			name : 'wedlock'
		}, {
			name : 'post_code'
		}, {
			name : 'address'
		}, {
			name : 'email'
		}, {
			name : 'tel_no'
		}, {
			name : 'mbl_no'
		}, {
			name : 'vir_no'
		}, {
			name : 'carrier'
		}, {
			name : 'duty'
		}, {
			name : 'bank_no'
		}, {
			name : 'grp_city'
		}, {
			name : 'roleid'
		},, {
			name : 'rolename'
		}])
	});

	// 翻页排序时带上查询条件
		store.on('beforeload', function() {
			this.baseParams = {
				queryParam : Ext.getCmp('queryParam').getValue(),
				usertype : '1'
			};
		});
		var pagesize_combo = new Ext.form.ComboBox( {
			name : 'pagesize',
			hiddenName : 'pagesize',
			typeAhead : true,
			triggerAction : 'all',
			lazyRender : true,
			mode : 'local',
			store : new Ext.data.ArrayStore(
					{
						fields : [ 'value', 'text' ],
						data : [ [ 10, '10条/页' ], [ 20, '20条/页' ],
								[ 50, '50条/页' ], [ 100, '100条/页' ],
								[ 250, '250条/页' ], [ 500, '500条/页' ] ]
					}),
			valueField : 'value',
			displayField : 'text',
			value : '20',
			editable : false,
			width : 85
		});
		var number = parseInt(pagesize_combo.getValue());
		pagesize_combo.on("select", function(comboBox) {
			bbar.pageSize = parseInt(comboBox.getValue());
			number = parseInt(comboBox.getValue());
			store.reload( {
				params : {
					start : 0,
					limit : bbar.pageSize,
					usertype : '1'
				}
			});
		});

		var bbar = new Ext.PagingToolbar( {
			pageSize : number,
			store : store,
			displayInfo : true,
			displayMsg : '显示{0}条到{1}条,共{2}条',
			emptyMsg : "没有符合条件的记录",
			items : [ '-', '&nbsp;&nbsp;', pagesize_combo ]
		});
		var grid = new Ext.grid.GridPanel(
				{
					title : '<img src="./resource/image/ext/group.png" align="top" class="IEPNG"><span style="font-weight:normal">人员信息表</span>',
					renderTo : 'userGridDiv',
					height : 500,
					// width:600,
					autoScroll : true,
					region : 'center',
					store : store,
					loadMask : {
						msg : '正在加载表格数据,请稍等...'
					},
					stripeRows : true,
					frame : true,
					autoExpandColumn : 'remark',
					cm : cm,
					sm : sm,
					tbar : [ {
						text : '新增',
						iconCls : 'page_addIcon',
						handler : function() {
							addInit();
						}
					}, '-', {
						text : '修改',
						iconCls : 'page_edit_1Icon',
						handler : function() {
							editInit();
						}
					}, '-', {
						text : '密码发送',
						iconCls : 'page_edit_1Icon',
						handler : function() {
							sendPwd();
						}
					}, '-', {
						text : '刷新',
						iconCls : 'page_refreshIcon',
						handler : function() {
							queryUserItem();
						}
					}, '->', new Ext.form.TextField( {
						id : 'queryParam',
						name : 'queryParam',
						emptyText : '请输入人员名称',
						enableKeyEvents : true,
						listeners : {
							specialkey : function(field, e) {
								if (e.getKey() == Ext.EventObject.ENTER) {
									queryUserItem();
								}
							}
						},
						width : 130
					}), {
						text : '查询',
						iconCls : 'page_findIcon',
						handler : function() {
							queryUserItem();
						}
					} ],
					bbar : bbar
				});
		store.load( {
			params : {
				start : 0,
				limit : bbar.pageSize,
				firstload : 'true',
				usertype : '1'
			}
		});
		grid.on('rowdblclick', function(grid, rowIndex, event) {
			editInit();
		});
		grid.on('sortchange', function() {
			grid.getSelectionModel().selectFirstRow();
		});
		var sexStore = new Ext.data.SimpleStore( {
			fields : [ 'value', 'text' ],
			data : [ [ '1', '1 男' ], [ '2', '2 女' ], [ '0', '0 未知' ] ]
		});
		var sexCombo = new Ext.form.ComboBox( {
			name : 'sex',
			hiddenName : 'sex',
			store : sexStore,
			mode : 'local',
			triggerAction : 'all',
			valueField : 'value',
			displayField : 'text',
			value : '1',
			fieldLabel : '性别',
			emptyText : '请选择...',
			allowBlank : false,
			forceSelection : true,
			editable : false,
			typeAhead : true,
			anchor : "95%"
		});

		var usertypeStore = new Ext.data.SimpleStore( {
			fields : [ 'value', 'text' ],
			data : [ [ '1', '普通员工' ], [ '2', '管理员' ], [ '4', '企业操作员' ],
					[ '7', '地级管理员' ] ]
		});

		var usertypeCombo = new Ext.form.ComboBox( {
			name : 'usertype',
			hiddenName : 'usertype',
			store : usertypeStore,
			mode : 'local',
			triggerAction : 'all',
			valueField : 'value',
			displayField : 'text',
			value : '1',
			fieldLabel : '员工类型',
			emptyText : '请选择...',
			allowBlank : false,
			forceSelection : true,
			editable : false,
			typeAhead : true,
			anchor : "95%"
		});
		var lockedStore = new Ext.data.SimpleStore( {
			fields : [ 'value', 'text' ],
			data : [ [ '0', '0 正常' ], [ '1', '1 锁定' ] ]
		});
		var lockedCombo = new Ext.form.ComboBox( {
			name : 'locked',
			hiddenName : 'locked',
			store : lockedStore,
			mode : 'local',
			triggerAction : 'all',
			valueField : 'value',
			displayField : 'text',
			value : '0',
			fieldLabel : '人员状态',
			emptyText : '请选择...',
			allowBlank : false,
			forceSelection : true,
			editable : false,
			typeAhead : true,
			anchor : "95%"
		});

		var nationCombo = new Ext.form.ComboBox( {
			name : 'nation',
			hidden : true,
			hiddenName : 'nation',
			store : nationStore,
			mode : 'local',
			triggerAction : 'all',
			valueField : 'value',
			displayField : 'text',
			value : '1',
			fieldLabel : '民族',
			emptyText : '请选择...',
			allowBlank : false,
			forceSelection : true,
			editable : false,
			typeAhead : true,
			anchor : "95%"
		});

		/** 职务下拉框定义 */
		var dutyStore = new Ext.data.Store( {
			proxy : new Ext.data.HttpProxy( {
				url : './duty.ered?reqCode=queryAllDuty'
			}),
			reader : new Ext.data.JsonReader( {}, [ {
				name : 'value'
			}, {
				name : 'text'
			} ])
		});
		dutyStore.load();
		var dutyCombo = new Ext.form.ComboBox( {
			name : 'duty',
			hiddenName : 'duty',
			hidden : true,
			id : 'duty_id',
			value : '0',
			store : dutyStore,
			mode : 'remote',
			fieldLabel : '职务',
			emptyText : '请选择...',
			triggerAction : 'all',
			displayField : 'text',
			valueField : 'value',
			loadingText : '正在加载数据...',
			forceSelection : true,
			typeAhead : true,
			resizable : true,
			editable : false,
			anchor : "95%"
		});

		/** 职称下拉框定义 */
		var techpostStore = new Ext.data.SimpleStore( {
			fields : [ 'value', 'text' ],
			data : [ [ '0', '无' ], [ '1', '初级工程师' ], [ '2', '中级工程师' ],
					[ '3', '高级工程师' ] ]
		});
		var techpostCombo = new Ext.form.ComboBox( {
			name : 'tech_post',
			hidden : true,
			hiddenName : 'tech_post',
			store : techpostStore,
			mode : 'local',
			triggerAction : 'all',
			valueField : 'value',
			displayField : 'text',
			value : '0',
			fieldLabel : '职称',
			emptyText : '请选择...',
			allowBlank : true,
			forceSelection : true,
			editable : false,
			typeAhead : true,
			anchor : "95%"
		});

		/** 婚姻状况下拉框定义 */
		var wedlockStore = new Ext.data.SimpleStore( {
			fields : [ 'value', 'text' ],
			data : [ [ '0', '未婚' ], [ '1', '已婚' ] ]
		});
		var wedlockCombo = new Ext.form.ComboBox( {
			name : 'wedlock',
			hiddenName : 'wedlock',
			store : wedlockStore,
			hidden : true,
			mode : 'local',
			triggerAction : 'all',
			valueField : 'value',
			displayField : 'text',
			value : '1',
			fieldLabel : '婚姻状况',
			emptyText : '请选择...',
			allowBlank : true,
			forceSelection : true,
			editable : false,
			typeAhead : true,
			anchor : "95%"
		});
		/** 运营商下拉框定义 */
		var carrierStore = new Ext.data.SimpleStore( {
			fields : [ 'value', 'text' ],
			data : [ [ '0', '移动' ], [ '1', '联通' ], [ '2', '电信' ] ]
		});
		var carrierCombo = new Ext.form.ComboBox( {
			name : 'carrier',
			id : 'carrier1',
			hiddenName : 'carrier',
			store : carrierStore,
			mode : 'local',
			triggerAction : 'all',
			valueField : 'value',
			displayField : 'text',
			value : '1',
			fieldLabel : '运营商',
			emptyText : '请选择...',
			allowBlank : false,
			forceSelection : true,
			editable : false,
			typeAhead : true,
			anchor : "95%"
		});

		//角色下拉框
		var roleStore = new Ext.data.Store( {
			autoLoad : true,
			proxy : new Ext.data.HttpProxy( {
				url : './user.ered?reqCode=queryAllRole'
			}),
			reader : new Ext.data.JsonReader( {}, [ {
				name : 'value'
			}, {
				name : 'text'
			} ]),
			baseParams : {
				roletype : '1'
			}
		});
		var roleCombo = new Ext.form.ComboBox( {
			name : 'roleid',
			hiddenName : 'roleid',
			store : roleStore,
			mode : 'remote',
			fieldLabel : '归属角色' + re,
			emptyText : '请选择...',
			allowBlank : false,
			triggerAction : 'all',
			displayField : 'text',
			valueField : 'value',
			loadingText : '正在加载数据...',
			forceSelection : true,
			typeAhead : true,
			resizable : true,
			editable : false,
			anchor : "95%"
		});

		var addUserFormPanel = new Ext.form.FormPanel(
				{
					id : 'addUserFormPanel',
					name : 'addUserFormPanel',
					width : 480,
					height : 360,
					labelAlign : 'right', // 标签对齐方式
					bodyStyle : 'padding:5 5 0', // 表单元素和表单面板的边距
					buttonAlign : 'center',
					items : [
							{
								layout : 'column',
								border : false,
								items : [ {
									columnWidth : .5,
									layout : 'form',
									labelWidth : 80, // 标签宽度
									defaultType : 'textfield',
									border : false,
									items : [ {
										fieldLabel : '操作员编号' + re,
										regex : /^[A-Za-z0-9]+$/,
										regexText : '操作员编号只能为数字或字母',
										maxLength : 20, // 可输入的最大文本长度,不区分中英文字符
										name : 'account',
										id : 'account',
										allowBlank : false,
										/*listeners : { // 监听注册onblur事件
											'blur' : function(obj) {
												// 获取数据
										validateAcc();

									}
								},*/
								anchor : '95%' // 根据窗口，自动调整文本框的宽度
									} ]
								}, {
									columnWidth : .5,
									layout : 'form',
									labelWidth : 80, // 标签宽度
									defaultType : 'textfield',
									border : false,
									items : [ {
										fieldLabel : '操作员姓名' + re,
										name : 'username',
										//id : 'username',
										allowBlank : false, // 是否允许为空
										anchor : '95%'
									} ]
								} ]
							},
							{
								layout : 'column',
								border : false,
								items : [
										{
											columnWidth : .5,
											layout : 'form',
											labelWidth : 80, // 标签宽度
											defaultType : 'textfield',
											border : false,
											items : [ {
												fieldLabel : '手机号码' + re,
												regex : /^(13[0-9]|15[0-9]|18[0-9])\d{8}$/,
												regexText : '手机号码格式不合法',
												name : 'mbl_no',
												id : 'mbl_no',
												allowBlank : false, // 是否允许为空
												anchor : '95%'
											} ]
										}, {
											columnWidth : .5,
											layout : 'form',
											labelWidth : 80, // 标签宽度
											defaultType : 'textfield',
											border : false,
											items : [ roleCombo ]
										} ]
							},
							{
								layout : 'column',
								border : false,
								items : [ {
									columnWidth : .5,
									layout : 'form',
									labelWidth : 80, // 标签宽度
									defaultType : 'textfield',
									border : false,
									items : [ {
										fieldLabel : '密   码' + re,
										name : 'password',
										id : 'newpwd',
										inputType : 'password',
										allowBlank : false,
										regex : /^[A-Za-z0-9]+$/,
										regexText : "密码只能为数字或字符",
										anchor : '95%'
									} ]
								}, {
									columnWidth : .5,
									layout : 'form',
									labelWidth : 80, // 标签宽度
									defaultType : 'button',
									border : false,
									items : [ {
										text : '随机生成',
										iconCls : 'acceptIcon',
										id : 'pwdbutton',
										handler : function() {
											randomPwd();
										}
									} ]
								} ]
							},
							{
								layout : 'column',
								border : false,
								items : [ {
									columnWidth : .5,
									layout : 'form',
									labelWidth : 80, // 标签宽度
									defaultType : 'textfield',
									border : false,
									items : [ lockedCombo ]
								}, {
									columnWidth : .5,
									layout : 'form',
									labelWidth : 80, // 标签宽度
									defaultType : 'textfield',
									border : false,
									items : [ carrierCombo ]
								} ]
							},
							{
								layout : 'column',
								border : false,
								items : [ {
									columnWidth : .5,
									layout : 'form',
									labelWidth : 80, // 标签宽度
									defaultType : 'textfield',
									border : false,
									items : [ sexCombo ]
								}, {
									columnWidth : .5,
									layout : 'form',
									labelWidth : 80, // 标签宽度
									defaultType : 'textfield',
									border : false,
									items : [ {
										fieldLabel : '身份证号',
										name : 'id_crd',
										id : 'id_crd',
										anchor : '95%'
									} ]
								} ]
							},
							{
								layout : 'column',
								border : false,
								items : [ {
									columnWidth : .5,
									layout : 'form',
									hidden : true,
									labelWidth : 80, // 标签宽度
									defaultType : 'textfield',
									border : false,
									items : [ {
										xtype : "numberfield",
										fieldLabel : '邮政编码',
										regex : /[1-9]\d{5}(?!\d)/,// 验证邮政编码格式的正则表达式
										regexText : '邮政编码格式不合法', // 验证错误之后的提示信息
										name : 'post_code',
										id : 'post_code',
										maxLength : 6,
										minLength : 6,
										allowBlank : true,
										anchor : '95%'
									} ]
								} ]
							},
							{
								layout : 'column',
								border : false,
								items : [
										{
											columnWidth : .5,
											layout : 'form',
											labelWidth : 80, // 标签宽度
											defaultType : 'textfield',
											hidden : true,
											border : false,
											items : [ {
												fieldLabel : '通讯地址',
												name : 'address',
												id : 'address',
												allowBlank : true,
												anchor : '95%'
											} ]
										},
										{
											columnWidth : .5,
											layout : 'form',
											hidden : true,
											labelWidth : 80, // 标签宽度
											defaultType : 'textfield',
											border : false,
											items : [ {
												fieldLabel : '电子邮件',
												regex : /^([\w]+)(.[\w]+)*@([\w-]+\.){1,5}([A-Za-z]){2,4}$/,// 验证电子邮件格式的正则表达式
												regexText : '电子邮件格式不合法', // 验证错误之后的提示信息
												name : 'email',
												id : 'email',
												allowBlank : true,
												anchor : '95%'
											} ]
										} ]
							},
							{
								layout : 'column',
								border : false,
								items : [
										{
											columnWidth : .5,
											layout : 'form',
											labelWidth : 80, // 标签宽度
											hidden : true,
											defaultType : 'textfield',
											border : false,
											items : [ {
												fieldLabel : '固定电话',
												regex : /^\d{3}-\d{8}|\d{4}-\d{7}/,
												regexText : "固定电话格式不合法！格式:0000-0000000",
												name : 'tel_no',
												id : 'tel_no',
												allowBlank : true,
												anchor : '95%'
											} ]
										}, {
											columnWidth : .5,
											layout : 'form',
											labelWidth : 80, // 标签宽度
											defaultType : 'textfield',
											hidden : true,
											border : false,
											items : [ {
												xtype : 'datefield',
												fieldLabel : '出生日期', // 标签
												name : 'birthday', // name:后台根据此name属性取值
												id : 'birthday', // name:后台根据此name属性取值
												format : 'Y-m-d', // 日期格式化
												value : new Date(),
												anchor : '95%' // 宽度百
											} ]
										} ]
							}, {
								layout : 'column',
								border : false,
								items : [ {
									columnWidth : .5,
									layout : 'form',
									hidden : true,
									labelWidth : 80, // 标签宽度
									defaultType : 'textfield',
									border : false,
									items : [ {
										fieldLabel : '虚拟手机号',
										regex : /^\d+$/,
										regexText : '虚拟手机号格式不合法，必须为数字',
										name : 'vir_no',
										id : 'vir_no',
										allowBlank : true,
										anchor : '95%'
									} ]
								} ]
							}, {
								layout : 'column',
								border : false,
								items : [ {
									columnWidth : .5,
									layout : 'form',
									hidden : true,
									labelWidth : 80, // 标签宽度
									defaultType : 'textfield',
									border : false,
									items : [ {
										fieldLabel : '籍贯',
										name : 'nat_plc',
										id : 'nat_plc',
										allowBlank : true,
										anchor : '95%'
									} ]
								} ]
							}, {
								layout : 'column',
								border : false,
								items : [ {
									columnWidth : .5,
									layout : 'form',
									hidden : true,
									labelWidth : 80, // 标签宽度
									defaultType : 'textfield',
									border : false,
									items : [ {
										fieldLabel : '备注',
										name : 'remark',
										id : 'remark',
										allowBlank : true,
										anchor : '95%'
									}, {
										fieldLabel : '暂住证号',
										name : 'tmp_crd',
										id : 'tmp_crd',
										allowBlank : true,
										anchor : '95%'
									} ]
								}, {
									columnWidth : .5,
									layout : 'form',
									labelWidth : 80, // 标签宽度
									defaultType : 'textfield',
									border : false,
									items : [ {
										name : 'usertype',
										id : 'usertype',
										value : "1",
										hidden : true
									}, {
										name : 'nation',
										id : 'nation',
										value : "1",
										hidden : true
									}, {
										name : 'techpost',
										id : 'techpost',
										value : "0",
										hidden : true
									}, {
										name : 'wedlock',
										id : 'wedlock',
										value : "1",
										hidden : true
									} ]
								} ]
							} ]
				});
		var addUserWindow = new Ext.Window( {
			layout : 'fit',
			width : 500,
			height : 230,
			resizable : false,
			draggable : false,
			closeAction : 'hide',
			title : '新增地市操作员(*为必填项)',
			iconCls : 'page_addIcon',
			modal : false,
			collapsible : true,
			titleCollapse : false,
			maximizable : false, // 窗口最大化
			buttonAlign : 'right',
			border : false,
			animCollapse : true,
			pageY : 20,
			pageX : document.body.clientWidth / 2 - 420 / 2,
			animateTarget : Ext.getBody(),
			constrain : true,
			items : [ addUserFormPanel ],
			buttons : [
					{
						text : '保存',
						iconCls : 'acceptIcon',
						handler : function() {
							if (runMode == '0') {
								Ext.Msg.alert('提示',
										'系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
								return;
							}
							saveUserItem('save');

						}
					},
					{
						text : '保存并发送',
						iconCls : 'acceptIcon',
						handler : function() {
							if (runMode == '0') {
								Ext.Msg.alert('提示',
										'系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
								return;
							}
							saveUserItem('send');

						}
					}, {
						text : '重置',
						id : 'btnReset',
						iconCls : 'tbar_synchronizeIcon',
						handler : function() {
							Ext.getCmp("account").setValue("");
							Ext.getCmp("username").setValue("");
							Ext.getCmp("newpwd").setValue("");
							Ext.getCmp("remark").setValue("");
							Ext.getCmp("id_crd").setValue("");
							Ext.getCmp("tmp_crd").setValue("");
							Ext.getCmp("birthday").setValue("");
							Ext.getCmp("nat_plc").setValue("");
							Ext.getCmp("post_code").setValue("");
							Ext.getCmp("address").setValue("");
							Ext.getCmp("email").setValue("");
							Ext.getCmp("tel_no").setValue("");
							Ext.getCmp("mbl_no").setValue("");
							Ext.getCmp("vir_no").setValue("");
							Ext.getCmp("carrier1").setValue("");
						}
					}, {
						text : '关闭',
						iconCls : 'deleteIcon',
						handler : function() {
							addUserWindow.hide();
						}
					} ]
		});

		var formpanel4Imp = new Ext.form.FormPanel(
				{
					id : 'formpanel4Imp',
					name : 'formpanel4Imp',
					defaultType : 'textfield',
					labelAlign : 'right',
					labelWidth : 99,
					frame : true,
					labelAlign : 'right',
					fileUpload : true,
					items : [
							{
								fieldLabel : '请选择导入文件',
								name : 'theFile',
								id : 'theFile',
								inputType : 'file',
								allowBlank : true,
								anchor : '99%'
							},
							{
								xtype : "label",
								//labelStyle : 'color:red;width=60px;',
								fieldLabel : '说明',
								html : "第一行标题请勿改动;<br/>系统号为8位以内字母或数字;<br/>性别为男或女;<br/>手机运营商为移动,联通,电信;<br/>中间不要有空行</SPAN>",
								anchor : '99%'
							},
							{
								xtype : "label",
								labelStyle : 'color:red;width=60px;',
								html : "<SPAN STYLE='COLOR:blue'><a href='./cnnct/template/user.xls' target='_blank'>下载Excel导入模板</a></SPAN>",
								anchor : '99%'
							} ]
				});

		var window4Imp = new Ext.Window( {
			layout : 'fit',
			width : 380,
			height : 210,
			resizable : false,
			draggable : true,
			closeAction : 'hide',
			title : '导入Excel',
			modal : true,
			collapsible : true,
			titleCollapse : true,
			maximizable : false,
			buttonAlign : 'right',
			border : false,
			animCollapse : true,
			animateTarget : Ext.getBody(),
			constrain : true,
			items : [ formpanel4Imp ],
			buttons : [
					{
						text : '导入',
						iconCls : 'acceptIcon',
						handler : function() {
							var theFile = Ext.getCmp('theFile').getValue();
							if (Ext.isEmpty(theFile)) {
								Ext.Msg.alert('提示', '请先选择您要导入的xls文件或.xlsx文件。');
								return;
							}
							
							if (theFile.substring(theFile.length - 4,theFile.length) != ".xls"&&
									theFile.substring(theFile.length - 5,theFile.length) != ".xlsx") {
								Ext.Msg.alert('提示', '您选择的文件格式不对,只能导入.xls文件或.xlsx文件!');
								return;
							}
							formpanel4Imp.form.submit( {
								url : './user.ered?reqCode=importUserInfo',
								waitTitle : '提示',
								method : 'POST',
								waitMsg : '正在处理数据,请稍候...',
								success : function(form, action) {
									store.load( {
										params : {
											start : 0,
											limit : bbar.pageSize
										}
									});
									//window4Imp.hide();
									Ext.MessageBox.alert('提示',
											action.result.msg);
								},
								failure : function(form, action) {
									var msg = action.result.msg;
									Ext.MessageBox.alert('提示',
											'参数数据保存失败:<br>' + msg);
								}
							});

						}
					}, {
						text : '关闭',
						iconCls : 'deleteIcon',
						handler : function() {
							window4Imp.hide();
						}
					} ]
		});

		/**************************************修改****************************************************/
		var roleCombo_E = new Ext.form.ComboBox( {
			name : 'roleid',
			hiddenName : 'roleid',
			id : 'role_id',
			store : roleStore,
			mode : 'remote',
			triggerAction : 'all',
			valueField : 'value',
			displayField : 'text',
			fieldLabel : '归属角色' + re,
			emptyText : '请选择角色...',
			allowBlank : false,
			forceSelection : true,
			editable : false,
			fieldClass : 'x-custom-field-disabled',
			typeAhead : true,
			//readOnly : true,
			anchor : '90%'
		});
		var lockedCombo_E = new Ext.form.ComboBox( {
			name : 'locked',
			hiddenName : 'locked',
			store : lockedStore,
			mode : 'local',
			triggerAction : 'all',
			valueField : 'value',
			displayField : 'text',
			value : '0',
			fieldLabel : '人员状态',
			emptyText : '请选择...',
			allowBlank : false,
			forceSelection : true,
			editable : false,
			typeAhead : true,
			anchor : "95%"
		});

		var sexCombo_E = new Ext.form.ComboBox( {
			name : 'sex',
			hiddenName : 'sex',
			store : sexStore,
			mode : 'local',
			triggerAction : 'all',
			valueField : 'value',
			displayField : 'text',
			fieldLabel : '性别',
			emptyText : '请选择...',
			allowBlank : false,
			forceSelection : true,
			editable : false,
			typeAhead : true,
			anchor : "95%"
		});

		var carrierCombo_E = new Ext.form.ComboBox( {
			name : 'carrier',
			hiddenName : 'carrier',
			store : carrierStore,
			mode : 'local',
			triggerAction : 'all',
			valueField : 'value',
			displayField : 'text',
			fieldLabel : '运营商',
			emptyText : '请选择...',
			allowBlank : false,
			forceSelection : true,
			editable : false,
			typeAhead : true,
			anchor : "95%"
		});

		var editUserFormPanel = new Ext.form.FormPanel( {
			id : 'editUserFormPanel',
			name : 'editUserFormPanel',
			width : 480,
			height : 360,
			labelAlign : 'right', // 标签对齐方式
			bodyStyle : 'padding:5 5 0', // 表单元素和表单面板的边距
			buttonAlign : 'center',
			items : [ {
				layout : 'column',
				border : false,
				items : [ {
					columnWidth : .5,
					layout : 'form',
					labelWidth : 80, // 标签宽度
					defaultType : 'textfield',
					border : false,
					items : [ {
						fieldLabel : '操作员编号' + re,
						//regex : /^\d+/,
						//regexText : '系统号只能为数字',
						maxLength : 20, // 可输入的最大文本长度,不区分中英文字符
						name : 'account',
						id:'editaccount',
						allowBlank : false,
						anchor : '95%' // 根据窗口，自动调整文本框的宽度
					} ]
				}, {
					columnWidth : .5,
					layout : 'form',
					labelWidth : 80, // 标签宽度
					defaultType : 'textfield',
					border : false,
					items : [ {
						fieldLabel : '操作员姓名' + re,
						name : 'username',
						allowBlank : false, // 是否允许为空
						anchor : '95%'
					} ]
				} ]
			}, {
				layout : 'column',
				border : false,
				items : [ {
					columnWidth : .5,
					layout : 'form',
					labelWidth : 80, // 标签宽度
					defaultType : 'textfield',
					border : false,
					items : [ {
						fieldLabel : '手机号码' + re,
						regex : /^(13[0-9]|15[0-9]|18[0-9])\d{8}$/,
						regexText : '手机号码格式不合法',
						name : 'mbl_no',
						allowBlank : false, // 是否允许为空
						anchor : '95%'
					} ]
				}, {
					columnWidth : .5,
					layout : 'form',
					labelWidth : 80, // 标签宽度
					defaultType : 'textfield',
					border : false,
					items : [ roleCombo_E ]
				} ]
			}, {
				layout : 'column',
				border : false,
				items : [ {
					columnWidth : .5,
					layout : 'form',
					labelWidth : 80, // 标签宽度
					defaultType : 'textfield',
					border : false,
					items : [ lockedCombo_E ]
				}, {
					columnWidth : .5,
					layout : 'form',
					labelWidth : 80, // 标签宽度
					defaultType : 'textfield',
					border : false,
					//hidden:true,
					items : [ carrierCombo_E ]
				} ]
			}, {
				layout : 'column',
				border : false,
				items : [ {
					columnWidth : .5,
					layout : 'form',
					labelWidth : 80, // 标签宽度
					defaultType : 'textfield',
					border : false,
					//hidden:true,
					items : [ sexCombo_E ]
				}, {
					columnWidth : .5,
					layout : 'form',
					labelWidth : 80, // 标签宽度
					defaultType : 'textfield',
					border : false,
					items : [ {
						fieldLabel : '身份证号',
						name : 'id_crd',
						anchor : '95%'
					} ]
				} ]
			}, {
				layout : 'column',
				border : false,
				items : [ {
					columnWidth : .5,
					layout : 'form',
					labelWidth : 80, // 标签宽度
					defaultType : 'textfield',
					border : false,
					items : [ {
						id : 'roleid_old',
						name : 'roleid_old',
						hidden : true
					}, {
						id : 'userid',
						name : 'userid',
						hidden : true
					} ]
				} ]
			} ]
		});
		var editUserWindow = new Ext.Window( {
			layout : 'fit',
			width : 500,
			height : 230,
			resizable : false,
			draggable : true,
			closeAction : 'hide',
			title : '修改操作员(*为必填项)',
			iconCls : 'page_addIcon',
			modal : false,
			collapsible : true,
			titleCollapse : true,
			maximizable : false, // 窗口最大化
			buttonAlign : 'right',
			border : false,
			animCollapse : true,
			pageY : 20,
			pageX : document.body.clientWidth / 2 - 420 / 2,
			animateTarget : Ext.getBody(),
			constrain : true,
			items : [ editUserFormPanel ],
			buttons : [
					{
						text : '保存',
						iconCls : 'acceptIcon',
						handler : function() {
							if (runMode == '0') {
								Ext.Msg.alert('提示',
										'系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
								return;
							}
							updateUserItem();
						}
					}, {
						text : '关闭',
						iconCls : 'deleteIcon',
						handler : function() {
							editUserWindow.hide();
						}
					} ]
		});

		/**
		 * 布局
		 */
		var viewport = new Ext.Viewport( {
			layout : 'border',
			items : [ {
				region : 'center',
				layout : 'fit',
				items : [ grid ]
			} ]
		});
		/**
		 * 根据条件查询人员
		 */
		function queryUserItem() {
			store.load( {
				params : {
					start : 0,
					limit : bbar.pageSize,
					queryParam : Ext.getCmp('queryParam').getValue(),
					usertype : '1'
				}
			});
		}

		function randomPwd() {
			Ext.getCmp('newpwd').setValue('');
			pwdStore.load();
		}
		pwdStore.on('load', function(obj) {
			if (obj != null) {
				Ext.getCmp('newpwd').setValue(obj.getAt(0).get('newpassword'));
			}
		});

		/**
		 * 新增人员初始化
		 */
		function addInit() {
			addUserWindow
					.setTitle('新增地市操作员<span style="color:Red">(*为必填项)</span>');
			//Ext.getCmp('grp_city1').setReadOnly(false);
			// 为下拉框赋初始值
			lockedCombo.setValue('0');
			sexCombo.setValue('1');
			carrierCombo.setValue('0');
			Ext.getCmp('techpost').setValue('0');
			Ext.getCmp('nation').setValue('1'); // 民族下拉框
			Ext.getCmp('wedlock').setValue('0'); // 婚姻状况下拉框
			Ext.getCmp('usertype').setValue('1');
			addUserWindow.show();
		}

		/**
		 * 保存人员数据
		 */
		function saveUserItem(flag) {
			if (!addUserFormPanel.form.isValid()) {
				return;
			}
			var msg;
			if (flag == "save") {
				msg = '<span style="color:red">确认保存所添加的地市操作员信息吗?</span>'
			}
			if (flag == "send") {
				msg = '<span style="color:red">确认保存所添加的地市操作员信息并且发送短信给该地市操作员吗?</span>'
			}
			Ext.Msg.confirm('确认', msg, function(btn, text) {
				if (btn == 'yes') {
					save(flag);
				} else {
					return;
				}
			});

		}

		function save(flag) {
			Ext.getCmp('usertype').setValue('1');
			addUserFormPanel.form.submit( {
				url : './user.ered?reqCode=saveUserItem',
				waitTitle : '提示',
				method : 'POST',
				waitMsg : '正在处理数据,请稍候...',
				success : function(form, action) {
					addUserWindow.hide();
					store.reload();
					form.reset();
					Ext.MessageBox.alert('提示', action.result.msg);
				},
				failure : function(form, action) {
					var msg = action.result.msg;
					Ext.MessageBox.alert('提示', '人员数据保存失败:<br>' + msg);
				},
				params : {
					flag : flag
				}
			});
		}

		/**
		 * 删除人员
		 */
		function deleteUserItems() {
			var rows = grid.getSelectionModel().getSelections();
			var fields = '';
			for ( var i = 0; i < rows.length; i++) {
				if (rows[i].get('usertype') == '3' && root_usertype != '9'
						&& root_usertype != '8') {
					fields = fields + rows[i].get('username') + '<br>';
				}
				if (rows[i].get('usertype') == '8'
						&& rows[i].get('account') == 'admin') {
					fields = fields + rows[i].get('username') + '<br>';
				}
			}
			if (fields != '') {
				Ext.Msg
						.alert(
								'提示',
								'<b>您选中的项目中包含如下系统内置的只读项目</b><br>' + fields + '<font color=red>系统内置人员不能删除!</font>');
				return;
			}
			if (Ext.isEmpty(rows)) {
				Ext.Msg.alert('提示', '请先选中要删除的项目!');
				return;
			}
			var strChecked = jsArray2JsString(rows, 'userid');
			Ext.Msg
					.confirm(
							'请确认',
							'<span style="color:red"><b>提示:</b>删除人员将同时删除和人员相关的权限信息,请慎重.</span><br>继续删除吗?',
							function(btn, text) {
								if (btn == 'yes') {
									if (runMode == '0') {
										Ext.Msg
												.alert('提示',
														'系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
										return;
									}
									showWaitMsg();
									Ext.Ajax
											.request( {
												url : './user.ered?reqCode=deleteUserItems',
												success : function(response) {
													var resultArray = Ext.util.JSON
															.decode(response.responseText);
													store.reload();
													Ext.Msg.alert('提示',
															resultArray.msg);
												},
												failure : function(response) {
													var resultArray = Ext.util.JSON
															.decode(response.responseText);
													Ext.Msg.alert('提示',
															resultArray.msg);
												},
												params : {
													strChecked : strChecked
												}
											});
								}
							});
		}

		/**
		 * 修改人员初始化
		 */
		function editInit() {
			var record = grid.getSelectionModel().getSelected();
			if (Ext.isEmpty(record)) {
				Ext.MessageBox.show( {
					title : '警告',
					msg : "请先选择一条记录..",
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.WARNING
				});
				return;
			}
			var recs = grid.getSelectionModel().getSelections(); // 把所有选中项放入
			if (recs.length > 1) {
				Ext.MessageBox.show( {
					title : '警告',
					msg : "请选择一条记录..",
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.WARNING
				});
				return;
			}
			editUserFormPanel.getForm().loadRecord(record);
			editUserWindow.show();
			editUserWindow
					.setTitle('修改地市操作员<span style="color:Red">(*为必填项)</span>');
			Ext.getCmp('roleid_old').setValue(record.get('roleid'));
			Ext.getCmp('userid').setValue(record.get('userid'));
			Ext.getCmp('editaccount').setDisabled(true);
			//Ext.getCmp('grp_city1').setReadOnly(true);
		}

		/**
		 * 修改人员数据
		 */
		function updateUserItem() {
			if (!editUserFormPanel.form.isValid()) {
				return;
			}
			var duty_id = Ext.getCmp('duty_id').getValue();
			if (duty_id == null) {
				Ext.getCmp('duty_id').setValue('');
			}
			var roleid = Ext.getCmp('role_id').getValue();
			var roleid_old = Ext.getCmp('roleid_old').getValue();
			if (roleid != roleid_old) {
				Ext.Msg.confirm('确认', '确定保存所修改的人员信息吗?',
						function(btn, text) {
							if (btn == 'yes') {
								update();
							} else {
								return;
							}
						});
				return;
			} else {
				update();
			}
		}

		/**
		 * 更新
		 */
		function update() {
			editUserFormPanel.form.submit( {
				url : './user.ered?reqCode=updateUserItem',
				waitTitle : '提示',
				method : 'POST',
				waitMsg : '正在处理数据,请稍候...',
				success : function(form, action) {
					editUserWindow.hide();
					store.reload();
					form.reset();
					Ext.MessageBox.alert('提示', action.result.msg);
				},
				failure : function(form, action) {
					var msg = action.result.msg;
					Ext.MessageBox.alert('提示', '人员数据修改失败:<br>' + msg);
				}
			});
		}

		/**
		 * 授权初始化
		 */
		function window4GrantInit() {
			var record = grid.getSelectionModel().getSelected();
			if (Ext.isEmpty(record)) {
				Ext.MessageBox.show( {
					title : '警告',
					msg : "请先选择一条记录..",
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.WARNING
				});
				return;
			}
			var recs = grid.getSelectionModel().getSelections(); // 把所有选中项放入
			if (recs.length > 1) {
				Ext.MessageBox.show( {
					title : '警告',
					msg : "请选择一条记录..",
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.WARNING
				});
				return;
			}
			var userid = record.get('userid');
			var deptid = record.get('deptid');
			var usertype = record.get('usertype');
			userGrantInit(userid, deptid, usertype);
		}

		/**
		 * 人员授权窗口初始化
		 */
		function userGrantInit(userid, deptid, usertype) {

			var selectRoleTab = new Ext.Panel(
					{
						title : '<img src="./resource/image/ext/award_star_silver_3.png" align="top" class="IEPNG"> 选择角色',
						// iconCls: 'user_femaleIcon',
						autoLoad : {
							url : './user.ered?reqCode=userGrantInit',
							scripts : true,
							text : '模板引擎正在驱动页面,请等待...',
							params : {
								userid : userid,
								deptid : deptid,
								usertype : usertype
							}
						}
					});

			var selectMenuTab = new Ext.Panel(
					{
						title : '<img src="./resource/image/ext/config.png" align="top" class="IEPNG"> 选择菜单',
						// iconCls: 'user_femaleIcon',
						autoLoad : {
							url : './user.ered?reqCode=selectMenuInit',
							scripts : true,
							text : '模板引擎正在驱动页面,请等待...',
							params : {
								userid : userid,
								deptid : deptid,
								usertype : usertype
							}
						}
					});

			var userGrantTabPanel = new Ext.TabPanel( {
				activeTab : 0,
				width : 600,
				height : 250,
				plain : true,// True表示为不渲染tab候选栏上背景容器图片
				defaults : {
					autoScroll : true
				},
				items : [ selectRoleTab, selectMenuTab ]
			});

			var userGrantWindow = new Ext.Window( {
				layout : 'fit',
				width : 400,
				height : document.body.clientHeight,
				resizable : true,
				draggable : true,
				closeAction : 'close',
				title : '人员授权',
				iconCls : 'group_linkIcon',
				modal : false,
				pageY : 15,
				pageX : document.body.clientWidth / 2 - 420 / 2,
				collapsible : true,
				maximizable : true,
				// animateTarget: document.body,
				// //如果使用autoLoad,建议不要使用动画效果
				buttonAlign : 'right',
				constrain : true,
				/*tools : [{
							id : 'help',
							handler : function() {
								Ext.Msg.alert('提示', '显示在线帮助');
							}
						}],*/
				items : [ userGrantTabPanel ],
				buttons : [ {
					text : '关闭',
					handler : function() {
						userGrantWindow.close();
					}
				} ]
			});
			userGrantWindow.show();
		}

		function validateAcc() {
			if (Ext.getCmp('account').getValue() == '') {
				Ext.Msg.alert('提示', '请输入系统号!');
				return;
			}
			validateAccStore.load( {
				params : {
					account : Ext.getCmp('account').getValue()
				}
			});
		}

		/**
		 * 密码发送
		 */
		function sendPwd() {
			var rows = grid.getSelectionModel().getSelections();
			var record = grid.getSelectionModel().getSelected();
			if (Ext.isEmpty(rows)) {
				Ext.Msg.alert('提示', '请先选中您要进行发送密码的操作员信息!');
				return;
			}
			Ext.Msg
					.confirm(
							'请确认',
							'<span style="color:red"><b>提示:</b>确认给该地市操作员发送密码信息吗?</span><br>',
							function(btn, text) {
								if (btn == 'yes') {
									if (runMode == '0') {
										Ext.Msg
												.alert('提示',
														'系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
										return;
									}
									showWaitMsg();
									Ext.Ajax
											.request( {
												url : './user.ered?reqCode=sendPwd',
												success : function(response) {
													var resultArray = Ext.util.JSON
															.decode(response.responseText);
													store.reload();
													Ext.Msg.alert('提示',
															resultArray.msg);
												},
												failure : function(response) {
													var resultArray = Ext.util.JSON
															.decode(response.responseText);
													Ext.Msg.alert('提示',
															resultArray.msg);
												},
												params : {
													userid : record.get('userid'),
													account : record.get('account')
												}
											});
								}
							});
		}

		validateAccStore.on('load', function(obj) {
			if (obj.getAt(0) != null) { // 如果返回的数据非空
					Ext.Msg.alert('提示', '该系统号已存在,请重新输入!');
				} else {
				}
			});
	});