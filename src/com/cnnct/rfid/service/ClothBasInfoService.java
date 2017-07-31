package com.cnnct.rfid.service;

import org.eredlab.g4.ccl.datastructure.Dto;

import com.cnnct.common.ApplicationException;
/************************************************
 * 创建日期: 2013-05-07 09:38:00
 * 创建作者：唐芳海
 * 功能：服装信息管理
 * 最后修改时间：
 * 修改记录：
*************************************************/
public interface ClothBasInfoService {
    /***
     * 查询服装信息
     * 
     * @param pDto
     * @return
     */
    public Dto queryClothBasInfo(Dto pDto) throws ApplicationException;

    /***
     * 保存服装信息
     * 
     * @param pDto
     * @return
     */
    public Dto insertClothBasInfo(Dto pDto) throws ApplicationException;

    /***
     * 删除服装信息
     * 
     * @param pDto
     * @return
     */

    public Dto deleteClothBasInfo(Dto pDto) throws ApplicationException;

    /***
     * 修改服装信息
     * 
     * @param pDto
     * @return
     */
    public Dto updateClothBasInfo(Dto pDto) throws ApplicationException;
}
