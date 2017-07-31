package com.cnnct.loginMode2.web;

import java.util.Arrays;
import java.util.List;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.util.SessionContainer;
import org.eredlab.g4.rif.util.SessionListener;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import com.cnnct.common.ApplicationException;
import com.cnnct.sys.vo.UserInfoVo;
import com.cnnct.util.BusiConst;
import com.cnnct.util.G4Utils;

/**
 * loginMode2登录处理
 * @author zhouww
 * @since 2014-12-25
 */
@SuppressWarnings("unchecked")
public class LoginAction extends BaseAction {
    
    private static String loginMode = "1";  // 模式为0：工号登录，模式为1：用户名，工号登录
    
    /**
     * 登录界面请求
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward init(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        // 增加是否登录的判断
        // 如果已经登录 则跳转界面
        return mapping.findForward("success");
    }
    
    /**
     * loginMode2模式的登录方法
     *  
     * @param
     * @return
     */
    public ActionForward login(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                               HttpServletResponse response) throws Exception {
        // 记录每一次的登录状态
        // 需要登记登录信息

        Dto jsonDto = new BaseDto();
        try {
            String account = request.getParameter("username");
            String password = request.getParameter("password");
            String rmbAccount = request.getParameter("rmbAccount");

            password = G4Utils.encryptBasedDes(password);
            Dto dto = new BaseDto();
            dto.put("account", account);

            dto.put("prod_ord_type", BusiConst.DATA_AUTHORITY_TYPE_PROD_ORD);
            dto.put("relative_type", BusiConst.DATA_AUTHORITY_TYPE_RELATIVE);
            dto.put("login_mode", loginMode);
            
            List<UserInfoVo> users = g4Reader.queryForList("getLoginUserInfo", dto);
            UserInfoVo userInfo = null;
            if(! (users == null) && users.size()==1){   // 只有查询结果为一条数据时候才登录
                userInfo = users.get(0);    
            }
//            UserInfoVo userInfo = (UserInfoVo) g4Reader.queryForObject("getLoginUserInfo", dto);
            if (G4Utils.isEmpty(userInfo)) {
                if(users==null || users.size()==0){
                    jsonDto.put("success", new Boolean(false));
                    jsonDto.put("msg", "帐号输入错误,请重新输入!");
                    request.setAttribute("msg", "帐号输入错误,请重新输入!");
                    jsonDto.put("errorType", "1");
                }else if(users.size()>1) {
                    jsonDto.put("success", new Boolean(false));
                    jsonDto.put("msg", "登录账号重复,请使用工号登录!");
                    request.setAttribute("msg", "登录账号重复，请使用工号登录!");
                    jsonDto.put("errorType", "1");  
                }
            } else {
                if (password.equals(userInfo.getPassword())) {
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
//                  super.getSessionContainer(request).setUserInfo(userInfo);
                    request.getSession().invalidate();
                    this.addRequestInfo4Session(request);
                    this.setSessionContainerUserInfo(request,userInfo);
                    
                    SessionListener.addSession(request.getSession(), userInfo); // 保存有效Session
                    // 查询是否设置工厂
                    // 如果设置了工厂跳转数量操作界面
                    // 如果没有工厂，跳转工厂设置界面
//                    Dto dbDto = new BaseDto();
//                    dbDto.put("account", account);
//                    int countG = g4Reader.queryForPageCount("queryMyGrps", dbDto);
//                    // 添加登录人员显示信息
//                    request.setAttribute("account", account);
//                    request.setAttribute("name", userInfo.getUsername());
//                    // 如果没有设置工厂信息，跳转工厂信息，否则跳转到数量操作界面
//                    if(countG==0){
//                        return mapping.findForward("factory");
//                    }
//                    return mapping.findForward("ordnum");
                    return mapping.findForward("menu");
                } else {
                    jsonDto.put("success", new Boolean(false));
                    jsonDto.put("msg", "帐号或密码输入错误,请重新输入!");
                    request.setAttribute("msg", "帐号或密码输入错误!");
                    jsonDto.put("errorType", "2");
                }
            }
            super.write(JsonHelper.encodeObject2Json(jsonDto),response);

            return mapping.findForward("");
        } catch (ApplicationException e) {
            jsonDto.put("success", new Boolean(false));
            jsonDto.put("msg", "系统登录失败，" + e.getMessage());
            request.setAttribute("msg", "系统登录失败，" + e.getMessage());
            String jsonString = JsonHelper.encodeObject2Json(jsonDto);
            response.getWriter().write(jsonString);
        }catch (Exception e) {
            e.printStackTrace();
            jsonDto.put("success", new Boolean(false));
            jsonDto.put("msg", "系统登录失败，" + e.getMessage());
            request.setAttribute("msg", "系统登录失败，" + e.getMessage());
            String jsonString = JsonHelper.encodeObject2Json(jsonDto);
            response.getWriter().write(jsonString);
        }
        return mapping.findForward("");
    }
    
    /**
     * 登出
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward loginOut(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {

        UserInfoVo userInfo = super.getSessionContainer(request).getUserInfo();
        
        if (G4Utils.isNotEmpty(userInfo)) {
            super.getSessionContainer(request).setUserInfo(null);
        }
        if (G4Utils.isNotEmpty(request.getSession())) {
            request.getSession().invalidate();
        }
        Dto outDto = new BaseDto();
        outDto.put("success", true);
        outDto.put("msg", "登出成功");
        return mapping.findForward(null);
    
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
