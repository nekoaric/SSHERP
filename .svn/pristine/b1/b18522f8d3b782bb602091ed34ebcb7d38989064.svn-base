package com.cnnct.rfid.service.impl;

import java.util.List;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.cnnct.common.ApplicationException;
import com.cnnct.rfid.service.OrdBasInfoService;
import com.cnnct.util.G4Utils;
import com.cnnct.util.GlobalConstants;

public class OrdBasInfoServiceImpl extends BaseServiceImpl implements
        OrdBasInfoService {
	
	/***
     * 订单信息查询
     */
    public Dto queryOrdBasInfo(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        //如果不是我的订单移除 ismyorder数据
        String ismyorder = pDto.getAsString("ismyorder");
        if(!"yes".equals(ismyorder.trim())){
            pDto.remove("ismyorder");
        }
        // 处理多个工厂，多个客户信息 2014.12.17
        String grps = pDto.getAsString("belong_grps");
        String custs = pDto.getAsString("cust_ids");
        
        if(!G4Utils.isEmpty(grps)){
            grps = grps.replaceAll("'", "''");
            String[] grpArr = grps.split(",");
            StringBuffer sb = new StringBuffer();
            for(String str : grpArr){
                sb = sb.append(",'").append(str).append("'");
            }
            if(sb.length()>1){
                sb = sb.deleteCharAt(0);
            }
            pDto.put("belong_grps", sb.toString());
        }
        
        
        if(!G4Utils.isEmpty(custs)){
            custs = custs.replaceAll("'", "''");
            String[] custArr = custs.split(",");
            StringBuffer sb = new StringBuffer();
            for(String str : custArr){
                sb = sb.append(",'").append(str).append("'");
            }
            if(sb.length()>1){
                sb = sb.deleteCharAt(0);
            }
            pDto.put("cust_ids", sb.toString());
        }
        
        
        List list = g4Dao.queryForPage("queryOrdBasInfo", pDto);
        //订单开始的数据处理
        for(Object o:list){
        	Dto dto = (Dto)o;
        	if("".equals(dto.getAsString("epc_start_date"))){
        		dto.put("start_date", dto.getAsString("ord_start_date"));
        	}else {
        		dto.put("start_date", dto.getAsString("epc_start_date"));
        	}
        }
        Integer totalCount = g4Dao.queryForPageCount("queryOrdBasInfo", pDto);
        outDto.put("jsonStrList", JsonHelper.encodeList2PageJson(list, totalCount, GlobalConstants.FORMAT_Date));
        return outDto;
    }
	
	public synchronized Dto addOrdBasDef(Dto inDto) throws ApplicationException {
		Dto outDto = new BaseDto();
		Integer seq_no = (Integer) g4Dao.queryForObject("getOrdBasMaxSeqNo",inDto);
		seq_no = seq_no == null ? 1 : (seq_no + 1);
        String seqNo = String.format("%08d",seq_no);
		inDto.put("seq_no", seqNo);
//		inDto.put("orderisconfirm", 0);
//		Integer costumeId = (Integer) g4Dao.queryForObject("getMaxGymCostumeId", inDto);
//		costumeId = costumeId == null ? 1 : (costumeId + 1);
//		inDto.put("costumeid", costumeId);
//		Integer orderDetailId = (Integer) g4Dao.queryForObject("getMaxGymOrderDetailId", inDto);
//		orderDetailId = orderDetailId == null ? 1 : (orderDetailId + 1);
//		inDto.put("orderdetailid", orderDetailId);
		inDto.put("state", "0");
		g4Dao.insert("insertOrdBasInfo", inDto);
//		g4Dao.insert("insertGymOrderDef", inDto);
//		g4Dao.insert("insertGymOrderDetail", inDto);
		outDto.put("msg", "订单信息登记成功!");
		outDto.put("success", true);
		return outDto;
	}

	public Dto updateOrdBasInfo(Dto inDto) throws ApplicationException {
		Dto outDto = new BaseDto();
		g4Dao.update("updateOrdBasInfo", inDto);
		outDto.put("msg", "订单信息修改成功!");
		outDto.put("success", true);
		return outDto;
	}
	
	public Dto deleteOrdBasInfo(Dto inDto) throws ApplicationException {
		Dto outDto = new BaseDto();
		g4Dao.update("deleteOrdBasInfo", inDto);
		outDto.put("msg", "信息删除成功!");
		outDto.put("success", true);
		return outDto;
	}
}
