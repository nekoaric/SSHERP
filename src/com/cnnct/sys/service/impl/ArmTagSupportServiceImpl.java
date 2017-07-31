package com.cnnct.sys.service.impl;

import java.util.ArrayList;
import java.util.List;

import com.cnnct.util.ArmConstants;
import com.cnnct.util.G4Utils;
import com.cnnct.sys.service.ArmTagSupportService;
import com.cnnct.sys.web.tag.vo.MenuVo;
import org.eredlab.g4.bmf.base.BaseServiceImpl;
import org.eredlab.g4.ccl.datastructure.Dto;
import org.eredlab.g4.ccl.datastructure.impl.BaseDto;
import org.eredlab.g4.ccl.properties.PropertiesFactory;
import org.eredlab.g4.ccl.properties.PropertiesFile;
import org.eredlab.g4.ccl.properties.PropertiesHelper;

/**
 * 权限模型标签业务实现类
 * @author XiongChun
 * @since 2010-05-13
 */
@SuppressWarnings("unchecked")
public class ArmTagSupportServiceImpl extends BaseServiceImpl implements ArmTagSupportService {


	/**
	 * 获取卡片
	 * 
	 * @param pDto
	 * @return
	 */
	public Dto getCardList(Dto pDto) {
		Dto outDto = new BaseDto();
        pDto.put("isroot",true);//查询menuid长度为4菜单信息
		List resultList = g4Dao.queryForList("getCardMenuTreeList", pDto);
		outDto.setDefaultAList(resultList);
		return outDto;
	}


	/**
	 * 获取卡片子树
	 * 
	 * @param pDto
	 * @return
	 */
	public Dto getCardTreeList(Dto pDto) {
		Dto outDto = new BaseDto();
		List resultList = g4Dao.queryForList("getCardMenuTreeList", pDto);

        //删除根节点
		for (int i = 0; i < resultList.size(); i++) {
			MenuVo menuVo = (MenuVo) resultList.get(i);
			if (menuVo.getMenuid().equals(ArmConstants.ROORID_MENU)) {
				resultList.remove(i);
			}
		}
		outDto.setDefaultAList(resultList);
		return outDto;
	}

    /**
     * 获取菜单列表(桌面布局)
     *
     * @param pDto
     * @return
     */
    public Dto getMenuList4Desktop(Dto pDto) {
        Dto outDto = new BaseDto();
        List resultList = new ArrayList();

        List menuList = g4Dao.queryForList("getAllMenuList4Desktop",pDto);
        menuList = doProcessList(menuList);

        Dto parentDto = new BaseDto();
        for(Object o :menuList){
            MenuVo m = (MenuVo)o;
            String parentId = m.getParentid();
            Object parentObj = parentDto.get(parentId);

            if("1".equals(m.getLeaf())){
                resultList.add(m);
            }

            if(parentObj==null){
                List l = new ArrayList();
                l.add(m);
                parentDto.put(parentId, l);
            }else{
                List l = (List)parentObj;
                l.add(m);
            }
        }

        Dto d = getChildList(parentDto,"01");
        List menuTreeList = (List)d.get("01");

        outDto.setDefaultAList(resultList);
        outDto.setDefaultBList(menuTreeList);
        return outDto;
    }

    /**
     * 加工桌面布局菜单
     * 更改默认图表,窗口大小等
     * @param resultList
     * @return
     */
    private List doProcessList(List resultList){
        PropertiesHelper g4PHelper = PropertiesFactory.getPropertiesHelper(PropertiesFile.G4);
        String defaultShortcut = g4PHelper.getValue("desktopShortcut", "grid.png");
        for (int i = 0; i < resultList.size(); i++) {
            MenuVo vo = (MenuVo)resultList.get(i);
            vo.setMaxed("false");
            if (G4Utils.isEmpty(vo.getShortcut())) {
                vo.setShortcut(defaultShortcut);
            }
            if (vo.getMenuname() != null && vo.getMenuname().length() > 10) {
                vo.setMenuname(vo.getMenuname().substring(0, 10));
            }
            if (G4Utils.isEmpty(vo.getScrollbar()) || vo.getScrollbar().equals("0")) {
                vo.setScrollbar("no");
            }else {
                vo.setScrollbar("yes");
            }
            if (G4Utils.isEmpty(vo.getWidth()) || vo.getWidth() == 0) {
                vo.setWidth(800);
                vo.setMaxed("true");
            }
            if (G4Utils.isEmpty(vo.getHeight()) || vo.getHeight() == 0) {
                vo.setHeight(600);
                vo.setMaxed("true");
            }
        }
        return resultList;
    }

    private Dto getChildList(Dto parentDto,String rootId){
        Object o = parentDto.get(rootId);
        if(o !=null){//当前根节点rootId下有部门列表
            List l = (List)o;
            for(int i=0;i<l.size();i++){
                MenuVo menu = (MenuVo)l.get(i);
                String id = menu.getMenuid();

                Dto parentDto_update = getChildList(parentDto, id);//所有的子部门信息
                if(parentDto_update!=null){//节点下有子列表
                    menu.setItems((List) parentDto_update.get(id));
                }
            }
        }else{
            return null;
        }
        return  parentDto;//返回修改过根节点信息的parentDto
    }

}
