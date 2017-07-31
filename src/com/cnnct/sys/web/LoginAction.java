package com.cnnct.sys.web;

import java.util.Arrays;
import java.util.List;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.arm.service.OrganizationService;
import org.eredlab.g4.arm.util.idgenerator.IDHelper;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.util.SessionContainer;
import org.eredlab.g4.rif.util.SessionListener;
import org.eredlab.g4.rif.web.BaseAction;

import com.cnnct.common.ApplicationException;
import com.cnnct.sys.vo.UserInfoVo;
import com.cnnct.util.BusiConst;
import com.cnnct.util.G4Utils;

/**
 * 登录页面Action
 * 
 * @author XiongChun
 * @since 2010-01-13
 * @see BaseAction
 */
public class LoginAction extends BaseAction {

	private static String loginMode = "1";	// 模式为0：工号登录，模式为1：用户名，工号登录
	
	private static Log log = LogFactory.getLog(LoginAction.class);

	private OrganizationService organizationService = (OrganizationService) super.getService("organizationService");

	//private MonitorService monitorService = (MonitorService) super.getService("monitorService");
	
	/**
	 * 登陆页面初始化
	 * 
	 * @param
	 * @return
	 */
	public ActionForward init(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		return mapping.findForward("loginView");
	}

	/**
	 * 登陆身份验证
	 * 
	 * @param
	 * @return
	 */
	public synchronized ActionForward login(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
	    Dto jsonDto = new BaseDto();
	    try {
	        String account = request.getParameter("account");
	        String password = request.getParameter("password");
	        String grp_id = request.getParameter("grp_id");

	        password = G4Utils.encryptBasedDes(password);
	        log.info("帐户[" + account + "]正尝试登陆系统...");
	        Dto dto = new BaseDto();
	        dto.put("account", account);
	        dto.put("grp_id", grp_id);

            dto.put("prod_ord_type", BusiConst.DATA_AUTHORITY_TYPE_PROD_ORD);
            dto.put("relative_type", BusiConst.DATA_AUTHORITY_TYPE_RELATIVE);
            dto.put("login_mode", loginMode);
            
            List<UserInfoVo> users = g4Reader.queryForList("getLoginUserInfo", dto);
            UserInfoVo userInfo = null;
            if(! (users == null) && users.size()==1){	// 只有查询结果为一条数据时候才登录
            	userInfo = users.get(0);	
            }
//            UserInfoVo userInfo = (UserInfoVo) g4Reader.queryForObject("getLoginUserInfo", dto);
	        if (G4Utils.isEmpty(userInfo)) {
	        	if(users==null || users.size()==0){
		            jsonDto.put("success", new Boolean(false));
		            jsonDto.put("msg", "帐号输入错误,请重新输入!");
		            request.setAttribute("msg", "帐号输入错误,请重新输入!");
		            jsonDto.put("errorType", "1");
	                log.info("帐户[" + account + "]，单位代码[" + grp_id + "]登陆失败.(失败原因：不存在此帐户)");
	        	}else if(users.size()>1) {
	        		jsonDto.put("success", new Boolean(false));
		            jsonDto.put("msg", "登录账号重复,请使用工号登录!");
		            request.setAttribute("msg", "登录账号重复，请使用工号登录!");
		            jsonDto.put("errorType", "1");	
	                log.info("帐户[" + account + "]，单位代码[" + grp_id + "]登陆失败.(失败原因：重复账号)");
	        	}
	        } else {
	            if (password.equals(userInfo.getPassword()) && grp_id.equals(userInfo.getGrpId())) {
                    if (userInfo.getState() != null && userInfo.getState().equals("1")) {
                        throw new ApplicationException("用户已停用，请联系管理员!");
                        //todo 已注销的判断
                    }
	                // 账号验证成功，account赋值
                    account = userInfo.getAccount();
	                jsonDto.put("success", new Boolean(true));
	                userInfo.setSessionID(request.getSession().getId());
	                userInfo.setSessionCreatedTime(G4Utils.getCurrentTime());
	                userInfo.setLoginIP(request.getRemoteAddr());
	                userInfo.setExplorer(G4Utils.getClientExplorerType(request));

	                // 将用户信息塞入会话容器
//	                super.getSessionContainer(request).setUserInfo(userInfo);
	                request.getSession().invalidate();
	                this.addRequestInfo4Session(request);
	                this.setSessionContainerUserInfo(request,userInfo);
	                
                    log.info(userInfo.getUsername() + "[" + userInfo.getAccount() + "]" + "，单位代码[" + grp_id
                            + "]成功登录系统!创建了一个有效Session连接,会话ID:[" + request.getSession().getId() + "]" + G4Utils.getCurrentTime());

                    SessionListener.addSession(request.getSession(), userInfo); // 保存有效Session
                    //保存登录有效信息
                    Cookie[] cookies = request.getCookies();
                    boolean hasAccount = false;
                    for(int i=0;i<cookies.length;i++){
                        String user = cookies[i].getName();
                        if("account".equals(user)){
                            String value = cookies[i].getValue();
                            //判断如果已经有此账号则不再添加
                            String[] values = value.split(",");
                            if(Arrays.asList(values).contains(account)){
                                hasAccount = true;
                                break;
                            }
                            value = value+","+account;
                            Cookie cookie = cookies[i];
                            cookie.setValue(value);
                            response.addCookie(cookie);
                            hasAccount = true;
                        }
                    }
                    if(!hasAccount){
                        Cookie cookie = new Cookie("account", account);
                        cookie.setMaxAge(60*60*24*365*1000);    //设置时间
                        response.addCookie(cookie);
                    }
                    if (pHelper.getValue("requestMonitor", "0").equals("1")) {
	                }
                    super.write(JsonHelper.encodeObject2Json(jsonDto),response);
	                return mapping.findForward("success");
	            } else {
	                jsonDto.put("success", new Boolean(false));
	                jsonDto.put("msg", "帐号或密码输入错误,请重新输入!");
	                request.setAttribute("msg", "帐号或密码输入错误!");
	                jsonDto.put("errorType", "2");
                    log.info(userInfo.getUsername() + "[" + userInfo.getAccount() + "]" + "，单位代码[" + grp_id + "]登录系统失败(失败原因：单位代码或密码输入错误)");
	            }
	        }
            super.write(JsonHelper.encodeObject2Json(jsonDto),response);

	        return mapping.findForward("");
        } catch (ApplicationException e) {
            log.info(e.getMessage());
            jsonDto.put("success", new Boolean(false));
            jsonDto.put("msg", "系统登录失败，" + e.getMessage());
            request.setAttribute("msg", "系统登录失败，" + e.getMessage());
            String jsonString = JsonHelper.encodeObject2Json(jsonDto);
            response.getWriter().write(jsonString);
        }catch (Exception e) {
        	e.printStackTrace();
            log.info(e.getMessage());
            jsonDto.put("success", new Boolean(false));
            jsonDto.put("msg", "系统登录失败，" + e.getMessage());
            request.setAttribute("msg", "系统登录失败，" + e.getMessage());
            String jsonString = JsonHelper.encodeObject2Json(jsonDto);
            response.getWriter().write(jsonString);
        }
		
		return mapping.findForward("");
	}

	/**
	 * 退出登录
	 * 
	 * @param
	 * @return
	 */
	public synchronized ActionForward logout(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		UserInfoVo userInfo = super.getSessionContainer(request).getUserInfo();
		
		if (G4Utils.isNotEmpty(userInfo)) {
			if (pHelper.getValue("requestMonitor", "0").equals("1")) {
				//saveLogoutEvent(userInfo, request);
			}
			log.info(userInfo.getUsername() + "退出了系统!");
			super.getSessionContainer(request).setUserInfo(null);
		}
		if (G4Utils.isNotEmpty(request.getSession())) {
			request.getSession().invalidate();
		}

        return mapping.findForward("loginView");
	}

	/**
	 * 保存登录事件
	 * 
	 * @param userInfo
	 */
	private void saveLoginEvent(UserInfoVo userInfo, HttpServletRequest request) {
		Dto dto = new BaseDto();
		dto.put("account", userInfo.getAccount());
		dto.put("activetime", G4Utils.getCurrentTime());
		dto.put("userid", userInfo.getUserid());
		dto.put("username", userInfo.getUsername());
		dto.put("description", "登录系统");
		dto.put("requestpath", request.getRequestURI());
		dto.put("methodname", request.getParameter("reqCode"));
		dto.put("eventid", IDHelper.getEventID());
		//monitorService.saveEvent(dto);
	}

	/**
	 * 保存退出事件
	 * 
	 * @param userInfo
	 */
	private void saveLogoutEvent(UserInfoVo userInfo, HttpServletRequest request) {
		Dto dto = new BaseDto();
		dto.put("account", userInfo.getAccount());
		dto.put("activetime", G4Utils.getCurrentTime());
		dto.put("userid", userInfo.getUserid());
		dto.put("username", userInfo.getUsername());
		dto.put("description", "退出系统");
		dto.put("requestpath", request.getRequestURI());
		dto.put("methodname", request.getParameter("reqCode"));
		dto.put("eventid", IDHelper.getEventID());
		//monitorService.saveEvent(dto);
	}
	

	/**
	 * 为SessionContainer容器添加Userinfo信息，如果SessionContainer不存在
	 * <br/>保存userinf在添加Session属性之前完成 
	 * <br/>功能修改同super.getSessionContainer
	 * @param request
	 * @param userInfo
	 */
	private void setSessionContainerUserInfo(HttpServletRequest request,UserInfoVo userInfo){
		SessionContainer sessionContainer = (SessionContainer) this.getSessionAttribute(request, "SessionContainer");
		if (sessionContainer == null) {
			sessionContainer = new SessionContainer();
			sessionContainer.setUserInfo(userInfo);
			HttpSession session = request.getSession(true);
			session.setAttribute("SessionContainer", sessionContainer);
		}else {
			sessionContainer.setUserInfo(userInfo);
		}
	}
	/**
	 * 为会话添加请求的额外信息：浏览器信息，客户IP
	 * @param request
	 */
	private void addRequestInfo4Session(HttpServletRequest request){
		String useragent = request.getHeader("user-agent");
		String login_id = request.getRemoteHost();
		Dto clientInfo = new BaseDto();
		clientInfo.put("userAgent", useragent);
		clientInfo.put("remoteHost", login_id);
		request.getSession().setAttribute("clientInfo", clientInfo);
	}
}
