package com.cnnct.loginMode2.web;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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

import com.cnnct.loginMode2.service.depotCheckService;
import com.cnnct.sys.vo.UserInfoVo;
import com.cnnct.util.G4Utils;
import com.cnnct.util.NatureUtil;

/**
 * 库存盘点
 * @author xutj
 * @since 2014-12-25
 */
public class depotCheckAction extends BaseAction{
    
	private depotCheckService depotCheckService=(depotCheckService)super.getService("depotCheckService");
    
    /**
     * 初始化
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward init(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        // 获取操作数量性质的标识，只用于出运成品，获取其他的数量性质
        UserInfoVo user = super.getSessionContainer(request).getUserInfo();
        String account  = user.getAccount();
        String name = user.getUsername();
        request.setAttribute("account", account);
        request.setAttribute("name", name);
        return mapping.findForward("success");
    }
     
    /**
     * 查询所有款号(支持联想模式)
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward queryAllStyleNo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Dto outDto = null;
    	CommonActionForm cForm = (CommonActionForm)form;
        Dto inDto = cForm.getParamAsDto(request);
        List<Dto> resultList = new ArrayList<Dto>();
        //条件 模糊的款号
        resultList= g4Reader.queryForList("queryAllStyleNo", inDto);
        String resultStr = JsonHelper.encodeObject2Json(resultList);
        super.write(resultStr, response);
        return mapping.findForward(null);
    }
    
    /**
     * 查询记录信息
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward queryInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Dto outDto = null;
    	CommonActionForm cForm = (CommonActionForm)form;
        Dto inDto = cForm.getParamAsDto(request);
        List<Dto> resultList = new ArrayList<Dto>();
        resultList= g4Reader.queryForList("queryInfo", inDto);
        String resultStr = JsonHelper.encodeObject2Json(resultList.get(0));
        super.write(resultStr, response);
        return mapping.findForward(null);
    }
    
    /**
     * 查询所有品牌
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward queryAllBrand(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
    	Dto outDto = null;
    	CommonActionForm cForm = (CommonActionForm)form;
        Dto inDto = cForm.getParamAsDto(request);
        List<Dto> resultList = new ArrayList<Dto>();
        //条件 模糊的款号
        resultList= g4Reader.queryForList("queryAllBrand", inDto);
        String resultStr = JsonHelper.encodeObject2Json(resultList);
        super.write(resultStr, response);
        return mapping.findForward(null);
    }
    
    /**
     * 查询累计数
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward queryCountNum(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
            CommonActionForm cForm = (CommonActionForm)form;
            Dto inDto = cForm.getParamAsDto(request);
            Dto numDto = (Dto) g4Reader.queryForObject("queryNumBySeq", inDto);
        String resultStr = JsonHelper.encodeObject2Json(numDto);
        super.write(resultStr, response);
        return mapping.findForward(null);
    }
    
    /**
     * 保存数量信息
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    @SuppressWarnings("unchecked")
    public ActionForward saveCheckNum(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
    	UserInfoVo user = super.getSessionContainer(request).getUserInfo();
        String account  = user.getAccount();
        Dto outDto = new BaseDto();
        String name = user.getUsername();
    	CommonActionForm cForm = (CommonActionForm)form;
        Dto inDto = cForm.getParamAsDto(request);
        try {
			//在下拉框的值为空时，以文本框为准
			if (G4Utils.isEmpty(inDto.getAsString("style_no"))) {
				inDto.put("style_no", inDto.getAsString("style_no_input"));
			}
			if (G4Utils.isEmpty(inDto.getAsString("brand"))) {
				inDto.put("brand", inDto.getAsString("brand_input"));
			}
			
			inDto.put("account", account);
			inDto.put("opr_name", name);
			depotCheckService.insertDepotSche(inDto);
            outDto.put("success", true);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			outDto.put("success", false);
		}
        super.write(JsonHelper.encodeObject2Json(outDto), response);
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
