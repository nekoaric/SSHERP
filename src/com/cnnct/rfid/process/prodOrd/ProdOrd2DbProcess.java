package com.cnnct.rfid.process.prodOrd;

import java.util.List;

import org.eredlab.g4.bmf.base.IReader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

import com.cnnct.common.ApplicationException;
import com.cnnct.dataInterface.ProcessDataAdapter;

/**
 * 依据现有的数据查询数据库添加额外信息
 * @author zhouww
 *
 */
public class ProdOrd2DbProcess extends ProcessDataAdapter {
    
    public ProdOrd2DbProcess(){};
    
    public ProdOrd2DbProcess(Dto inDto,IReader iReader){
        super();
        this.inDto = inDto;
        this.iReader = iReader;
    }
    
    public Dto processData() throws ApplicationException {
        //用户名
        String cust_name = inDto.getAsString("cust_name");
        Dto dbDto = new BaseDto();
        dbDto.put("cust_name", cust_name);
        Dto custDto = (Dto) iReader.queryForObject("queryBasCustListInfo", dbDto);
        String cust_id = custDto!=null?custDto.getAsString("cust_id"):"";
        inDto.put("cust_id", cust_id);
        
        //工厂，部门，班组
        dbDto = new BaseDto();
        String grp_id = inDto.getAsString("grp_id");
        String sew_facName = inDto.getAsString("sew_facName");
        String bach_facName = inDto.getAsString("bach_facName");
        String pack_facName = inDto.getAsString("pack_facName");
        
        dbDto.put("grp_id", grp_id);
        List grpList = iReader.queryForList("queryBelongGrpsInfo", dbDto);
        for(Object obj:grpList){
            Dto grpDto = (Dto)obj;
            if(grpDto.getAsString("addr").equals(sew_facName)){
                inDto.put("sew_fac", grpDto.getAsString("grp_id"));
            }
            if(grpDto.getAsString("addr").equals(bach_facName)){
                inDto.put("bach_fac", grpDto.getAsString("grp_id"));
            }
            if(grpDto.getAsString("addr").equals(pack_facName)){
                inDto.put("pack_fac", grpDto.getAsString("grp_id"));
            }
        }
        return inDto;
    }

}
