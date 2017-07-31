package com.cnnct.quartz.rfid.service.impl;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.junit.Test;

import com.cnnct.quartz.rfid.service.TaskQuartzService;
import com.cnnct.util.NatureUtil;
import com.ibatis.common.logging.Log;
import com.ibatis.common.logging.LogFactory;

/**
 * 检测判断处理生产通知单，订单，产品统计数据的异常数据
 * </br>判断处理前一天的数据
 * @author zhouww
 *
 */
public class ClearErrorDataQuartz extends BaseServiceImpl implements TaskQuartzService {
    private Log log = LogFactory.getLog(ClearErrorDataQuartz.class);
    //任务锁
    private static Lock lock = new ReentrantLock();
    //检测范围 ，单位：天
    private static final int DAYNUM = 5;
    
    public ClearErrorDataQuartz(){
        super();
    }
    
    /**
     * 定时任务入口
     */
    public void quartzExecute() throws Exception {
        try{
            boolean isLock = lock.tryLock(1, TimeUnit.SECONDS);
            if(!isLock){
                System.out.println("数据检测任务获取锁失败~~~~~~~~~~");
                log.debug("获取锁失败");
                return;
            }
            log.debug("获得锁，开始定时检测任务!");
            System.out.println("开始数据检测");
        }catch(Exception e){
            e.printStackTrace();
        }
        try{
            QuartzControl.concelCountQuartz();  //取消定时任务    等待当前定时任务完成执行
            clearOrdDaySche();	//订单定时任务
            clearProdDaySche();		//产品定时任务
            clearProdOrdDaySche();	//生产通知单定时任务
        }catch (Exception e) {
            e.printStackTrace();
        }finally{
            lock.unlock();  //释放锁
            QuartzControl.executeCountQuartz(); //开始定时任务
        }
        
        Thread.currentThread().sleep(20000);
    }
    /**
     * 检测订单日进度
     */
    private void clearOrdDaySche(){
        //查询前一天操作的日数据的订单
        Dto queryDto = new BaseDto();
        String currentDate = getBeforeDate(-1);
        String beforeDate = getBeforeDate(DAYNUM);
        queryDto.put("currentDate", currentDate);
        queryDto.put("beforeDate", beforeDate);
        queryDto.put("ord_status", "1");    //检测的数据为已处理数据
        List daylist = g4Dao.queryForList("queryHistoryOrdDayList", queryDto);
        
        Long time2 = System.currentTimeMillis();
        String natureNums = getNatureNums();
        
        //报错所有待更新的数据
        List<Dto> resultDto   = new ArrayList<Dto>();
        for(Object obj : daylist){
            Dto orddaylistDto = (Dto)obj;	//有订单和日期的信息
            orddaylistDto.put("natureNums", natureNums);    //动态指定查询的数量性质信息
            orddaylistDto.put("ord_status", "1");    //检测的数据为已处理数据
            // 查询日进度查询统计返回结果为集合
            List<Dto> orddayscheList = getOrdDayScheList(orddaylistDto);
            List<Dto> orddayList = getOrdDayList(orddaylistDto);
            // 除了查询结果为第一条否则不处理
            Dto orddaysche = null;
            if(orddayscheList.size() == 1){
                orddaysche = orddayscheList.get(0);
            }
            boolean isValide = compareNatureNum(orddaysche,orddayList);
            if(!isValide){  //比较结果不符合
                Dto beanDto = new BaseDto();
                beanDto.put("order_id", orddaylistDto.getAsString("order_id"));
                beanDto.put("tr_date", orddaylistDto.getAsString("tr_date"));
                resultDto.add(beanDto);
            }
        }
        System.err.println("处理数据条数：" + resultDto.size()+"!!!"+"\n"+resultDto);
        g4Dao.batchDelBaseDto(resultDto, "deleteOrdDaySche4ClearData");
        g4Dao.batchUpdateBaseDto("updateOrdDayList4ClearData", resultDto);
        
    }
    /**
     * 检测产品日进度
     * </br>查询一段时间内新增，修改,删除的数据的日期和产品编号
     */
    private void clearProdDaySche(){
        //查询前一天操作的日数据的订单
        Dto queryDto = new BaseDto();
        String currentDate = getBeforeDate(-1);
        String beforeDate = getBeforeDate(DAYNUM);
        queryDto.put("currentDate", currentDate);
        queryDto.put("beforeDate", beforeDate);
        queryDto.put("ord_status", "1");    //检测的数据为已处理数据
        List<Dto> epcdayList = g4Dao.queryForList("queryHistoryEpcDayList", queryDto);
        
        String natureNums = getNatureNums();
        //报错所有待更新的数据
        List<Dto> resultList = new ArrayList<Dto>();
        int idx = 0;
        for(Object obj : epcdayList){
            Dto orddaylistDto = (Dto)obj;
            orddaylistDto.put("natureNums", natureNums);    //动态指定查询的数量性质信息
            orddaylistDto.put("ord_status", "1");    //检测的数据为已处理数据
            
            List<Dto> proddayscheList = getProdDayScheList(orddaylistDto);
            // 如果查询的结果不是一条数据则添加到处理数据的集合里面
            Dto proddaysche = null;
            if(proddayscheList.size() == 1) {
                proddaysche = proddayscheList.get(0);
            }
            List<Dto> orddayList = getEpcDayList(orddaylistDto);
            boolean isValide = compareNatureNum(proddaysche,orddayList);
            if(!isValide) {  //比较结果不符合
                Dto beanDto = new BaseDto();
                beanDto.put("tr_date", orddaylistDto.getAsString("tr_date"));
                beanDto.put("product_id", orddaylistDto.getAsString("product_id"));
                resultList.add(beanDto);
            }
        }
        System.err.println("产品处理数据条数：" + resultList.size()+"!!!"+"\n"+resultList);
        g4Dao.batchDelBaseDto(resultList, "deleteProdDaySche4ClearData");
        g4Dao.batchUpdateBaseDto("updateEpcDayList4ClearData", resultList);
        
    }
    /**
     * 检测生产通知单日进度
     * </br>一个订单一个生产通知单(已确定)，采用订单号来代替生产通知单信息（订单号+款号）
     * 日期：2014年8月15日
     */
    private void clearProdOrdDaySche(){
    	//1   查询产品流水和订单流水的日期时间	，订单号，日期
    	//2  查询每个日期订单的数据
    	//3  判断条数据的正确性
    	
    	List<Dto> updateDate = getUpdateDate4Ord();
    	
    	String natureNums = getNatureNums();	//统计查询的列头信息
        //报错所有待更新的数据
        List<Dto> resultList = new ArrayList<Dto>();
        
        for(Dto dbDto : updateDate) {
            dbDto.put("natureNums", natureNums);    //动态指定查询的数量性质信息
            dbDto.put("ord_status", "1");    //检测的数据为已处理数据
            
            List<Dto> prodordscheList = getProdordDayScheList(dbDto);
            Dto prodordSche = null;
            if(prodordscheList.size()==1){
                prodordSche = prodordscheList.get(0);
            }
            List<Dto> prodordList = getProdordDayList(dbDto);
            boolean isValide = compareNatureNum(prodordSche,prodordList);
            if(!isValide) {  //比较结果不符合
                Dto beanDto = new BaseDto();
                beanDto.put("tr_date", dbDto.getAsString("tr_date"));
                beanDto.put("order_id", dbDto.getAsString("order_id"));
                resultList.add(beanDto);
            }
        }
        System.out.println("生产通知单处理数据:"+resultList.size()+"条,"+resultList);
        g4Dao.batchDelBaseDto(resultList, "deleteProdordDaySche4ClearData");
        g4Dao.batchUpdateBaseDto("updateEpcDaylist4ProdordDayscheClearData", resultList);
        g4Dao.batchUpdateBaseDto("updateOrdDayList4ProdordDayscheClearData", resultList);
    }
    /**
     * 获取当前日期的前N天日期
     * @param n
     * @return
     */
    private String getBeforeDate(int n){
        String resultStr = "";
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(new Date());
        calendar.add(Calendar.DAY_OF_MONTH, -n);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        resultStr = sdf.format(calendar.getTime());
        return resultStr;
    }
    /**
     * 获取流程数量性质数据
     * @return
     */
    private String getNatureNums(){
       StringBuffer resultStr = new StringBuffer(200);
       Map<String,String> nature = NatureUtil.getNatureCode2natureEn();
       for(Entry<String, String> entry : nature.entrySet()){
           resultStr.append(",").append(entry.getValue());
       }
       if(resultStr.length()>0){
           resultStr.deleteCharAt(0);
       }
       return resultStr.toString();
    }
    /**
     * 获取订单日进度信息
     * @param sqlDto
     * @return
     */
    private Dto getOrdDaySche(Dto sqlDto){
        Object obj = g4Dao.queryForObject("queryOrdDaySche4ClearData", sqlDto);
        return obj==null?null:(Dto)obj;
    }
    
    /**
     * 获取多订单日进度
     * @param sqlDto
     * @return  集合
     */
    private List<Dto> getOrdDayScheList(Dto sqlDto){
        List<Dto> resultList = g4Dao.queryForList("queryOrdDaySche4ClearData", sqlDto);
        return resultList;
    }
    
    /**
     * 获取订单流水信息
     * @param sqlDto
     * @return
     */
    private List<Dto> getOrdDayList(Dto sqlDto){
        List<Dto> naturesNums = g4Dao.queryForList("queryOrdDayList4ClearData", sqlDto);  
        return parseRollBackNumtoNatureNum(naturesNums);
    }
    
    /**
     * 将回退流程的数据转化为正常流程的数据
     * </br>只做流程的判断不做订单号等等其他的判断
     * @return
     */
    private List<Dto> parseRollBackNumtoNatureNum(List<Dto> dbList){
    	List<String> rollbackNatures = NatureUtil.getRollbackNature();	//回退流程
    	
    	List<Dto> rollbackNums = new ArrayList<Dto>();
        //将回退流程的处理为正常流程的数据
        for(int i=0;i<dbList.size();i++){		//将回退数据从结果数据中分离
        	Dto dto = dbList.get(i);
        	String nature = dto.getAsString("nature");
        	if(rollbackNatures.contains(nature)){
        		rollbackNums.add(dto);
        		dbList.remove(i);
        		i--;
        	}
        }
        for(Dto dto : rollbackNums){
        	dbList = parseRollback2Nature(dto,dbList);
        }
        return dbList;
    }
    
    /**
     * 生产通知单流水信息：epc流水和订单流水
     * @param sqlDto
     * @return
     */
    private List<Dto> getProdordDayList(Dto sqlDto){
    	List<Dto> resultList = g4Dao.queryForList("querySumNatureAmount4prodordClearData", sqlDto);
    	return parseRollBackNumtoNatureNum(resultList);
    }
    
    /**
     * 获取产品日进度信息
     * @param orddaylistDto
     * @return
     */
    private Dto getProdDaySche(Dto sqlDto){
        Object obj = g4Dao.queryForObject("queryProdDaySche4ClearData", sqlDto);
        return obj==null?null:(Dto)obj;
    }
    
    /**
     * 获取产品日进度信息
     * @param orddaylistDto
     * @return
     */
    private List<Dto> getProdDayScheList(Dto sqlDto){
        List<Dto> resultList = g4Dao.queryForList("queryProdDaySche4ClearData", sqlDto);
        return resultList;
    }
    
    /**
     * 获取产品流水的集合
     * @return
     */
    private List<Dto> getEpcDayList(Dto sqlDto){
        return g4Dao.queryForList("queryProdDayList4ClearData", sqlDto);   //未处理回退数据
    }
    /**
     * 获取生产通知单日期信息
     * @param sqlDto
     * @return
     */
    private Dto getProdordDaySche(Dto sqlDto){
    	Object obj = g4Dao.queryForObject("queryProdordDaySche4ClearData", sqlDto);
    	return obj==null?null:(Dto)obj;
    }
    
    /**
     * 获取生产通知单日期信息
     * @param sqlDto
     * @return 集合
     */
    private List<Dto> getProdordDayScheList(Dto sqlDto){
        List<Dto> obj = g4Dao.queryForList("queryProdordDaySche4ClearData", sqlDto);
        return obj;
    }
    
    /**
     * 判断统计数据是否和流水的数量相同
     * </br>比较的是流程和流程数量 
     * @return
     */
    private boolean compareNatureNum(Dto scheData,List<Dto> listData){
        if(scheData==null || listData==null){
            return false;
        }
        Dto temp_scheData = new BaseDto();
        temp_scheData.putAll(scheData);
        
        Map<String,String> nature = NatureUtil.getNatureCode2natureEn();
        Collection<String> natureNames = nature.values();
        for(Dto dto : listData) {
            String dtoNature = dto.getAsString("nature");
            String natureName = nature.get(dtoNature);
            
            String dtoAmount = dto.getAsString("amount");
            dtoAmount = dtoAmount.equals("")?"0":dtoAmount;
            String scheAmount = temp_scheData.getAsString(natureName);
            scheAmount = scheAmount.equals("")?"0":scheAmount;
            if(dtoAmount.equals(scheAmount)) {   //数量相等的情况下移除数量性质数据
                temp_scheData.remove(natureName);
            }else { //数量不相等则返回false
                return false;
            }
        }
        //完成所有已知存在的数量性质的判断，判断剩下的数量性质的数量是否为0
        for(Object obj : temp_scheData.entrySet()){
            Entry entry = (Entry)obj;
            String value = (String)entry.getKey();
            if(natureNames.contains(value) && !entry.getValue().toString().equals("0")){
                return false;   //流程内的数量性质但是数量不为0，作为异常数据处理
            }
            
        }
        return true;
    }
    
    /**
     * 获取回退的生产流程
     * @return
     */
    private String getRollbackNatures(){
    	StringBuffer sb = new StringBuffer(200);
    	List<String> natures = NatureUtil.getRollbackNature();
    	for(String str : natures){
    		sb.append(",'").append(str).append("'");
    	}
    	if(sb.length()>0){
    		sb.deleteCharAt(0);
    	}
    	return sb.toString();
    }
    /**
     * 将回退流程数据作正常流程数据处理
     * @param rollback
     * @param resultDtos
     * @return
     */
    private List<Dto> parseRollback2Nature(Dto rollback,List<Dto> resultDtos) {
    	String nature = rollback.getAsString("nature");
    	Long amount = rollback.getAsLong("amount");
    	//获取回退所涉及的流程
    	List<String> rollbackNums = NatureUtil.getActionNature4rollback(nature);
    	for(Dto dto : resultDtos) {
    		String natureName = dto.getAsString("nature");
    		if(rollbackNums.contains(natureName)) {
    			//对相同的流程做数量的处理 ,现有的数量减去回退涉及的数量
    			dto.put("amount", dto.getAsLong("amount")-amount);
    			//对处理过的数据移除内容
    			rollbackNums.remove(natureName);
    		}
    	}
    	//将没有处理的回退数据进行统计
    	for(String str : rollbackNums){
    		Dto dto = new BaseDto();
    		dto.put("nature", str);
    		dto.put("amount", -amount);
    		resultDtos.add(dto);
    	}
    	return resultDtos;
    }
    
    /**
     * 获取生产通知单的更新时间
     * @return
     */
    private List<Dto> getUpdateDate4Ord(){
    	List<Dto> result = new ArrayList<Dto>();
    	//查询前一天操作的日数据的订单
        Dto queryDto = new BaseDto();
        String currentDate = getBeforeDate(0);
        String beforeDate = getBeforeDate(DAYNUM);
        queryDto.put("currentDate", currentDate);
        queryDto.put("beforeDate", beforeDate);
        queryDto.put("prodord_status", "1");    //检测的数据为已处理数据
        result = g4Dao.queryForList("queryHistoryDate4prodordClearData", queryDto);
    	return result;
    }
}






