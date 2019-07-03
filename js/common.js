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
function user_popup(obj = null,has_user = false,has_department = false,has_company = false,num = 0,is_close_other = false,callback){
	if(is_close_other){
		layer.closeAll();
	}
	var table;
	layui.use(['table'],function(){
		table = layui.table;
	});
	var user_company = {id:1,pid:0}//默认当前用户的公司信息 实际另行获取 
	//是否可选公司单独再次判断  集团账户才能选择公司
	if(user_company.pid > 0){
		has_company = false;
	}
	
	if(obj == null && typeof callback !== 'function'){
		layer.msg('第一个参数不能为空！');
	}
	
	$('body').append('<div id="popup_content" data-has_user="'+has_user+'" data-has_department="'+has_department+'" data-has_company="'+has_company+'" data-num="'+num+'"></div>');
	$('#popup_content').load("../../pages/public/user_select2.html",null,function(){
		if(typeof obj == 'object'){
			var html = '';
			if($(obj).attr('type') == 'text'){
				var arr = $(obj).siblings('input[name="sels"]').val();
			} else {
				var arr = $(obj).find('input[name="sels"]').val();
			}
			if(arr){
				arr = JSON.parse(arr);
				arr.company.ids = arr.company.ids.RTrim(',').LTrim(',');
				arr.company.ids = arr.company.ids ? arr.company.ids.split(',') : [];
				arr.company.names = arr.company.names.RTrim(',').LTrim(',');
				arr.company.names = arr.company.names ? arr.company.names.split(',') : [];
				if(arr.company.ids.length > 0){
					$('#popup_content #company_ids').val(','+arr.company.ids+',');
					$('#popup_content #company_names').val(','+arr.company.names+',');
					for(var i = 0;i < arr.company.ids.length; i++){
						html += build_selectd_html('company',arr.company.ids[i],arr.company.names[i]);
					}
				}
				arr.department.ids = arr.department.ids.RTrim(',').LTrim(',');
				arr.department.ids = arr.department.ids ? arr.department.ids.split(',') : [];
				arr.department.names = arr.department.names.RTrim(',').LTrim(',');
				arr.department.names = arr.department.names ? arr.department.names.split(',') : [];
				if(arr.department.ids.length > 0){
					$('#popup_content #department_ids').val(','+arr.department.ids+',');
					$('#popup_content #department_names').val(','+arr.department.names+',');
					for(var i = 0;i < arr.department.ids.length; i++){
						html += build_selectd_html('department',arr.department.ids[i],arr.department.names[i]);
					}
				}
				arr.user.ids = arr.user.ids.RTrim(',').LTrim(',');
				arr.user.ids = arr.user.ids ? arr.user.ids.split(',') : [];
				arr.user.names = arr.user.names.RTrim(',').LTrim(',');
				arr.user.names = arr.user.names ? arr.user.names.split(',') : [];
				if(arr.user.ids.length > 0){
					$('#popup_content #user_ids').val(','+arr.user.ids+',');
					$('#popup_content #user_names').val(','+arr.user.names+',');
					for(var i = 0;i < arr.user.ids.length; i++){
						html += build_selectd_html('user',arr.user.ids[i],arr.user.names[i]);
					}
				}
				$("#selected_box").append(html);
			}
		}
	});
	//获取初始值
	if(typeof obj == 'object'){
		$('#popup_content').attr('data-has_def','true');
	}
	
	layer.open({
		type: 1,
		title:'用户选择',
		btn:['确认','取消'],
		String: false,
		closeBtn: 1,
		skin: 'layui-layer-rim',
		area: ['760px','480px'],
		content: $('#popup_content'),
		yes:function(index, layero){
			//以下方式可获取到选中的 公司 部门 人员
			var company_ids = $("#selected_box #company_ids").val();//公司ID
			var company_names = $("#selected_box #company_names").val();//公司名称
			var department_ids = $("#selected_box #department_ids").val();//部门ID
			var department_names = $("#selected_box #department_names").val();//部门名称
			var user_ids = $("#selected_box #user_ids").val();//人员ID
			var user_names = $("#selected_box #user_names").val();//人员名称
			var arr = {
				company:{ 'ids':company_ids, 'names':company_names },
				department:{ 'ids':department_ids, 'names':department_names },
				user:{ 'ids':user_ids, 'names':user_names }
			};
			if(typeof obj == 'object'){
				var html = "";
				user_names = user_names.RTrim(',').LTrim(',');
				department_names = department_names.RTrim(',').LTrim(',');
				company_names = company_names.RTrim(',').LTrim(',');
				
				user_arr = user_names ? user_names.split(',') : [];
				department_arr = department_names ? department_names.split(',') : [];
				company_arr = company_names ? company_names.split(',') : [];
				
				var L1 = user_arr.length,L2 = department_arr.length,L3 = company_arr.length;
				if((L1 + L2 + L3) > 1){
					html = "等"+(L1 + L2 + L3)+'项&gt;&gt;';
				}
				
				if($(obj).attr('type') == 'text'){
					if(L1 > 0){
						html = user_arr[0];
					} else if(L2 > 0){
						html = department_arr[0];
					} else if(L3 > 0){
						html = company_arr[0];
					}
					$(obj).val(html);
					$(obj).after('<input type="hidden" name="sels" value=\''+JSON.stringify(arr)+'\'>');
				} else {
					if(L1 > 0){
						html = user_arr[0] + html;
					} else if(L2 > 0){
						html = department_arr[0] + html;
					} else if(L3 > 0){
						html = company_arr[0] + html;
					}
					$(obj).html(html);
					$(obj).append('<input type="hidden" name="sels" value=\''+JSON.stringify(arr)+'\'>');
				}
			};
			
			if(typeof callback === 'function'){
				callback(arr);
			}
			layer.close(index);
			$('#popup_content').remove();
		},
		btn2:function(index, layero){
			layer.close(index);
			$('#popup_content').remove();
		}
	});
}

function user_popup2(obj = null,has_user = false,has_department = false,has_company = false,num = 0,is_close_other = false,callback){
	if(is_close_other){
		layer.closeAll();
	}
	var table;
	layui.use(['table'],function(){
		table = layui.table;
	});
	var user_company = {id:1,pid:0}//默认当前用户的公司信息 实际另行获取 
	//是否可选公司单独再次判断  集团账户才能选择公司
	if(user_company.pid > 0){
		has_company = false;
	}
	
	$('body').append('<div id="popup_content" data-has_user="'+has_user+'" data-has_department="'+has_department+'" data-has_company="'+has_company+'" data-num="'+num+'"></div>');
	$('#popup_content').load("../../pages/public/user_select3.html");
	
	layer.open({
		type: 1,
		title:'用户选择',
		btn:['确认','取消'],
		String: false,
		closeBtn: 1,
		skin: 'layui-layer-rim',
		area: ['760px','480px'],
		content: $('#popup_content'),
		yes:function(index, layero){
			//以下方式可获取到选中的 公司 部门 人员
			
			var company_ids = $("#selected_box #company_ids").val();//公司ID
			var company_names = $("#selected_box #company_names").val();//公司名称
			var department_ids = $("#selected_box #department_ids").val();//部门ID
			var department_names = $("#selected_box #department_names").val();//部门名称
			var user_ids = $("#selected_box #user_ids").val();//人员ID
			var user_names = $("#selected_box #user_names").val();//人员名称
			var arr = {
				company:{
					'ids':company_ids,
					'names':company_names
				},
				department:{
					'ids':department_ids,
					'names':department_names
				},
				user:{
					'ids':user_ids,
					'names':user_names
				}
			};
			if(typeof obj == 'object'){
				if(has_department){
					var html = "";
					department_ids = department_ids.RTrim(',');
					department_ids = department_ids.LTrim(',');
					department_names = department_names.RTrim(',');
					department_names = department_names.LTrim(',');
					department_ids = department_ids ? department_ids.split(',') : [];
					department_names = department_names ? department_names.split(',') : [];
					if(department_names.length > 0){
						for(var i = 0;i < department_names.length; i++){
							html += build_sel_html('department',department_ids[i],department_names[i]);
						}
					}
					$(obj).html(html);
				}
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
 * 费用项选择弹出框
 */
function payitem_pop(obj = null,company_id,callback){
	if(parseInt(company_id) <= 0){
		layer.alert('请选择公司');
	}
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