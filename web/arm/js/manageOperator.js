/**
 * 一卡通账户信息表
 * @memberOf {TypeName} 
 * @return {TypeName} 
 */
Ext.onReady(function() {
			var re = '<span style="color:red">*</span>'
			/** 民族下拉框定义 */
			var nationStore = new Ext.data.SimpleStore( {
				fields : [ 'value', 'text' ],
				data : [ [ '1', '汉族' ], [ '2', '蒙古族' ], [ '3', '回族' ],
						[ '4', '藏族' ], [ '5', '维吾尔族' ], [ '6', '苗族' ],
						[ '7', '彝族' ], [ '8', '壮族' ], [ '9', '布依族' ],
						[ '10', '朝鲜族' ], [ '11', '满族' ], [ '12', '侗族' ],
						[ '13', '瑶族' ], [ '14', '白族' ], [ '15', '土家族' ],
						[ '16', '哈尼族' ], [ '17', '哈萨克族' ], [ '18', '傣族' ],
						[ '19', '黎族' ], [ '20', '傈僳族' ], [ '21', '佤族' ],
						[ '22', '畲族' ], [ '23', '高山族' ], [ '24', '拉祜族' ],
						[ '25', '水族' ], [ '26', '东乡族' ], [ '27', '纳西族' ],
						[ '28', '景颇族' ], [ '29', '柯尔克孜族' ], [ '30', '土族' ],
						[ '31', '达斡尔族' ], [ '32', '仫佬族' ], [ '33', '羌族' ],
						[ '34', '布朗族' ], [ '35', '撒拉族' ], [ '36', '毛南族' ],
						[ '37', '仡佬族' ], [ '38', '锡伯族' ], [ '39', '阿昌族' ],
						[ '40', '普米族' ], [ '41', '塔吉克族' ], [ '42', '怒族' ],
						[ '43', '乌孜别克族' ], [ '44', '俄罗斯族' ], [ '45', '鄂温克族' ],
						[ '46', '德昂族' ], [ '47', '保安族' ], [ '48', '裕固族' ],
						[ '49', '京族' ], [ '50', '塔塔尔族' ], [ '51', '独龙族' ],
						[ '52', '鄂伦春族' ], [ '53', '赫哲族' ], [ '54', '门巴族' ],
						[ '55', '珞巴族' ], [ '56', '基诺族' ] ]
			});
			var validateAccStore = new Ext.data.Store( {
				proxy : new Ext.data.HttpProxy( {
					url : './user.ered?reqCode=validateAcc' // 后台请求地址
					}),
				reader : new Ext.data.JsonReader( {}, [ { // 定义后台返回数据格式
							name : 'cnt' // 数量
					} ])
			});
				var treedeptid = root_deptid;
			var root = new Ext.tree.AsyncTreeNode( {
				text : root_deptname,
				expanded : true,
				id : root_deptid
			});
			var deptTree = new Ext.tree.TreePanel( {
				loader : new Ext.tree.TreeLoader( {
					baseAttrs : {},
					dataUrl : './user.ered?reqCode=departmentTreeInit'
				}),
				root : root,
				title : '',
				applyTo : 'deptTreeDiv',
				autoScroll : false,
				animate : false,
				useArrows : false,
				border : false
			});
			deptTree.root.select();
			deptTree.on('click', function(node) {
				Ext.getCmp('queryParam').setValue('');
				deptid = node.attributes.id;
				treedeptid = node.attributes.id;
				store.load( {
					params : {
						start : 0,
						limit : bbar.pageSize,
						deptid : deptid,
						usertype:'2'
					}
				});
			});
			var contextMenu = new Ext.menu.Menu( {
				id : 'deptTreeContextMenu',
				items : [ {
					text : '新增人员',
					iconCls : 'page_addIcon',
					handler : function() {
						addInit();
					}
				}, {
					text : '刷新节点',
					iconCls : 'page_refreshIcon',
					handler : function() {
						var selectModel = deptTree.getSelectionModel();
						var selectNode = selectModel.getSelectedNode();
						if (selectNode.attributes.leaf) {
							selectNode.parentNode.reload();
						} else {
							selectNode.reload();
						}
					}
				} ]
			});
			deptTree.on('contextmenu', function(node, e) {
				e.preventDefault();
				deptid = node.attributes.id;
				treedeptid = node.attributes.id;
				store.load( {
					params : {
						start : 0,
						limit : bbar.pageSize,
						deptid : deptid,
						usertype:'2'
					},
					callback : function(r, options, success) {
						for ( var i = 0; i < r.length; i++) {
							var record = r[i];
							var deptid_g = record.data.deptid;
							if (deptid_g == deptid) {
								grid.getSelectionModel().selectRow(i);
							}
						}
					}
				});
				node.select();
				contextMenu.showAt(e.getXY());
			});

			var sm = new Ext.grid.CheckboxSelectionModel({singleSelect:true});

			/** 定义列头 */
			var cm = new Ext.grid.ColumnModel(
					[
							new Ext.grid.RowNumberer(),
							sm,						    
							{ 
								header : '人员编号',
								dataIndex : 'userid',
								hidden : true
							},
							{
								header : '系统号',
								dataIndex : 'account',
								width : 75
							},
							{
								header : '工号',
								dataIndex : 'per_no',
								width : 75
							},
							{
								header : '姓名',
								dataIndex : 'username',
								width : 80
							},
							{
								id : 'deptname',
								header : '所属部门',
								dataIndex : 'deptname',
								width : 120
							},
							{
								id : 'usertype',
								header : '员工类型',
								dataIndex : 'usertype',
								hidden : true,
								width : 80,
								renderer : USERTYPERender
							},
							{
								header : '性别',
								dataIndex : 'sex',
								width : 60,
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
								hidden : true,
								width : 60,
								renderer : function(value) {
									return nationStore.getAt(nationStore
											.findExact('value', value)).data['text'];
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
								width : 60,
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
								dataIndex : 'duty_name',
								width : 60
							},{
                                id : 'crdtype_name',
                                header : '用户身份',
                                dataIndex : 'crdtype_name',
                                width : 60
                            }, {
                                header : '人员状态',
                                dataIndex : 'state',
                                width : 60,
                                renderer : function(value) {
                                    if (value == '1')
                                        return '注销';
                                    else if (value == '0')
                                        return '正常';
                                    else if (value == '2')
                                        return '预开户';
                                    else
                                        return value;
                                }
                            },{
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
							},{
                                id : 'crdtype',
                                dataIndex : 'crdtype',
                                hidden : true
                            }, {
								id : 'bank_no',
								dataIndex : 'bank_no',
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
				},{
					name : 'per_no'
				},{
					name : 'username'
				}, {
					name : 'sex'
				}, {
					name : 'account'
				},{
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
                    name : 'crdtype'
                }, {
                    name : 'crdtype_name'
                }, {
                    name : 'state'
                }])
			});

			// 翻页排序时带上查询条件
			store.on('beforeload', function() {
				this.baseParams = {
					queryParam : Ext.getCmp('queryParam').getValue(),
					deptid : treedeptid,
					usertype:'2'
			
				};
			});
			var pagesize_combo = new Ext.form.ComboBox( {
				name : 'pagesize',
				hiddenName : 'pagesize',
				typeAhead : true,
				triggerAction : 'all',
				lazyRender : true,
				mode : 'local',
				store : new Ext.data.ArrayStore( {
					fields : [ 'value', 'text' ],
					data : [ [ 10, '10条/页' ], [ 20, '20条/页' ], [ 50, '50条/页' ],
							[ 100, '100条/页' ], [ 250, '250条/页' ],
							[ 500, '500条/页' ] ]
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
						deptid : treedeptid,
						usertype:'2'
					
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
						title : '<img src="./resource/image/ext/group.png" align="top" class="IEPNG"><span style="font-weight:normal">一卡通账户信息表</span>',
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
							text : '删除',
							iconCls : 'page_delIcon',
							hidde:true,
							handler : function() {
								deleteUserItems();
							}
						}, '-', {
							text : '刷新',
							iconCls : 'page_refreshIcon',
							handler : function() {
								queryUserItem();
							}
						}, 
						'-', {
							text : '批量导入人员',
							iconCls : 'page_excelIcon',
							handler : function(){ 
							window4Imp.show();
				  		    }      
						}, 
						'-', {
							text : '导出账户信息',
							iconCls : 'page_excelIcon',
								handler : function(){
								exportExcel('user.ered?reqCode=exportUserInfoExcel');
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
			grid.on('rowdblclick', function(grid, rowIndex, event) {
				editInit();
			});
			grid.on('sortchange', function() {
				grid.getSelectionModel().selectFirstRow();
			});
			/*bbar.on("change", function() {
						grid.getSelectionModel().selectFirstRow();
					});*/
			
		store.load( {
					params : {
						start : 0,
						limit : bbar.pageSize,
						queryParam : Ext.getCmp('queryParam').getValue(),
						deptid : treedeptid,
						usertype:'2'
				
					}
		});
		var addRoot = new Ext.tree.AsyncTreeNode( {
				text : root_deptname,
				expanded : true,
				id : root_deptid
			});
			var addDeptTree = new Ext.tree.TreePanel( {
				loader : new Ext.tree.TreeLoader( {
					baseAttrs : {},
					dataUrl : './user.ered?reqCode=departmentTreeInit'
				}),
				root : addRoot,
				autoScroll : true,
				animate : false,
				useArrows : false,
				border : false
			});
			// 监听下拉树的节点单击事件
			addDeptTree.on('click', function(node) {
				comboxWithTree.setValue(node.text);
				Ext.getCmp("addUserFormPanel").findById('deptid').setValue(
						node.attributes.id);
				comboxWithTree.collapse();
			});
			var comboxWithTree = new Ext.form.ComboBox(
					{
						id : 'deptname',
						store : new Ext.data.SimpleStore( {
							fields : [],
							data : [ [] ]
						}),
						editable : false,
						value : ' ',
						emptyText : '请选择...',
						fieldLabel : '部门名称',
						anchor : '95%',
						mode : 'local',
						triggerAction : 'all',
						maxHeight : 390,
						// 下拉框的显示模板,addDeptTreeDiv作为显示下拉树的容器
						tpl : "<tpl for='.'><div style='height:390px'><div id='addDeptTreeDiv'></div></div></tpl>",
						onSelect : Ext.emptyFn
					});
			// 监听下拉框的下拉展开事件
			comboxWithTree.on('expand', function() {
				// 将UI树挂到treeDiv容器
					addDeptTree.render('addDeptTreeDiv');
					// addDeptTree.root.expand(); //只是第一次下拉会加载数据
					addDeptTree.root.reload(); // 每次下拉都会加载数据

				});

			var sexStore = new Ext.data.SimpleStore( {
				fields : [ 'value', 'text' ],
				data : [ [ '1', '1 男' ], [ '2', '2 女' ] /*, ['0', '0 未知']*/]
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
				data : [ [ '1', '普通员工' ], [ '2', '管理员' ],['4','企业操作员'] ]
			});

			var usertypeCombo = new Ext.form.ComboBox( {
				name : 'usertype',
				hiddenName : 'usertype',
				store : usertypeStore,
				mode : 'local',
				triggerAction : 'all',
				valueField : 'value',
				displayField : 'text',
				value : '2',
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
				id:'duty_id',
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
            
			/** 用户身份下拉框定义 */
			var crdTypeStore = new Ext.data.Store( {
				proxy : new Ext.data.HttpProxy( {
					url : './crdType.ered?reqCode=getCrdType4Combox'
				}),
				reader : new Ext.data.JsonReader( {}, [ {
					name : 'value'
				}, {
					name : 'text'
				} ])
			});
			crdTypeStore.load();
			var crdTypeCombo = new Ext.form.ComboBox( {
				name : 'crdtype',
				hiddenName : 'crdtype',
				id:'crdtype_id',
				//value : '0',
				store : crdTypeStore,
				mode : 'remote',
				fieldLabel : '用户身份' + re,
				emptyText : '请选择...',
				triggerAction : 'all',
				displayField : 'text',
				valueField : 'value',
				loadingText : '正在加载数据...',
				forceSelection : true,
				typeAhead : true,
                allowBlank : false,
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
				fieldLabel : '运营商' + re,
				emptyText : '请选择...',
				allowBlank : false,
				forceSelection : true,
				editable : false,
				typeAhead : true,
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
										labelWidth : 70, // 标签宽度
										defaultType : 'textfield',
										border : false,
										items : [ {
											fieldLabel : '工号' + re,
											regex : /^[a-zA-Z0-9]+$/,
											regexText : '工号只能为数字或英文字母',
											maxLength : 20, // 可输入的最大文本长度,不区分中英文字符
											name : 'per_no',
											id : 'per_no',
											allowBlank : false,
//											listeners : { // 监听注册onblur事件
//												'blur' : function(obj) {
//													// 获取数据
//											validateAcc();
//										}
//									},
									anchor : '95%' // 根据窗口，自动调整文本框的宽度
										} ]
									}, {
										columnWidth : .5,
										layout : 'form',
										labelWidth : 70, // 标签宽度
										defaultType : 'textfield',
										border : false,
										items : [ {
											fieldLabel : '姓名' + re,
											name : 'username',
											id : 'username',
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
												labelWidth : 70, // 标签宽度
												defaultType : 'textfield',
												border : false,
												items : [carrierCombo]
											}, {
                                        columnWidth : .5,
                                        layout : 'form',
                                        labelWidth : 70, // 标签宽度
                                        defaultType : 'textfield',
                                        border : false,
                                        items : [crdTypeCombo]
                                    } 
											 ]
								},{
									layout : 'column',
									border : false,
									items : [ {
										columnWidth : .5,
										layout : 'form',
										labelWidth : 70, // 标签宽度
										defaultType : 'textfield',
										border : false,
										items : [ comboxWithTree ]
									}, {
										columnWidth : .5,
										layout : 'form',
										labelWidth : 70, // 标签宽度
										defaultType : 'textfield',
										border : false,
										items : [dutyCombo]
									} ]
								},{
									layout : 'column',
									border : false,
									items : [{
												columnWidth : .5,
												layout : 'form',
												labelWidth : 70, // 标签宽度
												defaultType : 'textfield',
												border : false,
												items : [ {
													fieldLabel : '手机号码',
													regex : /^(13[0-9]|15[0-9]|18[0-9])\d{8}$/,
													regexText : '手机号码格式不合法',
													name : 'mbl_no',
													id : 'mbl_no',
													anchor : '95%'
												} ]
											},{
										columnWidth : .5,
										layout : 'form',
										labelWidth : 70, // 标签宽度
										defaultType : 'textfield',
										border : false,
										items : [{
													fieldLabel : '身份证号',
													name : 'id_crd',
													id : 'id_crd',
													anchor : '95%'
												} ]
									}]
								},
								{
									layout : 'column',
									border : false,
									items : [ {
										columnWidth : .5,
										layout : 'form',
										labelWidth : 70, // 标签宽度
										defaultType : 'textfield',
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
									}, {
										columnWidth : .5,
										layout : 'form',
										labelWidth : 70, // 标签宽度
										defaultType : 'textfield',
										border : false,
										items : [sexCombo]
									} ]
								},
								{
									layout : 'column',
									border : false,
									items : [ {
										columnWidth : .5,
										layout : 'form',
										labelWidth : 70, // 标签宽度
										defaultType : 'textfield',
										border : false,
										items : [ techpostCombo ]
									}, {
										columnWidth : .5,
										layout : 'form',
										labelWidth : 70, // 标签宽度
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
												labelWidth : 70, // 标签宽度
												defaultType : 'textfield',
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
												labelWidth : 70, // 标签宽度
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
												labelWidth : 70, // 标签宽度
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
												labelWidth : 70, // 标签宽度
												defaultType : 'textfield',
												border : false,
												items : [lockedCombo]
											} ]
								}, {
									layout : 'column',
									border : false,
									items : [ {
										columnWidth : .5,
										layout : 'form',
										labelWidth : 70, // 标签宽度
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
									}, {
										columnWidth : .5,
										layout : 'form',
										labelWidth : 70, // 标签宽度
										defaultType : 'textfield',
										border : false,
										items : [ nationCombo ]
									} ]
								}, {
									layout : 'column',
									border : false,
									items : [ {
										columnWidth : .5,
										layout : 'form',
										labelWidth : 70, // 标签宽度
										defaultType : 'textfield',
										border : false,
										items : [ {
											fieldLabel : '籍贯',
											name : 'nat_plc',
											id : 'nat_plc',
											allowBlank : true,
											anchor : '95%'
										} ]
									}, {
										columnWidth : .5,
										layout : 'form',
										labelWidth : 70, // 标签宽度
										defaultType : 'textfield',
										border : false,
										items : [ wedlockCombo ]
									} ]
								}, {
									layout : 'column',
									border : false,
									items : [ {
										columnWidth : .5,
										layout : 'form',
										labelWidth : 70, // 标签宽度
										defaultType : 'textfield',
										border : false,
										items : [ {
											fieldLabel : '暂住证号',
											name : 'tmp_crd',
											id : 'tmp_crd',
											allowBlank : true,
											anchor : '95%'
										} ]
									}, {
										columnWidth : .5,
										layout : 'form',
										labelWidth : 70, // 标签宽度
										defaultType : 'textfield',
										border : false,
										items : [ {
											fieldLabel : '备注',
											name : 'remark',
											id : 'remark',
											allowBlank : true,
											anchor : '95%'
										}, {
											//fieldLabel : '人员类型',
											name : 'usertype',
											id : 'usertype',
											value : "2",
											hidden : true
										}, {//usertypeCombo
													id : 'windowmode',
													name : 'windowmode',
													hidden : true
												}, {
													id : 'deptid',
													name : 'deptid',
													hidden : true
												}, {
													id : 'deptid_old',
													name : 'deptid_old',
													hidden : true
												}, {
													id : 'userid',
													name : 'userid',
													hidden : true
												}, {
													id : 'updatemode',
													name : 'updatemode',
													hidden : true
												} ]
									} ]
								} ]
					});
			var addUserWindow = new Ext.Window(
					{
						layout : 'fit',
						width : 500,
						height : 425,
						resizable : false,
						draggable : true,
						closeAction : 'hide',
						title : '新增人员(*为必填项)',
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
						items : [ addUserFormPanel ],
						buttons : [
								{
									text : '保存',
									iconCls : 'acceptIcon',
									handler : function() {
										var mode = Ext.getCmp('windowmode')
												.getValue();
										if (mode == 'add')
											saveUserItem();
										if (mode == 'edit')
											updateUserItem();
									}
								}, {
									text : '重置',
									id : 'btnReset',
									iconCls : 'tbar_synchronizeIcon',
									handler : function() {
										// clearForm(addUserFormPanel.getForm());
									Ext.getCmp("per_no").setValue("");
									Ext.getCmp("username").setValue("");
//									Ext.getCmp("password").setValue("");
//									Ext.getCmp("password1").setValue("");
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
									html : "第一行标题请勿改动;<br/>工号为8位以内字母或数字;<br/>性别为男或女;<br/>手机运营商为移动,联通,电信;<br/>中间不要有空行</SPAN>",
									anchor : '99%'
								},{
									xtype : "label",
									labelStyle : 'color:red;width=60px;',
									html : "<SPAN STYLE='COLOR:blue'><a href='./cnnct/template/user.xls' target='_blank'>下载Excel导入模板</a></SPAN>",
									anchor : '99%'
								}
								]
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
                                        deptTree.root.reload();
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

			/**
			 * 布局
			 */
			var viewport = new Ext.Viewport( {
				layout : 'border',
				items : [ {
					title : '<span style="font-weight:normal">组织机构</span>',
					iconCls : 'chart_organisationIcon',
					tools : [ {
						id : 'refresh',
						handler : function() {
							deptTree.root.reload()
						}
					} ],
					collapsible : true,
					width : 210,
					minSize : 160,
					maxSize : 280,
					split : true,
					region : 'west',
					autoScroll : true,
					// collapseMode:'mini',
					items : [ deptTree ]
				}, {
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
						deptid : treedeptid,
						usertype:'2'
				
					}
				});
			}

			/**
			 * 新增人员初始化
			 */
			function addInit() {
				// clearForm(addUserFormPanel.getForm());
				var flag = Ext.getCmp('windowmode').getValue();
				if (typeof (flag) != 'undefined') {
					addUserFormPanel.form.getEl().dom.reset();
				} else {
					clearForm(addUserFormPanel.getForm());
				}
				var selectModel = deptTree.getSelectionModel();
				var selectNode = selectModel.getSelectedNode();
				Ext.getCmp('deptname').setValue(selectNode.attributes.text);
				Ext.getCmp('deptid').setValue(selectNode.attributes.id);
				addUserWindow.show();
				addUserWindow
						.setTitle('新增人员<span style="color:Red">(*为必填项)</span>');
				Ext.getCmp('windowmode').setValue('add');
				comboxWithTree.setDisabled(false);
				Ext.getCmp('per_no').setDisabled(false);
				Ext.getCmp('crdtype_id').setDisabled(false);
				Ext.getCmp('btnReset').show();

				// 为下拉框赋初始值
				lockedCombo.setValue('0');
				//usertypeCombo.setValue('1');
				Ext.getCmp('usertype').setValue('2');
				sexCombo.setValue('1');
				techpostCombo.setValue('0');
				carrierCombo.setValue('0');
				nationCombo.setValue('1'); // 民族下拉框
				wedlockCombo.setValue('0'); // 婚姻状况下拉框
			}

			/**
			 * 保存人员数据
			 */
			function saveUserItem() {
				if (!addUserFormPanel.form.isValid()) {
					return;
				}
//				var _deptid = Ext.getCmp('deptid').getValue();
//				if (_deptid.length <= 6) {
//					Ext.Msg.alert('提示', '请选择正确部门节点名称。');
//					return;
//				}
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
					}
				});
			}

			/**
			 * 删除人员
			 */
			function deleteUserItems() {
				var rows = grid.getSelectionModel().getSelections();
				var fields = '';
                if (Ext.isEmpty(rows)) {
                    Ext.Msg.alert('提示', '请先选中要删除的人员!');
                    return;
                }
				for ( var i = 0; i < rows.length; i++) {
					if (rows[i].get('state') == '0') {
						Ext.Msg.alert('提示', '选中的人员状态正常，无法删除!');
                        return;
					}
				}
				/*if (fields != '') {
					Ext.Msg.alert('提示','<b>您选中的项目中包含如下系统内置的只读项目</b><br>' + fields + '<font color=red>系统内置人员不能删除!</font>');
					return;
				}*/
				var strChecked = jsArray2JsString(rows, 'userid');
				Ext.Msg.confirm('请确认','<span style="color:red">您确定删除该人员信息吗?',
								function(btn, text) {
									if (btn == 'yes') {
										showWaitMsg();
										Ext.Ajax.request( {
													url : './user.ered?reqCode=deleteUserItems',
													success : function(response) {
														var resultArray = Ext.util.JSON
																.decode(response.responseText);
														store.reload();
														Ext.Msg.alert('提示',resultArray.msg);
													},
													failure : function(response) {
														var resultArray = Ext.util.JSON
																.decode(response.responseText);
														Ext.Msg.alert('提示',resultArray.msg);
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
				if (record.get('usertype') == '8'
						&& record.get('account') == 'admin') {
					Ext.MessageBox.alert('提示', '系统内置人员,不能修改!');
					return;
				}
				if (record.get('usertype') == '3' && root_usertype != '9'
						&& root_usertype != '8') {
					Ext.MessageBox.alert('提示', '系统内置人员,不能修改!');
					return;
				}
				addUserFormPanel.getForm().loadRecord(record);
				addUserWindow.show();
				addUserWindow.setTitle('修改人员<span style="color:Red">(*为必填项)</span>');
				Ext.getCmp('windowmode').setValue('edit');
				Ext.getCmp('deptid_old').setValue(record.get('deptid'));
				if(record.get('state')!='2'){//人员类型不为预开户时设置身份类型可更改
					Ext.getCmp('crdtype_id').disable();
				}
//				Ext.getCmp('password').setValue('@@@@@@');
//				Ext.getCmp('password1').setValue('@@@@@@');
				Ext.getCmp('userid').setValue(record.get('userid'));
				Ext.getCmp('per_no').setDisabled(true);
				Ext.getCmp('btnReset').hide();
			}

			/**
			 * 修改人员数据
			 */
			function updateUserItem() {
				if (!addUserFormPanel.form.isValid()) {
					return;
				}
//				var _deptid = Ext.getCmp('deptid').getValue();
//				if (_deptid.length <= 6) {
//					Ext.Msg.alert('提示', '请选择正确部门节点名称。');
//					return;
//				}
//				var idcrd = Ext.getCmp('id_crd').getValue();
//				isIdCardNo(idcrd);

//				password1 = Ext.getCmp('password1').getValue();
//				password = Ext.getCmp('password').getValue();
//				if (password == '@@@@@@' && password1 == '@@@@@@') {
//					// Ext.getCmp('updatemode').setValue('1');
//				} else {
//					Ext.getCmp('updatemode').setValue('2');
//					if (password1 != password) {
//						Ext.Msg.alert('提示', '两次输入的密码不匹配,请重新输入!');
//						Ext.getCmp('password').setValue('');
//						Ext.getCmp('password1').setValue('');
//						return;
//					}
//				}
				var duty_id = Ext.getCmp('duty_id').getValue();
				if(duty_id==null){
				  Ext.getCmp('duty_id').setValue('');	
				}
				var deptid = Ext.getCmp('deptid').getValue();
				var deptid_old = Ext.getCmp('deptid_old').getValue();
				/*if (deptid != deptid_old) {
					Ext.Msg.confirm('确认',
							'修改所属部门将导致人员/角色映射、人员/菜单映射数据丢失! 继续保存吗?', function(
									btn, text) {
								if (btn == 'yes') {
									update();
								} else {
									return;
								}
							});
					return;
				} else {*/
					update();
				//}
			}

			/**
			 * 更新
			 */
			function update() {
				addUserFormPanel.form.submit( {
					url : './user.ered?reqCode=updateUserItem',
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
						Ext.MessageBox.alert('提示', '人员数据修改失败:<br>' + msg);
					}
				});
			}

			function validateAcc() {
				if (Ext.getCmp('per_no').getValue() == '') {
					Ext.Msg.alert('提示', '请输入工号!');
					return;
				}
				validateAccStore.load( {
					params : {
						account : Ext.getCmp('account').getValue()
					}
				});
			}

			validateAccStore.on('load', function(obj) {
				if (obj.getAt(0) != null) { // 如果返回的数据非空
						Ext.Msg.alert('提示', '该工号已存在,请重新输入!');
					} else {
					}
				});
		});