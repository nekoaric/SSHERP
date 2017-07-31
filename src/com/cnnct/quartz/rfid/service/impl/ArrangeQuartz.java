package com.cnnct.quartz.rfid.service.impl;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.cnnct.quartz.rfid.service.TaskQuartzService;
import com.cnnct.rfid.service.ArrangeInfoService;
import com.cnnct.rfid.service.impl.ArrangeInfoServiceImpl;
import com.cnnct.util.TimeUtil;

/**
 * 自动排期，每天自动重新排期
 * @since 2015-07-05
 * @author zhouww
 *
 */
public class ArrangeQuartz extends BaseServiceImpl implements TaskQuartzService{
    // 需要用到排期类中的一个方法，这里引入此具体类不做接口处理
    
    public void quartzExecute() throws Exception {
        // 查询所有昨天排单的订单工厂，这个定时任务在凌晨0点10分的时候 触发。
        Dto dbDto = new BaseDto();
        dbDto.put("arrange_date", TimeUtil.getCurrentDate("yyyy-MM-dd"));
        List<Dto> resList = g4Dao.queryForList("queryDayArrangeInfo",dbDto);
        
        for(Dto dto : resList) {
            String grp_id = dto.getAsString("grp_id");
            String team_no = dto.getAsString("team_no");
            arrangeUserDayPlan(grp_id, team_no);
        }
        System.out.println("arrange ");
    }
    
    
    /**
     * 处理指定的工厂的排期
     * 这里复制了ArrangeInfoService的方法
     * @param grp_id
     */
    private synchronized void  arrangeUserDayPlan(String grp_id,String team_no) {
        // 查询正在生产的排期
        // 计算订单的排序优先顺序,正在生产的优先，然后按照添加顺序排序,seq_no越小，越提前下单
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        Dto dbDto = new BaseDto();
        dbDto.put("grp_id", grp_id);
        dbDto.put("team_no", team_no);
        dbDto.put("arrange_date", sdf.format(new Date()));
        List<Dto> resList = g4Dao.queryForList("queryDayPlanArrange", dbDto);
        // resList 如果real_amount不是null 那么这个是在生产中的排期订单
        // 查询所有未完成排期订单信息
        // 这个工厂的所有未完成的订单
        List<Dto> undoneList = g4Dao.queryForList("queryUndoneOrder", dbDto);

        // 遍历工厂的日期 ，按照日期每天依次排序
        List arrangeList = parseDayArrange(resList,undoneList);
        // 删除旧安排表
        g4Dao.delete("deleteOrderPlanArrange", dbDto);
        // 更新安排表
        g4Dao.batchInsert(arrangeList, "insertOrderPlanArrange");
    }
    /**
     * 使用指定的日期对排单进行优先级分类排序处理
     * 1)生产中的订单
     * 2)较早添加的订单
     * @param list
     * @param curDate
     * @return
     */
    private List<Dto> orderArrange(List<Dto> list,String curDate){
        // 查找出所有正在生产的订单
        // 查找出所有此日期前的订单
        // 查找出素有此日期后的订单
        // 对各自查询出的订单进行排序     这里需要依据 查询的时候使用的排序   省略代码处理
        // 整合结果并且返回
        
        List<Dto> resList = new ArrayList<Dto>();
        List<Dto> prodList = new ArrayList<Dto>();
        List<Dto> beforeList = new ArrayList<Dto>();
        List<Dto> afterList = new ArrayList<Dto>();
        
        for(Dto dto :  list){
            if(dto.getAsInteger("real_amount")>0){
                prodList.add(dto);
            }else if(TimeUtil.comDate(dto.getAsString("start_date"), curDate)){
                afterList.add(dto);
            }else {
                beforeList.add(dto);
            }
        }
        
        resList.addAll(prodList);
        resList.addAll(beforeList);
        resList.addAll(afterList);
        
        return resList;
    }
    /**
     * 处理业务员排期
     * @param resList
     * @param undoneList
     * @return
     */
    private List<Dto> parseDayArrange(List<Dto> resList,List<Dto> undoneList){
        List<Dto> arrangeList = new ArrayList<Dto>();
        
        Dto curDto = null; // 当前排单的订单信息
        int curAmount = 0; // 当前订单的还需数量排单
        for (Dto dto : resList) {
            // 隔天的情况  对订单进行重新排序
            undoneList = orderArrange(undoneList, dto.getAsString("arrange_date"));
            // 每一天的预计数量 从需要排单的订单中获取数量
            String curSeqno = dto.getAsString("seq_no");
            // 增加当天工厂的产量减去当天已经生产的数量 (另外一种想法是如果当天已经有生产数据，则不安排订单)
            int dayAmount = dto.getAsInteger("amount")- dto.getAsInteger("real_amount"); // 日预期产量

            // 判断处理待排期的订单 第一次处理
            if (curDto == null && undoneList.size() == 0) {
                // 没有数据的情况下 退出
                break;
            } else if (curDto == null) {
                Dto tempDto = undoneList.get(0);
                if(TimeUtil.comDate(tempDto.getAsString("start_date"), dto.getAsString("arrange_date"))&&
                        tempDto.getAsInteger("real_amount")<=0){
                 // 增加面辅料进仓日期判断
                    Dto valDto = getValidDto(undoneList,dto.getAsString("arrange_date"));
                    if(valDto != null){
                        curDto = valDto;
                        curAmount = curDto.getAsInteger("amount")
                                - curDto.getAsInteger("real_amount");
                    }else {
                        continue;
                    }
                }else {
                    curDto = tempDto;
                    curAmount = curDto.getAsInteger("amount")
                            - curDto.getAsInteger("real_amount");
                }
            }
            // 循环遍历排期订单
            
            for (; dayAmount > 0;) {
                // 日产量大于当前排期订单的数量
                if (dayAmount >= curAmount) {
                    // 数据库更新DTO处理
                    Dto beanDto = new BaseDto();
                    beanDto.put("user_plan_no", curSeqno);
                    beanDto.put("arrange_no", curDto.getAsString("arrange_no"));
                    beanDto.put("cur_amount", curAmount);
                    beanDto.put("remain_amount", curAmount);
                    arrangeList.add(beanDto);

                    // 处理完当前curDto
                    dayAmount = dayAmount - curAmount;
                    undoneList.remove(curDto); // 当前订单处理完毕后 移除相应的Dto
                    if (undoneList.size() == 0) {
                        curDto = null; // 如果排期订单处理完毕 赋空值
                        curAmount = 0;
                        break; // 退出 由上一层循环判断 退出
                    } else {
                        Dto tempDto = undoneList.get(0);
                        if(TimeUtil.comDate(tempDto.getAsString("start_date"), dto.getAsString("arrange_date"))&&
                                tempDto.getAsInteger("real_amount")<=0){
                         // 如果当前订单登记日期大于当前日期 ,并且还没有生产
                            // 这里在退出之前做面辅料进仓日期判断
                            Dto valDto = getValidDto(undoneList,dto.getAsString("arrange_date"));
                            if(valDto != null){
                                curDto = valDto;
                                curAmount = curDto.getAsInteger("amount")
                                        - curDto.getAsInteger("real_amount");
                            }else {
                                curDto = null;
                                curAmount = 0;
                                break;
                            }
                        }else {
                            curDto = tempDto;
                            curAmount = curDto.getAsInteger("amount")
                                    - curDto.getAsInteger("real_amount");
                        }
                    }
                } else {
                    // 这样的情况是确定了订单排期的
                    // dayAmount < curAmount
                    // 数据库更新DTO处理
                    Dto beanDto = new BaseDto();
                    beanDto.put("user_plan_no", curSeqno);
                    beanDto.put("arrange_no", curDto.getAsString("arrange_no"));
                    beanDto.put("cur_amount", dayAmount);
                    beanDto.put("remain_amount", curAmount);
                    arrangeList.add(beanDto);

                    // 处理完当前curDto
                    curAmount = curAmount - dayAmount;
                    dayAmount = 0; // 在需要dayAmount的数据处理完毕后 再处理dayAmount
                }
            }
        }
        return arrangeList;
    }
    
    /**
     * 解析list对象，寻找符合要求的Dto
     * 按照面辅料进仓日期排序
     * @param list
     * @param date
     * @return
     */
    private Dto getValidDto(List<Dto> list,String date){
        for(Dto dto : list){
            if(!TimeUtil.comDate(dto.getAsString("materiel_date"),date)){
                // 如果面辅料进仓日期比指定日期早，则返回第一个匹配的Dto
                return dto;
            }
        }
        return null;
    }
}
