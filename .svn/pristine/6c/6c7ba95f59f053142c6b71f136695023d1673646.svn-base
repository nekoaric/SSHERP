package com.cnnct.loginMode2.web;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import com.cnnct.loginMode2.service.AccountGrpService;
import com.cnnct.rfid.service.ProdOrdInfoService;
import com.cnnct.sys.vo.UserInfoVo;
import com.cnnct.util.NatureUtil;
import com.cnnct.util.TimeUtil;

/**
 * loginMode2的个性化设置
 * @author zhouww
 * @since 2014-12-25
 */
public class AccountAction extends BaseAction{
    
    private ProdOrdInfoService prodOrdInfoService = (ProdOrdInfoService) super
            .getService("prodOrdInfoService");
    private AccountGrpService accountGrp = (AccountGrpService)super.getService("accountGrp");
    
    /**
     * 工厂设置界面
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward init(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        UserInfoVo user = super.getSessionContainer(request).getUserInfo();
        String account  = user.getAccount();
        String name = user.getUsername();
        request.setAttribute("account", account);
        request.setAttribute("name", name);
        return mapping.findForward("success");
    }
    /**
     * 初始化我的订单界面
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward initMyOrderView(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        UserInfoVo user = super.getSessionContainer(request).getUserInfo();
        String account  = user.getAccount();
        String name = user.getUsername();
        request.setAttribute("account", account);
        request.setAttribute("name", name);
        return mapping.findForward("myOrdView");
    }
    /**
     * 查询订单号，用于设置我的订单
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward queryOrder(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        try{
            String account = super.getSessionContainer(request).getUserInfo().getAccount();
            
            CommonActionForm cForm = (CommonActionForm)form;
            Dto inDto = cForm.getParamAsDto(request);
            String style_no = inDto.getAsString("style_no");
            String order_id = inDto.getAsString("order_id");
            String natureFlag = inDto.getAsString("natureFlag");
            String product_flag=inDto.getAsString("product_flag");
            
            inDto.put("style_no", parseQueryParam(style_no));
            inDto.put("order_id", parseQueryParam(order_id));
            inDto.put("account", account);
            inDto.put("nature", natureFlag);
            inDto.put("product_flag", product_flag);
            
            int maxNum = inDto.getAsInteger("maxNum");
            int count = g4Reader.queryForPageCount("queryOrder4mobile", inDto);
            if(count>maxNum){
                outDto.put("success", false);
                outDto.put("msg", "查询结果超出指定的数量");
            }else {
                List<Dto> resultList = g4Reader.queryForList("queryOrder4mobile",inDto);
                outDto.put("success", true);
                outDto.put("orders", resultList);
            }
        }catch(Exception e){
            outDto = new BaseDto();
            outDto.put("success", false);
            outDto.put("msg", "查询失败");
        }
        String resultStr = JsonHelper.encodeObject2Json(outDto);
        super.write(resultStr, response);
        return mapping.findForward(null);
    }
    
    /**
     * 设置我的订单信息
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward updateMyOrder(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        try{
            String account = super.getSessionContainer(request).getUserInfo().getAccount();
            
            CommonActionForm cForm = (CommonActionForm)form;
            Dto inDto = cForm.getParamAsDto(request);
            String ord_seq_no = inDto.getAsString("ord_seq_no");
            String prod_ord_seq = inDto.getAsString("prod_ord_seq");
            inDto.put("ord_seq_no", parseQueryParam(ord_seq_no));
            inDto.put("prod_ord_seq", parseQueryParam(prod_ord_seq));
            inDto.put("account", account);
            
    //        flag=1是添加  0：是取消
            String flag = inDto.getAsString("flag");
            if("1".equals(flag)){
                accountGrp.addMyOrder(inDto);
            }else {
                accountGrp.deleteMyOrder(inDto);
            }
        }catch(Exception e){
            e.printStackTrace();
            Dto outDto = new BaseDto();
            outDto.put("success", false);
            outDto.put("msg", "操作失败");
            String resultStr = JsonHelper.encodeObject2Json(outDto);
            super.write(resultStr, response);
            return mapping.findForward(null);
        }
        Dto outDto = new BaseDto();
        outDto.put("success", true);
        outDto.put("msg", "操作成功");
        String resultStr = JsonHelper.encodeObject2Json(outDto);
        super.write(resultStr, response);
        return mapping.findForward(null);
    }
 
    
    /**
     * 查询我的订单信息
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward queryMyOrder(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        
        String account = super.getSessionContainer(request).getUserInfo().getAccount();
        
        Dto inDto = new BaseDto();
        inDto.put("account", account);
        List<Dto> resultList = g4Reader.queryForList("queryOrderOperator", inDto);
        
        Dto outDto = new BaseDto();
        outDto.put("success", true);
        outDto.put("myorders", resultList);
        String resultStr = JsonHelper.encodeObject2Json(outDto);
        super.write(resultStr, response);
        return mapping.findForward(null);
    }
    
    
    
    /**
     * 查询工厂信息
     * <br>返回包含所有创建工厂，选择工厂
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward queryGrps(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        // 查询出所有的工厂
        // 设置所有工厂的leaf标识。叶子节点标志为true，不是叶子节点标志为false
        List<Dto> grps = g4Reader.queryForList("queryAllGrps");
        String account = super.getSessionContainer(request).getUserInfo().getAccount();
        grps = addLeafFlag(grps);
        
        // 查询我的工厂信息
        Dto dbDto = new BaseDto();
        dbDto.put("account", account);
        List<Dto> myGrps = g4Reader.queryForList("queryMyGrps",dbDto);
        
        // 处理输出对象
        Dto outDto = new  BaseDto();
        outDto.put("allGrps", grps);
        outDto.put("myGrps", myGrps);
        String resultStr = JsonHelper.encodeObject2Json(outDto);
        super.write(resultStr, response);
        return mapping.findForward(null);
    }
    
    /**
     * 设置我的工厂信息
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward updateGrps(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        // 解析处理数据
        CommonActionForm cForm = (CommonActionForm)form;
        Dto inDto = cForm.getParamAsDto(request);
        // 添加用户工号信息
        String account = super.getSessionContainer(request).getUserInfo().getAccount();
        inDto.put("account", account);
        accountGrp.updateGrps(inDto);
        
        Dto outDto = new BaseDto();
        outDto.put("success", true);
        outDto.put("msg", "成功保存");
        super.write(JsonHelper.encodeObject2Json(outDto), response);
        return mapping.findForward(null);
    }
    /**
     * 查询我的工厂信息
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward queryMyGrps(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        String account = super.getSessionContainer(request).getUserInfo().getAccount();
        // 查询我的工厂信息
        Dto dbDto = new BaseDto();
        dbDto.put("account", account);
        List<Dto> myGrps = g4Reader.queryForList("queryMyGrps",dbDto);
        
        Dto outDto = new BaseDto();
        outDto.put("myGrps", myGrps);
        
        String resultStr = JsonHelper.encodeObject2Json(outDto);
        super.write(resultStr, response);
        return mapping.findForward(null);
    }
    
    
    
    
    
    /**
     * 添加叶子标识
     * @param list
     * @return
     */
    private List<Dto> addLeafFlag(List<Dto> list){
        // 遍历出所有的父节点
        Set<String> parentIds = new HashSet<String>();
        for(Dto dto : list) {
            parentIds.add(dto.getAsString("parentid"));
        }
        // 再次遍历所有元素添加是否是叶子节点标识
        for(Dto dto : list) {
            if(parentIds.contains(dto.getAsString("id"))){
                dto.put("leaf", false);
            }else {
                dto.put("leaf", true);
            }
        }
        
        return list;
    } 
    
    /**
     * 保存我的订单信息
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward saveMyOrders(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {

        CommonActionForm aForm = (CommonActionForm) form;
        Dto parDto = aForm.getParamAsDto(request);

        UserInfoVo user = super.getSessionContainer(request).getUserInfo();

        parDto.put("account", user.getAccount()); // 添加用户
        prodOrdInfoService.saveMyOrder(parDto);
        
        Dto outDto = new BaseDto();
        outDto.put("success", true);
        outDto.put("msg", "操作成功");
        
        super.write(JsonHelper.encodeObject2Json(outDto), response);
        return mapping.findForward(null);

    }
    /**
     * 查询我的菜单的权限
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward queryMenuInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Dto outDto = null;
        try{
            CommonActionForm cForm = (CommonActionForm)form;
            Dto inDto = cForm.getParamAsDto(request);
            UserInfoVo userInfo = super.getSessionContainer(request).getUserInfo();
            String user_type = userInfo.getUsertype();
            String account = userInfo.getAccount();
            
            Dto dbDto = new BaseDto();
            dbDto.put("menu_id", inDto.getAsString("rootMenu"));
            dbDto.put("account", account);
            dbDto.put("user_type", user_type);
            
            List<Dto> resultList = g4Reader.queryForList("queryMyMenuauth", dbDto);
            
            outDto = new BaseDto();
            outDto.put("success", true);
            outDto.put("menus", resultList);
        }catch(Exception e){
            e.printStackTrace();
            outDto = new BaseDto();
            outDto.put("success", false);
            outDto.put("msg", "查询失败");
        }
        String resultStr = JsonHelper.encodeObject2Json(outDto);
        super.write(resultStr, response);
        return mapping.findForward(null);
    }
    
    /**
     * 查询流水记录信息
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward queryOrdDayListInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Dto outDto = null;
        try{
            UserInfoVo userInfo = super.getSessionContainer(request).getUserInfo();
            String account = userInfo.getAccount();
            String opr_date = TimeUtil.getCurrentDate("yyyy-MM-dd");
            
            Dto dbDto = new BaseDto();
            dbDto.put("opr_date", opr_date);
            dbDto.put("opr_id", account);
            
            List<Dto> resultList = g4Reader.queryForList("queryOrdDayList4mobile", dbDto);
            // 添加数量性质名字
            for(Dto dto : resultList){
                String nature = dto.getAsString("nature");
                dto.put("natureName", NatureUtil.parseNC2natureZh(nature));
            }
            
            outDto = new BaseDto();
            outDto.put("success", true);
            outDto.put("result", resultList);
        }catch (Exception e) {
            e.printStackTrace();
            outDto = new BaseDto();
            outDto.put("success", false);
            outDto.put("msg", "查询错误");
        }
        String resutlStr = JsonHelper.encodeObject2Json(outDto);
        super.write(resutlStr, response);
        
        return mapping.findForward(null);
    }
    
    
    /**
     * 单引号转双单引号
     * @param str
     * @return
     */
    private String parseQueryParam(String str){
        return str.replace("'", "''");
    }
}
