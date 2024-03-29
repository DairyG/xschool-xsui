String.prototype.RTrim = function (c) {
    if (!c) {
        c = ' ';
    }
    var reg = new RegExp('([' + c + ']*$)', 'gi');
    return this.replace(reg, '');
}
String.prototype.LTrim = function (c) {
    if (!c) {
        c = ' ';
    }
    var reg = new RegExp('(^[' + c + '])', 'gi');
    return this.replace(reg, '');
}
String.prototype.FormatDate=function(hasTime){
    if(!this){return "";}
    try{
        var d = new Date( Date.parse(this));        
        if(!d){return "";}
        if(hasTime){
            return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
        }else{
            return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        }
    }catch(ex){
        return "";
    }
}
var layer;
layui.use(['layer'],function(){
	layer = layui.layer;
});
/**
 * 格式化日期对象
 * @param Object date
 * @param boolean 
 */
function FormatDate(date,hasTime){
	if(hasTime){
	    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
	}else{
	    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
	}
}
/** 
 * 弹出输入层
 */
function layui_prompt(obj){
	var default_val = $(obj).val();
	layer.prompt({
		formType: 2,
		value: default_val,
		title: '请输入',
		area: ['350px', '120px'],
		yes:function(index, elem){
			var value = elem.find(".layui-layer-input").val();
			$(obj).val(value);
			layer.close(index);
		}
	});
}

/**
 * 弹出用户选择框
 * @param Object obj 显示选中内容的dom对象 （初始值和选中值的存放dom对象）
 * @param boolean has_user 是否可选用户
 * @param boolean has_department 是否可选部门
 * @param boolean has_company 是否可选公司
 * @param int num 最大选择数(大于零时限制选址数量，否者不限制)
 * @param boolean is_close_other 是否关闭其他弹窗
 * @param function callback 回调函数
 */
function user_popup(obj = null,allow_sels,num = 0,is_close_other = false,callback){
	if (is_close_other) {
		layer.closeAll();
	}
	
	var has_user = allow_sels.indexOf('user') > -1 ? true : false;
	var has_department = allow_sels.indexOf('department') > -1 ? true : false;
	var has_company = allow_sels.indexOf('company') > -1 ? true : false;
	var has_position = allow_sels.indexOf('position') > -1 ? true : false;
	var has_dpt_position = allow_sels.indexOf('dpt_position') > -1 ? true : false;
	var sel_type = 'org';
	window.sels = null;
	if (typeof obj == 'object') {
		if ($(obj).attr('type') == 'text') {
			var arr = $(obj).siblings('input[name="sels"]').val();
		} else {
			var arr = $(obj).find('input[name="sels"]').val();
		}
		if (arr) {
			sels = JSON.parse(arr);
			sel_type = sels.sel_type;
		}
	}
	var num = parseInt(num);
	var url = '../../pages/public/user_select.html?sel_type='+sel_type+'&num='+num+'&has_user='+has_user+'&has_department='+has_department+'&has_company='+has_company+'&has_position='+has_position+'&has_dpt_position='+has_dpt_position;
	
	layer.open({
		type: 2,
		title: '用户选择',
		btn: ['确认', '取消'],
		String: false,
		closeBtn: 1,
		skin: 'layui-layer-rim',
		area: ['760px', '480px'],
		content: url,
		yes: function (index, layero) {
			var win = window[layero.find('iframe')[0]['name']];//得到iframe页的窗口对象
			var sels = win.sels;
			if (typeof obj == 'object') {
				var html = "";
				var L1 = sels.user.length,
					L2 = sels.department.length,
					L3 = sels.company.length,
					L4 = sels.position.length,
					L5 = sels.dpt_position.length;
				if ((L1 + L2 + L3 + L4 + L5) > 1) {
					html = "等" + (L1 + L2 + L3 + L4 + L5) + '项';
				}
				if (L1 > 0) {
					html = sels.user[0].name + html;
				} else if (L2 > 0) {
					html = sels.department[0].name + html;
				} else if (L3 > 0) {
					html = sels.company[0].name + html;
				} else if (L4 > 0) {
					html = sels.position[0].name + html;
				} else if (L5 > 0) {
					html = sels.dpt_position[0].name + html;
				}

				if ($(obj).attr('type') == 'text') {
					$(obj).val(html);
					var hide_ipt = $(obj).next('input[type="hidden"]');
					if (hide_ipt.length > 0) {
						hide_ipt.val(JSON.stringify(sels));
					} else {
						$(obj).after('<input type="hidden" name="sels" value=\'' + JSON.stringify(sels) + '\'>');
					}
				} else {
					html += '&gt;&gt;';
					$(obj).html(html);
					var hide_ipt = $(obj).find('input[type="hidden"]');
					if (hide_ipt.length > 0) {
						hide_ipt.val(JSON.stringify(sels));
					} else {
						$(obj).append('<input type="hidden" name="sels" value=\'' + JSON.stringify(sels) + '\'>');
					}
				}
			};

			if (typeof callback === 'function') {
				callback(sels);
			}
			layer.close(index);
		},
		btn2: function (index, layero) {
			if (typeof callback === 'function') {
				callback(null);
			}
			layer.close(index);
		}
	});
}

function user_popup2(obj = null,allow_sels,num = 0,is_close_other = false,callback){
	if (is_close_other) {
		layer.closeAll();
	}

	var user_company = {
		id: 1,
		pid: 0
	} //默认当前用户的公司信息 实际另行获取 
	//是否可选公司单独再次判断  集团账户才能选择公司
	if (user_company.pid > 0) {
		has_company = false;
	}
	var has_user = allow_sels.indexOf('user') > -1 ? true : false;
	var has_department = allow_sels.indexOf('department') > -1 ? true : false;
	var has_company = allow_sels.indexOf('company') > -1 ? true : false;
	var has_position = allow_sels.indexOf('position') > -1 ? true : false;
	var has_dpt_position = allow_sels.indexOf('dpt_position') > -1 ? true : false;
	$("#popup_content").remove();
	$('body').append('<div id="popup_content" data-has_user="' + has_user + '" data-has_department="' + has_department + '" data-has_company="' + has_company + '" data-has_position="' + has_position + '" data-has_dpt_position="' + has_dpt_position + '" data-num="' + num + '"></div>');
	$('#popup_content').load("../../pages/public/user_select3.html", null, function () {
		var sel_type = 'org';
		if (typeof obj == 'object') {
			var html = '';
			if ($(obj).attr('type') == 'text') {
				var arr = $(obj).siblings('input[name="sels"]').val();
			} else {
				var arr = $(obj).find('input[name="sels"]').val();
			}
			if (arr) {
				arr = JSON.parse(arr);
				sel_type = arr.sel_type;

				arr.company.ids = arr.company.ids.RTrim(',').LTrim(',');
				arr.company.ids = arr.company.ids ? arr.company.ids.split(',') : [];
				arr.company.names = arr.company.names.RTrim(',').LTrim(',');
				arr.company.names = arr.company.names ? arr.company.names.split(',') : [];
				if (arr.company.ids.length > 0) {
					$('#popup_content #company_ids').val(',' + arr.company.ids + ',');
					$('#popup_content #company_names').val(',' + arr.company.names + ',');
					for (var i = 0; i < arr.company.ids.length; i++) {
						html += build_selectd_html('company', arr.company.ids[i], arr.company.names[i]);
					}
				}
				arr.department.ids = arr.department.ids.RTrim(',').LTrim(',');
				arr.department.ids = arr.department.ids ? arr.department.ids.split(',') : [];
				arr.department.names = arr.department.names.RTrim(',').LTrim(',');
				arr.department.names = arr.department.names ? arr.department.names.split(',') : [];
				if (arr.department.ids.length > 0) {
					$('#popup_content #department_ids').val(',' + arr.department.ids + ',');
					$('#popup_content #department_names').val(',' + arr.department.names + ',');
					for (var i = 0; i < arr.department.ids.length; i++) {
						html += build_selectd_html('department', arr.department.ids[i], arr.department.names[i]);
					}
				}
				arr.user.ids = arr.user.ids.RTrim(',').LTrim(',');
				arr.user.ids = arr.user.ids ? arr.user.ids.split(',') : [];
				arr.user.names = arr.user.names.RTrim(',').LTrim(',');
				arr.user.names = arr.user.names ? arr.user.names.split(',') : [];
				if (arr.user.ids.length > 0) {
					$('#popup_content #user_ids').val(',' + arr.user.ids + ',');
					$('#popup_content #user_names').val(',' + arr.user.names + ',');
					for (var i = 0; i < arr.user.ids.length; i++) {
						html += build_selectd_html('user', arr.user.ids[i], arr.user.names[i]);
					}
				}
				arr.position.ids = arr.position.ids.RTrim(',').LTrim(',');
				arr.position.ids = arr.position.ids ? arr.position.ids.split(',') : [];
				arr.position.names = arr.position.names.RTrim(',').LTrim(',');
				arr.position.names = arr.position.names ? arr.position.names.split(',') : [];
				if (arr.position.ids.length > 0) {
					$('#popup_content #position_ids').val(',' + arr.position.ids + ',');
					$('#popup_content #position_names').val(',' + arr.position.names + ',');
					for (var i = 0; i < arr.position.ids.length; i++) {
						html += build_selectd_html('position', arr.position.ids[i], arr.position.names[i]);
					}
				}

				arr.dpt_position.ids = arr.dpt_position.ids.RTrim(',').LTrim(',');
				arr.dpt_position.ids = arr.dpt_position.ids ? arr.dpt_position.ids.split(',') : [];
				arr.dpt_position.names = arr.dpt_position.names.RTrim(',').LTrim(',');
				arr.dpt_position.names = arr.dpt_position.names ? arr.dpt_position.names.split(',') : [];
				if (arr.dpt_position.ids.length > 0) {
					$('#popup_content #dpt_position_ids').val(',' + arr.dpt_position.ids + ',');
					$('#popup_content #dpt_position_names').val(',' + arr.dpt_position.names + ',');
					for (var i = 0; i < arr.dpt_position.ids.length; i++) {
						html += build_selectd_html('dpt_position', arr.dpt_position.ids[i], arr.dpt_position.names[i]);
					}
				}
				$("#selected_box").append(html);
				if (has_company) {
					var ids = $("#company_ids").val();
					$("#select_ul input[data-type='company']").each(function () {
						var id = $(this).data('id');
						if (ids.indexOf(',' + id + ',') >= 0) {
							$(this).prop('checked', true);
						}
					});
				}
			}
		}
		$('#sel_type').val(sel_type);
		$('.radio_box input').each(function () {
			if ($(this).val() == sel_type) {
				change_sel_type($(this), sel_type, false);
			}
		});
	});

	layer.open({
		type: 1,
		title: '用户选择',
		btn: ['确认', '取消'],
		String: false,
		closeBtn: 1,
		skin: 'layui-layer-rim',
		area: ['760px', '480px'],
		content: $('#popup_content'),
		yes: function (index, layero) {
			//以下方式可获取到选中的 公司 部门 人员
			var sel_type = $("#selected_box #sel_type").val();
			var company_ids = $("#selected_box #company_ids").val(); //公司ID
			var company_names = $("#selected_box #company_names").val(); //公司名称
			var department_ids = $("#selected_box #department_ids").val(); //部门ID
			var department_names = $("#selected_box #department_names").val(); //部门名称
			var user_ids = $("#selected_box #user_ids").val(); //人员ID
			var user_names = $("#selected_box #user_names").val(); //人员名称
			var position_ids = $("#selected_box #position_ids").val(); //人员ID
			var position_names = $("#selected_box #position_names").val(); //人员名称
			var dpt_position_ids = $("#selected_box #dpt_position_ids").val(); //人员ID
			var dpt_position_names = $("#selected_box #dpt_position_names").val(); //人员名称
			var arr = {
				sel_type: sel_type,
				company: {
					'ids': company_ids,
					'names': company_names
				},
				department: {
					'ids': department_ids,
					'names': department_names
				},
				user: {
					'ids': user_ids,
					'names': user_names
				},
				position: {
					'ids': position_ids,
					'names': position_names
				},
				dpt_position: {
					'ids': dpt_position_ids,
					'names': dpt_position_names
				}
			};
			if (typeof obj == 'object') {
				var html = "";
				user_names = user_names.RTrim(',').LTrim(',');
				department_names = department_names.RTrim(',').LTrim(',');
				company_names = company_names.RTrim(',').LTrim(',');
				position_names = position_names.RTrim(',').LTrim(',');
				dpt_position_names = dpt_position_names.RTrim(',').LTrim(',');

				user_arr = user_names ? user_names.split(',') : [];
				department_arr = department_names ? department_names.split(',') : [];
				company_arr = company_names ? company_names.split(',') : [];
				position_arr = position_names ? position_names.split(',') : [];
				dpt_position_arr = dpt_position_names ? dpt_position_names.split(',') : [];

				var L1 = user_arr.length,
					L2 = department_arr.length,
					L3 = company_arr.length,
					L4 = position_arr.length,
					L5 = dpt_position_arr.length;
				if ((L1 + L2 + L3 + L4 + L5) > 1) {
					html = "等" + (L1 + L2 + L3 + L4 + L5) + '项';
				}
				if (L1 > 0) {
					html = user_arr[0] + html;
				} else if (L2 > 0) {
					html = department_arr[0] + html;
				} else if (L3 > 0) {
					html = company_arr[0] + html;
				} else if (L4 > 0) {
					html = position_arr[0] + html;
				} else if (L5 > 0) {
					html = dpt_position_arr[0] + html;
				}

				if ($(obj).attr('type') == 'text') {
					$(obj).val(html);
					var hide_ipt = $(obj).next('input[type="hidden"]');
					if (hide_ipt.length > 0) {
						hide_ipt.val(JSON.stringify(arr));
					} else {
						$(obj).after('<input type="hidden" name="sels" value=\'' + JSON.stringify(arr) + '\'>');
					}
				} else {
					html += '&gt;&gt;';
					$(obj).html(html);
					var hide_ipt = $(obj).find('input[type="hidden"]');
					if (hide_ipt.length > 0) {
						hide_ipt.val(JSON.stringify(arr));
					} else {
						$(obj).append('<input type="hidden" name="sels" value=\'' + JSON.stringify(arr) + '\'>');
					}
				}
			};

			if (typeof callback === 'function') {
				callback(arr);
			}
			layer.close(index);
		},
		btn2: function (index, layero) {
			if (typeof callback === 'function') {
				callback(null);
			}
			layer.close(index);
		}
	});
}

/**
 * 费用项选择弹出框
 */
function payitem_pop(obj = null,company_id,callback){
	if(parseInt(company_id) <= 0){
		layer.alert('请选择公司');
	}
	$("#popup_content").remove();
	$('body').append('<div id="popup_content" data-company_id="'+company_id+'"></div>');
	$('#popup_content').load("../../pages/public/payitem_select.html");
	
	layer.open({
		type: 1,
		title:'费用科目选择',
		btn:['确认','取消'],
		String: false,
		closeBtn: 1,
		skin: 'layui-layer-rim',
		area: ['760px','480px'],
		content: $('#popup_content'),
		yes:function(index, layero){
			//以下方式可获取到选中的 公司 部门 人员
			
			if(typeof obj == 'object'){
				
			};
			
			if(typeof callback === 'function'){
				callback(arr);
			}
			layer.close(index);
		},
		btn2:function(index, layero){
			layer.close(index);
		}
	});
}
/**
 * 创建选中项html
 * @param string type (user,company,department,position)
 * @param string value 选中项的值
 * @param string text 选中项文本
 */
function build_sel_html(type,value,text){
	var html = '<span class="layui-badge layui-badge2 layui-bg-cyan">'+text+'<input type="hidden" class="'+type+'_ipt" value="'+value+'"><i class="layui-icon layui-icon-close" onclick="sel_remove(this)"></i></span>';
	return html;
}

/** 
 * 删除选中项
 * @param Object obj
 */
function sel_remove(obj){
	$(obj).parents('span').remove();
}

//获取get参数 
function GetPara(name) { 
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
    var r = window.location.search.substr(1).match(reg); 
    if (r != null) 
        return unescape(r[2]); 
    return null; 
} 

/**
 * 审批单号弹出框
 * @param Object obj 输入框对象
 */
function approvalno_popup(obj){
	$('body').append('<div id="popup_content"></div>');
	$('#popup_content').load("../../pages/public/approvalno.html");
	
	layer.open({
		type: 1,
		title:'选择审批单',
		String: false,
		closeBtn: 1,
		btn:['确认','取消'],
		skin: 'layui-layer-rim',
		area: ['850px','450px'],
		content: $('#popup_content')
	});
}

/**
 * 考核项选择框
 */
function assess_popup(obj,type = 'checkbox'){
	$('body').append('<div id="popup_content" data-type='+type+'></div>');
	$('#popup_content').load("../../pages/public/assess.html");
	layer.open({
		type: 1,
		title:'选择考核项',
		String: false,
		closeBtn: 1,
		btn:['确认','取消'],
		skin: 'layui-layer-rim',
		area: ['850px','450px'],
		content: $('#popup_content')
	});
}

$.fn.scrollFixed = function(fixed_w = '') {//页面滚动时tab-title始终在页面上方
	var offset = this.offset().top;
	var _this = this;
	if(fixed_w == ''){
		fixed_w = _this.parents('.childrenBody').width();
	}
	var w = _this.width();
	var padd = (fixed_w - w)/2;
	$(window).scroll(function(event){
		if($(window).scrollTop() > offset){
			_this.css({'position':'fixed','top':'0','left':'15px','width':w,'zIndex':'9999','background':'#fff','paddingTop':'15px','paddingLeft':padd,'paddingRight':padd});
		} else {
			_this.removeAttr('style');
		}
	});
}

$(function(){
	$('.back_history').click(function(){
		window.history.back(-1);
	});
});