package com.cnnct.loginMode2.filter;

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

import org.eredlab.g4.ccl.properties.PropertiesFactory;
import org.eredlab.g4.ccl.properties.PropertiesFile;
import org.eredlab.g4.ccl.properties.PropertiesHelper;
import org.eredlab.g4.rif.util.WebUtils;

import com.cnnct.sys.vo.UserInfoVo;
import com.cnnct.util.ArmConstants;
import com.cnnct.util.G4Utils;
import com.cnnct.util.GlobalConstants;

public class LoginFilter implements Filter{

    public void destroy() {
        
    }

    public void doFilter(ServletRequest pRequest, ServletResponse pResponse,
            FilterChain chain) throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) pRequest;
        HttpServletResponse response = (HttpServletResponse) pResponse;
        String ctxPath = request.getContextPath();
        String requestUri = request.getRequestURI();
        String uri = requestUri.substring(ctxPath.length());
        UserInfoVo userInfo = WebUtils.getSessionContainer(request).getUserInfo();
        BigDecimal costTime = null;
        //设置不过滤的条件     未登录前的一些基础数据查询不过滤
        String reqCode = request.getParameter("reqCode");
        String url =  request.getRequestURL().toString();
        if (G4Utils.isEmpty(userInfo) && !uri.equals("/loginMobile.mobile")) {
            response.sendRedirect("./loginMobile.mobile?reqCode=init");
            return;
        } else {
            //除去过滤的和不过滤的 继续执行
            long start = System.currentTimeMillis();
            chain.doFilter(request, response);
        }
        
    }

    public void init(FilterConfig arg0) throws ServletException {
        
    }

}
