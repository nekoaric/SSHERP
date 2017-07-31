package com.cnnct.sys.web.tag;

import com.cnnct.sys.vo.UserInfoVo;
import com.cnnct.util.G4Utils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import com.cnnct.sys.service.ArmTagSupportService;
import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.ccl.properties.PropertiesFactory;
import org.eredlab.g4.ccl.properties.PropertiesFile;
import org.eredlab.g4.ccl.properties.PropertiesHelper;
import org.eredlab.g4.ccl.tplengine.*;
import com.cnnct.util.GlobalConstants;
import org.eredlab.g4.rif.taglib.util.TagConstant;
import org.eredlab.g4.rif.taglib.util.TagHelper;
import org.eredlab.g4.rif.util.WebUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.jsp.JspException;
import javax.servlet.jsp.tagext.TagSupport;
import java.io.IOException;
import java.io.StringWriter;

/**
 * Desktop桌面布局标签:G4Studio_ARM专用
 * 
 * @author XiongChun
 * @since 2012-12-22
 */
public class ArmDesktopTag extends TagSupport{
    ArmTagSupportService armTagSupportService = (ArmTagSupportService) SpringBeanLoader.getSpringBean("armTagSupportService");
	private static Log log = LogFactory.getLog(ArmDesktopTag.class);
	
	/**
	 * 标签开始
	 */
	public int doStartTag() throws JspException{
        IReader g4Reader = (IReader)SpringBeanLoader.getSpringBean("g4Reader");

		HttpServletRequest request = (HttpServletRequest)pageContext.getRequest();
		UserInfoVo userInfo = WebUtils.getSessionContainer(request).getUserInfo();

        Dto dto = new BaseDto();
        PropertiesHelper pHelper = PropertiesFactory.getPropertiesHelper(PropertiesFile.G4);
        dto.put("title", "常州东奥服装有限公司RFID系统");
        String contextPath = request.getContextPath();
        request.setAttribute("webContext", contextPath);
        dto.put("contextPath", contextPath);
		String titleIcon = WebUtils.getParamValue("TITLE_ICON", request);
		dto.put("titleIcon", G4Utils.isEmpty(titleIcon) ? "G4Studio.ico" : titleIcon);

        //用户主题
        Dto themeDto = new BaseDto();
        themeDto.put("user_id", userInfo.getUserid());
        Dto resultDto = (BaseDto)g4Reader.queryForObject("getSysUserSubInfo", themeDto);
		String theme = null;
		if(G4Utils.isNotEmpty(resultDto))
			theme = resultDto.getAsString("theme");
		String defaultTheme = WebUtils.getParamValue("SYS_DEFAULT_THEME", request);
		theme = G4Utils.isEmpty(theme) ? defaultTheme : theme;
		dto.put("theme", theme);

        //布局
        String layout = resultDto.getAsString("layout");
        String defaultLayout = WebUtils.getParamValue("APP_LAYOUT", request);
        defaultLayout = "".equals(defaultLayout)?"1":defaultLayout;
        layout = G4Utils.isEmpty(layout) ? defaultLayout : layout;
        dto.put("layout", layout);
        //背景
		String background = null;
		if(G4Utils.isNotEmpty(resultDto))
			background = resultDto.getAsString("remark");
		String defaultBackfround = "desktop1.jpg";
		background = G4Utils.isEmpty(background) ? defaultBackfround : background;
		dto.put("background", background);

		PropertiesHelper p = PropertiesFactory.getPropertiesHelper(PropertiesFile.G4);
		dto.put("extMode", p.getValue("extMode", TagConstant.Ext_Mode_Run));
		dto.put("runMode", p.getValue("runMode", TagConstant.RUN_MODE_NORMAL));
		dto.put("ajaxErrCode", GlobalConstants.Ajax_Timeout);

		dto.put("userInfo", userInfo);
		dto.put("username", userInfo.getUsername());
		dto.put("account", userInfo.getAccount());

        //获取菜单
		Dto menuDto = getMenuDto(userInfo.getUserid());
		dto.put("menuList", menuDto.getDefaultAList());
        dto.put("menuListJson", JsonHelper.encodeObject2Json(menuDto.getDefaultAList()));
		dto.put("menuTreeList", menuDto.getDefaultBList());

        //生成模版
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
	 * 获取权限内的功能菜单
	 * 
	 * @return
	 */
	private Dto getMenuDto(String user_id){
		Dto qDto = new BaseDto();
		qDto.put("user_id", user_id);
        Dto menuDto =  armTagSupportService.getMenuList4Desktop(qDto);

		return menuDto;
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

		super.release();
	}
}
