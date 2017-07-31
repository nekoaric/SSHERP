/**
 * 部门管理
 * 
 * @author XiongChun
 * @since 2010-04-11
 */
Ext.onReady(function() {
	var re = '<span style="color:red">*</span>'
	var tmp_user_cnt = 0; // 该部门下的用户个数
	var tmp_subdept_cnt = 0; // 该部门下子部门个数
    
    var indeptCwaCtrlStore = new Ext.data.SimpleStore( {
                fields : [ 'value', 'text' ],
                data : [ [ '0', '是' ], [ '1', '否' ] /*, ['0', '0 未知']*/]
            });
    var indeptCwaCtrlCombo = new Ext.form.ComboBox( {
        name : 'cwa_ctrl',
        hiddenName : 'cwa_ctrl',
        store : indeptCwaCtrlStore,
        mode : 'local',
        triggerAction : 'all',
        valueField : 'value',
        displayField : 'text',
        value : '1',
        fieldLabel : '独立考勤' + re,
        emptyText : '请选择...',
        allowBlank : false,
        forceSelection : true,
        editable : false,
        typeAhead : true,
        anchor : "99%"
    });
	
	var userCntStore = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
					url : './organization.ered?reqCode=getUserCntInDept'
				}),
		reader : new Ext.data.JsonReader({}, [{	// 定义后台返回数据格式
					name : 'cnt'
				}])
	});
	
	var subDeptCntStore = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
					url : './organization.ered?reqCode=getSubDeptCntInDept'
				}),
		reader : new Ext.data.JsonReader({}, [{	// 定义后台返回数据格式
					name : 'cnt'
				}])
	});
			
	var treedeptid=root_deptid;
    var root = new Ext.tree.AsyncTreeNode({
        text:root_deptname,
        expanded:true,
        iconCls:'folder_userIcon',
        id:root_deptid
    });
    var deptTree = new Ext.tree.TreePanel({
        loader:new Ext.tree.TreeLoader({
            baseAttrs:{},
            dataUrl:'./organization.ered?reqCode=departmentTreeInit'
        }),
        root:root,
        title:'',
        applyTo:'deptTreeDiv',
        autoScroll:false,
        animate:false,
        useArrows:false,
        border:false
    });
    deptTree.root.select();
    deptTree.on('click', function (node) { // 左键单击
        Ext.getCmp('queryParam').setValue('');
        deptid = node.attributes.id;
        treedeptid = node.attributes.id;
        store.load({
            params:{
                start:0,
                limit:bbar.pageSize,
                deptid:deptid
            }
        });

        // 获取单位下用户个数
        userCntStore.load({
            params:{
                deptid:deptid
            }
        });
        // 获取单位下子部门个数
        subDeptCntStore.load({
            params:{
                deptid:deptid
            }
        });
    });

    /*var contextMenu = new Ext.menu.Menu({
        id:'deptTreeContextMenu',
        items:[
            {
                text:'新增部门',
                iconCls:'page_addIcon',
                handler:function () {
                    addInit();
                }
            },
            {
                text:'修改部门',
                iconCls:'page_edit_1Icon',
                handler:function () {
                    editInit();
                }
            },
            {
                text:'删除部门',
                iconCls:'page_delIcon',
                handler:function () {
                    var selectModel = deptTree.getSelectionModel();
                    var selectNode = selectModel.getSelectedNode();
                    deleteDeptItems('2', selectNode.attributes.id);
                }
            },
            {
                text:'刷新节点',
                iconCls:'page_refreshIcon',
                handler:function () {
                    var selectModel = deptTree.getSelectionModel();
                    var selectNode = selectModel.getSelectedNode();
                    if (selectNode.attributes.leaf) {
                        selectNode.parentNode.reload();
                    } else {
                        selectNode.reload();
                    }
                }
            }
        ]
    });
    deptTree.on('contextmenu', function (node, e) { // 右键菜单
        e.preventDefault();
        deptid = node.attributes.id;
        treedeptid = node.attributes.id;
        deptname = node.attributes.text;
        Ext.getCmp('parentdeptname').setValue(deptname);
        Ext.getCmp('parentid').setValue(deptid);
        store.load({
            params:{
                start:0,
                limit:bbar.pageSize,
                deptid:deptid
            },
            callback:function (r, options, success) {
                for (var i = 0; i < r.length; i++) {
                    var record = r[i];
                    var deptid_g = record.data.deptid;
                    if (deptid_g == deptid) {
                        grid.getSelectionModel().selectRow(i);
                    }
                }
            }
        });

        // 获取单位下用户个数
        userCntStore.load({
            params:{
                deptid:deptid
            }
        });
        // 获取单位下子部门个数
        subDeptCntStore.load({
            params:{
                deptid:deptid
            }
        });

        node.select();
        contextMenu.showAt(e.getXY());
    });*/

    var sm = new Ext.grid.CheckboxSelectionModel({singleSelect:true});
    /** 定义列表显示区块 */
    var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), sm, {
        header:'部门编号',
        dataIndex:'deptid',
        width:130,
        sortable:true
    }, {
        header:'部门名称',
        dataIndex:'deptname',
        width:130
    }, /*{
     header : '排序号',
     dataIndex : 'sortno',
     sortable : true,
     width : 50
     },*/ {
        header:'业务对照码',
        dataIndex:'customid',
        hidden:true,
        width:100
    }, {
        header:'上级部门',
        dataIndex:'parentdeptname',
        width:130
    }, {
        header:'独立考勤',
        dataIndex:'cwa_ctrl',
        //hidden : true,
        renderer:function (value) {
            if (value == '1')
                return '否';
            else if (value == '0')
                return '是';
            else
                return value;
        }
    }, {
        id:'remark',
        header:'备注',
        dataIndex:'remark'
    }, {
        header:'节点类型',
        dataIndex:'leaf',
        hidden:true,
        renderer:function (value) {
            if (value == '1')
                return '叶子节点';
            else if (value == '0')
                return '树枝节点';
            else
                return value;
        }
    }, {
        id:'parentid',
        header:'父节点编号',
        hidden:true,
        dataIndex:'parentid'
    }, {
        id:'usercount',
        header:'下属用户数目',
        hidden:true,
        dataIndex:'usercount'
    }, {
        id:'rolecount',
        header:'下属角色数目',
        hidden:true,
        dataIndex:'rolecount'
    }]);

    /**
     * 数据存储
     */
    var store = new Ext.data.Store({
        proxy:new Ext.data.HttpProxy({
            url:'./organization.ered?reqCode=queryDeptsForManage'
        }),
        reader:new Ext.data.JsonReader({
            totalProperty:'TOTALCOUNT',
            root:'ROOT'
        }, [
            {
                name:'deptid'
            },
            {
                name:'deptname'
            },
            /* {
             name : 'sortno'
             }, {
             name : 'customid'
             },*/ {
                name:'parentdeptname'
            },
            {
                name:'cwa_ctrl'
            },
            {
                name:'leaf'
            },
            {
                name:'remark'
            },
            {
                name:'parentid'
            },
            {
                name:'usercount'
            },
            {
                name:'rolecount'
            },
            {
                name:'customid'
            }
        ])
    });

    // 翻页排序时带上查询条件
    store.on('beforeload', function () {
        this.baseParams = {
            queryParam:Ext.getCmp('queryParam').getValue(),
            deptid:treedeptid
        };
    });

    var pagesize_combo = new Ext.form.ComboBox({
        name:'pagesize',
        hiddenName:'pagesize',
        typeAhead:true,
        triggerAction:'all',
        lazyRender:true,
        mode:'local',
        store:new Ext.data.ArrayStore({
            fields:['value', 'text'],
            data:[
                [10, '10条/页'],
                [20, '20条/页'],
                [50, '50条/页'],
                [100, '100条/页'],
                [250, '250条/页'],
                [500, '500条/页']
            ]
        }),
        valueField:'value',
        displayField:'text',
        value:'20',
        editable:false,
        width:85
    });
    var number = parseInt(pagesize_combo.getValue());
    pagesize_combo.on("select", function (comboBox) {
        bbar.pageSize = parseInt(comboBox.getValue());
        number = parseInt(comboBox.getValue());
        store.reload({
            params:{
                start:0,
                limit:bbar.pageSize,
                deptid:treedeptid
            }
        });
    });

    var bbar = new Ext.PagingToolbar({
        pageSize:number,
        store:store,
        displayInfo:true,
        displayMsg:'显示{0}条到{1}条,共{2}条',
        emptyMsg:"没有符合条件的记录",
        plugins:new Ext.ux.ProgressBarPager(), // 分页进度条
        items:['-', '&nbsp;&nbsp;', pagesize_combo]
    });
    var grid = new Ext.grid.GridPanel({
        title:'<img src="./resource/image/ext/building.png" align="top" class="IEPNG"><span style="font-weight:normal">部门信息表</span>',
        renderTo:'deptGridDiv',
        height:500,
        // width:600,
        autoScroll:true,
        region:'center',
        store:store,
        loadMask:{
            msg:'正在加载表格数据,请稍等...'
        },
        stripeRows:true,
        frame:true,
        autoExpandColumn:'remark',
        cm:cm,
        sm:sm,
        tbar:[
            {
                text:'新增',
                id:'new_button',
                iconCls:'page_addIcon',
                handler:function () {
                    addInit();
                }
            },
            '-',
            {
                text:'修改',
                id:'modify_button',
                iconCls:'page_edit_1Icon',
                handler:function () {
                    editInit();
                }
            },
            '-',
            {
                text:'删除',
                id:'delete_button',
                iconCls:'page_delIcon',
                handler:function () {
                    deleteDeptItems('1', '');
                }
            },
            '-',
            {
                text:'刷新',
                iconCls:'page_refreshIcon',
                handler:function () {
                    queryDeptItem();
                }
            },
            '->',
            new Ext.form.TextField({
                id:'queryParam',
                name:'queryParam',
                emptyText:'请输入部门名称',
                enableKeyEvents:true,
                listeners:{
                    specialkey:function (field, e) {
                        if (e.getKey() == Ext.EventObject.ENTER) {
                            queryDeptItem();
                        }
                    }
                },
                width:130
            }),
            {
                text:'查询',
                iconCls:'page_findIcon',
                handler:function () {
                    queryDeptItem();
                }
            }
        ],
        bbar:bbar
    });

    store.load({
        params:{
            start:0,
            limit:bbar.pageSize,
            firstload:'true',
            deptid:treedeptid
        }
    });

    // grid单击事件
    grid.addListener('rowclick', rowclickFn);
    function rowclickFn(grid, rowindex, e) {
        grid.getSelectionModel().each(function (rec) {
            // alert(rowindex);
            //alert(rec.get("deptid")); // fieldName，记录中的字段名
            // 获取单位下用户个数
            userCntStore.load({
                params:{
                    deptid:rec.get('deptid')
                }
            });
            // 获取单位下子部门个数
            subDeptCntStore.load({
                params:{
                    deptid:rec.get('deptid')
                }
            });
        });
    }

    ;
    grid.on('rowdblclick', function (grid, rowIndex, event) {
        editInit();
    });
    grid.on('sortchange', function () {
        grid.getSelectionModel().selectFirstRow();
    });

    bbar.on("change", function () {
        grid.getSelectionModel().selectFirstRow();
    });

    var addRoot = new Ext.tree.AsyncTreeNode({
        text:root_deptname,
        expanded:true,
        id:root_deptid
    });
    var addDeptTree = new Ext.tree.TreePanel({
        loader:new Ext.tree.TreeLoader({
            baseAttrs:{},
            dataUrl:'./organization.ered?reqCode=departmentTreeInit'
        }),
        root:addRoot,
        autoScroll:true,
        animate:false,
        useArrows:false,
        border:false
    });
    // 监听下拉树的节点单击事件
    addDeptTree.on('click', function (node) {
        if ((node.attributes.id + "").length >= 28) {
            comboxWithTree.collapse(); // 收起下拉选项界面
            Ext.MessageBox.alert('提示', '当前部门下不允许新增部门');
            return;
        }
        comboxWithTree.setValue(node.text);
        Ext.getCmp("addDeptFormPanel").findById('parentid').setValue(node.attributes.id);
        comboxWithTree.collapse();
    });
    var comboxWithTree = new Ext.form.ComboBox({
        id:'parentdeptname',
        store:new Ext.data.SimpleStore({
            fields:[],
            data:[
                []
            ]
        }),
        editable:false,
        value:' ',
        emptyText:'请选择...',
        fieldLabel:'上级部门' + re,
        anchor:'99%',
        mode:'local',
        triggerAction:'all',
        maxHeight:390,
        // 下拉框的显示模板,addDeptTreeDiv作为显示下拉树的容器
        tpl:"<tpl for='.'><div style='height:390px'><div id='addDeptTreeDiv'></div></div></tpl>",
        allowBlank:false,
        onSelect:Ext.emptyFn
    });
    // 监听下拉框的下拉展开事件
    comboxWithTree.on('expand', function () {
        // 将UI树挂到treeDiv容器
        addDeptTree.render('addDeptTreeDiv');
        // addDeptTree.root.expand(); //只是第一次下拉会加载数据
        addDeptTree.root.reload(); // 每次下拉都会加载数据

    });

    /** 添加信息 */
    var addDeptFormPanel = new Ext.form.FormPanel({
        id:'addDeptFormPanel',
        name:'addDeptFormPanel',
        defaultType:'textfield',
        labelAlign:'right',
        labelWidth:70,
        frame:true,
        items:[
            {
                fieldLabel:'部门名称' + re,
                name:'deptname',
                id:'deptname',
                allowBlank:false,
                anchor:'99%'
            },
            comboxWithTree,
            /*{
             fieldLabel : '业务对照码',
             name : 'customid',
             allowBlank : true,
             anchor : '99%'
             }, {
             fieldLabel : '排序号',
             name : 'sortno',
             allowBlank : true,
             anchor : '99%'
             },*/indeptCwaCtrlCombo,
            {
                fieldLabel:'备注',
                name:'remark',
                id:'remark',
                allowBlank:true,
                anchor:'99%'
            },
            {
                id:'parentid',
                name:'parentid',
                hidden:true
            },
            {
                id:'windowmode',
                name:'windowmode',
                hidden:true
            },
            {
                id:'deptid',
                name:'deptid',
                hidden:true
            },
            {
                id:'parentid_old',
                name:'parentid_old',
                hidden:true
            }
        ]
    });
    var addDeptWindow = new Ext.Window({
        layout:'fit',
        width:400, // 添加子窗口 高度
        height:180, // 添加 窗口宽度
        resizable:false,
        draggable:true,
        closeAction:'hide',
        title:'新增部门',
        iconCls:'page_addIcon',
        modal:false,
        collapsible:true,
        titleCollapse:true,
        maximizable:false,
        buttonAlign:'right',
        border:false,
        animCollapse:true,
        pageY:20,
        pageX:document.body.clientWidth / 2 - 420 / 2,
        animateTarget:Ext.getBody(),
        constrain:true,
        items:[addDeptFormPanel],
        buttons:[
            {
                text:'保存',
                iconCls:'acceptIcon',
                id:'btn_id_save_update',
                handler:function () {
                    if (runMode == '0') {
                        Ext.Msg.alert('提示', '系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
                        return;
                    }
                    var mode = Ext.getCmp('windowmode').getValue();
                    if (mode == 'add')
                        saveDeptItem();
                    if (mode == 'edit')
                        updateDeptItem();
                }
            },
            {
                text:'重置',
                id:'btnReset',
                iconCls:'tbar_synchronizeIcon',
                handler:function () {
                    //clearForm(addDeptFormPanel.getForm());
                    Ext.getCmp("deptname").setValue("");
                    Ext.getCmp("remark").setValue("");
                }
            },
            {
                text:'关闭',
                iconCls:'deleteIcon',
                handler:function () {
                    addDeptWindow.hide();
                }
            }
        ]
    });
    /**
     * 布局
     */
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[
            {
                title:'<span style="font-weight:normal">组织机构</span>',
                iconCls:'chart_organisationIcon',
                tools:[
                    {
                        id:'refresh',
                        handler:function () {
                            deptTree.root.reload()
                        }
                    }
                ],
                collapsible:true,
                width:210,
                minSize:160,
                maxSize:280,
                split:true,
                region:'west',
                autoScroll:true,
                // collapseMode:'mini',
                items:[deptTree]
            },
            {
                region:'center',
                layout:'fit',
                items:[grid]
            }
        ]
    });

    /**
     * 根据条件查询部门
     */
    function queryDeptItem() {
        store.load({
            params:{
                start:0,
                limit:bbar.pageSize,
                queryParam:Ext.getCmp('queryParam').getValue(),
                deptid:treedeptid
            }
        });
    }

    /**
     * 新增部门初始化
     */
    function addInit() {
        // clearForm(addDeptFormPanel.getForm());
        var flag = Ext.getCmp('windowmode').getValue();
        if (typeof(flag) != 'undefined') {
            addDeptFormPanel.form.getEl().dom.reset();
        } else {
            clearForm(addDeptFormPanel.getForm());
        }
        var selectModel = deptTree.getSelectionModel();
        var selectNode = selectModel.getSelectedNode();

        if ((selectNode.attributes.id + "").length >= 28) {// 第四级部门
            Ext.MessageBox.alert('提示', '当前部门下不允许新增部门');
            return;
        }
        Ext.getCmp('parentdeptname').setValue(selectNode.attributes.text);
        Ext.getCmp('parentid').setValue(selectNode.attributes.id);
        addDeptWindow.show();
        indeptCwaCtrlCombo.setValue("1");
        addDeptWindow.setTitle('新增部门<span style="color:Red">(*为必填项)</span>');
        Ext.getCmp('windowmode').setValue('add');
        comboxWithTree.setDisabled(false);
        Ext.getCmp('btnReset').show();
    }

    /**
     * 保存部门数据
     */
    function saveDeptItem() {
        if (!addDeptFormPanel.form.isValid()) {
            return;
        }
        addDeptFormPanel.form.submit({
            url:'./organization.ered?reqCode=saveDeptItem',
            waitTitle:'提示',
            method:'POST',
            waitMsg:'正在处理数据,请稍候...',
            success:function (form, action) {
                addDeptWindow.hide();
                store.reload();
                refreshNode(Ext.getCmp('parentid').getValue());
                form.reset();
                Ext.MessageBox.alert('提示', action.result.msg);
            },
            failure:function (form, action) {
                var msg = action.result.msg;
                Ext.MessageBox.alert('提示', '部门数据保存失败:<br>' + msg);
            }
        });
    }

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

    /**
     * 修改部门初始化
     */
    function editInit() {
        var record = grid.getSelectionModel().getSelected();
        if (record.get('customid') == 'xtgl' && root_usertype != '9' && root_usertype != '8') {
            Ext.MessageBox.alert('提示', '系统内置部门,无权更改!');
            return;
        }
        if (Ext.isEmpty(record)) {
            grid.getSelectionModel().selectFirstRow();
        }
        record = grid.getSelectionModel().getSelected();
        if (record.get('leaf') == '0' || record.get('usercount') != '0' || record.get('rolecount') != '0') {
            comboxWithTree.setDisabled(true);
        } else {
            comboxWithTree.setDisabled(false);
        }
        if (record.get('deptid') == '001') {
            var a = Ext.getCmp('parentdeptname');
            a.emptyText = '已经是顶级部门';
        } else {
        }
        addDeptFormPanel.getForm().loadRecord(record);
        addDeptWindow.show();
        addDeptWindow.setTitle('修改部门<span style="color:Red">(*为必填项)</span>');
        Ext.getCmp('windowmode').setValue('edit');
        Ext.getCmp('parentid_old').setValue(record.get('parentid'));
        Ext.getCmp('btnReset').hide();
    }

    /**
     * 修改部门数据
     */
    function updateDeptItem() {
        if (!addDeptFormPanel.form.isValid()) {
            return;
        }
        update();
    }

    /**
     * 更新
     */
    function update() {
        var parentid = Ext.getCmp('parentid').getValue();
        var parentid_old = Ext.getCmp('parentid_old').getValue();
        var deptid = Ext.getCmp('deptid').getValue();
        if (parentid == deptid) {
            Ext.MessageBox.alert('提示', "上级部门不能为部门本身");
            return;
        }
        addDeptFormPanel.form.submit({
            url:'./organization.ered?reqCode=updateDeptItem',
            waitTitle:'提示',
            method:'POST',
            waitMsg:'正在处理数据,请稍候...',
            success:function (form, action) {
                addDeptWindow.hide();
                store.reload();
                refreshNode(parentid);
                if (parentid != parentid_old) {
                    refreshNode(parentid_old);
                }
                form.reset();
                Ext.MessageBox.alert('提示', action.result.msg);
            },
            failure:function (form, action) {
                var msg = action.result.msg;
                Ext.MessageBox.alert('提示', '部门数据修改失败:<br>' + msg);
            }
        });
    }

    /**
     * 删除部门
     */
    function deleteDeptItems(pType, pDeptid) {
        var record = grid.getSelectionModel().getSelected();

        if (record.get('customid') == 'xtgl' && root_usertype != '9' && root_usertype != '8') {
            Ext.MessageBox.alert('提示', '系统内置部门,无权删除!');
            return;
        }
        if (record.get('parentid') == '001') {// 操作部门为单位根部门，不允许删除
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

        var rows = grid.getSelectionModel().getSelections();

        var fields = '';
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].get('deptid') == '001') {
                fields = fields + rows[i].get('deptname') + '<br>';
            }
        }
        if (fields != '') {
            Ext.Msg.alert('提示', '<b>您选中的项目中包含如下系统内置的只读项目</b><br>' + fields + '<font color=red>只读项目不能删除!</font>');
            return;
        }
        if (Ext.isEmpty(rows)) {
            if (pType == '1') {
                Ext.Msg.alert('提示', '请先选中要删除的项目!');
                return;
            }
        }
        var strChecked = jsArray2JsString(rows, 'deptid');
        Ext.Msg.confirm('请确认', '<span style="color:red"><b>提示:</b>您确定删除该部门信息吗?', function (btn, text) {
            if (btn == 'yes') {
                if (runMode == '0') {
                    Ext.Msg.alert('提示', '系统正处于演示模式下运行,您的操作被取消!该模式下只能进行查询操作!');
                    return;
                }
                showWaitMsg();
                Ext.Ajax.request({
                    url:'./organization.ered?reqCode=deleteDeptItems',
                    success:function (response) {
                        var resultArray = Ext.util.JSON.decode(response.responseText);
                        store.reload();
                        if (pType == '1') {
                            deptTree.root.reload();
                        } else {
                            deptTree.root.reload();
                        }
                        Ext.Msg.alert('提示', resultArray.msg);
                    },
                    failure:function (response) {
                        var resultArray = Ext.util.JSON.decode(response.responseText);
                        Ext.Msg.alert('提示', resultArray.msg);
                    },
                    params:{
                        strChecked:strChecked,
                        type:pType,
                        deptid:pDeptid
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
});