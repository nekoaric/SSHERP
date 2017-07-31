package com.cnnct.loginMode2.web;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.rif.web.BaseAction;

import com.cnnct.sys.vo.UserInfoVo;

public class MenuMobileAction extends BaseAction{
    
    /**
     * 初始化菜单界面
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward initView(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        return mapping.findForward("menu");
    }
    /**
     * 初始化QC界面
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward initQCView(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        return mapping.findForward("qcView");
    }
    
    /**
     * 菜单界面上的页面请求
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return  
     * @throws Exception
     */
    public ActionForward requestOrdNum(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        // 保存请求的标识 用在设置工厂或者订单返回的时候作为界面初始化的条件判断
        super.setSessionAttribute(request, "ordNumFlag", "ordNum");
        return mapping.findForward("ordNum");
    }
    /**
     * 菜单界面上的页面请求
     * 出运成品
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward requestOrdNum4product(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        super.setSessionAttribute(request, "ordNumFlag", "ordNumProduct");
        UserInfoVo user = super.getSessionContainer(request).getUserInfo();
        String account  = user.getAccount();
        String name = user.getUsername();
        request.setAttribute("account", account);
        request.setAttribute("name", name);
        request.setAttribute("natureFlag", "14");   // 添加出运成品标识
        return mapping.findForward("productView");
    }
    
    /**
     * 工厂出运B品菜单的请求
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward requestOrdNum4bp(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        super.setSessionAttribute(request, "ordNumFlag", "bProduct");
        UserInfoVo user = super.getSessionContainer(request).getUserInfo();
        String account  = user.getAccount();
        String name = user.getUsername();
        request.setAttribute("account", account);
        request.setAttribute("name", name);
        
        return mapping.findForward("ordNum");
    }
    /**
     * B品库存管理菜单的请求
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward requestOrdNum4bd(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        super.setSessionAttribute(request, "ordNumFlag", "bdepot");
        UserInfoVo user = super.getSessionContainer(request).getUserInfo();
        String account  = user.getAccount();
        String name = user.getUsername();
        request.setAttribute("account", account);
        request.setAttribute("name", name);
        
        return mapping.findForward("ordNum");
    }
    /**
     * 查询操作信息界面初始化
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward requestOperateView(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        UserInfoVo user = super.getSessionContainer(request).getUserInfo();
        String account  = user.getAccount();
        String name = user.getUsername();
        request.setAttribute("account", account);
        request.setAttribute("name", name);
        return mapping.findForward("operateView");
    }
    /**
     * 库存盘点界面初始化
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward requestDepotCheck(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        UserInfoVo user = super.getSessionContainer(request).getUserInfo();
        String account  = user.getAccount();
        String name = user.getUsername();
        request.setAttribute("account", account);
        request.setAttribute("name", name);
        return mapping.findForward("depotCheckView");
    }
    
}
