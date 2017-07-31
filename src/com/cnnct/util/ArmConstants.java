package com.cnnct.util;

import com.cnnct.util.GlobalConstants;

/**
 * 常量表
 * @author XiongChun
 * @since 2010-01-13
 */
public interface ArmConstants extends GlobalConstants{
    /**
     * 帐户类型<br>
     * 0:企业普通员工
     */
    public static final String ACCOUNTTYPE_NORMAL = "0";

    /**
     * 帐户类型<br>
     * 1:单位操作员
     */
    public static final String ACCOUNTTYPE_OPERATOR = "1";

    /**
     * 帐户类型<br>
     * 2:分厂管理员
     */
    public static final String ACCOUNTTYPE_GRPMANAGE = "2";

    /**
     * 帐户类型<br>
     * 3:分厂操作员
     */
    public static final String ACCOUNTTYPE_GRPOPERATOR = "3";

    /**
     * 帐户类型<br>
     * 8:企业管理员
     */
    public static final String ACCOUNTTYPE_ADMIN = "8";

    /**
     * 帐户类型<br>
     * 9:超级用户
     */
    public static final String ACCOUNTTYPE_SUPER = "9";

    /**
     * 角色类型<br>
     * 1:内置角色
     */
    public static final String ROLETYPE_BUILT_IN = "1";

    /**
     * 角色类型<br>
     * 2:系统初始化角色
     */
    public static final String ROLETYPE_INITIALIZATION  = "2";

    /**
     * 角色类型<br>
     * 3:系统管理员角色
     */
    public static final String ROLETYPE_ADMIN = "3";

    /**
     * 角色类型<br>
     * 5:分厂管理员角色
     */
    public static final String ROLETYPE_GRPMANAGE = "5";

	/**
	 * 编辑模式<br>
	 * 1:可编辑
	 */
	public static final String EDITMODE_Y = "1";

	/**
	 * 编辑模式<br>
	 * 0:只读
	 */
	public static final String EDITMODE_N = "0";

	/**
	 * 锁定态<br>
	 * 1:锁定
	 */
	public static final String LOCK_Y = "1";

	/**
	 * 锁定状态<br>
	 * 0:解锁
	 */
	public static final String LOCK_N = "0";

	/**
	 * 强制类加载<br>
	 * 1:强制
	 */
	public static final String FORCELOAD_Y = "1";

	/**
	 * 强制类加载<br>
	 * 0:不强制
	 */
	public static final String FORCELOAD_N = "0";

	/**
	 * 树节点类型<br>
	 * 1:叶子节点
	 */
	public static final String LEAF_Y = "1"; 
	
	/**
	 * 树节点类型<br>
	 * 0:树枝节点
	 */
	public static final String LEAF_N = "0";

	/**
	 * 权限级别<br>
	 * 1:访问权限
	 */
	public static final String AUTHORIZELEVEL_ACCESS = "1"; 
	
	/**
	 * 权限级别<br>
	 * 2:管理权限
	 */
	public static final String AUTHORIZELEVEL_ADMIN = "2";
	
	/**
	 * 用户类型<br>
	 * 2:管理员
	 */
	public static final String USERTYPE_ADMIN = "2";
	
	/**
	 * 根节点ID<br>
	 * 01:菜单树
	 */
	public static final String ROORID_MENU = "01";

	/**
	 * 操作员事件跟踪监控开关[1:打开;0:关闭]<br>
	 * 1:打开
	 */
	public static final String EVENTMONITOR_ENABLE_Y = "1";
	
	/**
	 * 操作员事件跟踪监控开关[1:打开;0:关闭]<br>
	 * 0:关闭
	 */
	public static final String EVENTMONITOR_ENABLE_N = "0";
	
	/**
	 * 切入点类型[1:BPO切入;2:DAO切入]<br>
	 * 1:BPO切入
	 */
	public static final String POINTCUTTYPE_BPO = "1";
	
	/**
	 * 切入点类型[1:BPO切入;2:DAO切入]<br>
	 * 2:DAO切入
	 */
	public static final String POINTCUTTYPE_DAO = "2";
	
	/**
	 * 通知类型[1:方法调用通知;2:异常捕获通知]<br>
	 * 1:方法调用通知
	 */
	public static final String ADVISETYPE_CALL = "1";
	
	/**
	 * 通知类型[1:方法调用通知;2:异常捕获通知]<br>
	 * 2:异常捕获通知
	 */
	public static final String ADVISETYPE_CATCH = "2";
    /**
     * 企业主管ID
     * 
     */
    public static final String ACCOUNT_ID= "admin";

}
