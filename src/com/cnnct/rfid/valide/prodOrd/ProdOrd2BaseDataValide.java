package com.cnnct.rfid.valide.prodOrd;

import java.util.List;

import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.cnnct.common.ApplicationException;
import com.cnnct.dataInterface.ValideDataAdapter;
import com.cnnct.util.G4Utils;
import com.cnnct.util.TimeUtil;

/**
 * 验证订单的基础数据验证包含订单导入和网页形式订单
 * @author zhouww
 *
 */
public class ProdOrd2BaseDataValide extends ValideDataAdapter{
    
    public ProdOrd2BaseDataValide(){}
    
    public ProdOrd2BaseDataValide(Dto inDto,IReader iReader){
        this.inDto = inDto;
        this.iReader = iReader;
    }
    
    @SuppressWarnings("unchecked")
    public void valideDate() throws ApplicationException {
        //提取需要验证的数据
        String bach_facName = inDto.getAsString("bach_facName");
        String pack_facName = inDto.getAsString("pack_facName");
        String sew_facName = inDto.getAsString("sew_facName");  
        String bach_fac = inDto.getAsString("bach_fac");
        String pack_fac = inDto.getAsString("pack_fac");
        String sew_fac = inDto.getAsString("sew_fac"); 
        String area_no = inDto.getAsString("area_no");  
        String check_prod_date = inDto.getAsString("check_prod_date");  
        String sew_start_date = inDto.getAsString("sew_start_date");
        String opr_date = inDto.getAsString("opr_date");
        String fob_deal_date = inDto.getAsString("fob_deal_date");
        String notity_date = inDto.getAsString("notity_date");
        String sew_delivery_date = inDto.getAsString("sew_delivery_date");
        String bach_delivery_date = inDto.getAsString("bach_delivery_date");
        String pack_delivery_date = inDto.getAsString("pack_delivery_date");
        String plan_check_date = inDto.getAsString("plan_check_date");
        String purchase_check_date = inDto.getAsString("purchase_check_date");
        String tech_check_date = inDto.getAsString("tech_check_date");
        String trade_check_date = inDto.getAsString("trade_check_date");
        String cust_name = inDto.getAsString("cust_name");
        String prod_ord_seq = inDto.getAsString("prod_ord_seq");
        String ord_seq_no = inDto.getAsString("ord_seq_no");
        String opr_merchandiser = inDto.getAsString("opr_merchandiser");
        String add_proportion=inDto.getAsString("add_proportion");
        String allow_loss_per=inDto.getAsString("allow_loss_per");
        String order_num=inDto.getAsString("order_num");
        //一个异常汇总信息
        StringBuffer errsb= new StringBuffer();
        
        //验证跟单员必填
        if("".equals(opr_merchandiser)){
        	errsb.append("</br>[跟单员]跟单员信息为必填");
        }
        if("".equals(order_num)){
        	errsb.append("</br>[总数]订单总数必填");
        }
        //验证客户的正确性
        String cust_id = inDto.getAsString("cust_id");
        if(!"".equals(cust_name) && "".equals(cust_id)){
            //throw new ApplicationException("[客户/品牌]信息错误,请现在系统中登记对应信息!");
        	errsb.append("</br>[客户/品牌]信息错误,请现在系统中登记对应信息!");
        }
        //验证区域填写
        if("".equals(area_no)){
            //throw new ApplicationException("[区域验证]区域信息为必须填");
        	errsb.append("</br>[区域验证]区域信息为必须填");
        }
        
//        //验证缝制工厂填写
//        if("".equals(sew_fac)){
//            //throw new ApplicationException("[缝制工厂验证]缝制工厂为必须填");
//        	errsb.append("</br>[缝制工厂验证]请确认缝制工厂名称");
//        }
        if(G4Utils.isEmpty(fob_deal_date)){
        	errsb.append("</br>[FOB交期]FOB交期必须填写");
        }
        //验证日期
        String defaultPatter = "yyyy-MM-dd";
        if(!TimeUtil.isValidDate(check_prod_date, defaultPatter, true)){
            //throw new ApplicationException("[尾查期]格式错误（日期格式格式为\"20130101\"），请核对日期格式");
        	errsb.append("</br>[尾查期]格式错误（日期格式格式为\"20130101\"），请核对日期格式");
        }
        if(!TimeUtil.isValidDate(sew_start_date, defaultPatter, true)){
            //throw new ApplicationException("[缝制起始日期]格式错误（日期格式格式为\"20130101\"），请核对日期格式");
        	errsb.append("</br>[缝制起始日]格式错误（日期格式格式为\"20130101\"），请核对日期格式");
        }
        if(!TimeUtil.isValidDate(opr_date, defaultPatter, true)){
            //throw new ApplicationException("[制单日期]格式错误（日期格式格式为\"20130101\"），请核对日期格式");
        	errsb.append("</br>[制单日期]格式错误（日期格式格式为\"20130101\"），请核对日期格式");
        }
        if(!TimeUtil.isValidDate(fob_deal_date, defaultPatter, true)){
            //throw new ApplicationException("[fob交期]格式错误（日期格式格式为\"20130101\"），请核对日期格式");
        	errsb.append("</br>[fob交期]格式错误（日期格式格式为\"20130101\"），请核对日期格式");
        }
        if(!TimeUtil.isValidDate(notity_date, defaultPatter, true)||"".equals(notity_date)){
            //throw new ApplicationException("[通知日期]必须填写或者格式错误（日期格式格式为\"20130101\"），请核对");
        	errsb.append("</br>[通知日期]格式错误（日期格式格式为\"20130101\"），请核对日期格式");
        }
        if(!TimeUtil.isValidDate(sew_delivery_date, defaultPatter, true)){
            //throw new ApplicationException("[缝制交货日期]格式错误（日期格式格式为\"20130101\"），请核对日期格式");
        	errsb.append("</br>[缝制交货日]格式错误（日期格式格式为\"20130101\"），请核对日期格式");
        }
        if(!TimeUtil.isValidDate(bach_delivery_date, defaultPatter, true)){
            //throw new ApplicationException("[水洗交货日期]格式错误（日期格式格式为\"20130101\"），请核对日期格式");
        	errsb.append("</br>[水洗交货日期]格式错误（日期格式格式为\"20130101\"），请核对日期格式");
        }
        if(!TimeUtil.isValidDate(pack_delivery_date, defaultPatter, true)){
            //throw new ApplicationException("[后整交货日期]格式错误（日期格式格式为\"20130101\"），请核对日期格式");
        	errsb.append("</br>[后整交日期]格式错误（日期格式格式为\"20130101\"），请核对日期格式");
        }
        if(!TimeUtil.isValidDate(plan_check_date, defaultPatter, true)){
            //throw new ApplicationException("[计划审核日期]格式错误（日期格式格式为\"20130101\"），请核对日期格式");
        	errsb.append("</br>[计划审核日期]格式错误（日期格式格式为\"20130101\"），请核对日期格式");
        }
        if(!TimeUtil.isValidDate(purchase_check_date, defaultPatter, true)){
            //throw new ApplicationException("[采购审核日期]格式错误（日期格式格式为\"20130101\"），请核对日期格式");
        	errsb.append("</br>[采购审核日期]格式错误（日期格式格式为\"20130101\"），请核对日期格式");
        }
        if(!TimeUtil.isValidDate(tech_check_date, defaultPatter, true)){
            //throw new ApplicationException("[技术审核日期]格式错误（日期格式格式为\"20130101\"），请核对日期格式");
        	errsb.append("</br>[技术审核日]格式错误（日期格式格式为\"20130101\"），请核对日期格式");
        }
        if(!TimeUtil.isValidDate(trade_check_date, defaultPatter, true)){
            //throw new ApplicationException("[贸易审核日期]格式错误（日期格式格式为\"20130101\"），请核对日期格式");
        	errsb.append("</br>[贸易审核日期]格式错误（日期格式格式为\"20130101\"），请核对日期格式");
        }
        Dto dbDto = new BaseDto();
        //如果excel有信息而没有找到对应关系则有错
//        if(!"".equals(sew_facName)&&"".equals(sew_fac)){
//            //throw new ApplicationException("[缝制工厂]信息错误,请查看分厂企业信息!");
//            errsb.append("</br>[缝制工厂]填写错误,请查看分厂规范叫法!");
//        }
//        if(!"".equals(bach_facName)&&"".equals(bach_fac)){
//            //throw new ApplicationException("[水洗工厂]信息错误,请查看分厂企业信息!");
//        	errsb.append("</br>[水洗工厂]填写错误,请查看分厂规范叫法!");
//        }
//        if(!"".equals(pack_facName)&&"".equals(pack_fac)){
//            //throw new ApplicationException("[后整工厂]信息错误,请查看分厂企业信息!");
//        	errsb.append("</br>[后整工厂]填写错误,请查看分厂规范叫法!");
//        }
        //验证生产通知单
        if("".equals(prod_ord_seq)){
            //throw new ApplicationException("请填写生产通知单，请检查");
        	errsb.append("<br/>请填写生产通知单，请检查");
        }
        //判断订单号
        if("".equals(ord_seq_no)){
            //throw new ApplicationException("请填写订单号，请检查");
        	errsb.append("</br>请填写订单号，请检查");
        }
        //fob交期不能为空
        if(G4Utils.isEmpty(fob_deal_date)){
        	errsb.append("fob交期不能为空");
        }
        
        //尾查期不能为空
        if(G4Utils.isEmpty(check_prod_date)){
        	errsb.append("尾查期不能为空");
        }
        //修改尾查期和fob交期的判断条件
        if(!"".equals(fob_deal_date)&& !"".equals(check_prod_date) && TimeUtil.comDate(check_prod_date, fob_deal_date)){
            //throw new ApplicationException("尾查期不能晚于fob交期");
        	errsb.append("尾查期不能晚于fob交期");
        }
        
        //加裁比利必填
        if(G4Utils.isEmpty(add_proportion)){
        	errsb.append("加裁比利必须填写");
        }
        
//        if(G4Utils.isEmpty(allow_loss_per)){
//        	errsb.append("允许损耗分类必须填写");
//        }
        
        String errMsg=errsb.toString();
        if(errMsg.length()>0){
        	throw new ApplicationException("</br>生产通知单"+prod_ord_seq+"(订单号"+ord_seq_no+")导入失败"+errMsg+"\n");
        }
    }
}
