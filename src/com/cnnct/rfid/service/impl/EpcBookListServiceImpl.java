package com.cnnct.rfid.service.impl;

import java.util.List;

import com.cnnct.rfid.service.EpcBookListService;
import com.cnnct.util.G4Utils;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.cnnct.common.ApplicationException;

/**
 * RFID业务实现类
 *
 * @author lingm
 * @since 2013-05-09
 */
public class EpcBookListServiceImpl extends BaseServiceImpl implements EpcBookListService {

    /**
     * 查询RFID产品信息 带分页
     *
     * @param pDto
     * @return
     */
    public Dto queryEpcBookListInfo(Dto iDto) {
        Dto outDto = new BaseDto();
        List list = g4Dao.queryForPage("queryEpcBookListInfo", iDto);
        Integer totalCount = g4Dao.queryForPageCount("queryEpcBookListInfo", iDto);
        String jsonStrList = JsonHelper.encodeObject2Json(list);
        outDto.put("jsonStrList", JsonHelper.encodeJson2PageJson(jsonStrList, totalCount));
        return outDto;
    }


    /**
     * RFID电子标签入库
     *
     * @param pDto
     * @return
     */
    public Dto saveEpcBookListInfo(Dto iDto) throws ApplicationException {
        try {
            Dto outDto = new BaseDto();
            iDto.put("state", "1");
            Integer no = (Integer) g4Dao.queryForObject("queryEpcBookCountByTid", iDto);
            if (no > 0) {
                outDto.put("msg", "电子标签保存失败，该标签已记录到系统!");
                outDto.put("success", new Boolean(false));
                return outDto;
            } else {
                g4Dao.insert("insertEpcBookListInfo", iDto);
                outDto.put("success", new Boolean(true));
                outDto.put("msg", "电子标签登记成功!");
            }
            iDto.put("nature", "0");//标签入库
            iDto.put("flag", "0");
            iDto.put("opr_time", G4Utils.getCurrentTime());
            g4Dao.insert("insertEpcDayListInfo", iDto);
            return outDto;
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }
    }

    /**
     * 删除标签信息
     * @param pDto
     * @return
     */
    public Dto deleteEpcItems(Dto pDto) {
        Dto outDto = new BaseDto();
        try {
            Integer no = (Integer) g4Dao.queryForObject("queryEpcProdInfoCountByTid", pDto);
            if (no > 0) {
                outDto.put("success", Boolean.valueOf(false));
                outDto.put("msg", "标签删除失败,该标签已经绑定服装!");
            } else {
                g4Dao.delete("deleteEpcInfo", pDto);
                outDto.put("success", Boolean.valueOf(true));
                outDto.put("msg", "标签删除成功!");
            }
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }

        return outDto;
    }
}
