/****************************************************************************
 * Project Name:JDURFID
 * File Name:ReportQuartz2.java
 * Package Name:com.cnnct.quartz.rfid.service.impl
 * Date:2015-11-4
 * Copyright (c) 2015, http://www.jdunited.com All Rights Reserved.
 *
 *************************************************************************/
package com.cnnct.quartz.rfid.service.impl;

import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Set;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.alibaba.druid.support.logging.Log;
import com.alibaba.druid.support.logging.LogFactory;
import com.cnnct.util.G4Utils;
import com.cnnct.util.NatureUtil;

/**
 * 这里用一句话描述这个类的作用
 * @className: ReportQuartz2 
 * @author xutj
 * @date 2015-11-4 
 */
public class ReportQuartz2 extends BaseServiceImpl {
	//日志
	private Log log =LogFactory.getLog(ReportQuartz.class);
	
	public synchronized void generateReport(){
		//同步开始
		try {
			//汇总流水表成为日进度表
			//按操作日汇总
			genOrdDayList4DaySche();
			//汇总日进度表为总进度表
			genDaySche4OrdSche();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}
	/**
	 * 汇总流水表成为日进度表
	 * @author xutj 
	 * @date 2015-11-4
	 */
	private void genOrdDayList4DaySche() {
		
		Dto natureDto = new BaseDto();
		natureDto.putAll(NatureUtil.getNatureCode2natureEn());
		
		
		Dto qDto=new BaseDto();
		//按日汇总数据，默认为当天opr_time
		qDto.put("opr_time",G4Utils.getCurDate());
		// 获取需要汇总的数据
		//第一次需汇总所有数据
		int c=(Integer) g4Dao.queryForObject("getDayScheCount");
		if (c==0) {
			qDto.remove("opr_time");
		}
		//查询所有需要汇总的记录
		List ords=g4Dao.queryForList("getOrder_idsByDate",qDto);
		if (ords.size()>0) {
			for (Object obj : ords) {
				Dto dto = (Dto) obj;
				String tr_date = dto.getAsString("tr_date");
				if (tr_date.length() > 10) {
					tr_date = tr_date.substring(0, 10);
					dto.put("tr_date", tr_date);
				}
				String nature = natureDto
				        .getAsString(dto.getAsString("nature"));
				dto.put(nature, dto.getAsInteger("amount"));
				// 将其他流程数据设置为0 为了插入数据
				Set<String> setKey = natureDto.keySet();
				for (String str : setKey) {
					String dtoNature = natureDto.getAsString(str);
					if (!dtoNature.equals(nature)) {
						dto.put(dtoNature, 0);
					}
				}
				dto.put("state", 0);
				dto.put("status", 0);
			}
			
		}
		
		
	}
	/**
	 *汇总日进度表为总进度表
	 * @author xutj 
	 * @date 2015-11-4
	 */
	private void genDaySche4OrdSche() {
		// TODO Auto-generated method stub
		
	}

	
}
