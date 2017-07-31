package com.cnnct.quartz.rfid.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.alibaba.druid.support.logging.Log;
import com.alibaba.druid.support.logging.LogFactory;
import com.cnnct.util.G4Utils;
import com.cnnct.util.NatureUtil;
import com.cnnct.util.TimeUtil;

/**
 * ********************************************* 创建日期: 2013-05-22 创建作者：may
 * 功能：rfid 报表定时处理 最后修改时间： 修改记录： ***********************************************
 * 注意:只能调用定时任务入口方法，不能调用其他的方法。
 */
@SuppressWarnings("unchecked")
public class ReportQuartz extends BaseServiceImpl {
    private Log log = LogFactory.getLog(ReportQuartz.class);
    
	public static final Lock lock = new ReentrantLock();

	//一次处理的最多数量
	private static final int MAX_BATCH_NUM = 100000; 
	//控制定时任务是否执行的状态false：不执行，true，执行 ，24:00重置状态
	private static boolean isExecute = true;
	
	
	/**
	 * 2014-4-8修改TODO:判断epc的订单和完单号如果没有则补齐为了以后的数据操作，增加epc_day_list的状态 废弃状态，</br>
	 * 确定此条epc数据是废弃的，确保以后如果有对epcdaylist数据重新处理的时候不会有误会。
	 */
	public void generateReport() {
	    if(!isExecute){
	        //定时任务未开启
	        return ;
	    }
	    //将获取锁和释放锁分开，避免多线程造成的锁获取异常而执行finally释放锁
	    try{
    	    boolean getLock = lock.tryLock(1, TimeUnit.SECONDS);
            if (!getLock) {
                log.debug(Thread.currentThread().getName() + " interrupt");
                return;
            }
            log.debug(Thread.currentThread().getName() + "get lock:epc和生产通知单");
	    }catch(Exception e){
	        e.printStackTrace();
	    }
		try {
		    //开始业务逻辑
			// 1,处理epcdaylist的数据 过滤无效数据和填充订单号和完单号
			// parseEpcDayList(); //TODO 当过隧道及的盘点方式改变后启用这个方法

			// 2根据epc_day_list生成产品日进度和产品进度表
			generateProdDaySche();
			// 3更新prod_sche_list的统计数据
			generateProdScheList();

			// 4根据ord_day_list生成 生产通知单日进度
			generateProdOrdSche();
			//更新生产通知单总进度
			generateProdOrdScheList();

			// 5将指定的流程设置 epc解绑
			Dto paramDto = new BaseDto();
			paramDto.put("state", "1");
			paramDto.put("status", "'7','8','12'");
			resetEpcState(paramDto);

            //数据统计后处理：统计数据规则处理--将统计表中指定的列如果为null 修改为0值：
            updateNull2Zero();
		} catch (InterruptedException e1) {
			e1.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
            lock.unlock();  //释放锁
		}
	}
	/**
	 * 将统计表指定列为null的修改为0
	 */
	public void updateNull2Zero(){
	    //组织数据
	    List<Dto> dbDto = new ArrayList<Dto>();
	    List<String> tableList = new ArrayList<String>();
	    tableList.add("prod_day_sche");
	    tableList.add("prod_sche_list");
	    tableList.add("ord_day_sche");
	    tableList.add("ord_sche_list");
	    tableList.add("prodord_day_sche");
	    tableList.add("prodord_sche_list");
	    List<String> numName = NatureUtil.getNatureEn();
	    for(String table : tableList){
	        for(String column_name : numName){
    	        Dto beanDto = new BaseDto();
    	        beanDto.put("table_name",table);
    	        beanDto.put("column_name", column_name);
    	        dbDto.add(beanDto);
	        }
	    }
	    for(Dto dto : dbDto){
	        g4Dao.update("updateNull2Zero",dto);
	    }
	}
	/**
	 * 处理epcdaylist的数据，过滤错误的数据，添加缺省数据（订单号，完单号）
	 */
	public void parseEpcDayList() {
		// 将没有绑定的标签的流水数据状态设置为废弃状态
		g4Dao.update("updateEpcDayListStatus");
		// 查询现有的数据，将标签流水数据填写完整
		// 需要更新的数据，订单号和完单号都为空：判断此条数据没有处理过
		// 更新状态为0(未更新):保证是过滤过的数据
		g4Dao.update("updateEpcDayListInfo");

	}

	/**
	 * 生成产品日进度 流程:1.获取待更新的epc读取流水记录(获取好后就更新流水状态)(也更新对应的标签当前状况)
	 * 2.获取有关联且已生成的生产通知单日进度 3.循环epc流水记录,生产或更新对应关系的产品日进度记录 4.更新产品日进度 5.更新产品总进度
	 */
	public void generateProdDaySche() throws Exception {
		// 获取流程状态
		Dto natureDto = new BaseDto();
		natureDto.putAll(NatureUtil.getNatureCode2natureEn());
		
		Dto dbDto = new BaseDto();
		//先修改需要统计的流程数据状态为9，独立设置状态，避免在处理定时任务的时候出现插入流水数据的异常
		//一次处理设置最大数量
		dbDto.put("update_ord_status", "9");
		dbDto.put("ord_status", "0");
		dbDto.put("natures",getNatures());
		dbDto.put("maxBatch", MAX_BATCH_NUM);
		g4Dao.update("updateStatusInEpcDayList", dbDto);
		dbDto = new BaseDto();
		dbDto.put("ord_status", "9");
		List epcDayList = g4Dao.queryForList("getEpcDayListByStatus", dbDto);  //查询待同步的epc流程数据
		List prodDayScheList = new ArrayList();
		if (epcDayList.size() != 0) {
			prodDayScheList = g4Dao.queryForList("getProdDayScheByEpcDayList",
			        dbDto); //查询已绑定epc产品的日进度信息（注意：这里只要有一个epc绑定产品即可，
			              //如果一个产品没有epc绑定那么不在查询范围内，而且查询的交易日期也是在查询epc流水的日期范围内）
			//此步骤清除上步骤查询出来的数量 ，保留获取的已有日进度的产品信息
			for (Object obj : prodDayScheList) {
				Dto prodDayScheDto = (Dto) obj;
				// 设置各个待增加的各个数量性质值为0
				for (Object o : natureDto.keySet()) {
					String key = (String) o;
					String value = natureDto.getAsString(key);
					prodDayScheDto.put(value, 0);
				}
			}
			// 更新查找到的记录状态为已用于记录报表
			dbDto = new BaseDto();
			dbDto.put("update_ord_status", "1");
			dbDto.put("ord_status","'9'");
			g4Dao.update("updateStatusInEpcDayList", dbDto);

		}
		
//		System.out.println(G4Utils.getCurrentTime());
		for (int i = 0; i < epcDayList.size(); i++) {
			Dto epcDayDto = (Dto) epcDayList.get(i);

			String tr_date = epcDayDto.getAsString("tr_date");
			String epc = epcDayDto.getAsString("epc");
			String product_id = epcDayDto.getAsString("product_id");
			if (tr_date.length() > 10) {
				tr_date = tr_date.substring(0, 10);
			}
			epcDayDto.put("tr_date", tr_date);

			String nature = natureDto.getAsString(epcDayDto
			        .getAsString("nature"));
			// 去除不是有效的数量性质或者产品信息的数据
			if ("".equals(nature) || "".equals(product_id)) { 
				epcDayList.remove(i);
				i--;
				continue;
			}

			Boolean flag = false;
			for (Object obj : prodDayScheList) {
				Dto prodDayScheDto = (Dto) obj;

				// 生产通知单日进度表中有对应信息的话更新对应信息
				if (tr_date.equals(prodDayScheDto.getAsString("tr_date"))
				        && product_id.equals(prodDayScheDto
				                .getAsString("product_id"))) {

					prodDayScheDto.put(nature, prodDayScheDto
					        .getAsInteger(nature) + 1);    //数量加1
					epcDayDto.put("state", "0");
					epcDayDto.put("status", "0");// 待订单明细同步
					flag = true;
					break;
				}
			}

			if (!flag) {// 没有对应记录的创建新的一条
				epcDayDto.put(nature, 1);// 设置某个数量性质要增加的数量为1
				epcDayDto.put("state", "0");
				epcDayDto.put("status", "0");// 待订单明细同步
				// 设置其他的数量性质要新增的数量为0(用于初始化)
				for (Object o : natureDto.keySet()) {
					String key = (String) o;
					String value = natureDto.getAsString(key);
					if (!value.equals(nature)) {
						epcDayDto.put(value, 0);
					}
				}
				prodDayScheList.add(epcDayDto);
			}
		}

		// 更新好日进度表
		if (prodDayScheList.size() > 0) {
			// 更新对应日进度信息
			g4Dao.batchUpdateBaseDto("insertProdDaySche", prodDayScheList);
		}
		if (epcDayList.size() > 0) {
			updateEpcProdList4Nature(epcDayList);
		}
	}

	/**
	 * 更新epcProdList的最新流程<br/>
	 * 最新流程在产品动向中查询使用
	 * 
	 * @param epcProdList
	 */
	public void updateEpcProdList4Nature(List<Dto> epcProdList) {
		// 按照epc，product_id分类epc
		// 将需要更新的epc组成集合
		// 更新标签所处流程和标签最后被识别到的机具
		// 注意：此方法只能适用于一个epc同一时间对应一个流程，不能适用一个epc同一时间对应多个流程
	    //Map<product_id,HashMap<epc,List>>
		HashMap<String, HashMap<String, List<Dto>>> classify = new HashMap<String, HashMap<String, List<Dto>>>();
		List<Dto> epcList = new ArrayList<Dto>(); // 更新epc集合

		for (Object obj : epcProdList) {
			Dto dto = (Dto) obj;
			HashMap<String, List<Dto>> epc2List = classify.get(dto
			        .getAsString("product_id"));
			if (epc2List == null) {
				epc2List = new HashMap<String, List<Dto>>();
				List<Dto> list = new ArrayList<Dto>();
				list.add(dto);
				epc2List.put(dto.getAsString("epc"), list);
				classify.put(dto.getAsString("product_id"), epc2List);
			} else {
				List<Dto> list = epc2List.get(dto.getAsString("epc"));
				if (list == null) {
					list = new ArrayList<Dto>();
					list.add(dto);
					epc2List.put(dto.getAsString("epc"), list);
				} else {
					list.add(dto);
				}
			}
		}

		// epc判断最新流程
		Set<String> productKey = classify.keySet();
		for (String str : productKey) {
			HashMap<String, List<Dto>> epc2List = classify.get(str);
			Set<String> epcKey = epc2List.keySet();
			for (String epcStr : epcKey) {
				List<Dto> epcDto = epc2List.get(epcStr);
				Dto addDto = null;
				for (Dto dto : epcDto) {
					String nature = dto.getAsString("nature");
					if (addDto == null) {
						String old_nature = dto.getAsString("old_nature");
						if (NatureUtil.compareNature(old_nature, nature)) {
							addDto = dto;
						}
					} else {
						String old_nature = addDto.getAsString("nature");
						if (NatureUtil.compareNature(old_nature, nature)) {
							addDto = dto;
						}
					}
				}
				if (addDto != null) {
					epcList.add(addDto);
				}
			}
		}
		g4Dao.batchUpdateBaseDto("updateEpcProdListByEpcDayList2", epcList);
	}

	/**
	 * 生成产品进度列表
	 */
	public void generateProdScheList() throws Exception {
		Dto qDto = new BaseDto();
		qDto.put("status", "0");

		// 获取有更新的订单日进度中的product_id,在汇总对应的信息
		List OrdScheList = g4Dao.queryForList("getSumProdDayScheByProductId",
		        qDto);

		if (OrdScheList.size() > 0) {
			// 更新订单日进度中state
			qDto.put("update_status", "1");
			g4Dao.update("updateStatusInProdDaySche", qDto);

			// 更新订单进度表
			g4Dao.batchInsert(OrdScheList, "insertProdScheList");
		}

	}

	/**
	 * 统计生产通知单信息
	 * </br>采用订单和epc数据的综合数据，数据库中不再采用款号的信息
	 * </br>款号在操作的过程中可能会修改，所以舍弃款号的数据字段，以后不再使用
	 * @throws Exception
	 */
	public void generateProdOrdSche() throws Exception {
		// 查询没有处理过的数据:订单记录数据,产品记录数据
		// 更新生产通知单日进度
		// 更新生产通知单的状态
		try {
			// 获取流程状态
			Dto natureDto = new BaseDto();
	        natureDto.putAll(NatureUtil.getNatureCode2natureEn());
			// 获取标签流水记录
			Dto paramDto = new BaseDto();
			paramDto.put("prodord_status", "9");
			paramDto.put("start_status", "0");
			paramDto.put("natures", getNatures());
			paramDto.put("maxBatch", MAX_BATCH_NUM);
			g4Dao.update("updateEpcDayList4Prodord", paramDto);
			g4Dao.update("updateOrdDayList4Prodord", paramDto);
			Dto qDto = new BaseDto();
            qDto.put("prodord_status", "'9'");
			List ordDayList = g4Dao.queryForList(
			        "getStreamDataByProdordStatus", qDto);   //查询结果包含款号，交易日期，订单号
			for (Object obj : ordDayList) {
				Dto dto = (Dto) obj;
				String tr_date = dto.getAsString("tr_date");
				if (tr_date.length() > 10) {
					tr_date = tr_date.substring(0, 10);
					dto.put("tr_date", tr_date);
				}
				String nature = natureDto
				        .getAsString(dto.getAsString("nature"));
				dto.put(nature, dto.getAsInteger("amount"));
				// 将其他流程数据设置为0 为了插入数据
				Set<String> setKey = natureDto.keySet();
				for (String str : setKey) {
					String dtoNature = natureDto.getAsString(str);
					if (!dtoNature.equals(nature)) {
						dto.put(dtoNature, 0);
					}
				}
				dto.put("state", 0);
				dto.put("status", 0);
			}
			if (ordDayList.size() > 0) {
				g4Dao.batchUpdateBaseDto("insertProdordDaySche", ordDayList);
			}
			// 设置更新状态
			paramDto.put("prodord_status", "1");
			paramDto.put("start_status", "9");
			g4Dao.update("updateEpcDayList4Prodord", paramDto);
			g4Dao.update("updateOrdDayList4Prodord", paramDto);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void generateProdOrdScheList() {
		// 查询生产通知单日进度信息
		// 更新生产通知单总进度信息
		// 修改日进度信息的更新状态
		Dto pDto = new BaseDto();
		pDto.put("status", "9");
		pDto.put("start_status", "'0'");
		g4Dao.update("updateProdordDaySche", pDto);
		pDto.put("status", "9");
		List list = g4Dao.queryForList("getProdordDaySche4ProdordScheList",
		        pDto);
		if (list.size() > 0) {
			g4Dao.batchUpdateBaseDto("upddateProdordScheList", list);
			pDto.put("status", "1");
			pDto.put("start_status", "'9'");
			g4Dao.update("updateProdordDaySche", pDto);
		}

	}

	/**
	 * 设置epc的状态
	 * 
	 * @throws Exception
	 */
	public void resetEpcState(Dto inDto) throws Exception {
		g4Dao.update("updateEpcStatus", inDto);
	}

	public void updateProdBasInfoSizeInfo() throws Exception{
		 //获取需要同步的尺寸数量信息
        List ordSizeUpdateList = g4Dao.queryForList("querySizeInfo4Update");
        for(Object Sobj : ordSizeUpdateList){
        	Dto OrdSizeDto=(Dto)Sobj;
        	Dto updateDto = new BaseDto();
        	String  order_id =OrdSizeDto.getAsString("order_id");
        	String  country =OrdSizeDto.getAsString("country");
        	String  in_length =OrdSizeDto.getAsString("in_length");
        	String  color =OrdSizeDto.getAsString("color");
        	String  waist =OrdSizeDto.getAsString("waist");
        	updateDto.put("order_id",order_id);
        	updateDto.put("country",country);
        	updateDto.put("in_length",in_length);
        	updateDto.put("color",color);
        	updateDto.put("waist",waist);
        	int nature =OrdSizeDto.getAsInteger("nature");
        	switch(nature){
        	case 1:
        		updateDto.put("real_cut_num", OrdSizeDto.getAsInteger("num"));
        		break;
        	case 2:
        		updateDto.put("drew_num", OrdSizeDto.getAsInteger("num"));
        		break;
        	case 14:
        		updateDto.put("product_num", OrdSizeDto.getAsInteger("num"));
        		break;
        	default:
        		continue;
        	}
        	g4Dao.update("updateProdBaseSizeInfo",updateDto);
        	g4Dao.update("updateOrdSizeInfoStatue",OrdSizeDto);
        	
        }
       // System.out.println("尺寸汇总结束");
    	//回退状态是删除的记录
    	//System.out.println("回退记录开始");
    	g4Dao.update("updateSizeInfo4Delete");
    	//System.out.println("删除结束");
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
	        while(!lock1){
	            try{
	                lock1 = lock.tryLock(3, TimeUnit.SECONDS);
	            }catch(Exception e){}
	        }
	        isExecute = false;
	    }catch(Exception e){
	        e.printStackTrace();
	    }finally{
	        lock.unlock();
	    }
	}
	/**
	 * 执行定时任务
	 */
	public static void executeQuartz(){
	    isExecute = true;
	}
}

