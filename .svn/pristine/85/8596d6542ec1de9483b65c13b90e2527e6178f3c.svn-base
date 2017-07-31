package com.cnnct.rfid.service.impl;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.cnnct.common.ApplicationException;
import com.cnnct.rfid.service.ArrangeInfoService;
import com.cnnct.util.G4Utils;
import com.cnnct.util.TimeUtil;

/**
 * 排数业务实现类
 * 
 * @author zhouww
 * @since 2015-06-17
 * 
 */
public class ArrangeInfoServiceImpl extends BaseServiceImpl implements
        ArrangeInfoService {

    public void insertArrangeGrp(Dto inDto) {
        g4Dao.batchInsertBaseDto("insertArrangeGrp", inDto.getDefaultAList());
    }

    public void deleteArrangeGrp(Dto inDto) {
        // 判断是否有此工厂的排数信息---不用判断，已经安排的工厂依旧采用旧的安排数据

        g4Dao.update("deleteArrangeGrp", inDto);
    }

    public void deleteGrpUser(Dto inDto) {
        // 删除用户
        // 删除用户对应的工厂
        g4Dao.delete("deleteArrangeUserGrp", inDto);
        g4Dao.delete("updateArrangeUser", inDto);
    }

    public void insertGrpUser(Dto inDto) {
        // 验证账户合规性
        // 添加用户
        List<Dto> users = g4Dao.queryForList("getUserInfo4account", inDto);
        if (users.size() == 0) {
            throw new ApplicationException("不存在此工号");
        }
        g4Dao.insert("insertArrangeUser", inDto);
    }

    /**
     * 插入排期信息， 工厂排期和用户排期
     */
    public synchronized void insertGrpArrangePlan(Dto inDto) {
        String calendarid = inDto.getAsString("calendarid");
        String grp_id = inDto.getAsString("grp_id");
        String team_no = inDto.getAsString("team_no");
        if (calendarid.equals("1")) {   // 这个是工厂排产量 
            // 批量插入工厂排数数据
            List resList = new ArrayList();
            String startDate = inDto.getAsString("start_date");
            String endDate = inDto.getAsString("end_date");
            List<String> allDaysList = parseAllDate(startDate, endDate);
            
            for(String str : allDaysList){
                Dto beanDto = new BaseDto();
                beanDto.putAll(inDto);
                beanDto.put("start_date", str);
                beanDto.put("end_date", str);
                resList.add(beanDto);
            }
            
            g4Dao.batchInsert(resList, "insertGrpArrangePlan");
            // 如果是工厂排单，处理排单的日期，按照日期来排
            // 只有在工厂排期的时候处理
            arrangeGrpDayPlan(inDto); // 处理工厂排单
            arrangeUserDayPlan(grp_id,team_no);
        } else if (calendarid.equals("3")) { // 业务员排单的时候只需要重新排订单
            // 判断已经排单的不能排单
            List<Dto> arrOrds = g4Dao.queryForList("queryOrderArrangeInfo", inDto);
            if(arrOrds.size() > 0){
                // 如果此班组已经排过这个订单，那么不能再排
                throw new ApplicationException("此订单已经被排期，不能再次排期!");
            }
            g4Dao.insert("insertGrpArrangePlan", inDto);
            arrangeUserDayPlan(grp_id,team_no);
        } else if (calendarid.equals("8")) { // 业务员排单(非订单)的时候只需要重新排订单
            // 用款号,指令数作查询条件
            List<Dto> arrOrds = g4Dao.queryForList("queryOrderArrangeInfo4style", inDto);
            if(arrOrds.size() > 0){
                // 如果此班组已经排过这个订单，那么不能再排
                throw new ApplicationException("此(款式，数量)已经被排期，不能再次排期!");
            }
            g4Dao.insert("insertGrpArrangePlan", inDto);
            arrangeUserDayPlan(grp_id,team_no);
        }
    }

    public void updateGrpArrangePlan(Dto inDto) {
        Dto onePlan = (Dto) g4Dao.queryForObject("queryUserArrangePlan", inDto);
        String cid = inDto.getAsString("calendarid");
        // 添加业务员排单修改和工厂排单修改的条件，设置一些不能够修改的条件
        // 查询人员是否是工厂操作人员
        Dto dbDto = new BaseDto();
        dbDto.put("account", inDto.getAsString("opr_id"));
        dbDto.put("state", "0");
        
        List<Dto> accList = g4Dao.queryForList("queryArrangeUser", dbDto);
        
        // 业务员能够修改所有业务的数据
        // 工厂排单员可以操作所有的工厂排单
        
        boolean isGrpUser = accList.size()>0 ? true:false;
        if ((isGrpUser && "1".equals(cid)) 
                || (!isGrpUser && "3,8".indexOf(cid)>0)
                || (cid.equals("5"))) {
            // 只有自己能够修改自己的排单数据 或者是工厂的排单
            if (cid.equals("1")) {
                // 只有工厂排单的更改 才更新工厂的预期排单数据
                arrangeGrpDayPlan(inDto);
            }
            g4Dao.update("updateGrpArrangePlan", inDto);
            String grp_id = onePlan.getAsString("grp_id");
            String team_no = onePlan.getAsString("team_no");
            arrangeUserDayPlan(grp_id,team_no); // 改变排单信息
        } else {
            throw new ApplicationException("不能修改不是自己的排单");
        }

    }

    public void deleteGrpArrangePlan(Dto inDto) {
        Dto onePlan = (Dto) g4Dao.queryForObject("queryUserArrangePlan", inDto);
        String cid = onePlan.getAsString("calendarid");
        
        Dto dbDto = new BaseDto();
        dbDto.put("account", inDto.getAsString("opr_id"));
        dbDto.put("state", "0");
        
        List<Dto> accList = g4Dao.queryForList("queryArrangeUser", dbDto);
        
        // 业务员能够修改所有业务的数据
        // 工厂排单员可以操作所有的工厂排单
        
        boolean isGrpUser = accList.size()>0 ? true:false;
        if ((isGrpUser && "1".equals(cid)) 
                || (!isGrpUser && "3,8".indexOf(cid)>0)) {
            if (cid.equals("1")) {
                // 只有工厂排单的更改 才更新工厂的预期排单数据
                arrangeGrpDayPlan(inDto);
            }
            // 只有自己能删除自己的排单数据
            g4Dao.update("deleteGrpArrangePlan", inDto);
            String grp_id = onePlan.getAsString("grp_id");
            String team_no = onePlan.getAsString("team_no");
            arrangeUserDayPlan(grp_id,team_no); // 改变排单信息
        } else {
            throw new ApplicationException("不能删除不是自己的排单");
        }

    }

    /**
     * 每天实际生产数量添加
     */
    public void insertRealAmount(Dto inDto) {
        Dto dbDto = new BaseDto();
        dbDto.put("seq_no", inDto.getAsString("arrange_no"));
        Dto onePlan = (Dto) g4Dao.queryForObject("queryUserArrangePlan", dbDto);
        g4Dao.insert("insertRealAmount", inDto);
        // 设置实际生产数量后 ，重新安排订单排期
        String grp_id = onePlan.getAsString("grp_id");
        String team_no = onePlan.getAsString("team_no");
        arrangeUserDayPlan(grp_id,team_no);
    }

    /**
     * 工厂产量排期
     */
    private void arrangeGrpDayPlan(Dto inDto) {

        // 依据inDto的参数分类处理
        // 有新增，有删除，有修改，分开处理
        String opr_type = inDto.getAsString("opr_type");
        String start_date = inDto.getAsString("start_date");
        String end_date = inDto.getAsString("end_date");
        String grp_id = inDto.getAsString("grp_id");
        String team_no = inDto.getAsString("team_no");
        Integer amount = inDto.getAsInteger("amount");
        List resList = new ArrayList();
        if ("0".equals(opr_type) || "3".equals(opr_type)) {
            // 为工厂添加新的数据
            List<String> sed = parseAllDate(start_date, end_date);
            for (String str : sed) {
                Dto beanDto = new BaseDto();
                beanDto.put("grp_id", grp_id);
                beanDto.put("team_no", team_no);
                beanDto.put("amount", amount);
                beanDto.put("arrange_date", str);
                beanDto.put("grp_remain_amount", amount);
                resList.add(beanDto);
            }
        } else if ("1".equals(opr_type)) {
            // 查询旧数据
            Dto oneDto = (Dto) g4Dao.queryForObject("queryUserArrangePlan",
                    inDto);
            // 删除原排数的数据
            Integer delAmount = oneDto.getAsInteger("amount");
            String delGrp_id = oneDto.getAsString("grp_id");
            String delTeam_no = oneDto.getAsString("team_no");

            List<String> delDateList = parseAllDate(oneDto
                    .getAsString("start_date"), oneDto.getAsString("end_date"));
            for (String str : delDateList) {
                Dto beanDto = new BaseDto();
                beanDto.put("grp_id", delGrp_id);
                beanDto.put("team_no", delTeam_no);
                beanDto.put("amount", -delAmount);
                beanDto.put("arrange_date", str);
                beanDto.put("grp_remain_amount", -delAmount);
                resList.add(beanDto);
            }

            // 新增的数据
            List<String> addDateList = parseAllDate(start_date, end_date);
            for (String str : addDateList) {
                Dto beanDto = new BaseDto();
                beanDto.put("grp_id", delGrp_id); // 因为修改不会传递工厂编号，采用查询数据的工厂数据信息
                beanDto.put("team_no", delTeam_no);
                beanDto.put("amount", amount);
                beanDto.put("arrange_date", str);
                beanDto.put("grp_remain_amount", amount);
                resList.add(beanDto);
            }

            // 新增新的排数数据
        } else if ("2".equals(opr_type)) {
            // 删除排数的数据
            // 查询旧数据
            Dto oneDto = (Dto) g4Dao
                    .queryForObject("queryUserArrangePlan", inDto);
            // 删除原排数的数据
            Integer delAmount = oneDto.getAsInteger("amount");
            String delGrp_id = oneDto.getAsString("grp_id");
            String delTeam_no = oneDto.getAsString("team_no");
            
            List<String> delDateList = parseAllDate(oneDto
                    .getAsString("start_date"), oneDto.getAsString("end_date"));
            for (String str : delDateList) {
                Dto beanDto = new BaseDto();
                beanDto.put("grp_id", delGrp_id);
                beanDto.put("team_no", delTeam_no);
                beanDto.put("amount", -delAmount);
                beanDto.put("arrange_date", str);
                beanDto.put("grp_remain_amount", -delAmount);
                resList.add(beanDto);
            }
        }
        // 将处理结果插入到数据库中
        g4Dao.batchInsert(resList, "updateRealArrangePlan4grp");

    }

    /**
     * 处理指定的工厂的排期
     * 
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
        dbDto.put("cid", "'3','8'");
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
     * 获取开始日期和结束日期之间的所有日期数据
     * 
     * @param startDate
     * @param endDate
     * @return
     */
    private List<String> parseAllDate(String startDate, String endDate) {
        List<String> resList = new ArrayList<String>();
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            Date sd = sdf.parse(startDate);
            Date ed = sdf.parse(endDate);

            Calendar cs = Calendar.getInstance();
            cs.set(sd.getYear() + 1900, sd.getMonth(), sd.getDate());

            Calendar ce = Calendar.getInstance();
            ce.set(ed.getYear() + 1900, ed.getMonth(), ed.getDate());

            while (cs.compareTo(ce) <= 0) {
                String curDate = sdf.format(cs.getTime());
                resList.add(curDate);
                // 增加一天时间
                cs.add(Calendar.DAY_OF_YEAR, 1);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
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
                        if(TimeUtil.comDate(tempDto.getAsString("start_date"), dto.getAsString("arrange_date")) &&
                                tempDto.getAsInteger("real_amount") <= 0){
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
        if(list.size() >0 ){
            
            Dto dto = list.get(0);  // 按照订单的排序来 如果第一个订单面辅料符合要求的话，则返回否则，返回一个null;
            String startDate = dto.getAsString("start_date");
            if(!TimeUtil.comDate(dto.getAsString("materiel_date"),date)){
                // 如果面辅料进仓日期比指定日期早，则返回第一个匹配的Dto
                return dto;
            }
            // 循环所有当天的排单信息 查找第一个符合要求的排单
            for(int idx=1;idx<list.size();idx++){
                Dto tDto = list.get(idx);
                if(startDate.equals(tDto.getAsString("start_date"))){
                    if(!TimeUtil.comDate(tDto.getAsString("materiel_date"),date)){
                        // 如果面辅料进仓日期比指定日期早，则返回第一个匹配的tDto
                        return tDto;
                    }
                }else {
                    break;
                }
            }
        }
        return null;
    }
}
