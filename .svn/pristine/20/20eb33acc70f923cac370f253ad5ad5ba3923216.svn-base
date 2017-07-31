package com.cnnct.rfid.service.impl;

import java.util.List;

import com.cnnct.rfid.service.DevTrmInfoService;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import com.cnnct.util.GlobalConstants;

import com.cnnct.common.ApplicationException;

/************************************************
 * 创建日期: 2013-04-25 13:38:00
 * 创建作者：唐芳海
 * 功能：设备管理
 * 最后修改时间：
 * 修改记录：
*************************************************/
public class DevTrmInfoServiceImpl extends BaseServiceImpl implements DevTrmInfoService {

    /***
     * 设备信息查询
     */
    public Dto queryDeviceBaseInfo(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        List list = g4Dao.queryForPage("queryDeviceBaseInfo", pDto);
        Integer totalCount = (Integer) g4Dao.queryForObject("queryDeviceBaseInfoCount", pDto);
        outDto.put("jsonStrList", JsonHelper.encodeList2PageJson(list, totalCount, GlobalConstants.FORMAT_Date));
        return outDto;
    }

    /***
     * 设备信息新增
     */
    public Dto insertDeviceBaseInfo(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            Integer trm_no = (Integer) g4Dao.queryForObject("getDevBaseTrmno", pDto);
            trm_no = trm_no == null ? 10000001 : (trm_no + 1);
            pDto.put("trm_no", trm_no);
            pDto.put("state", 0);
            g4Dao.insert("insertDeviceBaseInfo", pDto);
            outDto.put("msg", "设备信息新增成功");
            outDto.put("success", Boolean.valueOf(true));
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }
        return outDto;
    }

    /***
     * 设备信息删除
     */
    public Dto updateDevTrmInfoState(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            g4Dao.delete("deleteDeviceBaseInfo", pDto);
            outDto.put("msg", "设备信息状态更改成功");
            outDto.put("success", Boolean.valueOf(true));
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }
        return outDto;
    }

    /***
     * 设备信息修改
     */
    public Dto updateDeviceBaseInfo(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            g4Dao.update("updateDeviceBaseInfo", pDto);
            outDto.put("msg", "设备信息修改成功");
            outDto.put("success", Boolean.valueOf(true));
        } catch (Exception e) {
            throw new ApplicationException(e.getMessage(), e);
        }
        return outDto;
    }
}
