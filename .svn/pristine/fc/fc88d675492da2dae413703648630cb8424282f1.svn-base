package org.eredlab.g4.rif.util;

import java.io.IOException;
import java.math.BigDecimal;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.cnnct.sys.vo.UserInfoVo;
import com.cnnct.util.G4Utils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.arm.service.MonitorService;
import com.cnnct.util.ArmConstants;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.ccl.properties.PropertiesFactory;
import org.eredlab.g4.ccl.properties.PropertiesFile;
import org.eredlab.g4.ccl.properties.PropertiesHelper;
import com.cnnct.util.GlobalConstants;

/**
 * 请求拦截过滤器
 * 
 * @author XiongChun
 * @since 2010-04-13
 */
public class RequestFilter implements Filter {

	private Log log = LogFactory.getLog(RequestFilter.class);
	protected FilterConfig filterConfig;
	protected boolean enabled;

	/**
	 * 构造
	 */
	public RequestFilter() {
		filterConfig = null;
		enabled = true;
	}

	/**
	 * 初始化
	 */
	public void init(FilterConfig pFilterConfig) throws ServletException {
		this.filterConfig = pFilterConfig;
		String value = filterConfig.getInitParameter("enabled");
		if (G4Utils.isEmpty(value)) {
			this.enabled = true;
		} else if (value.equalsIgnoreCase("true")) {
			this.enabled = true;
		} else {
			this.enabled = false;
		}
	}

	/**
	 * 过滤处理
	 */
	public void doFilter(ServletRequest pRequest, ServletResponse pResponse, FilterChain fc) throws IOException,
			ServletException {
		HttpServletRequest request = (HttpServletRequest) pRequest;
		HttpServletResponse response = (HttpServletResponse) pResponse;
		String ctxPath = request.getContextPath();
		String requestUri = request.getRequestURI();
		String uri = requestUri.substring(ctxPath.length());
		UserInfoVo userInfo = WebUtils.getSessionContainer(request).getUserInfo();
		BigDecimal costTime = null;
		PropertiesHelper pHelper = PropertiesFactory.getPropertiesHelper(PropertiesFile.G4);
		String eventMonitorEnabel = pHelper.getValue("requestMonitor", "1");
		//设置不过滤的条件     未登录前的一些基础数据查询不过滤
        String reqCode = request.getParameter("reqCode");
        String url =  request.getRequestURL().toString();
        if(url.endsWith("index.ered") && "userInit".equals(reqCode)){
            long start = System.currentTimeMillis();
            fc.doFilter(request, response);
            if (eventMonitorEnabel.equalsIgnoreCase(ArmConstants.EVENTMONITOR_ENABLE_Y))
                costTime = new BigDecimal(System.currentTimeMillis() - start);
        }else if (G4Utils.isEmpty(userInfo) && !uri.equals("/login.ered") && enabled) {
			// TODO 考虑拦截的粒度问题,比如说用参保的身份登录后知道退保的URL,是否考虑这种级别的拦截控制
            String isAjax = request.getHeader("x-requested-with");
            if (G4Utils.isEmpty(isAjax)) {
                response.setContentType("text/html;charset=UTF-8");
                response.getWriter().write(
                        "<script type=\"text/javascript\" charset=\"UTF-8\">alert('因长时间未操作，您的登录信息已被注销，请重新登录!');parent.location.href='"
                                + ctxPath + "/login.ered?reqCode=init'</script>");
                response.getWriter().flush();
                response.getWriter().close();
            } else {
                response.sendError(GlobalConstants.Ajax_Timeout);
            }

            log.warn("警告:非法的URL请求已被成功拦截.访问来源IP锁定:" + request.getRemoteAddr());
            log.warn("试图访问的URL:" + request.getRequestURL().toString() + "?reqCode=" + request.getParameter("reqCode"));
            return;
		} else {
		    //除去过滤的和不过滤的 继续执行
			long start = System.currentTimeMillis();
			fc.doFilter(request, response);
			if (eventMonitorEnabel.equalsIgnoreCase(ArmConstants.EVENTMONITOR_ENABLE_Y))
				costTime = new BigDecimal(System.currentTimeMillis() - start);
		}
		if (eventMonitorEnabel.equalsIgnoreCase(ArmConstants.EVENTMONITOR_ENABLE_Y)) {
			saveEvent(request, costTime);
		}
	}

	/**
	 * 写操作员事件表
	 * 
	 * @param request
	 */
	private void saveEvent(HttpServletRequest request, BigDecimal costTime) {
	    String EVENTCODEDESC="";
		UserInfoVo userInfo = WebUtils.getSessionContainer(request).getUserInfo();
		if (G4Utils.isEmpty(userInfo)) {
			return;
		}
		String menuid = request.getParameter("menuid4Log");
		Dto dto = new BaseDto();
		dto.put("account", userInfo.getAccount());
		dto.put("grp_id", userInfo.getGrpId());
		dto.put("activetime",G4Utils.getCurrentTime());
		dto.put("userid",userInfo.getUserid());
		dto.put("username", userInfo.getUsername());
		dto.put("requestpath", request.getRequestURI().replaceAll(request.getContextPath(),""));
		dto.put("methodname", request.getParameter("reqCode"));
		//dto.put("eventid", IDHelper.getEventID());
		dto.put("costTime", costTime);
		Dto to=WebUtils.getPraramsAsDto(request);
	    dto.put("paramter",JsonHelper.encodeObject2Json(to));
		dto.put("ip", request.getRemoteAddr());
		MonitorService monitorService = (MonitorService) SpringBeanLoader.getSpringBean("monitorService");
		monitorService.saveEvent(dto);

	}

	/**
	 * 销毁
	 */
	public void destroy() {
		filterConfig = null;
	}

}
