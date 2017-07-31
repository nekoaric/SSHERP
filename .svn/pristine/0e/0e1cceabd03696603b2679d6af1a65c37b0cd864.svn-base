package com.cnnct.rfid.service.impl;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.json.JsonHelper;
import org.eredlab.g4.rif.report.excel.ExcelExporter;
import org.eredlab.g4.rif.report.fcf.Categorie;
import org.eredlab.g4.rif.report.fcf.CategoriesConfig;
import org.eredlab.g4.rif.report.fcf.DataSet;
import org.eredlab.g4.rif.report.fcf.FcfDataMapper;
import org.eredlab.g4.rif.report.fcf.GraphConfig;
import org.eredlab.g4.rif.report.fcf.Set;

import com.cnnct.common.ApplicationException;
import com.cnnct.rfid.service.OrdScheInfoService;
import com.cnnct.util.DataUtil;
import com.cnnct.util.G4Utils;
import com.cnnct.util.GlobalConstants;
import com.cnnct.util.NatureNumberUtil;
import com.cnnct.util.NatureUtil;

/**
 * *********************************************
 * 创建日期: 2013-05-12
 * 创建作者：may
 * 功能：订单进度查询
 * 最后修改时间：
 * 修改记录：
 * ***********************************************
 */
public class OrdScheInfoServiceImpl extends BaseServiceImpl implements OrdScheInfoService {

    public Dto getOrdScheList(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();

        List list = g4Dao.queryForPage("getOrdScheListByOrdSeq", pDto);
        Dto insDto = (Dto) g4Dao.queryForObject("getInsNumInfo4OrdSche", pDto);
        List list1 = new ArrayList();
        if (list.size() > 0) {
            for (int i = 0; i < list.size(); i++) {
                Dto a = (Dto) list.get(i);
                a.put("ins_num", insDto.getAsString("ins_num"));
                list1.add(a);
            }
            Integer pageCount = g4Dao.queryForPageCount("getOrdScheListByOrdSeq", pDto);
            outDto.put("jsonString", JsonHelper.encodeList2PageJson(list1, pageCount, ""));
        } else {
            Integer pageCount = g4Dao.queryForPageCount("getOrdScheListByOrdSeq", pDto);
            outDto.put("jsonString", JsonHelper.encodeList2PageJson(list1, pageCount, ""));
        }
        return outDto;
    }

    public Dto getOrdSchePerCent(Dto pDto) throws ApplicationException {
        // 关联查询的关键字
        String sqlField = "b.seq_no";
        
        
        String[] ordSeqNos = pDto.getAsString("ordseqnos").split(",");
        StringBuffer sb = new StringBuffer();
        List<String> seqList = new ArrayList<String>();
        for (String str : ordSeqNos) {
//            sb.append("'").append(str).append("',");
            seqList.add("'" + str + "'");
        }
//        if (ordSeqNos.length > 0) {
//            pDto.put("seqnos", sb.substring(0, sb.length() - 1));
//        }
        
        // 组合seqno 语句
        List<String> parseSeqList = new ArrayList<String>();    // 处理一批seqno条件
        StringBuffer beanParse = new StringBuffer(1000);
        int strLength = 0;
        for(String str : seqList){
            // 判断是否换行
            if(str.length() + strLength >= 1000){
                // 换行
                beanParse.deleteCharAt(0);
                parseSeqList.add(beanParse.toString());
                beanParse = new StringBuffer(1000);
                strLength = 0;
            }
            // 添加数据
            strLength += str.length();
            beanParse.append(",").append(str);
        }
        
        // 判断是否有保留数据
        if (beanParse.length() > 0) {
            beanParse.deleteCharAt(0);
            parseSeqList.add(beanParse.toString());
        }
        
        StringBuffer dynamicSql = new StringBuffer(1000);
        boolean isExists = false;
        for(String str : parseSeqList){
            if (isExists) {
                dynamicSql.append(" or ");
            }
            dynamicSql.append(sqlField).append(" in ").append(" ( ").append(str).append(" ) ");
            isExists = true;
        }
        
        String sqlStr = "( " + dynamicSql.toString() + " ) ";
        pDto.put("dynamicSql", sqlStr);
        
        Dto outDto = new BaseDto();

        String[] category_label_value = {"real_cut_num", "draw_num", "sew_num", "bach_accept_num",
                "bach_delivery_num", "pack_accept_num", "f_product_num", "b_product_num","receive_f_product",
                "receive_b_product","middle_take","sew_delivery_num","sendout_f_product","sendout_b_product"};
        //查询订单总进度详情：保留没有订单生产的产品
        List list = g4Dao.queryForPage("getOrdScheListByOrdSeq", pDto);
//        List list = getOrders4params(pDto);
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
        //将数据位null的设置为0
        for (int i = 0; i < list.size(); i++) {
            Dto dto = (Dto) list.get(i);
//            Dto insDto = (Dto) g4Dao.queryForObject("getInsNumInfo4OrdSche", dto);
            //判断ins_num,order_num是否为null：预防因为订单没有产品信息而产生的null值
            if(dto.getAsInteger("ins_num")==null){
            	dto.put("ins_num", 0);
            }
            if(dto.getAsInteger("order_num")==null){
            	dto.put("order_num", 0);
            }
          //计算product_delay出货延迟日期
          //1，缺少任一时间则不计算延迟日期
          //2.只计算延迟的时间，提前的不计算
            String fdate=dto.getAsString("fob_deal_date");
            String pdate=dto.getAsString("product_date");
            if(fdate!=null&&pdate!=null&&fdate.indexOf(" ")==-1&&pdate.indexOf(" ")==-1&&!"".equals(fdate)&&!"".equals(pdate)){
	            
	            long fromdate = dto.getAsDate("fob_deal_date").getTime();
	            long todate = dto.getAsDate("product_date").getTime();
	            if((todate - fromdate)>0){
	            	String product_delay=((todate - fromdate) / (1000 * 60 * 60 * 24))+"";
		            dto.put("product_delay", product_delay);
	            }else{
	            	dto.put("product_delay", "正常出货");
	            }
            }else{
            	dto.put("product_delay", "缺少时间");
            }
            //计算损耗超标
            String allow_loss_string = dto.getAsString("allow_loss_per")==null||dto.getAsString("allow_loss_per")==""?"0":dto.getAsString("allow_loss_per");
            int x=allow_loss_string.indexOf("：")==-1?0:allow_loss_string.indexOf("：")+1;
            int y=allow_loss_string.indexOf("%")==-1?allow_loss_string.length():allow_loss_string.indexOf("%");
            allow_loss_string=allow_loss_string.equals("0")?"0.00":allow_loss_string.substring(x,y);
            //allow_loss_string =allow_loss_string.equals("")?"":DataUtil.doubleRound(Double.parseDouble(allow_loss_string), 4)+"";
            //double allow_loss=dto.getAsDouble("allow_loss_per")==null?0:dto.getAsDouble("allow_loss_per");
            double allow_loss=DataUtil.doubleRound(Double.parseDouble(allow_loss_string),4);
            double loss_exceed=0;
            if (allow_loss>0) {
            	 loss_exceed=dto.getAsDouble("consume")-allow_loss;
			}
            
            dto.put("loss_exceed", loss_exceed);
            for (String key : category_label_value) {
                Integer v = dto.getAsInteger(key);
                if(v==null){
                	v=0;
                	dto.put(key,0);
                }
                Double value = 0.0;
                if(dto.getAsInteger("ins_num")!=0){
                	 value = DataUtil.doubleDiv(v * 100, dto.getAsInteger("ins_num"));
                }
                dto.put(key + "_percent", value.toString() + "%");
            }
        }
        //添加记录总条数不再查询数据库 
        Integer pageCount = g4Dao.queryForPageCount("getOrdScheListByOrdSeq", pDto);
        outDto.put("jsonString", JsonHelper.encodeList2PageJson(list, pageCount, ""));
        return outDto;
    }
    
    /**
     * 通过查询条件来查询订单总览的信息
     * @param inDto
     * @return
     */
    private List getOrders4params(Dto pDto){
        Dto outDto = new BaseDto();
        //如果不是我的订单移除 ismyorder数据
        String ismyorder = pDto.getAsString("ismyorder");
        if(!"yes".equals(ismyorder.trim())){
            pDto.remove("ismyorder");
        }
        // 处理多个工厂，多个客户信息 2014.12.17
        String grps = pDto.getAsString("belong_grps");
        String custs = pDto.getAsString("cust_ids");
        
        if(!G4Utils.isEmpty(grps)){
            grps = grps.replaceAll("'", "''");
            String[] grpArr = grps.split(",");
            StringBuffer sb = new StringBuffer();
            for(String str : grpArr){
                sb = sb.append(",'").append(str).append("'");
            }
            if(sb.length()>1){
                sb = sb.deleteCharAt(0);
            }
            pDto.put("belong_grps", sb.toString());
        }
        
        
        if(!G4Utils.isEmpty(custs)){
            custs = custs.replaceAll("'", "''");
            String[] custArr = custs.split(",");
            StringBuffer sb = new StringBuffer();
            for(String str : custArr){
                sb = sb.append(",'").append(str).append("'");
            }
            if(sb.length()>1){
                sb = sb.deleteCharAt(0);
            }
            pDto.put("cust_ids", sb.toString());
        }
        List resultList = g4Dao.queryForList("queryOrdScheListByParams", pDto);
        return resultList;
    }
    
    public Dto getOrdDaySche(Dto pDto) throws ApplicationException {
    	//目前情况是只有一条结果
        Dto outDto = new BaseDto();
        
        Dto insDto = (Dto) g4Dao.queryForObject("getInsNumInfo4OrdSche", pDto);
        List list = g4Dao.queryForPage("getOrdDayScheListByOrdSeq", pDto);
        List natureFac = g4Dao.queryForList("getNatureFacByOrderId",pDto);
        if (list.size() > 0 && insDto!=null) {
            for (int i = 0; i < list.size(); i++) {
                Dto a = (Dto) list.get(i);
                a.put("ins_num", insDto.getAsString("ins_num"));
                a.put("order_num", insDto.getAsString("order_num"));
            }
          //解析订单所处流程
          //只对一个dto添加数据
            Dto a = (Dto)list.get(0);
            if(natureFac.size()>0){
            	for(int i=0;i<natureFac.size();i++){
            		Dto nature2FacDto = (Dto)natureFac.get(i);
            		String nature = nature2FacDto.getAsString("nature");
            		String facName = nature2FacDto.getAsString("name");
            		String facCode = NatureUtil.parseNC2natureZh(nature);
            		String resultFac = a.getAsString(facName);
            		if(resultFac!=null && !"".equals(resultFac)){
            			resultFac+= facName;
            			a.put(facCode, resultFac);
            		}else {
            			resultFac = facName;
            			a.put(facCode, resultFac);
            		}
            	}
            }
        }
        Integer pageCount = g4Dao.queryForPageCount("getOrdDayScheListByOrdSeq", pDto);
        outDto.put("jsonString", JsonHelper.encodeList2PageJson(list, pageCount, ""));
        return outDto;
    }

    public Dto getOrdShortInfo(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();

        List list = new ArrayList();
        Integer pageCount = 0;
        if (pDto.getAsString("flag").equals("prod_ord_seq")) {
            list = g4Dao.queryForPage("getProdOrdScheList", pDto);
            pageCount = g4Dao.queryForPageCount("getProdOrdScheList", pDto);
        }
        if("yes".equals(pDto.getAsString("isFill"))){
        	list = NatureNumberUtil.fillData(list);
        }
        list = NatureNumberUtil.doShort4nature(list);
        outDto.put("jsonString", JsonHelper.encodeList2PageJson(list, pageCount, ""));
        return outDto;
    }

    /**
     * 获取订单进度信息
     *
     * @param pDto
     * @return
     * @throws ApplicationException
     */
    public Dto getOrdScheListView(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();

        if ("".equals(pDto.getAsString("ord_seq_no"))) {
            String str = FcfDataMapper.toFcfXmlData(new ArrayList(), new GraphConfig());
            outDto.put("xmlString", str);
            return outDto;
        }

        List list = g4Dao.queryForList("getOrdScheListByOrdSeq", pDto);
        if (list.size() == 0) {
            String str = FcfDataMapper.toFcfXmlData(new ArrayList(), new GraphConfig());
            outDto.put("xmlString", str);
            return outDto;
        }
        Dto dto = (Dto) list.get(0);

        String[] category_label = {"实裁数", "领片数", "下线数", "水洗收数", "水洗交数", "后整收数"
                , "交成品数", "交B品数"};
        String[] category_label_value = {"real_cut_num", "draw_num", "sew_num", "bach_accept_num",
                "bach_delivery_num", "pack_accept_num", "f_product_num", "b_product_num"};

        Dto insDto = (Dto) g4Dao.queryForObject("getInsNumInfo4OrdSche", pDto);
        pDto.put("order_id", pDto.getAsString("ord_seq_no"));
        Dto ordBasInfo = (Dto) g4Dao.queryForObject("queryOrdBasInfo", pDto);

        Integer ins_num = insDto.getAsInteger("ins_num");
        if (G4Utils.isEmpty(dto)) {
            dto = new BaseDto();
            for (String label : category_label_value) {
                dto.put(label, 0);//初始化0
            }
        }

        // 实例化一个图形配置对象
        GraphConfig graphConfig = new GraphConfig();
        // 主标题
        graphConfig.put("caption", pDto.getAsString("ord_seq_no") + "      订单日进度图");
        graphConfig.put("subcaption ", "指令数:" + insDto.getAsString("ins_num") + "      订单交货日期:"
                + ordBasInfo.getAsString("deli_date"));
        // X坐标轴名称
        graphConfig.setXAxisName("数量流程");
        // 数字值后缀
        graphConfig.setNumberSuffix("%25");
        // 使用这种方式可以加入框架没有封装的原生报表属性,原生属可以参考《eRedG4开发指南》的相关章节
        graphConfig.put("decimalPrecision", "0");
        graphConfig.put("formatNumberScale", "0");
        graphConfig.put("formatNumber", "0");
        graphConfig.put("animation", "0");
        graphConfig.put("yAxisMaxValue", "110");//y轴最大值
        //使用这种方式可以加入框架没有封装的原生报表属性,原生属可以参考《eRedG4开发指南》的相关章节
        //graphConfig.put("propertyName", "value");
        graphConfig.setCanvasBorderThickness(new Boolean(true));

        //查询原始数据
        List dataList = new ArrayList();
        //将原始数据对象转换为框架封装的Set报表数据对象
        for (int i = 0; i < category_label.length; i++) {
            String label = category_label[i];
            //实例化一个图表元数据对象
            Set set = new Set();
            set.setName(label); //名称
            Double percentValue = DataUtil.doubleDiv(dto.getAsInteger(category_label_value[i]) * 100, ins_num);
            set.setValue(percentValue.toString()); //数据值
//            set.setValue(dto.getAsString(category_label_value[i])); //数据值
            set.setColor(GlobalConstants.CHART_COLORS[i]); //柱状图颜色
            dataList.add(set);
        }

        // 将图表数据转为Flash能解析的XML资料格式
        String xmlString = FcfDataMapper.toFcfXmlData(dataList, graphConfig);
        outDto.put("xmlString", xmlString);
        return outDto;
    }

    /**
     * 获取订单进度信息
     *
     * @param pDto
     * @return
     * @throws ApplicationException
     */
    public Dto getOrdSchePerCentView(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();

        String[] ordSeqNos = pDto.getAsString("ordseqnos").split(",");
        StringBuffer sb = new StringBuffer();
        for (String str : ordSeqNos) {
            sb.append("'").append(str).append("',");
        }
        if (ordSeqNos.length > 0) {
            pDto.put("seqnos", sb.substring(0, sb.length() - 1));
        }
        String[] keys = pDto.getAsString("keywords").split(",");

        List list = g4Dao.queryForList("getOrdScheListByOrdSeq", pDto);

        Map<String, String> labelKeyValue = new HashMap<String, String>();
        labelKeyValue.put("bach_accept_num", "缝制完成数");
        labelKeyValue.put("pack_accept_num", "水洗完成数");
        labelKeyValue.put("f_product_num", "交成品完成数");
        // 实例化一个图形配置对象
        GraphConfig graphConfig = new GraphConfig();
        // 主标题
        graphConfig.setCaption("订单完成率图");
        // X坐标轴名称
        graphConfig.setXAxisName("订单");
        // 数字值前缀
        graphConfig.setNumberSuffix("%");
        // 使用这种方式可以加入框架没有封装的原生报表属性,原生属可以参考《eRedG4开发指南》的相关章节
        graphConfig.put("decimalPrecision", "0");
        graphConfig.put("labelDisplay", "WRAP");
        graphConfig.put("formatNumberScale", "0");
        graphConfig.put("formatNumber", "0");
        graphConfig.put("yAxisMaxValue", "110");//y轴最大值
        //使用这种方式可以加入框架没有封装的原生报表属性,原生属可以参考《eRedG4开发指南》的相关章节
        //graphConfig.put("propertyName", "value");
        graphConfig.setCanvasBorderThickness(new Boolean(true));

        // 组合图配置
        CategoriesConfig categoriesConfig = new CategoriesConfig();
        List cateList = new ArrayList();// 组合图中数据
        List dataList = new ArrayList();

        Map<String, DataSet> dataSetMap = new HashMap<String, DataSet>();
        for (int i = 0; i < keys.length; i++) {
            String key = keys[i];
            // 组合图中设置数据
            DataSet dataSet = new DataSet();
            dataSet.setSeriesname(labelKeyValue.get(key));
            dataSet.setColor(GlobalConstants.CHART_COLORS[i]); // 柱状图颜色
            List setList = new ArrayList();
            dataSet.setData(setList);
            dataSetMap.put(key, dataSet);
        }

        for (int i = 0; i < list.size(); i++) {
            Dto dto = (BaseDto) list.get(i);
            Dto insDto = (Dto) g4Dao.queryForObject("getInsNumInfo4OrdSche", dto);
            Categorie caregorie = new Categorie(dto.getAsString("ord_seq_no") + "    指令数:"
                    + insDto.getAsString("ins_num") + "    交货日期:" + insDto.getAsString("deli_date"));
//            Categorie caregorie = new Categorie(dto.getAsString("ord_seq_no"));
            cateList.add(caregorie);// 设置x轴名字

            for (String key : keys) {
                Set set = new Set();
                Double percentValue = DataUtil.doubleDiv(dto.getAsInteger(key) * 100,
                        insDto.getAsInteger("ins_num"));
                set.setValue(percentValue.toString()); //数据值
                List setList = dataSetMap.get(key).getData();
                setList.add(set);
            }
        }
        for (String key : keys) {
            dataList.add(dataSetMap.get(key));
        }

        categoriesConfig.setCategories(cateList);// 添加到组图中

        // 将图表数据转为Flash能解析的XML资料格式
        String xmlString = FcfDataMapper.toFcfXmlData(dataList, graphConfig,
                categoriesConfig);
        outDto.put("xmlString", xmlString);
        return outDto;
    }

    /**
     * 获取订单日进度图信息
     *
     * @param pDto
     * @return
     * @throws ApplicationException
     */
    public Dto getOrdDayScheView(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        List list = g4Dao.queryForList("getOrdDayScheListByOrdSeq", pDto);

        pDto.put("order_id", pDto.getAsString("ord_seq_no"));
        Dto ordBasInfo = (Dto) g4Dao.queryForObject("queryOrdBasInfo", pDto);
        Dto insDto = (Dto) g4Dao.queryForObject("getInsNumInfo4OrdSche", pDto);

        Map<String, Object> chart = new HashMap<String, Object>();
        chart.put("baseFontSize", "12");
        chart.put("caption", pDto.getAsString("ord_seq_no") + "      订单日进度图");
        chart.put("subcaption ", "指令数:" + insDto.getAsString("ins_num") + "      订单交货日期:"
                + ordBasInfo.getAsString("deli_date"));
        chart.put("shownames", "1");
        chart.put("labelDisplay", "AUTO");
        chart.put("showLabels", "1");
        chart.put("showvalues", "0");
        chart.put("numberPrefix", "");
        chart.put("showSum", "1");
        chart.put("decimals", "0");
        chart.put("useRoundEdges", "1");
        chart.put("formatNumberScale", "0");
        chart.put("legendBorderAlpha", "0");
        chart.put("formatNumber", "0");
        String[] category_label = {"实裁数", "领片数", "下线数", "水洗收数", "水洗交数", "后整收数"
                , "交成品数", "交B品数"};
        String[] category_label_value = {"real_cut_num", "draw_num", "sew_num", "bach_accept_num",
                "bach_delivery_num", "pack_accept_num", "f_product_num", "b_product_num"};
        List categories = new ArrayList();
        for (String label : category_label) {
            Map<String, String> category = new HashMap<String, String>();
            category.put("label", label);
            categories.add(category);
        }


        List datasets = new ArrayList();

        for (int i = 0; i < list.size(); i++) {
            Dto dto = (Dto) list.get(i);
            dto.put("ins_num", 0);

            Map<String, Object> dataset = new HashMap<String, Object>();
            dataset.put("seriesName", dto.getAsString("tr_date"));
            dataset.put("color", GlobalConstants.CHART_COLORS[i]);
            dataset.put("showValues", "0");

            List setList = new ArrayList();
            for (String value : category_label_value) {
                HashMap<String, String> set = new HashMap<String, String>();
                if ("0".equals(dto.getAsString(value))) {
                    set.put("value", "");
                } else {
                    set.put("value", dto.getAsString(value));
                }

                setList.add(set);
            }
            dataset.put("set", setList);
            datasets.add(dataset);
        }
        chart.put("categories", categories);
        chart.put("dataset", datasets);
        String xmlString = FcfDataMapper.toFcfStackedXmlData(chart);
        outDto.put("xmlString", xmlString);

        return outDto;
    }

    /**
     * 获取订单短缺信息
     *
     * @param pDto
     * @return
     * @throws ApplicationException
     */
    public Dto getOrdShortInfoView(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();

        String[] category_label = {"裁片短缺", "缝制短缺", "水洗收短缺", "水洗交短缺", "后整收短缺", "后整交短缺"};
        String[] category_label_value = {"draw_short_num", "sew_short_num", "bach_accept_short_num",
                "bach_delivery_short_num", "pack_accept_short_num", "product_short_num"};

        Dto dto = new BaseDto();
        if (pDto.getAsString("flag").equals("prod_ord_seq")) {
            if ("".equals(pDto.getAsString("prod_ord_seq"))) {
                String str = FcfDataMapper.toFcfXmlData(new ArrayList(), new GraphConfig());
                outDto.put("xmlString", str);
                return outDto;
            }
            dto = (Dto) g4Dao.queryForObject("getProdOrdScheList", pDto);
        } else if (pDto.getAsString("flag").equals("ord_seq_no")) {
            if ("".equals(pDto.getAsString("ord_seq_no"))) {
                String str = FcfDataMapper.toFcfXmlData(new ArrayList(), new GraphConfig());
                outDto.put("xmlString", str);
                return outDto;
            }
            dto = (Dto) g4Dao.queryForObject("getOrdScheListByOrdSeq", pDto);
        }

        if (G4Utils.isEmpty(dto)) {
            dto = new BaseDto();
            String[] inti_values = {"ins_num", "real_cut_num", "draw_num", "sew_num", "bach_accept_num",
                    "bach_delivery_num", "pack_accept_num", "f_product_num", "b_product_num"};
            for (String value : inti_values) {
                dto.put(value, 0);//初始化0
            }
        }
        //计算短缺情况
        //领片短缺 = 领片数-实裁数
        Double draw_short_num = DataUtil.doubleSub(dto.getAsDouble("draw_num"), dto.getAsDouble("real_cut_num"));
        //下线短缺 = 下线数-领片数
        Double sew_short_num = DataUtil.doubleSub(dto.getAsDouble("sew_num"), dto.getAsDouble("draw_num"));
        //水洗收短缺 = 水洗收数-下线数
        Double bach_accept_short_num = DataUtil.doubleSub(dto.getAsDouble("bach_accept_num"),
                dto.getAsDouble("sew_num"));
        //水洗交短缺 = 水洗交数-水洗收数
        Double bach_delivery_short_num = DataUtil.doubleSub(dto.getAsDouble("bach_delivery_num"),
                dto.getAsDouble("bach_accept_num"));
        //后整少收 = 后整收-水洗收数
        Double pack_accept_short_num = DataUtil.doubleSub(dto.getAsDouble("pack_accept_num"),
                dto.getAsDouble("bach_delivery_num"));
        //后整短缺 = 交成品+交b品-后整收(成品短缺)
        Double product_short_num = DataUtil.doubleSub(
                DataUtil.doubleAdd(dto.getAsDouble("f_product_num"), dto.getAsDouble("b_product_num")),
                dto.getAsDouble("pack_accept_num"));
        dto.put("draw_short_num", draw_short_num);
        dto.put("sew_short_num", sew_short_num);
        dto.put("bach_accept_short_num", bach_accept_short_num);
        dto.put("bach_delivery_short_num", bach_delivery_short_num);
        dto.put("pack_accept_short_num", pack_accept_short_num);
        dto.put("product_short_num", product_short_num);

        // 实例化一个图形配置对象
        GraphConfig graphConfig = new GraphConfig();
        // 主标题

        graphConfig.setCaption(dto.getAsString("prod_ord_seq") + "生产通知单短缺图");
        graphConfig.setSubcaption("所属订单:" + dto.getAsString("ord_seq_no"));
        // X坐标轴名称
        graphConfig.setXAxisName("数量流程");
        // 数字值前缀
        graphConfig.setNumberPrefix("");
        // 使用这种方式可以加入框架没有封装的原生报表属性,原生属可以参考《eRedG4开发指南》的相关章节
        graphConfig.put("decimalPrecision", "0");
        graphConfig.put("formatNumberScale", "0");
        graphConfig.put("formatNumber", "0");
        graphConfig.put("animation", "0");
        //使用这种方式可以加入框架没有封装的原生报表属性,原生属可以参考《eRedG4开发指南》的相关章节
        //graphConfig.put("propertyName", "value");
        graphConfig.setCanvasBorderThickness(new Boolean(true));

        //查询原始数据
        List dataList = new ArrayList();
        //将原始数据对象转换为框架封装的Set报表数据对象
        for (int i = 0; i < category_label.length; i++) {
            String label = category_label[i];
            //实例化一个图表元数据对象
            Set set = new Set();
            set.setName(label); //名称
            set.setValue(dto.getAsString(category_label_value[i])); //数据值
            set.setColor(GlobalConstants.CHART_COLORS[i]); //柱状图颜色
            dataList.add(set);
        }

        // 将图表数据转为Flash能解析的XML资料格式
        String xmlString = FcfDataMapper.toFcfXmlData(dataList, graphConfig);
        outDto.put("xmlString", xmlString);
        return outDto;
    }

    public Dto getDetailShortInfo(Dto pDto) {
        Dto outDto = new BaseDto();
        //添加  zhouww 2013-9-6  
        //查询订单下的完单号 
        if("queryProdOrd".equals(pDto.get("flag"))){
        	List prods = g4Dao.queryForList("queryProdOrds",pDto);
        	 String jsonString = JsonHelper.encodeList2PageJson(prods,prods.size(), "");
             outDto.put("jsonString", jsonString);
             return outDto;
        }
        //~ 添加结束
        
        //列头信息由js生成
        //数据组成
        //一个产品的各个流程短缺信息  -> 一个流程的各个产品的短缺信息
        //其中列信息 包含nature,国家,颜色,内长,第几个腰围短缺的数量

        //获取各个产品的短缺信息
        List shortList = g4Dao.queryForPage("getProdScheListByProdOrdSeq", pDto);
        
        if("yes".equals(pDto.getAsString("isFill"))){
        	shortList = NatureNumberUtil.fillData(shortList);
        }
        String columnValue = "";
        Dto columnKeyValue = new BaseDto();

        shortList = NatureNumberUtil.doShort4nature(shortList);
        if(shortList.size()>0){
        	columnValue = ((Dto)shortList.get(0)).getAsString("value");
        }
        String[] columns = columnValue.split(",");
        for (int i = 0; i < columns.length; i++) {
            columnKeyValue.put(columns[i], (i + 1));
        }

        String[] short_nature_key = {"draw_short_num", "sew_short_num","sew_delivery_short", "bach_accept_short_num",
                "bach_delivery_short_num", "pack_accept_short_num", "product_short_num","receive_f_product_short",
                "receive_b_product_short","sendout_f_short","sendout_b_short"};
        String[] short_nature_value = {"裁片短缺", "缝制短缺","缝制交短缺", "水洗收短缺", "水洗交短缺", "后整收短缺", "后整交短缺",
        			"收成品短缺","收B品短缺","成品短缺","B品短缺"};
        //根据产品的短缺信息生成产品的各个流程的短缺信息
        List<Dto> detailShortList = new ArrayList<Dto>();
        for (Integer i = 0; i < short_nature_key.length; i++) {
            String nature = short_nature_key[i];
            for (Object o : shortList) {
                Dto shortDto = (Dto) o;

                Dto dto = new BaseDto();
                dto.put("nature_value", short_nature_value[i]);
                dto.put("nature", nature);
                dto.put("color", shortDto.getAsString("color"));
                dto.put("country", shortDto.getAsString("country"));
                dto.put("in_length", shortDto.getAsString("in_length"));
                dto.put("waist", shortDto.getAsString("waist"));
                dto.put("product_id", shortDto.getAsString("product_id"));
                dto.put("style_no", shortDto.getAsString("style_no"));

                String shortNum = shortDto.getAsString(nature);//某个产品某个流程短缺数量

                if (!shortNum.equals("")) {
                    System.out.println("product_id:"+dto.getAsString("product_id"));
                }
                dto.put("short_num", shortNum);

                detailShortList.add(dto);
            }
        }
        //更新各个产品各个流程的短缺信息组合成需要展示的行信息
        List<Dto> rowList = new ArrayList<Dto>();
        for (Dto detailShortDto : detailShortList) {
            Boolean eqFlag = false;
            for (Dto rowDto : rowList) {
                //如果行信息中有对应的信息.设置行中其他腰围的短缺数量
                if (detailShortDto.getAsString("nature").equals(rowDto.getAsString("nature"))
                        && detailShortDto.getAsString("color").equals(rowDto.getAsString("color"))
                        && detailShortDto.getAsString("country").equals(rowDto.getAsString("country"))
                        && detailShortDto.getAsString("in_length").equals(rowDto.getAsString("in_length"))) {
                    eqFlag = true;
                    String waist = detailShortDto.getAsString("waist");

                    if (!"".equals(detailShortDto.getAsString("short_num"))) {
                        rowDto.put("waist" + columnKeyValue.getAsString(waist), detailShortDto.getAsString("short_num"));
                    }
                }
            }

            if (!eqFlag) {//当前信息还没有对应的行信息时,新建一行
                //设置key名称为 waist+腰围 值为当前的腰围的短缺数
                String waist = detailShortDto.getAsString("waist");
                if (!"".equals(detailShortDto.getAsString("short_num"))) {
                    detailShortDto.put("waist" + columnKeyValue.getAsString(waist), detailShortDto.getAsString("short_num"));
                }
                String nature = detailShortDto.getAsString("nature");
                if(!"".equals(nature)){
                	detailShortDto.put("shortFac", NatureUtil.parseShortEn2shortZh(nature));
                }
                rowList.add(detailShortDto);
            }

        }

        //过滤行记录中为空的
        for (int i = 0; i < rowList.size(); i++) {
            Dto rowDto = (Dto) rowList.get(i);
            boolean flag = false;
            Iterator it = rowDto.keySet().iterator();
            while (it.hasNext()) {
                String key = (String) it.next();
                if (!"waist".equals(key) && key.contains("waist")) {
                	String val = rowDto.getAsString(key);
                    if (val !=null && !"".equals(val) && !"0".equals(val)) {
                        flag = true;
                        break;
                    }
                }
            }	

            if (!flag) {
                rowList.remove(i);
                i--;
            }
        }

        String jsonString = JsonHelper.encodeList2PageJson(rowList, rowList.size(), "");

        outDto.put("jsonString", jsonString);
        return outDto;
    }

    /**
     * 订单日进度信息
     */
    public Dto getOrdDayScheMulti(Dto pDto) throws ApplicationException {
        String sqlField = "b.seq_no";
        Dto outDto = new BaseDto();
        String[] seqs = pDto.getAsString("ordseqnos").split(",");
        pDto.remove("ordseqnos");
        StringBuffer sb = new StringBuffer(20);
        List<String> seqList = new ArrayList<String>();
        for (String str : seqs) {
            seqList.add("'" + str + "'");
        }
        // 组合seqno 语句
        List<String> parseSeqList = new ArrayList<String>();    // 处理一批seqno条件
        StringBuffer beanParse = new StringBuffer(1000);
        int strLength = 0;
        for(String str : seqList){
            // 判断是否换行
            if(str.length() + strLength >= 1000){
                // 换行
                beanParse.deleteCharAt(0);
                parseSeqList.add(beanParse.toString());
                beanParse = new StringBuffer(1000);
                strLength = 0;
            }
            // 添加数据
            strLength += str.length();
            beanParse.append(",").append(str);
        }
        
        // 判断是否有保留数据
        if (beanParse.length() > 0) {
            beanParse.deleteCharAt(0);
            parseSeqList.add(beanParse.toString());
        }
        
        StringBuffer dynamicSql = new StringBuffer(1000);
        boolean isExists = false;
        for(String str : parseSeqList){
            if (isExists) {
                dynamicSql.append(" or ");
            }
            dynamicSql.append(sqlField).append(" in ").append(" ( ").append(str).append(" ) ");
            isExists = true;
        }
        
        String sqlStr = "( " + dynamicSql.toString() + " ) ";
        pDto.put("dynamicSql", sqlStr);
        
        List insList = g4Dao.queryForList("getInsNumInfoMultiOrd", pDto);
        List list = g4Dao.queryForList("getOrdDayScheListByMultiOrdSeq", pDto);
        List list1 = new ArrayList();
        if (list.size() > 0) {
            for (int i = 0; i < list.size(); i++) {
                Dto aDto = (Dto) list.get(i);
                for (int k = 0; k < insList.size(); k++) {
                    Dto insDto = (Dto) insList.get(k);
                    if (insDto.getAsString("ord_seq_no").equals(
                            aDto.getAsString("ord_seq_no"))) {
                    	aDto.put("style_no", insDto.getAsString("style_no"));
                        aDto.put("ins_num", insDto.getAsString("ins_num"));
                        aDto.put("order_num", insDto.getAsString("order_num"));
                        break;
                    }
                }
                list1.add(aDto);
            }
        }
        Integer pageCount = list1.size();

        outDto.put("jsonString", JsonHelper.encodeList2PageJson(list1,
                pageCount, ""));
        return outDto;
    }

    /**
     * 导出--查询多订单日进度表
     */
    public Dto prodDayScheExceport(Dto pDto) throws ApplicationException {
        Dto outDto = new BaseDto();
        List insList = g4Dao.queryForList("getInsNumInfoMultiOrd", pDto);
        List list = g4Dao.queryForList("getOrdDayScheListByMultiOrdSeq", pDto);
        List ordInfoList = g4Dao.queryForPage("getOrdScheListByMultiOrdSeq",
                pDto);
        List prodDayList = new ArrayList();
        if (list.size() > 0) {
            for (int i = 0; i < list.size(); i++) {
                Dto aDto = (Dto) list.get(i);
                for (int k = 0; k < insList.size(); k++) {
                    Dto insDto = (Dto) insList.get(k);
                    if (insDto.getAsString("ord_seq_no").equals(
                            aDto.getAsString("ord_seq_no"))) {
                        aDto.put("ins_num", insDto.getAsString("ins_num"));
                        aDto.put("order_num", insDto.getAsString("order_num"));
                        break;
                    }
                }
                prodDayList.add(aDto);
            }
        }
        //添加总计信息
        Dto ordInfoDto = new BaseDto();
        ordInfoDto.put("ord_seq_no", "汇总信息");
        ordInfoDto.put("tr_date", "订单号:");
        ordInfoDto.put("ins_num", 0);
        ordInfoDto.put("order_num", 0);
        ordInfoDto.put("real_cut_num", 0);
        ordInfoDto.put("draw_num", 0);
        ordInfoDto.put("sew_num", 0);
        ordInfoDto.put("bach_accept_num", 0);
        ordInfoDto.put("bach_delivery_num", 0);
        ordInfoDto.put("pack_accept_num", 0);
        ordInfoDto.put("f_product_num", 0);
        ordInfoDto.put("b_product_num", 0);
        for (Object obj : ordInfoList) {
            Dto d = (Dto) obj;
            for (Object insObj : insList) {
                Dto insDto = (Dto) insObj;
                if (d.getAsString("ord_seq_no").equals(insDto.getAsString("ord_seq_no"))) {
                    d.put("order_num", insDto.getAsInteger("order_num"));
                    d.put("ins_num", insDto.getAsInteger("ins_num"));
                }
            }

        }
        for (Object obj : ordInfoList) {
            Dto d = (Dto) obj;
            ordInfoDto.put("tr_date", ordInfoDto.getAsString("tr_date") + d.getAsString("ord_seq_no") + ",");
            ordInfoDto.put("ins_num", ordInfoDto.getAsInteger("ins_num") + d.getAsInteger("ins_num"));
            ordInfoDto.put("order_num", ordInfoDto.getAsInteger("order_num") + d.getAsInteger("order_num"));
            ordInfoDto.put("real_cut_num", (d.getAsInteger("real_cut_num"))
                    + (ordInfoDto.getAsInteger("real_cut_num")));
            ordInfoDto.put("draw_num", (d.getAsInteger("draw_num"))
                    + (ordInfoDto.getAsInteger("draw_num")));
            ordInfoDto.put("sew_num", (d.getAsInteger("sew_num"))
                    + (ordInfoDto.getAsInteger("sew_num")));
            ordInfoDto.put("bach_accept_num", (d
                    .getAsInteger("bach_accept_num"))
                    + (ordInfoDto.getAsInteger("bach_accept_num")));
            ordInfoDto.put("bach_delivery_num", (d
                    .getAsInteger("bach_delivery_num"))
                    + (ordInfoDto.getAsInteger("bach_delivery_num")));
            ordInfoDto.put("pack_accept_num", (d
                    .getAsInteger("pack_accept_num"))
                    + (ordInfoDto.getAsInteger("pack_accept_num")));
            ordInfoDto.put("f_product_num", (d.getAsInteger("f_product_num"))
                    + (ordInfoDto.getAsInteger("f_product_num")));
            ordInfoDto.put("b_product_num", (d.getAsInteger("b_product_num"))
                    + (ordInfoDto.getAsInteger("b_product_num")));
        }
        prodDayList.add(ordInfoDto);
        outDto.put("prodDayList", prodDayList);
        return outDto;
    }
    /**
     * epc绑定产品短缺信息
     */
    public Dto getProdShortInfo(Dto pDto) throws ApplicationException {

        Dto outDto = new BaseDto();

        List list = new ArrayList();
        Integer pageCount = 0;
        if (pDto.getAsString("flag").equals("prod_ord_seq")) {
            list = g4Dao.queryForPage("getProdShortInfo", pDto);
            pageCount = g4Dao.queryForPageCount("getProdShortInfo", pDto);
        }
        if("yes".equals(pDto.getAsString("isFill"))){
        	list = NatureNumberUtil.fillData(list);
        }
        list = NatureNumberUtil.doShort4nature(list);
        
        for (Object o : list) {
            Dto dto = (Dto) o;
            Dto paramDto = new BaseDto();
            paramDto.put("ord_seq_no", dto.getAsString("order_id"));
            List natureFac = g4Dao.queryForList("getNatureFacByOrderId",paramDto);
            //流程位置
            if(natureFac.size()>0){
            	for(int i=0;i<natureFac.size();i++){
            		Dto nature2FacDto = (Dto)natureFac.get(i);
            		String nature = nature2FacDto.getAsString("nature");
            		String facName = nature2FacDto.getAsString("name");
            		String facCode = NatureUtil.getShortFac(nature);
            		String resultFac = dto.getAsString(facName);
            		if(resultFac!=null && !"".equals(resultFac)){
            			resultFac+= facName;
            			dto.put(facCode, resultFac);
            		}else {
            			resultFac = facName;
            			dto.put(facCode, resultFac);
            		}
            	}
            }
        }
        outDto.put("jsonString", JsonHelper.encodeList2PageJson(list, pageCount, ""));
        return outDto;
    
	}
    
    /**
	 * 导出短缺详情
	 */
	public Dto exportOrdShortInfo(Dto inDto) throws ApplicationException {
		try{
			HttpServletRequest request = (HttpServletRequest)inDto.get("request");
			HttpServletResponse response = (HttpServletResponse)inDto.get("response");
			Dto parametersDto = new BaseDto();
			parametersDto.put("reportTitle", "订单短缺表"); // parameter
	        List list = g4Dao.queryForPage("getOrdScheListByOrdSeq", inDto);
	        if("yes".equals(request.getParameter("isFill"))){
	        	list = NatureNumberUtil.fillData(list);
	        }
	        list = NatureNumberUtil.doShort4nature(list);
	        String fobDate = "";
            if(list.size()>0){
            	fobDate = ((Dto)list.get(0)).getAsString("fob_deal_date");
            	if(fobDate.length()>10){
            		fobDate = fobDate.substring(0,10);
            	}
            }
            fobDate = "FOB "+fobDate+" ";
            parametersDto.put("reportTitle", fobDate+parametersDto.getAsString("reportTitle"));
	        ExcelExporter excelExporter = new ExcelExporter();
	        excelExporter.setTemplatePath("/report/excel/ordShortInfo.xls");
	        excelExporter.setData(parametersDto, list);
	        String currentDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
	        excelExporter.setFilename("  订单短缺表" +currentDate+ ".xls");
	        excelExporter.export(request, response);
		}catch(Exception e){
			ApplicationException ae = new ApplicationException();
			ae.initCause(e);
			throw ae;
		}
        return null;
	}
	
    /**
     * 数字变为Long类型
     */
	public List string2Long(List list){
		String[] str = new String[]{"order_num","ins_num","real_cut_num","draw_short_num","sew_short_num","sew_delivery_short",
									"bach_accept_short_num","bach_delivery_short_num","pack_accept_short_num","product_short_num",
									"receive_f_product_short","receive_b_product_short"};
		for(Object obj : list){
			Dto dto = (Dto)obj;
			for(String name : str){
				dto.put(name,dto.getAsLong(name));
			}
		}
		return list;
	}
    
    /**
     * 获取工厂<br/>
     * 传入superFactory的父工厂名字
     * @param pDto
     * @return
     * @throws ApplicationException
     */
	public Dto getFactoryBySuperFacotry(Dto pDto) throws ApplicationException {
		Dto outDto = new BaseDto();
		List<Dto> resultDtos = new ArrayList<Dto>();
		List factorys = g4Dao.queryForList("queryFactoryBySuperFactory",pDto);
		//处理数据
		for(Object obj : factorys){
			Dto dto = (Dto)obj;
			Dto resultDto = new BaseDto();
			resultDto.put("value", dto.getAsString("text"));
			resultDto.put("text", dto.getAsString("text"));
			resultDtos.add(resultDto);
		}
		outDto.setDefaultAList(resultDtos);
		return outDto;
	}

}

