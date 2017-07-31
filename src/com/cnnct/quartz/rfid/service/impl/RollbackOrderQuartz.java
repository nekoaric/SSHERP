package com.cnnct.quartz.rfid.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.alibaba.druid.support.logging.Log;
import com.alibaba.druid.support.logging.LogFactory;
import com.cnnct.util.G4Utils;
import com.cnnct.util.NatureNumberUtil;
import com.cnnct.util.NatureUtil;

/**
 * 订单退货的定时任务
 * 
 * @author zhouww
 *
 */
@SuppressWarnings("unchecked")
public class RollbackOrderQuartz extends BaseServiceImpl{
    //日志工具
    Log log = LogFactory.getLog(RollbackOrderQuartz.class);
    //退货定时任务锁
    private static Lock rollbackLock = new ReentrantLock();
    //定时任务执行标识
    private static boolean isExecute = true;
    
    public void rollback4orddaylist() throws Exception{
        if(!isExecute){
            System.out.println("未检测到定时任务，回退操作");
            return;
        }
        try{
            if(!rollbackLock.tryLock(1,TimeUnit.SECONDS)){
                log.debug(Thread.currentThread().getName() + " interrupt");
                return;
            }
        }catch(Exception e){
            e.printStackTrace();
        }
        try{
            Thread.currentThread().sleep(2000);
            //处理订单的退货数据处理
            rollback4order();
            //处理生产通知单的退货数据处理
            rollback4prodord();
        }catch(Exception e){
            e.printStackTrace();
        }finally{
           rollbackLock.unlock();
        }
    }
    /**
     * 处理订单的退货数据
     * @throws Exception
     */
    private void rollback4order()throws Exception{
        //查询出所有的回退数据
        //处理回退数据变为正常流程的数据
        //对统计的数据进行处理
        Dto dbDto = new BaseDto();
        //先修改需要统计的流程数据状态为8，独立设置状态，避免在处理定时任务的时候出现插入流水数据的异常
        dbDto.put("update_ord_status", "8");
        dbDto.put("ord_status", "0");
        dbDto.put("natures", getRollbackNature());
        g4Dao.update("updateStatusInOrdDayList", dbDto);
        dbDto = new BaseDto();
        dbDto.put("ord_status", "8");
        List ordDayList = g4Dao.queryForList("getOrdDayListByStatus", dbDto);  //查询未同步和待同步的epc流程数据
        //没有数据则返回
        if(G4Utils.isEmpty(ordDayList)){
            return;
        }
        //定义最后操作数据库的集合
        //将每条数据处理后符合数据数据的格式
        //批处理数据
        List<Dto> resultList = new ArrayList<Dto>();
        for(Object obj : ordDayList){
            Dto beanDto = (Dto)obj;
            Dto resultDto = NatureNumberUtil.parseDataToDel(beanDto);
            resultDto.put("state", "0");
            resultDto.put("status", "0");
            resultList.add(resultDto);
        }
        g4Dao.batchInsertBaseDto("insertOrdDaySche", resultList);
        
        //修改更新状态
        dbDto.put("update_ord_status", "1");
        dbDto.put("ord_status", "8");
        g4Dao.update("updateStatusInOrdDayList",dbDto);
    }
    /**
     * 处理生产通知的退货数据
     * @throws Exception
     */
    private void rollback4prodord()throws Exception{
        //查询出所有的回退数据
        //处理回退数据变为正常流程的数据
        //对统计的数据进行处理
        Dto dbDto = new BaseDto();
        //先修改需要统计的流程数据状态为8，独立设置状态，避免在处理定时任务的时候出现插入流水数据的异常
        dbDto.put("prodord_status", "8");
        dbDto.put("start_status", "0");
        dbDto.put("natures", getRollbackNature());
        g4Dao.update("updateOrdDayList4Prodord", dbDto);
        dbDto = new BaseDto();
        dbDto.put("prodord_status", "8");
        List ordDayList = g4Dao.queryForList("getStreamDataByProdordStatus", dbDto);  //查询未同步和待同步的epc流程数据
        //没有数据则返回
        if(G4Utils.isEmpty(ordDayList)){
            return;
        }
        //定义最后操作数据库的集合
        //将每条数据处理后符合数据数据的格式
        //批处理数据
        List<Dto> resultList = new ArrayList<Dto>();
        for(Object obj : ordDayList){
            Dto beanDto = (Dto)obj;
            Dto resultDto = NatureNumberUtil.parseDataToDel(beanDto);
            resultDto.put("state", "0");
            resultDto.put("status", "0");
            resultList.add(resultDto);
        }
        g4Dao.batchInsertBaseDto("insertProdordDaySche", resultList);
        
        //修改更新状态
        dbDto = new BaseDto();
        dbDto.put("prodord_status", "1");
        dbDto.put("start_status", "8");
        dbDto.put("natures", getRollbackNature());
        g4Dao.update("updateOrdDayList4Prodord",dbDto);
        
    }
    /**
     * 组合退货的流程性质
     * @return
     */
    private String getRollbackNature(){
        List<String> rollback = NatureUtil.getRollbackNature();
        StringBuffer sb = new StringBuffer(80);
        for(String str : rollback){
            sb.append(",'").append(str).append("'");
        }
        if(sb.length()>0){
            sb.deleteCharAt(0);
            return sb.toString();
        }
        return "";
    }
    /**
     * 取消定时任务
     */
    public static void concelQuartz(){
        try{
            boolean lock1 = false;
            while(!lock1){
                try{
                    lock1 = rollbackLock.tryLock(3,TimeUnit.SECONDS);
                }catch(Exception e){}
            }
            isExecute = false;
        }catch(Exception e){
            e.printStackTrace();
        }finally{
            rollbackLock.unlock();
        }
    }
    /**
     * 开启定时任务
     */
    public static void executeQuartz(){
        isExecute = true;
    }
  
}
