package com.cnnct.util;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.cnnct.common.ApplicationException;


/**
 * rifd系统的流程数据处理工具类
 * 
 * @author zhouww
 *
 */
public class NatureNumberUtil {
	/**
	 * 处理流程之间数据的短缺
	 * <br/>过滤没有实裁数的数据
	 * @param dto
	 * @return
	 * @throws Exception
	 */
	public static List doShort4nature(List list){
		if(list.size()==0){
			return list;
		}
		  for (Object o : list) {
	            Dto dto = (Dto) o;
	            //过滤不正确数据
	            if(dto.getAsDouble("real_cut_num") == null){
	            	continue;
	            }
	            //计算短缺情况
	            //领片短缺 = 领片数-实裁数
	            Double draw_short_num = doubleSub4Short(dto, "draw_num", "real_cut_num"); 
	            //缝制短缺 = 缝制下线数-实裁数
	            Double sew_short_num = doubleSub4Short(dto, "sew_num", "draw_num"); 
	            Double sew_delivery_short = 0d;
	            Double bach_accept_short_num = 0d;
	            Double bach_delivery_short_num = 0d;
	            Double pack_accept_short_num = 0d;
	            if(dto.getAsDouble("sew_delivery_num")!=0 || dto.getAsDouble("bach_accept_num")!=0 ||
	            		dto.getAsDouble("bach_delivery_num")!=0){
	            	//缝制交短缺=送水洗数-下线数
		            sew_delivery_short = doubleSub4Short(dto, "sew_delivery_num", "sew_num");
		            //水洗收短缺 = 水洗收数-送水洗数
		            bach_accept_short_num = doubleSub4Short(dto, "bach_accept_num", "sew_delivery_num"); 
		            //水洗交短缺 = 水洗交数-水洗收数
		            bach_delivery_short_num = doubleSub4Short(dto, "bach_delivery_num", "bach_accept_num"); 
		            //后整收短缺= 后整收-水洗收数
		            pack_accept_short_num = doubleSub4Short(dto, "pack_accept_num", "bach_delivery_num"); 
	            }else {
	            	if(dto.getAsDouble("pack_accept_num")!=0){
		                //后整收短缺 = 后整收-下线数
		                pack_accept_short_num = doubleSub4Short(dto, "pack_accept_num", "sew_num");
	            	}
	            }
	            //后整交短缺 = 交成品+交b品-后整收(成品短缺)
	            Double product_short_num = doubleSub4Short(dto, "f_product_num", "pack_accept_num");
	            product_short_num = DataUtil.doubleAdd(product_short_num,dto.getAsDouble("b_product_num"));
	            //收成品短缺=收成品-交成品
	            Double receive_f_product_short = doubleSub4Short(dto, "receive_f_product", "f_product_num");
	            //收B品短缺=收B品-交B品
	            Double receive_b_product_short = doubleSub4Short(dto, "receive_b_product", "b_product_num"); 
	          //成品短缺（成品应余）=出运成品-收成品
	            Double sendout_f_short = doubleSub4Short(dto, "sendout_f_product", "receive_f_product"); 
	          //B品短缺（B品应余）=出运B品-收B品
	            Double sendout_b_short = doubleSub4Short(dto, "sendout_b_product", "receive_b_product"); 
	            
	            dto.put("draw_short_num", draw_short_num);
	            dto.put("sew_short_num", sew_short_num);
	            dto.put("sew_delivery_short", sew_delivery_short);
	            dto.put("bach_accept_short_num", bach_accept_short_num);
	            dto.put("bach_delivery_short_num", bach_delivery_short_num);
	            dto.put("pack_accept_short_num", pack_accept_short_num);
	            dto.put("product_short_num", product_short_num);
	            dto.put("receive_f_product_short", receive_f_product_short);
	            dto.put("receive_b_product_short", receive_b_product_short);
	            dto.put("sendout_f_short", sendout_f_short);
	            dto.put("sendout_b_short", sendout_b_short);
	        }
		return list;
	}
	/**
     * 填充数据
     * <br/>
     * 如果后面的数据比前一流程的大那么修改前面的数据和后面的数据一样
     * @param list
     * @return
     */
    public static List fillData(List list){

    	List resultProd = new ArrayList();
    	 //如果flag：datafill 对产品数量 填充
        //需要填充的数量性质
    	for(Object o : list){
    		Dto dto = (Dto)o;
    		Long real_cut_num = dto.getAsLong("real_cut_num");
    		Long draw_num = dto.getAsLong("draw_num");
    		Long sew_num = dto.getAsLong("sew_num");
    		Long sew_delivery_num = dto.getAsLong("sew_delivery_num");
    		Long bach_accept_num  = dto.getAsLong("bach_accept_num");
    		Long bach_delivery_num  = dto.getAsLong("bach_delivery_num");
    		Long pack_accept_num  = dto.getAsLong("pack_accept_num");
    		Long f_product_num  = dto.getAsLong("f_product_num");
    		Long b_product_num  = dto.getAsLong("b_product_num");
    		Long receive_f_product  = dto.getAsLong("receive_f_product");
    		Long receive_b_product  = dto.getAsLong("receive_b_product");
    		Long sendout_f_product = dto.getAsLong("sendout_f_product");
    		Long sendout_b_product = dto.getAsLong("sendout_b_product");
    		
    		//过滤没有数据的信息
    		if(real_cut_num==null){
    			continue;
    		}
    		if(sendout_f_product>receive_f_product){
    			dto.put("receive_f_product", sendout_f_product);
    			receive_f_product = sendout_f_product;
    		}
    		if(sendout_b_product>receive_b_product){
    			dto.put("receive_b_product", sendout_b_product);
    			receive_b_product = sendout_b_product;
    		}
    		
    		if((receive_b_product-b_product_num)>0){
    			dto.put("b_product_num", receive_b_product);
    			b_product_num = receive_b_product;
    		}
    		if((receive_f_product-f_product_num)>0){
    			dto.put("f_product_num", receive_f_product);
    			f_product_num = receive_f_product;
    		}
    		if((b_product_num+f_product_num-pack_accept_num)>0){
    			dto.put("pack_accept_num",b_product_num+f_product_num);
    			pack_accept_num = b_product_num+f_product_num;
    		}
    		//是否跳过洗水流程(如果没有此三项的数据 跳过洗水数据处理）
    		if(dto.getAsDouble("sew_delivery_num")>0 || dto.getAsDouble("bach_accept_num")>0 ||
            		dto.getAsDouble("bach_delivery_num")>0){
        		if(pack_accept_num>bach_delivery_num){
        			dto.put("bach_delivery_num", pack_accept_num);
        			bach_delivery_num = pack_accept_num;
        		}
        		if(bach_delivery_num>bach_accept_num){
        			dto.put("bach_accept_num", bach_delivery_num);
        			bach_accept_num = bach_delivery_num;
        		}
        		if(bach_accept_num>sew_delivery_num){
        			dto.put("sew_delivery_num", bach_accept_num);
        			sew_delivery_num = bach_accept_num;
        		}
        		if(sew_delivery_num>sew_num){
        			dto.put("sew_num", sew_delivery_num);
        			sew_num = sew_delivery_num;
        		}
    		}else {
    			if(pack_accept_num>sew_num){
    				dto.put("sew_num", pack_accept_num);
    				sew_num = pack_accept_num;
    			}
    		}
    		if(sew_num>draw_num){
    			dto.put("draw_num", sew_num);
    			draw_num = sew_num;
    		}
    		if(draw_num>real_cut_num){
    			dto.put("real_cut_num",draw_num);
    		}
    		resultProd.add(dto);
    	}
    	return resultProd;
    }
    /**
     * 两数相减
     * @param dto
     * @param d1
     * @param d2
     * @return
     */
    private  static Double doubleSub4Short(Dto dto,String d1,String d2){
    	return DataUtil.doubleSub(dto.getAsDouble(d1)==null?0.0:dto.getAsDouble(d1),
        		dto.getAsDouble(d2));
    }
    /**
     * 将一条退货的数据用正常流程的数据表示,数量做反向处理
     * </br> 未考虑送水洗的步骤的流程
     * @param dto
     * @return
     */
    public static Dto parseDataToDel(Dto dto){
        return parseData4Rollback(dto, "delete");
    }
    /**
     * 回退数据的数据正向处理
     * @param dto
     * @return
     */
    public static Dto parseDataToAdd(Dto dto){
        return parseData4Rollback(dto, "add");
    }
    /**
     * 正常流程中涉及的退货流程
     * @param nature
     * @return
     * @throws ApplicationException
     */
    public static String  getRollbackNature4nature(String nature)throws ApplicationException{
        StringBuffer rollbackNatures = new StringBuffer(25);
        Map<String,List<String>> rollback2subnum = NatureUtil.getNatureCode2actionNature4rollback();
        for(Entry entry : rollback2subnum.entrySet()){
            List<String> natures = (List<String>)entry.getValue();
            if(natures.contains(nature)){
                rollbackNatures.append(",'").append(entry.getKey()).append("'");
                continue;
            }
        }
        if(rollbackNatures.length()>0){
            rollbackNatures.deleteCharAt(0);
        }
        return rollbackNatures.toString();
    }
    
    /**
     * 将一条退货的数据用正常流程的数据表示
     * </br>未考虑水洗的流程
     * @return
     */
    private static Dto parseData4Rollback(Dto dto,String flag){
        Dto natureDto = new BaseDto();
        natureDto.putAll(NatureUtil.getNatureCode2natureEn());
        
        String nature = dto.getAsString("nature");
        Long amount = dto.getAsLong("amount");
        amount = flag.equals("add")?amount : -amount;   //add表示正向处理 ，其他情况表示反向处理数据
        List<String> rollbackNature = NatureUtil.getActionNature4rollback(nature);
        //遍历正常流程，初始化数据
        for(Object obj : natureDto.keySet()){
            String natureNum = (String)obj;
            dto.put(natureDto.getAsString(natureNum),0);
        }
        //设置回退的数据
        for(String str : rollbackNature){
            dto.put(natureDto.getAsString(str),amount);
        }
        return dto;
    }
    
}
