package org.eredlab.g4.arm.web;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.cnnct.sys.service.SysGrpsService;
import com.cnnct.util.ArmConstants;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.arm.service.MonitorService;
import com.cnnct.sys.vo.UserInfoVo;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

/**
 * 事件跟踪Action
 * 
 * @author XiongChun
 * @since 2010-09-12
 * @see BaseAction
 */
public class EventTrackAction extends BaseAction {
	
	private MonitorService monitorService = (MonitorService)super.getService("monitorService");
	private SysGrpsService sysGrpsService = (SysGrpsService) super.getService("sysGrpsService");
	/**
	 * 事件跟踪页面初始化
	 * 
	 * @param
	 * @return
	 */
	public ActionForward init(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
	    Dto inDto = new BaseDto();
	    super.removeSessionAttribute(request, "areaid");
	          String grpid = super.getSessionContainer(request).getUserInfo().getGrpId();
	          String usertype = super.getSessionContainer(request).getUserInfo().getUsertype();

              inDto.put("areaid", grpid.substring(0, 4));

//	          Dto outDto = sysGrpsService.queryAreainfoByAreaid(inDto);
//	          request.setAttribute("rootAreaid", outDto.getAsString("areaid"));
//	          request.setAttribute("rootAreaname", outDto.getAsString("areaname"));
		      return mapping.findForward("eventTrackView");
	}
	
	/**
	 * 查询事件列表
	 * 
	 * @param
	 * @return
	 */
    public ActionForward queryEvents(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                     HttpServletResponse response) throws Exception {
        CommonActionForm aForm = (CommonActionForm) form;
        UserInfoVo userInfo = getSessionContainer(request).getUserInfo();
        Dto dto = aForm.getParamAsDto(request);
        if (userInfo.getUsertype().equals(ArmConstants.ACCOUNTTYPE_ADMIN)) {
            dto.put("grp_id_pattern", userInfo.getGrpId().substring(0, 4));
            dto.put("grp_id", userInfo.getGrpId());
            dto.put("usertype", "'3','4'");
        }
        Dto outDto = monitorService.queryEventsByDto(dto);
        super.write(outDto.getDefaultJson(), response);
        return mapping.findForward(null);
    }

    /**
	 * 删除事件
	 * 
	 * @param
	 * @return
	 */
	public ActionForward deleteEvents(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm aForm = (CommonActionForm)form;
		Dto dto = aForm.getParamAsDto(request);
		Dto outDto = monitorService.deleteEvent(dto);
		super.write(outDto.toJson(), response);
		return mapping.findForward(null);
	}

    public void setSysGrpsService(SysGrpsService sysGrpsService) {
        this.sysGrpsService = sysGrpsService;
    }
	
}
