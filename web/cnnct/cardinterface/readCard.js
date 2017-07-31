/** **读卡CSN**** */
function getCardCSN() {
	var card ={};
	OneCard.GetCardCsn()
	card.state =OneCard.State ;
	if (card.state == 0) {
		card.csn = OneCard.TransOutData;
		card.returnMsg = '读取成功！';
	} else {
		card.csn = '';
		card.returnMsg = showCardErrText(card.state);
	}

	return card;
}

/**
 * 显示卡片错误消息
 */
function showCardErrText(status) {
	var messages = '';
	switch (status) {
		case -200001 :
			messages = "打开端口错误！";
			break;
		case -200002 :
			messages = "关闭端口错误！";
			break;
		case -200003 :
			messages = "下载密钥错误！";
			break;
		case -200004 :
			messages = "卡请求错误，未找到卡片，请将卡置于发卡器上！";
			break;
		case -200005 :
			messages = "选择卡片错误！";
			break;
		case -200006 :
			messages = "寻卡错误！";
			break;
		case -200007 :
			messages = "验证扇区密码错误！";
			break;
		case -200008 :
			messages = "读块数据错误！";
			break;
		case -200009 :
			messages = "写块数据错误！";
			break;
		case -200010 :
			messages = "复位射频模块错误！";
			break;
		case -200011 :
			messages = "防冲突错误！";
			break;
		case -200012 :
			messages = "中止卡片错误！";
			break;
		case -200013 :
			messages = "CPU卡复位错误！";
			break;
		case -200014 :
			messages = "CPU卡通讯错误！";
			break;
		case -200015 :
			messages = "初始化块值错误！";
			break;
		case -200016 :
			messages = "钱包读值错误！";
			break;
		case -200017 :
			messages = "钱包增值错误！";
			break;
		case -200018 :
			messages = "钱包减值错误！";
			break;
		case -200019 :
			messages = "块值回传错误！";
			break;
		case -200020 :
			messages = "块值传送错误！";
			break;
		case -200021 :
			messages = "块校验值校验错误！";
			break;
		case -200022 :
			messages = "卡片类型不对！";
			break;
		case -200023 :
			messages = "CPU卡片尚未插入！";
			break;
		case -200024 :
			messages = "CPU卡片尚未取出！";
			break;
		case -200025 :
			messages = "CPU卡片无应答！";
			break;
		case -200026 :
			messages = "CPU卡不支持该命令！";
			break;
		case -200027 :
			messages = "CPU卡命令长度错误！";
			break;
		case -200028 :
			messages = "CPU卡命令参数错误！";
			break;
		case -200029 :
			messages = "CPU卡访问权限不满足！";
			break;
		case -200030 :
			messages = "CPU卡信息校验和出错！";
			break;
		case -200031 :
			messages = "执行CPU卡指令出错！";
			break;
		case -200032 :
			messages = "设置SAM卡卡槽出错！";
			break;
		case -200033 :
			messages = "卡号不符！";
			break;
		case -200034 :
			messages = "卡验证码错误！";
			break;
		case -200035 :
			messages = "卡未启用！";
			break;
		case -200036 :
			messages = "卡已停用！";
			break;
		case -200037 :
			messages = "该卡为黑名单卡！";
			break;
		case -200038 :
			messages = "该卡已过有效期！";
			break;
		case -200039 :
			messages = "钱包扣款余额不足！";
			break;
		case -200040 :
			messages = "卡内金额加上充值额大于限额！";
			break;
		case -200041 :
			messages = "卡状态异常，无法恢复！";
			break;
		case -200042 :
			messages = "设置CPU通讯参数错误！";
			break;
		case -200043 :
			messages = "蜂鸣失败！";
			break;
		case -200044 :
			messages = "交易类型出错！";
			break;
		case -200045 :
			messages = "该卡未发卡！";
			break;
		case -200046 :
			messages = "卡片CSN不符！";
			break;
		case -200047 :
			messages = "该卡已经省级(移动)发卡！";
			break;
		case -200048 :
			messages = "该卡已经单位级发卡！";
			break;
		case -200049 :
			messages = "该卡不是移动所发的卡！";
			break;
		case -200050 :
			messages = "卡片交易指针出错！";
			break;
		case -200092 :
			messages = "MIFARE卡配置密码索引错误！";
			break;
		case -200093 :
			messages = "卡种类不正确！";
			break;
		case -200094 :
			messages = "充值消费计数出错！";
			break;
		case -200095 :
			messages = "读写器蜂鸣失败！";
			break;
		case -200096 :
			messages = "加密机响应错误返回！";
			break;
		case -200097 :
			messages = "加密机响应错误返回！";
			break;
		case -200098 :
			messages = "计算卡内各块信息出错！";
			break;
		case -200099 :
			messages = "配置文件参数错误！";
			break
		case -200100 :
			messages = "代码异常错误！";
			break;
		default :
			messages = "读卡发生未知错误！";
			break;
	}
	messages += "返回码：" + status;
	return messages;
}