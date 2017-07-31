/**
 *  系统的常量参数表
 *  @since 2014年9月22日
 *  @author zhouww
*/

    /**
     * 损耗数量常量表
     * @type 
     */
    var fieldNameValueMap = {
       ly_num : '良余',       jp_num : '剪破',       sxbl_num : '水洗不良',       zjly_num : '中间领用',
       zzdp_num : '撞针打破',       sxpd : '水洗破洞',       cpys_num : '成品遗失',       wj_num : '污迹',
       sxsc_num : '水洗色差',       hzys_num : '后整遗失',       fzpd_num : '缝制破洞',
       sxys_num : '水洗遗失',       fzbl_num : '缝制不良',
       fzys_num : '缝制遗失',       sgyz_num : '色光严重',
       ml_num : '面料',       bc_num : '布疵'
    };
    /**
     * 订单损耗数量中涉及的列头信息
     * @type 
     */
    var fieldNameValueMap4others = {}
    var othersValueMap = {
        other1 : '其他1',
        other2 : '其他2',
        other3 : '其他3',
        other4 : '其他4',
        other5 : '其他5',
        other6 : '其他6',
        other7 : '其他7'
    }
    var generValueMap = {
        order_id : '订单号',
        ord_report_no : '完单登记号',
        sr_num : '损耗率',
        sew_num : '实裁数',
        product_num : '出货数',
        style_no : '款号',
        sr_total_num : '损耗数',
        cust_name : "客户",
        unregiestered : '未登记数',
        ins_num : '指令数',
        ord_num : '订单数',
        tailor_percent : '裁剪率'
    }
    Ext.apply(fieldNameValueMap4others,fieldNameValueMap);
    Ext.apply(fieldNameValueMap4others,othersValueMap);
    Ext.apply(fieldNameValueMap4others,generValueMap);
    
    
    
    
    
    
    
    
    

