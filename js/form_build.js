//------------字段属性
//LBL:字段标题 FMT:字段格式(日期、时间、电话等) REQD:必填 UNIQ:唯一 MIN、MAX:最小值、最大值(数值型字段用于限定数值的范围；文本型字段用于限定字数的多少)
//DEF:默认值 DEF_PROVINCE、DEF_CITY、DEF_ZIP:默认省、市、区县 SECDESC:分隔描述 INSTR:字段说明 LAYOUT:字段宽度(占一行的1/2 1/3 1/4) DRANGE:是否是日期范围
//LAY:字段布局 pN:层级 HDNM:隐藏数字 DISMK:禁止手动标注 HTML:html内容 EX:扩展属性

//-----------表单属性
//FRMNM:表单名称 DESC:描述 LBLAL:标签对齐方式 CFMTYP:提交后跳转选项(T：显示文本 U:跳转链接)

/**
 * 创建表单项的html
 */
function build_form_item_html(param,i){
	let html = '';
	let readonly = '';
	let layout = 'layui-col-md12';
	var name = param.LBN ? param.LBN : 'f'+i;
	var MAX = param.MAX > 0 ? 'maxlength="'+param.MAX+'"' : '';
	switch(param.LAYOUT){
		case 'leftHalf': //整行宽度的1/2
			layout = 'layui-col-md6';
			break;
		case 'third': //整行宽度的1/3
			layout = 'layui-col-md4';
			break;
		case 'quarter': //整行宽度的1/4
			layout = 'layui-col-md3';
			break;
	}
	let REQD = param.REQD == 1 ? '<span class="text-red"> *</span>' : '';
	let verify = param.REQD == 1 ? 'required' : '';
	let DEF = param.DEF ? param.DEF : '';
	html += '<div class="layui-form-item '+layout+' margin-b-20">';
	html += '<label class="layui-form-label">'+REQD+param.LBL+'</label>';
	html += '<div class="layui-input-block">';
	switch(param.TYP){
		case 'text':
		case 'number':
		case 'url':
		case 'email':
		case 'phone':
			switch(param.TYP){
				case 'number':
				case 'money':
					verify += verify ? '|number' : 'number';
					break;
				case 'email':
					verify += verify ? '|email' : 'number';
					break;
				case 'phone':
					verify += verify ? '|phone' : 'number';
					break;
			}
			html += '<input name="'+name+'" type="text" lay-verify="'+verify+'" '+readonly+' placeholder="请输入'+param.LBL+'" value="'+DEF+'" autocomplete="off" class="layui-input" '+MAX+'>';
			break;
		case 'date':
		case 'time':
			readonly = 'readonly'
			let range = param.DRANGE == '1' ? 'true' : 'false';
			html += '<input name="'+name+'" type="text" lay-verify="'+verify+'" '+readonly+' data-type='+param.FMT+' data-range='+range+' placeholder="请选择'+param.LBL+'" value="'+DEF+'" autocomplete="off" class="layui-input date">';
			break;
		case 'textarea':
			html += '<textarea name="desc" lay-verify="'+verify+'" placeholder="请输入'+param.LBL+'" class="layui-textarea" '+MAX+'>'+DEF+'</textarea>';
			break;
		case 'radio':
			if(param.ITMS.length > 0){
				for(var i = 0;i < param.ITMS.length;i++){
					let checked = param.ITMS[i].CHKED == 1 ? 'checked' : '';
					html += '<input type="radio" name="'+name+'" value="'+param.ITMS[i].VAL+'" title="'+param.ITMS[i].VAL+'" '+checked+'>';
				}
			}
			break;
		case 'checkbox':
			if(param.ITMS.length > 0){
				for(var i = 0;i < param.ITMS.length;i++){
					let checked = param.ITMS[i].CHKED == 1 ? 'checked' : '';
					html += '<input type="checkbox" name="'+name+'" value="'+param.ITMS[i].VAL+'" title="'+param.ITMS[i].VAL+'" '+checked+' lay-skin="primary">';
				}
			}
			break;
		case 'dropdown':
			html += '<select name="'+name+'" lay-verify="'+verify+'">';
			html += '<option value="-1">请选择'+param.LBL+'</option>';
			if(param.ITMS.length > 0){
				for(var i = 0;i < param.ITMS.length;i++){
					let checked = param.ITMS[i].CHKED == 1 ? 'selected' : '';
					html += '<option value="'+param.ITMS[i].VAL+'"'+checked+'>'+param.ITMS[i].VAL+'</option>';
				}
			}
			html += '</select>';
			break;
		case 'file':
			html += '<button type="button" class="layui-btn layui-btn-sm layui-btn-normal upload" ><i class="layui-icon">&#xe67c;</i>'+param.LBL+'</button>';
			break;
		case 'map':
			break;
		case 'address':
			html += '<div class="pickArea"></div>';
			break;
		case 'approvalno':
			html += '<input name="'+name+'" type="text" lay-verify="'+verify+'" readonly placeholder="请选择'+param.LBL+'"  autocomplete="off" class="layui-input" onclick="approvalno_popup(this)">';
			break;
		case 'person':
			let e = 'user_popup';
			let u = false,d = false,c = false;
			let a = (param.ALLOWS.length > 0) ? param.ALLOWS.join(',') : "";
			if(a != ""){
				if(a.indexOf('user') > -1){
					u = true;
				}
				if(a.indexOf('department') > -1){
					d = true;
				}
				if(a.indexOf('company') > -1){
					c = true;
				}
				if(a.indexOf('position') > -1){
					e = 'user_popup2';
				}
			}
			html += '<div class="layui-input"><button class="layui-btn layui-btn-sm margin-t-3 layui-btn-normal" onclick="'+e+'($(this).parent(),'+u+','+d+','+c+')">'+param.LBL+'</button></div>';
			break;
	}
	
	html += '</div></div>';
	return html;
}

/**
 * 创建非表单项的html
 */
function not_form_item_html(param,i){
	var html = '';
	switch(param.TYP){
		case 'section':
			html += '<div class="form-title">'+param.LBL+'：</div>';
			break;
	}
	return html;
}

/**
 * 创建表单dom
 * @param Object formData 表单配置
 * @param Object paramData 表单项配置
 */
function form_build(formData,paramData){
	var html = '<div class="layui-row layui-form layui-form2 ">';
	var not_form_items = 'section';
	for(var i = 0;i < paramData.length;i++){
		if(not_form_items.indexOf(paramData[i].TYP) > -1){//非表单项的HTML
			html += not_form_item_html(paramData[i],i);
		} else {
			html += build_form_item_html(paramData[i],i);
		}
	}
	html += '</div>';
	return html;
}
