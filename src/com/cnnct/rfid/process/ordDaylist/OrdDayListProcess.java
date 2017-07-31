package com.cnnct.rfid.process.ordDaylist;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.cnnct.common.ApplicationException;
import com.cnnct.dataInterface.ProcessDataAdapter;
import com.cnnct.util.G4Utils;
import com.cnnct.util.NatureUtil;

/**
 * 对订单流水数据过滤
 * <br>过滤无效的数据和备注重复的数据
 * @author zhouww
 * @since 2014-11-24
 */
public class OrdDayListProcess extends ProcessDataAdapter{

    public OrdDayListProcess() {
        super();
    }

    public OrdDayListProcess(Dto inDto,IReader iReader){
        super.inDto = this.inDto;
        super.iReader = this.iReader;
    }
    
    public Dto processData() throws ApplicationException {
        Dto outDto = new BaseDto();
        List list = inDto.getDefaultAList();
        if(list==null){
            return null;
        }

        //判断数据正确行
        List ordDayList = new ArrayList();  // 可正常处理数据
        for (int i = 0; i < list.size(); i++) {
            Dto dto = (Dto) list.get(i);

            //过滤空行
            if ("".equals(dto.getAsString("order_id")) || "".equals(dto.getAsString("tr_date")) 
                        || "0".equals(dto.getAsString("order_id"))) {
                continue;
            }
            // 此处保留 备注信息相同判断
            Integer count = (Integer) iReader.queryForObject("queryProdSureList4RecordNo", dto);
            if (count != 0) {//过滤已经有记录的
                continue;
            }

            Object obj = dto.get("tr_date");
            if (obj instanceof java.util.Date) {
                dto.put("tr_date", G4Utils.getDate((Date) obj, "yyyy-MM-dd"));
            }
            //查询客户信息
            if(!"".equals(dto.getAsString("cust_name"))){
                Dto custInfo = (Dto)iReader.queryForObject("queryCustInfoByCustName", dto);
                if(custInfo!=null){
                    dto.put("cust_id", custInfo.getAsString("cust_id"));
                }
            }
            
            // 添加工厂，部门，班组编号
            Dto qDto = new BaseDto();
            qDto.put("grp_id", inDto.getAsString("grp_id"));
            List deptNamesList = iReader.queryForList("queryDept4OrdDayImport", qDto);
            List grpsNamesList = iReader.queryForList("queryBelongGrpsInfo",qDto);
            if("".equals(dto.getAsString("team_name")) && "".equals(dto.getAsString("dept_name"))){
                for (Object o : grpsNamesList) {
                    Dto deptNamesDto = (Dto) o;
                    if (deptNamesDto.getAsString("name").equals(dto.getAsString("grp_name"))) {
                        dto.put("grp_id", deptNamesDto.getAsString("grp_id"));
                        break;
                    }
                }
            }else {
                for (Object o : deptNamesList) {
                    Dto deptNamesDto = (Dto) o;
                    if (("".equals(dto.getAsString("team_name"))||deptNamesDto.getAsString("team_name").equals(dto.getAsString("team_name")))
                            && deptNamesDto.getAsString("dept_name").equals(dto.getAsString("dept_name"))
                            && deptNamesDto.getAsString("grp_name").equals(dto.getAsString("grp_name"))) {
                        if(!"".equals(dto.getAsString("team_name"))){
                            dto.put("team_no", deptNamesDto.getAsString("team_no"));
                        }
                        dto.put("dept_id", deptNamesDto.getAsString("dept_id"));
                        dto.put("grp_id", deptNamesDto.getAsString("grp_id"));
                        break;
                    }
                }
            }
            ordDayList.add(dto);
        }
        outDto.setDefaultAList(ordDayList);
        return outDto;
    }
    
}
