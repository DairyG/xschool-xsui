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
 */
function user_popup(obj){
	var table;
	layui.use(['table'],function(){
		table = layui.table;
	});
	$('body').append('<div id="popup_content"></div>');
	$('#popup_content').load("../public/user_select.html");
	
	layer.open({
		type: 1,
		title:'用户选择',
		btn:['确认','取消'],
		String: false,
		closeBtn: 1,
		skin: 'layui-layer-rim',
		area: ['980px','480px'],
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