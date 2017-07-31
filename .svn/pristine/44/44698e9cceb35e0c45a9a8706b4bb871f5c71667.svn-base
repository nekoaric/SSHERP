package com.cnnct.quartz.rfid.service.impl;
/**
 * 定时任务控制器
 * </br>提供服务来控制定时任务的执行状态
 * @author zhouww
 *
 */
public class QuartzControl {
    /**
     * 停止统计的定时任务
     */
    public static void concelCountQuartz(){
        ReportQuartz.cancelQuartz();
        OrdDayScheQuartz.cancelQuartz();
    }
    /**
     * 开始统计的定时任务
     */
    
    public static void executeCountQuartz(){
        ReportQuartz.executeQuartz();
        OrdDayScheQuartz.executeQuartz();
    }
}
