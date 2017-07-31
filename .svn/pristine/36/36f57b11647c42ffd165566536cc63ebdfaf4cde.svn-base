package com.cnnct.loginMode2.web;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.upload.FormFile;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.web.BaseAction;
import org.eredlab.g4.rif.web.CommonActionForm;

import com.cnnct.common.ApplicationException;
import com.cnnct.rfid.service.OrdDayListService;
import com.cnnct.sys.vo.UserInfoVo;
import com.cnnct.util.G4Utils;
import com.cnnct.util.NatureUtil;

/**
 * loginMode2的数量操作
 * @author zhouww
 * @since 2014-12-25
 */
public class OrdNumAction extends BaseAction{
    
    OrdDayListService ordDayListService = (OrdDayListService) super.getService("ordDayListService");
    
    /**
     * 数量操作界面初始化
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
        String ordNumFlag = (String) super.getSessionAttribute(request, "ordNumFlag");
        UserInfoVo user = super.getSessionContainer(request).getUserInfo();
        String account  = user.getAccount();
        String name = user.getUsername();
        request.setAttribute("account", account);
        request.setAttribute("name", name);
        request.setAttribute("ordNumFlag", ordNumFlag);
        // 出运成品
        if("ordNumProduct".equals(ordNumFlag)){
            return mapping.findForward("productView");
        }else { // 默认一般的数量性质操作
            return mapping.findForward("success");
        }
    }
     
    /**
     * 查询数量性质
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    public ActionForward queryNatures(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Dto outDto = null;
        try{
            List<Dto> resultList = new ArrayList<Dto>();
            // 获取数量流程
            Map<String,String> nc2nEn = NatureUtil.getNatureCode2natureEn();
            List<String> ncList = NatureUtil.getNatureCode();
            // 获取中文名
            // 添加优先顺序
            for(Entry<String,String> entry : nc2nEn.entrySet()){
                Dto beanDto = new BaseDto();
                String nc = entry.getKey();
                String nEn = entry.getValue();
                String nZh = NatureUtil.parseNC2natureZh(nc);
                int orderNum = ncList.indexOf(nc);   // 位置顺序
                beanDto.put("natureCode", nc);
                beanDto.put("natureEn", nEn);
                beanDto.put("natureZh", nZh);
                beanDto.put("ordNum", orderNum);
                resultList.add(beanDto);
            }
            outDto = new BaseDto();
            outDto.put("success", true);
            outDto.put("natures", resultList);
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
        Dto outDto = null;
        try{
            CommonActionForm cForm = (CommonActionForm)form;
            Dto inDto = cForm.getParamAsDto(request);
            String ord_seq_no = inDto.getAsString("ord_seq_no");
            inDto.put("order_id", parseQueryParam(ord_seq_no));
            List<Dto> resultList = g4Reader.queryForList("queryCountNum4mobile", inDto);
            // 处理添加流程信息
            for(Dto dto : resultList){
                String nature = dto.getAsString("nature");
                String natureEn = NatureUtil.parseNC2natureEn(nature);
                dto.put("natureEn", natureEn);
            }
            outDto = new BaseDto();
            outDto.put("success", true);
            outDto.put("countNums", resultList);
        }catch(Exception e){
            e.printStackTrace();
            outDto = new BaseDto();
            outDto.put("success", false);
            outDto.put("msg", "操作失败");
        }
        String resultStr = JsonHelper.encodeObject2Json(outDto);
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
    public ActionForward saveOrdNum(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Dto outDto = null;
        try{
            UserInfoVo userInfo = super.getSessionContainer(request).getUserInfo();
            String account = userInfo.getAccount();
            String user_name = userInfo.getUsername();
            String opr_time = G4Utils.getCurrentTime();
            CommonActionForm cForm = (CommonActionForm)form;
			//保存数量
            Dto inDto = cForm.getParamAsDto(request);
            String[] baseColumn = new String[]{"grp_id","order_id","mark","style_no","tr_date","remark"};
            // 将行转列数据为所有的数量性质
            List ordDayList = new ArrayList();
            List<String> natureNum = NatureUtil.getNatureCode();
            
            // 遍历数量性质
            for(String beanStr : natureNum){
                String nature = NatureUtil.parseNC2natureEn(beanStr);
                String value = inDto.getAsString(nature);
                if("".equals(value.trim())){    //如果此数量性质没有数量则跳出此次处理
                    continue;   
                }
                Dto beanDto = new BaseDto();
                
                //  为每个dto添加常规列
                for(String baseStr : baseColumn){
                    beanDto.put(baseStr, inDto.get(baseStr));
                }
                
                // 添加操作人的作为移交人的信息
                beanDto.put("submit_name", user_name);
                beanDto.put("submit_id", account);
                beanDto.put("nature",beanStr);
                beanDto.put("amount", value);
                beanDto.put("opr_id", account);
                beanDto.put("opr_time", opr_time);
                beanDto.put("state", "0");
                //添加详细数量
                //B品的详细数量性质
                if(nature.equals("sendout_b_product")||nature.equals("receive_b_depot")||nature.equals("sendout_b_depot")){
                	beanDto.put("a_class",inDto.get(nature+"_input_a"));
                	beanDto.put("b_class",inDto.get(nature+"_input_b"));
                	beanDto.put("c_class",inDto.get(nature+"_input_c"));
                	beanDto.put("detail_flag", "1");
                }
                ordDayList.add(beanDto);
            }
            
            Dto dbDto = new BaseDto();
            dbDto.setDefaultAList(ordDayList);
            ordDayListService.importOrdScheList(dbDto);
            outDto = new BaseDto();
            outDto.put("success", true);
        }catch(Exception e){
            e.printStackTrace();
            outDto = new BaseDto();
            outDto.put("success", false);
            outDto.put("msg", "操作失败");
        }
        String resultStr = JsonHelper.encodeObject2Json(outDto);
        super.write(resultStr, response);
        
        return mapping.findForward(null);
    }
    //保存图片
    @SuppressWarnings("unchecked")
    public ActionForward saveStyleImgInfo(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
    	try {
			CommonActionForm cForm = (CommonActionForm)form;
			Dto inDto = cForm.getParamAsDto(request);
			String style_no=inDto.getAsString("style_no");
			//保存图片
			FormFile myFile = cForm.getTheFile();
			String file_name = myFile.getFileName();
      //保存路径
			String contextpath = getServlet().getServletContext().getRealPath(
					"/");
			if (!contextpath.endsWith(File.separator)) {
				contextpath = contextpath + File.separator;
			}
			String savePath = contextpath + "resource" + File.separator + "img"
					+ File.separator;
			//保存
			File file = new File(savePath);
			if (!file.exists() && !file.isDirectory()) {
				file.mkdir();
			}
			String file_extensions = file_name.substring(
					file_name.lastIndexOf(".")).toLowerCase();// 文件后缀名
			// 创建一个和文件相对应的唯一的字符串
			String fileName2UUID = UUID.randomUUID().toString();
			// 写文件

			File fileToCreate = new File(savePath, fileName2UUID);
			FileOutputStream os = new FileOutputStream(fileToCreate);
			// 检查同名文件是否存在,不存在则将文件流写入文件磁盘系统
			if (!fileToCreate.exists()) {
				os.write(myFile.getFileData());
				os.flush();
				os.close();
			} else {
				// 此路径下已存在同名文件,是否要覆盖或给客户端提示信息由你自己决定
				os.write(myFile.getFileData());
				os.flush();
				os.close();
			}
			Dto fileDto=new BaseDto();
			fileDto.put("savePath", savePath);
			fileDto.put("file_name", file_name);
			fileDto.put("aliasName", fileName2UUID);
			fileDto.put("style_no", style_no);
			ordDayListService.insertStyleImgFile(fileDto);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return mapping.findForward(null);
	}

/**
    * 保存出运成品信息
    * @param mapping
    * @param form
    * @param request
    * @param response
    * @return
    * @throws Exception
    */
    public ActionForward saveProductNum(ActionMapping mapping, ActionForm form, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Dto outDto = new BaseDto();
        try {
            UserInfoVo userInfo = super.getSessionContainer(request).getUserInfo();
            String account = userInfo.getAccount();
            String user_name = userInfo.getUsername();
            String opr_time = G4Utils.getCurrentTime();
            
            CommonActionForm cForm = (CommonActionForm)form;
            Dto inDto = cForm.getParamAsDto(request);
            String numInfo = inDto.getAsString("numInfo");
            String natureFlag = inDto.getAsString("natureFlag");    // 操作的数量性质
            
            // 为没有数量性质的情况下抛出一个异常    
            if (G4Utils.isEmpty(natureFlag)) {
                throw new ApplicationException("没有设置数量性质");
            }
            Dto beanDto = JsonHelper.parseSingleJson2Dto(numInfo);
            String baseInfo = beanDto.getAsString("baseInfo");
            String nums = beanDto.getAsString("nums");
            
            List<Dto> numsList = JsonHelper.parseJson2List(nums);
            Dto baseDto = JsonHelper.parseSingleJson2Dto(baseInfo);
            
            List<Dto> resultList = new ArrayList<Dto>();
            for(Dto dto : numsList){
                
                Dto bd = new BaseDto();
                bd.putAll(dto);
                bd.putAll(baseDto);
                
                bd.put("submit_name", user_name);
                bd.put("submit_id", account);
                bd.put("nature",natureFlag);    // 使用前端传入的参数使用
                bd.put("opr_id", account);
                bd.put("opr_time", opr_time);
                bd.put("state", "0");
                resultList.add(bd);
            }
            
            // 只有操作的数量是出运成品是时判断  数量
            List<String> unValideOrder = new ArrayList<String>();
            if("14".equals(natureFlag)){
                // 这个是 未符合规定的订单号信息
               // unValideOrder = valideOrderSendoutFProduct(resultList);
                
                // 过滤不符合规定的订单操作数量信息
                List<Dto> removeList = new ArrayList<Dto>();
                for(Dto dto : resultList){
                    String curOrder  = dto.getAsString("order_id");
                    if(unValideOrder.indexOf(curOrder) >=0){
                        removeList.add(dto);
                    }
                }
                
                resultList.removeAll(removeList);
            }
            
            Dto dbDto = new BaseDto();
            dbDto.setDefaultAList(resultList);
    
            ordDayListService.importOrdScheList(dbDto);
            String unValideInfo = JsonHelper.encodeObject2Json(unValideOrder);
            outDto = new BaseDto();
            outDto.put("success", true);
            outDto.put("unValideInfo", unValideInfo);
        }catch(Exception e){
            e.printStackTrace();
            outDto = new BaseDto();
            outDto.put("success", false);
            outDto.put("msg", "操作失败");
            
        }
        String resultStr = JsonHelper.encodeObject2Json(outDto);
        super.write(resultStr, response);
        
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
    
    /**
     * 出运成品数量判断
     * @param list 所有出运成品数量的数据集合
     * @return
     */
    private List<String> valideOrderSendoutFProduct(List<Dto> list) {
        
        // 只对出运成品进行比较
        // 验证数量和订单数比较，比较系数为1.2
        double coefNum = 1.2;
        // 对正确结果的数据进行处理
        List<Dto> sendoutFProductList = new ArrayList<Dto>();
        // 统计所有的订单号
        List<String> disctinctOrderid = new ArrayList<String>();
        
        // 便利数据 获取唯一的订单号
        for (Dto dto : list) {
            String orderid = dto.getAsString("order_id");
            if (disctinctOrderid.indexOf(orderid) < 0) {
                disctinctOrderid.add(orderid);
                continue;
            }
        }
        // 遍历所有的订单号  统计所有的数量
        for (String str : disctinctOrderid) {
            int pNum = 0;
            for (Dto dto : list) {
                if (str.equals(dto.getAsString("order_id"))) {
                    pNum += dto.getAsInteger("amount");
                }
            }
            Dto beanDto = new BaseDto();
            beanDto.put("order_id", str);
            beanDto.put("amount", pNum);
            sendoutFProductList.add(beanDto);
        }
        
        // 未符合规定的数量信息
        List<String> unValideList = new ArrayList<String>();
        
        // 便利统计的数据 并且查询订单信息，并且进行判断
        for (Dto dto : sendoutFProductList) {
            Object obj = g4Reader.queryForObject("getOrdScheListByOrdSeq", dto);
            if (obj == null) {
                continue;
            }
            Dto qDto = (Dto) obj;
            Integer historyNum = qDto.getAsInteger("sendout_f_product");
            Integer ord_num = qDto.getAsInteger("order_num");
            Integer cur_num = dto.getAsInteger("amount");
            // 如果总数大于订单数量的系数范围 则添加不处理订单号
            if ((historyNum + cur_num) > ord_num * coefNum) {
                unValideList.add(dto.getAsString("order_id"));
            }
        }
        return unValideList;

    }
}
