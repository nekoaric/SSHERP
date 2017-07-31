package com.cnnct.rfid.valide.ordDaylist;

import java.util.List;
import java.util.Set;

import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.cnnct.common.ApplicationException;
import com.cnnct.dataInterface.ValideDataAdapter;
import com.cnnct.util.G4Utils;

/**
 * 订单流水表数据验证
 * @author zhouww
 * @since 2014-11-24
 */
public class OrdDayListValide extends ValideDataAdapter{

    public void OrdDayListValide(){}
    
    public void OrdDayListValide(Dto inDto,IReader iReader){
        super.inDto = this.inDto;
        super.iReader = this.iReader;
    }
    
    public void valideDate() throws ApplicationException {
        List list = inDto.getDefaultAList();
        //判断数据正确行
        Dto qDto = new BaseDto();
        qDto.put("grp_id", inDto.getAsString("grp_id"));
        List deptNamesList = iReader.queryForList("queryDept4OrdDayImport", qDto);
        List grpsNamesList = iReader.queryForList("queryBelongGrpsInfo",qDto);
        for (int i = 0; i < list.size(); i++) {
            Dto dto = (Dto) list.get(i);
            //获取订单信息
            /**
            // 将验证的步骤移动到导入的判断，并且只提示错误行号
            Dto dbDto = new BaseDto();
            for(String str : (Set<String>)dto.keySet()){
                String value = dto.getAsString(str);
                value = value.replaceAll("'", "''");    //将查询的语句经过处理，防止单引号对查询所造成的影响
                dbDto.put(str, value);
            }
            Dto orderDto = (Dto) iReader.queryForObject("queryOrdBasInfo", dbDto);
            if (G4Utils.isEmpty(orderDto)) {
                throw new ApplicationException("第" + dto.getAsString("row_num") + "行订单号有误,没有对应的订单信息!");
            }
            if (!dto.getAsString("style_no").equals(orderDto.getAsString("style_no"))) {
                throw new ApplicationException("第" + dto.getAsString("row_num") + "行订单号与款号不符,请确认订单信息!");
            }
            dto.put("order_id", orderDto.getAsString("order_id"));
            */
            String nature = dto.getAsString("nature");
            if ("".equals(nature)) {
                throw new ApplicationException("第" + dto.getAsString("row_num") + "行数量性质有误,请使用标准格式!");
            }
            //判断工厂，部门，班组是否存在
            //如果没有部门,班组信息。判断工厂信息
            if(((!"".equals(dto.getAsString("grp_name")) && "".equals(dto.getAsString("grp_id")))) ||
                    ((!"".equals(dto.getAsString("dept_name")) && "".equals(dto.getAsString("dept_id")))) ||
                    ((!"".equals(dto.getAsString("team_name")) && "".equals(dto.getAsString("team_no"))))){
                throw new ApplicationException("第" + dto.getAsString("row_num") + "行工厂班组部门信息错误,请检查!");
            }
        }
    }
    
}
