package com.cnnct.rfid.service.impl;

import java.util.List;

import com.cnnct.util.GlobalConstants;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.cnnct.common.ApplicationException;
import com.cnnct.rfid.service.ClothBasInfoService;

/************************************************
 * 创建日期: 2013-05-07 09:38:00
 * 创建作者：唐芳海
 * 功能：服装信息管理
 * 最后修改时间：
 * 修改记录：
*************************************************/
public class ClothBasInfoServiceImpl extends BaseServiceImpl implements ClothBasInfoService {

    /***
     * 服装信息查询
     */
    public Dto queryClothBasInfo(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        List list = g4Dao.queryForPage("queryClothBasInfo", pDto);
        Integer totalCount = (Integer) g4Dao.queryForObject("queryClothBasInfoCount", pDto);
        outDto.put("jsonStrList", JsonHelper.encodeList2PageJson(list, totalCount, GlobalConstants.FORMAT_Date));
        return outDto;
    }

    /***
     * 服装信息新增
     */
    public Dto insertClothBasInfo(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            Integer seq_no = (Integer) g4Dao.queryForObject("getClothBas4SeqNo", pDto);
            seq_no = seq_no == null ? 10000001 : (seq_no + 1);
            pDto.put("seq_no", seq_no);
            g4Dao.insert("insertClothBasInfo", pDto);
            outDto.put("msg", "服装信息新增成功");
            outDto.put("success", Boolean.valueOf(true));
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }
        return outDto;
    }

    /***
     * 服装信息删除
     */
    public Dto deleteClothBasInfo(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            g4Dao.delete("deleteClothBasInfo", pDto);
            outDto.put("msg", "服装信息删除成功");
            outDto.put("success", Boolean.valueOf(true));
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }
        return outDto;
    }

    /***
     * 服装信息修改
     */
    public Dto updateClothBasInfo(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            g4Dao.update("updateClothBasInfo", pDto);
            outDto.put("msg", "服装信息修改成功");
            outDto.put("success", Boolean.valueOf(true));
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }
        return outDto;
    }
}
