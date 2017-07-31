/*******************************************************************************
 * 创建日期: 2013-05-08 创建作者：may 功能：订单总进度 最后修改时间： 修改记录：
 ******************************************************************************/
Ext.onReady(function() {
	// 启用快速提示
	Ext.QuickTips.init();
	var check_ord_seq_no;// 选中的订单记录
	var changeFlag = false;
	// 标识变量
	var isMyOrderQuery = false;

	// fob日期判断预判天数
	var fobDaynum = 7;
	// 裁剪日期判断预判天数;
	var sewDaynum = 0;

	// 流程信息对应的前道信息
	var natureList = {};
	natureList.real_cut_num = '';
	natureList.draw_num = 'real_cut_num';
	natureList.sew_num = 'draw_num';
	natureList.bach_accept_num = 'sew_delivery_num';
	natureList.bach_delivery_num = 'bach_accept_num';
	natureList.pack_accept_num = 'bach_delivery_num';
	natureList.receive_f_product = 'f_product_num';
	natureList.receive_b_product = 'b_product_num';
	natureList.sew_delivery_num = 'sew_num';
	natureList.sendout_f_product = 'receive_f_product';
	natureList.sendout_b_product = 'receive_b_product';
	// 默认日期
	var date = new Date();
	var day = date.getDay();
	var startDate = new Date();
	var endDate = new Date();
	if (day >= 26) {
		startDate = startDate.add(Date.MONTH, -1);
	} else {
		startDate = startDate.add(Date.MONTH, -2);
	}
	if (day > 25) {
		endDate = endDate.add(Date.MONTH, 2);
	} else {
		endDate = endDate.add(Date.MONTH, 1);
	}
	endDate.setDate(25);
	startDate.setDate(26);
	var fastFlag = false;
	// 订单查询第二栏
	var ordstateCombo = new Ext.form.ComboBox({
				id : 'orderState',
				hiddenName : 'orderStateName',
				name : 'orderStateName',
				width : 85,
				mode : 'local',
				store : new Ext.data.ArrayStore({
							fields : ['value', 'text'],
							data : [['', '全部'], ['0', '未排产'], ['1', '在产中'],
									['2', '已交货']]
						}),
				displayField : 'text',
				valueField : 'value',
				triggerAction : 'all',
				value : '',
				editable : false
			});
	ordstateCombo.on('select', function(combo, record, idx) {
				loadStore4ordStore();
			});
	var tbar4Query2 = new Ext.Toolbar({
				items : ['-', '订单状态:', ordstateCombo, '-', {
							xtype : 'checkbox',
							boxLabel : '我的订单',
							name : 'myorder',
							inputValue : '1',
							checked : true,
							id : 'myorder',
							listeners : {
								check : function(checkbox, checked) {
									loadStore4ordStore();
								}
							}
						}, '-', {
							xtype : 'checkbox',
							boxLabel : '已做完单报告',
							name : 'isReportOrder',
							inputValue : '1',
							checked : true,
							id : 'isReportOrder',
							listeners : {
								check : function(checkbox, checked) {
									loadStore4ordStore();
								}
							}
						}]
			})

	var formPanel = new Ext.form.FormPanel({
		collapsible : false,
		border : false,
		region : 'north',
		labelWidth : 70, // 标签宽度
		frame : false, // 是否渲染表单面板背景色
		labelAlign : 'right', // 标签对齐方式
		bodyStyle : 'padding:5 5 0', // 表单元素和表单面板的边距
		buttonAlign : 'center',
		name : 'codeForm',
		height : 80,
		tbar : [{
					xtype : 'datefield',
					id : 'startdate',
					name : 'startdate',
					format : 'Y-m-d',
					emptyText : '起始日期',
					editable : true,
					width : 120,
					value : startDate,
					listeners : {
						select : function() {
							loadStore4ordStore();
						}
					}
				}, '-', {
					xtype : 'datefield',
					id : 'enddate',
					name : 'enddate',
					format : 'Y-m-d',
					emptyText : '结束日期',
					editable : true,
					value : endDate,
					width : 120,
					listeners : {
						select : function() {
							loadStore4ordStore();
						}
					}
				}, '-', {
					xtype : 'combo',
					id : 'dateTypeCombo',
					hiddenName : 'orderStateName',
					name : 'orderStateName',
					width : 85,
					mode : 'local',
					store : new Ext.data.ArrayStore({
								fields : ['value', 'text'],
								data : [['0', '日期类型'], ['1', 'FOB交期'],
										['2', '开裁日期'], ['3', '生产日期'],
										['4', '出运日期'], ['5', '记录出运日期'],['6','尾查期']]
							}),
					displayField : 'text',
					valueField : 'value',
					triggerAction : 'all',
					value : '1',
					editable : false,
					listeners : {
						select : function() {
							loadStore4ordStore();
						}
					}
				}],
		items : [{
			layout : 'column',
			border : false,
			items : [{
				columnWidth : 1,
				layout : 'form',
				border : false,
				items : [{
					xtype : 'radiogroup',
					id : 'leavRadio',
					name : 'leavRadio',
					columns : [.18, .18, .27],
					hideLabel : true,
					listeners : {
						'change' : function(radiogroup) {
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
					items : [{
								inputValue : '0',
								boxLabel : '按工厂',
								name : 'leavRadio',
								disabledClass : 'x-item'
							}, {
								inputValue : '1',
								name : 'leavRadio',
								boxLabel : '按客户',
								checked : true,
								disabledClass : 'x-item'
							}, {
								inputValue : '2',
								name : 'leavRadio',
								boxLabel : '按订单号,款号',
								disabledClass : 'x-item'
							}]
				}]
			}]
		}],
		listeners : {
			render : function(component) {
				tbar4Query2.render(this.tbar);
			}
		}
	});

	var click_grp_id;

	var grp_root = new Ext.tree.AsyncTreeNode({
				text : '分厂',
				expanded : true,
				id : '001'
			});

	var grp_tree = new Ext.tree.TreePanel({
				animate : false,
				root : grp_root,
				loader : new Ext.tree.TreeLoader({
							dataUrl : './sysGrps.ered?reqCode=belongGrpsTreeInit'
						}),
				width : 400,
				autoScroll : true,
				useArrows : false,
				border : false,
				rootVisible : false
			});

	grp_tree.on('click', function(node) {
				click_grp_id = node.attributes.id;// 点击的分厂编号
				loadStore4ordStore({
							belong_grp : click_grp_id
						});
			});

	var click_cust_id;

	var cust_root = new Ext.tree.AsyncTreeNode({
				text : '客户',
				expanded : true,
				id : '001'
			});

	var cust_tree = new Ext.tree.TreePanel({
				animate : false,
				width : 400,
				root : cust_root,
				loader : new Ext.tree.TreeLoader({
							dataUrl:'./custBas.ered?reqCode=getCustBasInfoTreeActionWithChecked'
						}),
				autoScroll : true,
				useArrows : false,
				border : false,
				rootVisible : false
			});
	var queryCustPanelType = '';
	cust_tree.on('checkChange', function(node) {
				 var custArr = cust_tree.getChecked();
        // 封装查询的工厂信息
        var custs = [];
        for(var idx=0;idx<custArr.length;idx++){
            if(custArr[idx].leaf){
                var custBean = custArr[idx];
                custs.push(custBean.id.substr(4,custBean.length))
            }
        }
        var params = {
            cust_ids : custs.join(',')
        }
        loadStore4ordStore(params);
			});

	var ord_query_panel = new Ext.form.FormPanel({
				collapsible : false,
				border : false,
				region : 'center',
				labelWidth : 70, // 标签宽度
				frame : false, // 是否渲染表单面板背景色
				labelAlign : 'right', // 标签对齐方式
				bodyStyle : 'padding:5 5 0', // 表单元素和表单面板的边距
				buttonAlign : 'right',
				items : [{
							xtype : 'textfield',
							fieldLabel : '订单号',
							name : 'order_id',
							id : 'order_id',
							anchor : '100%',
							listeners : {
								specialkey : function(field, e) {
									if (e.getKey() == Ext.EventObject.ENTER) {
										loadStore4ordStore();
									}
								}
							}
						}, {
							xtype : 'textfield',
							fieldLabel : '款号',
							name : 'style_no',
							id : 'style_no',
							anchor : '100%',
							listeners : {
								specialkey : function(field, e) {
									if (e.getKey() == Ext.EventObject.ENTER) {
										loadStore4ordStore();
									}
								}
							}
						}],
				buttons : [{
							text : '查询',
							iconCls : 'page_findIcon',
							handler : function() {
								loadStore4ordStore();
							}
						}, {
							text : '重置',
							iconCls : 'tbar_synchronizeIcon',
							handler : function() {
								Ext.getCmp('order_id').setValue('');
								Ext.getCmp('startdate').setValue('');
								Ext.getCmp('enddate').setValue('');
								Ext.getCmp('style_no').setValue('');
							}
						}]
			});

	// 卡片布局的显示信息
	var detaiQueryPanel = new Ext.Panel({
				title : "客户信息",
				layout : 'card',
				activeItem : 1,
				region : 'center',
				labelAlign : "right",
				labelWidth : 70,
				// frame: false,
				border : false,
				items : [grp_tree, cust_tree, ord_query_panel]
			});

	var queryPanel = new Ext.Panel({
				title : "查询选择窗口",
				region : 'west',
				layout : 'border',
				border : true,
				labelAlign : "right",
				collapsible : true,
				labelWidth : 70,
				width : 400,
				minSize : 160,
				maxSize : 580,
				split : true,
				frame : false,
				items : [formPanel, detaiQueryPanel]
			});

	var ordSm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : false
			});

	var ordCm = new Ext.ux.grid.LockingColumnModel([new Ext.grid.RowNumberer(),
			ordSm, {
				header : '订单号',
				dataIndex : 'order_id',
				width : 80
			}, {
				header : '款号',
				dataIndex : 'style_no'
			}, {
				header : '丝带色号',
				dataIndex : 'ribbon_color'
			}, {
				header : '指令数',
				dataIndex : 'ins_num'
			}, {
				header : '客户',
				dataIndex : 'cust_name',
				width : 80
			}, {
				header : '品名',
				dataIndex : 'article',
				width : 80
			}, {
				header : '交货日期',
				dataIndex : 'deli_date',
				width : 90
			}, {
				header : '开始生产日期',
				dataIndex : 'start_date',
				width : 80
			}, {
				header : '订单标志',
				dataIndex : 'flag',
				width : 80
			}, {
				hidden : true,
				dataIndex : 'seq_no',
				width : 180
			}]);

	var ordStore = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : './ordBas.ered?reqCode=queryOrdBasInfo'
						}),
				reader : new Ext.data.JsonReader({
							totalProperty : 'TOTALCOUNT',
							root : 'ROOT'
						}, ['seq_no', 'order_id', 'article', 'deli_date',
								'ins_num', 'order_date', 'cust_name',
								'start_date', 'style_no', 'ribbon_color'])
			});
	ordStore.on('load', function() {
				if (!fastFlag) {
					return;
				} else {
					var records = ordStore.getRange();
					check_ord_seq_no = jsArray2JsString(records, "seq_no");
					updateChartData();
					fastFlag = false;
				}
			})
	ordStore.on('beforeload', function() {
				// 设置store的查询参数 本次查询不使用
				if (fastFlag) {
					return;
				} else {
					this.baseParams = {
						startdate : Ext.getCmp('startdate').getValue(),
						enddate : Ext.getCmp('enddate').getValue(),
						ismyorder : addmyorderQuery(),
						prodstatus : ordstateCombo.getValue()
					};
				}
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
				name : 'pagesize',
				hiddenName : 'pagesize',
				typeAhead : true,
				triggerAction : 'all',
				lazyRender : true,
				mode : 'local',
				store : new Ext.data.ArrayStore({
							fields : ['value', 'text'],
							data : [[10, '10条/页'], [20, '20条/页'],
									[50, '50条/页'], [100, '100条/页'],
									[250, '250条/页'], [500, '500条/页'],
									[999999, '全部数据']]
						}),
				valueField : 'value',
				displayField : 'text',
				value : '999999',
				editable : false,
				width : 85
			});

	var ordNumber = parseInt(ordPagesize_combo.getValue());
	ordPagesize_combo.on("select", function(comboBox) {
				ordBbar.pageSize = parseInt(comboBox.getValue());
				ordNumber = parseInt(comboBox.getValue());
				loadStore4ordStore();
			});

	var ordBbar = new Ext.PagingToolbar({
				pageSize : ordNumber,
				store : ordStore,
				displayInfo : true,
				displayMsg : '显示{0}条到{1}条,共{2}条',
				plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
				emptyMsg : "没有符合条件的记录",
				items : ['-', '&nbsp;&nbsp;', ordPagesize_combo]
			});

	var ordGrid = new Ext.grid.GridPanel({
				autoScroll : true,
				region : 'center',
				store : ordStore,
				title : '订单信息',
				loadMask : {
					msg : '正在加载表格数据,请稍等...'
				},
				stripeRows : true,
				cm : ordCm,
				sm : ordSm,
				bbar : ordBbar,
				view : new Ext.ux.grid.LockingGridView()
			});
	ordGrid.on('rowdblclick', function() {

				var records = ordGrid.getSelectionModel().getSelections();
				// 如果是报表导出查询
				if (isExcelFlag) {
					var checkOrderId = jsArray2JsString(records, "order_id");
					queryOrder2Excel(checkOrderId);
				} else {
					check_ord_seq_no = jsArray2JsString(records, "seq_no");
					// 如果不是报表导出查询
					updateChartData();
				}
				codeWindow.hide();
			});
	var codePpanel = new Ext.Panel({
				layout : 'border',
				border : true,
				height : 500,
				width : 400,
				minSize : 160,
				maxSize : 580,
				split : true,
				frame : false,
				items : [queryPanel, ordGrid]
			});

	var codeWindow = new Ext.Window({
				layout : 'border',
				width : 1000, // 窗口宽度
				height : 422, // 窗口高度
				resizable : true,
				draggable : false,
				closeAction : 'hide',
				title : '订单查询窗口',
				modal : false,
				collapsible : true,
				titleCollapse : true,
				maximizable : true,
				buttonAlign : 'right',
				border : false,
				animCollapse : true,
				animateTarget : Ext.getBody(),
				constrain : true,
				items : [queryPanel, ordGrid],
				listeners : {
					"beforehide" : function() {
						codeWindow.restore();
					}
				},
				buttons : [{
							text : '快速查询',
							iconCls : 'acceptIcon',
							tooltip : '从今天起往前推 两个星期的已交货的所有订单（14天）',
							// 12.10 todo:重组一个查询params
							// 三个工作月，所有品牌，不包含我的订单，出运日期（待定），
							handler : function() {
								var params = params || {};
								params.start = 0;
								params.limit = 100;
								var start = new Date();
								params.startdate = start.add(Date.DAY, -14);
								params.enddate = new Date();
								params.ismyorder = "";
								params.prodstatus = '2';
								params.dateType = '5';
								fastFlag = true;
								ordStore.load({
											params : params
										});
								codeWindow.hide();
							}
						}, {
							text : '确认',
							iconCls : 'acceptIcon',
							handler : function() {
								var records = ordGrid.getSelectionModel()
										.getSelections();
								if (Ext.isEmpty(records)) {
									Ext.Msg.alert('提示', '请选择一条记录!');
									return;
								}

								// 如果是报表导出查询
								if (isExcelFlag) {
									var checkOrderId = jsArray2JsString(
											records, "order_id");
									queryOrder2Excel(checkOrderId);
								} else {
									check_ord_seq_no = jsArray2JsString(
											records, "seq_no");
									// 如果不是报表导出查询
									updateChartData();
								}
								codeWindow.hide();
							}
						}, {
							text : '关闭',
							iconCls : 'deleteIcon',
							handler : function() {
								codeWindow.hide();
								codeWindow.restore();
								Ext.getCmp('order_id').setValue('');
								Ext.getCmp('startdate').setValue('');
								Ext.getCmp('enddate').setValue('');
								Ext.getCmp('style_no').setValue('');
								ordStore.removeAll();
							}
						}]
			});

	var detail_sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			});
	// 去掉单选框 2013年10月12日10:21:02 zhouww
	// 2014.7.24 添加客户
	var detail_cm = new Ext.ux.grid.LockingColumnModel([
			new Ext.grid.RowNumberer({locked : true}), {
                header : '订单号',
                dataIndex : 'ord_seq_no',
                locked : true,
                width : 120,
                renderer : function(val, param, record) {
                    var sew_start_date = record.get('sew_start_date');
                    var real_cut_num = record.get('real_cut_num');
                    // 如果是空的开裁日期, 直接返回
                    if (Ext.isEmpty(sew_start_date)) {
                        return val;
                    }
                    if ((new Date().add(Date.DAY, sewDaynum).format('Y-m-d') >= new Date(sew_start_date)
                            .format('Y-m-d'))
                            && (Ext.isEmpty(real_cut_num) || real_cut_num == '0')) {
                        return '<span style="color:#FF3E96">' + val + '</span>';
                    }
                    return val;
                }
            }, {
                header : '款号',
                dataIndex : 'style_no',
                locked : true,
                width : 120,
                renderer : function(val, param, record) {
                    var fob_date = record.get('fob_deal_date');
                    // 如果是空的fob日期，直接返回
                    if (Ext.isEmpty(fob_date)) {
                        return val;
                    }
                    var sendout_f_product = record.get('sendout_f_product');
                    if ((new Date().add(Date.DAY, fobDaynum) > new Date(fob_date))
                            && (Ext.isEmpty(sendout_f_product) || sendout_f_product == '0')) {
                        return '<span style="color:blue">' + val + '</span>';
                    }
                    return val;
                }
            }, {
				header : '实际损耗(%)',
                width : 120,
				dataIndex : 'consume',
				renderer : function(val, param2, record) {
					// 修改没有开裁，没有出运时的显示 xtj7.22
					var value = '';
					if (val == 1) {
						value = '缺少出运'
					} else {
						value = Ext.util.Format.number(val * 100, '0.00') + '%';
					}
					var text = '<span onclick="showSrChartWindow(' + "'"
							+ record.get('ord_seq_no') + "'" + ')" >' + value
							+ '</span>';
					if (record.get('isordreport') - 0 > 0) { // 如果大于0的话就标示有完单报告信息
						text += '<span style="color:red">(*)</span>'
					}
					return text;
				}

			}, {
				header : '损耗数',
				dataIndex : 'consume_num',
				width : 60

			}, {
				header : '缝制损耗',
				dataIndex : 'cut_consume',
				hidden : true,
				width : 60
			}, {
				header : '水洗损耗',
				dataIndex : 'wash_consume',
				hidden : true,
				width : 60
			}, {
				header : '其他损耗',
				dataIndex : 'other_consume',
				hidden : true,
				width : 60
			}, {
				header : '客户',
				dataIndex : 'cust_name',
				width : 80
			}, {
				header : '品名',
				dataIndex : 'article',
				width : 150
			}, {
				header : '缝制工厂',
				dataIndex : 'sew_fac_name',
				width : 80
			}, {
				header : '水洗工厂',
				dataIndex : 'bach_fac_name',
				width : 80
			}, {
				header : '后整工厂',
				dataIndex : 'pack_fac_name',
				width : 80
			}, {
				header : 'FOB交期',
				dataIndex : 'fob_deal_date',
				width : 150
			}, {
				header : '交货延迟天数',
				dataIndex : 'product_delay',
				width : 80
			}, {
				header : '计划缝制日期',
				dataIndex : 'sew_start_date'
			}, {
				header : '许可损耗(%)',
				dataIndex : 'allow_loss_per',
				renderer : function(val) {
					var value = '';
					value = Ext.util.Format.number(val * 100, '0.00') + '%';
					return value;
				}
			}, {
				header : '损耗超标(%)',
				dataIndex : 'loss_exceed',
				width : 80,
				renderer : function(val) {
					var value = val;
					if (value > 0) {
						value = '<span style="color:red">'
								+ Ext.util.Format.number(value * 100, '0.00')
								+ '</span>%';
					} else {
						value = 0;
					}
					// if(value<0){
					// value=0-value;
					// value ='<span style="color:blue">'+
					// Ext.util.Format.number(value*100,'0.00')+'</span>%';
					// }
					return value;
				}
			}, {
				header : '订单数',
				dataIndex : 'order_num',
				width : 60
			}, {
				header : '指令数',
				dataIndex : 'ins_num',
				width : 60
			}, {
				header : '实裁完成数',
				dataIndex : 'real_cut_num_percent',
				hidden : true,
				width : 90
			}, {
				header : '实裁数',
				dataIndex : 'real_cut_num',
				width : 60,
				renderer : function(value, data, record) {
					return addStyle4natureNum("real_cut_num", value, record);
				}
			}, {
				header : '领片完成数',
				dataIndex : 'draw_num_percent',
				hidden : true,
				width : 90
			}, {
				header : '领片数',
				dataIndex : 'draw_num',
				width : 60,
                hidden : true,
				renderer : function(value, data, record) {
					return addStyle4natureNum("draw_num", value, record);
				}
			}, {
				header : '下线完成数',
				dataIndex : 'sew_num_percent',
				hidden : true,
				width : 90
			}, {
				header : '下线数',
				dataIndex : 'sew_num',
				width : 60,
				renderer : function(value, data, record) {
					return addStyle4natureNum("sew_num", value, record);
				}
			}, {
				header : '送水洗完成数',
				dataIndex : 'sew_delivery_num_percent',
				hidden : true,
				width : 90
			}, {
				header : '送水洗',
				dataIndex : 'sew_delivery_num',
				width : 60,
				renderer : function(value, data, record) {
					return addStyle4natureNum("sew_delivery_num", value, record);
				}
			}, {
				header : '水洗收完成数',
				dataIndex : 'bach_accept_num_percent',
				hidden : true,
				width : 90
			}, {
				header : '水洗收数',
				dataIndex : 'bach_accept_num',
				width : 60,
				renderer : function(value, data, record) {
					return addStyle4natureNum("bach_accept_num", value, record);
				}
			}, {
				header : '水洗交完成数',
				dataIndex : 'bach_delivery_num_percent',
				hidden : true,
				width : 90
			}, {
				header : '水洗交数',
				dataIndex : 'bach_delivery_num',
				width : 60,
				renderer : function(value, data, record) {
					return addStyle4natureNum("bach_delivery_num", value,
							record);
				}
			}, {
				header : '后整收完成数',
				dataIndex : 'pack_accept_num_percent',
				hidden : true,
				width : 90
			}, {
				header : '后整收数',
				dataIndex : 'pack_accept_num',
				width : 60,
				renderer : function(value, data, record) {
					return addStyle4natureNum("pack_accept_num", value, record);
				}
			}, {
				header : '交成品完成数',
				dataIndex : 'f_product_num_percent',
				hidden : true,
				width : 90
			}, {
				header : '交成品数',
				dataIndex : 'f_product_num',
				width : 60,
				renderer : function(value, data, record) {
					return addStyle4natureNum("f_product_num", value, record);
				}
			}, {
				header : '交B品完成数',
				dataIndex : 'b_product_num_percent',
				hidden : true,
				width : 90
			}, {
				header : '交B品数',
				dataIndex : 'b_product_num',
				width : 60,
				renderer : function(value, data, record) {
					return addStyle4natureNum("b_product_num", value, record);
				}
			}, {
				header : '收成品完成数',
				dataIndex : 'receive_f_product_percent',
				hidden : true,
				width : 60
			}, {
				header : '收成品',
				dataIndex : 'receive_f_product',
				width : 60,
				renderer : function(value, data, record) {
					return addStyle4natureNum("receive_f_product", value,
							record);
				}
			}, {
				header : '收B品完成数',
				dataIndex : 'receive_b_product_percent',
				hidden : true,
				width : 60
			}, {
				header : '收B品',
				dataIndex : 'receive_b_product',
				width : 60,
				renderer : function(value, data, record) {
					return addStyle4natureNum("receive_b_product", value,
							record);
				}
			}, {
				header : '出运成品完成率',
				dataIndex : 'sendout_f_product_percent',
				hidden : true,
				width : 60
			}, {
				header : '出运成品',
				dataIndex : 'sendout_f_product',
				width : 60,
				renderer : function(value, data, record) {
					return addStyle4natureNum("sendout_f_product", value,
							record);
				}
			}, {
				header : '出运B品完成率',
				dataIndex : 'sendout_b_product_percent',
				hidden : true,
				width : 60
			}, {
				header : '出运B品',
				dataIndex : 'sendout_b_product',
				width : 60,
				renderer : function(value, data, record) {
					return addStyle4natureNum("sendout_b_product", value,
							record);
				}
			}, {
				header : '中间领用%',
				dataIndex : 'middle_take_percent',
				hidden : true,
				width : 60
			}, {
				header : '中间领用',
				dataIndex : 'middle_take',
				width : 60,
				renderer : function(value, data, record) {
					return addStyle4natureNum("middle_take", value, record);
				}
			}]);

	var detail_store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : 'ordSche.ered?reqCode=getOrdSchePerCent'
						}),
				reader : new Ext.data.JsonReader({
							totalProperty : 'TOTALCOUNT',
							root : 'ROOT'
						}, ['ord_seq_no', 'style_no', 'tr_date', 'ins_num',
								'order_num', 'cust_name', 'real_cut_num',
								'draw_num', 'sew_num', 'fob_deal_date',
								'product_delay', 'bach_accept_num',
								'bach_delivery_num', 'sendout_b_product',
								'pack_accept_num', 'f_product_num',
								'sendout_f_product', 'b_product_num',
								'real_cut_num_percent', 'draw_num_percent',
								'sew_num_percent', 'bach_accept_num_percent',
								'bach_delivery_num_percent', 'sew_fac_name',
								'bach_fac_name', 'pack_fac_name',
								'pack_accept_num_percent', 'consume',
								'consume_num', 'remark', 'allow_loss_per',
								'loss_exceed', 'f_product_num_percent',
								'sendout_f_product_percent',
								'b_product_num_percent',
								'sendout_b_product_percent',
								'receive_f_product',
								'receive_f_product_percent',
								'receive_b_product',
								'receive_b_product_percent', 'middle_take',
								'middle_take_percent', 'sew_start_date',
								'sew_delivery_num', 'sew_delivery_num_percent',
								'article', 'isordreport'])
			});
	// 翻页排序时带上查询条件
	detail_store.on('beforeload', function() {
				this.baseParams = {
					startdate : Ext.getCmp('startdate').getValue(),
					enddate : Ext.getCmp('enddate').getValue(),
					ordseqnos : check_ord_seq_no
				};
			});
	/**
	 * 产生图片所需的数据
	 */
	var xAxisData = [];
	var sewPercent = [];
	var bachPercent = [];
	var f_product_numPercent = [];
	var maxOrder = 15;
	detail_store.on('load', function() {
		// 初始化数据容器
		xAxisData = [];
		sewPercent = [];
		bachPercent = [];
		f_product_numPercent = [];
		detail_storeSize = detail_store.getTotalCount();
		// 显示订单显示数量为15个
		if (detail_storeSize > maxOrder) {
			// Ext.Msg.alert('提示','最多显示'+maxOrder+'条结果数据，现在有'+detail_storeSize+'条数据');
			changeOrdDayChart(); // 此处画图是为了销毁图片
			return;
		}
		if (parseInt(detail_storeSize) > 0) {
			indexInt = 0;
			for (var i = 0; i < detail_storeSize; i++) {
				xAxisBean = detail_store.getAt(i).json;
				ins_num = xAxisBean.ins_num;
				if (ins_num == 0) {
					continue;
				}
				sew_num = xAxisBean.sew_num / ins_num * 100;
				bach_delivery_num = xAxisBean.bach_delivery_num / ins_num * 100;
				f_product_num = xAxisBean.f_product_num / ins_num * 100;
				if (sew_num == 0 && bach_delivery_num == 0
						&& f_product_num == 0) {
					continue;
				}
				xAxisName = '订单:'
						+ xAxisBean.ord_seq_no
						+ ' 指令数 '
						+ ins_num
						+ '<br/> '
						+ 'FOB交期 '
						+ (xAxisBean.fob_deal_date == null
								? ''
								: xAxisBean.fob_deal_date) + '<br/>' + '日期 '
						+ xAxisBean.order_date;
				xAxisData[indexInt] = xAxisName;
				if ((sew_num + '').indexOf('.') != -1) {
					sewPercent[indexInt] = {
						y : parseFloat(sew_num.toFixed(1)),
						num : xAxisBean.sew_num
					};
				} else {
					sewPercent[indexInt] = {
						y : parseFloat(sew_num),
						num : xAxisBean.sew_num
					};
				}
				if ((bach_delivery_num + '').indexOf('.') != -1) {
					bachPercent[indexInt] = {
						y : parseFloat(bach_delivery_num.toFixed(1)),
						num : xAxisBean.bach_delivery_num
					};
				} else {
					bachPercent[indexInt] = {
						y : parseFloat(bach_delivery_num),
						num : xAxisBean.bach_delivery_num
					};
				}
				if ((f_product_num + '').indexOf('.') != -1) {
					f_product_numPercent[indexInt] = {
						y : parseFloat(f_product_num.toFixed(1)),
						num : xAxisBean.f_product_num
					};
				} else {
					f_product_numPercent[indexInt] = {
						y : parseFloat(f_product_num),
						num : xAxisBean.f_product_num
					};
				}
				indexInt++;
			}
		}
		changeOrdDayChart();
	})

	var detail_pagesize_combo = new Ext.form.ComboBox({
				name : 'pagesize',
				hiddenName : 'pagesize',
				typeAhead : true,
				triggerAction : 'all',
				lazyRender : true,
				mode : 'local',
				store : new Ext.data.ArrayStore({
							fields : ['value', 'text'],
							data : [[10, '10条/页'], [20, '20条/页'],
									[50, '50条/页'], [100, '100条/页'],
									[250, '250条/页'], [500, '500条/页']]
						}),
				valueField : 'value',
				displayField : 'text',
				value : '100',
				editable : false,
				width : 85
			});

	var detail_number = parseInt(detail_pagesize_combo.getValue());
	detail_pagesize_combo.on("select", function(comboBox) {
				detail_bbar.pageSize = parseInt(comboBox.getValue());
				detail_number = parseInt(comboBox.getValue());
				detail_store.load({
							params : {
								start : 0,
								limit : detail_bbar.pageSize,
								startdate : Ext.getCmp('startdate').getValue(),
								enddate : Ext.getCmp('enddate').getValue()
							}
						});
			});

	var detail_bbar = new Ext.PagingToolbar({
				pageSize : detail_number,
				store : detail_store,
				displayInfo : true,
				displayMsg : '显示{0}条到{1}条,共{2}条',
				plugins : new Ext.ux.ProgressBarPager(), // 分页进度条
				emptyMsg : "没有符合条件的记录",
				items : ['-', '&nbsp;&nbsp;', detail_pagesize_combo]
			})
    var summary = new Ext.ux.grid.GridSummary();
	var detail_grid = new Ext.grid.GridPanel({
		title : '总进度详情',
		border : true,
        plugins : [summary], // 合计
		store : detail_store,
		region : 'center',
		loadMask : {
			msg : '正在加载表格数据,请稍等...'
		},
		viewConfig : {
	// forceFit: true
		},
		stripeRows : true,
		// frame: true,
		border : false,
		margins : '3 3 3 3',
		cm : detail_cm,
		// sm: detail_sm,
		tbar : ['-', {
			text : "<div><SPAN STYLE='font:normal 10pt Arial'>查询窗口</SPAN></div>",
			iconCls : 'page_findIcon',
			xtype : "button",
			handler : function() {
				codeWindow.show();
			}
		}, '-', '裁剪预警日期:', {
			xtype : 'numberfield',
			value : sewDaynum,
			width : 30,
			allowBlank : false,
			allowDecimals : false,
			allowNegative : false,
			id : 'sewWarningDate'
		}, '天', {
			text : '设置裁剪预警日期',
			xtype : 'button',
			iconCls : 'kfwcxIcon',
			handler : function() {
				setSewWarningDate();
			}
		}, '-', 'FOB预警日期:', {
			xtype : 'numberfield',
			value : fobDaynum,
			width : 30,
			allowBlank : false,
			allowDecimals : false,
			allowNegative : false,
			id : 'warningDate'
		}, '天', {
			text : '设置FOB预警日期',
			xtype : 'button',
			iconCls : 'kfwcxIcon',
			handler : function() {
				setWarningDate();
			}
		}, '->', {
			text : '导出',
			id : 'import_button',
			iconCls : 'page_excelIcon',
			handler : function() {
				exportExcel('./ordSche.ered?reqCode=exportOrdScheList&flag=cur');
			}
		}],
		bbar : detail_bbar,
		view : new Ext.ux.grid.LockingGridView()
	});
	// 悬浮窗事件

	// 添加总进度详情双击事件 8-20 xtj
	detail_grid.on('rowdblclick', function(grid, rowIndex, event) {

				window.parent.directOrdIndex = rowIndex;
				// window.parent.directOrdIndex=recordBean.json.order_id;
				window.parent.directOrdList = grid.getStore().getRange();
				window.parent.addTab('ordSche.ered?reqCode=ordDayScheInit',
						'订单生产情况', '010502',
						'常州东奥服装有限公司RFID系统 -> 订单运作情况 -> 订单生产情况', 'kqrbb.png');
			})
	detail_grid.on('render', function(grid) {
		var store = grid.getStore();
		var view = grid.getView();
		var str = "";
		detail_grid.tip = new Ext.ToolTip({
			target : view.mainBody,
			title : '订单备注信息',
			delegate : '.x-grid3-row',
			trackMouse : true,
			dismissDelay : 3000,
			renderTo : document.body,
			listeners : {
				"beforeshow" : function updateTipBody(tip) {
					var rowIndex = view.findRowIndex(tip.triggerElement);
					if (store.getAt(rowIndex).get('remark').length == 0) {
						str = '<div style="padding:20px;border:1px solid #999; color:#555; background: #f9f9f9;">'
								+ "" + '</div>';
						tip.body.dom.innerHTML = "";
					} else {
						str = '<div style="padding:20px;border:1px solid #999; color:#555; background: #f9f9f9;">'
								+ store.getAt(rowIndex).get('remark') + '</div>';
						tip.body.dom.innerHTML = str;
					}
					rowIndex = null;
				}
			}
		});

	})

	var getValueNoNullById = function(idval) {
		var value = Ext.getCmp(idval).getValue();
		return value ? value : '';
	}

	var panel = new Ext.Panel({
				title : '订单总进度图',
				tbar : ['-', '<span style="color:red">显示15个订单上限</span>'],
				html : '<div id="ordScheListChart"></div>',
				autoWidth : true,
				region : 'center'
			});

	// 考勤班次树
	var root = new Ext.tree.AsyncTreeNode({
				text : '群组',
				expanded : true,
				id : '001',
				children : [{
							text : '缝制完成数',
							checked : true,
							id : 'bach_accept_num',
							leaf : true,
							iconCls : 'folder_wrenchIcon'
						}, {
							text : '水洗完成数',
							checked : true,
							id : 'pack_accept_num',
							leaf : true,
							iconCls : 'folder_wrenchIcon'
						}, {
							text : '交成品完成数',
							checked : true,
							id : 'f_product_num',
							leaf : true,
							iconCls : 'folder_wrenchIcon'
						}]
			});

	var tree = new Ext.tree.TreePanel({
				animate : false,
				root : root,
				loader : new Ext.tree.TreeLoader(),
				border : true,
				autoScroll : false,
				useArrows : false,
				border : false,
				rootVisible : false
			});
	tree.on('render', function() {
				tree.on('checkchange', function() {
							changeFlag = true;
							updateChartData();
						});
			});

	// 2013-8-19 zhouww
	// 添加日进度查询
	var dayOrd_store = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
					url : './ordSche.ered?reqCode=getOrdDayScheMulti'
				}),
		reader : new Ext.data.JsonReader({
					totalProperty : 'TOTALCOUNT',
					root : 'ROOT'
				}, ['ord_seq_no', 'style_no', 'tr_date', 'ins_num',
						'order_num', 'real_cut_num', 'draw_num', 'sew_num',
						'bach_accept_num', 'bach_delivery_num',
						'pack_accept_num', 'f_product_num',
						'sendout_b_product', 'b_product_num',
						'receive_f_product', 'sendout_f_product',
						'receive_b_product', 'middle_take', 'sew_delivery_num'])
	});

	dayOrd_store.on('beforeload', function() {
				this.baseParams = {
					startdate : Ext.getCmp('startdate').getValue(),
					enddate : Ext.getCmp('enddate').getValue()
				};
			});
	var dayOrd_cm = new Ext.ux.grid.LockingColumnModel([
			new Ext.grid.RowNumberer(), {
				header : '订单号',
				dataIndex : 'ord_seq_no',
				width : 100
			}, {
				header : '款号',
				dataIndex : 'style_no',
				width : 100
			}, {
				header : '日期',
				dataIndex : 'tr_date',
				width : 100
			}, {
				header : '订单数',
				dataIndex : 'order_num',
				width : 60
			}, {
				header : '指令数',
				dataIndex : 'ins_num',
				width : 60
			}, {
				header : '实裁数',
				dataIndex : 'real_cut_num',
				width : 60
			}, {
				header : '领片数',
				dataIndex : 'draw_num',
				width : 60
			}, {
				header : '下线数',
				dataIndex : 'sew_num',
				width : 60
			}, {
				header : '送水洗',
				dataIndex : 'sew_delivery_num',
				width : 60
			}, {
				header : '水洗收数',
				dataIndex : 'bach_accept_num',
				width : 60
			}, {
				header : '水洗交数',
				dataIndex : 'bach_delivery_num',
				width : 60
			}, {
				header : '后整收数',
				dataIndex : 'pack_accept_num',
				width : 60
			}, {
				header : '交成品数',
				dataIndex : 'f_product_num',
				width : 60
			}, {
				header : '交B品数',
				dataIndex : 'b_product_num',
				width : 60
			}, {
				header : '收成品',
				dataIndex : 'receive_f_product',
				width : 60
			}, {
				header : '收B品',
				dataIndex : 'receive_b_product',
				width : 60
			}, {
				header : '出运成品',
				dataIndex : 'sendout_f_product',
				width : 60
			}, {
				header : '出运B品',
				dataIndex : 'sendout_b_product',
				width : 60
			}, {
				header : "中间领用",
				dataIndex : 'middle_take',
				width : 60
			}]);

	/**
	 * 日进度详情 2013-8-19 zhouww
	 */
	var dayOrd_grid = new Ext.grid.GridPanel({
		// height: 510,
		border : true,
		store : dayOrd_store,
		title : '日进度详情',
		region : 'center',
		loadMask : {
			msg : '正在加载表格数据,请稍等...'
		},
		viewConfig : {
			forceFit : true
		},
		stripeRows : true,
		// frame: true,
		border : false,
		margins : '3 3 3 3',
		cm : dayOrd_cm,
		tbar : ['->', {
					text : '导出详细记录',
					id : 'importDetail_button',
					iconCls : 'page_excelIcon',
					handler : function() {
						exportExcel('./ordSche.ered?reqCode=prodDayScheExceport');
					}
				}],
		view : new Ext.ux.grid.LockingGridView()
	});
	var washExcel_store = new Ext.data.JsonStore({
		root : 'ROOT',
		url : encodeURI('./ordSche.ered?reqCode=getFactoryByFactoryName&superFactory=水洗厂'),
		fields : ['value', 'text']
	});
	washExcel_store.load();
	/**
	 * 水洗厂下拉表
	 */
	var washFactory_store = new Ext.data.JsonStore({
		root : 'ROOT',
		url : encodeURI('./ordSche.ered?reqCode=getFactoryByFactoryName&superFactory=水洗厂'),
		fields : ['value', 'text']
	});
	washFactory_store.load();
	var washFactory_combo = new Ext.ux.form.LovCombo({
				name : 'value1',
				id : 'washFactory_combo',
				hiddenName : 'value1',
				fieldLabel : '工厂',
				store : washExcel_store,
				mode : 'local',
				hideTrigger : false,
				triggerAction : 'all',
				valueField : 'value',
				displayField : 'text',
				emptyText : '请选择...',
				allowBlank : true,
				editable : false,
				anchor : "95%"
			});
	var washFactory4washExcel = new Ext.ux.form.LovCombo({
				name : 'value2',
				id : 'washFactory4washExcel',
				hiddenName : 'value2',
				fieldLabel : '工厂',
				store : washFactory_store,
				mode : 'local',
				hideTrigger : false,
				triggerAction : 'all',
				valueField : 'value',
				displayField : 'text',
				emptyText : '请选择...',
				allowBlank : true,
				editable : false,
				anchor : "95%"
			});
	/**
	 * 产品分类下拉框
	 */
	var trical4shipmentExcel = new Ext.ux.form.LovCombo({
				name : 'trical4shipmentExcel',
				id : 'trical4shipmentExcel',
				hiddenName : 'tricalCombo',
				fieldLabel : '产品分类',
				store : new Ext.data.ArrayStore({
							fields : ['value', 'text'],
							data : [['牛仔', '牛仔'], ['染色', '染色'], ['色布', '色布']]
						}),
				mode : 'local',
				hideTrigger : false,
				triggerAction : 'all',
				valueField : 'value',
				displayField : 'text',
				emptyText : '请选择...',
				allowBlank : true,
				editable : false,
				anchor : "99%"
			});
	var excelPanel = new Ext.FormPanel({
		title : '报表',
		id : 'excelPanel',
		name : 'excelPanel',
		labelAlign : 'right',
		defaults : {
			border : false,
			bodyStyle : "padding-top:5",
			frame : true
		},
		items : [{
			layout : 'column',
			border : false,
			items : [{
						columnWidth : 0.2,
						layout : 'form',
						border : false,
						items : [{
									xtype : 'datefield',
									id : 'start_date',
									name : 'start_date',
									format : 'Y-m-d',
									emptyText : '开始日期',
									fieldLabel : '开始日期',
									anchor : '95%'
								}]
					}, {
						columnWidth : 0.2,
						layout : 'form',
						border : false,
						items : [{
									xtype : 'datefield',
									id : 'end_date',
									name : 'end_date',
									format : 'Y-m-d',
									emptyText : '结束日期',
									fieldLabel : '结束日期',
									anchor : "95%"
								}]
					}, {
						columnWidth : 0.4,
						layout : 'form',
						border : false,
						items : [washFactory_combo]
					}, {
						columnWidth : 0.2,
						layout : "form",
						border : false,
						items : [{
							text : '洗水报表导出',
							anchor : '95%',
							xtype : 'button',
							id : 'exportExcel_button',
							name : 'exportExcel_button',
							handler : function() {
								var start_date = Ext.getCmp('start_date')
										.getValue();
								var end_date = Ext.getCmp('end_date')
										.getValue();
								if (Ext.isEmpty(start_date)
										|| Ext.isEmpty(end_date)) {
									Ext.Msg.alert("提示信息", "开始日期或结束日期不能为空!");
								}
								exportExcel(encodeURI('./excelExport.ered?reqCode=washStatisticsData'
										+ '&start_date='
										+ start_date.format('Y-m-d')
										+ '&end_date='
										+ end_date.format('Y-m-d')
										+ '&factoryNames='
										+ Ext.getCmp("washFactory_combo")
												.getValue()));
							}
						}]
					}]

		}, {
			layout : 'column',
			border : false,
			items : [{
						columnWidth : 0.7,
						layout : 'form',
						items : [{
									xtype : 'textfield',
									fieldLabel : '订单号',
									id : 'ord_seq_no_excel',
									name : 'ord_seq_no_excel',
									emptyText : '请输入导出的订单号',
									anchor : '95%'
								}]
					}, {
						columnWidth : 0.1,
						layout : 'form',
						items : [{
									text : '查询订单',
									xtype : 'button',
									id : 'queryOrder2Excel',
									name : 'queryOrder2Excel',
									anchor : '95%',
									handler : function() {
										codeWindow.show();
									}
								}]
					}, {
						columnWidth : 0.2,
						layout : 'form',
						items : [{
							text : '(贸易用)订单跟踪表导出',
							xtype : 'button',
							anchor : '95%',
							handler : function() {
								var order_id = Ext.getCmp('ord_seq_no_excel')
										.getValue();
								if (Ext.isEmpty(order_id)) {
									Ext.MessageBox.show({
												buttons : {
													ok : '知道了'
												},
												title : '提示信息',
												msg : '订单号不能为空'
											});
									return;
								}
								// 由于HTTp头不能传递太多的信息 所以先保存导出信息 后导出文件
								Ext.Ajax.request({
									url : './excelExport.ered?reqCode=ordStatisticsExcel&saveParames=true',
									success : function(response) { // 回调函数有1个参数
										var resultArray = Ext.util.JSON
												.decode(response.responseText);
										if (resultArray.success) {
											exportExcel(encodeURI('./excelExport.ered?reqCode=ordStatisticsExcel&export=true'));
										}
									},
									failure : function() {
										Ext.Msg.alert('提示', '信息保存失败,无法导出');
									},
									params : {
										order_id : order_id
									}
								});
							}
						}]
					}]
		}, {
			layout : 'column',
			border : false,
			items : [{
						columnWidth : 0.2,
						layout : "form",
						items : [{
									fieldLabel : '开始日期',
									xtype : 'datefield',
									emptyText : '尾查开始日期',
									format : 'Y-m-d',
									id : 'start_date4washExcel',
									name : 'start_date4washExcel',
									anchor : '95%'
								}]
					}, {
						columnWidth : 0.2,
						layout : 'form',
						items : [{
									fieldLabel : '结束日期',
									xtype : 'datefield',
									format : 'Y-m-d',
									emptyText : '尾查结束日期',
									id : 'end_date4washExcel',
									name : 'end_date4washExcel',
									anchor : '95%'
								}]
					}, {
						columnWidth : 0.2,
						layout : 'form',
						items : [trical4shipmentExcel]
					}, {
						columnWidth : 0.2,
						layout : 'form',
						broder : false,
						items : [washFactory4washExcel]
					}, {
						columnWidth : 0.2,
						layout : 'form',
						items : [{
							xtype : 'button',
							text : '导出水洗厂大货进度表',
							anchor : '95%',
							handler : function() {
								var start_date = Ext
										.getCmp('start_date4washExcel')
										.getValue();
								var end_date = Ext.getCmp('end_date4washExcel')
										.getValue();
								if (Ext.isEmpty(start_date)
										|| Ext.isEmpty(end_date)) {
									Ext.Msg.alert("提示信息", "开始日期或结束日期不能为空!");
								}
								exportExcel(encodeURI('./excelExport.ered?reqCode=washExcelByWeekNum'
										+ '&start_date='
										+ start_date.format('Y-m-d')
										+ '&end_date='
										+ end_date.format('Y-m-d')
										+ '&washFac='
										+ Ext.getCmp('washFactory4washExcel')
												.getValue()
										+ '&classify='
										+ Ext.getCmp('trical4shipmentExcel')
												.getValue()));
							}
						}]
					}]
		}, {
			layout : 'column',
			border : false,
			items : [{
						columnWidth : 0.2,
						layout : 'form',
						items : [{
									xtype : 'datefield',
									id : 'startdate4shipmentExcel',
									name : 'startdate4shipmentExcel',
									format : 'Y-m-d',
									fieldLabel : '开始日期',
									emptyText : '出货开始日期',
									anchor : '95%'
								}]
					}, {
						columnWidth : 0.3,
						layout : 'form',
						items : [{
							xtype : 'button',
							text : '导出下两周出货表',
							anchort : '95%',
							handler : function() {
								var startdate = Ext.util.Format.date(
										Ext.getCmp('startdate4shipmentExcel')
												.getValue(), 'Y-m-d');
								exportExcel(encodeURI('excelExport.ered?reqCode=shipmentExcel'
										+ '&startdate=' + startdate));
							}
						}]
					}]
		}, {
			layout : 'column',
			border : false,
			items : [{
						columnWidth : 0.2,
						layout : 'form',
						items : [{
									xtype : 'datefield',
									id : 'startdate4BReportExcel',
									name : 'startdate4BReportExcel',
									format : 'Y-m-d',
									fieldLabel : '开始日期',
									emptyText : '开始日期',
									anchor : '95%'
								}]
					},{
						columnWidth : 0.2,
						layout : 'form',
						items : [{
									fieldLabel : '结束日期',
									xtype : 'datefield',
									format : 'Y-m-d',
									emptyText : '结束日期',
									id : 'enddate4BReportExcel',
									name : 'enddate4BReportExcel',
									anchor : '95%'
								}]
					}, {
						columnWidth : 0.3,
						layout : 'form',
						items : [{
							xtype : 'button',
							text : '导出B品管理表',
							anchort : '95%',
							handler : function() {
								var startdate = Ext.util.Format.date(
										Ext.getCmp('startdate4BReportExcel')
												.getValue(), 'Y-m-d');
								var enddate = Ext.util.Format.date(
										Ext.getCmp('enddate4BReportExcel')
												.getValue(), 'Y-m-d');				
								exportExcel(encodeURI('excelExport.ered?reqCode=BReportExcel'
										+ '&startdate=' + startdate+'&enddate='+enddate));
							}
						}]
					}, {
						columnWidth : 0.3,
						layout : 'form',
						items : [{
							xtype : 'button',
							text : '导出B品库存表',
							anchort : '95%',
							handler : function() {
								var startdate = Ext.util.Format.date(
										Ext.getCmp('startdate4BReportExcel')
												.getValue(), 'Y-m-d');
								var enddate = Ext.util.Format.date(
										Ext.getCmp('enddate4BReportExcel')
												.getValue(), 'Y-m-d');				
								exportExcel(encodeURI('excelExport.ered?reqCode=BStorageExcel'
										+ '&startdate=' + startdate+'&enddate='+enddate));
							}
						}]
					}]
		}]
	})
	/**
	 * 布局
	 */
	var empTab = new Ext.TabPanel({
				region : 'center',
				border : true,
				margins : '3 3 3 3',
				collapsed : false,
				deferredRender : false,
				layoutOnTabChange : true,
				activeTab : 0,
				autoScroll : true,
				items : [detail_grid, panel, dayOrd_grid, excelPanel]
			});
	var isExcelFlag = false;
	var isFirst = true;
	empTab.on("tabchange", function(tab, panel) {
				if (panel.title.indexOf('报表') != -1) {
					ordPagesize_combo.setValue(500);
					ordBbar.pageSize = 500;
					loadStore4ordStore();
					isExcelFlag = true;
				} else if (panel.title.indexOf('报表') == -1) {
					if (!isFirst) {
						ordPagesize_combo.setValue(50);
						ordBbar.pageSize = 50;
						loadStore4ordStore();
					} else {
						isFirst = false;
					}
					isExcelFlag = false;
				}
			})

	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [empTab, {
							iconCls : 'chart_organisationIcon',
							tools : [{
										id : 'refresh',
										handler : function() {
											tree.root.reload();
										}
									}],
							title : '<span style="font-weight:bold">数量性质</span>',
							width : 140,
							split : true,
							collapsible : true,
							collapsed : true,
							region : 'east',
							autoScroll : true,
							items : [tree]
						}]
			});

	/**
	 * 更新chart数据
	 */
	function updateChartData() {
		var keywords = "";
		if (!changeFlag) {
			keywords = "bach_accept_num,pack_accept_num,f_product_num"
		} else {
			keywords = "" + tree.getChecked('id');
		}
		detail_store.reload({
					params : {
						ordseqnos : check_ord_seq_no
					},
					callback : fnSumInfo
				});
		dayOrd_store.reload({
					params : {
						ordseqnos : check_ord_seq_no
					}
				})
	}

	/**
	 * 汇总表格
	 */
	function fnSumInfo() {
		var n = detail_grid.getStore().getCount();// 获得总行数

//		if (n > 1) {
//			summary.toggleSummary(false);
//		} else {
			summary.toggleSummary(true);
//TODO
			var sumObject = {
			};
			var real_cut_num =0;
            var sew_num = 0;
            var bach_accept_num = 0;
            var bach_delivery_num = 0;
            var pack_accept_num = 0;
            var f_product_num = 0;
            var b_product_num = 0;
            var receive_f_product = 0;
            var receive_b_product = 0;
            var middle_take = 0;
            var sew_delivery_num = 0;
            var sendout_f_product=0;
            var sendout_b_product = 0;

			for (var i = 0; i < n; i++) {
                // 计算裁剪数和出运数
				var record = detail_store.getAt(i);
				real_cut_num += record.get('real_cut_num');
                sew_num += record.get('sew_num');
                bach_accept_num += record.get('bach_accept_num');
                bach_delivery_num += record.get('bach_delivery_num');
                f_product_num += record.get('f_product_num');
                b_product_num += record.get('b_product_num');
                receive_f_product += record.get('receive_f_product');
                receive_b_product += record.get('receive_b_product');
                middle_take += record.get('middle_take');
                sew_delivery_num += record.get('sew_delivery_num');
                sendout_f_product += record.get('sendout_f_product');
                sendout_b_product += record.get('sendout_b_product');
                pack_accept_num += record.get('pack_accept_num');
                 
                 
			}
            sumObject.consume = '平均损耗: ' + ((real_cut_num-sendout_f_product)/real_cut_num*100).toFixed(2)+'%';
            sumObject.real_cut_num = filterEmptyNum(real_cut_num);
            sumObject.sew_num = filterEmptyNum(sew_num);
            sumObject.bach_accept_num = filterEmptyNum(bach_accept_num);
            sumObject.bach_delivery_num = filterEmptyNum(bach_delivery_num);
            sumObject.f_product_num = filterEmptyNum(f_product_num);
            sumObject.b_product_num = filterEmptyNum(b_product_num);
            sumObject.receive_f_product = filterEmptyNum(receive_f_product);
            sumObject.receive_b_product = filterEmptyNum(receive_b_product);
            sumObject.middle_take = filterEmptyNum(middle_take);
            sumObject.sew_delivery_num = filterEmptyNum(sew_delivery_num);
            sumObject.sendout_f_product = filterEmptyNum(sendout_f_product);
            sumObject.sendout_b_product = filterEmptyNum(sendout_b_product);
            sumObject.pack_accept_num = filterEmptyNum(pack_accept_num);
            
			summary.setSumValue(sumObject); 
//		}
	}
    
    function filterEmptyNum(value){
        return value ? value : '0';
    }

	// 初始化状态
	summary.toggleSummary(true);

	// 显示查询窗口
	var task2 = function() {
		codeWindow.show();
		// 第一次加载数据
		loadStore4ordStore();
	};

	// 设置highcharts的全局属性
	Highcharts.setOptions({
				lang : {
					resetZoom : '恢复',
					resetZoomTitle : '恢复所有数据的大小'
				}
			});

	/**
	 * 订单总进度图
	 */
	var prodDayChart = {
		chart : {
			type : 'column',
			zoomType : 'x'
		},
		title : {
			text : '订单完成率图'
		},
		xAxis : {
			categories : []
		},
		yAxis : {
			allowDecimals : true,
			min : 0,
			title : {
				text : '订单完成率(%)'
			}
		},
		tooltip : {
			formatter : function() {
				var point = this.point;
				return this.series.name + ':' + point.num + '<br/>' + this.x
						+ ' 完成率:' + this.y + '%';
			}
		},
		plotOptions : {
			column : {
				dataLabels : {
					enabled : true,
					style : {
						fontWeight : 'bold'
					},
					formatter : function() {
						return this.y + '%';
					}
				}
			}
		},
		series : [{
					name : '缝制完成数',
					data : [],
					stack : 'sewNum'
				}, {
					name : '水洗完成数',
					data : [],
					stack : 'swchNum'
				}, {
					name : '交成品完成数',
					data : [],
					stack : 'productNum'
				}],
		exporting : {
			url : 'http://localhost:8080/jdurfid/getHighchartServlet'
		},
		credits : {
			enable : false,
			text : ''
		},
		exporting : {
			enabled : false
		}
	}
	var ordChart = $('#ordScheListChart').highcharts(prodDayChart).highcharts();

	function changeOrdDayChart() {
		try {
			// 销毁原图
			if (!Ext.isEmpty(ordChart)) {
				ordChart.destroy();
			}
			ordChart = $('#ordScheListChart').highcharts(prodDayChart)
					.highcharts();

			ordChart.xAxis[0].setCategories(xAxisData);
			ordChart.series[0].update({
						name : '缝制完成数',
						data : sewPercent,
						stack : 'male1'
					});
			ordChart.series[1].update({
						name : '水洗完成数',
						data : bachPercent,
						stack : 'male2'
					});
			ordChart.series[2].update({
						name : '交成品完成数',
						data : f_product_numPercent,
						stack : 'female1'
					});
			ordChart.redraw();
		} catch (e) {
			console.info(e);
		}
	}

	/**
	 * 查询报表
	 */
	function queryOrder2Excel(orderId) {
		var tempVar = Ext.getCmp('ord_seq_no_excel').getValue();
		if (Ext.isEmpty(tempVar)) {
			tempVar = orderId;
		} else {
			tempVar = tempVar + ',' + orderId;
		}
		Ext.getCmp('ord_seq_no_excel').setValue(tempVar);
	}
	/**
	 * 添加我的订单查询
	 * 
	 * @return
	 */
	function addmyorderQuery() {
		var ischecked = Ext.getCmp('myorder').checked;
		var myorder = ischecked ? "yes" : ""; // 1表示我的订单
		return myorder;
	}

	/**
	 * 判断此流程数量和前流程数量的判断，如果是小于前道流程的话就给style参数增加新的样式 此处样式为黄色显示
	 */
	function addStyle4natureNum(nature, value, record) {
		try {
			if (Ext.isEmpty(nature)) {
				return value;
			}
			var beforeN = natureList[nature];
			if (Ext.isEmpty(beforeN)) {
				return value;
			}

			var n1 = record.get(nature);
			var n2 = record.get(beforeN);

			value = value || '';
			if (n1 > n2) {
				value = '<span style="color:orange">' + value + '</span>'
			}

		} catch (e) {
			console.info(e);
		}
		return value || 0;
	}

	// 设置FOB预警的天数
	function setWarningDate() {
		var warningDate = Ext.getCmp('warningDate').getValue();
		if (Ext.isEmpty(warningDate)) {
			return;
		}
		fobDaynum = warningDate;
		detail_store.reload();
	}
	// 设置裁剪预警天数
	function setSewWarningDate() {
		var sewWarningDate = Ext.getCmp('sewWarningDate').getValue();
		if (Ext.isEmpty(sewWarningDate)) {
			return;
		}
		sewDaynum = sewWarningDate;
		detail_store.reload();
	}

	// 按照指定的订单信息来查询

	function loadStore4ordStore(/** 传入特定参数 */
			params) {
		var prodstatus = ordstateCombo.getValue();
		params = params || {}; // 如果为空 则构建一个空对象
		// 添加一般参数
		params.start = 0;
		params.limit = ordBbar.pageSize;
		params.order_name = getValueNoNullById('order_id');
		params.startdate =Ext.isEmpty(Ext.getCmp('startdate').getValue())?'': Ext.getCmp('startdate').getValue().add(Date.DAY,-1);
		params.enddate =Ext.isEmpty( Ext.getCmp('enddate').getValue())?'':Ext.getCmp('enddate').getValue();
		params.style_no = getValueNoNullById('style_no');
		// 添加是否做完单报告
		var isReportOrder = Ext.getCmp('isReportOrder').checked;
		params.report_order = isReportOrder ? 'yes' : '';
		params.ismyorder = addmyorderQuery();
		params.prodstatus = prodstatus;
		// 添加日期定义参数
		params.dateType = Ext.getCmp("dateTypeCombo").value;
		// 加载数据
		ordStore.load({
					params : params
				});
	}

	/**
	 * 通过id获取值
	 * 
	 * @param {}
	 *            idval 传入的id
	 */
	var getValueNoNullById = function(idval) {
		var value = Ext.getCmp(idval).getValue();
		return value ? value : '';
	}
	// 执行完毕 显示查询窗口
	task2();
});
/**
 * 显示损耗短缺图
 * 
 * @param rowid
 *            选择的行数
 */
function showSrChartWindow(order_id) {
	var height = document.documentElement.clientHeight
			|| document.body.clientHeight;
	var width = document.documentElement.clientWidth
			|| document.body.clientWidth;
	var v = new OrdReportSRChartWindow();
	v.showChartWindow({
				height : height,
				width : width
			});
	v.requestReport({
				order_id : order_id
			});
}
