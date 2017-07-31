package com.cnnct.quartz.rfid.service.impl;

import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.cnnct.quartz.rfid.service.TaskQuartzService;

/**
 * 处理用户登录信息的定时任务
 * 
 * @author zhouww
 * @since 2014-11-13
 */
public class AccountLoginQuartz extends BaseServiceImpl implements TaskQuartzService {

	/**
	 * 处理当天登录的数据 <br/>
	 * 处理的情况： <br/>
	 * 1)当天登录，当天注销 <br/>
	 * 2)今天以前登录，今天结束 <br/>
	 * 3)今天以前登录，今天后结束 <br/>
	 * 4)今天登录，今天后结束
	 */
	public void quartzExecute() throws Exception {
		try {
			// 这个处理和定时任务的时间有关系，如果定时任务是当天，采用当天日期，如果定时任务是第二天，那么日期就是昨天的日期
			// 定时任务在第二天凌晨处理
			// 第一次做日期的遍历从昨天开始
			// 1)获取处理日期的毫秒时间段
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(new Date());
			calendar.add(Calendar.DAY_OF_MONTH, -1);
			String[] times = getTimeInfos(calendar.getTime());

			// 2)查询结果数据
			Dto dbDto = new BaseDto();
			dbDto.put("starttime", times[0]);
			dbDto.put("endtime", times[1]);
			List<Dto> resultDtos = g4Dao.queryForList("queryAccountLoginInfo",
					dbDto);
			g4Dao.batchUpdateBaseDto("updateAccountLoginInfo", resultDtos);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 获取指定日期的凌晨(yyyy-mm-dd 00:00:00)和结束的(yyyy-mm-dd 23:59:59)时间
	 * 
	 * @param date
	 *            yyyy-MM-dd
	 * @return String[][0]:凌晨时间 String[][1]： 结束时间
	 */
	public static String[] getTimeInfos(String dateStr) throws Exception {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Date date = sdf.parse(dateStr);
		return getTimeInfos(date);
	}

	/**
	 * getTimeInfos重载
	 * 
	 * @param date
	 * @return
	 */
	private static String[] getTimeInfos(Date date) {
		String[] result = new String[2];

		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		long startTime = date.getTime();

		date.setHours(23);
		date.setMinutes(59);
		date.setSeconds(59);
		long endTime = date.getTime();
		// System.out.println("startTime:" + startTime +" endTime: " + endTime
		// +"  times:" + (endTime-startTime));
		result[0] = String.valueOf(startTime);
		result[1] = String.valueOf(endTime);
		return result;

	}

}
