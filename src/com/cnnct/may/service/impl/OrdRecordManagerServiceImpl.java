package com.cnnct.may.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;

import com.cnnct.common.ApplicationException;
import com.cnnct.may.data.process.ordrecordmanager.OrdRecordmanagerProcessContorl;
import com.cnnct.may.data.valide.ordrecordmanager.OrdRecordmanagerValideContorl;
import com.cnnct.may.service.OrdRecordManagerService;
import com.cnnct.util.G4Utils;
import com.cnnct.util.GlobalConstants;
import com.cnnct.util.NatureNumberUtil;
import com.cnnct.util.NatureUtil;

public class OrdRecordManagerServiceImpl extends BaseServiceImpl implements
        OrdRecordManagerService {

    public Dto addOrdRecordInfo(Dto inDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        // 判断数量是否超出
        Dto ordDto = getCurrentNatureNum(inDto);
        Integer amount = Integer.parseInt(inDto.getAsString("amount"));
        Integer ins_num = Integer.parseInt("".equals(ordDto
                .getAsString("ins_num")) ? "0" : ordDto.getAsString("ins_num"));
        Integer finish_num = Integer.parseInt("".equals(ordDto
                .getAsString("finish_num")) ? "0" : ordDto
                .getAsString("finish_num"));

        String loginName = inDto.getAsString("loginName");	// 用于验证刷卡人信息，移交人或者收货人其中一个为登录人
        String loginDept = inDto.getAsString("loginDept");	// 用于判断记录是否是可操作的
        String grp_id = inDto.getAsString("grp_id");	// 记录使用的工厂信息
        
        String submitname = inDto.getAsString("submitname");	// 移交人
        String surename = inDto.getAsString("surename");	// 收货人
        
        if(!submitname.equals(loginName) && !surename.equals(loginName)){
        	outDto.put("success", false);
        	outDto.put("msg", "移交人或者收货人必须是一个登录");
        	return outDto;
        }
        Dto dbDto = new BaseDto();
        dbDto.put("grpflag", "1");
        // 查询登录人员的企业对应部门信息
        dbDto.put("dept_id", loginDept);
        List<Dto> loginGrpTreeInfo = g4Dao.queryForList("queryGrpTreeInfo4deptid",dbDto);
        List<String> loginGrpTree = new ArrayList<String>();
        for(Dto dto : loginGrpTreeInfo){
        	loginGrpTree.add(dto.getAsString("grp_id"));
        }
        // 判断操作的额工厂是否是登录人所属的工厂
//        if(!loginGrpTree.contains(grp_id)){	
//        	// 操作工厂不是所属工厂不让操作
//        	outDto.put("success", false);
//        	outDto.put("msg", "操作的工厂必须是登录人所在的工厂");
//        	return outDto;
//        }
        	
     
        
        if ("1".equals(inDto.getAsString("ignore_flag"))
                || amount <= ins_num - finish_num) {
            // 操作时间
            inDto.put("opr_time", G4Utils.getCurrentTime());
            inDto.put("state", "0");
            inDto.put("mark", inDto.getAsString("ribbon_color"));
            // 转换尺寸数信息。
         	List insList = JsonHelper.parseJson2List(inDto
         					.getAsString("insOrdRecordStr"));
         	inDto.remove("insOrdRecordStr");
         	//获取序列
         	Dto fkDto =(Dto)g4Dao.queryForObject("getOrdSizeInfoFK");
    			inDto.put("fk_odl_seq", fkDto.getAsInteger("fk_seq"));
    		// 登记对应产品信息 todo:分类型填充数据
         			for (int i = 0; i < insList.size(); i++) {
         				Dto insDto = (Dto) insList.get(i);
         				String[] colnumsValue = inDto.getAsString("colValue")
         						.split(",");
         				for (String value : colnumsValue) {
         					if (G4Utils.isEmpty(insDto.getAsString("num" + value))||insDto.getAsString("num" + value).equalsIgnoreCase("undefined")) {
         						continue;
         					}
         					inDto.put("country", insDto.getAsString("country"));
         					inDto.put("color", insDto.getAsString("color"));
         					inDto.put("in_length", insDto.getAsString("in_length"));
         					inDto.put("num", insDto.getAsInteger("num" + value));
         					inDto.put("waist", value);// 腰围
         					inDto.put("statue", "1");//同步状态 1，正常：汇总累加2.修改3.删除 0.已同步完成
         					//插入尺寸信息
         		            g4Dao.insert("insertOrdSizeInfo", inDto);
         				}
         			}
            g4Dao.insert("insertOrdDayListByRecordManage", inDto);
           
            outDto.put("seq_no",g4Dao.queryForObject("getOrdDayListSeqVal"));
            outDto.put("success", true);
            outDto.put("msg", "新增订单记录成功!");
        } else {
            outDto.put("success", false);
            outDto.put("msg", "数量已超出!<br/>指令数:" + ins_num
                    + "件,<span style='color:red'>当前数量性质</span>已完成:"
                    + finish_num + "件!");
        }
        return outDto;
    }
    /**
     * 订单流水记录退货信息修改
     */
    public synchronized Dto rollbackChange(Dto inDto) throws ApplicationException {
        String middleState = "8";   //流水数据处理的中间状态
        //判断传入数据的合规性 
        //查询退货流程和退货起始流程的数据
        //修改原有流水的信息,添加备注
        Dto outDto = new BaseDto();
        //修改征程的订单流水的状态为中间状态(修改为非正常状态，防止修改的时候其他的程序处理此条数据) -删除的中间状态 待数据处理后修改为原来的状态
        //采用中间状态的方式来避免多线程对流水数据的处理
        String seq_no = inDto.getAsString("seq_no");
        Dto dbDto = new BaseDto();
        dbDto.put("seq_no", seq_no);
        dbDto.put("state", middleState); //设置的中间状态
        dbDto.put("startstate", "0");   //设置的状态要为正常状态
        g4Dao.update("updateOrdDayListState4Chage", dbDto);
        
        inDto.put("middleState", middleState);
        try{
            OrdRecordmanagerValideContorl.rollbackChanageValide(inDto, g4Dao);
            Dto resultDto = OrdRecordmanagerProcessContorl.rollbackProcess4Change(inDto, g4Dao);
            g4Dao.update("updateOrdDayListByRecordManage",inDto);   //修改订单流水信息
            //获取同步的信息
            String ord_status = resultDto.getAsString("ord_status");
            String prodord_status = resultDto.getAsString("prodord_status");
            
            List resultList = resultDto.getDefaultAList();
            if(!"0".equals(ord_status)){
                // 更改订单日总记录
                g4Dao.batchUpdateBaseDto("updateOrdDayScheNatureAmount", resultList);
                // 更改订单总记录
                g4Dao.batchUpdateBaseDto("updateOrdScheListNatureAmount", resultList);
            }
            if(!"0".equals(prodord_status)){
                // 更改生产通知单日记录
                g4Dao.batchUpdateBaseDto("updateProdordDayScheNatureAmount", resultList);
                // 更改生产通知单总记录
                g4Dao.batchUpdateBaseDto("updateProdordScheListNatureAmount", resultList);
            }
            
            g4Dao.insert("insertOrdDayUpdateList", resultDto);    //增加流水修改的流水信息
            outDto.put("success", true);
            outDto.put("msg", "流程数据修改成功");
        }catch(ApplicationException e){
            e.printStackTrace();
            throw e;
        }catch(Exception e){
            e.printStackTrace();
            outDto.put("success", false);
            outDto.put("msg", "流程数据修改失败");
        }finally{
          //恢复流水的状态 保证此状态能够恢复
            dbDto = new BaseDto();
            dbDto.put("seq_no", seq_no);
            dbDto.put("state", "0"); 
            dbDto.put("startstate", middleState);
            g4Dao.update("updateOrdDayListState4Chage", dbDto);
        }
        return outDto;
    }
    
    public synchronized Dto updateOrdRecordInfo(Dto inDto) throws ApplicationException {
        Dto outDto = new BaseDto();

        // 判断数量是否超出
        String seq_no = inDto.getAsString("seq_no");
        inDto.put("current_seq_no", seq_no);
        Dto ordDto = getCurrentNatureNum(inDto);
        Integer amount = Integer.parseInt(inDto.getAsString("amount"));
        if (amount == 0) {
            outDto.put("success", false);
            outDto.put("msg", "不能修改订单数量为0,请使用删除!");
            return outDto;
        }
        Integer ins_num = Integer.parseInt("".equals(ordDto
                .getAsString("ins_num")) ? "0" : ordDto.getAsString("ins_num"));
        Integer finish_num = Integer.parseInt("".equals(ordDto
                .getAsString("finish_num")) ? "0" : ordDto
                .getAsString("finish_num"));

        if ("1".equals(inDto.getAsString("ignore_flag"))
                || amount <= ins_num - finish_num) {

            // 获取原日记录信息
            Dto qDto = new BaseDto();
            qDto.put("seq_no", seq_no);
            Dto ordDayDto = (Dto) g4Dao.queryForObject(
                    "queryOrdDayListByRecordManage", qDto);
            //更新数据:涉及多线程安全问题 有待以后解决
            g4Dao.update("updateOrdDayListByRecordManage", inDto);
            String ord_status = ordDayDto.getAsString("ord_status");
            if ("1".equals(ord_status)) {   // 当流水记录经过处理后才处理统计信息
                Dto updateDto = new BaseDto();
                // 更改日记录
                String before_nature = ordDayDto.getAsString("nature");
                String after_nature = inDto.getAsString("nature");
                String before_amount = ordDayDto.getAsString("amount");
                String after_amount = inDto.getAsString("amount");
                before_amount = "".equals(before_amount) ? "0" : before_amount;
                after_amount = "".equals(after_amount) ? "0" : after_amount;
                updateDto.put("before_amount", before_amount);
                updateDto.put("before_nature", before_nature);
                updateDto.put("after_amount", after_amount);
                updateDto.put("after_nature", after_nature);

                updateDto.put("tr_date", ordDayDto.getAsString("tr_date"));
                updateDto.put("order_id", ordDayDto.getAsString("order_id"));

                // 如果原数量性质和更改后的数量性质一直
                if (before_nature.equals(after_nature)) {
                    // 更改后的数量-更改前的数量 再登记到对应的数量性质中
                    Integer interval = Integer.parseInt(after_amount)
                            - Integer.parseInt(before_amount);

                    updateDto.put(NatureUtil.parseNC2natureEn(after_nature),
                            interval);
                } else {
                    // 原登记记录做负操作,现记录做正操作
                    updateDto.put(
                            NatureUtil.parseNC2natureEn(before_nature),
                            -Integer.parseInt(before_amount));
                    updateDto.put(NatureUtil.parseNC2natureEn(after_nature),
                            Integer.parseInt(after_amount));
                }
                // 更改订单日总记录
                g4Dao.update("updateOrdDayScheNatureAmount", updateDto);
                // 更改订单总记录
                g4Dao.update("updateOrdScheListNatureAmount", updateDto);
                // 更改生产通知单日记录
                g4Dao.update("updateProdordDayScheNatureAmount", updateDto);
                // 更改生产通知单总记录
                g4Dao.update("updateProdordScheListNatureAmount", updateDto);
                // 记录订单日记录更改表
                updateDto.put("ord_day_list_seq_no", seq_no);
                updateDto.put("opr_time", G4Utils.getCurrentTime());
                updateDto.put("opr_id", inDto.getAsString("opr_id"));
                updateDto.put("remark", inDto.getAsString("remark"));
                updateDto.put("state", "0");
                updateDto.put("status", "1");// 已处理
                g4Dao.insert("insertOrdDayUpdateList", updateDto);
                
                outDto.put("success", true);
                outDto.put("msg", "订单记录更改成功!");
            } else {// 其他
                // 记录订单日记录更改表
                Dto updateDto = new BaseDto();
                updateDto.put("ord_day_list_seq_no", inDto
                        .getAsString("seq_no"));
                updateDto.put("before_amount", ordDayDto.getAsString("amount"));
                updateDto.put("before_nature", ordDayDto.getAsString("nature"));
                updateDto.put("after_amount", inDto.getAsString("amount"));
                updateDto.put("after_nature", inDto.getAsString("nature"));
                updateDto.put("opr_time", G4Utils.getCurrentTime());
                updateDto.put("opr_id", inDto.getAsString("opr_id"));
                updateDto.put("remark", inDto.getAsString("remark"));
                updateDto.put("state", "0");
                updateDto.put("status", "0");
                g4Dao.insert("insertOrdDayUpdateList", updateDto);
                outDto.put("success", true);
                outDto.put("msg", "订单更改记录提交成功!");
            }
        } else {
            outDto.put("success", false);
            outDto.put("msg", "数量已超出!<br/>指令数:" + ins_num
                    + "件,<span style='color:red'>当前数量性质</span>已完成:"
                    + finish_num + "件!");
        }
        return outDto;
    }

    public Dto deleteOrdRecordInfo(Dto inDto) throws ApplicationException {
        Dto outDto = new BaseDto();

        String seq_no = inDto.getAsString("seq_no");

        // 获取原日记录信息
        Dto qDto = new BaseDto();
        qDto.put("seq_no", seq_no);
        Dto ordDayDto = (Dto) g4Dao.queryForObject(
                "queryOrdDayListByRecordManage", qDto);
        
        // 更改日记录
        inDto.put("state", "1");
        g4Dao.update("deleteOrdDayListByRecordManage", inDto);
        //更改尺寸信息的状态
        inDto.put("statue", "2");
        g4Dao.update("deleteOrdSizeInfoByFKSeq", inDto);
        
        if ("1".equals(ordDayDto.getAsString("ord_status"))) {// 已处理
            Dto updateDto = new BaseDto();

            String before_nature = ordDayDto.getAsString("nature");
            String before_amount = ordDayDto.getAsString("amount");
            before_amount = "".equals(before_amount) ? "0" : before_amount;
            String after_nature = NatureUtil.getBeforeNature(before_nature);

            updateDto.put("style_no", ordDayDto.getAsString("style_no"));
            updateDto.put("before_amount", before_amount);
            updateDto.put("before_nature", before_nature);
            updateDto.put("after_amount", "0");
            updateDto.put("after_nature", after_nature);
            updateDto.put("tr_date", ordDayDto.getAsString("tr_date"));
            updateDto.put("order_id", ordDayDto.getAsString("order_id"));
            updateDto.put(NatureUtil.parseNC2natureEn(ordDayDto
                    .getAsString("nature")), -Integer.parseInt(before_amount));

            // 更改订单日总记录
            g4Dao.update("updateOrdDayScheNatureAmount", updateDto);
            // 更改订单总记录
            g4Dao.update("updateOrdScheListNatureAmount", updateDto);
            // 更改生产通知单日记录
            g4Dao.update("updateProdordDayScheNatureAmount", updateDto);
            // 更改生产通知单总记录
            g4Dao.update("updateProdordScheListNatureAmount", updateDto);

            // 记录订单日记录更改表
            updateDto.put("ord_day_list_seq_no", seq_no);
            updateDto.put("opr_time", G4Utils.getCurrentTime());
            updateDto.put("opr_id", inDto.getAsString("opr_id"));
            updateDto.put("remark", inDto.getAsString("remark"));
            updateDto.put("state", "0");
            updateDto.put("status", "1");// 已处理
            g4Dao.insert("insertOrdDayUpdateList", updateDto);

            outDto.put("success", true);
            outDto.put("msg", "订单记录删除成功!");
        } else {// 其他
            // 记录订单日记录更改表
            Dto updateDto = new BaseDto();
            updateDto.put("ord_day_list_seq_no", inDto.getAsString("seq_no"));
            updateDto.put("before_amount", ordDayDto.getAsString("amount"));
            updateDto.put("before_nature", ordDayDto.getAsString("nature"));
            updateDto.put("after_amount", 0);
            updateDto.put("after_nature", ordDayDto.getAsString("nature"));
            updateDto.put("opr_time", G4Utils.getCurrentTime());
            updateDto.put("opr_id", inDto.getAsString("opr_id"));
            updateDto.put("remark", inDto.getAsString("remark"));
            updateDto.put("state", "0");
            updateDto.put("status", "0");
            g4Dao.insert("insertOrdDayUpdateList", updateDto);
            outDto.put("success", true);
            outDto.put("msg", "订单删除记录提交成功!");
        }
        return outDto;
    }

    public Dto bindUserAndCsn(Dto inDto) throws ApplicationException {
        Dto outDto = new BaseDto();

        // 验证csn是否已被绑定
        Dto userDto = (Dto) g4Dao.queryForObject("loadUserInfoByCsn", inDto);
        if (!G4Utils.isEmpty(userDto)) {
            outDto.put("success", false);
            outDto.put("msg", "卡号已被占用，请换一张卡片!");
        } else {
            g4Dao.insert("updateCsnByUserId", inDto);

            outDto.put("success", true);
            outDto.put("msg", "人员卡号绑定成功!");
        }
        return outDto;
    }

    /**
     * 回退业务
     */
    public Dto rollbackProdInfo(Dto inDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        try {
            // 添加数据
            List dbList = inDto.getDefaultAList();
            g4Dao.batchInsertBaseDto("insertOrdDayListByRecordManage", dbList);
            outDto.put("success", true);
            outDto.put("msg", "完成处理");
            return outDto;
        } catch (Exception e) {
            e.printStackTrace();
            outDto.put("success", false);
            outDto.put("msg", "数据不合规范");
            return outDto;
        }
    }
  
    
    /**
     * 删除订单流水信息（使用回退流程的删除）
     */
    public synchronized Dto rollbackDelete(Dto inDto) throws ApplicationException {
        String middleState = "7";   //流水删除操作的中间状态
        //查询待删除数据
        //如果为同步则修改状态，如果已同步则修改统计数据
        Dto outDto = new BaseDto();
        //修改征程的订单流水的状态为中间状态(以此流水为目标作为修改) -删除的中间状态 待数据处理后修改为原来的状态
        //采用中间状态的方式来避免多线程对流水数据的处理
        String seq_no = inDto.getAsString("seq_no");
        Dto dbDto = new BaseDto();
        dbDto.put("seq_no", seq_no);
        dbDto.put("state", middleState); //设置的中间状态
        dbDto.put("startstate", "0");   //设置的状态要为正常状态
        g4Dao.update("updateOrdDayListState4Chage", dbDto);
        String resultState = "1";   //状态值，如果处理过程中出现异常则判断修改状态的值
        try{
            dbDto = new BaseDto();
            dbDto.put("seq_no", seq_no);
            dbDto.put("state", middleState);
            Dto resultDto = (Dto)g4Dao.queryForObject("queryOrdDayList4Change", dbDto);
            Dto addDto = NatureNumberUtil.parseDataToAdd(resultDto);    //对原修改的数据进行正向处理
            addDto.put("state", "0");   //待更新的数据状态为正常
            addDto.put("status", "0");  //数据待更新状态
            //获取同步的信息
            String ord_status = resultDto.getAsString("ord_status");
            String prodord_status = resultDto.getAsString("prodord_status");
            
            if(!"0".equals(ord_status)){    //如果已经修改了 则改变订单统计信息
                // 更改订单日总记录
                g4Dao.update("updateOrdDayScheNatureAmount", resultDto);
                // 更改订单总记录
                g4Dao.update("updateOrdScheListNatureAmount", resultDto);
            }
            if(!"0".equals(prodord_status)){    //如果已经修改了则改变生产通知单的统计信息
             // 更改生产通知单日记录
                g4Dao.update("updateProdordDayScheNatureAmount", resultDto);
                // 更改生产通知单总记录
                g4Dao.update("updateProdordScheListNatureAmount", resultDto);
            }
            //增加删除的流水
            resultDto.put("before_amount", resultDto.getAsString("amount"));
            resultDto.put("before_nature", resultDto.getAsString("nature"));
            resultDto.put("ord_day_list_seq_no", seq_no);
            resultDto.put("opr_time", G4Utils.getCurrentTime());
            resultDto.put("state", "0");
            resultDto.put("status", "3");// 生产通知单的同步状态+订单的同步状态 删除操作
            g4Dao.insert("insertOrdDayUpdateList", resultDto);    //增加流水修改的流水信息
            outDto.put("success", true);
            outDto.put("msg", "流程数据修改成功");
        }catch(ApplicationException e){
            resultState = "0";  //设置状态的值为正常状态
            e.printStackTrace();
            throw e;
        }catch(Exception e){
            resultState = "0";  //设置状态的值为正常状态
            e.printStackTrace();
            outDto.put("success", false);
            outDto.put("msg", "流程数据修改失败");
        }finally{
          //恢复流水的状态 保证此状态能够恢复
            dbDto = new BaseDto();
            dbDto.put("seq_no", seq_no);
            dbDto.put("state", resultState);    //修改流水状态为删除 
            dbDto.put("startstate", middleState);
            g4Dao.update("updateOrdDayListState4Chage", dbDto);
        }
        return outDto;
    }

    public Dto unbindUserAndCsn(Dto inDto) throws ApplicationException {
        Dto outDto = new BaseDto();

        inDto.put("csn", "");
        g4Dao.insert("updateCsnByUserId", inDto);

        outDto.put("success", true);
        outDto.put("msg", "人员卡号解绑定成功!");
        return outDto;
    }
    
    /**
     * 获取当前流程的当前数据
     * @return
     * @throws ApplicationException
     * loadOrdBasInfoByRecordManage
     */
    private Dto getCurrentNatureNum(Dto inDto)throws ApplicationException{
        Dto outDto = new BaseDto();
        Dto dbDto = new BaseDto();
        String nature = inDto.getAsString("nature");
        String style_no = inDto.getAsString("style_no");
        String order_id = inDto.getAsString("order_id");
        StringBuffer rollbackNatures = new StringBuffer(25);
        Map<String,List<String>> rollback2subnum = NatureUtil.getNatureCode2actionNature4rollback();
        for(Entry entry : rollback2subnum.entrySet()){
            List<String> natures = (List<String>)entry.getValue();
            if(natures.contains(nature)){
                rollbackNatures.append(",'").append(entry.getKey()).append("'");
                continue;
            }
        }
        if(rollbackNatures.length()>0){
            rollbackNatures.deleteCharAt(0);
        }else { //没有退货流程的情况下设置无效状态值
            rollbackNatures.append("'##'");
        }
        dbDto.put("nature", rollbackNatures.toString());
        dbDto.put("style_no", style_no);
        dbDto.put("startnature", nature);
        dbDto.put("order_id", order_id);
        outDto = (Dto)g4Dao.queryForObject("getOrdAmountByNatureValide", dbDto);
        if(outDto == null){
            throw new ApplicationException("订单信息异常  不能找到订单");
        }
        outDto.put("finish_num", outDto.getAsString("resultamount"));
        return outDto;
    }

	/**
	 * 产品信息查询 已完成尺寸的数量（指令,开裁，领片，出货）
	 */
	public Dto queryProdInsInfo(Dto pDto) throws ApplicationException {
		Dto outDto = new BaseDto();
		Dto seqDto=(Dto)g4Dao.queryForObject("query4ProdOrdSeq", pDto);
		String prod_ord_seq=seqDto.getAsString("prod_ord_seq");
		pDto.put("prod_ord_seq", prod_ord_seq);
		List prodList = new ArrayList();
		List list = g4Dao.queryForList("queryProdBasInfo4ProNum", pDto);// 具体产品指令数信息
		List rowList = g4Dao.queryForList("queryProdBasInfo4Row", pDto);// 行信息

		//Dto qDto = new BaseDto();
		//qDto.put("id", pDto.getAsString("prod_ord_seq"));
		//qDto.put("state", "0");
		Dto columnDto = (Dto) g4Dao.queryForObject("queryProdSubInfo", pDto);// 列头信息
		String columnStr = columnDto.getAsString("value");
//重组行信息
		for (int i = 0; i < rowList.size(); i++) {
			Dto rowDto = (Dto) rowList.get(i);
			String color = rowDto.getAsString("color");
			String in_length = rowDto.getAsString("in_length");
			String country = rowDto.getAsString("country");
//加入腰围信息
			rowDto.put("num", columnStr);
			String[] columns = columnStr.split(",");
//遍历腰围加入数量信息
			for (String waist : columns) {
				Boolean flag = false;
			//解析prod_bas_info 汇总腰围对应的数量信息
				for (Object aList : list) {
					Dto dto = (Dto) aList;
					if (dto.getAsString("color").equals(color)
							&& dto.getAsString("in_length").equals(in_length)
							&& dto.getAsString("country").equals(country)
							&& dto.getAsString("waist").equals(waist)) {
						//拼接指令数信息
						if ("".equals(rowDto.getAsString("ins_num"))) {
							rowDto.put("ins_num", dto.getAsString("ins_num")
									+ ",");
							rowDto.put("real_cut_num", dto.getAsInteger("ins_num")-dto.getAsInteger("real_cut_num")
									+ ",");
							rowDto.put("drew_num", dto.getAsInteger("ins_num")-dto.getAsInteger("drew_num")
									+ ",");
							rowDto.put("product_num", dto.getAsInteger("ins_num")-dto.getAsInteger("product_num")
									+ ",");
						} else {
							rowDto.put("ins_num", rowDto.getAsString("ins_num")
									+ dto.getAsString("ins_num") + ",");
							rowDto.put("real_cut_num",rowDto.getAsString("real_cut_num")+( dto.getAsInteger("ins_num")-dto.getAsInteger("real_cut_num"))
									+ ",");
							rowDto.put("drew_num",rowDto.getAsString("drew_num")+( dto.getAsInteger("ins_num")-dto.getAsInteger("drew_num"))
									+ ",");
							rowDto.put("product_num",rowDto.getAsString("product_num")+( dto.getAsInteger("ins_num")-dto.getAsInteger("product_num"))
									+ ",");
						}
						
						flag = true;
						break;
					}
				}

				if (!flag) {
					rowDto.put("ins_num", rowDto.getAsString("ins_num") + ",");
					rowDto.put("real_cut_num", rowDto.getAsString("real_cut_num") + ",");
					rowDto.put("drew_num", rowDto.getAsString("drew_num") + ",");
					rowDto.put("product_num", rowDto.getAsString("product_num") + ",");
				}

			}
		}
		Integer totalCount = rowList.size();
		String jsonStrList = JsonHelper.encodeList2PageJson(rowList,
				totalCount, GlobalConstants.FORMAT_Date);
		outDto.put("jsonStrList", jsonStrList);
		return outDto;
	}
	@Override
	public Dto queryOrdSizeInfo(Dto pDto) throws ApplicationException {
		Dto outDto = new BaseDto();
		List ordSizeList=g4Dao.queryForList("querySizeListBySeqNo",pDto);
		List rowList = g4Dao.queryForList("queryOrdSizeInfo4Row", pDto);// 行信息
		List columnList =g4Dao.queryForList("queryOrdSizeSubInfo", pDto);// 列头信息
		
		//重组行信息
				for (int i = 0; i < rowList.size(); i++) {
					Dto rowDto = (Dto) rowList.get(i);
					String color = rowDto.getAsString("color");
					String in_length = rowDto.getAsString("in_length");
					String country = rowDto.getAsString("country");
		//遍历腰围加入数量信息
					StringBuffer waistsb= new StringBuffer();
					for (Object waistObj : columnList) {
						String waist=((Dto)waistObj).getAsString("waist");
						waistsb.append(waist+",");
						
						Boolean flag = false;
					//解析prod_bas_info 汇总腰围对应的数量信息
						for (Object aList : ordSizeList) {
							Dto dto = (Dto) aList;
							if (dto.getAsString("color").equals(color)
									&& dto.getAsString("in_length").equals(in_length)
									&& dto.getAsString("country").equals(country)
									&& dto.getAsString("waist").equals(waist)) {
								//拼接指令数信息
								if ("".equals(rowDto.getAsString("num"))) {
									rowDto.put("num", dto.getAsString("num")
											+ ",");
								} else {
									rowDto.put("num", rowDto.getAsString("num")
											+ dto.getAsString("num") + ",");
								}
								flag = true;
								break;
							}
						}

						if (!flag) {
							rowDto.put("num", rowDto.getAsString("num") + ",");
						}

					}
					rowDto.put("waist",waistsb.toString());
				}
				Integer totalCount = rowList.size();
				String jsonStrList = JsonHelper.encodeList2PageJson(rowList,
						totalCount, GlobalConstants.FORMAT_Date);
				outDto.put("jsonStrList", jsonStrList);
				return outDto;
	}
}
