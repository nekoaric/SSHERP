#foreach($card in $cardList)
<div id="div.card.${card.menuid}" style="overflow: auto; height: 100%; width: 100%;"></div>
#end
<div id="themeTreeDiv" class="x-hidden"  ></div>
<div id="previewDiv" class="x-hidden"  >
	<img src="${contextPath}/resource/image/theme/${theme}.jpg" />
</div>

<div id="layoutTreeDiv" class="x-hidden"  ></div>
<div id="layout_previewDiv" class="x-hidden"  >
	<img src="${contextPath}/resource/image/theme/layout/${layout}.jpg" />
</div>
${scriptStart}
var default_theme = '${theme}';
var default_layout = '${layout}';
var mainTabs;
var directOrdIndex='';
var directOrdList='';
var account=${account};
Ext.onReady(function(){
    Ext.BLANK_IMAGE_URL= './resource/image/ext/s.gif';
    var wdgzt = new Ext.Panel({
        title:"<img align='top' class='IEPNG' src='./resource/image/ext/user.png'/>我的工作台",
        listeners: {
            activate: function(){
                Ext.getCmp('centerPanel').setTitle('${centerTitle} -> 我的工作台');
            }
        },
        autoLoad: {
        url: 'index.ered?reqCode=preferencesInit',
        scripts: true
    },
    id:'wdgzt'
    });
    mainTabs = new Ext.TabPanel({
        region:'center',
        activeTab:0,
        id:'mainTabs',
        enableTabScroll:true,
        height:550,
        border:false,
        frame:true,
        plugins: new Ext.ux.TabCloseMenu(),
        items:[wdgzt]
    });

             var viewport = new Ext.Viewport({
                 layout:'border',
                 items:[
                 new Ext.Panel({
                     region:'north',
                     contentEl:'north', 
                     iconCls:'application_homeIcon', 
                     height:85,
                     id:'northPanel',
                     collapsible:true,
					 border:false,
                     layout: 'fit',
                     title:'${northTitle}'}),
                 new Ext.BoxComponent({
                     region:'south',
                     contentEl: 'south',
                     height:17,
                     layout: 'fit',
                     collapsible: true}),
                 {region:'center', 
                     id: 'centerPanel', 
                     iconCls:'',
                     title:'${centerTitle}',
                     autoScroll:false,
                     layout: 'fit',
                     items:[mainTabs]},
                   {region:'west',
                    width: 220,
                    collapsible: true,
                    minSize: 200,
                    id:'westPanel',
                    maxSize: 350,
                    split: true,
                    //collapseMode:'mini',
					iconCls:'book_previousIcon',
                    title: '${westTitle}',
                    layout:'accordion',
                    layoutConfig:{
                      animate:true
					  //activeOnTop :true
					},
                   items: [
#foreach($card in $cardList)
	                {
                    autoScroll:true,
                    border:false,
                    contentEl: 'div.card.${card.menuid}',
#if(${card.iconcls}&&${card.iconcls}!="")
                    iconCls:'${card.iconcls}',
#end
					title:'${card.menuname}'
                   }
#if(${card.isNotLast})
					  ,
#end
#end
				   ]
                   }
                ]}); 
    });
    /**
     * 响应树节点单击事件
     */
    function addTab(url,name,menuid,pathCh,icon){
        var id = "tab_id_" + menuid;
        if(url == '#'){
            showOkTipMsg('此菜单还没有指定请求页面,请点击其它功能菜单.');
        }else{
            var index = url.indexOf('.ered');
            if(index != -1)
            url = url + '&menuid4Log=' + menuid;
            var n = mainTabs.getComponent(id);
            if (!n) {
                 // 如果对centerPanel进行遮罩,则可以出现阴影mainTabs
                 //Ext.getCmp('centerPanel').getEl().mask('<span style=font-size:12>正在加载页面,请稍等...</span>', 'x-mask-loading');
                 // document.getElementById('endIeStatus').click();//解决Iframe IE加载不完全的问题
                 // 兼容IE和FF触发.click()函数
                 var endIeStatus = document.getElementById("endIeStatus");
                 if(document.createEvent){
                     var ev = document.createEvent('HTMLEvents');
                     ev.initEvent('click', false, true);
                     endIeStatus.dispatchEvent(ev);
                 }else{
                    endIeStatus.click();
                 }
                 n = mainTabs.add({
                    id:id,
                    title:"<img align='top' class='IEPNG' src='./resource/image/ext/" + icon + "'/>" + name,
                    closable:true,
                    layout:'fit',
                    listeners: {activate: function(){Ext.getCmp('centerPanel').setTitle(pathCh)}},
                    html:'<iframe scrolling="auto" frameborder="0" width="100%" height="100%" src='+url+'></iframe>'
                    //如果功能页面使用中心区域阴影加载模式则使用下面的代码unmaskCenterPanel();页面加载完毕后取消阴影
                    //html:'<iframe scrolling="auto" frameborder="0" onload="unmaskCenterPanel()" width="100%" height="100%" src='+url+'></iframe>'
                 });
            }else if(directOrdIndex!=''){
           
            	mainTabs.remove(Ext.getCmp('tab_id_010502'));
            	addTab(url,name,menuid,pathCh,icon);
            }
             mainTabs.setActiveTab(n);
        }
    }

// 解决Iframe IE加载不完全的问题
function endIeStatus(){}

Ext.EventManager.on(window, 'load', function(){
    setTimeout(function() {
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({remove:true});
    }, 200);
});
  
/**
 * 取消阴影(当子页面加载完成后通过parent.XXXX来调用)
 */
function unmaskCenterPanel(){
 // 如果对centerPanel进行遮罩,则可以出现阴影
    Ext.getCmp('centerPanel').getEl().unmask();
}

${scriptEnd}
<style type="text/css">
 #loading-mask {
	Z-INDEX: 20000;
	LEFT: 0px;
	WIDTH: 100%;
	POSITION: absolute;
	TOP: 0px;
	HEIGHT: 100%;
	BACKGROUND-COLOR: white
}
#loading {
	PADDING-RIGHT: 2px;
	PADDING-LEFT: 2px;
	Z-INDEX: 20001;
	LEFT: 45%;
	PADDING-BOTTOM: 2px;
	PADDING-TOP: 2px;
	POSITION: absolute;
	TOP: 40%;
	HEIGHT: auto
}
#loading IMG {
	MARGIN-BOTTOM: 5px
}
#loading .loading-indicator {
	PADDING-RIGHT: 10px;
	PADDING-LEFT: 10px;
	BACKGROUND: white;
	PADDING-BOTTOM: 10px;
	MARGIN: 0px;
	FONT: 12px 宋体, arial, helvetica;
	COLOR: #555;
	PADDING-TOP: 10px;
	HEIGHT: auto;
	TEXT-ALIGN: center
}

.banner {
	font-family: "宋体";
	font-size: 12px;
	color:$themeColor;
}
</style>
<!--显示loding区域-->
<DIV id=loading-mask></DIV>
<DIV id=loading>
<DIV class=loading-indicator><IMG style="MARGIN-RIGHT: 8px"
	height=32
	src="./resource/image/ajax1.gif"
	width=36 align=absMiddle>正在初始化,请稍等...</DIV>
</DIV>
<div id="north">
<table border="0" cellpadding="0" cellspacing="0" width="100%"  
	height="60" background="./resource/image/banner_background/${theme}.png">
	<tr >
		<td style="padding-left:15px"><img class="IEPNG"
			src="./resource/image/${titleImg}" />
		</td>
		<td style="padding-right:5px">
		  <table width="100%"   border="0" cellpadding="0" cellspacing="3" class="banner">
		  	<tr align="right">
		      <td style="color:#374d8f">欢迎您,${username}!&nbsp;帐户:${account}&nbsp;所属部门:${deptname}&nbsp;角色:${rolename}</td>
		    </tr>
		    <tr align="right">
		    <td>
		      <table border="0" cellpadding="0" cellspacing="1">
		        <tr>
		          <td><div id = "themeDiv"></td> 
		          <td>&nbsp;</td>
		          <td><div id = "configDiv"></td> 
		          <td>&nbsp;</td>
		          <td><div id = "closeDiv"></td>
		        </tr>
		      </table>
		    </td>
		    </tr>
		  </table>
		</td>
	</tr>
</table>
</div>
<div id="south" align="left">
<table class="banner" width="100%">
<tr>
<td width="65%"><nobr>&nbsp;<img class="IEPNG" src="./resource/image/ext/comments2.png" />&nbsp;${welcome},${username}! 今天是:${date} ${week} <span id="rTime"><span></nobr></td>
<td width="35%"><div align="right"><nobr>浙江网新创建科技有限公司版权所有 Copyright &copy 2002-2012 All Rights Reserved 浙江.杭州</nobr></div></td>
</tr>
</table>
</div>
<a href="#" onclick="javascript:endIeStatus();" id="endIeStatus"
	style="display: none;" />