package com.cnnct.rfid.service.impl;

import com.cnnct.common.ApplicationException;
import com.cnnct.rfid.service.OrdDayListService;
import com.cnnct.util.G4Utils;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import java.util.List;

/**
 * *********************************************
 * 创建日期: 2013-07-25
 * 创建作者：may
 * 功能：订单记录流水服务类
 * 最后修改时间：
 * 修改记录：
 * ***********************************************
 */
public class OrdDayListServiceImpl extends BaseServiceImpl implements OrdDayListService {

    /**
     * 查询订单记录流水信息
     *
     * @param pDto
     * @return
     */
    public Dto queryOrdDayList(Dto iDto) {
        Dto outDto = new BaseDto();
        List list = g4Dao.queryForPage("queryOrdDayList", iDto);
        Integer totalCount = g4Dao.queryForPageCount("queryOrdDayList", iDto);
        String jsonStrList = JsonHelper.encodeObject2Json(list);
        outDto.put("jsonStrList", JsonHelper.encodeJson2PageJson(jsonStrList, totalCount));
        return outDto;
    }

    public Dto importOrdScheList(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        List list = pDto.getDefaultAList();
        try {
            //记录订单记录流水表
            g4Dao.batchInsert(list,"insertOrdDayList");
            Integer max_seq_no = (Integer)g4Dao.queryForObject("queryMaxProdSureInfo");
            max_seq_no = max_seq_no==null?1:(max_seq_no+1);
            //记录生产确认表
            for(Object obj:list){
                Dto dto = (Dto)obj;
                //设置交接表数据
                dto.put("seq_no",max_seq_no);
                dto.put("id",dto.getAsString("order_id"));
                dto.put("submit_date", G4Utils.getCurDate());
                dto.put("sure_date",G4Utils.getCurDate());
                dto.put("tr_date", dto.getAsString("tr_date").replace(".", "-"));
                dto.put("remark",dto.getAsString("record_no"));
                dto.put("flag","2");//1-生产通知单确认 2-订单确认
                dto.put("state","0");

                max_seq_no++;
            }

            g4Dao.batchInsert(list,"insertProdSureList");

            outDto.put("success", true);

        } catch (Exception e) {
            e.printStackTrace();
            ApplicationException ae = new ApplicationException("");
            ae.initCause(e);
            throw ae;
        }
        return outDto;
    }
    
    public Dto insertStyleImgFile(Dto pDto) throws ApplicationException {
		Dto outDto = new BaseDto();
		g4Dao.update("insertStyleImgFile", pDto);
		outDto.put("msg", "文件保存成功!"); 
		outDto.put("success", true);
		return outDto;
	}
	/**
	 * 删除重复的基础数据
	 */
	public Dto deleteOrdReData(Dto pDto) throws ApplicationException {
		//取消此功能 如需开启  取消注释即可
//		g4Dao.delete("deleteOrdDayListReData");
//		g4Dao.delete("resetOrdBaseData");
		return null;
	}

}
