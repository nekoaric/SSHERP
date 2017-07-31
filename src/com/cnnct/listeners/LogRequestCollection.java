package com.cnnct.listeners;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.ibatis.sqlmap.engine.mapping.result.ResultMap;

/**
 * 请求集合
 * 需要做日志操作的请求集合
 * @author zhouww
 * @since 2014-9-26
 */
public class LogRequestCollection {
	// 请求集合
	private static  Map<String,List<String>> requestColl = new HashMap<String,List<String>>();
	
	private static Map<String,List<String>> noRequestColl = new HashMap<String, List<String>>();
	/**
	 * 判断请求是否存在
	 */
	public static boolean isExists(String path,String queryCode){
		// 请求参数为空 返回false
		if(path==null || "".equals(path) || queryCode==null || "".equals(queryCode)){
			return false;
		}
		// 不存在path返回false 
		List<String> queryCodes = requestColl.get(path);
		if(queryCodes==null){
			return false;
		}
		return queryCodes.contains(queryCode);
	}
	/**
	 * 判断不在请求日志返回内的
	 * @param path
	 * @param queryCode
	 * @return
	 */
	public static boolean isFilter(String path,String queryCode){
		// 数据格式不对返回true 表示过滤
		if(path==null || "".equals(path) || queryCode==null || "".equals(queryCode)){
			return true;
		}
		List<String> codes = noRequestColl.get(path);
		if(codes==null){	//为null 表示此路径不过滤
			return false;
		}
		return codes.contains(queryCode);	// 存在返回true表示过滤，不存在返回false 表示不过滤
	}
	/**
	 * 加载 请求数据
	 */
	public static synchronized void loadRequestCollInfo(){
		System.out.println("====================请求参数初始化==============");
		IDao dao = (IDao)SpringBeanLoader.getSpringBean("g4Dao");
		//请求日志路径
		Dto dbDto = new BaseDto();
		dbDto.put("state", "0");
		List<Dto> resultList = dao.queryForList("queryFunctionInfo",dbDto);
		setRequestColl(parseResultListToCollMap(resultList));
		//过滤日志路径
		dbDto = new BaseDto();
		dbDto.put("state", "1");
		List<Dto> resultList2 = dao.queryForList("queryFunctionInfo",dbDto);
		setNoRequestColl(parseResultListToCollMap(resultList2));
		
		
		System.out.println("====================请求参数初始化结束==============");
	}
	
	/**
	 * 请求结果解析为map格式
	 * @return
	 */
	private static Map parseResultListToCollMap(List<Dto> dtoList){
		Map<String,List<String>> resultMap = new HashMap<String,List<String>>();
		for(Dto dto : dtoList){
			String path = dto.getAsString("request_path");
			String code = dto.getAsString("reqcode");
			List<String> list = resultMap.get(path);
			if(list==null){
				list = new ArrayList<String>();
			}
			if(!list.contains(code)){
				list.add(code);
			}
			resultMap.put(path, list);
		}
		return resultMap;
	}
	
	//~ GET AND SET
	/**
	 * 设置请求集合
	 * @param requestColl
	 */
	public static synchronized void setRequestColl(Map<String, List<String>> requestColl1) {
		requestColl = requestColl1;
	}
	/**
	 * 设置过滤请求日志集合
	 * @param noRequestColl
	 */
	public static void setNoRequestColl(Map<String, List<String>> noRequestColl) {
		LogRequestCollection.noRequestColl = noRequestColl;
	}
	
	
}
