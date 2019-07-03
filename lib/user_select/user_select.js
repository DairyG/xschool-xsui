layui.define(['layer'], function(exports){
    'use strict';
    var defaults = {
		obj:null,
		has_user:false,
		has_department:false,
		has_company:false,
		has_position:false,
		num:0,
		is_close_other:false,
		callback:null,
		value:[],
	};

    function Class(options) {
		this.config = $.extend({},defaults, options);
		this.init();
	}
    Class.prototype = {
        init: function() {
            this.render();
        },
        render: function() {
			
		}
    };
	
	var user_select = {
		render : function(options){
		  new Class(options);
		}
	}
	
	exports('user_select', user_select);
});  