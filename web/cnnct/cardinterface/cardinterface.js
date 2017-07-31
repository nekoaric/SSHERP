var count = 0;
function SetString(str, beginlen, len) {
	var strlen = 0;
	var s = "";
	count = 0;
	for (var i = beginlen; i < str.length; i++) {
		if (str.charCodeAt(i) > 128) {
			strlen += 2;
			count++;
		}
		else {
			strlen++;
			count++;
		}
		s += str.charAt(i);
		if (strlen >= len) {
			return s;
		}
	}
	return s;
}

function getstrlen(str) {
	var strlen = 0;
	for (var i = 0; i < str.length; i++) {
		if (str.charCodeAt(i) > 128) {
			strlen += 2;
		}
		else {
			strlen++;
		}
	}
	return strlen;
}


function formatstr(str, inlen, len) {
	var s = "";
	for (var i = inlen; i < len; i++) {
		s = s + " ";
	}
	return str + s;
}


//将字符串拆成字符，并存到数组中
String.prototype.strToChars = function () {
	var chars = new Array();
	for (var i = 0; i < this.length; i++) {
		chars[i] = [this.substr(i, 1), this.isCHS(i)];
	}
	String.prototype.charsArray = chars;
	return chars;
}
//截取字符串（从start字节到end字节）
String.prototype.subCHString = function (start, end) {
	var len = 0;
	var str = "";
	this.strToChars();
	for (var i = 0; i < this.length; i++) {
		if (this.charsArray[i][1])
			len += 2;
		else
			len++;
		if (end < len)
			return str;
		else if (start < len)
			str += this.charsArray[i][0];
	}
	return str;
}
//截取字符串（从start字节截取length个字节）
String.prototype.subCHStr = function (start, length) {
	return this.subCHString(start, start + length);
}
//计算字符串长度
String.prototype.strLen = function () {
	var len = 0;
	for (var i = 0; i < this.length; i++) {
		if (this.charCodeAt(i) > 255 || this.charCodeAt(i) < 0)
			len += 2;
		else
			len++;
	}
	return len;
}
//将字符串拆成字符，并存到数组中
String.prototype.strToChars = function () {
	var chars = new Array();
	for (var i = 0; i < this.length; i++) {
		chars[i] = [this.substr(i, 1), this.isCHS(i)];
	}
	String.prototype.charsArray = chars;
	return chars;
}
//判断某个字符是否是汉字
String.prototype.isCHS = function (i) {
	if (this.charCodeAt(i) > 255 || this.charCodeAt(i) < 0)
		return true;
	else
		return false;
}

function showCardErrText(status) {
	var messages = '';
	switch (status) {
		case -200001:
			messages = "打开端口错误！";
			break;
		case -200002:
			messages = "关闭端口错误！";
			break;
		case -200003:
			messages = "下载密钥错误！";
			break;
		case -200004:
			messages = "卡请求错误！";
			break;
		case -200005:
			messages = "选择卡片错误！";
			break;
		case -200006:
			messages = "寻卡错误！";
			break;
		case -200007:
			messages = "验证扇区密码错误！";
			break;
		case -200008:
			messages = "读块数据错误！";
			break;
		case -200009:
			messages = "写块数据错误！";
			break;
		case -200010:
			messages = "复位射频模块错误！";
			break;
		case -200011:
			messages = "防冲突错误！";
			break;
		case -200012:
			messages = "中止卡片错误！";
			break;
		case -200013:
			messages = "CPU卡复位错误！";
			break;
		case -200014:
			messages = "CPU卡通讯错误！";
			break;
		case -200015:
			messages = "初始化块值错误！";
			break;
		case -200016:
			messages = "钱包读值错误！";
			break;
		case -200017:
			messages = "钱包增值错误！";
			break;
		case -200018:
			messages = "钱包减值错误！";
			break;
		case -200019:
			messages = "块值回传错误！";
			break;
		case -200020:
			messages = "块值传送错误！";
			break;
		case -200021:
			messages = "块校验值校验错误！";
			break;
		case -200022:
			messages = "卡片类型不对！";
			break;
		case -200023:
			messages = "CPU卡片尚未插入！";
			break;
		case -200024:
			messages = "CPU卡片尚未取出！";
			break;
		case -200025:
			messages = "CPU卡片无应答！";
			break;
		case -200026:
			messages = "CPU卡不支持该命令！";
			break;
		case -200027:
			messages = "CPU卡命令长度错误！";
			break;
		case -200028:
			messages = "CPU卡命令参数错误！";
			break;
		case -200029:
			messages = "CPU卡访问权限不满足！";
			break;
		case -200030:
			messages = "CPU卡信息校验和出错！";
			break;
		case -200031:
			messages = "执行CPU卡指令出错！";
			break;
		case -200032:
			messages = "设置SAM卡卡槽出错！";
			break;
		case -200033:
			messages = "卡号不符！";
			break;
		case -200034:
			messages = "卡验证码错误！";
			break;
		case -200035:
			messages = "卡未启用！";
			break;
		case -200036:
			messages = "卡已停用！";
			break;
		case -200037:
			messages = "该卡为黑名单卡！";
			break;
		case -200038:
			messages = "该卡已过有效期！";
			break;
		case -200039:
			messages = "钱包扣款余额不足！";
			break;
		case -200040:
			messages = "卡内金额加上充值额大于限额！";
			break;
		case -200041:
			messages = "卡状态异常，无法恢复！";
			break;
		case -200042:
			messages = "设置CPU通讯参数错误！";
			break;
		case -200043:
			messages = "蜂鸣失败！";
			break;
		case -200044:
			messages = "交易类型出错！";
			break;
		case -200045:
			messages = "该卡未发卡！";
			break;
		case -200046:
			messages = "卡片CSN不符";
			break;
		case -200047:
			messages = "系统不受理该卡";
			break;
		case -200092:
			messages = "MIFARE卡配置密码索引错误！";
			break;
		case -200093:
			messages = "卡种类不正确！";
			break;
		case -200094:
			messages = "充值消费计数出错！";
			break;
		case -200095:
			messages = "读写器蜂鸣失败！";
			break;
		case -200096:
			messages = "加密机响应错误返回！";
			break;
		case -200097:
			messages = "加密机响应错误返回！";
			break;
		case -200098:
			messages = "计算卡内各块信息出错！";
			break;
		case -200099:
			messages = "配置文件参数错误！";
			break;
		case -200100:
			messages = "代码异常错误！";
			break;
		default:
			messages = "读卡发生未知错误";
			break;
	}
	messages += "返回码：" + status;
	return messages;
}

//补字符串函数
//str 原字符串
//Totallen 要补到的最大长度
//AddChar 要补的字符
//Dir 要补的方向 L/l 左补,R/r 右补，默认右补
function PadString(Str, Totallen, AddChar, Dir) {
	if (getstrlen(Str) >= Totallen)
		return Str;
	for (i = getstrlen(Str); i < Totallen; i++) {
		if (Dir == "L" || Dir == "l") {
			Str = AddChar + Str;
		}
		else if (Dir == "R" || Dir == "r") {
			Str = Str + AddChar;
		}
		else {
			Str = Str + AddChar;
		}
	}
	return Str;
}

/*************************************************************
 Author        : 陈浩  <chtctc@yahoo.com.cn>
 Description    : 正确截取单字节和双字节混和字符串
 String str    : 要截取的字符串
 Number        : 截取长度
 *************************************************************/
function substr(str, start, len) {
	alert(getstrlen(str))
	if (!str || !len) {
		return '';
	}
	if (start + len > getstrlen(str) + 1)
		return "";

	var reallen = 0;
	//判断实际的字符串长度
	for (i = 0; i < start; i++) {
		if (str.charCodeAt(i) > 255) {

			reallen += 2;
		}
		else {
			reallen++;
		}
	}
	//预期计数：中文2字节，英文1字节
	var a = 0;

	//循环计数
	var i = 0;

	//临时字串
	var temp = '';

	for (i = start; i < str.length; i++) {
		if (str.charCodeAt(i) > 255) {
			//按照预期计数增加2
			a += 2;
		}
		else {
			a++;
		}
		//如果增加计数后长度大于限定长度，就直接返回临时字符串
		if (a > len) {
			return temp;
		}

		//将当前内容加到临时字符串
		temp += str.charAt(i);
	}
	//如果全部是单字节字符，就直接返回源字符串
	return str;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//读取Tidcode
function ReadTidCode() {
	Test.DR121ReadTidCode();

	var rfid ={};
	rfid.state = Test.State;

	if(Test.TransOutData=='000000000000000000000000000000000000000000000000'){
		rfid.state ='1';
		rfid.returnCode='未找到标签!';
		return rfid;
	}
	if (rfid.state == 0) {
		//发现前28位m每次的读写都没问题,返回前28位
		rfid.returnCode = Test.TransOutData.substring(0,28);
	} else {
		rfid.returnCode = showCardErrText(rfid.state);
	}
	return rfid;
}

//读取Epccode
function ReadEpcCode() {
	Test.DR121ReadEpcCode();

	var rfid ={};
	rfid.state = Test.State;

	if (rfid.state == 0) {
		rfid.returnCode = Test.TransOutData.substring(0,24);
	} else {
		rfid.returnCode = showCardErrText(rfid.state);
	}
	return rfid;
}

//读取UserData
function ReadUserData() {
	Test.DR121ReadUserData();

	var rfid ={};
	rfid.state = Test.State;

	if (rfid.state == 0) {
		rfid.returnCode = Test.TransOutData;
	} else {
		rfid.returnCode = showCardErrText(rfid.state);
	}
	return rfid;
}

//写Epc码
function WriteEpcCode(OutEpcCode) {
	var InData = "";

	if (OutEpcCode == "") {
		alert("Epc码不能为空！");
		return;
	} else {
		//epc后补0
		OutEpcCode = PadString(OutEpcCode,24,'0','r');
		InData = InData + OutEpcCode;
	}

	Test.DR121WriteEpcCode(InData);

	var rfid ={};
	rfid.state = Test.State;

	if (rfid.state == 0) {
		rfid.returnCode = "写Epc码成功！";
	} else {
		rfid.returnCode = showCardErrText(rfid.state);
	}
	return rfid;
}

//写UserData
function WriteUserData(OutUserData) {
	var InData = "";

	if (OutUserData == "") {
		alert("用户信息不能为空！");
		return;
	} else {
		InData = InData + OutUserData;
	}

	var rfid ={};
	rfid.state = Test.State;

	if (rfid.state == 0) {
		rfid.returnCode = "写用户信息成功！";
	} else {
		rfid.returnCode = showCardErrText(rfid.state);
	}
	return rfid;
}