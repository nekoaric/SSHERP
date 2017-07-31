package com.cnnct.sys.web.tag;

import java.io.IOException;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.jsp.JspException;
import javax.servlet.jsp.tagext.TagSupport;

import com.cnnct.sys.vo.UserInfoVo;
import com.cnnct.util.ArmConstants;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import com.cnnct.sys.web.tag.vo.MenuVo;
import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.tplengine.DefaultTemplate;
import org.eredlab.g4.ccl.tplengine.FileTemplate;
import org.eredlab.g4.ccl.tplengine.TemplateEngine;
import org.eredlab.g4.ccl.tplengine.TemplateEngineFactory;
import org.eredlab.g4.ccl.tplengine.TemplateType;
import com.cnnct.util.GlobalConstants;
import org.eredlab.g4.rif.taglib.util.TagHelper;
import org.eredlab.g4.rif.util.SessionContainer;

/**
 * ArmRoleGrantMenuTree标签:eRedG4_ARM专用
 * @author XiongChun
 * @since 2010-05-22
 */
public class ArmRoleGrantMenuTreeTag extends TagSupport{
	
	private static Log log = LogFactory.getLog(ArmRoleGrantMenuTreeTag.class);
	private String key = "";
	private String authorizelevel = "1";
	
	/**
	 * 标签开始
	 */
	public int doStartTag() throws JspException{
		IDao g4Dao = (IDao)SpringBeanLoader.getSpringBean("g4Dao");
		HttpServletRequest request = (HttpServletRequest)this.pageContext.getRequest();
		Dto grantDto = new BaseDto();
		grantDto.put("roleid", request.getParameter("roleid"));
		grantDto.put("authorizelevel", authorizelevel);
		grantDto.put("roletype", request.getParameter("roletype"));
		
		List grantedList = g4Dao.queryForList("queryGrantedMenusByRoleId", grantDto);
		//List menuList = g4Dao.queryForList("queryMenusForRoleGrant", new BaseDto());
		Dto mDto = new BaseDto();
		SessionContainer sessionContainer = (SessionContainer) request.getSession(false).getAttribute("SessionContainer");
		UserInfoVo userInfo =sessionContainer.getUserInfo();
		List menuList = null;

		if(userInfo.getUsertype().equals(ArmConstants.ACCOUNTTYPE_ADMIN)){
	        mDto.put("userid", userInfo.getUserid());
		    menuList = g4Dao.queryForList("queryMenusForUserGrant4ZG", mDto);
		}else if(userInfo.getUsertype().equals(ArmConstants.ACCOUNTTYPE_GRPMANAGE)){
            mDto.put("userid", userInfo.getUserid());
            menuList = g4Dao.queryForList("queryMenusForUserGrant4ZG", mDto);
        } else {
		    mDto.put("userid", userInfo.getUserid());
            menuList = g4Dao.queryForList("queryMenusForRoleGrant_XQ", mDto);
        }
		
		for(int i = 0; i < menuList.size(); i++){
            MenuVo menuVo = (MenuVo)menuList.get(i);
            if(checkGeant(grantedList, menuVo.getMenuid()).booleanValue()){
                menuVo.setChecked("true");
            }else {
                menuVo.setChecked("false");
            }
            if(menuVo.getParentid().equals("0")){
                menuVo.setIsRoot("true");
            }
            if(menuVo.getMenuid().length() < 6){
                menuVo.setExpanded("true");
            }
        }
//		String  accountType=request.getParameter("roletype");
		String  accountType=userInfo.getUsertype();//登入人员的帐号类型
	    List _menuList = new ArrayList();
		// 屏蔽省级操作员相关权限
		/*if (accountType != null && !accountType.equals("") && accountType.equals(ArmConstants.ACCOUNTTYPE_PROVINCE_OPERATOE)) {
            MenuVo menuVo = null;
            for (int j = 0; j < menuList.size(); j++) {
                menuVo = (MenuVo)  menuList.get(j);
                if (menuVo.getMenuid().equals("01")||menuVo.getMenuid().equals("0111")|| menuVo.getMenuid().equals("011101")
                   ||menuVo.getMenuid().equals("011102")||menuVo.getMenuid().equals("011105")||menuVo.getMenuid().equals("0101")    
                   ||menuVo.getMenuid().equals("010104")||menuVo.getMenuid().equals("01010403")||menuVo.getMenuid().equals("0114")
                   ||menuVo.getMenuid().equals("011401")||menuVo.getMenuid().equals("011402")||menuVo.getMenuid().equals("011403")
                   ||menuVo.getMenuid().equals("011404")||menuVo.getMenuid().equals("011405")||menuVo.getMenuid().equals("011406")
                   ||menuVo.getMenuid().equals("011407")||menuVo.getMenuid().equals("011408")
                ) 
                {
                    _menuList.add(menuVo);
                }
            }
        }
		// 屏蔽地市管理员相关权限
        if (accountType != null && !accountType.equals("") && accountType.equals(ArmConstants.ACCOUNTTYPE_ADMINADMIN)) {
            MenuVo menuVo = null;
            for (int j = 0; j < menuList.size(); j++) {
                menuVo = (MenuVo)  menuList.get(j);
                if (menuVo.getMenuid().equals("01")||menuVo.getMenuid().startsWith("0113")||menuVo.getMenuid().startsWith("0111")||menuVo.getMenuid().equals("0101")
                   || menuVo.getMenuid().equals("010101")||menuVo.getMenuid().equals("01010103")||menuVo.getMenuid().equals("01010104") 
                   ||menuVo.getMenuid().equals("01010107") ||menuVo.getMenuid().equals("010104")||menuVo.getMenuid().equals("01010403")
                   ||menuVo.getMenuid().equals("0113")||menuVo.getMenuid().equals("011301")||menuVo.getMenuid().equals("011302")
                   ||menuVo.getMenuid().equals("011303")||menuVo.getMenuid().equals("011304")||menuVo.getMenuid().equals("011305")
                   ||menuVo.getMenuid().equals("011306")||menuVo.getMenuid().equals("011307")||menuVo.getMenuid().equals("011308")
                ) 
                {
                    _menuList.add(menuVo);
                }
            }
        }
        
      // 屏蔽地市操作员相关权限
        if (accountType != null && !accountType.equals("") && accountType.equals(ArmConstants.ACCOUNTTYPE_CITYOPERATOR)) {
            MenuVo menuVo = null;
            for (int j = 0; j < menuList.size(); j++) {
                menuVo = (MenuVo)  menuList.get(j);
                if (menuVo.getMenuid().equals("01")||menuVo.getMenuid().startsWith("0111")||menuVo.getMenuid().equals("0101")
                    || menuVo.getMenuid().equals("010101")||menuVo.getMenuid().equals("01010107")||menuVo.getMenuid().equals("0113")||menuVo.getMenuid().equals("011301")||menuVo.getMenuid().equals("011302")
                    ||menuVo.getMenuid().equals("011303")||menuVo.getMenuid().equals("011304")||menuVo.getMenuid().equals("011305")
                    ||menuVo.getMenuid().equals("011306")||menuVo.getMenuid().equals("011307")||menuVo.getMenuid().equals("011308")
                ) 
                {
                    _menuList.add(menuVo);
                }
            }
        }
        
       // 屏蔽客户经理相关权限
        if (accountType != null && !accountType.equals("") && accountType.equals(ArmConstants.ACCOUNTTYPE_CUSTOMER_MANAGER)) {
            MenuVo menuVo = null;
            for (int j = 0; j < menuList.size(); j++) {
                menuVo = (MenuVo)  menuList.get(j);
                if (menuVo.getMenuid().equals("01")||menuVo.getMenuid().equals("0111")||menuVo.getMenuid().equals("011102")||menuVo.getMenuid().equals("011104")||menuVo.getMenuid().equals("011105")  
                ) 
                {
                    _menuList.add(menuVo);
                }
            }
        }*/
        
        
        // 屏蔽企业操作员相关权限
		if (accountType != null && !accountType.equals("") && (accountType.equals(ArmConstants.ACCOUNTTYPE_ADMIN)||
                accountType.equals(ArmConstants.ACCOUNTTYPE_GRPMANAGE))) {
			MenuVo menuVo = null;
			for (int j = 0; j < menuList.size(); j++) {
				menuVo = (MenuVo) menuList.get(j);
				if (menuVo.getMenuid().equals("01") || menuVo.getMenuid().equals("0101") || menuVo.getMenuid().equals("010101")
				        || menuVo.getMenuid().equals("010102") || menuVo.getMenuid().equals("010103")
				        || menuVo.getMenuid().equals("01010110")
				        || menuVo.getMenuid().equals("01010101") || menuVo.getMenuid().equals("01010201")
				        || menuVo.getMenuid().equals("01010307") || menuVo.getMenuid().equals("01010306")
				        || menuVo.getMenuid().equals("01010308") || menuVo.getMenuid().startsWith("0104")
				        || menuVo.getMenuid().startsWith("0105") || menuVo.getMenuid().startsWith("0107")
				        || menuVo.getMenuid().startsWith("0108") || menuVo.getMenuid().startsWith("0115")
				        || menuVo.getMenuid().startsWith("0116") || menuVo.getMenuid().startsWith("0117")
				        || menuVo.getMenuid().startsWith("0118") || menuVo.getMenuid().startsWith("0119")
                        || menuVo.getMenuid().startsWith("0120")) {
					_menuList.add(menuVo);
				}
			}
		}
		Dto dto = new BaseDto();
		/*// 省级操作员
	    if (accountType != null && !accountType.equals("") && accountType.equals(ArmConstants.ACCOUNTTYPE_PROVINCE_OPERATOE)){
	        menuList=_menuList; 
	    }
	   // 地市管理员
        if (accountType != null && !accountType.equals("") && accountType.equals(ArmConstants.ACCOUNTTYPE_ADMINADMIN)){
            menuList=_menuList; 
        }
        // 地市操作员
        if (accountType != null && !accountType.equals("") && accountType.equals(ArmConstants.ACCOUNTTYPE_CITYOPERATOR)){
            menuList=_menuList; 
        }
       // 客户经理
        if (accountType != null && !accountType.equals("") && accountType.equals(ArmConstants.ACCOUNTTYPE_CUSTOMER_MANAGER)){
            menuList=_menuList; 
        }*/
       // 系统管理员
        if (accountType != null && !accountType.equals("") && accountType.equals(ArmConstants.ACCOUNTTYPE_ADMIN)){
            menuList=_menuList; 
        }
       // 分厂操作员
        if (accountType != null && !accountType.equals("") && accountType.equals(ArmConstants.ACCOUNTTYPE_GRPMANAGE)){
            menuList=_menuList;
        }

        //拼接菜单UI list
        StringBuffer menuids = new StringBuffer();
        for(int i=0;i<menuList.size();i++){
            MenuVo menuVo = (MenuVo)menuList.get(i);
            menuids.append(menuVo.getMenuid()+",");

            menuVo.setMenuid("menu"+menuVo.getMenuid());
            menuVo.setParentid("menu"+menuVo.getParentid());
        }
        if(menuids.length()!=0){
            grantDto.put("menuids",menuids.substring(0,menuids.length()-1));
        }

        List uiList = g4Dao.queryForList("queryMenuPart4RoleGrant",grantDto);//在menus列表中查找对应的菜单ui

        for(int i=0;i<uiList.size();i++){
            Dto uiDto = (BaseDto)uiList.get(i);
            if(!"".equals(uiDto.getAsString("roleid"))){
                uiDto.put("checked",true);
            }else{
                uiDto.put("checked",false);
            }
            uiDto.put("parentid","menu"+uiDto.getAsString("menuid"));//设置parentid 为菜单id
            //设置menuid 为 "菜单ids部件id"--s作为分隔符
            uiDto.put("menuid","part"+uiDto.getAsString("menuid")+"s"+uiDto.getAsString("partid"));
            uiDto.put("menuname",uiDto.getAsString("remark"));
        }

        menuList.addAll(uiList);

		dto.put("menuList", menuList);
		dto.put("key", key);
		dto.put("authorizelevel", authorizelevel);

		TemplateEngine engine = TemplateEngineFactory.getTemplateEngine(TemplateType.VELOCITY);
		DefaultTemplate template = new FileTemplate();
		template.setTemplateResource(TagHelper.getTemplatePath(getClass().getName()));
		StringWriter writer = engine.mergeTemplate(template, dto);
		try {
			pageContext.getOut().write(writer.toString());
		} catch (IOException e) {
			log.error(GlobalConstants.Exception_Head + e.getMessage());
			e.printStackTrace();
		}
		return super.SKIP_BODY;
	}
	
	/**
	 * 检查授权
	 * @param grantList
	 * @param pMenuid
	 * @return
	 */
	private Boolean checkGeant(List grantList, String pMenuid){
		Boolean result = new Boolean(false);
		for(int i = 0; i < grantList.size(); i++){
			Dto dto = (BaseDto)grantList.get(i);
			if(pMenuid.equals(dto.getAsString("menuid"))){
				result = new Boolean(true);
			}
		}
		return result;
	}
	
	/**
	 * 标签结束
	 */
	public int doEndTag() throws JspException{
		return super.EVAL_PAGE;
	}
	
	/**
	 * 释放资源
	 */
	public void release(){
		setKey(null);
		setAuthorizelevel(null);
		super.release();
	}

	public void setKey(String key) {
		this.key = key;
	}

	public void setAuthorizelevel(String authorizelevel) {
		this.authorizelevel = authorizelevel;
	}
}
