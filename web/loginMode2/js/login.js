window.onload = function(){
    var loginButton = getElementById('loginButton');
    
    loginButton.onclick = function(){
        var isRememberAcc = getElementById('isRememberAccount');
        var accountEle = getElementById('username');
        var pwdEle = getElementById('password');
        if(!accountEle.value){
            alert('请填写账号');
            return false;
        }
        if(!pwdEle.value){
            alert('请填写密码');
            return false;
        }
        // 调用记住账号的操作
        if(isRememberAcc.checked){
            rememberAccount();
        }
    };
    
    function rememberAccount(){
        var accountEle = getElementById('username');
        var value = accountEle.value;
        if(accountEle){
            var rfidMobile = window.localStorage.rfidMobile;
            try{
                rfidMobile = rfidMobile ? JSON.parse(rfidMobile) : {};
            }catch(e){
                // 如果转换有问题的话就重新赋值初始化对象
                // 将错误数据放在备份里面
                window.localStorage.rfidMobileBackup = rfidMobile;
                rfidMobile = {};
            }
            rfidMobile.account = value;
            window.localStorage.rfidMobile = JSON.stringify(rfidMobile);
        }
    }
    // 对账号进行初始化
    (function initAccount(){
        var rfidMobile = window.localStorage.rfidMobile;
        rfidMobile = rfidMobile ? JSON.parse(rfidMobile) : {};
        var account = rfidMobile.account;
        account = !account ? '' : account;
        var accountEle = getElementById('username');
        accountEle.value = account;
        
    })()
    
    
    
    function getElementById(eId){
        return document.getElementById(eId);
    };
};