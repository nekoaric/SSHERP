package com.cnnct.loginMode2.web;

import java.util.List;

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

import com.cnnct.loginMode2.service.OrderFeedbackService;
import com.cnnct.sys.vo.UserInfoVo;
import com.cnnct.util.TimeUtil;

/**
 * 订单信息反馈
 * @author zhouww
 * @since 2015-03-16
 */
public class OrderFeedbackAction extends BaseAction {
    
    private OrderFeedbackService orderFeedbackService = (OrderFeedbackService) super
            .getService("orderFbService");
    
    /**
     * 初始化反馈操作界面
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward initView(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        
        return mapping.findForward("initView");
    }
    
    /**
     * 修改反馈订单的信息
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward upddateFbOrder(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Dto outDto;
        try{
            CommonActionForm cForm = (CommonActionForm)form;
            Dto inDto = cForm.getParamAsDto(request);
            UserInfoVo user = super.getSessionContainer(request).getUserInfo();
            checkUserId(user);
            String opr_date = TimeUtil.getCurrentDate("yyyy-MM-dd");
            String opr_time = TimeUtil.getCurrentDate("HH:mm:ss");
            inDto.put("handle_id", user.getAccount());
            inDto.put("handle_date", opr_date);
            inDto.put("handle_time", opr_time);
            orderFeedbackService.updateOrderFbInfo(inDto);
            outDto = new BaseDto();
            outDto.put("success", true);
            outDto.put("msg", "信息修改成功");
        }catch(Exception e){
            e.printStackTrace();
            outDto = new BaseDto();
            outDto.put("success", false);
            outDto.put("msg", "信息修改失败");
        }
        String resultStr = JsonHelper.encodeObject2Json(outDto);
        super.write(resultStr, response);
        return null;
    }
    /**
     * 查询反馈的订单信息
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward queryFbOrder(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        System.out.println("订单反馈");
        try{
            CommonActionForm cForm = (CommonActionForm)form;
            Dto inDto = cForm.getParamAsDto(request);
            inDto.remove("currentLoginedUserId");
            List<Dto> resultList = g4Reader.queryForPage("queryFbOrder", inDto);
            int count = g4Reader.queryForPageCount("queryFbOrder", inDto);
            
            String resultStr = JsonHelper.encodeList2PageJson(resultList,count,null);
            super.write(resultStr, response);
        }catch(Exception e){
            e.printStackTrace();
        }
        return null;
    }
    /**
     * 保存反馈的信息
     * 
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward saveFeedbackInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Dto outDto;
        try{
            CommonActionForm cForm = (CommonActionForm)form;
            Dto inDto = cForm.getParamAsDto(request);
            UserInfoVo user = super.getSessionContainer(request).getUserInfo();
            String opr_date = TimeUtil.getCurrentDate("yyyy-MM-dd");
            String opr_time = TimeUtil.getCurrentDate("HH:mm:ss");
            inDto.put("opr_date", opr_date);
            inDto.put("opr_time", opr_time);
            inDto.put("opr_id", user.getAccount());
            inDto.put("state", "0"); //设置初始化状态 ：提交状态
            Dto cDto=new BaseDto();
            cDto.put("order_id", inDto.getAsString("order_id"));
            int count = g4Reader.queryForPageCount("queryFbOrder", cDto);
            if (count>0) {
				throw new Exception("该po号已经提交回馈，请查看管理员处理结果");
			}
            orderFeedbackService.saveOrderFbInfo(inDto);
            outDto = new BaseDto();
            outDto.put("success", true);
            outDto.put("msg", "保存成功");
        }catch(Exception e){
            e.printStackTrace();
            outDto = new BaseDto();
            outDto.put("success", false);
            outDto.put("msg", "保存失败");
            outDto.put("msg2", e.getMessage());
        }
        String resultStr = JsonHelper.encodeObject2Json(outDto);
        super.write(resultStr, response);
        return null;
    }
    
 // 限制上传和删除的用户
 	public void checkUserId(UserInfoVo user) throws Exception {
 		if ("1000".equals(user.getAccount())
 				|| "1001".equals(user.getAccount())) {
 		} else {
 			throw new Exception("您的账户不支持该功能!");
 		}

 	}
    
}
