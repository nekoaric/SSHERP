package com.cnnct.sys.web.tag;

import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.jsp.JspException;
import javax.servlet.jsp.JspWriter;
import javax.servlet.jsp.tagext.TagSupport;

import com.cnnct.util.G4Utils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import com.cnnct.sys.service.ArmTagSupportService;
import com.cnnct.util.ArmConstants;
import com.cnnct.sys.vo.UserInfoVo;
import com.cnnct.sys.web.tag.vo.MenuVo;
import org.eredlab.g4.bmf.base.IReader;
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
import org.eredlab.g4.rif.util.WebUtils;

/**
 * ARMViewport标签:eRedG4_ARM专用
 *
 * @author XiongChun
 * @since 2010-01-22
 */
@SuppressWarnings({"unchecked", "serial", "static-access", "rawtypes"})
public class ArmViewportTag extends TagSupport {

    private static Log log = LogFactory.getLog(ArmViewportTag.class);

    ArmTagSupportService armTagSupportService = (ArmTagSupportService) SpringBeanLoader.getSpringBean("armTagSupportService");

    private String northTitle = "";
    private String westTitle = "";
    private String scriptStart = "<script type=\"text/javascript\">";
    private String scriptEnd = "</script>";

    /**
     * 标签初始方法
     *
     * @return
     * @throws JspException
     */
    public int doStartTag() throws JspException {
        return super.SKIP_BODY;
    }

    /**
     * 标签主体
     *
     * @return
     * @throws JspException
     */
    public int doEndTag() throws JspException {
        JspWriter writer = pageContext.getOut();
        try {
            writer.print(getPanelScript());
        } catch (Exception e) {
            log.error(GlobalConstants.Exception_Head + e.getMessage());
            e.printStackTrace();
        }
        return super.EVAL_PAGE;
    }

    /**
     * 获取Viewport标记脚本
     *
     * @return 返回Viewport标记脚本
     */
    private String getPanelScript() {
        IReader g4Reader = (IReader) SpringBeanLoader.getSpringBean("g4Reader");

        HttpServletRequest request = (HttpServletRequest) this.pageContext.getRequest();
        Dto dto = new BaseDto();
        northTitle = "玖地集团 生产信息管理系统";
        dto.put("northTitle", northTitle);
        dto.put("centerTitle", northTitle);
        dto.put("westTitle", westTitle);
        dto.put("scriptStart", scriptStart);
        dto.put("scriptEnd", scriptEnd);

        String contextPath = request.getContextPath();
        request.setAttribute("webContext", contextPath);
        dto.put("contextPath", contextPath);

        UserInfoVo userInfo = WebUtils.getSessionContainer(request).getUserInfo();
        String userid = userInfo.getUserid();
        Dto qDto = new BaseDto();
        qDto.put("user_id", userid);
        List cardList = armTagSupportService.getCardList(qDto).getDefaultAList();
        for (int i = 0; i < cardList.size(); i++) {
            MenuVo cardVo = (MenuVo) cardList.get(i);
            if (i != cardList.size() - 1) {
                cardVo.setIsNotLast("true");
            }
        }

        dto.put("date", G4Utils.getCurDate());
        dto.put("week", G4Utils.getWeekDayByDate(G4Utils.getCurDate()));
        dto.put("welcome", getWelcomeMsg());
        dto.put("cardList", cardList);
        dto.put("username", userInfo.getUsername());
        dto.put("account", userInfo.getAccount());
        dto.put("deptname", userInfo.getDeptName());
        // 欢迎信息添加企业名称
        dto.put("grpname", "常州东奥服装有限公司"); // 企业名称

        // 欢迎信息添加角色名称
        Dto _roleDto = new BaseDto();
        _roleDto.put("user_id", userInfo.getUserid());
        Object roleObj = g4Reader.queryForObject("getRoleInfo", _roleDto);
        String usertype = userInfo.getUsertype();
        if (roleObj != null) {
            Dto roleInfoDto = (BaseDto) roleObj;
            dto.put("rolename", roleInfoDto.getAsString("role_name")); // 角色名称
        } else if (ArmConstants.ACCOUNTTYPE_ADMIN.equals(usertype)) {
            dto.put("rolename", "企业管理员"); // 角色名称
        } else if (ArmConstants.ACCOUNTTYPE_OPERATOR.equals(usertype)) {
            dto.put("rolename", "企业操作员"); // 角色名称
        } else if (ArmConstants.ACCOUNTTYPE_GRPMANAGE.equals(usertype)) {
            dto.put("rolename", "分厂管理员"); // 角色名称
        }else if (ArmConstants.ACCOUNTTYPE_SUPER.equals(usertype)) {
            dto.put("rolename", "超级管理员"); // 角色名称
        }

        Dto themeDto = new BaseDto();
        themeDto.put("user_id", userInfo.getUserid());
        Dto resultDto = (BaseDto) g4Reader.queryForObject("getSysUserSubInfo", themeDto);
        resultDto = resultDto ==null?new BaseDto():resultDto;

        String theme = resultDto.getAsString("theme");
        theme = G4Utils.isEmpty(theme) ? "default" : theme;
        dto.put("theme", theme);
        dto.put("themeColor", getThemeColor(theme));
        dto.put("titleImg", "eRedG4_Title_2.jpg");

        //布局
        String layout = resultDto.getAsString("layout");
        String defaultLayout = WebUtils.getParamValue("APP_LAYOUT", request);
        defaultLayout = "".equals(defaultLayout)?"1":defaultLayout;
        layout = G4Utils.isEmpty(layout) ? defaultLayout : layout;
        dto.put("layout", layout);

        TemplateEngine engine = TemplateEngineFactory.getTemplateEngine(TemplateType.VELOCITY);
        DefaultTemplate template = new FileTemplate();
        template.setTemplateResource(TagHelper.getTemplatePath(getClass().getName()));
        StringWriter writer = engine.mergeTemplate(template, dto);

        String treesString = generateCardTrees(dto);
        return treesString + "\n" + writer.toString();
    }

    /**
     * 生成卡片树
     *
     * @param rootMenuId
     */
    private String generateCardTrees(Dto pDto) {
        HttpServletRequest request = (HttpServletRequest) pageContext.getRequest();
        SessionContainer sessionContainer = WebUtils.getSessionContainer(request);
        String userid = sessionContainer.getUserInfo().getUserid();
        String accountType = pDto.getAsString("accountType");
        String menuname = "玖地集团 生产管理系统";

        Dto qDto = new BaseDto();
        qDto.put("user_id", userid);

        List cardList = (List) pDto.get("cardList");//卡片树根节点列表

        String treesString = scriptStart + "Ext.onReady(function(){";
        for (int i = 0; i < cardList.size(); i++) {
            MenuVo cardVo = (MenuVo) cardList.get(i);
            qDto.put("menuid", cardVo.getMenuid());

            List menuList = armTagSupportService.getCardTreeList(qDto).getDefaultAList();

            Dto pathDto = new BaseDto();
            pathDto.put("01", menuname);
            Dto dto = new BaseDto();
            dto.put("menuList", generateMenuPathName(menuList, pathDto));
            dto.put("menuid", cardVo.getMenuid());

            TemplateEngine engine = TemplateEngineFactory.getTemplateEngine(TemplateType.VELOCITY);
            DefaultTemplate template = new FileTemplate();
            template.setTemplateResource(TagHelper.getTemplatePath(getClass().getName(), "CardTreesTag.tpl"));
            StringWriter writer = engine.mergeTemplate(template, dto);
            treesString = treesString + "\n" + writer.toString();
        }

        treesString = treesString + "\n});";

        return treesString + scriptEnd;
    }

    /**
     * 生成菜单路径对应中文名
     *
     * @param pMenuList 菜单列表
     * @return
     */
    public List generateMenuPathName(List pMenuList, Dto pDto) {
        for (int i = 0; i < pMenuList.size(); i++) {
            MenuVo vo = (MenuVo) pMenuList.get(i);
            pDto.put(vo.getMenuid(), vo.getMenuname());
        }
        for (int i = 0; i < pMenuList.size(); i++) {
            String path = "";
            MenuVo vo = (MenuVo) pMenuList.get(i);
            String menuId = vo.getMenuid();
            int temp = menuId.length() / 2;
            int m = 0, k = 2;
            for (int j = 0; j < temp; j++) {
                path += pDto.getAsString(menuId.substring(m, k)) + " -> ";
                k += 2;
            }
            vo.setMenupath(path.substring(0, path.length() - 4));
        }
        return pMenuList;
    }


    /**
     * 释放资源
     */
    public void release() {
        super.release();
        northTitle = null;
        westTitle = null;
    }

    /**
     * 生成问候信息
     *
     * @return
     */
    private String getWelcomeMsg() {
        String welcome = "晚上好";
        Integer timeInteger = new Integer(G4Utils.getCurrentTime("HH"));
        if (timeInteger.intValue() >= 7 && timeInteger.intValue() <= 12) {
            welcome = "上午好";
        } else if (timeInteger.intValue() > 12 && timeInteger.intValue() < 19) {
            welcome = "下午好";
        }
        return welcome;
    }

    /**
     * 获取和主题对应匹配的颜色值
     */
    private String getThemeColor(String theme) {
        String color = "slategray";
        if (theme.equalsIgnoreCase("default")) {
            color = "4798D7";
        } else if (theme.equalsIgnoreCase("lightRed")) {
            color = "F094C9";
        } else if (theme.equalsIgnoreCase("lightYellow")) {
            color = "EAAA85";
        } else if (theme.equalsIgnoreCase("gray")) {
            color = "969696";
        } else if (theme.equalsIgnoreCase("lightGreen")) {
            color = "53E94E";
        } else if (theme.equalsIgnoreCase("purple2")) {
            color = "BC5FD8";
        }
        return color;
    }

    public void setNorthTitle(String northTitle) {
        this.northTitle = northTitle;
    }

    public void setWestTitle(String westTitle) {
        this.westTitle = westTitle;
    }

    public void setScriptStart(String scriptStart) {
        this.scriptStart = scriptStart;
    }

    public void setScriptEnd(String scriptEnd) {
        this.scriptEnd = scriptEnd;
    }
}
