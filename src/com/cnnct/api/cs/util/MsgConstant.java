package com.cnnct.api.cs.util;

public class MsgConstant {
    
    /** 返回文档类型 */
    public static final String CONTENT_TYPE = "text/xml;charset=UTF-8";
    
    public static final String ROOT = "MESSAGE";
    public static final String HEADER = "HEADER";
    public static final String BODY = "BODY";
    public static final String ROW = "ROW";
    public static final String RCODE = "RCODE";
    
    public static final String FUNC_9001 = "9001";
    public static final String FUNC_9002 = "9002";
    public static final String FUNC_9003 = "9003";
    
    public static final String RCODE_00 = "00";
    public static final String RCODE_41 = "41";
    public static final String DATATYPE_1 = "1";
    public static final String DATATYPE_2 = "2";
    
    /** 事件类型 01 - 请求 */
    public static final String EVENTTYPE_01 = "01";
    /** 事件类型 01 - 响应 */
    public static final String EVENTTYPE_02 = "02";

    /** 部门通知 请求报文 头部 */
    public static final String[] FUNC_9001_REQ_HEAD = { "MCODE", "DATE", "TIME", "ENTERPRISENO", "DEVNO" };
    /** 部门通知 请求报文 内容 */
    public static final String[] FUNC_9001_REQ_BODY = { "MCODE", "DATE", "TIME", "ENTERPRISENO", "DEVNO" };

    /** 部门通知 响应报文 头部 */
    public static final String[] FUNC_9001_RES_HEAD = { "MCODE", "DATE", "TIME", "ENTERPRISENO", "DEVNO" };
    /** 部门通知 响应报文 内容 */
    public static final String[] FUNC_9001_RES_BODY = { "DEPTID", "DEPTNAME", "PARENTID" };
    
    /** 人事资料通知 响应报文 头部 */
    public static final String[] FUNC_9002_RES_HEAD = { "MCODE", "DATE", "TIME", "ENTERPRISENO", "DEVNO" };
    /** 人事资料通知 响应报文 内容 */
    public static final String[] FUNC_9002_RES_BODY = { "USERID", "USERNAME", "DEPTID", "CARDID", "CSN", "ENDDATE", "CRDSTATE" };
}
