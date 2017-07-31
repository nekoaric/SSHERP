package org.eredlab.g4.ccl.json;

import java.util.ArrayList;
import java.util.List;

import com.alibaba.fastjson.JSON;
import com.cnnct.util.G4Utils;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;

/**
 * Json处理器<br>
 * 
 * @author XiongChun
 * @since 2009-07-07
 */
public class JsonHelper {

	private static Log log = LogFactory.getLog(JsonHelper.class);

	/**
	 * 将不含日期时间格式的Java对象系列化为Json资料格式
	 * 
	 * @param pObject
	 *            传入的Java对象
	 * @return
	 */
	public static final String encodeObject2Json(Object pObject) {
		String jsonString = JSON.toJSONString(pObject);

		if (log.isInfoEnabled()) {
			log.info("序列化后的JSON资料输出:\n" + jsonString);
		}
		return jsonString;
	}

	/**
	 * 将含有日期时间格式的Java对象系列化为Json资料格式<br>
	 * 
	 * @param pObject  传入的Java对象
     * @param pFormatString  日期转换的格式
     *
	 * @return
	 */
	public static final String encodeObject2Json(Object pObject, String pFormatString) {

        String jsonString =JSON.toJSONStringWithDateFormat(pObject,pFormatString);

		if (log.isInfoEnabled()) {
			log.info("序列化后的JSON资料输出:\n" + jsonString);
		}
		return jsonString;
	}

	/**
	 * 将分页信息压入JSON字符串
	 * 
	 * @param JSON字符串
	 * @param totalCount
	 * @return 返回合并后的字符串
	 */
	public static String encodeJson2PageJson(String jsonString, Integer totalCount) {
		jsonString = "{TOTALCOUNT:" + totalCount + ", ROOT:" + jsonString + "}";
		if (log.isInfoEnabled()) {
			log.info("合并后的JSON资料输出:\n" + jsonString);
		}
		return jsonString;
	}

	/**
	 * 直接将List转为分页所需要的Json资料格式
	 * 
	 * @param list
	 *            需要编码的List对象
	 * @param totalCount
	 *            记录总数
	 * @param pDataFormat
	 *            时间日期格式化,传null则表明List不包含日期时间属性
	 */
	public static final String encodeList2PageJson(List list, Integer totalCount, String dataFormat) {
		String subJsonString = encodeObject2Json(list,dataFormat);
		String jsonString = "{TOTALCOUNT:" + totalCount + ", ROOT:" + subJsonString + "}";
		return jsonString;
	}

	/**
	 * 将数据系列化为表单数据填充所需的Json格式
	 * 
	 * @param pObject
	 *            待系列化的对象
	 * @param pFormatString
	 *            日期时间格式化,如果为null则认为没有日期时间型字段
	 * @return
	 */
	public static String encodeDto2FormLoadJson(Dto pDto, String pFormatString) {
		String sunJsonString = encodeObject2Json(pDto, pFormatString);

        String jsonString = "{success:"
				+ (G4Utils.isEmpty(pDto.getAsString("success")) ? "true" : pDto.getAsString("success")) + ",data:"
				+ sunJsonString + "}";
		if (log.isInfoEnabled()) {
			log.info("序列化后的JSON资料输出:\n" + jsonString);
		}
		return jsonString;
	}

	/**
	 * 将单一Json对象解析为DTOJava对象
	 * 
	 * @param jsonString
	 *            简单的Json对象
	 * @return dto
	 */
	public static Dto parseSingleJson2Dto(String jsonString) {
		Dto dto = new BaseDto();
		if (G4Utils.isEmpty(jsonString)) {
			return dto;
		}
        dto = JSON.parseObject(jsonString,BaseDto.class);
		return dto;
	}

	/**
	 * 将复杂Json资料格式转换为List对象
	 * 
	 * @param jsonString
	 *            复杂Json对象,格式必须符合如下契约<br>
	 *            [{"name":"托尼.贾","age":"27"},{"name":"甄子丹","age":"72"}]
	 * @return List
	 */
	public static List parseJson2List(String jsonString) {
        List list = new ArrayList();
        if (G4Utils.isEmpty(jsonString)) {
            return list;
        }
		list = JSON.parseArray(jsonString,BaseDto.class);
		return list;
	}
}
