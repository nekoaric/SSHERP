package com.cnnct.listeners;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.bmf.util.SpringBeanLoader;

/**
 * 应用启动时 ，加载请求处理参数
 * @author zhouww
 * @since 2014-9-26
 */
public class SessionInitServletContext implements ServletContextListener{

	/**
	 * 应用销毁
	 */
	public void contextDestroyed(ServletContextEvent contextEvent) {
		// TODO Auto-generated method stub
		
	}

	/**
	 * 应用初始化
	 */
	public void contextInitialized(ServletContextEvent contextEvent) {
		try{
			// 初始化日志参数
			LogRequestCollection.loadRequestCollInfo();
			
			// 处理异常关闭情况 处理sys_rquest_list和sys_session_list处理响应时间为空设置为0
			IDao dao = (IDao)SpringBeanLoader.getSpringBean("g4Dao");
			dao.update("updateNullDate4Session");
		}catch(Exception e){
			e.printStackTrace();
		}
	}

}
