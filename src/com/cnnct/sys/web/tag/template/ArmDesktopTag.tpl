<html>
<head>
<title>${title}</title>
<meta http-equiv="keywords" content="东奥rfid系统">
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
<meta http-equiv="description" content="">
<meta http-equiv="pragma" content="no-cache">  
<meta http-equiv="cache-control" content="no-cache, must-revalidate">  
<meta http-equiv="expires" content="0">
<link rel="shortcut icon" href="${contextPath}/resource/image/${titleIcon}" />
<link rel="stylesheet" type="text/css"
	href="${contextPath}/resource/theme/${theme}/resources/css/ext-all.css" />
<link rel="stylesheet" type="text/css" href="${contextPath}/resource/desktop/css/desktop.css" />
<link rel="stylesheet" type="text/css" href="${contextPath}/resource/css/ext_icon.css" />
<link rel="stylesheet" type="text/css" href="${contextPath}/resource/css/eredg4.css" />
<link rel="stylesheet" type="text/css" href="${contextPath}/resource/css/ext_patch_firefox.css" />
<script type="text/javascript" src="${contextPath}/resource/extjs3.1/adapter/ext/ext-base.js"></script>
  #if(${extMode} == "debug")
<script type="text/javascript" src="${contextPath}/resource/extjs3.1/ext-all-debug.js"></script>
  #else
<script type="text/javascript" src="${contextPath}/resource/extjs3.1/ext-all.js"></script>
  #end
<script type="text/javascript" src="${contextPath}/resource/commonjs/eredg4.js"></script>
<script type="text/javascript" src="${contextPath}/resource/desktop/js/StartMenu.js"></script>
<script type="text/javascript" src="${contextPath}/resource/desktop/js/TaskBar.js"></script>
<script type="text/javascript" src="${contextPath}/resource/desktop/js/Desktop.js"></script>
<script type="text/javascript" src="${contextPath}/resource/desktop/js/App.js"></script>
<script type="text/javascript" src="${contextPath}/resource/desktop/js/Module.js"></script>
<script type="text/javascript" src="${contextPath}/resource/commonjs/ext-lang-zh_CN.js"></script>

<script type="text/javascript">
/* 全局参数表 */
#foreach($param in $paramList)var ${param.paramkey}='${param.paramvalue}';#end
/* 当前登录用户信息*/
    var userid = '${userInfo.getUserid()}';
    var username = '${userInfo.getUsername()}';
    var account = '${userInfo.getAccount()}';
    var deptid = '${userInfo.getDeptid()}';
    var theme = '${userInfo.getTheme()}';
    var explorer = '${userInfo.getExplorer()}';
/********************/
    var webContext = '${contextPath}';
    var ajaxErrCode = '${ajaxErrCode}';
    var micolor = 'color:${micolor};';
    var default_theme = '${theme}';
    var default_layout = '${layout}';

    Ext.QuickTips.init();
    Ext.form.Field.prototype.msgTarget = 'qtip';
    Ext.BLANK_IMAGE_URL = '${contextPath}/resource/image/ext/s.gif';

    var leafMenuList = Ext.decode('${menuListJson}');

/*******************/
Ext.Ajax.on('beforerequest', function(conn, opts) {
  Ext.Ajax.extraParams={'loginuserid':userid};
  });
</script>

<style type="text/css">
a.x-menu-item {
    cursor: pointer;
    display: block;
    line-height: 16px;
    outline-color: -moz-use-text-color;
    outline-style: none;
    outline-width: 0;
    padding: 3px 12px 3px 27px; /* 重写ext-all.css 解决IE显示问题 */
    position: relative;
    text-decoration: none;
    white-space: nowrap;
}

.x-menu-item-active {
    background-repeat: repeat-x;
    background-position: left bottom;
    border-style:solid;
    border-width: 1px 0;
    margin:0 0px; /* 重写ext-all.css 解决IE显示问题 */
	padding: 0;
}
</style>
<style type="text/css">
#foreach($menu in $menuList)
#window_${menu.menuid}-shortcut img {
	width: 48px;
	height: 48px;
	background-image: url(${contextPath}/resource/desktop/images/shortcut/${menu.shortcut});
	filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='${contextPath}/resource/desktop/images/shortcut/${menu.shortcut}',
		sizingMethod='scale' );
}
#end
html, body {
	background: url(${contextPath}/resource/desktop/wallpapers/${background}) no-repeat right top;
	}
</style>

</head>
<body scroll="no">
	<div id="previewDiv" class="x-hidden"  >
		<img src="${contextPath}/resource/image/theme/${theme}.jpg" />
	</div>
	
	<div id="layoutTreeDiv" class="x-hidden"  ></div>
	<div id="layout_previewDiv" class="x-hidden"  >
		<img src="${contextPath}/resource/image/theme/layout/${layout}.jpg" />
	</div>
	
	<div id="backgroundTreeDiv" class="x-hidden"  ></div>
	<div id="background_previewDiv" class="x-hidden"  >
		<img src="${contextPath}/resource/desktop/wallpapers/mini/${background}" />
	</div>
	
	<div id="x-desktop">
		<dl id="x-shortcuts">
		#foreach($menu in $menuList)
			<dt id="window_${menu.menuid}-shortcut">
				<a href="#"><img src="${contextPath}/resource/image/ext/s.gif" />
					<div class="system-font-size">${menu.menuname}</div>
                </a>
			</dt>
		#end
		</dl>
    </div>

	<div id="ux-taskbar">
		<div id="ux-taskbar-start"></div>
		<div id="ux-taskbuttons-panel"></div>
		<div class="x-clear"></div>
	</div>
</body>

<script type="text/javascript">
	MyDesktop = new Ext.app.App({
		init : function() {
			Ext.QuickTips.init();
		},
		getModules : function() {
			return [
			#set($size = $menuTreeList.size())
			#foreach($menu in $menuTreeList)
			  #if($velocityCount != $size)
                 new MyDesktop.Window_${menu.menuid}(),
              #else
                 new MyDesktop.Window_${menu.menuid}()
              #end
			 #end
			];
		},

		// config for the start menu
		getStartConfig : function() {
			return {
				title : '<span class=commoncss>${username}[${account}]</span>',
				iconCls : 'userIcon',
				toolItems : [{
					text : '布局方案',
					iconCls : 'layout_contentIcon',
					handler:function(){
					  layoutWindowInit();
					},
					scope : this
				}, '-', {
					text : '密码修改',
					iconCls : 'keyIcon',
					handler:function(){
					  updateUserInit();
					},
					scope : this
				}, '-', {
					text : '安全退出',
					tooltip:'安全退出',
					iconCls : 'deleteIcon',
					handler:function(){
					  logout();
					},
					scope : this
				} ]
			};
		}
	});

#foreach($menuTree in $menuTreeList)
	MyDesktop.Window_${menuTree.menuid} = Ext.extend(
        Ext.app.Module,
        {
            id : 'window_${menuTree.menuid}',
            init : function() {
                this.launcher = {
                    text : '${menuTree.menuname}',
                    iconCls : 'bogus',
                    windowId:'${menuTree.menuid}',
                    #if(${menuTree.leaf}==1)
                    handler : this.createWindow,
                    scope : this
                    #else
                    handler : function(){
                        return false;
                    },
                    scope : this,
                    menu:{
                    items:[
                    #foreach($subMenuItem in $menuTree.items)
                        #if(${subMenuItem.leaf}==1)
                        {
                            text : '${subMenuItem.menuname}',
                            iconCls:'bogus',
                            id : 'window_${subMenuItem.menuid}',
                            handler: this.createWindow,
                            windowId:'${subMenuItem.menuid}',
                            scope: this,
                            createWindow : function(src){
                                var desktop = this.scope.app.getDesktop();//这个是在桌面图标点击时的调用

                                var win = desktop.getWindow('window_${subMenuItem.menuid}');
                                if (!win) {
                                    win = desktop.createWindow({
                                    id : 'window_${subMenuItem.menuid}',
                                    layout : 'fit',
                                    title : '  ${subMenuItem.menuname}',
                                    //iconCls : 'applicationIcon',
                                    width : ${subMenuItem.width},
                                    height : ${subMenuItem.height},
                                    maximized :${subMenuItem.maxed},
                                    bodyStyle : 'background-color:#FFFFFF',
                                    //closeAction : 'close',
                                    //collapsible : true,
                                    pageY : document.body.clientHeight / 2 - ${subMenuItem.height} / 2,
                                    pageX : document.body.clientWidth / 2 - ${subMenuItem.width} / 2,
                                    animCollapse : true,
                                    animateTarget : Ext.getBody(),
                                    border : false,
                                    constrainHeader : true,
                                    constrain: true,
                                    html : '<iframe id="topMain" scrolling="${subMenuItem.scrollbar}" frameborder="0" style="width:100%;height:100%;" src="${subMenuItem.request}"></iframe>'
                                    });
                                }
                                win.show();
                            }
                        }
                        #else
                        {
                            text : '${subMenuItem.menuname}',
                            iconCls:'bogus',
                            id : 'window_${subMenuItem.menuid}',
                            handler: function(){
                               return false;
                            },
                            scope: this,
                            menu:{
                                items:[
                                 #foreach($subSubMenuItem in $subMenuItem.items)
                                 #set($size = $subMenuItem.items.size())
                                 {
                                     text : '${subSubMenuItem.menuname}',
                                     iconCls:'bogus',
                                     id : 'window_${subSubMenuItem.menuid}',
                                     handler: this.createWindow,
                                     scope: this,
                                     windowId:'${subSubMenuItem.menuid}',
                                     createWindow : function(src){

                                         var desktop = this.scope.app.getDesktop();//这个是在桌面图标点击时的调用

                                         var win = desktop.getWindow('window_${subSubMenuItem.menuid}');
                                         if (!win) {
                                             win = desktop.createWindow({
                                                 id : 'window_${subSubMenuItem.menuid}',
                                                 layout : 'fit',
                                                 title : '  ${subSubMenuItem.menuname}',
                                                 //iconCls : 'applicationIcon',
                                                 width : ${subSubMenuItem.width},
                                                 height : ${subSubMenuItem.height},
                                                 maximized :${subSubMenuItem.maxed},
                                                 bodyStyle : 'background-color:#FFFFFF',
                                                 //closeAction : 'close',
                                                 //collapsible : true,
                                                 pageY : document.body.clientHeight / 2 - ${subSubMenuItem.height} / 2,
                                                 pageX : document.body.clientWidth / 2 - ${subSubMenuItem.width} / 2,
                                                 animCollapse : true,
                                                 animateTarget : Ext.getBody(),
                                                 border : false,
                                                 constrainHeader : true,
                                                 constrain: true,
                                                 html : '<iframe id="topMain" scrolling="${subSubMenuItem.scrollbar}" frameborder="0" style="width:100%;height:100%;" src="${subSubMenuItem.request}"></iframe>'
                                             });
                                         }
                                         win.show();
                                     }
                                 }
                                 #if($velocityCount != $size)
                                 ,
                                 #end
                                 #end
                                 ]
                            }
                        }
                        #end
                        #set($size = $menuTree.items.size())
                        #if($velocityCount != $size)
                        ,
                        #end
                    #end
                    ]
                    }
                    #end
                }
            },
            createWindow : function(src){
                var desktop = this.app.getDesktop();
                var cur_menu = null;
                for(var i=0;i<leafMenuList.length;i++){
                    var menuInfo = leafMenuList[i];
                    if(menuInfo.menuid == src.windowId){
                        cur_menu = menuInfo;
                    }
                }

                var win = desktop.getWindow('window_'+cur_menu.menuid);
                if(!win){
                    var str = "win = desktop.createWindow({id : 'window_"+cur_menu.menuid+"',layout : 'fit',title : '"+
                        cur_menu.menuname+"',maximized :true,bodyStyle : 'background-color:#FFFFFF',animCollapse : true,"+
                        "animateTarget : Ext.getBody(),border : false,constrainHeader : true,constrain: true,"+
                        "html : '<iframe id=\"topMain\" scrolling=\"yes\" frameborder=\"0\" style=\"width:100%;height:100%;\" src=\""+
                        cur_menu.request+"\"></iframe>'});";
                    eval(str);
                }
                win.show();
            }
        });
#end

/**************************/
	var userFormPanel = new Ext.form.FormPanel({
        defaultType : 'textfield',
        labelAlign : 'right',
        labelWidth : 70,
        frame : false,
        bodyStyle : 'padding:5 5 0',
        items : [{
            fieldLabel : '登录帐户',
            name : 'account',
            id : 'account',
            allowBlank : false,
            readOnly : true,
            fieldClass : 'x-custom-field-disabled',
            anchor : '99%'
        }, {
            fieldLabel : '姓名',
            name : 'user_name',
            id : 'user_name',
            allowBlank : false,
            readOnly : true,
            fieldClass : 'x-custom-field-disabled',
            anchor : '99%'
        }, {
            fieldLabel : '当前密码',
            name : 'oldpswd',
            id : 'oldpswd',
            inputType : 'password',
            labelStyle : micolor,
            maxLength : 50,
            allowBlank : false,
            anchor : '99%'
        }, {
            fieldLabel : '新密码',
            name : 'password',
            id : 'password',
            inputType : 'password',
            labelStyle : micolor,
            maxLength : 50,
            allowBlank : false,
            anchor : '99%'
        }, {
            fieldLabel : '确认新密码',
            name : 'password1',
            id : 'password1',
            inputType : 'password',
            labelStyle : micolor,
            maxLength : 50,
            allowBlank : false,
            anchor : '99%'
        }, {
            id : 'user_id',
            name : 'user_id',
            hidden : true
        }]
    });

	var userWindow = new Ext.Window({
        layout : 'fit',
        width : 300,
        height : 215,
        resizable : false,
        draggable : true,
        closeAction : 'hide',
        modal : true,
        title : '<span class="commoncss">密码修改</span>',
        iconCls : 'keyIcon',
        collapsible : true,
        titleCollapse : true,
        maximizable : false,
        buttonAlign : 'right',
        border : false,
        animCollapse : true,
        animateTarget : Ext.getBody(),
        constrain : true,
        listeners : {
            'show' : function(obj) {
                Ext.getCmp('oldpswd').focus(true, 200);
            }
        },
        items : [userFormPanel],
        buttons : [{
            text : '保存',
            iconCls : 'acceptIcon',
            handler : function() {
                updateUser();
            }
        }, {
            text : '关闭',
            iconCls : 'deleteIcon',
            handler : function() {
                userWindow.hide();
            }
        }]
    });
			
	/**
	 * 修改用户信息
	 */
	function updateUser() {
		if (!userFormPanel.form.isValid()) {
			return;
		}
		password1 = Ext.getCmp('password1').getValue();
		password = Ext.getCmp('password').getValue();
		if (password1 != password) {
			Ext.Msg.alert('提示', '两次输入的密码不匹配,请重新输入!');
			Ext.getCmp('password').setValue('');
			Ext.getCmp('password1').setValue('');
			return;
		}
		userFormPanel.form.submit({
            url : 'index.ered?reqCode=updateUserInfo',
            waitTitle : '提示',
            method : 'POST',
            waitMsg : '正在处理数据,请稍候...',
            success : function(form, action) {
                Ext.MessageBox.alert('提示', '密码修改成功', function() {
                    userWindow.hide();
                });
            },
            failure : function(form, action) {
                var flag = action.result.flag;
                if (flag == '0') {
                    Ext.MessageBox.alert('提示', '您输入的当前密码验证失败,请重新输入',
                        function() {
                            Ext.getCmp('oldpswd').setValue('');
                            Ext.getCmp('oldpswd').focus();
                        });
                } else {
                    Ext.MessageBox.alert('提示', '密码修改失败');
                }
            }
        });
	}
	
	/**
	 * 加载当前登录用户信息
	 */
	function updateUserInit() {
		userFormPanel.form.reset();
		userWindow.show();
		userWindow.on('show', function() {
            setTimeout(function() {
                userFormPanel.form.load({
                    waitTitle : '提示',
                    waitMsg : '正在读取用户信息,请稍候...',
                    url : 'index.ered?reqCode=loadUserInfo',
                    success : function(form, action) {
                    },
                    failure : function(form, action) {
                        Ext.Msg.alert('提示','数据读取失败:' + action.failureType);
                    }
                });
            }, 5);
        });
	}

/*********************/
    function logout(){
        Ext.MessageBox.show({
            title : '提示',
            msg : '确认要注销系统,退出登录吗?',
            width : 250,
            buttons : Ext.MessageBox.YESNO,
            animEl : Ext.getBody(),
            icon : Ext.MessageBox.QUESTION,
            fn : function(btn) {
                if (btn == 'yes') {
                    Ext.MessageBox.show({
                        title : '请等待',
                        msg : '正在注销...',
                        width : 300,
                        wait : true,
                        waitConfig : {
                            interval : 50
                        }
                    });
                  window.location.href = 'login.ered?reqCode=logout';
                }
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
		for (i = 0; i < layout_root.childNodes.length; i++) {
			var child = layout_root.childNodes[i];
			if (default_layout == child.attributes.layout) {
				child.select();
			}
		}
		var o = document.getElementById('previewDiv');
		o.innerHTML = '<img src="./resource/image/theme/layout/' + default_layout
				+ '.jpg" />';
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
				Ext.MessageBox.confirm('请确认','您选择的['+ o.text+']'+
					'布局保存成功,立即应用该布局吗?<br>提示：页面会被刷新,请先确认是否有尚未保存的业务数据,以免丢失!',
                        function(btn, text) {
                            if (btn == 'yes') {
                                showWaitMsg('正在为您应用布局...');
                                location.reload();
                            } else {
                                Ext.Msg.alert('提示',
                                '请在任何时候按[F5]键刷新页面或者重新登录系统以启用['+ o.text + ']布局!',
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

	window.onload=function(){

	}
</script>
</html>
