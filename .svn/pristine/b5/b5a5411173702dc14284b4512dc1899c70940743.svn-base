/**
 *  日历排数的权限控制js
 * @author zhouww
 * @since 2015-06-17 
*/


//TODO 处理获取工厂和班组的方式
Ext.onReady(function(){
    // 如果是超级管理员 隐藏工厂相关信息
    if(userType == '9'){
        var grpForm = Ext.getCmp('grp_form');
        var grpUserForm = Ext.getCmp('grpUserForm');
        // 超级管理员给能看权限的机会
        grpForm.show();
        grpUserForm.show();
    }else if(isGrpUser=='0'){   // 普通业务员
        var grpForm = Ext.getCmp('grp_form');
        grpForm.show();
    }else { // 企业操作员
        var grpForm = Ext.getCmp('grp_form');
        var deleteB = Ext.getCmp('deleteGrpButton');
        var addB = Ext.getCmp('addGrpButton');
        grpForm.show();
        deleteB.show();
        addB.show();
    }
})


// 提供权限判断函数
/**
 * 检测是否有权限操作日历界面
 */
function allowCalendarView(){
    return !(userType && (+userType)===9); // 超级管理员没有权限操作日历界面
}