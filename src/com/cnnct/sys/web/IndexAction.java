package com.cnnct.sys.web;

import java.io.Writer;
import java.util.List;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.arm.service.OrganizationService;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import com.cnnct.sys.service.SysUserInfoService;
import com.cnnct.sys.vo.UserInfoVo;
import com.cnnct.util.G4Utils;

/**
 * 首页Action
 * 
 * @author XiongChun
 * @since 2010-01-13
 * @see BaseAction
 */
public class IndexAction extends BaseAction {
	
	private OrganizationService organizationService = (OrganizationService)SpringBeanLoader.getSpringBean("organizationService");

	/**
	 * 首页初始化
	 * 
	 * @param
	 * @return
	 */
	public ActionForward indexInit(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
        String layout = super.getSessionContainer(request).getUserInfo().getLayout();
        // 查询第一次登录情况'
        String account = super.getSessionContainer(request).getUserInfo().getAccount();
        Dto dbDto = new BaseDto();
        dbDto.put("account", account);
        UserInfoVo resultDto = (UserInfoVo)g4Reader.queryForObject("getLoginUserInfo", dbDto);	//查询账号名
        
        
        String password = G4Utils.encryptBasedDes("111111");
        if(resultDto != null && password.equals(resultDto.getPassword())){
        	request.setAttribute("loginInfo", "此密码为初始化密码，请修改!");
        }else {
        	request.setAttribute("loginInfo", "");
        }
        // 判断第一次登录
//        Dto resultDto = (Dto)g4Reader.queryForObject("countSessionInfo4account",dbDto);
//        String count = "0";
//        if(resultDto != null && resultDto.size()>0){
//        	count = resultDto.getAsString("count");
//        }
//        request.setAttribute("loginCount", count);
        if("1".equals(layout)){
            return mapping.findForward("indexView");
        }else if("2".equals(layout)){
            return mapping.findForward("desktopView");
        }else{
            return mapping.findForward("indexView");
        }

	}
	/**
	 * 解析cookie初始化登录账户
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 * @throws Exception
	 */
	public ActionForward userInit(ActionMapping mapping,ActionForm form,
	        HttpServletRequest request,HttpServletResponse response)throws Exception {
	    StringBuffer sb = new StringBuffer(128);
	    Cookie[] cookies = request.getCookies();
	    System.out.println(cookies.length);
	    sb.append("[");
	    for(int i=0;i<cookies.length;i++){
	        String user = cookies[i].getName();
	        if("account".equals(user)){
	            String value = cookies[i].getValue();
	            System.out.println(value);
	            String[] values = value.split(",");
	            for(int k=0;k<values.length;k++){
	                sb.append("{").append("value:").append(values[k]).
	                    append(",text:").append(values[k]).append("},");
	            }
	        }
	    }
	    if(sb.length()>2){
            sb.deleteCharAt(sb.length()-1);
        }
	    sb.append("]");
	    Writer writer = response.getWriter();
	    writer.write(sb.toString());
	    return mapping.findForward(null);
	}
	
	/**
	 * 欢迎页面初始化
	 * 
	 * @param
	 * @return
	 */
	public ActionForward preferencesInit(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		return mapping.findForward("welcomeView");
	}
	
	/**
	 * 保存用户自定义主题
	 * 
	 * @param
	 * @return
	 */
	public ActionForward saveUserTheme(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		Dto dto = new BaseDto();
		String theme = request.getParameter("theme");
		dto.put("userid", super.getSessionContainer(request).getUserInfo().getUserid());
		dto.put("theme", theme);
		Dto outDto = organizationService.saveUserTheme(dto);
		String jsonString = JsonHelper.encodeObject2Json(outDto);
		response.getWriter().write(jsonString);
		response.getWriter().close();
		return mapping.findForward(null);
	}

	/**
     * 加载当前登录用户信息
     * 
     * @param
     * @return
     */
    public ActionForward loadUserInfo(ActionMapping mapping, ActionForm form,
            HttpServletRequest request, HttpServletResponse response) throws Exception {
        UserInfoVo userInfoVo = getSessionContainer(request).getUserInfo();
        Dto inDto = new BaseDto();
        inDto.put("user_id",userInfoVo.getUserid());
        Dto outDto = (BaseDto)g4Reader.queryForObject("getUserInfoByUserId", inDto);
        outDto.remove("password");
        String jsonString = JsonHelper.encodeDto2FormLoadJson(outDto, null);
        write(jsonString, response);
        return mapping.findForward(null);
    }
    
    /**
     * 修改当前登录用户信息
     * 
     * @param
     * @return
     */
    public ActionForward updateUserInfo(ActionMapping mapping, ActionForm form,
            HttpServletRequest request, HttpServletResponse response) throws Exception {
        Dto outDto=new BaseDto();
        try{
	        CommonActionForm cForm = (CommonActionForm)form;
	        SysUserInfoService sysUserService = (SysUserInfoService) super.getService("sysUserInfoService");
	        Dto inDto = cForm.getParamAsDto(request);
	        List<Dto> users = g4Reader.queryForList("getUserInfoByLoginName",inDto);	// 查询修改后的登录名数据
	        Dto dto = (BaseDto)g4Reader.queryForObject("getUserInfoByUserId", inDto);
	        String password =dto.getAsString("password");
	        String mPasswor = G4Utils.decryptBasedDes(password);
	        if (check(inDto.getAsString("password"))) {
	        	outDto.put("failure", true);
        		outDto.put("msg", "您的新密码太简单了，请重新输入");
			}else if(mPasswor.equals(inDto.getAsString("oldpswd")))
	        {
	        	// 已经验证就密码正确性
	        	// 合法的账号判断：1)登录名查询的用户名为0 2)登录名为旧的登录名
	        	// 不合法的账号：1)账号不能为数字格式
	        	String oldLoginName = dto.getAsString("login_name");
	        	String loginName = inDto.getAsString("login_name");
	        	if(((users==null || users.size()==0) || (loginName.equals(oldLoginName))) 
	        			&& valideNumber(loginName)){
	        		outDto = sysUserService.updateUserItem4IndexPage(inDto);
	        	}else {
	        		// 账号不合规
	        		if(!valideNumber(loginName)) {
	        			outDto.put("failure", true);
	            		outDto.put("msg", "账号不能全为数字和小数点,可以为中文或者英文");
	        		}else {
		        		outDto.put("failure", true);
		        		outDto.put("msg", "账号错误");
	        		}
	        	}
	        }
	        else{
	            outDto.put("failure", new Boolean(true)); 
	            outDto.put("msg", "原密码不正确");//关闭     
	        }
        }catch(Exception e){
        	e.printStackTrace();
        	outDto.put("failure", new Boolean(true));
        	outDto.put("msg", "修改信息失败,请重试或联系管理员");
        }
        String jsonString = JsonHelper.encodeObject2Json(outDto);
        write(jsonString, response);
        return mapping.findForward(null);
    }

    /**
     * 保存用户自定义布局
     *
     * @param
     * @return
     */
    public ActionForward saveUserLayout(ActionMapping mapping, ActionForm form,
                                        HttpServletRequest request, HttpServletResponse response) throws Exception {
        Dto dto = new BaseDto();
        String layout = request.getParameter("layout");
        dto.put("user_id", super.getSessionContainer(request).getUserInfo().getUserid());
        dto.put("layout", layout);
        Dto outDto = organizationService.saveUserLayout(dto);
        UserInfoVo userInfoVo = getSessionContainer(request).getUserInfo();
        userInfoVo.setLayout(layout);
        getSessionContainer(request).setUserInfo(userInfoVo);
        String jsonString = JsonHelper.encodeObject2Json(outDto);
        write(jsonString, response);
        return mapping.findForward(null);
    }
    /**
     * 验证是否为数字带小数点的格式
     * 可判断
     * @param str
     * @return
     */
    public static boolean valideNumber(String str){
    	str = str.replace(" ", "");
    	String pattern = "^(\\d*(\\.|。)*\\d*)*";
    	if(str.matches(pattern)){
    		return false;
    	}
    	return true;
    }
    /**
	 * 密码校验 
	 * 校验规则：六位相同密码、六位递增数字、六位递减数字
	 * @author frank 
	 * @date 2015-11-20
	 * @param password
	 * @return true：太简单不通过   false：通过
	 */
	public static boolean check(String password) {
		boolean rel = false;
		if(equalStr(password)){//是否为六位相同密码：如：111111 aaaaaa
			rel = true;
		}else if(isOrderNumericAsc(password)){//是否为六位递增数字：如：123456
			rel = true;
		}else if(isOrderNumericDesc(password)){//是否为六位递减数字：如：123456
			rel = true;
		}
		return rel;
	}
	// 不能全是相同的数字或者字母（如：000000、111111、aaaaaa） 全部相同返回true
	private static boolean equalStr(String numOrStr) {
		boolean flag = true;
		char str = numOrStr.charAt(0);
		for (int i = 0; i < numOrStr.length(); i++) {
			if (str != numOrStr.charAt(i)) {
				flag = false;
				break;
			}
		}
		return flag;
	}

	// 不能是连续的数字--递增（如：123456、12345678）连续数字返回true
	private static boolean isOrderNumericAsc(String numOrStr) {
		boolean flag = true;// 如果全是连续数字返回true
		boolean isNumeric = true;// 如果全是数字返回true
		for (int i = 0; i < numOrStr.length(); i++) {
			if (!Character.isDigit(numOrStr.charAt(i))) {
				isNumeric = false;
				break;
			}
		}
		if (isNumeric) {// 如果全是数字则执行是否连续数字判断
			for (int i = 0; i < numOrStr.length(); i++) {
				if (i > 0) {// 判断如123456
					int num = Integer.parseInt(numOrStr.charAt(i) + "");
					int num_ = Integer.parseInt(numOrStr.charAt(i - 1) + "") + 1;
					if (num != num_) {
						flag = false;
						break;
					}
				}
			}
		} else {
			flag = false;
		}
		return flag;
	}

	private static boolean isOrderNumericDesc(String numOrStr) {
		boolean flag = true;// 如果全是连续数字返回true
		boolean isNumeric = true;// 如果全是数字返回true
		for (int i = 0; i < numOrStr.length(); i++) {
			if (!Character.isDigit(numOrStr.charAt(i))) {
				isNumeric = false;
				break;
			}
		}
		if (isNumeric) {// 如果全是数字则执行是否连续数字判断
			for (int i = 0; i < numOrStr.length(); i++) {
				if (i > 0) {// 判断如654321
					int num = Integer.parseInt(numOrStr.charAt(i) + "");
					int num_ = Integer.parseInt(numOrStr.charAt(i - 1) + "") - 1;
					if (num != num_) {
						flag = false;
						break;
					}
				}
			}
		} else {
			flag = false;
		}
		return flag;
	}
}
