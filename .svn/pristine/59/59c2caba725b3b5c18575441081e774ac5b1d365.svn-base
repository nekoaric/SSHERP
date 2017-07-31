package com.cnnct.rfid.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.cnnct.common.ApplicationException;
import com.cnnct.rfid.service.EpcDayListService;
import com.cnnct.util.G4Utils;

/**
 * RFID业务实现类
 *
 * @author lingm
 * @since 2013-05-09
 */
public class EpcDayListServiceImpl extends BaseServiceImpl implements EpcDayListService {

    /**
     * 查询RFID产品信息 带分页
     *
     * @param pDto
     * @return
     */
    public Dto queryEpcDayListInfo(Dto iDto) {
        Dto outDto = new BaseDto();
        List list = g4Dao.queryForPage("queryEpcDayListInfo", iDto);
        Integer totalCount = g4Dao.queryForPageCount("queryEpcDayListInfo", iDto);
        String jsonStrList = JsonHelper.encodeObject2Json(list);
        outDto.put("jsonStrList", JsonHelper.encodeJson2PageJson(jsonStrList, totalCount));
        return outDto;
    }

    public Dto importExcel(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            List epcDayList = pDto.getDefaultAList();
            List epcProdList = pDto.getDefaultBList();

            //没有绑定标签产品信息的先绑定
            for (Object o : epcProdList) {
                Dto epcProdDto = (Dto) o;

                //查询是否已有绑定信息
                Integer count = (Integer) g4Dao.queryForObject("queryProdAndEpcCount", epcProdDto);
                if (count == 0) {
                    g4Dao.insert("insertEpcProdListInfo", epcProdDto);
                }
            }

            g4Dao.batchInsert(epcDayList, "insertEpcDayListInfo");

            outDto.put("success", true);
            outDto.put("msg", "标签记录导入成功");

        } catch (Exception e) {
            e.printStackTrace();
        }
        return outDto;
    }

    public Dto importExcelNoEpc(List list) throws ApplicationException {
        Dto outDto = new BaseDto();
//        Dto natureDto = new BaseDto();
//        natureDto.put("裁出数量","1");//real_cut_num
//        natureDto.put("缝制领片","2");//draw_num
//        natureDto.put("缝制下线","3");//sew_num
//        natureDto.put("水洗收货","4");//bach_accept_num
//        natureDto.put("水洗移交","5");//bach_delivery_num
//        natureDto.put("后整收货","6");//pack_accept_num
//        natureDto.put("移交成品","7");//f_product_num
//        natureDto.put("移交B品","8");//b_product_num
//        natureDto.put("收成品", "10");//receive_f_product
//        natureDto.put("收B品", "11");//receive_b_product
//        natureDto.put("中间领用","12");//middle_take
//        natureDto.put("送水洗", "13");//sew_delivery_num
        //String 表示流程的数据，List 一个流程的数据集合
        Map<String,List> natureCollection = new HashMap<String,List>();
        for(int i=1;i<=13;i++){	//初始化
        	natureCollection.put(i+"", new ArrayList());
        }
        for(Object obj : list){ //对导入的数据分类处理
        	Dto dto = (Dto)obj;
        	String nature = dto.getAsString("nature");
        	List natureList = natureCollection.get(nature);
        	natureList.add(dto);
        }
        try {
            List epcProdList = new ArrayList();
            for (Object o : list) {
                Dto epcDto = (Dto) o;
                String nature = epcDto.getAsString("nature");
                if ("1".equals(nature)) {
                    //插入标签流水表
                    epcDto.put("nature", "1");//数量流程为裁剪绑定
                    epcDto.put("flag", "0");//0-设备记录 1-导入
                    epcDto.put("opr_time", G4Utils.getCurrentTime());
                    epcDto.put("state", 0);
                    //保存绑定记录
                    epcProdList.add(epcDto);
                } else {
                    if ("".equals(epcDto.getAsString("epc"))) {
                        Integer row = epcDto.getAsInteger("match_key_row");
                        Dto dto = (Dto) list.get(row);
                        epcDto.put("epc", dto.getAsString("epc"));
                    }
                }
            }

            g4Dao.batchInsertBaseDto("insertEpcProdListInfo", epcProdList);
            g4Dao.batchUpdateBaseDto("updateProdCutNum4EpcDayList", epcProdList);

            g4Dao.batchInsertBaseDto("insertEpcDayListInfo", list);

            outDto.put("success", true);
            outDto.put("msg", "标签记录导入成功");

        } catch (Exception e) {
            e.printStackTrace();
            ApplicationException ae = new ApplicationException();
            ae.initCause(e);
            throw ae;
        }
        return outDto;
    }

}
