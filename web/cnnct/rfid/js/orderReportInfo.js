/************************************************
 * 创建日期: 2014-08-26
 * 创建作者：zhouww
 * 功能: 完单报告管理
 * 最后修改时间：
 * 修改记录：
 * 完单报告管理使用MVC模式，
 * mode也作为后台数据的客户端代理
 * Control：获取界面请求，转发请求给mode
 * VIEW ： 完单报告的请求
 *************************************************/

Ext.onReady(function () {
    /**
     * 数据存储
     */
    var ordReportStore = new Ext.data.Store({
        proxy : new Ext.data.HttpProxy({
               url:'./orderReport.ered?reqCode=queryOrderReport4List'
        }),
        reader: new Ext.data.JsonReader({
            totalProperty : 'TOTALCOUNT', // 记录总数
            root : 'ROOT' // Json中的列表数据根节点
        }, ['ord_report_no','fac_name','style_no',
        'order_no','cust_name','ord_num','ins_num',
        'product_num','sr_num','opr_id','opr_time','order_id','open_name','open_time'])
     }) 
     ordReportStore.on('load',function(store){
       store.sort('ord_report_no','desc');
     })
    /**
     * 下拉框 
     */
    var ordReportCombo = new Ext.form.ComboBox({
        id:'ordReportCombo',
        name : 'pagesize',
        triggerAction : 'all',
        mode : 'local',
        store : new Ext.data.ArrayStore({
                    fields : ['value', 'text'],
                    data : [[10, '10条/页'], [20, '20条/页'],
                            [50, '50条/页'], [100, '100条/页'],
                            [250, '250条/页'], [500, '500条/页']]
                }),
        valueField : 'value',
        displayField : 'text',
        value : '50',
        editable : false,
        width : 85
     })
     /**
      * 分页下拉框改变事件，立即加载新数据
      */
     ordReportCombo.on('select',function(combo,record){
        var pageSize = ordReportCombo.getValue();
        bbar.pageSize = pageSize;
        queryOrderResportList();
     })
     
     /**
      * 底部工具条
      */
     var bbar = new Ext.PagingToolbar({
                pageSize : 50,
                store : ordReportStore,
                displayInfo : true,
                displayMsg : '显示{0}条到{1}条,共{2}条',
                emptyMsg : "没有符合条件的记录",
                items : ['-', '&nbsp;&nbsp;', ordReportCombo]
    });
    /**
     * 顶部工具条
     */
    var tbar = new Ext.Toolbar({
        items:[{
            text:'新增',
            id:'add_button',
            iconCls:'page_addIcon',
            handler:function(){
                report_control.addReport();
            }
        },'-',{
            text:'修改/详细信息',
            id:'edit_button',
            iconCls:'page_edit_1Icon',
            handler : function(){
                var record =  ordReportPanel.getSelectionModel().getSelected();
                if(Ext.isEmpty(record)){
                    Ext.Msg.alert('提示','请选择一条数据');
                    return;
                }
                report_control.editReport(record);
            }
        },'-'
        ,{
            text : '删除',
            id : 'del_button',
            iconCls : 'page_delIcon',
            handler : function(){
                var record =  ordReportPanel.getSelectionModel().getSelected();
                if(Ext.isEmpty(record)){
                    Ext.Msg.alert('提示','请选择一条数据');
                    return;
                }
                var ord_report_no = record.get('ord_report_no');
                deleteReport(ord_report_no);
            }
        }
        ,'->',{
            text : '查询订单(完单报告)',
            id : 'queryReportOrder_button',
            iconCls : 'page_findIcon',
            handler : function(){
                queryReportOrder4detailWin();
            }
            
        },'-',{
            text:'刷新',
            id:'refresh_button',
            iconCls:'page_findIcon',
            handler : function(){
                queryOrderResportList({});  // 作为重新查询
            }
        }]
    })
    
    /**
     * 单选
     */
    var sm = new Ext.grid.CheckboxSelectionModel({
        singleSelect:true   
    })
    /**
     * 列头显示
     */
    var cm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),sm,
               {header : '完单报告号',
                dataIndex : 'ord_report_no',
                align : 'center',
                width : 140
            },{
                header : 'PO号',
                dataIndex : 'order_id',
                align : 'center',
                width : 140,
                renderer : function(text){
                    return subString4length(text,50);
                }
            },{
                header : '款号',
                dataIndex : 'style_no',
                align : 'center',
                width : 140,
                renderer : function(text){
                    return subString4length(text,50);
                }
            },{
                header : '客户',
                dataIndex : 'cust_name',
                align : 'center',
                width : 140,
                renderer : function(text){
                    return subString4length(text,50);
                }
            },{
                header : '工厂编号',
                dataIndex : 'fac_name',
                align : 'center',
                width : 140,
                renderer : function(text){
                    return subString4length(text,14);
                }
            },{
                header : '订单数',
                dataIndex : 'ord_num',
                align : 'center',
                width : 140
            },{
                header : '指令数',
                dataIndex : 'ins_num',
                align : 'center',
                width : 140
            },{
                header : '出货数',
                dataIndex : 'product_num',
                align : 'center',
                width : 140
            },{
                header : '损耗率%',
                dataIndex : 'sr_num',
                align : 'center',
                width : 140
            },{
                header : '创建人',
                dataIndex : 'open_name',
                align : 'center',
                width : 140
            },{
                header : '创建时间',
                dataIndex : 'open_time',
                align : 'center',
                width : 140
            }])
    /**
     * 界面面板
     */
    var ordReportPanel = new Ext.grid.GridPanel({
        id:'ordReportPanel',
        title:'',
        width:'590',
        store:ordReportStore,
        region:'center',
        loadMask:{
            msg:'正在加载表格数据,请稍等......'
        },
        stripeRows : true,
        cm:cm,
        sm:sm,
        tbar:tbar,
        bbar:bbar
    })
    //~~ 界面事件开始 
    /**
     * 当mode数据发生变化时的监听
     * changeData参数是变化的数据
     */
    function changeData4viewListener(changeData){
        var record = new Ext.data.Record(changeData);
        //各个form加载自己所涉及到的数据
        headForm.getForm().loadRecord(record);
        reportBottomPanel.getForm().loadRecord(record);
        reportNumPanel.getForm().loadRecord(record);
    }
    /**
     * 确认人改变后的监听
     */
    function changeSureOpr4viewListener(suretype,sureFlag){
        var hideid = '';
        var showid = '';
        var editRemarkid = '';
        switch(suretype){
                case 'sewSure': 
                    if(sureFlag){
                        hideid = 'sewSure_yes';
                        showid = 'sewSure_no';
                    }else {
                        hideid = 'sewSure_no';
                        showid = 'sewSure_yes';
                    }
                    editRemarkid = 'sewfac_remark_write';
                    break;
                case 'washSure': 
                    if(sureFlag){
                        hideid = 'washSure_yes';
                        showid = 'washSure_no';
                    }else {
                        hideid = 'washSure_no';
                        showid = 'washSure_yes';
                    }
                    editRemarkid = 'washfac_remark_write';
                    break;
                case 'packageSure':
                    if(sureFlag){
                        hideid = 'packageSure_yes';
                        showid = 'packageSure_no';
                    }else {
                        hideid = 'packageSure_no';
                        showid = 'packageSure_yes';
                    }
                    editRemarkid = 'package_remark_write';
                    break;
                case 'qcSure':
                    if(sureFlag){
                        hideid = 'qcSure_yes';
                        showid = 'qcSure_no';
                    }else {
                        hideid = 'qcSure_no';
                        showid = 'qcSure_yes';
                    }
                    editRemarkid = 'qcdept_remark_write';
                    break;
                case 'mgSure':
                    if(sureFlag){
                        hideid = 'mgSure_yes';
                        showid = 'mgSure_no';
                    }else {
                        hideid = 'mgSure_no';
                        showid = 'mgSure_yes';
                    }
                    editRemarkid = 'mg_remark_write';
                    break;
                case 'mySure':
                    if(sureFlag){
                        hideid = 'mySure_yes';
                        showid = 'mySure_no';
                    }else {
                        hideid = 'mySure_no';
                        showid = 'mySure_yes';
                    }
                    editRemarkid = 'my_remark_write';
                    break;
                case 'ckSure':
                    if(sureFlag){
                        hideid = 'ckSure_yes';
                        showid = 'ckSure_no';
                    }else {
                        hideid = 'ckSure_no';
                        showid = 'ckSure_yes';
                    }
                    editRemarkid = 'ck_remark_write';
                    break;
                case 'jsSure':
                    if(sureFlag){
                        hideid = 'jsSure_yes';
                        showid = 'jsSure_no';
                    }else {
                        hideid = 'jsSure_no';
                        showid = 'jsSure_yes';
                    }
                    editRemarkid = 'js_remark_write';
                    break;
            }
        Ext.getCmp(hideid).hide();
        Ext.getCmp(showid).show();
        if(sureFlag){   //依据操作处理编辑框
            Ext.getCmp(editRemarkid).show();
        }else {
            Ext.getCmp(editRemarkid).setValue('');
            Ext.getCmp(editRemarkid).hide();
        }
    }
    /**
     * 初始化界面的显示，清空所有的数据
     */
    function initOrderReportView(){
        // 清空显示数据
        clearFormPanel4empty(headForm);
        clearFormPanel4empty(reportBottomPanel);
        clearFormPanel4empty(reportNumPanel);
        // 设置默认数据
        var defaultField = {
            other1_name : '其他1',
            other2_name : '其他2',
            other3_name : '其他3',
            other4_name : '其他4',
            other5_name : '其他5',
            other6_name : '其他6',
            other7_name : '其他7'
        }
        var defaultRecord = new Ext.data.Record(defaultField);
        reportNumPanel.getForm().loadRecord(defaultRecord);
        // 按钮设置为‘确认’，编辑框设置为隐藏
        var showButton = ['sewSure_yes','washSure_yes','packageSure_yes','qcSure_yes','mgSure_yes',
            'mySure_yes','ckSure_yes','jsSure_yes'];
        var hideButton = ['sewSure_no','washSure_no','packageSure_no','qcSure_no','mgSure_no',
            'mySure_no','ckSure_no','jsSure_no'];
        var hideRemark = ['sewfac_remark_write','washfac_remark_write','package_remark_write',
            'qcdept_remark_write','mg_remark_write','my_remark_write','ck_remark_write','js_remark_write'];
        
        // 显示按钮
        var showButtonLength = showButton.length;
        for(var idx=0;idx<showButtonLength;idx++){
            Ext.getCmp(showButton[idx]).show();
        }
        //隐藏按钮
        var hideButtonLength = hideButton.length;
        for(var idx=0;idx<hideButtonLength;idx++){
            Ext.getCmp(hideButton[idx]).hide();
        }
        //隐藏备注
        var hideRemarkLength = hideRemark.length;
        for(var idx=0;idx<hideRemarkLength;idx++){
            Ext.getCmp(hideRemark[idx]).hide();
        }
    }
    /**
     *  界面处理成功保存操作
     */
    function  action4successSave(){
        reportInfoWindow.hide();
    }
    var old_params = {};   //保存首次查询的参数
    // 加载完单报告数据在改变查询条件后时使用
    function queryOrderResportList(params){
        //保存现有的查询条件
        if(Ext.isEmpty(params)){
            params = {};   //如果为空 则构建一个空对象
            Ext.apply(params,old_params); //不是首次查询的条件，赋予旧参数
        }else {
            old_params = {}; //清空旧数据
            Ext.apply(old_params,params); //保存第一次查询的条件
        }
        var pageSize = bbar.pageSize; //一页数量
        params.start = 0;
        params.limit = pageSize;
        
        ordReportStore.baseParams = params;
        ordReportStore.load({
          params : params
        });
    }
    
    /**
     * 保存完单报告后从新加载数据
     */
    function reloadStore4saveReport(){
        ordReportStore.reload();
    }
     /**
     * 删除完单报告
     */
    function deleteReport(ord_report_no){
        Ext.Ajax.request({
          url:'./orderReport.ered?reqCode=deleteOrdReportInfol',
          success : function(response){
            var resultData = Ext.util.JSON.decode(response.responseText);
            if(resultData.success){
                Ext.Msg.alert('提示','删除成功')
                reloadStore4saveReport();
            }else {
                Ext.Msg.alert('提示',resultData.msg)
            }
          },
          params : {ord_report_no : ord_report_no}
        })
    }
    //~~界面事件结束
    //~~完单报告管理界面结束
//=========================================================================================================//    
    
//=========================================================================================================//
    //~~完单报告界面
    /**
     * 头信息 
    */
    var headForm = new  Ext.form.FormPanel({
       id:'headForm',
       title:'',
       defaults:{
           frame : false,
           border : false,
           bodyStyle : 'padding-top:3'
       },
       items:[{
           layout:'column',
           border : false,
           items : [{
               columnWidth:.5, 
               layout:'form',
               border:false,
               labelWidth:70,
               items:[{
                      width:'100%',
                   xtype:'textfield',
                   fieldLabel:'PO#',
                   name : 'order_id',
                   id : 'order_id',
                   readOnly : true,
                   style : 'border-right: 0px;border-top:0px;border-left:0px'
               }]
           },{
               columnWidth:.5,
               layout:'form',
               border:false,
               labelWidth:70,
               items:[{
                   width : '100%',
                   xtype:'textfield',
                   fieldLabel:'款号',
                   name : 'style_no',
                   id : 'style_no',
                   readOnly : true,
                   style : 'border-right: 0px;border-top:0px;border-left:0px'
               }]
           }]
           
       },{
           layout : 'column',
           border : false,
           items:[{
               columnWidth:.25,
               layout:'form',
               border:false,
               labelWidth:70,
               items:[{
                   xtype:'textfield',
                   fieldLabel:'工厂编号',
                   name : 'fac_name',
                   id : 'fac_name',
//                   readOnly : true,
                   style : 'border-right: 0px;border-top:0px;border-left:0px'
               }]
           },{
               columnWidth:.25,
               layout:'form',
               border:false,
               labelWidth:70,
               items:[{
                   xtype:'textfield',
                   fieldLabel:'客户',
                   name : 'cust_name',
                   id : 'cust_name',
                   readOnly : true,
                   style : 'border-right: 0px;border-top:0px;border-left:0px'
               }]
           },{
              columnWidth : .25,
              layout : 'form',
              border : false,
              labelWidth : 70,
              items : [{
                    xtype:'numberfield',
                    fieldLabel : '实裁数',
                     allowDecimals : false,
                   allowNegative : false,
                    id : 'sew_num',
                    name : 'sew_num',
                    style : 'border-right: 0px;border-top:0px;border-left:0px',
                    listeners : {
                        blur : function(field){
                            var product_num = Ext.getCmp('product_num').getValue();
                            var sew_num = field.getValue();
                            var sr_num = '0';
                            if(!(sew_num==null || sew_num==0)){
                                sr_num = parseFloat(((sew_num-product_num)/(+sew_num)*100).toFixed(4))
                            }
                            var cur_sr_num = sew_num - product_num;
                            Ext.getCmp('sr_num').setValue(sr_num);
                            Ext.getCmp('cur_sr_num').setValue(cur_sr_num);
                        }
                   }
            }]
            },{
               columnWidth : .25,
               layout : 'form',
               border : false,
               labelWidth : 70,
               items :[{
                    xtype : 'numberfield',
                    fieldLabel : '当前损耗总数',
                    readOnly : true,
                    id : 'cur_sr_num',
                    name : 'cur_sr_num',
                    style : 'border-right: 0px;border-top:0px;border-left:0px'
               }]
           }]
       },{
           layout:'column',
           border:false,
           items:[{
               columnWidth:.25,
               layout:'form',
               border:false,
               labelWidth:70,
               items:[{
                   xtype:'numberfield',
                   allowDecimals : false,
                   allowNegative : false,
                   fieldLabel:'订单数',
                   name : 'ord_num',
                   id : 'ord_num',
                   readOnly : true,
                   style : 'border-right: 0px;border-top:0px;border-left:0px'
               }]
           },{
               columnWidth:.25,
               layout:'form',
               border:false,
               labelWidth:70,
               items:[{
                   xtype:'numberfield',
                   allowDecimals : false,
                   allowNegative : false,
                   fieldLabel:'指令数',
                   name : 'ins_num',
                   id : 'ins_num',
                   readOnly : true,
                   style : 'border-right: 0px;border-top:0px;border-left:0px'
               }]
           },{
               columnWidth:.25,
               layout:'form',
               border:false,
               labelWidth:70,
               items:[{
                   xtype:'numberfield',
                   allowDecimals : false,
                   allowNegative : false,
                   fieldLabel:'出货数',
                   name : 'product_num',
                   id : 'product_num',
                   style : 'border-right: 0px;border-top:0px;border-left:0px',
                   listeners : {
                        blur : function(field){
                            var sew_num = Ext.getCmp('sew_num').getValue();
                            var product_num = field.getValue();
                            var sr_num = '0';
                            if(!(sew_num==null || sew_num==0)){
                                sr_num = parseFloat(((sew_num-product_num)/(+sew_num)*100).toFixed(4))
                            }
                            var cur_sr_num = sew_num - product_num;
                            Ext.getCmp('sr_num').setValue(sr_num);
                            Ext.getCmp('cur_sr_num').setValue(cur_sr_num);
                        }
                   }
               }]
           },{
               columnWidth:.25,
               layout:'form',
               border:false,
               labelWidth:70,
               items:[{
                   xtype:'numberfield',
                   decimalPrecision : 4,
                   allowNegative : false,
                   fieldLabel:'损耗率%',
                   name : 'sr_num',
                   id : 'sr_num',
                   style : 'border-right: 0px;border-top:0px;border-left:0px'
               }]
           },{
               columnWidth:1,
               layout:'form',
               border:false,
               labelWidth:70,
               items:[{
                     xtype:'textfield',
                     width:'100%',
                     fieldLabel : '<span style="color:#000001">备注</span>',
                     name : 'report_remark',
                     id : 'report_remark',
                   style : 'border-right: 0px;border-top:0px;border-left:0px'
                 }]
           }]
       }]
    })
    /**
     * 数量记录
     */
    var reportNumPanel = new Ext.form.FormPanel({
       id:'reportNumPanel',
       defaults:{
           border:false,
           bodyStyle : 'padding-top:3'
       },
       items:[{
           layout:'column',
           defaults:{border:false},
           items:[{
               columnWidth:.25,
               layout:'form',
               labelWidth:70,
               items:[{
                   xtype:'numberfield',
                   allowDecimals : false,
                   allowNegative : false,
                   fieldLabel:'良余',
                   name : 'ly_num'
               }]
           },{
               columnWidth:.25,
               layout:'form',
               labelWidth:70,
               items:[{
                   xtype:'numberfield',
                   allowDecimals : false,
                   allowNegative : false,
                   fieldLabel:'剪破',
                   name : 'jp_num'
               }]
           },{
               columnWidth:.25,
               layout:'form',
               labelWidth:70,
               items:[{
                   xtype:'numberfield',
                   allowDecimals : false,
                   allowNegative : false,
                   fieldLabel:'水洗不良',
                   name : 'sxbl_num'
               }]
           }]
       },{
           layout:'column',
           defaults:{border:false},
           items:[{
               columnWidth:.25,
               layout:'form',
               labelWidth:70,
               items:[{
                   xtype:'numberfield',
                   allowDecimals : false,
                   allowNegative : false,
                   fieldLabel:'中间领用',
                   name : 'zjly_num'
               }]
           },{
               columnWidth:.25,
               layout:'form',
               labelWidth:70,
               items:[{
                   xtype:'numberfield',
                   allowDecimals : false,
                   allowNegative : false,
                   fieldLabel:'撞针打破',
                   name : 'zzdp_num'
               }]
           },{
               columnWidth:.25,
               layout:'form',
               labelWidth:70,
               items:[{
                   xtype:'numberfield',
                   allowDecimals : false,
                   allowNegative : false,
                   fieldLabel:'水洗破洞',
                   name : 'sxpd'
               }]
           }]
       },{
           layout:'column',
           defaults:{border:false},
           items:[{
               columnWidth:.25,
               layout:'form',
               labelWidth:70,
               items:[{
                   xtype:'numberfield',
                   allowDecimals : false,
                   allowNegative : false,
                   fieldLabel:'成品遗失',
                   name : 'cpys_num'
               }]
           },{
               columnWidth:.25,
               layout:'form',
               labelWidth:70,
               items:[{
                   xtype:'numberfield',
                   allowDecimals : false,
                   allowNegative : false,
                   fieldLabel:'污迹',
                   name : 'wj_num'
               }]
           },{
               columnWidth:.25,
               layout:'form',
               labelWidth:70,
               items:[{
                   xtype:'numberfield',
                   allowDecimals : false,
                   allowNegative : false,
                   fieldLabel:'水洗色差',
                   name : 'sxsc_num'
               }]
           }]
       },{
           layout:'column',
           defaults:{border:false},
           items:[{
               columnWidth:.25,
               layout:'form',
               labelWidth:70,
               items:[{
                   xtype:'numberfield',
                   allowDecimals : false,
                   allowNegative : false,
                   fieldLabel:'后整遗失',
                   name : 'hzys_num'
               }]
           },{
               columnWidth:.25,
               layout:'form',
               labelWidth:70,
               items:[{
                   xtype:'numberfield',
                   allowDecimals : false,
                   allowNegative : false,
                   fieldLabel:'缝制破洞',
                   name : 'fzpd_num'
               }]
           },{
               columnWidth:.25,
               layout:'form',
               labelWidth:70,
               items:[{
                   xtype:'numberfield',
                   allowDecimals : false,
                   allowNegative : false,
                   fieldLabel:'水洗遗失',
                   name : 'sxys_num'
               }]
           }]
       },{
           layout:'column',
           defaults:{border:false},
           items:[{
               columnWidth:.25,
               layout:'form',
               labelWidth:70,
               items:[{
                   xtype:'numberfield',
                   allowDecimals : false,
                   allowNegative : false,
                   fieldLabel:'缝制不良',
                   name : 'fzbl_num'
               }]
           },{
               columnWidth:.25,
               layout:'form',
               labelWidth:70,
               items:[{
                   xtype:'numberfield',
                   allowDecimals : false,
                   allowNegative : false,
                   fieldLabel:'缝制遗失',
                   name : 'fzys_num'
               }]
           },{
               columnWidth:.25,
               layout:'form',
               labelWidth:70,
               items:[{
                layout : 'column',
                border : false,
                style : 'padding-left : 5px',
                items : [{
                    layout : 'form',
                    columnWidth : .35,
                    border : false,
                    items : [{
                        hideLabel :true,
                        xtype : 'textfield',
                        name : 'other4_name',
                        value : '其他4'
                   }]
                },{
                    layout : 'form',
                    columnWidth : .65,
                    border : false,
                    items : [  {
                       xtype:'numberfield',
                       allowDecimals : false,
                       allowNegative : false,
                       hideLabel : true,
                       name : 'other4'
                   }]
                }]
               }]
           }]
       },{
           layout:'column',
           defaults:{border:false},
           items:[{
               columnWidth:.25,
               layout:'form',
               labelWidth:70,
               items:[{
                   xtype:'numberfield',
                   allowDecimals : false,
                   allowNegative : false,
                   fieldLabel:'色光严重',
                   name : 'sgyz_num'
               }]
           },{
               columnWidth:.25,
               layout:'form',
               labelWidth:70,
               items:[{
                layout : 'column',
                border : false,
                style : 'padding-left : 5px',
                items : [{
                    layout : 'form',
                    columnWidth : .35,
                    border : false,
                    items : [{
                        hideLabel :true,
                        xtype : 'textfield',
                        name : 'other1_name',
                        value : '其他1'
                   }]
                },{
                    layout : 'form',
                    columnWidth : .65,
                    border : false,
                    items : [  {
                       xtype:'numberfield',
                       allowDecimals : false,
                       allowNegative : false,
                       hideLabel : true,
                       name : 'other1'
                   }]
                }]
               }]
           },{
               columnWidth:.25,
               layout:'form',
               labelWidth:70,
               items:[{
                layout : 'column',
                border : false,
                style : 'padding-left : 5px',
                items : [{
                    layout : 'form',
                    columnWidth : .35,
                    border : false,
                    items : [{
                        hideLabel :true,
                        xtype : 'textfield',
                        name : 'other5_name',
                        value : '其他5'
                   }]
                },{
                    layout : 'form',
                    columnWidth : .65,
                    border : false,
                    items : [  {
                       xtype:'numberfield',
                       allowDecimals : false,
                       allowNegative : false,
                       hideLabel : true,
                       name : 'other5'
                   }]
                }]
               }]
           }]
       },{
           layout:'column',
           defaults:{border:false},
           items:[{
               columnWidth:.25,
               layout:'form',
               labelWidth:70,
               items:[{
                   xtype:'numberfield',
                   allowDecimals : false,
                   allowNegative : false,
                   fieldLabel:'面料',
                   name : 'ml_num'
               }]
           },{
               columnWidth:.25,
               layout:'form',
               labelWidth:70,
               items:[{
                layout : 'column',
                border : false,
                style : 'padding-left : 5px',
                items : [{
                    layout : 'form',
                    columnWidth : .35,
                    border : false,
                    items : [{
                        hideLabel :true,
                        xtype : 'textfield',
                        name : 'other2_name',
                        value : '其他2'
                   }]
                },{
                    layout : 'form',
                    columnWidth : .65,
                    border : false,
                    items : [  {
                       xtype:'numberfield',
                       allowDecimals : false,
                       allowNegative : false,
                       hideLabel : true,
                       name : 'other2'
                   }]
                }]
               }]
           },{
               columnWidth:.25,
               layout:'form',
               labelWidth:70,
               items:[{
                layout : 'column',
                border : false,
                style : 'padding-left : 5px',
                items : [{
                    layout : 'form',
                    columnWidth : .35,
                    border : false,
                    items : [{
                        hideLabel :true,
                        xtype : 'textfield',
                        name : 'other6_name',
                        value : '其他6'
                   }]
                },{
                    layout : 'form',
                    columnWidth : .65,
                    border : false,
                    items : [  {
                       xtype:'numberfield',
                       allowDecimals : false,
                       allowNegative : false,
                       hideLabel : true,
                       name : 'other6'
                   }]
                }]
               }]
           }]
       },{
           layout:'column',
           defaults:{border:false},
           items:[{
               columnWidth:.25,
               layout:'form',
               labelWidth:70,
               items:[{
                   xtype:'numberfield',
                   allowDecimals : false,
                   allowNegative : false,
                   fieldLabel:'布疵',
                   name : 'bc_num'
               }]
           },{
               columnWidth:.25,
               layout:'form',
               labelWidth:70,
               items:[{
                layout : 'column',
                border : false,
                style : 'padding-left : 5px',
                items : [{
                    layout : 'form',
                    columnWidth : .35,
                    border : false,
                    items : [{
                        hideLabel :true,
                        xtype : 'textfield',
                        name : 'other3_name',
                        value : '其他3'
                   }]
                },{
                    layout : 'form',
                    columnWidth : .65,
                    border : false,
                    items : [  {
                       xtype:'numberfield',
                       allowDecimals : false,
                       allowNegative : false,
                       hideLabel : true,
                       name : 'other3'
                   }]
                }]
               }]
           },{
               columnWidth:.25,
               layout:'form',
               labelWidth:70,
               items:[{
                layout : 'column',
                border : false,
                style : 'padding-left : 5px',
                items : [{
                    layout : 'form',
                    columnWidth : .35,
                    border : false,
                    items : [{
                        hideLabel :true,
                        xtype : 'textfield',
                        name : 'other7_name',
                        
                        value : '其他7'
                   }]
                },{
                    layout : 'form',
                    columnWidth : .65,
                    border : false,
                    items : [  {
                       xtype:'numberfield',
                       allowDecimals : false,
                       allowNegative : false,
                       hideLabel : true,
                       name : 'other7'
                   }]
                }]
               }]
           }]
       }]
    })
    
    /**
     * 备注及确认人
     */
    var reportBottomPanel = new Ext.form.FormPanel({
        id:'reportBottomPanel',
        defaults:{
          border:false,
          bodyStyle : 'padding-top:3'  
       },
        items:[{
            layout : 'column',
            defaults : {border:false,labelWidth: 70},
            items : [{
                columnWidth : .3,
                layout : 'form',
                items : [{
                    xtype : 'textfield',
                    id : 'sewfac_duty',
                    width : '100%',
                    fieldLabel : '<span style="color:#000001">缝制厂</span>',
                    readOnly : true
                }]
            },{
                columnWidth : .1,
                layout : 'form',
                items : [{
                    xtype : 'button',
                    width : '100%',
                    text : '查询工厂',
                    handler : function(){
                        queryGrpAndDept('sewfac_duty');
                    }
                }]
            },{
                columnWidth : .2,
                layout : 'form',
                items : [{
                    xtype : 'numberfield',
                    allowDecimals : false,
                    allowNegative : false,
                    name : 'sewfac_num',
                    id : 'sewfac_num',
                    width : '100%',
                    fieldLabel : '<span style="color:#000001">数量</span>'
                }]
            }]
        },{
            layout : 'column',
            defaults : {border:false,labelWidth:70},
            items:[{
                 columnWidth:.4,
                 layout:'form',
                 items:[{
                     xtype:'textfield',
                     width:'100%',
                     fieldLabel : '<span style="color:#000001">缝制厂备注</span>',
                     name : 'sewfac_remark_read',
                     id : 'sewfac_remark_read',
                     readOnly : true,
                   style : 'border-right: 0px;border-top:0px;border-left:0px'
                 }]
            },{
                 columnWidth : .2,
                 layout:'form',
                 items : [{
                     xtype:'textfield',
                     width:'100%',
                     name : 'sewfac_remark_write',
                     id : 'sewfac_remark_write',
                     hideLabel:true,
                     hidden : true   //默认隐藏不显示 只有确认后才显示
                 }]
            },{
                 columnWidth:.3,
                 layout : 'form',
                 items : [{
                     xtype:'textfield',
                     width:'100%',
                     fieldLabel : '<span style="color:#000001">缝制确认人</span>',
                     name : 'sewSure'
                 }] 
            },{
                 columnWidth : .1,
                 layout : 'form',
                 items : [{
                     xtype : 'button',
                     width:'100%',
                     text : '确认',
                     id : 'sewSure_yes',
                     handler : function(){
                         report_control.sureOpr('sewSure');
                     }
                 }]
            },{
                 columnWidth : .1,
                 layout : 'form',
                 items : [{
                     hidden : true,
                     xtype : 'button',
                     width:'100%',
                     text : '取消',
                     id : 'sewSure_no',
                     handler : function(){
                         report_control.cancelOpr('sewSure');
                     }
                 }]
            }]
        },{
            layout : 'column',
            defaults : {border:false,labelWidth: 70},
            items : [{
                columnWidth : .3,
                layout : 'form',
                items : [{
                    xtype : 'textfield',
                    id : 'washfac_duty',
                    readOnly : true,
                    width : '100%',
                    fieldLabel : '<span style="color:#000000">水洗厂</span>'
                }]
            },{
                columnWidth : .1,
                layout : 'form',
                items : [{
                    xtype : 'button',
                    width : '100%',
                    text : '查询工厂',
                    handler : function(){
                        queryGrpAndDept('washfac_duty');
                    }
                }]
            },{
                columnWidth : .2,
                layout : 'form',
                items : [{
                    xtype : 'numberfield',
                    allowDecimals : false,
                    allowNegative : false,
                    name : 'washfac_num',
                    id : 'washfac_num',
                    width : '100%',
                    fieldLabel : '<span style="color:#000000">数量</span>'
                }]
            }]
        },{
            layout : 'column',
            defaults : {border:false,labelWidth:70},
            items:[{
                 columnWidth:.4,
                 layout:'form',
                 items:[{
                     xtype:'textfield',
                     width:'100%',
                     fieldLabel : '<span style="color:#000000">水洗厂备注</span>',
                     readOnly : true,
                     name : 'washfac_remark_read',
                     id : 'washfac_remark_read',
                    style : 'border-right: 0px;border-top:0px;border-left:0px'
                 }]
            },{
                 columnWidth : .2,
                 layout:'form',
                 items : [{
                     xtype:'textfield',
                     width:'100%',
                     name : 'washfac_remark_write',
                     id : 'washfac_remark_write',
                     hideLabel:true,
                     hidden : true   //默认隐藏不显示 只有确认后才显示
                 }]
            },{
                 columnWidth:.3,
                 layout : 'form',
                 items : [{
                     xtype:'textfield',
                     width:'100%',
                     fieldLabel : '<span style="color:#000000">水洗确认人</span>',
                     name : 'washSure'
                 }] 
            },{
                 columnWidth : .1,
                 layout : 'form',
                 items : [{
                     xtype : 'button',
                     width:'100%',
                     text : '确认',
                     id : 'washSure_yes',
                     handler : function(){
                        report_control.sureOpr('washSure');
                     }
                 }]
            },{
                 columnWidth : .1,
                 layout : 'form',
                 items : [{
                     hidden : true,
                     xtype : 'button',
                     width:'100%',
                     text : '取消',
                     id : 'washSure_no',
                     handler : function(){
                        report_control.cancelOpr('washSure');
                     }
                 }]
            }]
        },{
            layout : 'column',
            defaults : {border:false,labelWidth: 70},
            items : [{
                columnWidth : .3,
                layout : 'form',
                items : [{
                    xtype : 'textfield',
                    id : 'package_duty',
                    readOnly : true,
                    width : '100%',
                    fieldLabel : '<span style="color:#000001">后整厂</span>'
                }]
            },{
                columnWidth : .1,
                layout : 'form',
                items : [{
                    xtype : 'button',
                    width : '100%',
                    text : '查询工厂',
                    handler : function(){
                        queryGrpAndDept('package_duty');
                    }
                }]
            },{
                columnWidth : .2,
                layout : 'form',
                items : [{
                    xtype : 'numberfield',
                    allowDecimals : false,
                    allowNegative : false,
                    name : 'package_num',
                    id : 'package_num',
                    width : '100%',
                    fieldLabel : '<span style="color:#000001">数量</span>'
                }]
            }]
        },{
            layout : 'column',
            defaults : {border:false,labelWidth:70},
            items:[{
                 columnWidth:.4,
                 layout:'form',
                 items:[{
                     xtype:'textfield',
                     width:'100%',
                     fieldLabel : '<span style="color:#000001">后整厂备注</span>',
                     readOnly : true,
                     name : 'package_remark_read',
                     id : 'package_remark_read',
                   style : 'border-right: 0px;border-top:0px;border-left:0px'
                 }]
            },{
                 columnWidth : .2,
                 layout:'form',
                 items : [{
                     xtype:'textfield',
                     width:'100%',
                     hideLabel:true,
                     name : 'package_remark_write',
                     id : 'package_remark_write',
                     hidden : true   //默认隐藏不显示 只有确认后才显示
                 }]
            },{
                 columnWidth:.3,
                 layout : 'form',
                 items : [{
                     xtype:'textfield',
                     width:'100%',
                     fieldLabel : '<span style="color:#000001">后整确认人</span>',
                     name : 'packageSure'
                 }] 
            },{
                 columnWidth : .1,
                 layout : 'form',
                 items : [{
                     xtype : 'button',
                     width:'100%',
                     text : '确认',
                     id : 'packageSure_yes',
                     handler : function(){
                        report_control.sureOpr('packageSure');
                     }
                 }]
            },{
                 columnWidth : .1,
                 layout : 'form',
                 items : [{
                     hidden : true,
                     xtype : 'button',
                     width:'100%',
                     text : '取消',
                     id : 'packageSure_no',
                     handler : function(){
                        report_control.cancelOpr('packageSure');
                     }
                 }]
            }]
        },{
            layout : 'column',
            defaults : {border:false,labelWidth: 70},
            items : [{
                columnWidth : .3,
                layout : 'form',
                items : [{
                    xtype : 'textfield',
                    id : 'qcdept_duty',
                    readOnly : true,
                    width : '100%',
                    fieldLabel : '<span style="color:#000000">QC部门</span>'
                }]
            },{
                columnWidth : .1,
                layout : 'form',
                items : [{
                    xtype : 'button',
                    width : '100%',
                    text : '查询工厂',
                    handler : function(){
                        queryGrpAndDept('qcdept_duty');
                    }
                }]
            },{
                columnWidth : .2,
                layout : 'form',
                items : [{
                    xtype : 'numberfield',
                    allowDecimals : false,
                    allowNegative : false,
                    name : 'qcdept_num',
                    id : 'qcdept_num',
                    width : '100%',
                    fieldLabel : '<span style="color:#000000">数量</span>'
                }]
            }]
        },{
            layout : 'column',
            defaults : {border:false,labelWidth:70},
            items:[{
                 columnWidth:.4,
                 layout:'form',
                 items:[{
                     xtype:'textfield',
                     width:'100%',
                     fieldLabel : '<span style="color:#000000">QC部门备注</span>',
                     readOnly : true,
                     name : 'qcdept_remark_read',
                     id : 'qcdept_remark_read',
                   style : 'border-right: 0px;border-top:0px;border-left:0px'
                 }]
            },{
                 columnWidth : .2,
                 layout:'form',
                 items : [{
                     xtype:'textfield',
                     width:'100%',
                     hideLabel:true,
                     name : 'qcdept_remark_write',
                     id : 'qcdept_remark_write',
                     hidden : true   //默认隐藏不显示 只有确认后才显示
                 }]
            },{
                 columnWidth:.3,
                 layout : 'form',
                 items : [{
                     xtype:'textfield',
                     width:'100%',
                     fieldLabel : '<span style="color:#000000">QC确认人</span>',
                     name : 'qcSure'
                 }] 
            },{
                 columnWidth : .1,
                 layout : 'form',
                 items : [{
                     xtype : 'button',
                     width:'100%',
                     text : '确认',
                     id : 'qcSure_yes',
                     handler : function(){
                        report_control.sureOpr('qcSure');
                     }
                 }]
            },{
                 columnWidth : .1,
                 layout : 'form',
                 items : [{
                      hidden : true,
                     xtype : 'button',
                     width:'100%',
                     text : '取消',
                     id : 'qcSure_no',
                     handler : function(){
                        report_control.cancelOpr('qcSure');
                     }
                 }]
            }]
        },{
            layout : 'column',
            defaults : {border:false,labelWidth: 70},
            items : [{
                columnWidth : .3,
                layout : 'form',
                items : [{
                    xtype : 'textfield',
                    id : 'mg_duty',
                    readOnly : true,
                    width : '100%',
                    fieldLabel : '<span style="color:#000001">面供</span>'
                }]
            },{
                columnWidth : .1,
                layout : 'form',
                items : [{
                    xtype : 'button',
                    width : '100%',
                    text : '查询工厂',
                    handler : function(){
                        queryGrpAndDept('mg_duty');
                    }
                }]
            },{
                columnWidth : .2,
                layout : 'form',
                items : [{
                    xtype : 'numberfield',
                    allowDecimals : false,
                    allowNegative : false,
                    name : 'mg_num',
                    id : 'mg_num',
                    width : '100%',
                    fieldLabel : '<span style="color:#000001">数量</span>'
                }]
            }]
        },{
            layout : 'column',
            defaults : {border:false,labelWidth:70},
            items:[{
                 columnWidth:.4,
                 layout:'form',
                 items:[{
                     xtype:'textfield',
                     width:'100%',
                     fieldLabel : '<span style="color:#000001">面供备注</span>',
                     name : 'mg_remark_read',
                     id : 'mg_remark_read',
                     readOnly : true,
                   style : 'border-right: 0px;border-top:0px;border-left:0px'
                 }]
            },{
                 columnWidth : .2,
                 layout:'form',
                 items : [{
                     xtype:'textfield',
                     width:'100%',
                     name : 'mg_remark_write',
                     id : 'mg_remark_write',
                     hideLabel:true,
                     hidden : true   //默认隐藏不显示 只有确认后才显示
                 }]
            },{
                 columnWidth:.3,
                 layout : 'form',
                 items : [{
                     xtype:'textfield',
                     width:'100%',
                     fieldLabel : '<span style="color:#000001">面供确认人</span>',
                     name : 'mgSure'
                 }] 
            },{
                 columnWidth : .1,
                 layout : 'form',
                 items : [{
                     xtype : 'button',
                     id : 'mgSure_yes',
                     width:'100%',
                     text : '确认',
                     handler : function(){
                         report_control.sureOpr('mgSure');
                     }
                 }]
            },{
                 columnWidth : .1,
                 layout : 'form',
                 items : [{
                    hidden : true,
                     xtype : 'button',
                     width:'100%',
                     id : 'mgSure_no',
                     text : '取消',
                     handler : function(){
                        report_control.cancelOpr('mgSure');
                     }
                 }]
            }]
        },{
            layout : 'column',
            defaults : {border:false,labelWidth: 70},
            items : [{
                columnWidth : .3,
                layout : 'form',
                items : [{
                    xtype : 'textfield',
                    id : 'my_duty',
                    readOnly : true,
                    width : '100%',
                    fieldLabel : '<span style="color:#000000">贸易</span>'
                }]
            },{
                columnWidth : .1,
                layout : 'form',
                items : [{
                    xtype : 'button',
                    width : '100%',
                    text : '查询工厂',
                    handler : function(){
                        queryGrpAndDept('my_duty');
                    }
                }]
            },{
                columnWidth : .2,
                layout : 'form',
                items : [{
                    xtype : 'numberfield',
                    allowDecimals : false,
                    allowNegative : false,
                    name : 'my_num',
                    id : 'my_num',
                    width : '100%',
                    fieldLabel : '<span style="color:#000000">数量</span>'
                }]
            }]
        },{
            layout : 'column',
            defaults : {border:false,labelWidth:70},
            items:[{
                 columnWidth:.4,
                 layout:'form',
                 items:[{
                     xtype:'textfield',
                     width:'100%',
                     fieldLabel : '<span style="color:#000000">贸易备注</span>',
                     name : 'my_remark_read',
                     id : 'my_remark_read',
                     readOnly : true,
                   style : 'border-right: 0px;border-top:0px;border-left:0px'
                 }]
            },{
                 columnWidth : .2,
                 layout:'form',
                 items : [{
                     xtype:'textfield',
                     width:'100%',
                     name : 'my_remark_write',
                     id : 'my_remark_write',
                     hideLabel:true,
                     hidden : true   //默认隐藏不显示 只有确认后才显示
                 }]
            },{
                 columnWidth:.3,
                 layout : 'form',
                 items : [{
                     xtype:'textfield',
                     width:'100%',
                     fieldLabel : '<span style="color:#000000">贸易确认人</span>',
                     name : 'mySure'
                 }] 
            },{
                 columnWidth : .1,
                 layout : 'form',
                 items : [{
                     xtype : 'button',
                     width:'100%',
                     id : 'mySure_yes',
                     text : '确认',
                     handler : function(){
                         report_control.sureOpr('mySure');
                     }
                 }]
            },{
                 columnWidth : .1,
                 layout : 'form',
                 items : [{
                    hidden : true,
                     xtype : 'button',
                     width:'100%',
                     id : 'mySure_no',
                     text : '取消',
                     handler : function(){
                        report_control.cancelOpr('mySure');
                     }
                 }]
            }]
        },{
            layout : 'column',
            defaults : {border:false,labelWidth: 70},
            items : [{
                columnWidth : .3,
                layout : 'form',
                items : [{
                    xtype : 'textfield',
                    id : 'ck_duty',
                    readOnly : true,
                    width : '100%',
                    fieldLabel : '<span style="color:#000001">仓库<span>'
                }]
            },{
                columnWidth : .1,
                layout : 'form',
                items : [{
                    xtype : 'button',
                    width : '100%',
                    text : '查询工厂',
                    handler : function(){
                        queryGrpAndDept('ck_duty');
                    }
                }]
            },{
                columnWidth : .2,
                layout : 'form',
                items : [{
                    xtype : 'numberfield',
                    allowDecimals : false,
                    allowNegative : false,
                    name : 'ck_num',
                    id : 'ck_num',
                    width : '100%',
                    fieldLabel : '<span style="color:#000001">数量</span>'
                }]
            }]
        },{
            layout : 'column',
            defaults : {border:false,labelWidth:70},
            items:[{
                 columnWidth:.4,
                 layout:'form',
                 items:[{
                     xtype:'textfield',
                     width:'100%',
                     fieldLabel : '<span style="color:#000001">仓库备注</span>',
                     name : 'ck_remark_read',
                     id : 'ck_remark_read',
                     readOnly : true,
                   style : 'border-right: 0px;border-top:0px;border-left:0px'
                 }]
            },{
                 columnWidth : .2,
                 layout:'form',
                 items : [{
                     xtype:'textfield',
                     width:'100%',
                     name : 'ck_remark_write',
                     id : 'ck_remark_write',
                     hideLabel:true,
                     hidden : true   //默认隐藏不显示 只有确认后才显示
                 }]
            },{
                 columnWidth:.3,
                 layout : 'form',
                 items : [{
                     xtype:'textfield',
                     width:'100%',
                     fieldLabel : '<span style="color:#000001">仓库确认人<span>',
                     name : 'ckSure'
                 }] 
            },{
                 columnWidth : .1,
                 layout : 'form',
                 items : [{
                     xtype : 'button',
                     width:'100%',
                     id : 'ckSure_yes',
                     text : '确认',
                     handler : function(){
                         report_control.sureOpr('ckSure');
                     }
                 }]
            },{
                 columnWidth : .1,
                 layout : 'form',
                 items : [{
                    hidden : true,
                     xtype : 'button',
                     width:'100%',
                     id : 'ckSure_no',
                     text : '取消',
                     handler : function(){
                        report_control.cancelOpr('ckSure');
                     }
                 }]
            }]
        },{
            layout : 'column',
            defaults : {border:false,labelWidth: 70},
            items : [{
                columnWidth : .3,
                layout : 'form',
                items : [{
                    xtype : 'textfield',
                    id : 'js_duty',
                    readOnly : true,
                    width : '100%',
                    fieldLabel : '<span style="color:#000001">技术<span>'
                }]
            },{
                columnWidth : .1,
                layout : 'form',
                items : [{
                    xtype : 'button',
                    width : '100%',
                    text : '查询工厂',
                    handler : function(){
                        queryGrpAndDept('js_duty');
                    }
                }]
            },{
                columnWidth : .2,
                layout : 'form',
                items : [{
                    xtype : 'numberfield',
                    allowDecimals : false,
                    allowNegative : false,
                    name : 'js_num',
                    id : 'js_num',
                    width : '100%',
                    fieldLabel : '<span style="color:#000001">数量</span>'
                }]
            }]
        },{
            layout : 'column',
            defaults : {border:false,labelWidth:70},
            items:[{
                 columnWidth:.4,
                 layout:'form',
                 items:[{
                     xtype:'textfield',
                     width:'100%',
                     fieldLabel : '<span style="color:#000001">技术备注</span>',
                     name : 'js_remark_read',
                     id : 'js_remark_read',
                     readOnly : true,
                   style : 'border-right: 0px;border-top:0px;border-left:0px'
                 }]
            },{
                 columnWidth : .2,
                 layout:'form',
                 items : [{
                     xtype:'textfield',
                     width:'100%',
                     name : 'js_remark_write',
                     id : 'js_remark_write',
                     hideLabel:true,
                     hidden : true   //默认隐藏不显示 只有确认后才显示
                 }]
            },{
                 columnWidth:.3,
                 layout : 'form',
                 items : [{
                     xtype:'textfield',
                     width:'100%',
                     fieldLabel : '<span style="color:#000001">技术确认人<span>',
                     name : 'jsSure'
                 }] 
            },{
                 columnWidth : .1,
                 layout : 'form',
                 items : [{
                     xtype : 'button',
                     width:'100%',
                     id : 'jsSure_yes',
                     text : '确认',
                     handler : function(){
                         report_control.sureOpr('jsSure');
                     }
                 }]
            },{
                 columnWidth : .1,
                 layout : 'form',
                 items : [{
                    hidden : true,
                     xtype : 'button',
                     width:'100%',
                     id : 'jsSure_no',
                     text : '取消',
                     handler : function(){
                        report_control.cancelOpr('jsSure');
                     }
                 }]
            }]
        }]
    })
    
    var reportInfoPanel = new Ext.Panel({
       layout : 'form',
       id:'reportInfoPanel',
       region:'center',
       border : false,
       autoScroll:true,
       labelAlign : 'right',
       items:[headForm,reportNumPanel,reportBottomPanel]
     })
     var reportInfoWindow_tbar = new Ext.Toolbar({
       items : [{
           text : '工厂编号查询',
           hidden : true,
           handler : function(){
               natureBindPanel.show();
           }
       },'-',{
           text : '款号/PO号查询',
           iconCls: 'page_findIcon',
           handler : function(){
               report_control.queryStyleAndPO();
           }
       }]
     })
    var reportInfoWindow = new Ext.Window({
       layout:'border',
       title : '完单报告',
       width : 900,
       height:504,
       autoScroll:true,
       closable : false,
       resizable : false,
       closeAction : 'hide',
       animateTarget : Ext.getBody(),
       items:[reportInfoPanel],
       tbar : reportInfoWindow_tbar,
       buttons : [{
           text:'保存',
           id:'save_reportData',
           iconCls:'acceptIcon',
           handler : function(){
                  report_control.saveReport();
           }
       },{
           text:'取消',
           id:'cancle_reportData',
           iconCls : 'deleteIcon',
           handler : function(){
                  report_control.cancelReport();
           }
       }]
    })

    //~~~完单界面end
//=============================================================================================================================//
    /**
     * 详细界面查询完单报告
     */
    function queryReportOrder4detailWin(){
        //TODO
        var windowCon = new QueryWindowConstruct(); //详细查询控制器
        //添加事件
        windowCon.clearListener();
        windowCon.addListener('22',queryRO_callBack);
        windowCon.showQueryWindow();
    }
    /**
     * 查询订单后的回调函数--查询完单报告使用
     */
    function queryRO_callBack(records){
        var resultOrderArr = [];
        for(var idx=0;idx<records.length;idx++){
            var bean = records[idx];
            resultOrderArr.push(bean.get('order_id'));
        }
        var params = {};
        params.orders = resultOrderArr.join(',');
        queryOrderResportList(params);
    }
    /**
     * 查询责任工厂
     */
    function queryGrpAndDept(facId){
        var queryW = new QueryGrpAndDeptDetail();
        queryW.init();
        queryW.showWindow();
        queryW.addListeners4query('24',setGrpAndDept,true);
        /**
         * 设置责任工厂
         */
        function setGrpAndDept(param){
            param = param ||[];
            report_control.dataMode.setDutyFac(facId,param);  // 设置mode值
            setDutyShowFac(facId);
        }
    }
    /**
     * 设置责任工厂的显示
     */
    function setDutyShowFac(facId){
        var showInfo = report_control.dataMode.getDutyFacShow(facId);
        Ext.getCmp(facId).setValue(showInfo);   //设置显示值
    }
    
    
//=============================================================================================================================//    
    //创建一个控制器
       /**
        * 控制器的添加方法
        */
        function addReport_c1(){
              this.window.show();
        }
        /**
         * 控制器的编辑方法
        */ 
        function editReport_c1(record){
            var ord_report_no = record.get('ord_report_no');
            this.dataMode.requestReport(ord_report_no);
            this.window.show();
        }
        /**
         * 控制器的保存方法
         */
        function saveReport_c1(){
            var headFormData = Ext.getCmp('headForm').getForm().getValues();
            var reportBottomData = Ext.getCmp('reportBottomPanel').getForm().getValues();
            var reportNumPanelData = Ext.getCmp('reportNumPanel').getForm().getValues();
            this.dataMode.saveReport(headFormData,reportNumPanelData,reportBottomData);
        }
        /**
         * 控制器的取消方法
         */
        function cancelReport_c1(){
            this.dataMode.initReportFormData();
            this.window.hide();
        }
        /**
         * 取消确认人
         */
        function cancelOpr_c1(type){
            this.dataMode.cancelSure(type);
        }
        /**
         * 确认 确认人
         * this：指向控制器
         */
        function sureOpr_c1(type){
            this.dataMode.sureInfo(type);
        }
        /**
         * 点击款号/PO号查询
         */
        function queryStyleAndPO_c1(){
           var windowCon = new QueryWindowConstruct(); //详细查询控制器
           //添加事件
           windowCon.clearListener();
           windowCon.addListener('992',this.queryOrder);
           windowCon.showQueryWindow();
        }
        //查询窗口添加事件
        function queryOrder_c1(records){
            var ordArray = [];
            var length = records.length;
            for(var idx=0;idx<length;idx++){
               var record = records[idx];
               var order_id = record.get('order_id');
               var cust_id = record.get('cust_id');
               var cust_name = record.get('cust_name');
               var style_no = record.get('style_no');
               var ins_num = record.get('ins_num');
               var ord_num = record.get('ord_num');
               var obj = {
                   order_id : order_id,
                   cust_id : cust_id,
                   cust_name : cust_name,
                   style_no : style_no,
                   ins_num : ins_num==''?'0':ins_num,
                   ord_num : ord_num==''?'0':ord_num
               }
               ordArray.push(obj);
            }
            report_control.dataMode.setReportOrdInfo(ordArray);
        }
        /**
         * 控制器
         */
        var report_control = {
            window : reportInfoWindow,
            dataMode : new ReportModeConstruct(window.login_id,window.login_name),
            addReport : addReport_c1,
            editReport : editReport_c1,
            saveReport : saveReport_c1,
            cancelReport : cancelReport_c1,
            cancelOpr : cancelOpr_c1,
            sureOpr : sureOpr_c1,
            queryOrder : queryOrder_c1,
            queryStyleAndPO : queryStyleAndPO_c1
        }
    //~控制器结束
//=============================================================================================================================//
       
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
//=============================================================================================================================//
    //创建MODE
    /**
     * 完单报告MODE构造器
     */
    function ReportModeConstruct(login_id,login_name) {
        /**
         * 如果需要同时保存一个信息的显示信息和保存信息，将信息独立处理保存，
         * 当一个信息和同类的信息需要分开处理（只读权限和可编辑权限），将信息分开处理，
         * 将需要显示的信息独立出来显示信息,
         */
        var loginid = login_id;   //登录 人账号
        var loginname = login_name;   //登录人名字
        var ord_report_no = '';   //完单报告号
        
        var reportOrdInfo = []; // 完单报告基本信息中的客户，PO，款号,订单数,指令数
        var reportFacInfo = [];   //完单报告基本信息-->工厂信息（#PO涉及的工厂）
        
        var reportBaseInfo = {};  // 完单报告基本信息 -->显示信息
        var reportNumInfo = {};   // 完单报告数量信息 -->显示信息
        
        var reportRemarkInfo = {};   // 除登录人备注信息
        var reportLogRemarkInfo = {}; //登录人的备注信息
        var reportShowRemarkInfo = {};    //备注信息：所有的备注信息-->显示信息
        
        var reportDutyFac = {}; // 指定责任工厂(数量指定工厂)->保存 每一个属性都是一个数组
        var reportDutyFacShow = {}; //指定责任工厂->显示  每一个属性都是一个数组
        var reportDutyNum = {}; // 指定责任数量
        
        
        var reportSurePor = {};   //确认人信息   分类：确认人数组 
        var reportSureporInfo = {}; //显示信息
        var sewSure = false;   // 确认人是否已确认，默认为未确认-->登录人的确认信息
        var washSure = false; // 水洗
        var packageSure = false;  // 后整
        var qcSure = false;   //  QC
        var mgSure = false; // 面供
        var mySure = false; // 贸易
        var ckSure = false; // 仓库
        var jsSure = false; // 技术 
        
        //mode数据的改变马上映射到界面，界面数据的改变将在操作后更新到mode
        /**
         * 设置新数据后重置基础数据
         */
        function resetReportBaseInfo4newOrderinfo(){
            reportBaseInfo ={};  //重置基础信息数据
            reportOrdInfo = [];  // 重置订单信息
            reportFacInfo = [];  // 重置工厂信息
        }
        
        /**
         * 设置责任工厂
         * @param deptArr 部门节点的数组
         */
        function setDutyFac(facName,deptArr){
            deptArr = deptArr || [];
            var dutyFacArr = [];
            var dutyFacShowArr = [];
            for(var idx=0;idx<deptArr.length;idx++){
                dutyFacArr.push(deptArr[idx].id);
                dutyFacShowArr.push(deptArr[idx].text);
            }
            reportDutyFac[facName] = dutyFacArr;
            reportDutyFacShow[facName] = dutyFacShowArr;
        }
        /**
         * 获取指定的责任工厂
         * @param facName 
         * @reture 部门id的数组
         */
        function getDutyFac(facName){
            var dutyArr = reportDutyFac[facName];   // 获取责任工厂
            return dutyArr;
        }
        /**
         * 获取指定的责任工厂显示
         */
        function getDutyFacShow(facName){
            var dutyFacShowArr = reportDutyFacShow[facName] || [];
            var resultStr = '';
            for(var idx=0;idx<dutyFacShowArr.length;idx++){
                resultStr += ','+ dutyFacShowArr[idx];
            }
            return resultStr;
        }
        
        //ordArray是一个数据数组
        function setReportOrdInfo(ordArray){
            resetReportBaseInfo4newOrderinfo();
            reportOrdInfo = ordArray; //保存基础数据
            //处理显示数据
            var order_id = [];
            var style_no = [];
            var cust_name = [];
            var ins_num = 0;
            var ord_num = 0;
            var length = ordArray.length;
            for(var idx=0;idx<length;idx++){
                var obj = ordArray[idx];
               var order_id_bean = obj['order_id'];
               var cust_name_bean = obj['cust_name'];
               var style_no_bean = obj['style_no'];
               var ins_num_bean = parseInt(obj['ins_num']);
               var ord_num_bean = parseInt(obj['ord_num']);
               //添加订单号
               if(order_id.indexOf(order_id_bean)<0){
                       order_id.push(order_id_bean)
               }
               //添加款号
               if(style_no.indexOf(style_no_bean)<0){
                       style_no.push(style_no_bean);
               }
               //添加客户
               if(cust_name.indexOf(cust_name_bean)<0){
                       cust_name.push(cust_name_bean)
                       
               }
               ins_num = (+ins_num)+(+ins_num_bean);
               ord_num = (+ord_num)+(+ord_num_bean);
            }
            var changeData = {
                order_id : order_id.join(','),
                style_no : style_no.join(','),
                cust_name : cust_name.join(','),
                ins_num : ins_num,
                ord_num : ord_num
            }
            //更新模型中显示的数据
            reportBaseInfo.order_id = order_id.join(',');
            reportBaseInfo.style_no = style_no.join(',');
            reportBaseInfo.cust_name = cust_name.join(',');
            reportBaseInfo.ins_num = ins_num;
            reportBaseInfo.ord_num = ord_num;
            //调用订单额外信息
            requestOrderInfoList(order_id.join(','));
            //调用见面的监听
            changeData4viewListener(changeData);
        }
        /**
         * 保存工厂的相关信息
         * @param facArray 关于工厂对象的数组
         */
        function setReportFacInfo(facArray){
          //保存工厂相关信息
          reportFacInfo = facArray;
          //处理工厂相关信息
          var fac_name = [];
          var length = facArray.length;
          for(var idx=0;idx<length;idx++){
              var facObj = facArray[idx];
              var fac_name_bean = facObj['fac_name'];
              //显示的信息
              if(fac_name.indexOf(fac_name_bean)<0){
                  fac_name.push(fac_name_bean);
              }
          }
          reportBaseInfo.facName = fac_name.join(',');
          //变化的数据
          var changeData = {
              fac_name : fac_name.join(',')
          }
          
          //调用界面的监听
          changeData4viewListener(changeData);
        }
        /**
         * 请求订单的额外信息
         * @param {} orders
         * 请求工厂编号，出货数，损耗率%
         * 在选择订单信息的时候或者在加载完单报告信息的时候
         */
        function requestOrderInfoList(orders){
            Ext.Ajax.request({
             url : './orderReport.ered?reqCode=requestOrderInfo',
              success : function(response){
                var responseData = Ext.util.JSON.decode(response.responseText);
                if(responseData.success){    //解析额外信息
                    var facNameArr = [];   // 所有的工厂信息
                    var totalProductNum = 0;   //出运成品数据
                    var totalSewNum = 0;   //实裁数 
                    var orderInfo = responseData.resultList;
                    if(!Ext.isEmpty(orderInfo)){
                        for(var idx in orderInfo){
                            var beanInfo = orderInfo[idx];
                            if(facNameArr.indexOf(beanInfo.name)<0)facNameArr.push(beanInfo.name);
                            totalProductNum += Ext.isEmpty(beanInfo.product_num)?0:parseInt(beanInfo.product_num);
                            totalSewNum += Ext.isEmpty(beanInfo.sew_num)?0:parseInt(beanInfo.sew_num);
                        }
                    }
                    // 优先使用已经存在的基础数据，基础数据会在重新加载数据后重置
                    var changeData = {
                       fac_name : reportBaseInfo.fac_name || facNameArr.join(','),
                       product_num : reportBaseInfo.product_num || totalProductNum,
                       sr_num : reportBaseInfo.sr_num || (totalSewNum=='0'?'0':parseFloat(((totalSewNum-totalProductNum)/totalSewNum*100).toFixed(4))),
                       sew_num : reportBaseInfo.sew_num || totalSewNum
                    }
                    changeData.cur_sr_num = changeData.sew_num - totalProductNum;  // 当前损耗数
                    
                  //调用界面的监听
                  changeData4viewListener(changeData);
                }
              },
              failure : function(response){},
              params : {order_id : orders}
            })
        }
        
        /**
         * 根据序号加载完单报告
         */
        function requestReport(ord_report_no2){
            if(Ext.isEmpty(ord_report_no2)){
                Ext.Msg.alert('提示','完单报告号不能为空')
                return;
            }
            //保存完单号
            ord_report_no = ord_report_no2;
            //请求数据
            Ext.Ajax.request({
              url : './orderReport.ered?reqCode=queryOrderReport',
              success : loadOrderReport4success,
              failure : loadOrderReport4failure,
              params : {ord_report_no : ord_report_no}
            })
        }
        /**
         * 加载完单报告的回调函数-成功
         * @param {} response
         */
        function loadOrderReport4success(response){
            var orderReport = Ext.util.JSON.decode(response.responseText);
            if(orderReport.success){  // 成功请求数据下解析数据
                
               parseLoadData(orderReport);
               
               var orders = [];
               for(var idx in reportOrdInfo){
                orders.push(reportOrdInfo[idx].order_id);
               }
               requestOrderInfoList(orders.join(','));  //数据解析完毕后 加载订单的额外信息
               // 处理责任工厂显示
               //TODO
                var resultDutyName = {};
                for(var name in reportDutyFacShow){
                    var rdfs = reportDutyFacShow[name];
                    if(Ext.isEmpty(rdfs) || rdfs.length==0){
                        continue;
                    }
                    resultDutyName[name] = rdfs.join(',');
                }
                changeData4viewListener(resultDutyName);
               // 处理责任数量
               changeData4viewListener(reportDutyNum);
               changeData4viewListener(reportBaseInfo);
               changeData4viewListener(reportNumInfo);
               changeData4viewListener(reportShowRemarkInfo);
               changeData4viewListener(reportSureporInfo);
               changeSureOpr4viewListener('sewSure',sewSure);
               changeSureOpr4viewListener('washSure',washSure);
               changeSureOpr4viewListener('packageSure',packageSure);
               changeSureOpr4viewListener('qcSure',qcSure);
               changeSureOpr4viewListener('mgSure',qcSure);
               changeSureOpr4viewListener('mySure',qcSure);
               changeSureOpr4viewListener('ckSure',qcSure);
               changeSureOpr4viewListener('jsSure',qcSure);
            }else {
                Ext.Msg.alert('提示',orderReport.msg);    //后台操作不成功
            }
        }
        /**
         * 加载完单报告的回调函数-失败
         * @param {} response
         */
        function loadOrderReport4failure(response){
            Ext.Msg.alert('提示','后台加载数据失败');
        }
        /**
         * 解析加载的数据
         */
        function parseLoadData(orderReport){
                //获取后台传输的数据
                var baseinfo = orderReport.baseinfo;
                var numinfo = orderReport.numinfo;
                var orderinfo = orderReport.orderinfo;
                var remark = orderReport.remark;
                var sureinfo = orderReport.sureinfo;
                var ord_report_no2 = orderReport.ord_report_no;
                
                var dutyfac = orderReport.dutyfac;  //  数据格式：{ p : []}
                var dutyfacname = orderReport.dutyfacname;  //  数据格式：{ p : []}
                var dutynum = orderReport.dutynum;  //  数据格式：{ p : []}
                
                // 处理责任工厂，需要提取工厂编号
                reportDutyFac = {};
                for(var pro in dutyfac){
                    var arrBean = dutyfac[pro];
                    if(Ext.isEmpty(arrBean) || arrBean.length == 0){
                        continue;
                    }
                    var tempArr = [];
                    for(var idx=0;idx<arrBean.length;idx++){
                        tempArr.push(arrBean[idx].data);
                    }
                    reportDutyFac[pro] = tempArr;
                }
                // 处理责任工厂名称
                reportDutyFacShow = {};
                for(var pro in dutyfacname){
                    var arrBean = dutyfacname[pro];
                    if(Ext.isEmpty(arrBean) || arrBean.length == 0){
                        continue;
                    }
                    var tempArr = [];
                    for(var idx=0;idx<arrBean.length;idx++){
                        tempArr.push(arrBean[idx].data);
                    }
                    reportDutyFacShow[pro] = tempArr;
                }
                
                // 处理责任数量,取第一个数字，只有一个结果
                reportDutyNum = {};
                for(var pro in dutynum){
                    var arrBean = dutynum[pro];
                    if(Ext.isEmpty(arrBean) || arrBean.length==0){
                        continue;
                    }
                    reportDutyNum[pro] = arrBean[0].data;
                }
                
                ord_report_no = ord_report_no2;
                // 将数据解析，处理
                //~基础信息
                reportBaseInfo = baseinfo;
                //~数量信息
                reportNumInfo = numinfo; 
                //~PO号信息
                if(!Ext.isEmpty(orderinfo)){
                    var orderinfolength = orderinfo.length;
                    for(var idx=0;idx<orderinfolength;idx++){
                        var orderinfobean = orderinfo[idx];
                        var addOrderBean ={
                           order_id : orderinfobean.order_id,
                           style_no : orderinfobean.style_no,
                           cust_name : orderinfobean.cust_name,
                           ins_num : orderinfobean.ins_num,
                           ord_num : orderinfobean.ord_num
                        }
                        reportOrdInfo.push(addOrderBean);
                    }
                }
                //备注信息
                for(var key in remark){  //遍历所有备注的类型
                    var value = remark[key];
                    var valueLength = value.length;
                    for(var idx=0;idx<valueLength;idx++){   //遍历一个类型的所有备注
                        var remarkbean = value[idx];
                        if(remarkbean.opr_id == loginid){  // 区分备注是否是登录人
                            //如果登录人没有此备注，则新增，如果已经有备注，则添加备注信息
                            var remarkValue = reportLogRemarkInfo[key];
                            reportLogRemarkInfo[key] = Ext.isEmpty(remarkValue)?remarkbean[key]:remarkValue+","+remarkbean[key]
                        }else {
                            //如果非登录人没有此备注，则新增，如果已经有备注，则添加备注信息
                            var remarkValue = reportRemarkInfo[key];
                            reportRemarkInfo[key] = Ext.isEmpty(remarkValue)?remarkbean[key]:remarkValue+","+remarkbean[key]
                        }
                    }
                }
                //~ 将处理后的备注加工为显示的备注信息
                for(var key in reportRemarkInfo){
                    reportShowRemarkInfo[key+'_read'] = reportRemarkInfo[key];
                }
                for(var key in reportLogRemarkInfo){
                    reportShowRemarkInfo[key+'_write'] = reportLogRemarkInfo[key];
                }
                
                //确认人
                var logSureOpr = [];
                for(var key in sureinfo){
                    var sureArray = sureinfo[key];
                    var sureArraySize = sureArray.length;
                    var showSureinfo = '';
                    for(var idx=0;idx<sureArraySize;idx++){
                        var surebean = sureArray[idx];
                        surebean.id = surebean.opr_id;
                        surebean.name = surebean.opr_name;
                        showSureinfo += ','+surebean.opr_name;
                        if(surebean.opr_id==loginid){
                            logSureOpr.push(key);
                        }
                    }
                    reportSureporInfo[key] = showSureinfo;
                }
                reportSurePor = sureinfo;
                sewSure = logSureOpr.indexOf('sewSure')>=0? true : false;
                washSure = logSureOpr.indexOf('washSure')>=0? true : false;
                packageSure = logSureOpr.indexOf('packageSure')>=0? true : false;
                qcSure = logSureOpr.indexOf('qcSure')>=0? true : false;
                mgSure = logSureOpr.indexOf('mgSure')>=0? true : false;
                mySure = logSureOpr.indexOf('mySure')>=0? true : false;
                ckSure = logSureOpr.indexOf('ckSure')>=0? true : false;
                jsSure = logSureOpr.indexOf('jsSure')>=0? true : false;
                
        }
        
        /**
         * 保存完单报告
         */
        function saveReport(baseData,numinfoData,remarkData){
            if(Ext.isEmpty(reportOrdInfo)){   // 如果没有po信息，返回
                Ext.Msg.alert('提示','没有PO信息不能保存');
                return false;
            }
            //提取备注信息
            var remark = {
                  package_remark : remarkData.package_remark_write,
                  qcdept_remark : remarkData.qcdept_remark_write,
                  sewfac_remark : remarkData.sewfac_remark_write,
                  washfac_remark : remarkData.washfac_remark_write,
                  mg_remark : remarkData.mg_remark_write,
                  my_remark : remarkData.my_remark_write,
                  ck_remark : remarkData.ck_remark_write,
                  js_remark : remarkData.js_remark_write
            }
            
            
            // 提取责任数量信息
            var dutyNum = {
                sewfac_num : remarkData.sewfac_num,
                qcdept_num : remarkData.qcdept_num,
                package_num : remarkData.package_num,
                washfac_num : remarkData.washfac_num,
                mg_num : remarkData.mg_num,
                my_num : remarkData.my_num,
                ck_num : remarkData.ck_num,
                js_num : remarkData.js_num
            };
            
            //备注人信息
            var sureopr = {
                qcSure : qcSure ? '1' : '',  // 添加确认信息后返回
                sewSure : sewSure ? '1' : '',
                packageSure : packageSure ? '1' : '',
                washSure : washSure ? '1' : '',
                mgSure : mgSure ? '1' : '',
                mySure : mySure ? '1' : '',
                ckSure : ckSure ? '1' : '',
                jsSure : jsSure ? '1' : ''
            }
            
            // 将责任工厂涉及的数组转化为字符串
            var resultDuty = {};
            for(var name in reportDutyFac){
                var rdb = reportDutyFac[name];
                // 为假(无数据，或者数组长度为0)不处理，为真处理
                if(Ext.isEmpty(rdb) || rdb.length==0){
                    continue;
                }
                resultDuty[name] = rdb.join(',');
            }
            
            // 将责任工厂名字涉及的数组转化为字符串
            var resultDutyName = {};
            for(var name in reportDutyFacShow){
                var rdfs = reportDutyFacShow[name];
                if(Ext.isEmpty(rdfs) || rdfs.length==0){
                    continue;
                }
                resultDutyName[name] = rdfs.join(',');
            }
            
            
            //将获取结果数据组装成参数
            var resultParams = {
                loginid : loginid,
                loginname : loginname,
                ordreportno : ord_report_no,
                remark : JSON.stringify(remark),
                sureopr : JSON.stringify(sureopr),
                numinfo : JSON.stringify(numinfoData),
                orderinfo : JSON.stringify(reportOrdInfo),
                baseinfo : JSON.stringify(baseData),
                factoryinfo : JSON.stringify(reportFacInfo),
                dutyfac : JSON.stringify(resultDuty),
                dutyfacname : JSON.stringify(resultDutyName),
                dutynum : JSON.stringify(dutyNum)
                
            }
           saveReportData4AJAX(resultParams,saveReportData4success,saveReportData4failure);
        }
        
        /**
         * 将现有MODE初始化
         */
        function initReportFormData(){ // 初始化MODE的数据 界面数据清空的操作有界面的监听器处理
            ord_report_no = ''; 
            reportOrdInfo = []; // 完单报告基本信息中的客户，PO，款号等信息 ，record包含name和id,后台只保存PO号
            reportFacInfo = [];   //完单报告基本信息-->工厂信息
            
            reportBaseInfo = {};  // 完单报告基本信息 -->显示信息
            reportNumInfo = {};   // 完单报告数量信息 -->显示信息
            
            reportRemarkInfo = {};   // 除登录人备注信息
            reportLogRemarkInfo = {}; //登录人的备注信息
            reportShowRemarkInfo = {};    //备注信息：所有的备注信息-->显示信息
            
            var reportDutyFac = {}; // 指定责任工厂(数量指定工厂)->保存 每一个属性都是一个数组
            var reportDutyFacShow = {}; //指定责任工厂->显示  每一个属性都是一个数组
            var reportDutyNum = {}; // 指定责任数量
            
            reportSurePor = {};   //确认人信息   分类：确认人数组 
            reportSureporInfo = {}; //显示信息
            sewSure = false;   // 确认人是否已确认，默认为未确认-->登录人的确认信息
            washSure = false;
            packageSure = false;
            qcSure = false;
            
            initOrderReportView(); // 清空数据后后调用界面监听函数
        }
        
        /**
         * 网络保存完单报告
         */
        function saveReportData4AJAX(params,successFun,failureFun){
            Ext.Ajax.request({
              url:'./orderReport.ered?reqCode=addOrderReport4web',
              success : successFun,
              failure : failureFun,
              params : params
            })
        }
        /**
         * 后台成功返回的回调函数
         */
        function saveReportData4success(response){
            var result = Ext.util.JSON.decode(response.responseText);
            if(result.success){   // 后台标记成功
                Ext.Msg.alert('提示',result.msg);
                initReportFormData();    //清空mode的数据
                action4successSave();    // 回调界面保存后的函数
                reloadStore4saveReport();
            }else {   // 后台标记失败
                Ext.Msg.alert('提示',result.msg);
            }
        }
        /**
         * 发生异常的回调函数
         */
        function saveReportData4failure(response){
            Ext.Msg.alert('提示','完单报告没有保存成功');
        }
        /**
         * 确认人-->取消
         */
        function cancelSure(suretype){
            //设置确认人状态
            switch(suretype){
                case 'sewSure': sewSure = false;break;
                case 'washSure': washSure = false;break;
                case 'packageSure': packageSure = false;break;
                case 'qcSure': qcSure = false;break;
                case 'qcSure': qcSure = false;break;
                case 'mgSure': mgSure = false;break;
                case 'mySure': mySure = false;break;
                case 'ckSure': ckSure = false;break;
                case 'jsSure': jsSure = false;break;
            }
            //设置确认人的信息
            var surepor = reportSurePor[suretype];
            var length = surepor.length;
            var newsurepor = [];
            var sureOprInfoView = '';
            for(var idx=0;idx<length;idx++){
                var surebean = surepor[idx];
                if(surebean.id != loginid){   //确认人不是本人
                    newsurepor.push(surebean);
                    sureOprInfoView += ","+surebean.name;
                }
            }
            //更新确认人信息
            if(newsurepor.length<=0){
                delete reportSurePor[suretype];
            }else {
               reportSurePor[suretype] = newsurepor;
            }
            //更新显示信息
            
            reportSureporInfo[suretype] = sureOprInfoView;
            changeSureOpr4viewListener(suretype,false);
            changeData4viewListener(reportSureporInfo);    // 更新确认人显示信息
        }
        /**
         * 确认人-->确认
         */
        function sureInfo(suretype){
            switch(suretype){
                case 'sewSure': sewSure = true;break;
                case 'washSure': washSure = true;break;
                case 'packageSure': packageSure = true;break;
                case 'qcSure': qcSure = true;break;
                case 'mgSure': mgSure = true;break;
                case 'mySure': mySure = true;break;
                case 'ckSure': ckSure = true;break;
                case 'jsSure': jsSure = true;break;
            }
            //设置确认人的信息
            var surepor = reportSurePor[suretype];
            if(surepor==null){
                surepor = [];
            }
            var surebean = {};
            surebean.id = loginid;
            surebean.name = loginname;
            
            surepor.push(surebean); // 添加确认人信息
            reportSurePor[suretype] = surepor;
            //更新显示信息
            var sureOprInfoView = '';
            var oprLength = surepor.length;
            for(var idx=0;idx<oprLength;idx++){
                sureOprInfoView += ","+surepor[idx].name;
            }
            reportSureporInfo[suretype] = sureOprInfoView;
            
            //调用界面监听函数
            changeSureOpr4viewListener(suretype,true);
            changeData4viewListener(reportSureporInfo);    // 更新确认人显示信息
        }
        
        //~~去掉所有的对外提供的方法   采用观察者模式 ,并且主动传递数据

        /**
         * mode构造函数
         */
        function Construct(){
            this.cancelSure = cancelSure;
            this.sureInfo = sureInfo;
            this.setReportOrdInfo = setReportOrdInfo;
            this.setReportFacInfo = setReportFacInfo;
            this.requestReport = requestReport;
            this.saveReport = saveReport;
            this.cancelSure = cancelSure;
            this.sureInfo  = sureInfo;
            this.initReportFormData = initReportFormData;
            this.setDutyFac = setDutyFac;
            this.getDutyFac = getDutyFac;
            this.getDutyFacShow = getDutyFacShow;
        }
        return new Construct();
    }
    //~MODE　   END
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    //仿照eredg4的clearFormPanel取消reset
    function clearFormPanel4empty(form) {
        //只对表单中的一些类型进行清除
        var typeArray = ['textfield', 'combo', 'datefield', 'textarea',
            'numberfield', 'htmleditor', 'timefield', 'checkboxgroup'];
        for (var i = 0; i < typeArray.length; i++) {
            var typeName = typeArray[i];
            var itemArray = form.findByType(typeName);
            for (var j = 0; j < itemArray.length; j++) {
                var element = itemArray[j];
                element.setValue('');
            }
        }
    }
    /**
     * 显示前几位信息
     */
    function subString4length(text,length){
        if(Ext.isEmpty(text)){
            return '';
        }
        if(text.length>length){    // 长度超出预定长，截取余下的用省略号替代
            return text.substr(0,length)+'...';
        }
        return text
    }
    
    
    
    /**
     * ViewPort
     */
    var viewport = new Ext.Viewport({
       layout:'border',
       items :[{
                    region : 'center',
                    layout : 'fit',
                    items : [ordReportPanel]
                }]
    })
    
    queryOrderResportList();   //首次查询
});