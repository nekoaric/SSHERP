/**
 * 创建时间：2013.11.20
 * 创建作者：zhouww
 * 功能：问题解决提示
 * 最后修改时间：
 * 最后修改功能：
 */
 Ext.onReady(function(){
	 
	 var mode;//操作类型
    var sm = new Ext.grid.CheckboxSelectionModel({
        singleSelect:true
     })
    var qaColumnModel = new Ext.grid.ColumnModel([sm,new Ext.grid.RowNumberer(),
                                                  {
        header:'最后 修改时间',
        dataIndex:'last_date',
        width:148
    },{
        header:'最后修改人员',
        dataIndex:'last_opr_name',
        width:100
    },{
        header:'问题',
        dataIndex:'question',
        width:300
    },{
        header:'解决方法',
        dataIndex:'answer',
        width:600
    },{
        header:'编号',
        dataIndex:'seq_no',
        hidden:true
    },{
        header:'日期',
        dataIndex:'last_date',
        hidden:true
    }])
    var qaStore = new Ext.data.Store({
        proxy:new Ext.data.HttpProxy({
            url:'./qaInfo.ered?reqCode=queryQAInfo'
        }),
        reader:new Ext.data.JsonReader({
            totalProperty:'TOTALCOUNT',
            root:"ROOT"
        },['last_date','seq_no','question','answer','last_opr_name'])
    })
    qaStore.on("beforeload",function(){
        this.baseParams={
        		queryParam: Ext.getCmp('queryParam').getValue()
        };
    });
    
//	// 翻页排序时带上查询条件
//    qaStore.on('beforeload', function () {
//		this.baseParams = {
//			queryParam: Ext.getCmp('queryParam').getValue()
//		};
//	});
    var qaComboBox = new Ext.form.ComboBox({
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
                [30, '30条/页'],
                [40, '40条/页'],
                [50, '50条/页']
            ]
        }),
        valueField: 'value',
        displayField: 'text',
        value: '20',
        editable: false,
        width: 85
    });
    qaComboBox.on("select", function(comboBox) {
                qa_bbar.pageSize = parseInt(comboBox.getValue());
                number = parseInt(comboBox.getValue());
                qaStore.reload({
                            params : {
                                start : 0,
                                limit : qa_bbar.pageSize
                            }
                        });
     });
    var qa_bbar = new Ext.PagingToolbar({
        pageSize: qaComboBox.getValue(),
        store: qaStore,
        displayInfo: true,
        displayMsg: '显示{0}条到{1}条,共{2}条',
        plugins: new Ext.ux.ProgressBarPager(), // 分页进度条
        emptyMsg: "没有符合条件的记录",
        items: ['-', '&nbsp;&nbsp;', qaComboBox]
    })
    
    
    
    //Q&A form
    var qaForm = new Ext.form.FormPanel({
        labelAlign:'right',
        height:150,
        padding:'5,5,5,5',
        defaults:{
            bodyStyle:'padding-top:5'        
        },
        items:[{
            xtype:'textfield',
            fieldLabel:'问题',
            id:'question',
            name:'question',
            width:400,
            allowBlank:false
        },{
            xtype:'textarea',
            fieldLabel:'解决方法',
            id:'answer',
            name:'answer',
            width:400,
            height:100,
            allowBlank:false
        },
        {
            xtype:'textarea',
            fieldLabel:'',
            id:'seq_no',
            name:'seq_no',
            width:400,
            height:10,
            allowBlank:true,
            hidden:true
        }]
    })
    
    //Q&A Window
    var qaWindow = new Ext.Window({
            id:'qaWindow',
            layout:"fit",
            title:'问题信息',
            width:600,
            height:200,
            resizable : false,
	        draggable : true,
	        closeAction : 'hide',
	        modal : true,
	        collapsible : true,
	        titleCollapse : true,
	        maximizable : false,
	        buttonAlign : 'right',
	        border : false,
	        animCollapse : true,
	        animateTarget : Ext.getBody(),
            defaults:{
                bodyStyle:'padding-top:5'
            },
	        constrain : true,
            padding:'5,5,5,5',
            items:[qaForm],
            bbar:['->',{
                id:'saveButton_qa',
                xtype:'button',
                text:'保存',
                handler: function () {
					if (mode == 'add')
						saveRoleItem();
					if (mode == 'edit')
						updateRoleItem();
                }
            },{
                id:'consoleButton_qa',
                xtype:'button',
                text:'取消',
                handler:function(){ 
                    Ext.getCmp('question').setValue("");
                    Ext.getCmp('answer').setValue("");
                    Ext.getCmp('qaWindow').hide();
                }
            },{
                id:'colseButton_qa',
                xtype:'button',
                text:'关闭',
                handler:function(){
                    Ext.getCmp('question').setValue("");
                    Ext.getCmp('answer').setValue("");
                    Ext.getCmp('qaWindow').hide();
                    
                }
            }]
    })
    
	/**
	 * 增加问题
	 */
    
	function   saveRoleItem(){
    	
    	
        var qaQuestion = Ext.getCmp('question').getValue();
        var qaAnswer = Ext.getCmp('answer').getValue();
        if(Ext.isEmpty(qaQuestion)){
            Ext.Msg.alert("提示信息","问题不能为空");
            return;
        }
        if(Ext.isEmpty(qaAnswer)){
            Ext.Msg.alert("提示信息","解决方法不能为空");
            return;
        }
        Ext.Ajax.request({
            url:'./qaInfo.ered?reqCode=addQAInfo',
            success:function(value){
                var result = Ext.util.JSON.decode(value.responseText);
                if(result.success){
                    Ext.Msg.alert("提示信息","保存成功");
                    Ext.getCmp('qaWindow').hide();
                    qaStore.reload();
                    qaform.reset();
                }else {
                    Ext.Msg.alert("提示信息","保存失败");
                }
            },
            failure:function(){
                Ext.Msg.alert("提示信息","保存失败");
            },
            params:{
                question:qaQuestion,
                answer:qaAnswer
            }
        })
    }
    
    
    
    
    
	/**
	 * 修改问题初始化
	 */
	function editInit() {
		mode = 'edit';

		var record = qaGrid.getSelectionModel().getSelected();
		if (Ext.isEmpty(record)) {
			Ext.MessageBox.show({
				title: '警告',
				msg: "请先选择一条记录..",
				buttons: Ext.MessageBox.OK,
				icon: Ext.MessageBox.WARNING
			});
			return;
		}

		qaForm.getForm().loadRecord(record);
		qaWindow.show();
		qaWindow.setTitle('修改问题<span style="color:Red">(*为必填项)</span>');

		//初始化
		Ext.getCmp('question').setValue(record.get('question'));
		Ext.getCmp('answer').setValue(record.get('answer'));
//		Ext.getCmp('qaWindow').hide();
	}

	/**
	 * 修改问题数据
	 */
	function updateRoleItem() {
		var qaseq_no = Ext.getCmp('seq_no').getValue();
        var qaQuestion = Ext.getCmp('question').getValue();
        var qaAnswer = Ext.getCmp('answer').getValue();
		if (!qaForm.form.isValid()) {
			return;
		}
		qaForm.getForm().submit({
			url:'./qaInfo.ered?reqCode=changeQAInfo',
			waitTitle: '提示',
			method: 'POST',
			waitMsg: '正在处理数据,请稍候...',
			success: function (form, action) {
				
				qaStore.reload();
				
				qaWindow.hide();
				form.reset();
				Ext.MessageBox.alert('提示', action.result.msg);

				
			},
			failure: function (form, action) {
				var msg = action.result.msg;
				Ext.MessageBox.alert('提示', '数据修改失败:<br>' + msg);
			},
			params: {
                question:qaQuestion,
                answer:qaAnswer,
                seq_no:qaseq_no
			}
		});
	}
	/**
	 * 删除问题
	 */
	function deleteQaInfo() {
		var record = qaGrid.getSelectionModel().getSelected();
		if (Ext.isEmpty(record)) {
			Ext.Msg.alert('提示', '请先选中要删除的问题!');
			return;
		}

		Ext.Msg.confirm('请确认',
			'<span style="color:red"><b>提示:</b>删除选中的问题,请慎重.</span><br>继续删除吗?',
			function (btn, text) {
				if (btn == 'yes') {
					showWaitMsg('正在删除!请等待');
					Ext.Ajax.request({
						url: './qaInfo.ered?reqCode=deleteQAInfo',
						success: function (response) {
							var resultArray = Ext.util.JSON.decode(response.responseText);
							qaStore.reload();
							Ext.Msg.alert('提示', resultArray.msg);
						},
						failure: function (response) {
							var resultArray = Ext.util.JSON.decode(response.responseText);
							Ext.Msg.alert('提示', resultArray.msg);
						},
						params: {
							seq_no: record.get('seq_no')
						}
					});
				}
			}
		);
	}
	
	/**
	 * 
	 * by问题查询
	 * 
	 */
	function queryByAnswer() {
		qaStore.load({
			params: {
				start: 0,
				limit: qa_bbar.pageSize,
				queryParam: Ext.getCmp('queryParam').getValue()
				
			}
		});
	}
    
    var qaGrid = new Ext.grid.GridPanel({
        title:'问题解决方案',
        region:'center',
        store:qaStore,
        stripeRows: true,
        allowScore:true,
        frame: true,
        cm:qaColumnModel,
        sm:sm,
        bbar:qa_bbar,
        tbar:[{
            xtype:'button',
            text:'增加',
            handler:function(){
            	mode = 'add';
                qaWindow.show();
            }
        },'-',{
            xtype:'button',
            text:'修改',
            handler:function(){
            	editInit();
            }
        },'-',{
            xtype:'button',
            text:'删除',
            handler:function(){
            	deleteQaInfo();
            }
        },'->',
		new Ext.form.TextField({
			id: 'queryParam',
			name: 'queryParam',
			emptyText: '请输入问题名称',
			enableKeyEvents: true,
			listeners: {
				specialkey: function (field, e) {
					if (e.getKey() == Ext.EventObject.ENTER) {
						queryByAnswer();
					}
				}
			},
			width: 130
		}),
		{
			text: '查询',
			iconCls: 'page_findIcon',
			handler: function () {
				queryByAnswer();
			}
		}
    
        ]  
    })
    
    var viewPort = new Ext.Viewport({
        layout:'border',
        items:[qaGrid]
    
    })
    qaStore.load();
 })
