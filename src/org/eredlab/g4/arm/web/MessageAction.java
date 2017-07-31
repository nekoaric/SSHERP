package org.eredlab.g4.arm.web;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.arm.service.MessageService;
import com.cnnct.sys.vo.UserInfoVo;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import com.cnnct.util.GlobalConstants;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

public class MessageAction extends BaseAction{
  Log log = LogFactory.getLog(OrganizationAction.class);
  private MessageService messageService = (MessageService) super.getService("messageService");
  /***
   * 短信管理页面初始化页面
   * @param mapping
   * @param form
   * @param request
   * @param response
   * @return
   * @throws Exception
   */
  public ActionForward messageOpenInit(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
          throws Exception {
      return mapping.findForward("messageOpenView");
  }

  
  /***
   * 短信管理查询
   * @param mapping
   * @param form
   * @param request
   * @param response
   * @return
   * @throws Exception
   */
  public ActionForward queryMessageOpenItems(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
          throws Exception {
      CommonActionForm aForm = (CommonActionForm) form;
      Dto outDto = new BaseDto();
      Dto dto = aForm.getParamAsDto(request);
      UserInfoVo userInfo = getSessionContainer(request).getUserInfo();
      dto.put("grp_id", userInfo.getGrpId());
      List list =g4Reader.queryForPage("getMessageList",dto);
      Integer totalCount =1;
      outDto.put("jsonStrList", JsonHelper.encodeList2PageJson(list, totalCount, GlobalConstants.FORMAT_Date));
      String jsonStrList = outDto.getAsString("jsonStrList");
      response.getWriter().write(jsonStrList);
      return mapping.findForward(null);
  }

  
  
  /***
   * 修改
   * 
   * @param mapping
   * @param form
   * @param request
   * @param response
   * @return
   * @throws Exception
   */
  public ActionForward  updateMessageItem(ActionMapping mapping, ActionForm form, HttpServletRequest request, HttpServletResponse response)
          throws Exception {
      Dto outDto = new BaseDto();
      try {
          CommonActionForm aForm = (CommonActionForm) form;
          Dto inDto = aForm.getParamAsDto(request);
          UserInfoVo userInfo = getSessionContainer(request).getUserInfo();
          inDto.put("grp_id", userInfo.getGrpId());
          outDto = messageService.updateMessageItem(inDto);
          String jsonString = JsonHelper.encodeObject2Json(outDto);
          response.getWriter().write(jsonString);
      } catch (Exception e) {
          outDto.put("success", new Boolean(false));
          outDto.put("msg", "厂商信息修改失败");
          String jsonString = JsonHelper.encodeObject2Json(outDto);
          response.getWriter().write(jsonString);
      }
      return mapping.findForward(null);
  }
 

}
