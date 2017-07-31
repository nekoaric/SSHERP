package org.eredlab.g4.rif.report.fcf;

import java.util.*;

import javax.servlet.http.HttpServletRequest;

import com.cnnct.util.GlobalConstants;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.rif.web.BaseAction;

/**
 * FlashReport数据包装类
 * 
 * @author XiongChun
 * @since 2010-10-13
 * @see BaseAction
 */
public class FcfDataMapper {
	private static Log log = LogFactory.getLog(FcfDataMapper.class);
	
	/**
	 * 简单图数据包装
	 * @param pList 数据集合
	 * @param configDto 配置对象
	 * @return String
	 */
    public static final String toFcfXmlData(List pList, GraphConfig pGraphConfig){
		Document document = DocumentHelper.createDocument();
		document.setXMLEncoding("utf-8");
		Element elRoot = document.addElement("chart");
		Iterator configIterator = pGraphConfig.entrySet().iterator();
		while (configIterator.hasNext()) {
			Dto.Entry entry = (Dto.Entry)configIterator.next();
			elRoot.addAttribute((String)entry.getKey(), String.valueOf(entry.getValue()));
		}
		for(int i = 0; i < pList.size(); i++){
			Element elRow = elRoot.addElement("set");
			Set set = (Set)pList.get(i);
			Iterator it = set.entrySet().iterator();
			while(it.hasNext()){
				Dto.Entry entry = (Dto.Entry)it.next();
				elRow.addAttribute((String)entry.getKey(), String.valueOf(entry.getValue()));
			}
		}
		String outXml = document.getRootElement().asXML().replaceAll("\n", "");
		return outXml;
    }
    
    /**
     * 将简单图数据对象压入request
	 * @param pList 数据集合
	 * @param configDto 配置对象
     * @param request
     
    public static final void setReportData2Request(List pList, GraphConfig pGraphConfig, HttpServletRequest request){
    	
    }
    */
    
    /**
     * 组合图数据包装
     * @param pList
     * @param configDto
     * @param pCategoriesConfig
     * @return
     */
    public static final String toFcfXmlData(List pList, GraphConfig pGraphConfig, CategoriesConfig pCategoriesConfig){
		Document document = DocumentHelper.createDocument();
		document.setXMLEncoding("GB2312");
		Element elRoot = document.addElement("chart");
		Iterator configIterator = pGraphConfig.entrySet().iterator();
		while (configIterator.hasNext()) {
			Dto.Entry entry = (Dto.Entry)configIterator.next();
			elRoot.addAttribute((String)entry.getKey(), String.valueOf(entry.getValue()));
		}
		Element elcategories = elRoot.addElement("categories");
		Iterator categoriesIterator = pCategoriesConfig.entrySet().iterator();
		while (categoriesIterator.hasNext()) {
			Dto.Entry entry = (Dto.Entry)categoriesIterator.next();
			elcategories.addAttribute((String)entry.getKey(), String.valueOf(entry.getValue()));
		}
		for (int k = 0; k < pCategoriesConfig.getCategories().size(); k++) {
			Element elcategorie = elcategories.addElement("category");
			Categorie categorie = (Categorie)pCategoriesConfig.getCategories().get(k);
			Iterator categorieIterator = categorie.entrySet().iterator();
			while(categorieIterator.hasNext()){
				Dto.Entry entry = (Dto.Entry)categorieIterator.next();
				elcategorie.addAttribute((String)entry.getKey(), String.valueOf(entry.getValue()));
			}
		}
		for(int i = 0; i < pList.size(); i++){
			Element elRow = elRoot.addElement("dataset");
			DataSet ds = (DataSet)pList.get(i);
			Iterator it = ds.entrySet().iterator();
			while(it.hasNext()){
				Dto.Entry entry = (Dto.Entry)it.next();
				elRow.addAttribute((String)entry.getKey(), String.valueOf(entry.getValue()));
			}
			for (int j = 0; j < ds.getData().size(); j++) {
				Element elSet = elRow.addElement("set");
				Set set = (Set)ds.getData().get(j);
				Iterator setIterator = set.entrySet().iterator();
				while(setIterator.hasNext()){
					Dto.Entry entry = (Dto.Entry)setIterator.next();
					elSet.addAttribute((String)entry.getKey(), String.valueOf(entry.getValue()));
				}
			}
		}
		String outXml = document.getRootElement().asXML().replaceAll("\n", "");
		return outXml;
    }

    /**
     * 堆积图数据包装
     * @param pList
     * @param configDto
     * @param pCategoriesConfig
     * @return
     */
    public static final String toFcfStackedXmlData(Map chart){
        Document document = DocumentHelper.createDocument();
        document.setXMLEncoding("GB2312");
        Element elRoot = document.addElement("chart");

        Iterator chartIterator = chart.keySet().iterator();
        while (chartIterator.hasNext()) {
            String key = (String)chartIterator.next();
            Object value = chart.get(key);
            if(value instanceof  String)
                elRoot.addAttribute(key, (String)value);
        }

        Element elCategories = elRoot.addElement("categories");
        List categories = (List)chart.get("categories");
        for(Object o :categories){
            Map map = (Map)o;
            Element elCategory = elCategories.addElement("category");
            elCategory.addAttribute("label",map.get("label").toString());
        }
        List dataset = (List)chart.get("dataset");
        for(Object object :dataset){
            Map map = (Map)object;
            Element elDataset = elRoot.addElement("dataset");
            Iterator itertor = map.keySet().iterator();
            while (itertor.hasNext()) {
                String dataset_key = (String)itertor.next();
                Object dataset_value = map.get(dataset_key);
                if(dataset_value instanceof String){
                    elDataset.addAttribute(dataset_key, (String)dataset_value);
                }else{
                    if("set".equals(dataset_key)){
                        List setList = (List)map.get(dataset_key);
                        for(Object o:setList){
                            Map m = (Map)o;
                            Element elSet = elDataset.addElement(dataset_key);
                            elSet.addAttribute("value",m.get("value").toString());
                        }
                    }
                }
            }
        }

        String outXml = document.asXML().replaceAll("\n", "");
        return outXml;
    }

    public static void main(String[] args){
        Dto dto1 = new BaseDto();
        dto1.put("tr_date","2013-05-10");
        dto1.put("ins_num","1100");
        dto1.put("real_cut_num","800");
        dto1.put("draw_num","800");
        dto1.put("sew_num","800");
        dto1.put("bach_accept_num","800");
        dto1.put("bach_delivery_num","800");
        dto1.put("pack_accept_num","800");
        dto1.put("f_product_num","800");
        dto1.put("b_product_num","800");
        Dto dto2 = new BaseDto();
        dto2.put("tr_date","2013-05-10");
        dto2.put("ins_num","1100");
        dto2.put("real_cut_num","800");
        dto2.put("draw_num","800");
        dto2.put("sew_num","800");
        dto2.put("bach_accept_num","800");
        dto2.put("bach_delivery_num","800");
        dto2.put("pack_accept_num","800");
        dto2.put("f_product_num","800");
        dto2.put("b_product_num","800");
        List list = new ArrayList();
        list.add(dto1);
        list.add(dto2);

        Map<String,Object> chart = new HashMap<String,Object>();
        chart.put("caption","订单日进度图");
        chart.put("shownames","1");chart.put("showvalues","0");
        chart.put("numberPrefix","");chart.put("showSum","1");
        chart.put("decimals","0");chart.put("useRoundEdges","1");
        String[] category_label={"指令数","实裁数","领片数","下线数","水洗收数","水洗交数","后整收数"
                ,"交成品数","交B品数"};
        String[] category_label_value={"ins_num","real_cut_num","draw_num","sew_num","bach_accept_num",
                "bach_delivery_num","pack_accept_num","f_product_num","b_product_num"};
        List categories = new ArrayList();
        for(String label:category_label){
            Map<String,String> category = new HashMap<String,String>();
            category.put("label",label);
            categories.add(category);
        }


        List datasets = new ArrayList();

        for (int i=0;i<list.size();i++){
            Dto dto = (Dto)list.get(i);
            Map<String,Object> dataset = new HashMap<String, Object>();
            dataset.put("seriesName",dto.getAsString("tr_date"));
            dataset.put("color", GlobalConstants.CHART_COLORS[i]);
            dataset.put("showValues","0");
            List setList = new ArrayList();
            for(String value :category_label_value){
                HashMap<String,String> set = new HashMap<String,String>();
                set.put("value",dto.getAsString(value));
                setList.add(set);
            }
            dataset.put("set",setList);
            datasets.add(dataset);
        }
        chart.put("categories",categories);
        chart.put("dataset",datasets);

        System.out.println(toFcfStackedXmlData(chart));
    }
}
