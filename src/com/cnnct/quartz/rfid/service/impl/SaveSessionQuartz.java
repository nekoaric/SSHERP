package com.cnnct.quartz.rfid.service.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;

import com.cnnct.quartz.rfid.service.TaskQuartzService;

/**
 * 请求日志保存到数据库中
 * @author zhouww
 * @since 2014-9-26
 */
public class SaveSessionQuartz extends BaseServiceImpl implements TaskQuartzService{
	/**
	 * 采用两个集合目的是日志的添加和日志的处理可以同时处理
	 */
	private static List<Dto> resultList = Collections.synchronizedList(new ArrayList<Dto>());
	
	private static Lock lock = new ReentrantLock();
	/**
	 * 添加新的请求信息
	 * @param dto
	 */
	public static void addSessionInfo(Dto dto){
		resultList.add(dto);
	}

	/**
	 * 订单任务入口方法
	 * @throws Exception
	 */
	public void quartzExecute() throws Exception {
		//为空的数据不处理
		if(resultList.size()==0){
			return;
		}
		try{
            if(!lock.tryLock(200,TimeUnit.MILLISECONDS)){	// 超出时间为200毫秒
                return;
            }
        }catch(Exception e){
            e.printStackTrace();
        }
		// 创建一个备份集合用来操作数据库，使用完毕移除原有数据
		try{
			if(resultList.size()>0){	// 数据不为空则处理
				List<Dto> resultBackup = new ArrayList<Dto>();
				resultBackup.addAll(resultList);
				g4Dao.batchInsertBaseDto("insertSysSessionList", resultBackup);
				resultList.removeAll(resultBackup);
			}
		}catch(Exception e){
			e.printStackTrace();
		}finally{
			lock.unlock();
		}
		
	}
}
