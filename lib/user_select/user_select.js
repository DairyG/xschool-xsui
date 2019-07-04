layui.define(['layer'], function(exports){
    'use strict';
	var layer = layui.layer;
    var defaults = {
		elem:null,
		show_obj:null,
		has_user:false,
		has_department:false,
		has_company:false,
		has_position:false,
		has_dpt_position:false,
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
			this.get_def();
            this.render();
        },
        render: function() {//绑定事件
			$(this.config.el).click(function(){
				this.open_pop();
			});
		},
		open_pop:function(){//打开弹窗
			layer.open({
				type: 2,
				title: '用户选择',
				scrollbar: false,
				skin:'layui-layer-rim',
				closeBtn: 1,
				btn:['确认','取消'],
				area: ['760px','480px'],
				anim: 2,
				move:false,
				content: './xsui/pages/public/user_select.html',
				yes:function(index, layero){
					
				},
				btn2:function(){
					
				}
			});
		},
		get_def:function(){//获取初始值
			var value = this.config.value;
			layui.data('user_select', {key: 'user',value: value.user});
			layui.data('user_select', {key: 'department',value: value.department});
			layui.data('user_select', {key: 'company',value: value.company});
			layui.data('user_select', {key: 'position',value: value.position});
			layui.data('user_select', {key: 'dpt_position',value: value.dpt_position});
		},
		set_def:function(){//设置初始值
			
		},
		clear_def:function(){//清除默认值
			layui.data('user_select', null);
		},
		done:function(){//结束后回调
			if(typeof this.config.callback === 'function'){
				this.config.callback();
			}
		}
    };
	
	var user_select = {
		render : function(options){
		  new Class(options);
		}
	}
	
	exports('user_select', user_select);
});  