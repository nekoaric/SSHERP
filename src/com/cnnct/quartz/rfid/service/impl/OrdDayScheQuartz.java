package com.cnnct.quartz.rfid.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.cnnct.quartz.rfid.service.TaskQuartzService;
import com.cnnct.util.NatureUtil;
/**
 * 订单数量信息，统计定时任务
 * 从ReportQuartz中分离
 * @author zhouww
 * @since 2015-03-16
 */
public class OrdDayScheQuartz extends BaseServiceImpl implements TaskQuartzService{
  //一次处理的最多数量
    private static final int MAX_BATCH_NUM = 100000; 
    // 订单统计锁
    public static final Lock ordLock = new ReentrantLock();
    
    //控制定时任务是否执行的状态false：不执行，true，执行 
    private static boolean isExecute = true;
    
    public void quartzExecute() throws Exception {

        if(!isExecute){
            //定时任务未开启
            System.out.println("订单未检测到定时任务");
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
            //日进度表
            generateProdordDaysche();
            //总进度表
            generateOrdScheList();
            
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            ordLock.unlock();  //释放锁
        }
    
    }
    /**
     * 生成生产通知单日进度
     * @throws Exception
     */
    private void generateProdordDaysche()throws Exception{
        Dto qDto = new BaseDto();
        // 获取流程状态
        Dto natureDto = new BaseDto();
        natureDto.putAll(NatureUtil.getNatureCode2natureEn());
        // 获取标签流水记录
        qDto.put("ord_status", "'0'");
        qDto.put("update_ord_status", "9");
        qDto.put("natures",getNatures());
        qDto.put("maxBatch", MAX_BATCH_NUM);
        g4Dao.update("updateStatusInOrdDayList", qDto);
        qDto = new BaseDto();
        qDto.put("ord_status", "'9'");
        List ordDayList = g4Dao.queryForList("getOrdDayListByStatus", qDto);

        if (ordDayList.size() != 0) {
            // 更新查找到的记录状态为已用于记录报表
            qDto = new BaseDto();
            qDto.put("ord_status", "'9'");
            qDto.put("update_ord_status", "1");
            g4Dao.update("updateStatusInOrdDayList", qDto);
        }

        for (int i = 0; i < ordDayList.size(); i++) {
            Dto ordDayDto = (Dto) ordDayList.get(i);

            String tr_date = ordDayDto.getAsString("tr_date");
            if (tr_date.length() > 10) {
                tr_date = tr_date.substring(0, 10);
            }
            ordDayDto.put("tr_date", tr_date);
            String nature = natureDto.getAsString(ordDayDto
                    .getAsString("nature"));
            if ("".equals(nature)) {
                ordDayList.remove(i);
                i--;
                continue;
            }
            Integer amount = ordDayDto.getAsInteger("amount");  
            ordDayDto.put(nature, amount==null?0:amount);// 设置某个数量性质要增加的数量,为null的数量性质数量为0

            // 设置其他的数量性质要新增的数量为0(用于初始化)
            for (Object o : natureDto.keySet()) {
                String key = (String) o;
                String value = natureDto.getAsString(key);
                if (!value.equals(nature)) {
                    ordDayDto.put(value, 0);
                }
            }

            ordDayDto.put("state", "0");
            ordDayDto.put("status", "0");// 待订单明细同步
        }
        //统计处理订单日进度数据
        List<Dto> dbList = new ArrayList<Dto>();
        for(Object obj : ordDayList){
            Dto dto = (Dto)obj;
            dbList = addDto2List(dbList,dto); 
        }
        // 如果存在数据则更新
        if (ordDayList.size() != 0) {
            // 更新对应日进度信息
//            System.out.println("更新数量为：" + dbList.size());
            g4Dao.batchUpdateBaseDto("insertOrdDaySche", dbList);
        }
    }
    
    /**
     * 生成订单进度列表
     */
    private void generateOrdScheList() throws Exception {
        Dto qDto = new BaseDto();
        qDto.put("status", "9");
        qDto.put("start_status", "0");
        qDto.put("maxBatch", MAX_BATCH_NUM);
        g4Dao.update("updateStatusInOrdDaySche",qDto);
        // 获取有更新的订单日进度中的product_id,在汇总对应的信息
        List OrdScheList = g4Dao
                .queryForList("getSumOrdDayScheByOrderId", qDto);

        if (OrdScheList.size() > 0) {
            // 更新订单日进度中state
            qDto.put("status", "1");
            qDto.put("start_status", "9");
            g4Dao.update("updateStatusInOrdDaySche", qDto);
        }
        // 更新订单进度表
        g4Dao.batchInsert(OrdScheList, "insertOrdScheList");

    }
    
    /**
     * dto添加到集合中；相同的订单日期做一条数据处理 
     * @param dbList
     * @param dbDto
     * @return
     */
    private List<Dto> addDto2List(List<Dto> dbList,Dto dbDto){
        String order_id = dbDto.getAsString("order_id");
        String tr_date = dbDto.getAsString("tr_date");
        Dto resultDto = null;
        Dto removeDto = null;
        for(Dto dto : dbList){
            resultDto = null;
            removeDto = null;
            String db_order_id = dto.getAsString("order_id");
            String db_tr_date = dto.getAsString("tr_date");
            if(order_id.equals(db_order_id) && 
                    tr_date.equals(db_tr_date)){
                resultDto = addDto(dto,dbDto);
                removeDto = dto;
                break;
            }
        }
        if(resultDto == null){ //如果为空那么表示没有存在的日进度 ，将当前的数据作为新数据处理
            Dto temp_dbDto = new BaseDto();    //不引用原始的数据
            temp_dbDto.putAll(dbDto);
            resultDto = temp_dbDto;
        }
        if(removeDto != null){
            dbList.remove(removeDto);
        }
        dbList.add(resultDto);
        return dbList;
    }
    /**
     * 流程数量相加
     * @param d1
     * @param d2
     * @return
     */
    private Dto addDto(Dto d1,Dto d2){
        Dto newDto = new BaseDto();
        newDto.putAll(d1);
        
        Dto natureDto = new BaseDto();
        natureDto.putAll(NatureUtil.getNatureCode2natureEn());
        for (Object o : natureDto.keySet()) {
            String key = (String) o;
            String value = natureDto.getAsString(key);
            newDto.put(value, d1.getAsLong(value)+d2.getAsLong(value));
        }
        
        return newDto;
    }
    
    /**
     * 处理流程的数据库查询格式
     * @return
     */
    private String getNatures(){
        List<String> natures = NatureUtil.getNatureCode();
        StringBuffer sb = new StringBuffer(80);
        for(String val : natures){
            sb.append(",'").append(val).append("'");
        }
        if(sb.length()>1){
            sb.deleteCharAt(0);
            return sb.toString();
        }
        return "";
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
}
