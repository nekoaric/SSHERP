package com.cnnct.util;

/**
 * 常量表
 * 
 * @author XiongChun
 * @since 2009-07-13
 */
public interface GlobalConstants {
	/**
	 * XML文档风格<br>
	 * 0:节点属性值方式
	 */
	public static final String XML_Attribute = "0";

	/**
	 * XML文档风格<br>
	 * 1:节点元素值方式
	 */
	public static final String XML_Node = "1";

	/**
	 * 字符串组成类型<br>
	 * number:数字字符串
	 */
	public static final String S_STYLE_N = "number";

	/**
	 * 字符串组成类型<br>
	 * letter:字母字符串
	 */
	public static final String S_STYLE_L = "letter";

	/**
	 * 字符串组成类型<br>
	 * numberletter:数字字母混合字符串
	 */
	public static final String S_STYLE_NL = "numberletter";

	/**
	 * 格式化<br>
	 * FORMAT_DateTime: 日期时间
	 */
	public static final String FORMAT_DateTime = "yyyy-MM-dd hh:mm:ss";

	/**
	 * 格式化<br>
	 * FORMAT_DateTime: 日期
	 */
	public static final String FORMAT_Date = "yyyy-MM-dd";

	/**
	 * 格式化<br>
	 * FORMAT_DateTime: 时间
	 */
	public static final String FORMAT_Time = "hh:mm:ss";

	/**
	 * 换行符<br>
	 * \n:换行
	 */
	public static final String ENTER = "\n";

	/**
	 * 异常信息统一头信息<br>
	 * 非常遗憾的通知您,程序发生了异常
	 */
	public static final String Exception_Head = "\n非常遗憾的通知您,程序发生了异常.\n" + "异常信息如下:\n";

	/**
	 * Ext表格加载模式<br>
	 * \n:非翻页排序加载模式
	 */
	public static final String EXT_GRID_FIRSTLOAD = "first";

	/**
	 * Excel模板数据类型<br>
	 * number:数字类型
	 */
	public static final String ExcelTPL_DataType_Number = "number";

	/**
	 * Excel模板数据类型<br>
	 * number:文本类型
	 */
	public static final String ExcelTPL_DataType_Label = "label";
	
	/**
     * HTTP请求类型<br>
     * 1:裸请求
     */
    public static final String PostType_Nude = "1";

    /**
     * HTTP请求类型<br>
     * 0:常规请求
     */
    public static final String PostType_Normal = "0";
	
	/**
     * Ajax请求超时错误码<br>
     * 999:Ajax请求超时错误码
     */
    public static final int Ajax_Timeout = 999;
    /**
	 * Ajax请求非法错误码<br>
	 * 998:当前会话userid和登录时候的userid不一致(会话被覆盖)
	 */
	public static final int Ajax_Session_Unavaliable = 998;
	
	/**
	 * Flash图标色彩数组
	 */
//	public static String[] CHART_COLORS = {"AFD8F8","F6BD0F","8BBA00","008E8E","D64646",
//            "8E468E","588526","B3AA00","008ED6","9D080D","A186BE","1EBE38"};

	public static String[] CHART_COLORS = {"43A102","065FB9","1291A9","BD7803","4499EE","A2B700","00CCFF",
            "C5DA01","FE9D01","4C4C4C","72CFD7","FFBB1C","049FF1","FF981F","EED205","70E1FF","D1F0EF",
            "FF8C05","CBF3FB","FDD283","712704","04477C","A73800","D6E9FC","FF6600","FF981F","FCFC8A",
            "BEC0C2","F0F0F0","036803","74A474","036803","3F813F","55A255","74A474",
            "DA891E","F6BFEC","FFF7D2","000000"};

}