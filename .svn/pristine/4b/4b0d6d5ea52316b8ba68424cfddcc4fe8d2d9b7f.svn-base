/************************************************
 * 创建日期: 2015-07-18
 * 创建作者：xtj
 * 功能：salesfocus报表
 * 最后修改时间：
 * 修改记录：
 *************************************************/
 Ext.onReady(function(){
 	var brandList={};
 	var old_params = {};  
 	var remark_flag=false;
 	var new_store=new Ext.data.Store({});
 	//饼图数据
 	var dataAmount=[];
	var dataFobPrice=[];
 	/**
     * 颜色的定义
     */
    var colors = [ '#EEEEEE','#AA4643', '#BBBBBB', '#4572A7', '#CCCCCC', '#DDDDDD',
            '#AAAAAA', '#89A54E', '#80699B', '#225522',
            '#333333', '#3D96AE', '#446644', '#555555', '#3B843D', '#667766',
            '#777777', '#92A8CD', '#889988', '#999999', '#A47D7C', 
             '#B5CA92', '#612255', '#324355'];
 	// 构造ColumnModel    
 	var sm = new Ext.grid.CheckboxSelectionModel({ checkOnly: true });    
    var cm = new Ext.ux.grid.LockingColumnModel([
    		sm,{
    			header:'shipmentWeek',
    			dataIndex:'shipmentWeek',
    			locked : true,
    			width:200
    		}
        ]);
    
    var yearPerCom = new Ext.form.ComboBox({
		id:'yearPeriod',
        fieldLabel:'年份',
        store:new Ext.data.ArrayStore({
            fields:['value','text'],
            data:[['','全部'],['2015','2015'],['2016','2016'],['2017','2017'],['2018','2018']]
        }),
        mode: 'local',
        hideTrigger: false,
        triggerAction: 'all',
        valueField: 'value',
        displayField: 'text',
        allowBlank: true,
        editable: false,
        width:100,
        value :''
	});
    //总表store
    var store= new Ext.data.Store({});
    
    //品牌汇总表store
    var brandStore=new Ext.data.Store({
    	proxy : new Ext.data.HttpProxy({
    		url:'./salesFocus.ered?reqCode=getSalesFocusBrandReport'
    	}),
    	reader: new Ext.data.JsonReader({
    	},['brand','amount','fob_price','pecent','amount_per','fob_price_per'])
    	});
    //store加载完毕后解析成为pie图数据，并重绘pie图 
//    brandStore.on('load',function(records){
//    	
//    	for(var i=0;i<records.getCount();i++){
//    		dataAmount.push([records.getAt(i).get("brand"),Number(records.getAt(i).get("amount_per"))])
//    		dataFobPrice.push([records.getAt(i).get("brand"),Number(records.getAt(i).get("fob_price_per"))])
//    	}
//    	infoPieChart.series[0].data=dataFobPrice;
//    	highChart = $('#piePanel').highcharts(infoPieChart).highcharts();
//    	highChart.redraw();
//    });
    //大组汇总表store
    var teamStore= new Ext.data.Store({
    	proxy : new Ext.data.HttpProxy({
    		url:'./salesFocus.ered?reqCode=getSalesFocusTeamReport'
    	}),
    	reader: new Ext.data.JsonReader({
    	},['team','amount','amount_per','fob_price','fob_price_per'])
    	});
    //负责人汇总表store
    var leaderStore=new Ext.data.Store({
    	proxy : new Ext.data.HttpProxy({
    		url:'./salesFocus.ered?reqCode=getSalesFocusLeaderReport'
    	}),
    	reader: new Ext.data.JsonReader({
    	},['leader','amount','amount_per','fob_price','fob_price_per'])
    	});
   	//产地汇总表store
    var locationStore=new Ext.data.Store({
    	proxy : new Ext.data.HttpProxy({
    		url:'./salesFocus.ered?reqCode=getSalesFocusLocationReport'
    	}),
    	reader: new Ext.data.JsonReader({
    	},['location','amount','amount_per','fob_price','fob_price_per'])
    	});
    

    yearPerCom.addListener('select',function(combo,record,opts) {  
	    		var yearPer = this.getValue();
	    		brandStore.baseParams= {yearPeriod : yearPer};
	    		locationStore.baseParams= {yearPeriod : yearPer};
		        teamStore.baseParams= {yearPeriod : yearPer};
		        leaderStore.baseParams= {yearPeriod : yearPer};
		    	brandStore.load();
		        locationStore.load();
		        teamStore.load();
		        leaderStore.load();
		        sumGrid.getView().refresh();
    	   } ) ;
       
    
    //cm	
    var brandCm = new Ext.grid.ColumnModel([
    	new Ext.grid.RowNumberer(),
    	{
			header:'品牌',
			dataIndex:'brand',
			width:150
		},{
			header:'amount',
			dataIndex:'amount',
			width:100
		},{
			header:'%',
			dataIndex:'amount_per',
			width:50
		},{
			header:'fob_price',
			dataIndex:'fob_price',
			width:150,
			renderer:function(v, metaData, record, rowIndex, colIndex, store){
								if(!Ext.isEmpty(v)){
									return Ext.util.Format.usMoney(v);
								}else{
									return;
								}
							}
		},{
			header:'%',
			dataIndex:'fob_price_per',
			width:50
		}
    ]);
    var teamCm = new Ext.grid.ColumnModel([
    	new Ext.grid.RowNumberer(),
    	{
			header:'组别',
			dataIndex:'team',
			width:150
		},{
			header:'amount',
			dataIndex:'amount',
			width:100
		},{
			header:'%',
			dataIndex:'amount_per',
			width:50
		},{
			header:'fob_price',
			dataIndex:'fob_price',
			width:150,
			renderer:function(v, metaData, record, rowIndex, colIndex, store){
								if(!Ext.isEmpty(v)){
									return Ext.util.Format.usMoney(v);
								}else{
									return;
								}
							}
		},{
			header:'%',
			dataIndex:'fob_price_per',
			width:50
		}
    ]);
    var leaderCm = new Ext.grid.ColumnModel([
    	new Ext.grid.RowNumberer(),
    	{
			header:'负责人',
			dataIndex:'leader',
			width:150
		},{
			header:'amount',
			dataIndex:'amount',
			width:100
		},{
			header:'%',
			dataIndex:'amount_per',
			width:50
		},{
			header:'fob_price',
			dataIndex:'fob_price',
			width:150,
			renderer:function(v, metaData, record, rowIndex, colIndex, store){
								if(!Ext.isEmpty(v)){
									return Ext.util.Format.usMoney(v);
								}else{
									return;
								}
							}
		},{
			header:'%',
			dataIndex:'fob_price_per',
			width:50
		}
    ]);
    var locationCm = new Ext.grid.ColumnModel([
    	new Ext.grid.RowNumberer(),
    	{
			header:'产地',
			dataIndex:'location',
			width:150
		},{
			header:'amount',
			dataIndex:'amount',
			width:100
		},{
			header:'%',
			dataIndex:'amount_per',
			width:50
		},{
			header:'fob_price',
			dataIndex:'fob_price',
			width:150,
			renderer:function(v, metaData, record, rowIndex, colIndex, store){
								if(!Ext.isEmpty(v)){
									return Ext.util.Format.usMoney(v);
								}else{
									return;
								}
							}
		},{
			header:'%',
			dataIndex:'fob_price_per',
			width:50
		}
    ]);
    
    // 汇总报表窗口
    var sumGrid = new Ext.grid.EditorGridPanel({    
        sm: sm,
        id:'sumGrid',
        region : 'center',
        store: brandStore,   
        stripeRows : true,
        cm: brandCm,    
        width: 600,    
        height: 600,    
        title: '品牌汇总',    
        frame: true,    
        autoScroll : true,
		tbar: [{    
            text: "刷新",    
            iconCls : 'page_refreshIcon',
            handler: function() {   
              sumGrid.getStore().reload();
              sumGrid.getView().refresh();
            }  
			},'-',{    
	            text: "查看数量饼图",    
	            iconCls : 'checkIcon',
	            //hidden:'true',
	            handler: function() {   
	            	var pieType='amount_per';
	            	changePieChart(pieType);
	            }  
			},'-',{    
	            text: "查看金额饼图",    
	            iconCls : 'checkIcon',
	            //hidden:'true',
	            handler:function() {  
	            	var pieType='fob_price_per';
	            	changePieChart(pieType);
	            }
			}]
    });  
    
  //饼图对象
    var infoPieChart={
        chart: {
            type: 'pie'
        },
        title: {
            text: '汇总饼图'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                depth: 35,
                dataLabels: {
                    enabled: true,
                    format: '{point.name}'
                }
            }
        },exporting : {
            enabled : false
        },
        series: [{
            type: 'pie',
            name: '',
            data: [
                    ['Firefox',   45.0],
                    ['IE',       26.8],
                    ['Safari',    8.5],
                    ['Opera',     6.2],
                    ['Others',   0]
                ]
        }]
    };
    
    /**
     * 根据当前grid的参数生成饼图
     */
    var changePieChart = function( pieType) {   
    	var curStore=sumGrid.getStore();
    	var title=sumGrid.title;
    	var pieDate=[];
    	var tag='';
    	switch(title){
    	case '品牌汇总':
    		tag='brand';
    		break;
    	case '负责人汇总':
    		tag='leader';
    		break;
    	case '产地汇总':
    		tag='location';
    		break;
    	case '组别汇总':
    		tag='team';
    		break;
    	
    	}
    	for(var i = 0 ;i<curStore.getCount();i++){
    		pieDate.push([curStore.getAt(i).get(tag),Number(curStore.getAt(i).get(pieType))])
    		}
    	infoPieChart.series[0].data=pieDate;
    	highChart = $('#piePanel').highcharts(infoPieChart).highcharts();
    	highChart.redraw();
    }  
    
    
  
    
    var pieChart = new Ext.Panel({    
		id:"piePanel",
		layout : 'fit',
		border : true,
		labelAlign : "right",
		collapsible : true,
		labelWidth : 70,
		split : true,
		frame : true,
    });  
    // 饼图窗口
    var piePanel = new Ext.Panel({    
    	title : "百分比饼图",
		region : 'east',
		layout : 'fit',
		border : true,
		labelAlign : "right",
		collapsible : true,
		labelWidth : 70,
		width : 400,
		height: 600, 
		split : true,
		frame : true,
		items : [pieChart]
    });  
    
    
    
    var infoWindow = new Ext.Window({
                id : 'infoWindow',
                layout : "border",
                title : '汇总报表',
                width : 1000,
                height : 600,
                resizable : true,
                draggable : true,
                closeAction : 'hide',
                modal : true,
                collapsible : true,
                titleCollapse : true,
                maximizable : false,
                buttonAlign : 'right',
                border : false,
                constrain : true,
                animCollapse : true,
                animateTarget : Ext.getBody(),
                defaults : {
                    bodyStyle : 'padding-top:5'
                },
                items : [sumGrid,piePanel],
                tbar : ['年份：',yearPerCom, '-',{
	                	text : '品牌汇总',
	                    handler : function() {
	                    	sumGrid.setTitle('品牌汇总');
							sumGrid.reconfigure(brandStore,brandCm);
	                    }
                	},'-',{
	                	text : '负责人汇总',
	                    handler : function() {
	                    	sumGrid.setTitle('负责人汇总');
							sumGrid.reconfigure(leaderStore,leaderCm);
							sumGrid.getView().refresh();
	                    }
                	},'-',{
	                	text : '产地汇总',
	                    handler : function() {
	                    	sumGrid.setTitle('产地汇总');
							sumGrid.reconfigure(locationStore,locationCm);
							sumGrid.getView().refresh();
	                    }
                	},'-',{
	                	text : '组别汇总',
	                    handler : function() {
	                    	sumGrid.setTitle('组别汇总');
							sumGrid.reconfigure(teamStore,teamCm);
							sumGrid.getView().refresh();
	                    }
                	},'->',{
	                    text : '关闭',
	                    handler : function() {
							infoWindow.hide();
	                    }
                	},]
            });
    

    //----------------------------汇总表结束----------------------
    
    
    
    
    //汇总行
    var summary = new Ext.ux.grid.GridSummary();
    
    var form=new Ext.form.FormPanel({
    	labelAlign : 'right',
                height : 150,
                padding : '5,5,5,5',
                defaults : {
                    bodyStyle : 'padding-top:5'
                },
                items : [{
                            xtype : 'textfield',
                            lable : 'seq',
                            id : 'seq_no',
                            name : 'seq_no',
                            hidden:true,
                            hideLabel:true
                        },{
                            xtype : 'textfield',
                            fieldLabel : '数量',
                            id : 'amount',
                            width:200,
                            name : 'amount',
                        },new Ext.form.ComboBox({
                			id:'brandcom',
                	        fieldLabel:'品牌',
                	        width:200,
                	        store:new Ext.data.ArrayStore({
                	            fields:['value','text'],
                	            data:[['2015-Jan-1Week(12/28-01/03)','2015-Jan-1Week(12/28-01/03)'],
                	                  ['2015-Jan-2Week(01/04-01/10)','2015-Jan-2Week(01/04-01/10)'],
                	                  ['2017','2017'],['2018','2018']]
                	        }),
                	        mode: 'local',
                	        hideTrigger: false,
                	        triggerAction: 'all',
                	        valueField: 'value',
                	        displayField: 'text',
                	        allowBlank: true,
                	        editable: false,
                	        width:100,
                	        value :'Dockers'
                		}),new Ext.form.ComboBox({
                			id:'location',
                	        fieldLabel:'地区',
                	        width:200,
                	        store:new Ext.data.ArrayStore({
                	            fields:['value','text'],
                	            data:[['2015-Jan-1Week(12/28-01/03)','2015-Jan-1Week(12/28-01/03)'],
                	                  ['2015-Jan-2Week(01/04-01/10)','2015-Jan-2Week(01/04-01/10)'],
                	                  ['2017','2017'],['2018','2018']]
                	        }),
                	        mode: 'local',
                	        hideTrigger: false,
                	        triggerAction: 'all',
                	        valueField: 'value',
                	        displayField: 'text',
                	        allowBlank: true,
                	        editable: false,
                	        width:100,
                	        value :'GDM'
                		}),new Ext.form.ComboBox({
                			id:'yearCombo',
                	        fieldLabel:'时间',
                	        width:200,
                	        store:new Ext.data.ArrayStore({
                	            fields:['value','text'],
                	            data:[['2015-Jan-1Week(12/28-01/03)','2015-Jan-1Week(12/28-01/03)'],
                	                  ['2015-Jan-2Week(01/04-01/10)','2015-Jan-2Week(01/04-01/10)'],
                	                  ['2017','2017'],['2018','2018']]
                	        }),
                	        mode: 'local',
                	        hideTrigger: false,
                	        triggerAction: 'all',
                	        valueField: 'value',
                	        displayField: 'text',
                	        allowBlank: true,
                	        editable: false,
                	        width:100,
                	        value :'2015-Jan-1Week(12/28-01/03)'
                		})]
    });
 
    
    
    /**
     * 订单状态下拉框
     */
    var monthsLovCombo = new Ext.ux.form.LovCombo({
        name:'monthsLovCombo',
        id:'monthsLovCombo',
        hiddenName:'months',
        fieldLabel:'订单状态',
        store:new Ext.data.ArrayStore({
            fields:['value','text'],
            data:[['1','一月'],['2','二月'],['3','三月'],['4','四月'],['5','五月'],
                  ['6','六月'],['7','七月'],['8','八月'],['9','九月'],['10','十月'],
                  ['11','十一月'],['12','十二月']]
        }),
        mode: 'local',
        hideTrigger: false,
        triggerAction: 'all',
        valueField: 'value',
        displayField: 'text',
        emptyText: '请选择...',
        allowBlank: true,
        editable: false,
        value:'',
        width:150
    });
 
     // 构造可编辑的grid    
    var grid = new Ext.grid.EditorGridPanel({    
        sm: sm,    
        store: store,   
        cm: cm,    
        plugins : [summary], 
        width: 600,    
        height: 300,    
        title: 'SaleFocusReport',    
        frame: true,    
        clicksToEdit: 2,
        stripeRows : true,
        autoScroll : true,
//        viewConfig : {
//        	getRowClass:function(record,rowIndex,p,ds){
//        	    var cls = '';
//        	    if (record.data.week.indexOf('total')>-1){
//        	     cls = 'cls-success';
//        	    }
//        	    return cls;
//        	   }},
        view : new Ext.ux.grid.LockingGridView(),
		tbar: [{    
            text: "显示/隐藏备注信息",    
            iconCls : 'tbar_synchronizeIcon',
            handler: function() {   
	              var cm=grid.getColumnModel();
	              for(var i=0;i<cm.config.length;i++){
	              	if(cm.getColumnAt(i).header=="备注信息"){
	              		cm.setHidden(i,remark_flag);
	              	}
	              }
	              remark_flag=!remark_flag;
	              this.text=remark_flag?"隐藏备注信息":"显示备注信息";
            	}  
			},{    
            text: "刷新",    
            iconCls : 'page_refreshIcon',
            handler: function() {   
              querySalesFocus();
            	}  
			},{    
            text: "查询汇总报表",    
            iconCls : 'page_findIcon',
            handler: function() {   
              infoWindow.show();
              brandStore.load();
              locationStore.load();
              teamStore.load();
              leaderStore.load();
            	}
			},'年份：',new Ext.form.ComboBox({
    			id:'yearCombo',
    	        fieldLabel:'年份',
    	        store:new Ext.data.ArrayStore({
    	            fields:['value','text'],
    	            data:[['2015','2015'],['2016','2016'],['2017','2017'],['2018','2018']]
    	        }),
    	        mode: 'local',
    	        hideTrigger: false,
    	        triggerAction: 'all',
    	        valueField: 'value',
    	        displayField: 'text',
    	        allowBlank: true,
    	        editable: false,
    	        width:100,
    	        value :'2015'
    		}),monthsLovCombo,{    
            	xtype:"label",
            	id:"saveStatue",
                text: ""
    		} ]
    });  
    
    /**
	 * 汇总表格
	 */
	function fnSumInfo() {
		//取出所有需要汇总的key
		var cm = grid.getColumnModel();
		var keys=[];
		//sum控件对象
		var sumObject = {};
		var store=grid.getStore();
		sumObject.week='当前合计';
		sumObject.no='';
		//第三列开始是记录相关
		for(var i = 3; i < cm.config.length; i++){
			var key=cm.getColumnAt(i).dataIndex;
			if(key.indexOf('remark')==-1){
				keys.push(key);
				//初始化对象属性，用于计算合计值
				sumObject[key]=0;
			}
		}

    	for (var i = 0; i < store.getCount(); i++) {
    		var record = store.getAt(i);
    		//遍历累加
    		for(var j=0;j<keys.length;j++){
    			//排除汇总行
    			if(record.get(cm.getColumnAt(2).dataIndex).indexOf('total')==-1){
    				sumObject[keys[j]] = parseFloat(sumObject[keys[j]]) + parseFloat(record.get(keys[j])==''?0:Number(record.get(keys[j])));
    				sumObject[keys[j]] = sumObject[keys[j]].toFixed(2);
    			}
    		}
    	}
    	summary.setSumValue(sumObject); 
    	summary.toggleSummary(true);
	}
	
	
	
     Ext.getCmp("yearCombo").on('select',function(combo,record,idx){
    	querySalesFocus();
     })
	 Ext.getCmp("monthsLovCombo").on('blur',function(combo,record,idx){
		querySalesFocus();
	 })
    
    //编辑完成后的提交
    grid.on("afteredit", afterEdit, grid); //EditorGridPanel的afteredit事件监听   
	function afterEdit(obj){   
	    var r = obj.record;//获取被修改的行   
	    var l = obj.field; //获取被修改的列   
	    var info=l.split('-');
	    var value = r.get(l);
	    if(r.get('week').indexOf("total")>-1){
	    	Ext.Msg.alert('提示', "不能修改汇总列"); 
	    	grid.getStore().reload();
            grid.getView().refresh();
	    	return;
	    }
	    if (Ext.isEmpty(value)) {
			value=0;
		}
	    //处理品牌中的特殊字符
	    var brandinfo=info[0].indexOf('&')>-1?info[0].replace('&','%26'):info[0];
	    Ext.Ajax.request({   
	       url: 'salesFocus.ered?reqCode=updateSalesFocus',   
//	       params:{
//	    	   brand:info[0],
//	    	   location:info[1],
//	    	   leader:info[2],
//	    	   info[3]:value,
//	    	   week:r.get('week')
//	       },
	       params: "brand=" +brandinfo  +
	    		   "&location=" + info[1] + '&leader=' + info[2]+ '&week=' + r.get('week')+
	       			"&"+info[3]+"="+value,              
	       success:function(response,options){                   
	         var result = Ext.util.JSON.decode(response.responseText);                      
	         if (result.success){                        
	            Ext.getCmp("saveStatue").setText("您填写的数据："+info[0]+info[3]+":"+value+"保存成功！");                          
	            grid.getStore().reload();
	            grid.getView().refresh();
	         }                        
	         else{         
	        	 Ext.Msg.alert('提示', "保存失败！"+result.msg);
	            grid.getStore().reload();
	            grid.getView().refresh();
	            }                       
	                  },              
	       failure : function(response,options) {                      
	         Ext.Msg.alert('提示', "连接错误！");                     
	         var respText = Ext.util.JSON.decode(response.responseText);                     
	         Ext.Msg.alert('错误', respText.error);                       
	                   }   
    		});   
	}
    /**
     * 布局
     */
    var viewport = new Ext.Viewport({
                layout : 'border',
                items : [{
                            region : 'center',
                            layout : 'fit',
                            items : [grid]
                        }]
            });
            
     // 查询
    function querySalesFocus(params){
        //保存现有的查询条件
        if(Ext.isEmpty(params)){
            params = {};   //如果为空 则构建一个空对象
            Ext.apply(params,old_params); //不是首次查询的条件，赋予旧参数
        }else {
            old_params = {}; //清空旧数据
            Ext.apply(old_params,params); //保存第一次查询的条件
        }
        params.year=Ext.getCmp("yearCombo").getValue();
        params.months=Ext.getCmp("monthsLovCombo").getValue();
        init(params);
    }
    //重置grid相关设置
   	var init = function(params){
    	Ext.Ajax.request({
				url : './salesFocus.ered?reqCode=getSaleFoucusBrandInfoByOpertater',
				success : function(response) {
					brandList = Ext.util.JSON.decode(response.responseText);
					//给store付属性
					//store reader
					var brandreader=[];
					//cm
					var column = [];
//					//group rows
//					var rows = [{ header: '', colspan: 1, align: 'center' },//header表示父表头标题，colspan表示包含子列数目  
//					            { header: '', colspan: 1, align: 'center' },  
//					            { header: '', colspan: 1, align: 'center' }];
					column.push(new Ext.grid.RowNumberer({locked : true}));
					column.push({
		    			dataIndex:'no',
		    			width:2,
		    			sortable: true,
		    			locked : true,
		    			hidden:true
		    		});
					column.push({
		    			header:'shipmentWeek',
		    			dataIndex:'week',
		    			locked : true,
		    			width:200,
		    		});
					
					
					for (var i = 0; i < brandList.length; i++) {
						//重置reader
						var brand=brandList[i];
						//生成复合表头
//						rows.push({ header: brand.brand+"-"+brand.location+"-"+brand.leader, colspan: 2, align: 'center' })
//						rows.push({ header:'', colspan: 1, align: 'center' })
						//brandreader=brandreader+"'"+brand.get('brand')+"_"+'amount'+"','"+brand.get('brand')+"_"+'price'+"',";
						brandreader.push('week');
						brandreader.push('no');
						brandreader.push(brand.brand+"-"+brand.location+"-"+brand.leader+"-"+'amount');
						brandreader.push(brand.brand+"-"+brand.location+"-"+brand.leader+'-fob_price');
						brandreader.push(brand.brand+"-"+brand.location+"-"+brand.leader+'-remark');
						//重置cm
	    				column.push({
	    					header : brand.brand+" "+brand.location+" "+brand.leader+"\n"+'Order Qty(pcs)',
							dataIndex : brand.brand+"-"+brand.location+"-"+brand.leader+'-amount',
							align : 'center',
							width : 150,
							css : 'background: '+colors[i]+';font-weight:bold;border-right:1px solid white;',
							renderer:function(v, metaData, record, rowIndex, colIndex, store){
								if(!Ext.isEmpty(v)){
									var text=v;
									if(record.data.week.indexOf("total")>-1){
										var text = '<span style="font-size:15px;font-style:italic;" >' + text
										+ '</span>';
									}
									return text;
								}
							}
	    				});
	    				column.push({
	    					header : brand.brand+" "+brand.location+" "+brand.leader+"\n"+'DDU or FOB',
							dataIndex : brand.brand+"-"+brand.location+"-"+brand.leader+'-fob_price',
							align : 'center',
							width : 150,
							renderer:function(v, metaData, record, rowIndex, colIndex, store){
								if(!Ext.isEmpty(v)){
									var text=Ext.util.Format.usMoney(v);
									if(record.data.week.indexOf("total")>-1){
										var text = '<span style="font-size:15px;font-style:italic;" >' + text
										+ '</span>';
									}
									return text;
								}
							},
							css : 'background: '+colors[i]+';font-weight:bold;'
							
	    				});
	    				column.push({
	    					hidden:true,
	    					header : '备注信息',
							dataIndex : brand.brand+"-"+brand.location+"-"+brand.leader+'-remark',
							align : 'center',
							width : 180,
							css : 'background: '+colors[i]+';font-weight:bold;'
	    				});
					}
					//brandreader=brandreader.Substring(0,brandreader.Length-1)+']';
					store= new Ext.data.Store({
				    	proxy: new Ext.data.HttpProxy({
				    		url:'./salesFocus.ered?reqCode=querySalesFocusReport&year='+params.year+'&months='+params.months 
				    	}),
				    	reader: new Ext.data.JsonReader({
							totalProperty : 'TOTALCOUNT', // 记录总数
							root : 'ROOT' // Json中的列表数据根节点
						}, brandreader),
						sortInfo: {  
					        field: 'no',  
					        direction: "ASC"  
					    }
    				})
					store.load({ 
						callback: function(records, options, success){ 
							fnSumInfo(); // 加载完成，汇总数据
							} 
						}); 
    				grid.getColumnModel().setConfig(column);
    				grid.reconfigure(store,grid.getColumnModel());
    				//grid.plugins.push( new Ext.ux.grid.ColumnHeaderGroup({rows:rows}));
    				grid.getView().refresh();
    				
				},
				failure : function(response) {
					var resultArray = Ext.util.JSON
							.decode(response.responseText);
					Ext.Msg.alert('提示', resultArray.msg);
				}
			});
    }
    
    
   querySalesFocus();
 })