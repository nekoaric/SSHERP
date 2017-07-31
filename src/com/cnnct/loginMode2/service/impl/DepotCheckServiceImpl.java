/****************************************************************************
 * Project Name:JDURFID
 * File Name:DepotCheckServiceImpl.java
 * Package Name:com.cnnct.loginMode2.service.impl
 * Date:2015-11-13
 * Copyright (c) 2015, http://www.jdunited.com All Rights Reserved.
 *
 *************************************************************************/
package com.cnnct.loginMode2.service.impl;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;

import com.cnnct.loginMode2.service.depotCheckService;
import com.cnnct.util.G4Utils;

/**
 * 这里用一句话描述这个类的作用
 * @className: DepotCheckServiceImpl 
 * @author xutj
 * @date 2015-11-13 
 */
public class DepotCheckServiceImpl extends BaseServiceImpl  implements depotCheckService {

	/**
	 * 这里用一句话描述这个方法的作用
	 * @author xutj 
	 * @date 2015-11-13
	 */
	public void insertDepotSche(Dto dto) {
		dto.put("tr_date", G4Utils.getCurDate());
		dto.put("state", "1");
		g4Dao.insert("insertDepotCheckList", dto);
	}

	/**
	 * 这里用一句话描述这个方法的作用
	 * @author xutj 
	 * @date 2015-11-13
	 */
	@Override
	public void deleteDepotSche() {
		// TODO Auto-generated method stub

	}

	/**
	 * 这里用一句话描述这个方法的作用
	 * @author xutj 
	 * @date 2015-11-13
	 * @return
	 */
	@Override
	public Dto queryAllList4Report() {
		// TODO Auto-generated method stub
		return null;
	}

}
