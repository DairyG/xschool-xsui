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
 * @param Object obj 显示选中内容的对象
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
	
	$('body').append('<div id="popup_content" data-has_user="'+has_user+'" data-has_department="'+has_department+'" data-has_company="'+has_company+'" data-num="'+num+'"></div>');
	$('#popup_content').load("../../pages/public/user_select2.html");
	
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
			//注意去除
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
			alert(typeof callback);
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
	console.log(window.location);
    var r = window.location.search.substr(1).match(reg); 
    if (r != null) 
        return unescape(r[2]); 
    return null; 
} 