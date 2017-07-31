/*!
 * Ext JS Library 3.1.0
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
Ext.app.App = function(cfg){
    Ext.apply(this, cfg);
    this.addEvents({
        'ready' : true,
        'beforeunload' : true
    });

    Ext.onReady(this.initApp, this);
};

Ext.extend(Ext.app.App, Ext.util.Observable, {
    isReady: false,
    startMenu: null,
    modules: null,

    getStartConfig : function(){

    },

    initApp : function(){
    	this.startConfig = this.startConfig || this.getStartConfig();

        this.desktop = new Ext.Desktop(this);

		this.launcher = this.desktop.taskbar.startMenu;

		this.modules = this.getModules();
        if(this.modules){
            this.initModules(this.modules);
        }

        this.init();

        Ext.EventManager.on(window, 'beforeunload', this.onUnload, this);
		this.fireEvent('ready', this);
        this.isReady = true;
    },

    getModules : Ext.emptyFn,
    init : Ext.emptyFn,

    initModules : function(ms){
		for(var i = 0, len = ms.length; i < len; i++){
            var m = ms[i];
            this.launcher.add(m.launcher);
            m.app = this;
        }
    },

//    getModule : function(name){
//    	var ms = this.modules;
//    	for(var i = 0, len = ms.length; i < len; i++){
//    		if(ms[i].id == name || ms[i].appType == name){
//    			return ms[i];
//			}
//        }
//        return '';
//    },
	getModule : function(name){
		var ms = this.modules;
		for(var i = 0, len = ms.length; i < len; i++){
			if(ms[i].id == name || ms[i].appType == name){
				return ms[i];
			}
			else
			{
				if(Ext.isDefined(ms[i].launcher.menu) == true && ms[i].launcher.menu.items.length > 0)
				{
					for(var j = 0, lens = ms[i].launcher.menu.items.length; j < lens ; j++)
					{
						if(Ext.isDefined(ms[i].launcher.menu.items[j].menu) == true
							&& ms[i].launcher.menu.items[j].menu.items.length > 0){
							for(var k= 0,lenss=ms[i].launcher.menu.items[j].menu.items.length;k<lenss;k++){
								if(ms[i].launcher.menu.items[j].menu.items[k].id == name)
								{
									return ms[i].launcher.menu.items[j].menu.items[k];
								}
							}
						}else{
							if(ms[i].launcher.menu.items[j].id == name)
							{
								return ms[i].launcher.menu.items[j];
							}
						}
					}
				}
			}
		}
		return '';
	},

    onReady : function(fn, scope){
        if(!this.isReady){
            this.on('ready', fn, scope);
        }else{
            fn.call(scope, this);
        }
    },

    getDesktop : function(){
        return this.desktop;
    },

    onUnload : function(e){
        if(this.fireEvent('beforeunload', this) === false){
            e.stopEvent();
        }
    }
});