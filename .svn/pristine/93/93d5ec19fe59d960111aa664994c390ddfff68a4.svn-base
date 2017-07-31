package org.eredlab.g4.arm.web;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.eredlab.g4.arm.service.PartService;
import com.cnnct.util.ArmConstants;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

/**
 * UI组件托管
 * 
 * @author XiongChun
 * @since 2011-06-03
 * @see org.eredlab.g4.rif.web.BaseAction
 */
public class PartAction extends BaseAction {
	
	private PartService service = (PartService)getService("partService");

	/**
	 * 页面初始化
	 * 
	 * @param
	 * @return
	 */
	public ActionForward init(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		Dto dto = (Dto)g4Reader.queryForObject("queryEamenuByMenuID", "01");
		request.setAttribute("rootMenuName", dto.getAsString("menuname"));
		return mapping.findForward("initView");
	}
	
	/**
	 * 查询菜单项目 生成菜单树
	 * 
	 * @param
	 * @return
	 */
	public ActionForward queryMenuItems(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		Dto dto = new BaseDto();
		String nodeid = request.getParameter("node");
		List menuList = new ArrayList();

        //root+menuid  根菜单
        //menu+menuid  叶子菜单
        //part+menuid  页面组件
        if(nodeid.startsWith("root")){
            dto.put("parentid", nodeid.substring(4));
            menuList = g4Reader.queryForList("queryMenuItemsByDto", dto);
        }else if(nodeid.startsWith("menu")){
            dto.put("menuid", nodeid.substring(4));
            menuList = g4Reader.queryForList("queryPartByDto", dto);
        }

		Dto menuDto = new BaseDto();
		for (int i = 0; i < menuList.size(); i++) {
			menuDto = (BaseDto) menuList.get(i);

			if (menuDto.getAsString("id").length() == 4){
				menuDto.put("expanded", new Boolean(true));
            }

            if(nodeid.startsWith("root")&&menuDto.getAsString("leaf").equals(ArmConstants.LEAF_Y)){
                menuDto.put("id","menu"+ menuDto.getAsString("id"));
                menuDto.put("leaf", new Boolean(false));
            }else if(nodeid.startsWith("root")&&menuDto.getAsString("leaf").equals(ArmConstants.LEAF_N)){
                menuDto.put("id","root"+ menuDto.getAsString("id"));
                menuDto.put("leaf", new Boolean(false));
            }else if(nodeid.startsWith("menu")){
                menuDto.put("id","part"+ menuDto.getAsString("id"));
                menuDto.put("text",menuDto.getAsString("remark"));
                menuDto.put("checked", false);
                menuDto.put("leaf", new Boolean(true));
            }
		}

		write(JsonHelper.encodeObject2Json(menuList), response);
		return mapping.findForward(null);
	}
	
	/**
	 * 查询UI组件列表
	 * 
	 * @param
	 * @return
	 */
	public ActionForward queryParts(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		CommonActionForm cForm = (CommonActionForm)form;
		Dto dto = cForm.getParamAsDto(request);
		List list = g4Reader.queryForPage("Part.queryParts", dto);
		Integer countInteger = (Integer) g4Reader.queryForObject("Part.queryPartsForPageCount", dto);
		String jsonString = JsonHelper.encodeList2PageJson(list, countInteger, null);
		write(jsonString, response);
		return mapping.findForward(null);
	}

}
