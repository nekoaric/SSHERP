// 修复bug：在只读表单项按退格键时，会导致浏览器页面返回到前一页
Ext.getDoc().on('keydown', function (e) {
	if (e.getKey() == Ext.EventObject.BACKSPACE) {
		if (e.getTarget().readOnly
			|| (e.getTarget().type != 'text' && e.getTarget().type != 'textarea'
			&& e.getTarget().type != 'password')) {
			e.preventDefault();
		}
	}
});

/**
 * 显示请求等待进度条窗口
 * @param  msg
 */
function showWaitMsg(msg) {
	Ext.MessageBox.show({
		title: '系统提示',
		msg: msg == null ? '正在处理数据,请稍候...' : msg,
		progressText: 'processing now,please wait...',
		width: 300,
		wait: true,
		waitConfig: {
			interval: 150
		}
	});
}

/**
 * 隐藏请求等待进度条窗口
 */
function hideWaitMsg() {
	Ext.MessageBox.hide();
}

/**
 * 将JS数组转换为JS字符串 表格复选框专用
 */
function jsArray2JsString(arrayChecked, id) {
	var strChecked = "";
	for (var i = 0; i < arrayChecked.length; i++) {
		strChecked = strChecked + arrayChecked[i].get(id) + ',';
	}
	return strChecked.substring(0, strChecked.length - 1)
}

/**
 * 将JS数据表列转换为Json字符串
 *
 * 转化格式为 [{'id1':'value1','id2':'value2'...},{'id1':'value3','id2':'value4'...}]
 */
function tableCells2JsonString(arrayChecked, ids) {
	var jsonStr = "[";
	for (var i = 0; i < arrayChecked.length; i++) {
		jsonStr = jsonStr + "{";
		for (var j = 0; j < ids.length; j++) {
			jsonStr = jsonStr + "'" + ids[j] + "':'" + arrayChecked[i].get(ids[j]) + "',";
		}
		jsonStr = jsonStr.substring(0, jsonStr.length - 1);
		jsonStr = jsonStr + "},";
		//strChecked = strChecked + arrayChecked[i].get(id) + ',';
	}
	jsonStr = jsonStr.substring(0, jsonStr.length - 1); // 去掉最后的一个,
	jsonStr = jsonStr + "]";
	return jsonStr;
}

/**
 * 清除Ext.Form表单元素
 */
function clearForm(pForm) {
	var formItems = pForm.items['items'];
	for (var i = 0; i < formItems.length; i++) {
		var element = formItems[i];
		element.setValue('');
		element.reset(); // 避免出现红色波浪线
	}
}

/**
 * 清除Ext.form.FormPanel
 *
 */
function clearFormPanel(form) {
	//只对表单中的一些类型进行清除
	var typeArray = ['textfield', 'combo', 'datefield', 'textarea',
		'numberfield', 'htmleditor', 'timefield', 'checkboxgroup'];
	for (var i = 0; i < typeArray.length; i++) {
		var typeName = typeArray[i];
		var itemArray = form.findByType(typeName);
		for (var j = 0; j < itemArray.length; j++) {
			var element = itemArray[j];
			element.setValue('');
			element.originalValue='';
			element.reset(); // 避免出现红色波浪线
		}
	}
}

/**
 * 复制到剪贴板
 */
function copyToClipboard(txt) {
	if (window.clipboardData) {
		window.clipboardData.clearData();
		window.clipboardData.setData("Text", txt);
	} else if (navigator.userAgent.indexOf("Opera") != -1) {
		window.location = txt;
	} else if (window.netscape) {
		try {
			netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
		} catch (e) {
			Ext.Msg.alert('提示', "复制单元格操作被浏览器拒绝！\n请在浏览器地址栏输入'about:config'并回车\n然后将'signed.applets.codebase_principal_support'设置为'true'")
		}
		var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
		if (!clip)
			return;
		var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
		if (!trans)
			return;
		trans.addDataFlavor('text/unicode');
		var str = new Object();
		var len = new Object();
		var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
		var copytext = txt;
		str.data = copytext;
		trans.setTransferData("text/unicode", str, copytext.length * 2);
		var clipid = Components.interfaces.nsIClipboard;
		if (!clip)
			return false;
		clip.setData(trans, null, clipid.kGlobalClipboard);
		// Ext.Msg.alert('提示','单元格内容已成功复制到剪贴板!')
	}
}

/**
 * 初始化报表打印窗口
 */
function doPrint(pFlag, pWidth, pHeight) {
	var initUrl = '/report.ered?reqCode=initAppletPage';
	if (!Ext.isEmpty(pFlag))
		initUrl = initUrl + '&flag=' + pFlag;
	if (Ext.isEmpty(pWidth))
		pWidth = 800;
	if (Ext.isEmpty(pHeight))
		pHeight = 600;
	var left = (screen.width - pWidth) / 2;
	var top = (screen.height - pHeight) / 2;
	var str = 'width=' + pWidth + ',height=' + pHeight + ',top=' + top + ",left=" + left
		+ ',toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no,status=no';
	window.open(webContext + initUrl, '', str);
}

/**
 * 初始化报表打印窗口，窗口关闭后执行回调函数
 */
function doPrintWithCallback(pFlag, pWidth, pHeight) {
	var initUrl = '/report.ered?reqCode=initAppletPage';
	if (!Ext.isEmpty(pFlag))
		initUrl = initUrl + '&flag=' + pFlag;
	if (Ext.isEmpty(pWidth))
		pWidth = 800;
	if (Ext.isEmpty(pHeight))
		pHeight = 600;
	var timer, popwin;
	var left = (screen.width - pWidth) / 2;
	var top = (screen.height - pHeight) / 2;
	var str = 'width=' + pWidth + ',height=' + pHeight + ',top=' + top + ",left=" + left
		+ ',toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no,status=no';
	popwin = window.open(webContext + initUrl, '', str);
	timer = window.setInterval(function () {
		if (popwin.closed == true) {
			window.clearInterval(timer);
			Ext.MessageBox.confirm('请确认', '打印是否成功?', function (btn, text) {
				if (btn == 'yes') {
					// 在这个回调函数中实现打印次数纪录功能,此函数不能写在Ext作用域内
					fnPrintCallback();
				} else {
					return;
				}
			});
		}
	}, 500);
}

/**
 * 初始化PDF导出窗口
 */
function doExport(pFlag, pWidth, pHeight) {
	var initUrl = '/report.ered?reqCode=initPdfPage';
	if (!Ext.isEmpty(pFlag))
		initUrl = initUrl + '&flag=' + pFlag;
	if (Ext.isEmpty(pWidth))
		pWidth = 800;
	if (Ext.isEmpty(pHeight))
		pHeight = 600;
	var left = (screen.width - pWidth) / 2;
	var top = (screen.height - pHeight) / 2;
	var str = 'width=' + pWidth + ',height=' + pHeight + ',top=' + top + ",left=" + left
		+ ',toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no,status=no';
	window.open(webContext + initUrl, '', str);
}

/**
 * 初始化报PDF导出窗口，窗口关闭后执行回调函数
 */
function doExportWithCallback(pFlag, pWidth, pHeight) {
	var initUrl = '/report.ered?reqCode=initPdfPage';
	if (!Ext.isEmpty(pFlag))
		initUrl = initUrl + '&flag=' + pFlag;
	if (Ext.isEmpty(pWidth))
		pWidth = 800;
	if (Ext.isEmpty(pHeight))
		pHeight = 600;
	var timer, popwin;
	var left = (screen.width - pWidth) / 2;
	var top = (screen.height - pHeight) / 2;
	var str = 'width=' + pWidth + ',height=' + pHeight + ',top=' + top + ",left=" + left
		+ ',toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no,status=no';
	popwin = window.open(webContext + initUrl, '', str);
	timer = window.setInterval(function () {
		if (popwin.closed == true) {
			window.clearInterval(timer);
			Ext.MessageBox.confirm('请确认', '打印/导出是否成功?', function (btn, text) {
				if (btn == 'yes') {
					// 在这个回调函数中实现打印次数纪录功能,此函数不能写在Ext作用域内
					fnExportCallback();
				} else {
					return;
				}
			});
		}
	}, 500);
}

/**
 * 通过iFrame实现类ajax文件下载
 */
function exportExcel(url) {
	var exportIframe = document.createElement('iframe');
	exportIframe.src = url;
	exportIframe.style.display = "none";
	document.body.appendChild(exportIframe);
}

/**
 * 列的表头居中
 */
function setColumn(cm) {
	//获取所有的列(包括隐藏)
	var number = cm.getColumnCount(false);
	for (var i = 1; i < number; i++) {
		var c_header = cm.getColumnHeader(i);
		var c_c_header = '<div style = "text-align:center;">' + c_header + '</div>';
		cm.setColumnHeader(i, c_c_header);
	}

}

/**
 * 将金额转成财务金额格式
 */
function standardMoney(v) {
	v = (Math.round((v - 0) * 100)) / 100;
	v = (v == Math.floor(v)) ? v + ".00" : ((v * 10 == Math.floor(v * 10)) ? v + "0" : v);
	v = String(v);
	var ps = v.split('.');
	var whole = ps[0];
	var sub = ps[1] ? '.' + ps[1] : '.00';
	var r = /(\d+)(\d{3})/;
	while (r.test(whole)) {
		whole = whole.replace(r, '$1' + ',' + '$2');
	}
	v = whole + sub;
	//if(v.charAt(0) == '-')
	//{
	//    return v.substr(1);
	//}
	return v;
}

//让grid中各个块可复制
if (!Ext.grid.GridView.prototype.templates) {
	Ext.grid.GridView.prototype.templates = {};
}
Ext.grid.GridView.prototype.templates.cell = new Ext.Template(
	'<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} x-selectable {css}"  style="{style}" tabIndex="0" {cellAttr}>',
	'<div class="x-grid3-cell-inner x-grid3-col-{id}" {attr}>{value}</div>',
	'</td>'
);

Ext.grid.ColumnModel.prototype.defaultSortable = true;