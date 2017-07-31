package com.cnnct.util;

public class BusiConst {
	/**企业管理员id**/
	public static final String GRP_ADMIN_ID = "5710000000";
	  /***企业类型 卡管中心**/
    public static final String GRP_TYPE_CRD = "0"; 
	/** 企业类型 托管企业 **/
	public static final String GRP_TYPE_TRUSTEE = "10"; 
	/** 企业类型 财务中心 **/
	public static final String GRP_TYPE_FINCCENT = "11"; 
	/** 企业类型 企业 **/
	public static final String GRP_TYPE_CPY = "3"; 

	/** 企业根部门长度 8 */
	public static final int GRP_ROOT_DEPTID_LENGTH = 8;
	/** 企业根企业长度 10 */
	public static final int GRP_ROOT_GRPID_LENGTH = 10;

	/** 部门状态 正常 **/
	public static final String DEPT_STATE_NORMAL = "0"; // 正常

    /**
     * 数据授权类型-部门权限
     */
    public static final String DATA_AUTHORITY_TYPE_DEPT = "1";
    /**
     * 数据授权类型-人员权限
     */
    public static final String DATA_AUTHORITY_TYPE_USER = "2";
    /**
     * 数据授权类型-客户所有权限
     */
    public static final String DATA_AUTHORITY_TYPE_CUST = "3";
    /**
     * 数据授权类型-客户部分权限
     */
    public static final String DATA_AUTHORITY_TYPE_PROD_ORD = "4";

    /**
     * 数据授权类型-相对权限
     */
    public static final String DATA_AUTHORITY_TYPE_RELATIVE = "9";

    /**
     *数据权限(分类授权)-当前人员
     */
    public static final String RELATIVE_AUTHORITY_USER = "1";
    /**
     *数据权限(分类授权)-当前部门
     */
    public static final String RELATIVE_AUTHORITY_LOCALDEPT = "2";
    /**
     *数据权限(分类授权)-所属企业
     */
    public static final String RELATIVE_AUTHORITY_PARENTDEPT = "3";
    /**
     *数据权限(分类授权)-分管部门
     */
    public static final String RELATIVE_AUTHORITY_MANAGEDEPT = "4";
    /**
     *数据权限(分类授权)-根部门
     */
    public static final String RELATIVE_AUTHORITY_ROOTDEPT = "5";
    /**
     *菜单类型-人事菜单
     */
    public static final String MENU_TYPE_EMP = "1";
    /**
     *菜单类型-工资菜单
     */
    public static final String MENU_TYPE_WAGE = "2";
    /**
     *菜单类型-卡务菜单
     */
    public static final String MENU_TYPE_CRD = "3";
    /**
     *菜单类型-考勤菜单
     */
    public static final String MENU_TYPE_CWA = "4";
    /**
     *菜单类型-门禁菜单
     */
    public static final String MENU_TYPE_AEG = "5";
    /**
     *菜单类型-消费菜单
     */
    public static final String MENU_TYPE_CNS = "6";
    /**
     *菜单类型-场馆菜单
     */
    public static final String MENU_TYPE_GYM = "7";
    /**
     *菜单类型-个人菜单
     */
    public static final String MENU_TYPE_USER = "8";
    /**
     *菜单类型-系统配置菜单
     */
    public static final String MENU_TYPE_ARM = "9";
    /**
     *菜单类型-访客菜单
     */
    public static final String MENU_TYPE_VST = "10";
    /**
     *菜单类型-其他菜单
     */
    public static final String MENU_TYPE_OTHER = "0";

}
