package com.cnnct.rfid.service.impl;

import com.cnnct.common.ApplicationException;
import com.cnnct.rfid.service.DeptScheInfoService;
import com.cnnct.util.DataUtil;
import com.cnnct.util.G4Utils;
import com.cnnct.util.GlobalConstants;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.report.fcf.*;

import java.util.ArrayList;
import java.util.List;

/**
 * *********************************************
 * 创建日期: 2013-05-13
 * 创建作者：may
 * 功能：部门进度
 * 最后修改时间：
 * 修改记录：
 * ***********************************************
 */
public class DeptScheInfoServiceImpl extends BaseServiceImpl implements DeptScheInfoService {

    /**
     * 部门进度图
     * @param pDto
     * @return
     * @throws ApplicationException
     */
    public Dto getDeptScheInfoView(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        List list = g4Dao.queryForList("getDeptScheInfo",pDto);

        String title_name ="";
        if(list.size()>0){
            Dto dto = (Dto)list.get(0);
            String dept_name = dto.getAsString("dept_name");
            String order_name = dto.getAsString("ord");
            title_name = dept_name+"部门订单进度图";
        }

        // 实例化一个图形配置对象
        GraphConfig graphConfig = new GraphConfig();
        // 主标题
        graphConfig.setCaption(title_name);
        // X坐标轴名称
        graphConfig.setXAxisName("订单");
        // 数字值前缀
        graphConfig.setNumberPrefix("");
        // 使用这种方式可以加入框架没有封装的原生报表属性,原生属可以参考《eRedG4开发指南》的相关章节
        graphConfig.put("decimalPrecision", "0");
        graphConfig.put("formatNumberScale", "0");
        graphConfig.put("formatNumber", "0");
        //使用这种方式可以加入框架没有封装的原生报表属性,原生属可以参考《eRedG4开发指南》的相关章节
        //graphConfig.put("propertyName", "value");
        graphConfig.setCanvasBorderThickness(new Boolean(true));

        // 组合图配置
        CategoriesConfig categoriesConfig = new CategoriesConfig();
        List cateList = new ArrayList();// 组合图中数据
        List dataList = new ArrayList();

        // 组合图中设置数据
        DataSet dataSet1 = new DataSet();
        dataSet1.setSeriesname("已完成");
        dataSet1.setColor("FDC12E"); // 柱状图颜色
        List aList = new ArrayList();

        DataSet dataSet2 = new DataSet();
        dataSet2.setSeriesname("总数");
        dataSet2.setColor("56B9F9"); // 柱状图颜色
        // 将原始数据对象转换为框架封装的Set报表数据对象
        List bList = new ArrayList();
        for (int i = 0; i < list.size(); i++) {
            Dto dto = (BaseDto) list.get(i);
            Categorie caregorie = new Categorie(dto.getAsString("ord_seq_no"));
            cateList.add(caregorie);// 设置x轴名字
            Set set1 = new Set();
            set1.setValue(dto.getAsString("complete_num"));
            aList.add(set1);

            Set set2 = new Set();
            set2.setValue(dto.getAsString("total_num"));
            bList.add(set2);
        }

        dataSet1.setData(aList);
        dataList.add(dataSet1);

        dataSet2.setData(bList);
        dataList.add(dataSet2);

        categoriesConfig.setCategories(cateList);// 添加到组图中

        // 将图表数据转为Flash能解析的XML资料格式
        String xmlString = FcfDataMapper.toFcfXmlData(dataList, graphConfig,
                categoriesConfig);
        outDto.put("xmlString",xmlString);
        return outDto;
    }

    /**
     * 部门日进度图
     * @param pDto
     * @return
     * @throws ApplicationException
     */
    public Dto getDeptDayScheView(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        List list = g4Dao.queryForList("getDeptDayScheInfo",pDto);

        String title_name ="";
        if(list.size()>0){
            Dto dto = (Dto)list.get(0);
            String dept_name = dto.getAsString("dept_name");
            String order_name = dto.getAsString("order_name");
            title_name = dept_name+"部门"+order_name+"订单日进度图";
        }
        // 实例化一个图形配置对象
        GraphConfig graphConfig = new GraphConfig();
        // 主标题
        graphConfig.setCaption(title_name);
        // X坐标轴名称
        graphConfig.setXAxisName("日期");
        // 数字值前缀
        graphConfig.setNumberPrefix("");
        // 使用这种方式可以加入框架没有封装的原生报表属性,原生属可以参考《eRedG4开发指南》的相关章节
        graphConfig.put("decimalPrecision", "0");
        graphConfig.put("formatNumberScale", "0");
        graphConfig.put("formatNumber", "0");
        //使用这种方式可以加入框架没有封装的原生报表属性,原生属可以参考《eRedG4开发指南》的相关章节
        //graphConfig.put("propertyName", "value");
        graphConfig.setCanvasBorderThickness(new Boolean(true));

        //查询原始数据
        List dataList = new ArrayList();
        Double total_num =0.0;
        //将原始数据对象转换为框架封装的Set报表数据对象
        for (int i = 0; i < list.size(); i++) {
            Dto dto = (Dto)list.get(i);
            //实例化一个图表元数据对象
            Set set = new Set();
            total_num = DataUtil.doubleAdd(total_num,dto.getAsDouble("total_num"));
            set.setName(dto.getAsString("tr_date")); //名称
            set.setValue(dto.getAsString("complete_num")); //数据值
            set.setColor(GlobalConstants.CHART_COLORS[i]); //柱状图颜色
            dataList.add(set);
        }
        if(list.size()!=0){
            Dto dto = (Dto)list.get(0);
            Set set = new Set();
            set.setName("总数"); //名称
            set.setValue(total_num.toString()); //数据值
            set.setColor(GlobalConstants.CHART_COLORS[list.size()]); //柱状图颜色
            dataList.add(set);
        }

        // 将图表数据转为Flash能解析的XML资料格式
        String xmlString = FcfDataMapper.toFcfXmlData(dataList, graphConfig);
        outDto.put("xmlString",xmlString);
        return outDto;
    }

    /**
     * 获取部门进度信息
     * @param pDto
     * @return
     * @throws ApplicationException
     */
    public Dto getDeptScheInfo(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();

        List list = g4Dao.queryForPage("getDeptScheInfo",pDto);
        Integer pageCount = g4Dao.queryForPageCount("getDeptScheInfo", pDto);

        outDto.put("jsonString",JsonHelper.encodeList2PageJson(list,pageCount,""));

        return outDto;
    }

    /**
     * 获取部门日进度信息
     * @param pDto
     * @return
     * @throws ApplicationException
     */
    public Dto getDeptDaySche(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
      
        List list = g4Dao.queryForPage("getDeptDayScheInfo",pDto);
        Integer pageCount = g4Dao.queryForPageCount("getDeptDayScheInfo", pDto);

        outDto.put("jsonString",JsonHelper.encodeList2PageJson(list,pageCount,""));

        return outDto;
    }

    public Dto getOrdBasInfoByDeptId(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        if(pDto.getAsString("startdate")==""){
        	pDto.put("startdate", "1950-03-04T00:00:00");
        }
        if(pDto.getAsString("enddate")==""){
        	pDto.put("enddate", G4Utils.getCurDate());
        }
        List list = g4Dao.queryForPage("getOrdBasInfoByDeptId",pDto);
        Integer pageCount = g4Dao.queryForPageCount("getOrdBasInfoByDeptId", pDto);

        outDto.put("jsonString",JsonHelper.encodeList2PageJson(list,pageCount,""));

        return outDto;
    }
}
