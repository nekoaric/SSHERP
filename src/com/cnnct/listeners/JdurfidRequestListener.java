package com.cnnct.listeners;

import java.util.UUID;

import javax.servlet.ServletRequestEvent;
import javax.servlet.ServletRequestListener;
import javax.servlet.http.HttpServletRequest;

import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.rif.util.WebUtils;

import com.cnnct.quartz.rfid.service.impl.SaveRequestQuartz;
import com.cnnct.sys.vo.UserInfoVo;


/**
 * 请求监听事件
 * @author zhouww
 * @since 2014-9-17
 */
public class JdurfidRequestListener implements ServletRequestListener{
	
	/**
	 * 请求结束
	 */
	public void requestDestroyed(ServletRequestEvent requestEvent) {
		try{
			HttpServletRequest request = (HttpServletRequest)requestEvent.getServletRequest();
			String uuidStr = (String)request.getAttribute("requestUUID");
			if(!(uuidStr==null || "".equals(uuidStr))){
				String sessionid = request.getSession().getId();
				Dto dbDto = new BaseDto();
				dbDto.put("uuid", uuidStr);
				dbDto.put("endlongtime",  System.currentTimeMillis());
				dbDto.put("sessionid", sessionid);	// 保存最新的会话ID(在会话切换的时候，将此请求归属于最新的会话)
				SaveRequestQuartz.addRequestInfo(dbDto);
			}
		}catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * 请求事件
	 * <br/>处理请求路径信息，目前适用.ered结尾的路径，
	 * <br/>需要扩展某些文件或者路径需要修改判断条件
	 */
	public void requestInitialized(ServletRequestEvent requestEvent) {
		try{
			HttpServletRequest request = (HttpServletRequest)requestEvent.getServletRequest();
			// 请求参数
			String queryString = request.getQueryString();
			queryString = getRequestCode(queryString);
			// 请求路径
			String path = request.getRequestURI();
			path = getRequestPath(path);
			// 请求路径和请求方法不能为空
			if(!LogRequestCollection.isFilter(path,queryString)){
				// 保存此请求唯一编号
				String uuidStr = UUID.randomUUID().toString();
				request.setAttribute("requestUUID", uuidStr);
				// 获取会话信息
				String sessionId = request.getSession().getId();
				Dto dbDto = new BaseDto();
				dbDto.put("uuid", uuidStr);
				dbDto.put("startlongtime", System.currentTimeMillis());
				dbDto.put("path", path);
				dbDto.put("reqcode", queryString);
				dbDto.put("sessionid",sessionId);
				SaveRequestQuartz.addRequestInfo(dbDto);
			}
		}catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * 处理请求路径
	 * @param path
	 * @return
	 */
	private String getRequestPath(String path){
		String endStr = ".ered";
		//为空或者不是已结束字符串结束的就返回
		if(path==null || !path.endsWith(endStr)){
			return "";
		}
		String[] paths = path.split(".ered")[0].split("/");
		path = paths[paths.length-1];
		return path;
	}
	
	/**
	 * 处理请求方法
	 * @param reqCode
	 * @return
	 */
	private String getRequestCode(String reqCode){
		String codeStr = "reqCode";
		// 如果为空 或者没有reqCode的参数那么这个为无效方法
		if(reqCode == null || reqCode.indexOf(codeStr)<0){
			return  "";
		}
		String[] params = reqCode.split("&");
		for(String param : params){
			//保存请求方法参数
			if(param.indexOf(codeStr)>=0){
				return param.split("=")[1];
			}
		}
		return "";
	}
}
