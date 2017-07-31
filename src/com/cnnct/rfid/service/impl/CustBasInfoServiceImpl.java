package com.cnnct.rfid.service.impl;

import java.util.ArrayList;
import java.util.List;

import com.cnnct.util.GlobalConstants;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.cnnct.common.ApplicationException;
import com.cnnct.rfid.service.CustBasInfoService;

/************************************************
 * 创建日期: 2013-04-26 13:38:00
 * 创建作者：唐芳海
 * 功能：客户信息管理
 * 最后修改时间：
 * 修改记录：
*************************************************/
public class CustBasInfoServiceImpl extends BaseServiceImpl implements CustBasInfoService {

    /***
     * 客户信息查询
     */
    public Dto queryBasCustListInfo(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        List list = g4Dao.queryForPage("queryBasCustListInfo", pDto);
        Integer totalCount = g4Dao.queryForPageCount("queryBasCustListInfo", pDto);
        outDto.put("jsonStrList", JsonHelper.encodeList2PageJson(list,totalCount, GlobalConstants.FORMAT_Date));
        return outDto;
    }

    public Dto loadCustBasListByCustId(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        Dto dto = (Dto)g4Dao.queryForObject("queryBasCustListInfo", pDto);
        outDto.put("jsonStrList", JsonHelper.encodeDto2FormLoadJson(dto, GlobalConstants.FORMAT_Date));
        return outDto;
    }

    /***
     * 客户信息新增
     */
    public Dto insertCustBasList(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {

            Dto qDto = new BaseDto();
            //验证客户名
            qDto.put("cust_name",pDto.getAsString("cust_name"));
            Integer count1 = (Integer)g4Dao.queryForObject("queryBasCustListCountByCustName",qDto);
            if(count1>0){
                outDto.put("msg", "存在重复的客户名'"+pDto.getAsString("cust_name")+"'!");
                outDto.put("success", false);
                return outDto;
            }
            //验证客户别名
            for(String s:pDto.getAsString("alias").split(",")){
                if(!"".equals(s)){
                    qDto.put("cust_name",s);
                    Integer count2 = (Integer)g4Dao.queryForObject("queryBasCustListCountByCustName",qDto);
                    if(count2>0){
                        outDto.put("msg", "存在重复的客户别名'"+s+"'!");
                        outDto.put("success", false);
                        return outDto;
                    }
                }
            }

            Integer cust_id = (Integer) g4Dao.queryForObject("getMaxCustid", pDto);
            cust_id = cust_id == null ? 10000001 : (cust_id + 1);
            pDto.put("cust_id", cust_id);
            pDto.put("state", "0");
            g4Dao.insert("insertCustBasList", pDto);
            outDto.put("msg", "客户信息新增成功");
            outDto.put("success", true);
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }
        return outDto;
    }

    /***
     * 客户信息删除
     */
    public Dto deleteCustBasList(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            //查询订单中是否已使用客户信息
            List list = g4Dao.queryForList("getOrdBasInfoByCustId",pDto);
            if(list.size()>0){
                outDto.put("msg", "订单中已用到当前的客户信息,不能注销!");
                outDto.put("success", false);
                return outDto;
            }

            g4Dao.delete("deleteCustBasList", pDto);
            outDto.put("msg", "客户信息删除成功");
            outDto.put("success", true);
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }
        return outDto;
    }

    /***
     * 客户信息修改
     */
    public Dto updateCustBasList(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            Dto qDto = new BaseDto();
            qDto.put("cust_id",pDto.getAsString("cust_id"));
            //验证客户名
            qDto.put("cust_name",pDto.getAsString("cust_name"));
            Integer count1 = (Integer)g4Dao.queryForObject("queryBasCustListCountByCustName",qDto);
            if(count1>0){
                outDto.put("msg", "存在重复的客户名'"+pDto.getAsString("cust_name")+"'!");
                outDto.put("success", false);
                return outDto;
            }
            //验证客户别名
            for(String s:pDto.getAsString("alias").split(",")){
                if(!"".equals(s)){
                    qDto.put("cust_name",s);
                    Integer count2 = (Integer)g4Dao.queryForObject("queryBasCustListCountByCustName",qDto);
                    if(count2>0){
                        outDto.put("msg", "存在重复的客户别名'"+s+"'!");
                        outDto.put("success", false);
                        return outDto;
                    }
                }
            }

            pDto.put("state","0");
            g4Dao.update("updateCustBasList", pDto);
            outDto.put("msg", "客户信息修改成功");
            outDto.put("success", true);
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }
        return outDto;
    }
    
    /***
     * 客户常用信息查询
     */
    public Dto queryCustBasInfo(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        List list = g4Dao.queryForPage("queryCustBasInfo", pDto);
        Integer totalCount = (Integer) g4Dao.queryForObject("queryCustBasInfoCount", pDto);
        outDto.put("jsonStrList", JsonHelper.encodeList2PageJson(list, totalCount, GlobalConstants.FORMAT_Date));
        return outDto;
    }

    /***
     * 客户常用信息新增
     */
    public Dto insertCustBasInfo(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
        	 Integer seq_no = (Integer) g4Dao.queryForObject("getCustBas4SeqNo", pDto);
        	 seq_no = seq_no == null ? 10000001 : (seq_no + 1);
             pDto.put("seq_no", seq_no);
            g4Dao.insert("insertCustBasInfo", pDto);
            outDto.put("msg", "客户常用信息新增成功");
            outDto.put("success", Boolean.valueOf(true));
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }
        return outDto;
    }

    /***
     * 客户常用信息删除
     */
    public Dto deleteCustBasInfo(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            g4Dao.delete("deleteCustBasInfo", pDto);
            outDto.put("msg", "客户信息删除成功");
            outDto.put("success", Boolean.valueOf(true));
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }
        return outDto;
    }

    /***
     * 客户常用信息修改
     */
    public Dto updateCustBasInfo(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            g4Dao.update("updateCustBasInfo", pDto);
            outDto.put("msg", "客户信息修改成功");
            outDto.put("success", Boolean.valueOf(true));
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }
        return outDto;
    }

    public Dto getCustBasInfoTree(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        String node = pDto.getAsString("node");
        List list;
        if(node.equals("001")){
            //查询地区信息
            list = g4Dao.queryForList("getCountryInCustBasInfo", pDto);
        }else{
            pDto.put("country",node.substring(4));
            pDto.put("isArea", "yes");
            //查询客户信息
            list = g4Dao.queryForList("getCustBasInfoTree", pDto);
        }

        for(Object obj:list){
            Dto dto = (Dto)obj;
            if(node.equals("001")){
                dto.put("leaf",false);
                dto.put("id",dto.getAsString("id"));
                dto.put("expanded",true);
                dto.put("iconCls","groupIcon");
            }else{
                dto.put("id","cust"+dto.getAsString("id"));
                dto.put("leaf",true);
            }
        }
        outDto.put("jsonStrList", JsonHelper.encodeObject2Json(list));
        return outDto;
    }

    public Dto getCustOrdInfoTree(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        String node = pDto.getAsString("node");
        List list = new ArrayList();
        pDto.put("isOnlyRFID", "yes");
        if(node.equals("001")){
            //查询地区信息
            list = g4Dao.queryForList("getCountryInCustBasInfo", pDto);
        }else if(node.contains("area")){
            pDto.put("country",node.substring(4));
            //如果country为null 增加null的判断
            pDto.put("isArea", "yes");
            //查询客户信息
            list = g4Dao.queryForList("getCustBasInfoTree", pDto);
        }else if(node.contains("cust")){
            pDto.put("cust_id",node.substring(4));
            //通过客户信息查询订单信息
            list = g4Dao.queryForList("getOrdBasInfoByCustId", pDto);
        }else if(node.contains("ord")){
            pDto.put("ord_seq_no",node.substring(3));//订单序号
            //通过客户信息查询订单信息
            list = g4Dao.queryForList("getProdOrdInfoByOrdSeqNO", pDto);
        }

        for(Object obj:list){
            Dto dto = (Dto)obj;
            if(node.equals("001")){
                dto.put("leaf",false);
                dto.put("expanded",true);
                dto.put("iconCls","groupIcon");
            }else if(node.contains("area")){
                dto.put("id","cust"+dto.getAsString("id"));
                dto.put("leaf",false);
            }else if(node.contains("cust")){
                dto.put("id","ord"+dto.getAsString("id"));
                dto.put("leaf",false);
            }else if(node.contains("ord")){
                dto.put("id","prod"+dto.getAsString("id"));
                dto.put("leaf",true);
            }

        }
        outDto.put("jsonStrList", JsonHelper.encodeObject2Json(list));
        return outDto;
    }

}
