package com.cnnct.rfid.service;

import org.eredlab.g4.ccl.datastructure.Dto;

import com.cnnct.common.ApplicationException;

public interface OrdBasInfoService {
	
	/**
	 * 查询订单信息
	 * @param inDto
	 * @return
	 * @throws ApplicationException
	 */
	public Dto queryOrdBasInfo(Dto inDto) throws ApplicationException;
	
	/**
	 * 增加订单信息
	 * @param inDto
	 * @return
	 * @throws ApplicationException
	 */
	public Dto addOrdBasDef(Dto inDto) throws ApplicationException;
	
	/**
	 * 修改订单信息
	 * @param inDto
	 * @return
	 * @throws ApplicationException
	 */
	public Dto updateOrdBasInfo(Dto inDto) throws ApplicationException;
	
	/**
	 * 删除订单信息
	 * @param inDto
	 * @return
	 * @throws ApplicationException
	 */
	public Dto deleteOrdBasInfo(Dto inDto) throws ApplicationException;
	
}
