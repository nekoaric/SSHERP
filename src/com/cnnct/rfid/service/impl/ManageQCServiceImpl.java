package com.cnnct.rfid.service.impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.Map.Entry;

import org.apache.cxf.binding.corba.wsdl.Exception;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.cnnct.common.ApplicationException;
import com.cnnct.rfid.service.ManageQCService;
import com.cnnct.util.G4Utils;

@SuppressWarnings({"unchecked", "rawtypes"})
public class ManageQCServiceImpl extends BaseServiceImpl implements ManageQCService {

	/**
	 * 网页部分查询页面信息
	 * @param pDto
	 * @return Dto
	 */
	public Dto queryQCProcess(Dto pDto) {
		Dto outDto = new BaseDto();
        List list = g4Dao.queryForPage("queryQCItemForManage", pDto);
        Dto itemDto;
        Dto parentDto;
        
        for (int i = 0; i < list.size(); i++) {
			itemDto=(BaseDto)list.get(i);
			//获取检查项的子项的数量
			int cc=(Integer) g4Dao.queryForObject("getChildCount", itemDto);
			itemDto.put("cc", cc);
			//查询检查项是否有对应的数据信息
			int ic=(Integer)g4Dao.queryForObject("getNumInfoByItem", itemDto);
			itemDto.put("ic", ic);
			parentDto=(Dto)g4Dao.queryForObject("getParentQCItemBySeq", itemDto);
			if (parentDto!=null) {
				itemDto.put("leaf", new Boolean(true));
				itemDto.put("parent_name", parentDto.getAsString("name"));
			}else{
				itemDto.put("leaf", new Boolean(false));
			}
		}
        String jsonString = JsonHelper.encodeObject2Json(list);
        Integer pageCount = g4Dao.queryForPageCount("queryQCItemForManage", pDto);
        outDto.put("jsonString", JsonHelper.encodeJson2PageJson(jsonString, pageCount));
        return outDto;
	}
	
	/**
	 * 保存qc树状列表
	 * @param pDto
	 * @return Dto
	 */
	public Dto saveQCprocess(Dto dto) throws ApplicationException {
		//"class,class_detail,number,qc_position,qc_item,qc_item_detail";
	    //1	levis-test	针织	内衣	产品终查	线迹不良	其他		
		Dto outDto = new BaseDto();
		g4Dao.insert("saveQCInfo", dto);		
		outDto.put("msg", "保存成功");
        outDto.put("success", true);
		return outDto;
	}

	/**
	 * 修改qc树状列表
	 * @param pDto
	 * @return Dto
	 */
	public Dto updateQCprocess(Dto dto) throws ApplicationException {
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * 删除qc树状列表
	 * @param pDto
	 * @return Dto
	 */
	public Dto deleteQCprocess(Dto dto) throws ApplicationException {
		Dto outDto = new BaseDto();
		g4Dao.update("deleteQCItem", dto);		
		return null;
	}

	public Dto saveQCItem(Dto qcItemDto) throws ApplicationException {
		Dto outDto = new BaseDto();
		g4Dao.insert("saveQCItem", qcItemDto);		
		outDto.put("msg", "导入工序表成功");
        outDto.put("success", true);
		return outDto;
	}
/**
 * 获取qc基本信息
 */
	public Dto getQCInfoByDto(Dto dto) throws ApplicationException {
		Dto outDto = new BaseDto();
		outDto=(Dto)g4Dao.queryForObject("getQCInfoByDto", dto);		
		return outDto;
	}



	/**
	 * 获取父级检查项
	 */
	public Dto getPItemByDto(Dto dto) throws ApplicationException {
		Dto outDto = new BaseDto();
		outDto=(Dto)g4Dao.queryForObject("getPItemByDto", dto);		
		return outDto;
	}

    /**
     * 保存QC数量信息
     */
    public void saveQCNumInfo(Dto inDto) throws ApplicationException {
        // 参数
        boolean isExistsBatchNo = false;
        // 组装订单查询
        String ords = inDto.getAsString("ords");
        String[] ordStr = ords.split(",");
        StringBuffer ordDBStr = new StringBuffer(100);
        for(String str : ordStr){
            str.replaceAll("'", "''");
            ordDBStr.append(",'").append(str).append("'");
        }
        // 如果有数据删除第一个逗号
        if (ordDBStr.length() > 0) {
            ordDBStr.deleteCharAt(0);
        }
        Dto dbDto = new BaseDto();
        dbDto.put("ords", ordDBStr.toString());
        
        // 查询 是否是同一批次的数据
        int ordLenght = ordStr.length;
        List<Dto> batchNoList = g4Dao.queryForList("queryBatchNo4order", dbDto);
        int batchNo = -1;
        for(Dto dto : batchNoList){
            if(dto.getAsInteger("num") == ordLenght){
                batchNo = dto.getAsInteger("batch_no"); // 保存符合条件的批次号
                isExistsBatchNo = true;
                break;
            }
        }
        // 生成批次序号
        if(batchNo == -1){
            Integer maxNo = (Integer)g4Dao.queryForObject("queryMaxBatchNo");
            batchNo = maxNo != null ? maxNo+1 : 10000001;
        }
        
        // 处理订单批次信息
        String opr_date = inDto.getAsString("opr_date");
        String opr_id = inDto.getAsString("opr_id");
        
        // 订单信息集合
        List<Dto> orderBatch = new ArrayList<Dto>();
        for(String str : ordStr){
            Dto beanDto = new BaseDto();
            beanDto.put("order_id", str);
            beanDto.put("batch_no", batchNo);
            beanDto.put("opr_date", opr_date);
            beanDto.put("opr_id", opr_id);
            orderBatch.add(beanDto);
        }
        
        String numInfo = inDto.getAsString("numInfo");
        Dto numInfoDto = (Dto)JsonHelper.parseSingleJson2Dto(numInfo);
        
        // qcNum数量信息
        List<Dto> qcNumList = new ArrayList<Dto>();
        
        for(Entry<String,Integer> entry : (Set<Entry<String,Integer>>)numInfoDto.entrySet()){
            Dto beanDto = new BaseDto();
            beanDto.put("order_batch_no", batchNo);
            beanDto.put("qc_item_no", entry.getKey());
            beanDto.put("amount", entry.getValue());
            beanDto.put("opr_date", opr_date);
            beanDto.put("opr_id", opr_id);
            qcNumList.add(beanDto);
        }
        
        g4Dao.batchInsertBaseDto("insertQcNumList", qcNumList);
        if(!isExistsBatchNo){   // 不存在则插入批次信息
            g4Dao.batchInsertBaseDto("insertQcOderInfo", orderBatch);
        }
    }

	//从页面输入检查项
	public Dto saveQCItemFromB(Dto dto) throws ApplicationException {
		Dto outDto = new BaseDto();
		Dto qcItemDto= new BaseDto();
		String catalog = "class,qc_position,qc_item,parent_no";
		qcItemDto.put("opr_date", G4Utils.getCurrentTime("yyyy-MM-dd"));
		qcItemDto.put("opr_id", dto.getAsString("opr_id"));
		String[] catalogs = catalog.split(",");
		//处理所需单元格
		for (int i = 0; i < catalogs.length; i++) {
			//去除空格
			dto.put(catalogs[i], dto.getAsString(catalogs[i]).replace(" ",""));
			Dto pdto = new BaseDto();
			pdto.put("opr_date", G4Utils.getCurrentTime("yyyy-MM-dd"));
			pdto.put("opr_id", dto.getAsString("opr_id"));
			pdto.put("name", dto.getAsString(catalogs[i]));
			//qc基本信息的序号
			String max_seq_no = (String) g4Dao.queryForObject("selectMaxSeqFromQCBaseInfo");
			Integer in_seq_no=max_seq_no==null?1:(Integer.parseInt(max_seq_no) + 1);
			//增加基本信息
			switch (i) {
			case 0:
				dto.put("flag", 3);
				break;
			case 1:
				dto.put("flag", 1);
				break;
			case 2:
				dto.put("flag", 2);
				break;
			case 3:
				dto.put("flag", 2);
				break;
			}
			dto.put("name", dto.getAsString(catalogs[i]));
			//重复行验证 unfinished
			Dto infoDto=getQCInfoByDto(dto);
			//有相同名字和标识的信息,检查项对应位置存入已有的序号
			if(infoDto!=null){
				qcItemDto.put(catalogs[i], infoDto.getAsString("seq_no"));
				continue;
			}else{
				pdto.put("flag", dto.getAsString("flag"));
				pdto.put("name", dto.getAsString(catalogs[i]));
				pdto.put("short_name", dto.getAsString(catalogs[i]).substring(4));
				qcItemDto.put(catalogs[i],in_seq_no);
			}
			pdto.put("seq_no", in_seq_no);
			//保存qc基本信息单元格信息
			saveQCprocess(pdto);
		}
		//检查是否有父级
		Dto parentQCItem= getPItemByDto(qcItemDto);
		if (parentQCItem!=null) {
			qcItemDto.put("parent_no", parentQCItem.getAsString("seq_no"));
		}else{
			//保存父级信息
			Dto parentItem=new BaseDto();
			parentItem.put("class", qcItemDto.getAsString("class"));
			parentItem.put("qc_item",qcItemDto.getAsString("parent_no"));
			parentItem.put("qc_position",qcItemDto.getAsString("qc_position"));
			parentItem.put("opr_date",qcItemDto.getAsString("opr_date"));
			parentItem.put("opr_time",qcItemDto.getAsString("opr_time"));
			parentItem.put("opr_id",qcItemDto.getAsString("opr_id"));
			parentItem.remove("parent_no");
			saveQCItem(parentItem);
			String parentSeq=(String)g4Dao.queryForObject("selectMaxSeqFromQCItem");
			qcItemDto.put("parent_no", parentSeq);
		}
		//检查有无重复项，条件class, postion,item, parent_item
		Dto checkDto=(Dto)g4Dao.queryForObject("checkQCItemByDto",qcItemDto);
		if (checkDto!=null) {
			outDto.put("msg", "已存在相同的检查项");
			return outDto;
		}
		saveQCItem(qcItemDto);	
		outDto.put("msg", "保存成功");
        outDto.put("success", true);
		return outDto;
	}
/**
 * 查询qc流水记录
 */
	public Dto queryQCScheList(Dto pDto) {
		Dto outDto = new BaseDto();
		//处理多订单勾选
		String prodords = pDto.getAsString("prodords");
		if(!G4Utils.isEmpty(prodords)){
		    prodords.replace("'", "''");
		    String[] prodordArr = prodords.split(",");
		    StringBuffer sb = new StringBuffer();
		    for(String str : prodordArr){
		        sb = sb.append(",'").append(str).append("'");
		    }
		    if(sb.length()>0){
		        sb.deleteCharAt(0);
		    }
		    pDto.put("prodords", sb.toString());
		}
		
        List list = g4Dao.queryForPage("queryQCScheList", pDto);
        Dto itemDto;
        Dto parentDto;
        
        for (int i = 0; i < list.size(); i++) {
			itemDto=(BaseDto)list.get(i);
			parentDto=(Dto)g4Dao.queryForObject("getParentQCItemBySeq", itemDto);
			if (parentDto!=null) {
				itemDto.put("leaf", new Boolean(true));
				itemDto.put("parent_name", parentDto.getAsString("name"));
			}else{
				itemDto.put("leaf", new Boolean(false));
			}
		}
        String jsonString = JsonHelper.encodeObject2Json(list);
        Integer pageCount = g4Dao.queryForPageCount("queryQCScheList", pDto);
        outDto.put("jsonString", JsonHelper.encodeJson2PageJson(jsonString, pageCount));
        return outDto;
	}
	/**
	 * 删除qc流水记录
	 */
	public void deleteQCNumInfo(Dto inDto) throws ApplicationException {
		g4Dao.delete("deleteQCNumInfo", inDto);
	}
	/**
	 * 更具po和样式获取qc饼图
	 * param:order_id,class_name
	 * return:list<Dto>
	 */
	public Dto getQCPieByOrderId(Dto inDto) throws ApplicationException{
		Dto outDto = new BaseDto();
		List list = g4Dao.queryForPage("queryQCPie", inDto);
		//获取所有位置信息
		List pnames=new ArrayList();
		for (int i=0;i<list.size();i++) {
			Dto dto=(Dto)list.get(i);
			pnames.add(dto.getAsString("qc_position_name"));
		}
		HashSet hs= new HashSet(pnames);
		pnames=new ArrayList<String>(hs);
		
		List pDtos=new ArrayList();
		//在位置下添加质检项信息
		for (int i=0;i<pnames.size();i++) {
			Dto pDto=new BaseDto();
			pDto.put("position_name", pnames.get(i));
			//检查项数量信息
			List items=new ArrayList();
			//将检查项数据挂在检查位置下
			for(int j=0;j<list.size();j++){
				Dto iDto=(Dto) list.get(j);
				if (pnames.get(i).equals(iDto.getAsString("qc_position_name"))) {
					items.add(iDto);
				}
			}
			pDto.put("positionNumInfo", items);
			pDtos.add(pDto);
			outDto.put("pDtos", pDtos);
		}
		
	    return outDto;
	}
	
}
