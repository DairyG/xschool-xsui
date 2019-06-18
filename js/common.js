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
 * @param boolean hsa_company 是否可选公司
 * @param int num 最大选择数(大于零时限制选址数量，否者不限制)
 * @param boolean is_close_other 是否关闭其他弹窗
 * @param function callback 回调函数
 */
function user_popup(obj,has_user,has_department,hsa_company,num,is_close_other,callback){
	if(is_close_other){
		layer.closeAll();
	}
	var table;
	layui.use(['table'],function(){
		table = layui.table;
	});
	$('body').append('<div id="popup_content"></div>');
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
			var checkStatus = table.checkStatus('user_select_lst');
			var values = $(obj).val(),ids = $(obj).attr('ids');
			for (var i = 0; i < checkStatus.data.length; i++) {
				var value = checkStatus.data[i].id;
				$(obj).find('input').each(function(){
					if($(this).val() == value || $(this).val() == 0){
						sel_remove(this);
					}
				});
				var html = build_sel_html('user',value,checkStatus.data[i].name);
				$(obj).append(html);
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