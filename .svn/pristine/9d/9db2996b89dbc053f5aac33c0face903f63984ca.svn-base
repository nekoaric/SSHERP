package com.cnnct.quartz.rfid.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import org.eredlab.g4.bmf.base.MultiDSServiceImpl;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.springframework.beans.factory.BeanFactory;

import com.cnnct.quartz.rfid.service.TaskQuartzService;
import com.cnnct.util.G4Utils;
import com.cnnct.util.NatureUtil;
/**
 * 从sqlserver同步数据
 * 从ReportQuartz中分离
 * @author xutj
 * @since 2015-09-01
 */
public class HungReportQuartz extends MultiDSServiceImpl implements TaskQuartzService{
	
	
	//一次处理的最多数量
    private static final int MAX_BATCH_NUM = 100000; 
    // 订单统计锁
    public static final Lock ordLock = new ReentrantLock();
    
    //控制定时任务是否执行的状态false：不执行，true，执行 
    private static boolean isExecute = true;
    
    public void quartzExecute() throws Exception {

        if(!isExecute){
            //定时任务未开启
        	
            System.out.println("同步任务未开启");
            return ;
        }
        try{
            boolean getLock = ordLock.tryLock(1, TimeUnit.SECONDS);
            if (!getLock) {
                return;
            }
        }catch(Exception e){
            e.printStackTrace();
        }
        try {
            //同步数据
        	sysHungReportAll();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            ordLock.unlock();  //释放锁
        }
    
    }
    /**
     *同步数据按照当前日期
     * @throws Exception
     */
    private void sysHungReportByDay()throws Exception{
    	Dto qDto=new BaseDto();
    	qDto.put("cur_date", G4Utils.getCurDate());
    	List rs=sDao.queryForList("queryHungProgress4sys",qDto);
    	System.out.println(G4Utils.getCurDate()+"同步到"+rs.size()+"条数据");
    	g4Dao.batchInsert(rs, "sysHungProgressInfoByDate");
    }
    /**
     *同步所有
     * @throws Exception
     */
    private void sysHungReportAll()throws Exception{
    	List rs=sDao.queryForList("queryHungProgress4sys");
    	System.out.println("同步到"+rs.size()+"条数据");
    	g4Dao.batchInsert(rs, "sysHungProgressInfoByDate");
    }
    
    /**
     * 取消定时任务
     */
    public static void cancelQuartz(){
        //获取所有的锁后设置定时任务状态
        //设置完毕 释放锁
        try{
            boolean lock1 = false;
            boolean lock2 = false;
            while(!lock2){
                try{
                    lock2 = ordLock.tryLock(3, TimeUnit.SECONDS);
                }catch(Exception e){}
            }
            isExecute = false;
        }catch(Exception e){
            e.printStackTrace();
        }finally{
            ordLock.unlock();
        }
    }
    /**
     * 执行定时任务
     */
    public static void executeQuartz(){
        isExecute = true;
    }
	
    protected Object getService(String pBeanId) {
		Object springBean = SpringBeanLoader.getSpringBean(pBeanId);
		return springBean;
	}
    
}
