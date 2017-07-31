package com.cnnct.quartz.rfid.service.impl;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import org.eredlab.g4.bmf.base.BaseServiceImpl;

/**
 * 定时处理生产通知单的历史记录
 * @author zhouww
 * 如果以后需要将历史记录放在独立表中，修改此定时任务
 */
public class HistoryQuartz extends BaseServiceImpl{
	private static final Lock lock = new ReentrantLock();
	/**
	 * 生产通知单历史处理
	 */
	public void updateHistoryQuartz(){
	    try{
	        boolean isLock = lock.tryLock(10, TimeUnit.SECONDS);
            if(!isLock){
                return;
            }
	    }catch(Exception e){
	        e.printStackTrace();
	    }
		try{
		    // 历史订单修改
			g4Dao.update("updateOrdBaseHistory");
			// 取消历史订单
			g4Dao.update("updateOrdBaseBackData4History");
			
			System.out.println("~===============历史订单处理");
		}catch(Exception e){
		    e.printStackTrace();
		}finally{
			lock.unlock();
		}
	}
}
