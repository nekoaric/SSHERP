package com.cnnct.api.cs.service;

import com.cnnct.sys.vo.UserInfoVo;
import org.eredlab.g4.bmf.base.BaseService;
import org.eredlab.g4.ccl.datastructure.Dto;

public interface CSService extends BaseService {

    /**
     * 获取用户信息
     * @param pDto
     * @return
     */
    public Dto getUserInfo(Dto pDto);

    /**
     * 获取登录的用户信息
     * @param pDto
     * @return
     */
    public UserInfoVo getLoginUserInfo(Dto pDto);

    /**
     * 获取订单基础信息
     * @param pDto
     * @return
     */
    public Dto getOrdBasInfo(Dto pDto);

    /**
     * 获取订单数量信息
     * @param pDto
     * @return
     */
    public Dto getOrdBasNumInfo(Dto pDto);

    /**
     * 获取生成通知单信息
     * @param pDto
     * @return
     */
    public Dto getProdOrdInfo(Dto pDto);

    /**
     * 获取产品信息
     * @param pDto
     * @return
     */
    public Dto getProdBasInfo(Dto pDto);

    /**
     * 绑定商品信息
     * @param pDto
     * @return
     */
    public Dto bindProdBasInfo(Dto pDto);
    /**
     * 批量绑定产品
     * @param pDto
     * @return
     */
    public Dto bindBatchProdBasInfo(Dto pDto);
    /**
     * 商品信息解绑
     * @param pDto
     * @return
     */
    public Dto removeBindProdBasInfo(Dto pDto);
    /**
     * 批量商品信息解绑
     * @param pDto
     * @return
     */
    public Dto removeBind4Batch(Dto pDto);
    /**
     * 查询产品信息<br/>
     * 根据epc信息
     * @param pDto
     * @return
     */
    public Dto queryProd4Epc(Dto pDto);
    
    /**
     * 产品回退操作
     * @param pDto
     * @return
     */
    public Dto rollBack4Prodord(Dto pDto);
}
