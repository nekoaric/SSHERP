package com.cnnct.api.cs.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.rif.util.SessionListener;

import com.cnnct.api.cs.service.CSService;
import com.cnnct.common.ApplicationException;
import com.cnnct.sys.vo.UserInfoVo;
import com.cnnct.util.G4Utils;
/******************************************************************
 * 创建日期：
 * <br/>创建作者：
 * <br/>功能：
 * <br/>最后修改时间：2013-9-17
 * <br/>最后修改功能:修改绑定数量的变化由后台控制
 ******************************************************************/
@SuppressWarnings("unchecked")
public class CSServiceImpl extends BaseServiceImpl implements CSService {

    private static Log log = LogFactory.getLog(CSServiceImpl.class);
    private static final Lock lock = new ReentrantLock();
    public Dto getUserInfo(Dto pDto) {
        Dto outDto = new BaseDto();

        HttpServletRequest request = (HttpServletRequest) pDto.get("request");

        String account = pDto.getAsString("usr");
        String password = G4Utils.encryptBasedDes(pDto.getAsString("pwd"));
        String grp_id = "0519000001";//默认企业编码

        Dto qDto = new BaseDto();

        Integer flag;//0-epc登录 1-正常登录
        if (!"".equals(pDto.getAsString("epc"))) {
            flag = 0;
            qDto.put("epc", pDto.getAsString("epc"));
        } else {
            flag = 1;
            qDto.put("account", account);
            qDto.put("password", password);
            qDto.put("grp_id", grp_id);
        }

        UserInfoVo userInfo = (UserInfoVo) g4Dao.queryForObject("getLoginUserInfo", qDto);

        if (G4Utils.isEmpty(userInfo)) {
            outDto.put("success", false);
            if (flag == 0) {
                outDto.put("msg", "该EPC码没有对应的人员信息!");
            } else {
                outDto.put("msg", "帐号输入错误,请重新输入!");
            }

        } else {
            if (userInfo.getState() != null && userInfo.getState().equals("1")) {
                throw new ApplicationException("用户已停用，请联系管理员!");
                //todo 已注销的判断
            }

            HttpSession session = request.getSession();
            Dto paraDto = new BaseDto();
            paraDto.put("owner", userInfo.getUsername());
            paraDto.put("orgid", userInfo.getDeptName());
            paraDto.put("operserid", userInfo.getGrpName());

            outDto.put("success", true);
            outDto.put("sessionID", session.getId());
            outDto.put("object", paraDto);
            userInfo.setSessionID(session.getId());
            userInfo.setSessionCreatedTime(G4Utils.getCurrentTime());
            userInfo.setLoginIP(request.getRemoteAddr());
//                userInfo.setExplorer(G4Utils.getClientExplorerType(request));

            log.info(userInfo.getUsername() + "[" + userInfo.getAccount() + "]" + "，单位代码[" + grp_id
                    + "]成功登录系统!创建了一个有效Session连接,会话ID:[" + request.getSession().getId() + "]" + G4Utils.getCurrentTime());


            session.setAttribute("userInfo", userInfo);
            SessionListener.addSession(request.getSession(), userInfo); // 保存有效Session
        }

        return outDto;
    }

    public UserInfoVo getLoginUserInfo(Dto pDto) {

        String account = pDto.getAsString("usr");
        String password = G4Utils.encryptBasedDes(pDto.getAsString("pwd"));
        String grp_id = "0519000001";//默认企业编码

        Dto qDto = new BaseDto();

        Integer flag;//0-epc登录 1-正常登录
        if (!"".equals(pDto.getAsString("epc"))) {
            qDto.put("epc", pDto.getAsString("epc"));
        } else {
            qDto.put("account", account);
            qDto.put("password", password);
            qDto.put("grp_id", grp_id);
        }

        UserInfoVo userInfo = (UserInfoVo) g4Dao.queryForObject("getLoginUserInfo", qDto);

        return userInfo;
    }

    public Dto getOrdBasInfo(Dto pDto) {
        Dto outDto = new BaseDto();
        Dto paraDto = new BaseDto();

        String prod_ord_seq = pDto.getAsString("orderno");
        //pDto中有完单号
        //1.查询表头信息
        pDto.put("prod_ord_seq", prod_ord_seq);
        List aList = g4Dao.queryForList("queryProdBasInfo4Row", pDto);//行信息
        if (aList.size() == 0) {
            outDto.put("success", false);
            outDto.put("msg", "没有对应的生产通知单信息!");
            return outDto;
        }

        List productList = g4Dao.queryForList("queryProdBasInfo4InsNum", pDto);//该完单号下每个产品信息

        Dto qDto = new BaseDto();
        qDto.put("id", prod_ord_seq);
        qDto.put("state", "0");
        Dto columnDto = (Dto) g4Dao.queryForObject("queryProdSubInfo", pDto);//列头信息
        String[] columns = columnDto.getAsString("value").split(",");

        //列头信息组合
        List head = new ArrayList();
        Dto head1Dto = new BaseDto();
        head1Dto.put("seq_no", "1");
        head1Dto.put("headname", "国家");
        head.add(head1Dto);
        Dto head2Dto = new BaseDto();
        head2Dto.put("seq_no", "2");
        head2Dto.put("headname", "颜色");
        head.add(head2Dto);
        Dto head3Dto = new BaseDto();
        head3Dto.put("seq_no", "3");
        head3Dto.put("headname", "内长");
        head.add(head3Dto);
        for (int i = 0; i < columns.length; i++) {
            Dto dto = new BaseDto();
            dto.put("seq_no", "" + (i + 4));
            dto.put("headname", columns[i]);
            head.add(dto);
        }
        paraDto.put("head", head);

        List rowList = new ArrayList();

        for (Object aObj : aList) {//该完单号的行数
            Dto aDto = (Dto) aObj;

            String color = aDto.getAsString("color");
            String in_length = aDto.getAsString("in_length");
            String country = aDto.getAsString("country");

            Dto rowDto = new BaseDto();

            StringBuffer sb = new StringBuffer();
            sb.append(country).append("|");
            sb.append(color).append("|");
            sb.append(in_length).append("|");

            for (String waist : columns) {
                Boolean flag = false;
                for (int j = 0; j < productList.size(); j++) {
                    Dto bDto = (Dto) productList.get(j);
                    if (bDto.getAsString("color").equals(color)
                            && bDto.getAsString("in_length").equals(in_length)
                            && bDto.getAsString("country").equals(country)
                            && bDto.getAsString("waist").equals(waist)) {

                        sb.append(bDto.getAsString("ins_num")).append("|");

                        flag = true;
                        break;
                    }
                }

                if (!flag) {
                    sb.append("|");
                }

            }

            if (sb.length() > 0) {
                rowDto.put("listdata", sb.substring(0, sb.length() - 1));
            }
            rowList.add(rowDto);
        }

        paraDto.put("list", rowList);//生产通知单内容信息

        List list = new ArrayList();
        for (Object obj : productList) {
            Dto dto = (Dto) obj;
            Dto productDto = new BaseDto();
            productDto.put("color", dto.getAsString("color"));
            productDto.put("country", dto.getAsString("country"));
            productDto.put("in_length", dto.getAsString("in_length"));
            productDto.put("waist", dto.getAsString("waist"));
            productDto.put("finishnum", dto.getAsString("cut_num"));
            list.add(productDto);
        }
        paraDto.put("productlist", list);

        //查询订单信息
        Dto prodOrdDto = (Dto) g4Dao.queryForObject("queryProdOrdInfo4CSServelt", pDto);
        prodOrdDto.put("style", prodOrdDto.getAsString("style_no"));
        prodOrdDto.put("orderseqno", prodOrdDto.getAsString("ord_seq_no"));//订单号
        paraDto.put("oderinfo", prodOrdDto);

        //查询通知单中各个值的序号
//        List<Dto> codeList = new ArrayList<Dto>();
//
//        List prodBasInfoList = g4Dao.queryForList("getProdBasInfoSeqByProdOrdId", pDto);
//        for (Object obj : prodBasInfoList) {
//            Dto prodBasDto = (Dto) obj;
//
//            Dto styleDto = new BaseDto();
//            styleDto.put("type", "style");
//            styleDto.put("key", prodBasDto.getAsString("style_no"));
//            styleDto.put("value", prodBasDto.getAsString("style_no_seq_no"));
//            codeList.add(styleDto);
//
//            Dto countryDto = new BaseDto();
//            countryDto.put("type", "country");
//            countryDto.put("key", prodBasDto.getAsString("country"));
//            countryDto.put("value", prodBasDto.getAsString("country_seq_no"));
//            codeList.add(countryDto);
//
//            Dto colorDto = new BaseDto();
//            colorDto.put("type", "color");
//            colorDto.put("key", prodBasDto.getAsString("color"));
//            colorDto.put("value", prodBasDto.getAsString("color_seq_no"));
//            codeList.add(colorDto);
//
//            Dto clothSizeDto = new BaseDto();
//            clothSizeDto.put("type", "size");
//            clothSizeDto.put("key", prodBasDto.getAsString("in_length") + "," + prodBasDto.getAsString("waist"));
//            clothSizeDto.put("value", prodBasDto.getAsString("cloth_size_seq_no"));
//            codeList.add(clothSizeDto);
//
//            Dto printDto = new BaseDto();
//            printDto.put("type", "print");
//            printDto.put("key", prodBasDto.getAsString("print"));
//            printDto.put("value", prodBasDto.getAsString("print_seq_no"));
//            codeList.add(printDto);
//
//            Dto washDto = new BaseDto();
//            washDto.put("type", "wash");
//            washDto.put("key", prodBasDto.getAsString("wash"));
//            washDto.put("value", prodBasDto.getAsString("wash_seq_no"));
//            codeList.add(washDto);
//
//        }
//        paraDto.put("code", codeList);

        outDto.put("object", paraDto);
        outDto.put("success", true);

        return outDto;
    }

    public Dto getOrdBasNumInfo(Dto pDto) {
        Dto outDto = new BaseDto();
        Dto paraDto = new BaseDto();

        String prod_ord_seq = pDto.getAsString("orderno");
        //pDto中有完单号
        //1.查询表头信息
        pDto.put("prod_ord_seq", pDto.getAsString("orderno"));
        List aList = g4Dao.queryForList("queryProdBasInfo4Row", pDto);//颜色内长分组
        if (aList.size() == 0) {
            outDto.put("success", false);
            outDto.put("msg", "没有对应的生产通知单信息!");
            return outDto;
        }

        List productList = g4Dao.queryForList("queryProdBasInfo4InsNum", pDto);//该完单号下每个产品信息

        Dto qDto = new BaseDto();
        qDto.put("id", prod_ord_seq);
        qDto.put("state", "0");
        Dto columnDto = (Dto) g4Dao.queryForObject("queryProdSubInfo", pDto);//列头信息
        String[] columns = columnDto.getAsString("value").split(",");

        List rowList = new ArrayList();

        for (Object aObj : aList) {
            Dto aDto = (Dto) aObj;

            String color = aDto.getAsString("color");
            String in_length = aDto.getAsString("in_length");
            String country = aDto.getAsString("country");

            Dto rowDto = new BaseDto();

            StringBuffer sb = new StringBuffer();
            sb.append(country).append("|");
            sb.append(color).append("|");
            sb.append(in_length).append("|");

            for (String waist : columns) {
                Boolean flag = false;
                for (int j = 0; j < productList.size(); j++) {
                    Dto bDto = (Dto) productList.get(j);
                    if (bDto.getAsString("color").equals(color)
                            && bDto.getAsString("in_length").equals(in_length)
                            && bDto.getAsString("country").equals(country)
                            && bDto.getAsString("waist").equals(waist)) {

                        sb.append(bDto.getAsString("cut_num")).append("|");//实裁数

                        flag = true;
                        break;
                    }
                }

                if (!flag) {
                    sb.append("|");
                }

            }

            if (sb.length() > 0) {
                rowDto.put("listdata", sb.substring(0, sb.length() - 1));
            }
            rowList.add(rowDto);
        }

        paraDto.put("list", rowList);//生产通知单内容信息

        outDto.put("object", paraDto);
        outDto.put("success", true);

        return outDto;
    }

    public Dto getProdOrdInfo(Dto pDto) {
        Dto outDto = new BaseDto();
        List list = new ArrayList();
        if(!"".equals(pDto.getAsString("epccode"))){
            pDto.put("epc", pDto.getAsString("epccode"));
            pDto.put("state", "0");
            //查询扫描到的产品信息
            list = g4Dao.queryForList("queryProdOrdInfoByEpc4CSServlet", pDto);
        }else if(!"".equals(pDto.getAsString("orderno"))){
            pDto.put("prod_ord_seq",pDto.getAsString("orderno"));
            list =  g4Dao.queryForList("queryProdOrdInfo4CSServelt", pDto);
        }

        List prodOrdList = new ArrayList();
        for (Object obj : list) {
            Dto prodOrdDto = new BaseDto();
            Dto dto = (Dto) obj;
            prodOrdDto.put("color", dto.getAsString("color"));
            prodOrdDto.put("style", dto.getAsString("style_no"));
            prodOrdDto.put("prodordseq", dto.getAsString("prod_ord_seq"));
            prodOrdDto.put("ordseqno", dto.getAsString("ord_seq_no"));

            prodOrdList.add(prodOrdDto);
        }
        if (list.size() == 0) {
            Dto prodOrdDto = new BaseDto();
            prodOrdDto.put("color", "");
            prodOrdDto.put("style", "");
            prodOrdList.add(prodOrdDto);
        }

        outDto.put("object", prodOrdList);
        outDto.put("success", true);

        return outDto;
    }

    public Dto getProdBasInfo(Dto pDto) {
        Dto outDto = new BaseDto();

        List list = g4Dao.queryForList("queryOrdBasInfo4CSServelt", pDto);

        outDto.put("object", list);
        outDto.put("success", true);

        return outDto;
    }

    public Dto bindProdBasInfo(Dto pDto) {
        Dto outDto = new BaseDto();

        try {
            UserInfoVo userInfo = (UserInfoVo) pDto.get("userInfo");
            pDto.put("opr_id", userInfo.getAccount());

            //查询标签是否已绑定
            pDto.put("state", "0");
            pDto.put("epc", pDto.getAsString("epccode"));//读卡器读取到的epc
            Integer count = (Integer) g4Dao.queryForObject("queryProdAndEpcCount", pDto);
            if (count > 0) {//重复给出提示
                outDto.put("success", true);
                Dto dto = new BaseDto();
                dto.put("flag", "1");
                Dto object = new BaseDto();
                List lst = new ArrayList();
                lst.add(dto);
                object.put("lst",lst);
                outDto.put("object",object);
                return outDto;
            }

            String prod_ord_seq = pDto.getAsString("orderno");
            pDto.put("prod_ord_seq", prod_ord_seq);
            String style = pDto.getAsString("style");
            String size = pDto.getAsString("size");
            if (!size.contains(",")) {
                size = size + ",";
            }
            if (!size.endsWith("\"") && size.contains("\"")) {
                String[] arr = size.split("\"");
                String str = "";
                for (String s : arr) {
                    str = "'" + s + "'||'\"'||";
                }
                if (arr.length > 1) {
                    size = str.substring(0, str.length() - 8);
                }
            } else if (size.endsWith("\"")) {
                String[] arr = size.split("\"");
                size = "'" + arr[0] + "'||'\"'";
            } else {
                size = "'" + size + "'";
            }
            pDto.put("style_no", style);
            pDto.put("cloth_size", size);

            //查找产品信息
            Dto prodBasInfo = (Dto) g4Dao.queryForObject("getProdBasInfo4CSServelt", pDto);

            //查询实际数量
            String product_id = prodBasInfo.getAsString("product_id");
            pDto.put("product_id", product_id);//产品编号

            // EPC: 8位完单编号 1位国家 2位颜色 2位尺码 1位印花 1位洗水方式 5位序号 3位其他
//        pDto.put("epc",product_id+String.format("%05d",cut_num)+"000");

            //保存绑定记录
            g4Dao.insert("insertEpcProdListInfo", pDto);
            //更新成品表中绑定数量
//            Integer serno = pDto.getAsInteger("serno");// 流水号(当前已经绑定的数量)
            Integer serno = prodBasInfo.getAsInteger("cut_num");
            pDto.put("cut_num", serno+1);
            g4Dao.update("updateProdCutNum", pDto);
            //更新标签表中状态为绑定
//        g4Dao.update("updateEpcInfo", pDto);
            //插入标签流水表
            pDto.put("nature", "1");//数量流程为裁剪绑定
            pDto.put("flag", "0");//0-设备记录 1-导入
            pDto.put("opr_time", G4Utils.getCurrentTime());
            pDto.put("tr_date", G4Utils.getCurDate());
            pDto.put("grp_id", userInfo.getGrpId());
            pDto.put("trm_no", pDto.getAsString("trmno"));

            g4Dao.insert("insertEpcDayListInfo", pDto);

            outDto.put("success", true);
            Dto dto = new BaseDto();
            dto.put("flag", "0");
            Dto object = new BaseDto();
            List lst = new ArrayList();
            lst.add(dto);
            object.put("lst",lst);
            outDto.put("object",object);
            return outDto;
        } catch (Exception e) {
            e.printStackTrace();
            outDto.put("success", false);
            outDto.put("code", "1047");
            outDto.put("msg", "后台绑定失败!");
        }
        return outDto;
    }
    /**
     * 批量绑定产品信息
     */
    public Dto bindBatchProdBasInfo(Dto pDto) {
    	Dto outDto = new BaseDto();
    	try{
    		UserInfoVo userInfo = (UserInfoVo)pDto.get("userInfo");
    		Dto epcCode = (Dto)pDto.get("epcCodes");
    		StringBuffer epcSb = new StringBuffer(100);
    		String epcCodeStrs = epcCode.getAsString("EPC");
    		String[] epcCodeStr = epcCodeStrs.split(",");
    		int epcCodeStrLength = epcCodeStr.length;
    		List<String> epcCodeList = new ArrayList<String>();
    		//过滤epcCodeStr为空的数据
    		for(int k=0;k<epcCodeStrLength;k++){
    			if(!"".equals(epcCodeStr[k])){
    				epcCodeList.add(epcCodeStr[k]);
    			}
    		}
    		if(epcCodeList.size()==0){
    			throw new ApplicationException("没有epc导入");
    		}
    		epcCodeList.toArray(epcCodeStr);
    		epcCodeStrLength = epcCodeStr.length;
    		for(int i=0;i<epcCodeStrLength;i++){
    			epcSb.append("'").append(epcCodeStr[i]).append("',");
    		}
    		if(epcCodeStrLength>0){
    			epcSb.deleteCharAt(epcSb.length()-1);
    		}
    		pDto.put("state", "0");
    		pDto.put("epcCodes",epcSb.toString());
            Integer count = (Integer) g4Dao.queryForObject("queryBachProdAndEpcCount", pDto);
            if (count > 0) {//重复给出提示
                outDto.put("success", false);
                Dto dto = new BaseDto();
                dto.put("flag", "1");
                Dto object = new BaseDto();
                List lst = new ArrayList();
                lst.add(dto);
                object.put("lst",lst);
                outDto.put("object",object);
                return outDto;
            }
            String prod_ord_seq = pDto.getAsString("orderno");
            pDto.put("prod_ord_seq", prod_ord_seq);
            String style = pDto.getAsString("style");
            String size = pDto.getAsString("size");
            if (!size.contains(",")) {
                size = size + ",";
            }
            if (!size.endsWith("\"") && size.contains("\"")) {
                String[] arr = size.split("\"");
                String str = "";
                for (String s : arr) {
                    str = "'" + s + "'||'\"'||";
                }
                if (arr.length > 1) {
                    size = str.substring(0, str.length() - 8);
                }
            } else if (size.endsWith("\"")) {
                String[] arr = size.split("\"");
                size = "'" + arr[0] + "'||'\"'";
            } else {
                size = "'" + size + "'";
            }
            pDto.put("style_no", style);
            pDto.put("cloth_size", size);

            //查找产品信息
            Dto prodBasInfo = (Dto) g4Dao.queryForObject("getProdBasInfo4CSServelt", pDto);
            //查询实际数量
            String product_id = prodBasInfo.getAsString("product_id");
            pDto.put("product_id", product_id);//产品编号
            
          //保存绑定记录
            for(int i=0;i<epcCodeStrLength;i++){
            	pDto.put("epc", epcCodeStr[i]);
            	g4Dao.insert("insertEpcProdListInfo", pDto);	
            }
            
            Integer serno = prodBasInfo.getAsInteger("cut_num");
            pDto.put("cut_num", serno+epcCodeStrLength);
            g4Dao.update("updateProdCutNum", pDto);

            //插入标签流水表
            pDto.put("nature", "1");//数量流程为裁剪绑定
            pDto.put("flag", "0");//0-设备记录 1-导入
            pDto.put("opr_time", G4Utils.getCurrentTime());
            pDto.put("tr_date", G4Utils.getCurDate());
            pDto.put("grp_id", userInfo.getGrpId());
            pDto.put("trm_no", pDto.getAsString("trmno"));
            
            for(int i=0;i<epcCodeStrLength;i++){
            	pDto.put("epc",epcCodeStr[i]);
            	g4Dao.insert("insertEpcDayListInfo", pDto);	
            }
			outDto.put("success", true);
			Dto dto = new BaseDto();
			dto.put("flag", "0");
			Dto object = new BaseDto();
			List lst = new ArrayList();
			lst.add(dto);
			object.put("lst",lst);
			outDto.put("object",object);
			return outDto;
    	}catch(Exception e){
    		e.printStackTrace();
    		outDto.put("success", false);
    		outDto.put("code", "1048");
    		outDto.put("msg", "后台绑定失败");
    	}
		return outDto;
	}

	/**
	 * 查询产品信息<br/>
	 *  依据epc信息
	 */
	public Dto queryProd4Epc(Dto pDto) {
		Dto outDto = new BaseDto();
		try{
			pDto = doEpc2Str(pDto);
			Dto paramDto = new BaseDto();
			paramDto.put("epc", pDto.getAsString("epc"));
			paramDto.put("state", "0");
			List<Dto> prods = g4Dao.queryForList("queryProdBasInfo4BatchEpc", paramDto);
			Dto object = new BaseDto();
			List<Dto> lst = new ArrayList<Dto>();
			for(Dto d :  prods){
				Dto epcInfo = new BaseDto();
				epcInfo.put("epc", d.getAsString("epc"));
				epcInfo.put("prod_no", d.getAsString("prod_ord_seq"));
				epcInfo.put("order_no", d.getAsString("ord_seq_no"));
				epcInfo.put("count", d.getAsString("count"));
				epcInfo.put("color", d.getAsString("color"));
				epcInfo.put("in_length", d.getAsString("in_length"));
				epcInfo.put("waist", d.getAsString("waist"));
				epcInfo.put("nature",d.getAsString("nature"));
				epcInfo.put("style_no", d.getAsString("style_no"));
				lst.add(d);
			}
			object.put("lst", lst);
			outDto.put("object", object);
			outDto.put("success", true);
		}catch(Exception e) {
			e.printStackTrace();
			outDto.put("success", false);
			outDto.put("code","1052");
			outDto.put("msg","查询出错");
		}finally{
			
		}
		return outDto;
	}

	/**
	 *  批量解绑
	 */
	public Dto removeBind4Batch(Dto pDto) {
		Dto outDto = new BaseDto();
		try{
			boolean getLock = lock.tryLock(30, TimeUnit.SECONDS);
			if(!getLock){
				throw new ApplicationException("等待锁时间超过30秒,已停止等待!");
			}
			Dto epcCodes = (Dto)pDto.get("epcCodes");
			String natures = pDto.getAsString("nature");
			pDto = doEpc2Str(pDto);
			if("".equals(pDto.get("epc"))){
				throw new ApplicationException(1153,"没有epc信息!");
			}
			//默认状态为全部 ：制定解绑的流程-1：全部，1 2 3 4 5 6 13：指定特殊的流程
			if("".equals(natures) || natures.indexOf("-1")!=-1){
				pDto.remove("nature");
			}else {
				pDto.put("nature", natures);
			}
			
			pDto.put("state", 0);
			List<Dto> prods = g4Dao.queryForList("queryProdBasInfo4BatchEpc", pDto);
			if(prods.size()<=0){
				throw new ApplicationException(1154,"没有对应的epc");
			}
			for(Dto dto : prods){
				dto.put("nature", 9);
				dto.put("state", 1);
			}
			// 解绑的操作
			g4Dao.batchUpdateBaseDto("updateRemoveEpcProdListInfo",prods);
			//返回信息的封装
			outDto.put("success", true);
			Dto dto = new BaseDto();
			dto.put("flag", "0");
			List lst = new ArrayList();
			Dto object = new BaseDto();
			lst.add(dto);
			object.put("lst",lst);
			outDto.put("object",object);
			outDto.put("msg","解绑成功");
			outDto.put("success", true);
		}catch(Exception e) {
			e.printStackTrace();
			outDto.put("success", false);
			outDto.put("code","1051");
			outDto.put("msg","批量解绑失败");
		}finally{
			lock.unlock();
		}
		return outDto;
	}

	/**
	 * 解绑(和批量解绑相同的操作，以后可以在实际应用中修改功能)
	 */
	public Dto removeBindProdBasInfo(Dto pDto) {
		Dto outDto = new BaseDto();
		try{
			boolean getLock = lock.tryLock(30, TimeUnit.SECONDS);
			if(!getLock){
				throw new ApplicationException("等待锁时间超过30秒,已停止等待!");
			}
			Dto epcCodes = (Dto)pDto.get("epcCodes");
			String natures = pDto.getAsString("nature");
			pDto = doEpc2Str(pDto);
			if("".equals(pDto.get("epc"))){
				throw new ApplicationException(1153,"没有epc信息!");
			}
			if("".equals(natures) || natures.indexOf("-1")!=-1){
				pDto.remove("nature");
			}else {
				pDto.put("nature", natures);
			}
			
			pDto.put("state", 0);
			List<Dto> prods = g4Dao.queryForList("queryProdBasInfo4BatchEpc", pDto);
			if(prods.size()<=0){
				throw new ApplicationException(1154,"没有对应的epc");
			}
			for(Dto dto : prods){
				dto.put("nature", 9);
				dto.put("state", 1);
			}
			// 解绑的操作
			g4Dao.batchUpdateBaseDto("updateRemoveEpcProdListInfo",prods);
			
			outDto.put("success", true);
			Dto dto = new BaseDto();
			dto.put("flag", "0");
			List lst = new ArrayList();
			Dto object = new BaseDto();
			lst.add(dto);
			object.put("lst",lst);
			outDto.put("object",object);
			outDto.put("msg","解绑成功");
		}catch(Exception e) {
			e.printStackTrace();
			outDto.put("success", false);
			outDto.put("code","1050");
			outDto.put("msg","解绑失败");
		}finally{
			lock.unlock();
		}
		return outDto;
	}
    /**
     * 将epc转化为'x','x'格式
     * @param pDto
     * @return
     */
	public Dto doEpc2Str(Dto pDto){
		Dto dto = (Dto)pDto.get("epcCodes");
		String str = dto.getAsString("EPC");
		if("".equals(str)){
			pDto.put("epc", "");
		}else {
			String[] epcs = str.split(",");
			StringBuffer sb = new StringBuffer(100);
			for(int k=0;k<epcs.length;k++){
				sb.append("'").append(epcs[k]).append("',");
			}
			sb.deleteCharAt(sb.length()-1);
			pDto.put("epc", sb.toString());
		}
		return pDto;
	}

    /**
     * epc回退操作
     */
    public Dto rollBack4Prodord(Dto pDto) {
        
        return null;
    }
    
}
