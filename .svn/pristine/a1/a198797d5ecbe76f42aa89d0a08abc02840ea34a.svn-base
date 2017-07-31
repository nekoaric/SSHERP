package com.cnnct.quartz.rfid.service.impl;

import java.util.List;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.cnnct.util.G4Utils;


public class ProdStatusQuartz extends BaseServiceImpl  {
	public void updateProdStatusInProdOrdInfo() throws Exception {
		// 根据订单状态获取未排产、在产中的订单
		// 从汇总表中获得上述订单的总进度详情判断开裁数>0 等情况
		// 更新，end
		try{
			List ProdList = g4Dao.queryForList("getOrdSeqNoByProdstatus");
			for (int i = 0; i < ProdList.size(); i++) {
				Dto dto= new BaseDto();
				dto = (Dto) ProdList.get(i);
				Dto dDto = (Dto) g4Dao.queryForObject("getSumCutSendNumInOrdSche", dto);
				//没有统计数据就跳过
				if(dDto==null){
					continue;
				}
				//只要有流程有数量
				if (convertNullTo0( dDto.getAsInteger("real_cut_num"))+
						convertNullTo0( dDto.getAsInteger("draw_num"))+
						convertNullTo0( dDto.getAsInteger("sew_num"))+
						convertNullTo0( dDto.getAsInteger("bach_accept_num"))+
						convertNullTo0( dDto.getAsInteger("bach_delivery_num"))+
						convertNullTo0( dDto.getAsInteger("pack_accept_num"))+
						convertNullTo0( dDto.getAsInteger("f_product_num"))+
						convertNullTo0( dDto.getAsInteger("b_product_num"))+
						convertNullTo0( dDto.getAsInteger("receive_f_product"))+
						convertNullTo0( dDto.getAsInteger("receive_b_product"))+
						convertNullTo0( dDto.getAsInteger("sew_delivery_num"))
						> 0 ) {
					dto.put("prodstatus", 1);
					dto.put("new_opr_date", G4Utils.getCurrentTime("yyyy-MM-dd hh-mm-ss"));
				}
				//如果开裁为0 判断指令数和出运数的关系
				double ins_num=convertNullTo0( dto.getAsInteger("order_num"))*(convertNullTo0(dto.getAsDouble("add_proportion")+1));
				if(convertNullTo0( dDto.getAsInteger("real_cut_num"))>ins_num){
					if(ins_num*0.75<convertNullTo0( dDto.getAsInteger("sendout_f_product"))){
						dto.put("prodstatus", 2);
						dto.put("new_opr_date", G4Utils.getCurrentTime("yyyy-MM-dd hh-mm-ss"));
					}
				}else{
					if(convertNullTo0( dDto.getAsInteger("real_cut_num"))*0.75<convertNullTo0( dDto.getAsInteger("sendout_f_product"))){
						dto.put("prodstatus", 2);
						dto.put("new_opr_date", G4Utils.getCurrentTime("yyyy-MM-dd hh-mm-ss"));
					}
				}
				g4Dao.update("updateProdStatusByOderId",dto);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public double convertNullTo0(Object o){
		
		if(o==null){
		return 0;
		}else{
		return Double.parseDouble(o.toString());
		}
	}
}
