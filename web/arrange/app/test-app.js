/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
/*
 * Calendar sample code originally written by Brian Moeskau (brian@ext-calendar.com)
 * See additional calendar examples at http://ext-calendar.com
 */
App = function() {
    return {
        init : function() {
            
            Ext.BLANK_IMAGE_URL = 'http://extjs.cachefly.net/ext-3.1.0/resources/images/default/s.gif';

            // This is an example calendar store that enables the events to have
            // different colors based on CalendarId. This is not a fully-implmented
            // multi-calendar implementation, which is beyond the scope of this sample app
            // 下拉框的Store数据
            this.calendarStore = new Ext.data.JsonStore({
                storeId: 'calendarStore',
                root: 'calendars',
                idProperty: 'id',
                data: calendarList, // defined in calendar-list.js
                proxy: new Ext.data.MemoryProxy(),
                autoLoad: true,
                fields: [
                    {name:'CalendarId', mapping: 'id', type: 'int'},
                    {name:'Title', mapping: 'title', type: 'string'}
                ],
                sortInfo: {
                    field: 'CalendarId',
                    direction: 'ASC'
                }
            });

            // A sample event store that loads static JSON from a local file. Obviously a real
            // implementation would likely be loading remote data via an HttpProxy, but the
            // underlying store functionality is the same.  Note that if you would like to 
            // provide custom data mappings for events, see EventRecord.js.
            // 数据显示Store
		    this.eventStore = new Ext.data.JsonStore({
                url : './arrange.ered?reqCode=queryGrpArrangePlan',
                autoLoad:false,
		        id: 'eventStore',
		        fields: Ext.calendar.EventRecord.prototype.fields.getRange(),
		        sortInfo: {
		            field: 'StartDate',
		            direction: 'ASC'
		        }
		    });
            window.eventStore = this.eventStore;
            
            /**重新加载日历store*/
            this.eventStore.reloadStore = function(){
                
                var grpCombo = Ext.getCmp('fac_name');
                var teamCombo = Ext.getCmp('team_name');
                var grp_id = grpCombo.grpId;
                var team_id = teamCombo.teamId;
                // 重新加载数据
                var params = eventStore.baseParams;
                params.grp_id = grp_id;
                params.team_no = team_id;
                eventStore.baseParams = params;
                eventStore.load({
                    params : params
                })
            }
            //===== 工厂树组件
            // 工厂树点击处理函数
            this.grpTreeClickFn = function(node,e){
                // 判断点击的是工厂 // 16位长度的是工厂 13位的是地区 10位长度是公司
                if(node.id.length>=16){
                    // 这里把超过16位(包括16位)的node作为工厂
                    var grpName = node.text;
                    var grpId = node.id;
                    
                    // 增加一级父节点的信息
                    var pn = node.parentNode;
                    if(pn){
                        grpName = pn.text+'/'+grpName;
                    }
                    
                    // 保存点击的node信息
                    var facCombo = Ext.getCmp('fac_name');
                    facCombo.setValue(grpName);
                    facCombo.grpId = grpId;
                    // 隐藏加载树
                    facCombo.collapse();
                    // 处理处理班组加载数据的URL,添加工厂ID
                    var teamsTree = Ext.getCmp('teams_tree');
                    teamsTree.loader.dataUrl = teamsTree.loader.dataUrl.split("&")[0]+"&grp_id="+ grpId;
                    
                    // 清空班组下拉框的数据
                    var teamCombo = Ext.getCmp('team_name');
                    teamCombo.setValue('');
                    teamCombo.teamId = '';
                    
                    eventStore.reloadStore();
                }else{
                    console.log('please click grp...');
                }
            }
            // 工厂树
            this.grpsTree = new Ext.tree.TreePanel({
                loader : new Ext.tree.TreeLoader({
                            dataUrl : './arrange.ered?reqCode=queryGrpsInfo4Arrange'
                        }),
                root : new Ext.tree.AsyncTreeNode({
                            text : '根部门',
                            id : '001',
                            expanded : true
                        }),
                autoScroll : true,
                animate : false,
                useArrows : false,
                border : false,
                rootVisible : false,
                listeners : {
                    'click' : this.grpTreeClickFn
                }
            });
            this.grpsCombo = new Ext.form.ComboBox({
                name : 'fac_name',
                id : 'fac_name',
                fieldLabel : '工厂',
                grpsTree : this.grpsTree,
                editable : false,
                store : new Ext.data.ArrayStore({
                            fields : [],
                            data : [[]]
                        }),
                value : ' ',
                anchor : '95%',
                mode : 'local',
                triggerAction : 'all',
                maxHeight : 390,
                listWidth : 200,
                // 下拉框的显示模板,belognGrpsTreeDiv作为显示下拉树的容器
                tpl : "<tpl for='.'><div style='height:390px'><div id='grpsTreeDiv'></div></div></tpl>",
                onSelect : Ext.emptyFn
            });
            // 监听下拉框的下拉展开事件
            this.grpsCombo.on('expand', function() {
                // 将UI树挂到treeDiv容器
                this.grpsTree.render('grpsTreeDiv');
                this.grpsTree.root.expand(); // 只是第一次下拉会加载数据
            });
            
            //======= 班组树组件
            
            // 班组树点击事件处理函数
            this.teamsTreeClickFn = function(node,e){
                // 叶子节点是班组
                if(node.isLeaf()){
                    var name = node.text;
                    var id = node.id;
                    
                    // 增加一级父节点的信息
                    var pn = node.parentNode;
                    if(pn){
                        name = pn.text+'/'+name;
                    }
                    
                    
                    // 保存点击的node信息
                    var teamCombo = Ext.getCmp('team_name');
                    teamCombo.setValue(name);
                    teamCombo.teamId = id;
                   
                    teamCombo.collapse();
                    
                    eventStore.reloadStore();
                    
                }else{
                    console.log('please click team...');
                }
            }
            
            // 班组树
            this.teamsTree = new Ext.tree.TreePanel({
                id : 'teams_tree',
                loader : new Ext.tree.TreeLoader({
                            dataUrl : './arrange.ered?reqCode=queryTeams4GrpId'
                        }),
                root : new Ext.tree.AsyncTreeNode({
                            text : '根部门',
                            id : '001',
                            expanded : true
                        }),
                autoScroll : true,
                animate : false,
                useArrows : false,
                border : false,
                rootVisible : false,
                listeners : {
                    'click' : this.teamsTreeClickFn
                }
            });
            this.teamsCombo = new Ext.form.ComboBox({
                name : 'team_name',
                id : 'team_name',
                fieldLabel : '组',
                teamsTree : this.teamsTree,
                editable : false,
                store : new Ext.data.ArrayStore({
                            fields : [],
                            data : [[]]
                        }),
                value : ' ',
                anchor : '95%',
                mode : 'local',
                triggerAction : 'all',
                maxHeight : 390,
                listWidth : 200,
                // 下拉框的显示模板,belognGrpsTreeDiv作为显示下拉树的容器
                tpl : "<tpl for='.'><div style='height:390px'><div id='teamsTreeDiv'></div></div></tpl>",
                onSelect : Ext.emptyFn
            });
            // 监听下拉框的下拉展开事件
            this.teamsCombo.on('expand', function() {
                // 将UI树挂到treeDiv容器
                this.teamsTree.render('teamsTreeDiv');
                this.teamsTree.root.expand(); // 只是第一次下拉会加载数据
                if(this.teamsTree.root.isExpanded()){
                    this.teamsTree.root.reload();
                }
            });
            
            // 在全局对象中注册组件信息，方便其闭包函数调用
            this.buttonsForm = new Ext.form.FormPanel({
                id: 'grpUserForm',
                hidden : true,
                name : '',
                items :[{
                    xtype:'button',
                    text:'添加工厂操作员',
                    width:'100%',
                    height:'35px',
                    handler : function(){
                        Ext.Msg.prompt('工号','输入添加的工号',function(btn,text){
                            if(btn=='ok'){
                                Ext.Ajax.request({
                                    url : './arrange.ered?reqCode=insertGrpUser',
                                    success : function(response) { // 回调函数有1个参数
                                        var rt = Ext.util.JSON.decode(response.responseText);
                                        if(rt.success){
                                            console.log('添加工号成功!');
                                            Ext.Msg.alert('提示','成功添加工号:'+text);
                                        }else {
                                            console.log('添加工号失败');
                                            Ext.Msg.alert('提示','添加工号:'+text+" !失败")
                                        }
                                    },
                                    failure : function(response) {
                                        Ext.Msg.alert('提示','不能添加');
                                    },
                                    params : {
                                        'account' : text
                                    }
                                });
                            }
                        })
                    }
                },{
                    xtype:'button',
                    text:'删除工厂操作员',
                    width:'100%',
                    height:'35px',
                    handler : function(){
                        Ext.Msg.prompt('工号','输入删除的工号',function(btn,text){
                            if(btn=='ok'){
                                Ext.Ajax.request({
                                    url : './arrange.ered?reqCode=deleteGrpUser',
                                    success : function(response) { // 回调函数有1个参数
                                        var rt = Ext.util.JSON.decode(response.responseText);
                                        if(rt.success){
                                            console.log('删除工号成功!');
                                            Ext.Msg.alert('提示','删除工号:'+text);
                                        }else {
                                            console.log('删除工号失败!');
                                            Ext.Msg.alert('提示','删除工号:'+text+' !失败');
                                        }
                                    },
                                    failure : function(response) {
                                        Ext.Msg.alert('提示','不能删除操作');
                                    },
                                    params : {
                                        'account' : text
                                    }
                                });
                            }
                        })
                    }
                }]
            });
            // This is the app UI layout code.  All of the calendar views are subcomponents of
            // CalendarPanel, but the app title bar and sidebar/navigation calendar are separate
            // pieces that are composed in app-specific layout code since they could be ommitted
            // or placed elsewhere within the application.
            // 界面显示UI布局。
            new Ext.Viewport({
                layout: 'border',
                renderTo: 'calendar-ct',
                items: [{
                    id: 'app-header',
                    region: 'north',
                    height: 35,
                    border: false,
                    contentEl: 'app-header-content'
                },{
                    id: 'app-center',
                    title: '...', // will be updated to view date range
                    region: 'center',
                    layout: 'border',
                    items: [{
                        id:'app-west',
                        region: 'west',
                        width: 176,
                        border: false,
                        items: [{
                            xtype: 'datepicker',
                            id: 'app-nav-picker',
                            cls: 'ext-cal-nav-picker',
                            listeners: {
                                'select': {
                                    fn: function(dp, dt){
                                        App.calendarPanel.setStartDate(dt);
                                    },
                                    scope: this
                                }
                            }
                        },{
                            layout:'form',
                            id : 'grp_form',
                            width:'100%',
                            labelWidth:30,
                            bodyStyle:'padding-top:3px',
                            labelAlign:'right',
                            items:[this.grpsCombo,this.teamsCombo,{
                                id:'deleteGrpButton',
                                hidden:true,
                                xtype :'button',
                                text:'删除此工厂',
                                width:'100%',
                                height:35,
                                handler:function(){
                                    var grpCombo = Ext.getCmp('fac_name');
                                    var grp_id = grpCombo.grpId;
                                    if(!grp_id){
                                        // 如果grp_id为空那么返回
                                        console.log('删除工厂：获取工厂编号为空!');
                                        return false;
                                    }
                                    var val = grp_id;
                                    // 重新加载
                                    Ext.Ajax.request({
                                        url : './arrange.ered?reqCode=deleteMyGrpInfo',
                                        success : function(response) { // 回调函数有1个参数
                                            var rt = Ext.util.JSON.decode(response.responseText);
                                            if(rt.success){
                                                // 判断是否取消
                                                // 取消grp_combo的重新下载
//                                                grp_combo.store.reload();
                                            }
                                        },
                                        failure : function() {
                                            Ext.Msg.alert('提示','操作失败');
                                        },
                                        params : {
                                            'grp_id':val
                                        }
                                    });
                                }
                            },{
                    id:'addGrpButton',  
                    hidden:true,
                    xtype:'button',
                    text:'添加工厂',
                    width:'100%',
                    height:'35px',
                    handler:function(){
                        var queryW = new QueryGrpAndDeptDetail();
                        queryW.init({hideDept:true});
                        queryW.showWindow();
                        queryW.addListeners4query('24',setGrpAndDept,true);
                        /**
                         * 设置责任工厂
                         */
                        function setGrpAndDept(param){
                            var resArr = [];
                            for(var idx=0;idx<param.length;idx++){
                                var resObj = {};
                                resObj.grp_name = param[idx].text;
                                resObj.grp_id = param[idx].id;
                                resArr.push(resObj);
                            }
                            var resStr = JSON.stringify(resArr);
                            Ext.Ajax.request({
                                    url : './arrange.ered?reqCode=insertMyGrpInfo',
                                    success : function(response) { // 回调函数有1个参数
                                        var rt = Ext.util.JSON.decode(response.responseText);
                                        if(rt.success){
                                            //delete zhouww 2015-06-30 采用combo 不需要重新加载grp_combo的store了
//                                            grp_combo.store.reload();
                                        }
                                    },
                                    failure : function() {
                                        Ext.Msg.alert('提示','操作失败');
                                    },
                                    params : {
                                        'grps' : resStr
                                    }
                                });
                        }

                    }
                }]
                        },this.buttonsForm,{
                            layout : 'form',
                            width : '100%',
                            items : [{
                                style: 'padding-top:5px',
                                html:'<div class=" ext-color-1-ad  ext-cal-evt ext-cal-evr ">工厂预期产量</div>'
                                +'<div class=" ext-color-3-ad  ext-cal-evt ext-cal-evr ">业务员排单</div>'
                                +'<div class=" ext-color-6-ad  ext-cal-evt ext-cal-evr ">订单预排期</div>'
                                +'<div class=" ext-color-7-ad  ext-cal-evt ext-cal-evr ">生产数量</div>'
                            }]
                        }]
                    },{
                        xtype: 'calendarpanel',
                        // 配置数据源  数据采用jsonStore(eventList)
                        // 日历上显示的数据
                        eventStore: this.eventStore,
                        // 配置修改界面中的下拉框数据
                        calendarStore: this.calendarStore,

                        border: false,
                        id:'app-calendar',
                        region: 'center',
                        activeItem: 2, // month view
                        
                        // CalendarPanel supports view-specific configs that are passed through to the 
                        // underlying views to make configuration possible without explicitly having to 
                        // create those views at this level:
                        monthViewCfg: {
                            showHeader: true,
                            showWeekLinks: true,
                            showWeekNumbers: true
                        },

                        // Some optional CalendarPanel configs to experiment with:
                        showDayView: false,
                        showWeekView: false,
//                        showMonthView: false,
                        //showNavBar: false,
                        showTodayText: false,
                        showTime: false,
//                        title: 'My Calendar', // the header of the calendar, could be a subtitle for the app

                        // Once this component inits it will set a reference to itself as an application
                        // member property for easy reference in other functions within App.
                        initComponent: function() {
                            App.calendarPanel = this;
                            this.constructor.prototype.initComponent.apply(this, arguments);
                        },
                        listeners: {
                            'eventclick': {
                                fn: function(vw, rec, el){
                                    // 显示title信息
                                    this.showMsg(rec.get('Title'));
                                    
                                    // 普通业务员无权修改1，2操作类型的数据  
                                    var cid = rec.get('CalendarId');
                                    // 管理员不能够操作任何的数据
                                    if(userType=='9'){
                                        return false;
                                    }
                                    if(+isGrpUser ===0 && (+cid ===1 || +cid === 2)){
                                        return false;
                                    }
                                    // 对calendarid进行限制
                                    // 如果cid是1 或者是2 只能进行选择1
                                    if(+isGrpUser===1 && (+cid ===1 || +cid === 2)) {
                                        var cs = this.calendarStore;
                                        cs.removeAll();
                                        var record = new Ext.data.Record();
                                        record.set('CalendarId','1');
                                        record.set('Title','设置工厂排数');
                                        cs.add([record]);
                                    }else if(+isGrpUser===1 && (+cid===3 || +cid===8)){
                                        // 是工厂操作员并且选择对业务员排单进行操作
                                        // 可以是'设置当天实际生产数量'和'工厂派单'
                                        var cs = this.calendarStore
                                        cs.removeAll();
                                        var record2 = new Ext.data.Record();
                                        record2.set('CalendarId','4');
                                        record2.set('Title','设置当天实际生产数量');
                                        cs.add([record2]);
                                        
                                    }else if(+isGrpUser===1 && +cid===5){
                                        // 是工厂操作员并且选择对业务员排单进行操作
                                        // 可以是'设置当天实际生产数量'和'工厂派单'
                                        var cs = this.calendarStore
                                        cs.removeAll();
//                                        var record = new Ext.data.Record();
//                                        record.set('CalendarId','5');
//                                        record.set('Title','工厂排单');
                                        var record2 = new Ext.data.Record();
                                        record2.set('CalendarId','4');
                                        record2.set('Title','设置当天实际生产数量');
                                        cs.add([record2]);
                                        
                                    }else if(+isGrpUser===0 && cid==3){
                                        var cs = this.calendarStore;
                                        cs.removeAll();
                                        var record = new Ext.data.Record();
                                        record.set('CalendarId','3');
                                        record.set('Title','业务员排单');
                                        cs.add([record]);
                                    }else if(+isGrpUser===0 && cid==8){
                                        var cs = this.calendarStore;
                                        cs.removeAll();
                                        var record = new Ext.data.Record();
                                        record.set('CalendarId','8');
                                        record.set('Title','业务员排单(无订单)');
                                        cs.add([record]);
                                    }else {
                                        // 其余情况不处理
                                        return false;
                                    }
                                    
                                    this.showEditWindow(rec, el);
                                    this.clearMsg();
                                },
                                scope: this
                            },
                            'eventover': function(vw, rec, el){
//                                console.log('eventover');
                                //console.log('Entered evt rec='+rec.data.Title+', view='+ vw.id +', el='+el.id);
                            },
                            'eventout': function(vw, rec, el){
//                                console.log('eventout');
                                //console.log('Leaving evt rec='+rec.data.Title+', view='+ vw.id +', el='+el.id);
                            },
                            'eventadd': {
                                fn: function(cp, rec){
                                    console.log('eventadd');
                                    this.showMsg('内容 '+ rec.data.Title +' 被新增');
                                },
                                scope: this
                            },
                            'eventupdate': {
                                fn: function(cp, rec){
                                    this.showMsg('Event '+ rec.data.Title +' was updated');
                                },
                                scope: this
                            },
                            'eventdelete': {
                                fn: function(cp, rec){
                                    console.log('eventdelete');
                                    this.showMsg('Event '+ rec.data.Title +' was deleted');
                                },
                                scope: this
                            },
                            'eventcancel': {
                                fn: function(cp, rec){
                                    console.log('eventcancelE');
                                },
                                scope: this
                            },
                            'viewchange': {
                                fn: function(p, vw, dateInfo){
                                    if(this.editWin){
                                        this.editWin.hide();
                                    };
                                    if(dateInfo !== null){
                                        // will be null when switching to the event edit form so ignore
                                        Ext.getCmp('app-nav-picker').setValue(dateInfo.activeDate);
                                        this.updateTitle(dateInfo.viewStart, dateInfo.viewEnd);
                                    }
                                },
                                scope: this
                            },
                            'dayclick': {
                                fn: function(vw, dt, ad, el){
                                    console.log('dayclick');
                                    // 处理新增情况下的store数据
                                    // 如果是工厂用户，显示‘工厂设置排数'
                                    // 如果是业务员 ，显示’业务员排数‘;
                                    var cs = this.calendarStore
                                    if(isGrpUser && isGrpUser=== 1){    //工厂操作员
                                        cs.removeAll();
                                        var record = new Ext.data.Record();
                                        record.set('CalendarId','1');
                                        record.set('Title','设置工厂排数');
                                        cs.add([record]);
                                    }else { // 普通业务员
                                        cs.removeAll();
                                        var record = new Ext.data.Record();
                                        record.set('CalendarId','3');
                                        record.set('Title','业务员排数');
                                        var rec2 = new Ext.data.Record();
                                        rec2.set('CalendarId','8');
                                        rec2.set('Title','业务员排数(无订单)');
                                        
                                        cs.add([record,rec2]);
                                    }
                                    
                                    // 判断工厂和班组不能为空
                                    var grp_id = Ext.getCmp('fac_name').grpId;
                                    var team_no = Ext.getCmp('team_name').teamId;
                                    if(Ext.isEmpty(grp_id) || Ext.isEmpty(team_no)){
                                        Ext.Msg.alert('提示','需要选择工厂和班组!(左侧选择)');
                                        return false;
                                    }
                                    
                                    // 选取过去日期，增加提示
                                    var selD = dt.format('Y-m-d');
                                    var curD = new Date().format('Y-m-d');
                                    if(curD > selD){
                                        this.showMsg('<span style="color:red">不能选择过去的日期: '+selD+'</span>');
                                        return false;
                                    }
                                    
                                    this.showEditWindow({
                                        StartDate: dt,
                                        IsAllDay: ad
                                    }, el);
                                    this.clearMsg();
                                },
                                scope: this
                            },
                            'rangeselect': {
                                fn: function(win, dates, onComplete){
                                    var cs = this.calendarStore
                                    if(isGrpUser && isGrpUser=== 1){    //工厂操作员
                                        cs.removeAll();
                                        var record = new Ext.data.Record();
                                        record.set('CalendarId','1');
                                        record.set('Title','设置工厂排数');
                                        cs.add([record]);
                                    }else { // 普通业务员
                                        return false;   // 普通业务员不能够选择范围
                                    }
                                    
                                    // 如果没有选择工厂/班组  提示使用者这两者不能为空
                                    var grp_id = Ext.getCmp('fac_name').grpId;
                                    var team_no = Ext.getCmp('team_name').teamId;
                                    if(Ext.isEmpty(grp_id) || Ext.isEmpty(team_no)){
                                        Ext.Msg.alert('提示','需要选择工厂和班组!(左侧选择)');
                                        return false;
                                    }
                                    
                                    this.showEditWindow(dates);
                                    this.editWin.on('hide', onComplete, this, {single:true});
                                    this.clearMsg();
                                },
                                scope: this
                            },
                            'eventmove': {
                                fn: function(vw, rec){
                                    console.log('eventmove');
                                    
                                    rec.commit();
                                    var time = rec.data.IsAllDay ? '' : ' \\a\\t g:i a';
                                    this.showMsg('Event '+ rec.data.Title +' was moved to '+rec.data.StartDate.format('F jS'+time));
                                },
                                scope: this
                            },
                            'eventresize': {
                                fn: function(vw, rec){
                                    console.log('eventresize');
                                    rec.commit();
                                    this.showMsg('Event '+ rec.data.Title +' was updated');
                                },
                                scope: this
                            },
                            'eventdelete': {
                                fn: function(win, rec){
                                    console.log('eventdelete2');
                                    this.eventStore.remove(rec);
                                    this.showMsg('Event '+ rec.data.Title +' was deleted');
                                },
                                scope: this
                            },
                            'initdrag': {
                                fn: function(vw){
                                    console.log('initdrag');
                                    if(this.editWin && this.editWin.isVisible()){
                                        this.editWin.hide();
                                    }
                                },
                                scope: this
                            }
                        }
                    }]
                }]
            });
        },
        
        // The edit popup window is not part of the CalendarPanel itself -- it is a separate component.
        // This makes it very easy to swap it out with a different type of window or custom view, or omit
        // it altogether. Because of this, it's up to the application code to tie the pieces together.
        // Note that this function is called from various event handlers in the CalendarPanel above.
		showEditWindow : function(rec, animateTarget){
	        if(!this.editWin){
	            this.editWin = new Ext.calendar.EventEditWindow({
                    calendarStore: this.calendarStore,
					listeners: {
                        'show' :function(){
                            var calEnt = Ext.getCmp('calendar');
                            var cId = calEnt.getValue();
                            var valideRecord = calEnt.store.getRange();
                            var isValide = false;
                            for(var idx=0;idx<valideRecord.length;idx++){
                                if(valideRecord[idx].get('CalendarId')== cId){
                                    // 找到存在的record则结束
                                    isValide = true;
                                    break;
                                }
                            }
                            if(!cId || !isValide){ // 如果cId是false 那么处理下面的操作
                               var rec0 =  calEnt.store.getAt(0);
                               calEnt.setValue(rec0.get('CalendarId'));
                            }
                            calEnt.fireEvent('select',calEnt);
                        },
						'eventadd': {
							fn: function(win, rec){
                                console.log('排期系统：新增内容');
                                that = this;
                                // 处理新增的情况 1)工厂排数 2）业务员排数  其他的情况下都是修改处理
                                var cid = rec.get('CalendarId');
                                var startD = rec.data.StartDate.format('Y-m-d');
                                var endD = rec.data.EndDate.format('Y-m-d');
                                rec.data.SimpleStartDate = startD;
                                rec.data.SimpleEndDate = endD;
                                var styleNo = rec.data.styleno;
                                
                                var jsonStr = JSON.stringify(rec.data);
                                var grp_id = Ext.getCmp('fac_name').grpId;
                                var team_no = Ext.getCmp('team_name').teamId;
                                
                                
                                // 数量不能为空， 工厂不能为空，数据不能为空
                                // 注释不能为空  ，日期不能比现在日期小
                                // 如果是业务员排单 ，那么订单号也不能为空
                                if(Ext.isEmpty(grp_id)){
                                    Ext.Msg.alert('提示','在添加数量前先选择工厂 !')
                                    return false;
                                }else if(Ext.isEmpty(team_no)){
                                    // 需要选择班组
                                    Ext.Msg.alert('提示','需要选择班组!');
                                    return false;
                                }else if(Ext.isEmpty(rec.data.amount)){
                                    Ext.Msg.alert('提示','需要填写数量!');
                                    return false;
                                }else if(Ext.isEmpty(rec.data.Title)){
                                    Ext.Msg.alert('提示','需要填写"显示注释"!');
                                    return false;
                                }else if(startD < new Date().format('Y-m-d')){
                                    Ext.Msg.alert('提示','不能够选择过去的日期!');
                                    return false;
                                }
                                switch(+cid){
                                    case 1 : // 工厂排数新增
                                        Ext.Ajax.request({
                                            url : './arrange.ered?reqCode=insertGrpArrangePlan',
                                            success : function(response) { // 回调函数有1个参数
                                                var rt = Ext.util.JSON.decode(response.responseText);
                                                if(rt.success){
                                                    win.hide();
                                                    rec.data.IsNew = false;
                                                    // reload store
                                                    that.eventStore.reload();
                                                    that.showMsg('新增内容 '+ rec.data.Title);
                                                }
                                            },
                                            failure : function() {
                                                Ext.msg.alert('提示','操作失败');
                                            },
                                            params : {
                                                'grpArrange' : jsonStr,
                                                 'grp_id' : grp_id,
                                                 'team_no' : team_no
                                            }
                                        });
                                        return true;
                                        break;
                                    case 3 :    // 业务员排数新增
                                        // 判断calendarid=3的情况下的特有条件
                                        if(Ext.isEmpty(rec.data.order)){
                                            Ext.Msg.alert('提示','需要填写订单号PO#');
                                            return false;
                                        }
                                        // 判断指令数
                                        var insNum = Ext.getCmp('insnum').getValue();
                                        if(rec.data.amount > insNum){
                                            Ext.Msg.alert('提示','填写的数量不能比指令数大');
                                            return false;
                                        }
                                    case 8 :
                                        
                                        // 判断订单号不能为空
                                       if(Ext.isEmpty(styleNo)){
                                            // 需要填写款号
                                            Ext.Msg.alert('提示','需要填写款号信息!');
                                            return false;
                                        }
                                        var mDate = rec.data.materieldate.format('Y-m-d'); // 面辅料进仓时间
                                        rec.data.SimpleMaterielDate = mDate;  
                                        // 判断面辅料进仓时间
                                        if(mDate > startD){
                                            Ext.Msg.alert('提示','排单日期不能比面辅料进仓日期早!');
                                            return false;
                                        }
                                        
                                        rec.data.SimpleEndDate = startD;    // 结束日期设置当天  不修改EndDate的值
                                        jsonStr = JSON.stringify(rec.data);
                                        Ext.Ajax.request({
                                            url : './arrange.ered?reqCode=insertArrangePlan',
                                            success : function(response) { // 回调函数有1个参数
                                                var rt = Ext.util.JSON.decode(response.responseText);
                                                if(rt.success){
                                                    win.hide();
                                                    rec.data.IsNew = false;
                                                    that.eventStore.reload();
                                                    that.showMsg('新增内容 '+ rec.data.Title);
                                                }else {
                                                    var msg = rt.msg
                                                    var showMsgI = '';
                                                    if(msg){
                                                        showMsgI = msg;
                                                    }else{
                                                        showMsgI = msg;
                                                    }
                                                    that.showMsg(showMsgI);
                                                    Ext.Msg.alert('提示',showMsgI);
                                                }
                                            },
                                            failure : function() {
                                                Ext.Msg.alert('提示','操作失败');
                                            },
                                            params : {
                                                'grpArrange' : jsonStr,
                                                'grp_id' : grp_id,
                                                'team_no' : team_no
                                            }
                                        });
                                        return true;
                                        break;
                                }
							},
							scope: this
						},
						'eventupdate': {
							fn: function(win, rec){
                                that = this;
                                // 处理新增的情况 1)工厂排数 2）业务员排数  其他的情况下都是修改处理
                                var cid = rec.get('CalendarId');
                                var startD = rec.data.StartDate.format('Y-m-d');
                                var endD = rec.data.EndDate.format('Y-m-d');
                                rec.data.SimpleStartDate = startD;
                                rec.data.SimpleEndDate = endD;
                                
                                var jsonStr = JSON.stringify(rec.data);
                                // 获取工厂的编号和班组编号
                                var grp_id = Ext.getCmp('fac_name').grpId;
                                var team_no = Ext.getCmp('team_name').teamId;
                                
                                // 判断修改的数据的有效性
                                if(Ext.isEmpty(rec.data.amount)){
                                    Ext.Msg.alert('提示','需要填写数量!');
                                    return false;
                                }else if(Ext.isEmpty(rec.data.Title)){
                                    Ext.Msg.alert('提示','需要填写"显示注释"!');
                                    return false;
                                }
                                switch(+cid){
                                    case 1 : // 工厂排数修改
                                        Ext.Ajax.request({
                                            url : './arrange.ered?reqCode=updateGrpArrangePlan',
                                            success : function(response) { // 回调函数有1个参数
                                                var rt = Ext.util.JSON.decode(response.responseText);
                                                if(rt.success){
                                                    win.hide();
                                                    rec.data.IsNew = false;
                                                    that.eventStore.reload();
                                                    that.showMsg('修改内容  '+ rec.data.Title );
                                                }else {
                                                    Ext.Msg.alert('提示','不能够修改不是自己的排单');
                                                }
                                            },
                                            failure : function() {
                                                Ext.Msg.alert('提示','操作失败');
                                            },
                                            params : {
                                                'grpArrange' : jsonStr,
                                                'grp_id' : grp_id,
                                                'team_no' : team_no
                                            }
                                        });
                                        return true;
                                        break;
                                    case 3 :    // 业务员排数修改
                                        var insNum = Ext.getCmp('insnum').getValue();
                                        if(insNum  && rec.data.amount > insNum){
                                            // 要有insNum数才做比较
                                            Ext.Msg.alert('提示','数量不能够比指令数多!');
                                            return false;
                                        }
                                    case 8 :
                                        // 业务员排数(无订单)修改
                                        var mDate = rec.data.materieldate.format('Y-m-d');
                                        if(mDate>startD){
                                            Ext.Msg.alert('提示','排单日期不能比面辅料进仓日期早!');
                                            return false;
                                        }
                                        rec.data.SimpleMaterielDate = mDate;
                                        rec.data.SimpleEndDate = startD;    // 修改结束日期设置开始日期
                                        jsonStr = JSON.stringify(rec.data);
                                        Ext.Ajax.request({
                                            url : './arrange.ered?reqCode=updateGrpArrangePlan',
                                            success : function(response) { // 回调函数有1个参数
                                                var rt = Ext.util.JSON.decode(response.responseText);
                                                if(rt.success){
                                                    win.hide();
                                                    rec.data.IsNew = false;
                                                    that.eventStore.reload();
                                                    that.showMsg('修改内容 '+ rec.data.Title);
                                                }else {
                                                    Ext.Msg.alert('提示','不能够修改不是自己的排单');
                                                }
                                            },
                                            failure : function() {
                                                Ext.Msg.alert('提示','操作失败');
                                            },
                                            params : {
                                                'grpArrange' : jsonStr,
                                                'grp_id' : grp_id,
                                                'team_no' : team_no
                                            }
                                        });
                                        return true;
                                        break;
                                    case 4:
                                        // 设置实际生产数量
                                        if(Ext.isEmpty(rec.data.realamount)){
                                            Ext.Msg.alert('提示','需要填写实际生产数量!');
                                            return false;
                                        }
                                        // 填写的日期不能够比今天大
                                        if(startD > new Date().format('Y-m-d')){
                                            Ext.Msg.alert('提示','日期不能比今天晚!');
                                            return false;
                                        }
                                        Ext.Ajax.request({
                                            url : './arrange.ered?reqCode=insertRealAmount',
                                            success : function(response) { // 回调函数有1个参数
                                                var rt = Ext.util.JSON.decode(response.responseText);
                                                if(rt.success){
                                                    win.hide();
                                                    rec.data.IsNew = false;
                                                    that.eventStore.reload();
                                                    that.showMsg('修改内容 '+ rec.data.Title);
                                                }
                                            },
                                            failure : function() {
                                                Ext.Msg.alert('提示','操作失败');
                                            },
                                            params : {
                                                'grpArrange' : jsonStr,
                                                'grp_id' : grp_id
                                            }
                                        });
                                        return true;
                                        break;
                                }
                                this.showMsg('Event '+ rec.data.Title +' was updated');
							},
							scope: this
						},
						'eventdelete': {
							fn: function(win, rec){
                                that = this;
                                // 处理新增的情况 1)工厂排数 2）业务员排数  其他的情况下都是修改处理
                                var cid = rec.get('CalendarId');
                                var startD = rec.data.StartDate.format('Y-m-d');
                                var endD = rec.data.EndDate.format('Y-m-d');
                                rec.data.SimpleStartDate = startD;
                                rec.data.SimpleEndDate = endD;
                                
                                var jsonStr = JSON.stringify(rec.data);
                                
                                switch(+cid){
                                    case 1 : // 工厂排数删除
                                        Ext.Ajax.request({
                                            url : './arrange.ered?reqCode=deleteGrpArrangePlan',
                                            success : function(response) { // 回调函数有1个参数
                                                var rt = Ext.util.JSON.decode(response.responseText);
                                                if(rt.success){
                                                    win.hide();
                                                    rec.data.IsNew = false;
                                                    that.eventStore.reload();
                                                    that.showMsg('删除内容 '+ rec.data.Title);
                                                }else {
                                                    Ext.Msg.alert('提示','不能删除不是自己的排单')
                                                }
                                            },
                                            failure : function() {
                                                Ext.Msg.alert('提示','操作失败');
                                            },
                                            params : {
                                                'grpArrange' : jsonStr
                                            }
                                        });
                                        return true;
                                        break;
                                    case 8 :    // calendarId =8 和3的操作是一样的
                                    case 3 :    // 业务员排数删除
                                    Ext.Ajax.request({
                                            url : './arrange.ered?reqCode=deleteGrpArrangePlan',
                                            success : function(response) { // 回调函数有1个参数
                                                var rt = Ext.util.JSON.decode(response.responseText);
                                                if(rt.success){
                                                    win.hide();
                                                    rec.data.IsNew = false;
                                                    that.eventStore.reload();
                                                    that.showMsg('删除内容 '+ rec.data.Title);
                                                }else {
                                                    Ext.Msg.alert('提示','不能删除不是自己的排单')
                                                }
                                            },
                                            failure : function() {
                                                Ext.Msg.alert('提示','操作失败');
                                            },
                                            params : {
                                                'grpArrange' : jsonStr
                                            }
                                        });
                                        return true;
                                        break;
                                }
                            
							},
							scope: this
						},
                        'editdetails': {
                            fn: function(win, rec){
                                console.log('editdetails');
                                win.hide();
                                App.calendarPanel.showEditForm(rec);
                            }
                        }
					}
                });
	        }
	        this.editWin.show(rec, animateTarget);
		},
        
        // The CalendarPanel itself supports the standard Panel title config, but that title
        // only spans the calendar views.  For a title that spans the entire width of the app
        // we added a title to the layout's outer center region that is app-specific. This code
        // updates that outer title based on the currently-selected view range anytime the view changes.
        updateTitle: function(startDt, endDt){
            var p = Ext.getCmp('app-center');
            
            if(startDt.clearTime().getTime() == endDt.clearTime().getTime()){
                p.setTitle(startDt.format('F j, Y'));
            }
            else if(startDt.getFullYear() == endDt.getFullYear()){
                if(startDt.getMonth() == endDt.getMonth()){
                    p.setTitle(startDt.format('F j') + ' - ' + endDt.format('j, Y'));
                }
                else{
                    p.setTitle(startDt.format('F j') + ' - ' + endDt.format('F j, Y'));
                }
            }
            else{
                p.setTitle(startDt.format('F j, Y') + ' - ' + endDt.format('F j, Y'));
            }
        },
        
        // This is an application-specific way to communicate CalendarPanel event messages back to the user.
        // This could be replaced with a function to do "toast" style messages, growl messages, etc. This will
        // vary based on application requirements, which is why it's not baked into the CalendarPanel.
        showMsg: function(msg){
            Ext.fly('app-msg').update(msg).removeClass('x-hidden');
        },
        
        clearMsg: function(){
            Ext.fly('app-msg').update('').addClass('x-hidden');
        }
    }
}();

// App.init:执行的函数
// App：函数执行的作用域
Ext.onReady(App.init, App);
