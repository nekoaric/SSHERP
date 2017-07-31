package org.eredlab.g4.arm.util.idgenerator;

import com.cnnct.util.G4Utils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.eredlab.g4.bmf.base.IDao;
import org.eredlab.g4.bmf.util.SpringBeanLoader;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.id.SequenceStorer;
import org.eredlab.g4.ccl.id.fomater.DefaultSequenceFormater;
import org.eredlab.g4.ccl.id.generator.DefaultIDGenerator;
import org.eredlab.g4.ccl.id.sequence.DefaultSequenceGenerator;
import com.cnnct.util.GlobalConstants;

import com.cnnct.common.ApplicationException;

/**
 * ID生成器
 * @author XiongChun
 * @since 2009-07-13
 */
public class IdGenerator {
	private static Log log = LogFactory.getLog(IdGenerator.class);
	private static int catche = 1;
	private static IDao g4Dao = (IDao)SpringBeanLoader.getSpringBean("g4Dao");
	
	/**
	 * 字段名称
	 */
	private String fieldname;
	
	public IdGenerator(String pFieldName){
		setFieldname(pFieldName);
	}
	
	public IdGenerator(){
	}
	
	/**
	 * 获取ID生成器实例
	 * @return DefaultIDGenerator
	 */
	public DefaultIDGenerator getDefaultIDGenerator(){
		Dto dto = new BaseDto();
		dto.put("fieldname", getFieldname());
		dto = (BaseDto)g4Dao.queryForObject("getEaSequenceByFieldName", dto);
		DefaultIDGenerator idGenerator = new DefaultIDGenerator(); 
		DefaultSequenceFormater sequenceFormater = new DefaultSequenceFormater(); 
		sequenceFormater.setPattern(dto.getAsString("pattern"));
		DefaultSequenceGenerator sequenceGenerator = new DefaultSequenceGenerator(getFieldname());
		SequenceStorer sequenceStorer = new DBSequenceStorer();
		sequenceGenerator.setSequenceStorer(sequenceStorer);
		sequenceGenerator.setCache(catche);
		idGenerator.setSequenceFormater(sequenceFormater);
		idGenerator.setSequenceGenerator(sequenceGenerator);
		return idGenerator;
	}
	
    /**
     * 菜单编号ID生成器(自定义)
     * @param pParentid 菜单编号的参考编号
     * @return
     */
	public static String getMenuIdGenerator(String pParentid){
		String maxSubMenuId = (String)g4Dao.queryForObject("getMaxSubMenuId", pParentid);
		String menuId = null;
		if(G4Utils.isEmpty(maxSubMenuId)){
			menuId = "01";
		}else{
			int length = maxSubMenuId.length();
			String temp = maxSubMenuId.substring(length-2, length);
			int intMenuId = Integer.valueOf(temp).intValue() + 1;
			if(intMenuId > 0 && intMenuId < 10){
				menuId = "0" + String.valueOf(intMenuId);
			}else if(10 <= intMenuId && intMenuId <= 99){
				menuId = String.valueOf(intMenuId);
			}else if(intMenuId > 99){
				log.error(GlobalConstants.Exception_Head + "生成菜单编号越界了.同级兄弟节点编号为[01-99]\n请和您的系统管理员联系!");
			}else{
				log.error(GlobalConstants.Exception_Head + "生成菜单编号发生未知错误,请和开发人员联系!");
			}
		}
		return pParentid + menuId;
	}
	
	
    /**
     * 编号ID生成器(自定义) 地区
     * @param pParentid 菜单编号的参考编号
     * @return
     */
    public static String getAreaIdGenerator(String pParentid){
        String maxSubMenuId = (String)g4Dao.queryForObject("getMaxSubAreaId", pParentid);
        String menuId = null;
        if(pParentid.length()==8){//街道 4位
            if(G4Utils.isEmpty(maxSubMenuId)){
                menuId = "0001";
            }else{ 
                int length = maxSubMenuId.length();
                String temp = maxSubMenuId.substring(length-4, length);
                int intMenuId = Integer.valueOf(temp).intValue() + 1;
                if(intMenuId > 0 && intMenuId < 10){
                    menuId = "000" + String.valueOf(intMenuId);
                }else if(10 <= intMenuId && intMenuId <= 99){
                    menuId = "00"+String.valueOf(intMenuId);
                }else if(100 <= intMenuId && intMenuId <= 999){
                    menuId = "0"+String.valueOf(intMenuId);
                }else if(1000 <= intMenuId && intMenuId <= 9999){
                    menuId = String.valueOf(intMenuId);
                }else if(intMenuId > 9999){
                    log.error(GlobalConstants.Exception_Head + "生成菜单编号越界了.同级兄弟节点编号为[0001-9999]\n请和您的系统管理员联系!");
                }else{
                    log.error(GlobalConstants.Exception_Head + "生成菜单编号发生未知错误,请和开发人员联系!");
                }
            }
        }else{
        
        if(G4Utils.isEmpty(maxSubMenuId)){
            menuId = "01";
        }else{     
            int length = maxSubMenuId.length();
            String temp = maxSubMenuId.substring(length-2, length);
            int intMenuId = Integer.valueOf(temp).intValue() + 1;
            if(intMenuId > 0 && intMenuId < 10){
                menuId = "0" + String.valueOf(intMenuId);
            }else if(10 <= intMenuId && intMenuId <= 99){
                menuId = String.valueOf(intMenuId);
            }else if(intMenuId > 99){
                log.error(GlobalConstants.Exception_Head + "生成菜单编号越界了.同级兄弟节点编号为[01-99]\n请和您的系统管理员联系!");
            }else{
                log.error(GlobalConstants.Exception_Head + "生成菜单编号发生未知错误,请和开发人员联系!");
            }  
        }
        }
        return pParentid + menuId;
    }
	
    /**
     * 部门编号ID生成器(自定义)
     * @param pParentid 菜单编号的参考编号
     * @return
     */
	public static String getDeptIdGenerator(String pParentid) throws ApplicationException{
	    String maxSubDeptId = null,deptid = null;
	    try {
	        maxSubDeptId=(String)g4Dao.queryForObject("getMaxSubDeptId", pParentid);
	        if(G4Utils.isEmpty(maxSubDeptId)){ // 当前父部门id所对应的子部门不存在
	            deptid = "00001";
	        }else{ // 已存在父部门id所对应的子部门
	            /**
	             * 部门ID
	             * 第一级长度为3；001
	             * 第二级为8；001/00001
	             * 第三级为13；001/00001/00001
	             * 第四级为18；001/00001/00001/00001
	             * ……
	             * 部门id长度 = 父部门id长度 + 5
	             * 新生成部门id =  父部门id + (Integer.valueOf(子部门id.substring(父id长度)) + 1)
	             * 
	             * 需要自增的是 子id中截取父id对应长度后余下的部分，如父id为001，子id为00100002,则新生成的子id为 00002 + 1 = 00003
	             */
                String temp = maxSubDeptId.substring(pParentid.length());
	            int intDeptId = Integer.valueOf(temp).intValue() + 1;
	            if(intDeptId > 0 && intDeptId < 10){
	                deptid = "0000" + String.valueOf(intDeptId);
	            }else if(10 <= intDeptId && intDeptId <= 99){
	                deptid = "000" + String.valueOf(intDeptId);
	            }else if (100 <= intDeptId && intDeptId <= 999) {
	                deptid = "00" + String.valueOf(intDeptId);
	            }else if(1000 <= intDeptId && intDeptId <= 9999){
	                deptid = "0" + String.valueOf(intDeptId);
	                //log.error(GlobalConstants.Exception_Head + "生成部门编号越界了.同级兄弟节点编号为[001-999]\n请和您的系统管理员联系!");
	            }else if(intDeptId > 9999){
	                log.error(GlobalConstants.Exception_Head + "生成部门编号越界了.同级兄弟节点编号为[00001-09999]\n请和您的系统管理员联系!");
                    throw new ApplicationException(GlobalConstants.Exception_Head + "生成部门编号越界了.同级兄弟节点编号为[00001-09999]\n请和您的系统管理员联系!");
	            }else{
	                log.error(GlobalConstants.Exception_Head + "生成部门编号发生未知错误,请和开发人员联系!");
                    throw new ApplicationException(GlobalConstants.Exception_Head + "生成部门编号发生未知错误,请和开发人员联系!");
	            }
	        }
        } catch (Exception e) {
            throw new ApplicationException(e);
        }
        return pParentid + deptid;
	}

    /**
     * 门禁编号ID生成器(自定义)
     * @param pDto
     * @return
     */
	public static String getAegAreaNoGenerator(Dto pDto) throws ApplicationException{
	    String maxSubAreaId = null,areaid = null;
	    String pParentid = pDto.getAsString("top_area_no");
	    try {
	    	maxSubAreaId=(String)g4Dao.queryForObject("getMaxAgeSubAreaId", pDto);
	        if(G4Utils.isEmpty(maxSubAreaId)){ // 当前父部门id所对应的子部门不存在
	        	areaid = "001";
	        }else{ // 已存在父部门id所对应的子部门
                String temp = maxSubAreaId.substring(pParentid.length());
	            int intDeptId = Integer.valueOf(temp).intValue() + 1;
	            if(intDeptId > 0 && intDeptId < 10){
	            	areaid = "00" + String.valueOf(intDeptId);
	            }else if(10 <= intDeptId && intDeptId <= 99){
	            	areaid = "0" + String.valueOf(intDeptId);
	            }else if (100 <= intDeptId && intDeptId <= 999) {
	            	areaid = String.valueOf(intDeptId);
	            }else if(intDeptId > 999){
	                log.error(GlobalConstants.Exception_Head + "生成区域编号越界了.同级兄弟节点编号为[001-999]\n请和您的系统管理员联系!");
                    throw new ApplicationException(GlobalConstants.Exception_Head + "生成区域编号越界了.同级兄弟节点编号为[001-999]\n请和您的系统管理员联系!");
	            }else{
	                log.error(GlobalConstants.Exception_Head + "生成区域编号发生未知错误,请和开发人员联系!");
                    throw new ApplicationException(GlobalConstants.Exception_Head + "生成区域编号发生未知错误,请和开发人员联系!");
	            }
	        }
        } catch (Exception e) {
            throw new ApplicationException(e);
        }
        return pParentid + areaid;
	}
	
	public String getFieldname() {
		return fieldname;
	}
	public void setFieldname(String fieldname) {
		this.fieldname = fieldname;
	}
}
