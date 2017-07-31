package org.eredlab.g4.rif.util;

import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionBindingEvent;
import javax.servlet.http.HttpSessionBindingListener;

import com.cnnct.quartz.rfid.service.impl.SaveSessionQuartz;
import com.cnnct.sys.vo.UserInfoVo;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.rif.report.jasper.ReportData;

/**
 * Session容器
 * 
 * @author 熊春
 * @since 2009-09-03
 * @see HttpSessionBindingListener
 */
public class SessionContainer implements HttpSessionBindingListener {
	
	/**
	 * 登陆用户对象
	 */
	private UserInfoVo userInfo;
	
	/**
	 * 标识此容器是否登录过 
	 */
	
	private boolean isLogin = false;
	
	/**
	 * 报表对象集
	 */
	private Dto reportDto;
	
	public SessionContainer() {
		super();
		reportDto =  new BaseDto();
	}
	
	/**
	 * 设置报表对象
	 * 缺省方法：支持一个页面一个打印对象
	 * @param pReportData
	 */
	public void setReportData(ReportData pReportData){
		reportDto.put("default", pReportData);
	}
	
	/**
	 * 获取报表对象
	 * 缺省方法：支持一个页面一个打印对象
	 * @return
	 */
	public ReportData getReportData(){
		return (ReportData)reportDto.get("default");
	}
	
	/**
	 * 设置报表对象
	 * 重载方法：支持一个页面多个打印对象
	 * @param pReportData
	 */
	public void setReportData(String pFlag, ReportData pReportData){
		reportDto.put(pFlag, pReportData);
	}
	
	/**
	 * 获取报表对象
	 * 重载方法：支持一个页面多个打印对象
	 * @return
	 */
	public ReportData getReportData(String pFlag){
		return (ReportData)reportDto.get(pFlag);
	}
	

	/**
	 * 清除会话容器缓存对象
	 */
	public void cleanUp() {
		// userInfo不能在此批量重置,只能使用setUserInfo(null)方法对其进行独立操作
		// userInfo = null;
		reportDto.clear();
	}

	public void valueBound(HttpSessionBindingEvent event) {
		//System.out.println("会话创建了");
		try{
			HttpSession session = event.getSession();
			String sessionid = session.getId();
			// 获取客户端
			Dto dbInfo = (Dto)session.getAttribute("clientInfo");
			if(dbInfo==null){
				dbInfo = new BaseDto();
			}
			dbInfo.put("useragent", dbInfo.getAsString("userAgent"));
			dbInfo.put("remotehost", dbInfo.getAsString("remoteHost"));
			dbInfo.put("sessionid", sessionid);
			dbInfo.put("starttime", System.currentTimeMillis());
			
			UserInfoVo userinfo = getUserInfo();
			if(userinfo != null){	// 如果有用户信息  则添加用户名
				String account = userinfo.getAccount();
				dbInfo.put("account", userinfo.getAccount());
			}
			SaveSessionQuartz.addSessionInfo(dbInfo);
		}catch(Exception e){
			e.printStackTrace();
		}
	}

	public void valueUnbound(HttpSessionBindingEvent event) {
		//System.out.println("会话销毁了");
		try{
			HttpSession session = event.getSession();
			String sessionid = session.getId();
			Dto dbDto = new BaseDto();
			dbDto.put("sessionid", sessionid);
			dbDto.put("endtime", System.currentTimeMillis());
			SaveSessionQuartz.addSessionInfo(dbDto);
		}catch(Exception e){
			e.printStackTrace();
		}
	}

	/**
	 * 获取用户会话对象
	 * @return UserInfo
	 */
	public UserInfoVo getUserInfo() {
		return userInfo;
	}

	/**
	 * 设置用户会话对象
	 * @param userInfo
	 */
	public void setUserInfo(UserInfoVo userInfo) {
		this.userInfo = userInfo;
		
	}

}
