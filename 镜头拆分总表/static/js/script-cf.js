var sceneId = "";
var effectsId = 0;
$(function () {
    $("#btnReplace").click(function () {
        $dialog.window("findreplace", $("#findReplace"), function (tag) {
            var obj = $("#cf-main");
            var re = new RegExp("<span style=\".*?\">(.*?)</span>", 'g');
            while (tempR = re.exec(obj.html())) {
                obj.html(obj.html().replace(re, tempR[1]));
            }
        });
    })

    $("#btnSave").click(function () {
        var data = "";
        $.each($("#cf-main").find(".cf-split"), function () {
            var obj = $(this);
            var json = "";
            $.each(obj.find(".effects"), function () {
                var effects = $(this);
                json += "{\"id\":" + effects.attr("data-id") + ",\"typeId\":" + effects.attr("data-type") + ",\"name\":\"" + effects.text() + "\",\"effects\":\"" + effects.attr("data-effectstype") + "\",\"description\":\"" + effects.attr("data-description") + "\",\"remarks\":\"" + effects.attr("data-remarks") + "\"},"; 
            })

            data += "{\"sceneId\":" + obj.attr("data-id") + ",\"sceneInfo\":" + obj.attr("data-json") + ",\"effects\":[" + (json.length > 0 ? json.substring(0,json.length - 1) : json) + "]},";

        })
        data = (data.length > 0 ? data.substring(0, data.length - 1) : data);
        if (data.length>0) {
            $.post("", { data: data }, function (data) {


            })
        }
   
    })

    $("#cf-form select").change(function () {
        var obj = $(this);
        var scene = $("#scene" + sceneId);
        var m = JSON.parse(scene.attr("data-json"));
        m[obj.attr("id")] = obj.val();
        scene.attr("data-json", JSON.stringify(m));
    })

    $("#cf-form input").blur(function () {
        var obj = $(this);
        var scene = $("#scene" + sceneId);
        var m = JSON.parse(scene.attr("data-json"));
        m[obj.attr("id")] = obj.val().replace(/"/gi, "\"")
        scene.attr("data-json", JSON.stringify(m));
    })

    /*激活场次编辑区*/
    $(document).on('click', '#cf-main .cf-edit', function () {
        var obj = $(this);
        $(".cf-edit").show();
        obj.hide();
        sceneId = obj.attr("data-id");
        $("#cover-form").hide();
        var m = JSON.parse($("#scene" + sceneId).attr("data-json")); 
        for (k in m) {
            $("#" + k).val(m[k]);
        }
    })

    /*添加特效*/
    $("#effects-list a").click(function () {
        var sTxt = getSelectedContents();
        if (sTxt.length <= 0) {
            return false;
        }

        var obj = $(this);
        var effectsTypeId = obj.attr("data-id");
        var scene = $("#scene" + sceneId);

        effectsId++;

        scene.attr("contenteditable", "true");
        document.execCommand('insertHTML', false, "<span id=\"effects-data-" + effectsTypeId + "-" + effectsId + "\"  data-id=\"" + effectsId + "\" data-type=\"" + effectsTypeId + "\" data-effectstype=\"\" data-description=\"\"  data-remarks=\"\" class=\"effects\">" + sTxt + "</span>");
        scene.removeAttr("contenteditable");

        //var el = $("#effects-data-" + effectsTypeId + "-" + effectsId);
        //var parent = el.parent();
        //if ("cf-split" != parent.attr("class")) {
        //    revoked(effectsId);
        //    return false;
        //}

        var str = "";
        var tag = false;
        var select = obj.attr("data-select");
        str += "<div class='addeffects'>";
        str += "<p>";
        if (select) {
            tag = true;
            var arr = select.split(',');
            str += "<span>类型：</span>";
            str += "<select id='selecteffectsType' class='form-control'>";
            for (var i = 0; i < arr.length; i++) {
                str += "<option value='" + arr[i] + "'>" + arr[i] + "</option>";
            }
            str += "</select>";
        }
        str += "<span>名称：</span>";
        str += "<input type='text' id='effectsName' value='" + sTxt + "' class='form-control" + (!tag ? " w240" : "") + "' />";
        str += "<label><input type='checkbox' name='name' value='' />全部</label>";
        str += "</p>";
        str += "<div class='effects-name-list'>";
        str += "<ul>";
        str += "<li><label><input type='checkbox' name='name' value='' />全部1</label></li>";
        str += "<li><label><input type='checkbox' name='name' value='' />全部2</label></li>";
        str += "</ul>";
        str += "</div>";
        str += "<p><span>描述：</span><input type='text'  id='txtDescription' class='form-control w440' /></p>";
        str += "<p><span>备注：</span><input type='text' id='txtRemarks' class='form-control w440' /></p>";
        str += "<div class='addeffects-btn'> ";
        str += "<button class='btn ls' id=\"btneffects\" data-id=\"effects-data-" + effectsTypeId + "-" + effectsId + "\">保存</button>";
        str += "<button class='btn ls' onclick=\"$dialog.hideWindow('addeffects',false)\">取消</button>";
        str += "</div>";
        str += "</div>";
        $dialog.window("addeffects", str, function (tag) {
            if (!tag) {
                revoked(effectsId);
            }
        })
    })

    /*添加特效类型*/
    $(document).on('click', '#btneffects', function () {
        var description = $("#txtDescription").val();
        var remarks = $("#txtRemarks").val();
        var effectsType = $("#selecteffectsType").val();

        var obj = $("#" + $(this).attr("data-id"));
        obj.attr("data-effectstype", effectsType);
        obj.attr("data-description", description);
        obj.attr("data-remarks", remarks);

        $dialog.hideWindow('addeffects');
    })

    /*显示选中特效类型明细*/
    $(document).on('click', '#cf-main .effects', function () {
        var obj = $(this);
        var str = "<div>";
        str += "<p><input type='text' class='form-control w310' value=\"" + obj.text() + "\" readonly=\"readonly\"/>";
        var select = obj.attr("data-effectstype");
        if (select) {
            str += "<select class='form-control' data-name=\"effectstype\">";
            var arr = "COMP,DMP,Assets,VFX,MG".split(',');
            for (var i = 0; i < arr.length; i++) {
                str += "<option value='" + arr[i] + "' " + (arr[i] == select ? "selected" : "") + ">" + arr[i] + "</option>";
            }
            str += "</select>";
        }
        str += "</p>";
        str += "<p><input type='text' data-name=\"description\" class='form-control bfb' value=\"" + obj.attr("data-description") + "\" /></p>";
        str += "</div>";
        $("#addeffects-list").attr("data-id", obj.attr("id")).html(str);
    })

    /*绑定特效实时修改-下拉菜单*/
    $(document).on('change', '#addeffects-list select', function () {
        var obj = $(this);
        var id = $("#addeffects-list").attr("data-id");
        $("#" + id).attr("data-" + obj.data("name"), obj.val());
    })

    /*绑定特效实时修改-文本框*/
    $(document).on('blur', '#addeffects-list input', function () {
        var obj = $(this);
        var id = $("#addeffects-list").attr("data-id");
        $("#" + id).attr("data-" + obj.data("name"), obj.val());
    })

});

function revoked(id) {
    var obj = $("#scene" + sceneId);
    var re = new RegExp("<span id=\"effects-data-[0-9]+-" + id + "\".*?class=\"effects\">(.*?)</span>");
    var p = re.exec(obj.html())
    console.log(p)
    if (p != null) {
        obj.html(obj.html().replace(re, p[1]));
    }
}

function getSelectedContents() {
    try {
        if (window.getSelection) {
            var range = window.getSelection().getRangeAt(0);
            var container = window.document.createElement('div');
            container.appendChild(range.cloneContents());
            return container.innerHTML;
            //return window.getSelection(); //Text
        }
        else if (window.document.getSelection) {
            var range = window.getSelection().getRangeAt(0);
            var container = window.document.createElement('div');
            container.appendChild(range.cloneContents());
            return container.innerHTML;
            //return document.getSelection();
        }
        else if (window.document.selection) {
            return window.document.selection.createRange().htmlText;
            //return document.selection.createRange().text; 
        }
    } catch (e) {
        return "";
    }
}

var $dialog = {
    fun: new Object(),
    mark: function () {
        return (new Date().getHours() + "" + new Date().getMinutes() + "" + new Date().getSeconds() + "" + new Date().getMilliseconds()).replace(/0/g, "");
    },
    window: function (id, obj, e) {
        var mark = this.mark();
        if (id) {
            mark = id;
        }
        var html = "";
        if (typeof (obj) == "string") {
            html = obj;
        } else if (typeof (obj) == "object") {
            html = obj.html();
        }
        if (e) {
            this.fun[mark] = e;
        }
        var str = "";
        str += "<div style='position:fixed;width:100%;height:100%;top:0px;left:0px;background:#FFF;-moz-opacity: 0.4;opacity: 0.4;filter: Alpha(opacity=40);z-index:99'></div>";
        str += "<table cellpadding='0' cellspacing='0' border='0' style='width: 100%;height:100%; position:fixed;top:0px;left:0px; z-index:99'>";
        str += "<tr>";
        str += "<td valign='middle' align='center'>" + (html.replace(/data-el-id/g, "id")) + "</td>";
        str += "</tr>";
        str += "</table>";
        var m = document.createElement("div");
        m.innerHTML = str;
        m.setAttribute("id", "dialog-window-" + mark);
        document.body.appendChild(m);
        return mark;
    },
    hideWindow: function (id, tag) {
        var m = document.getElementById("dialog-window-" + id);
        if (m != null) {
            m.parentNode.removeChild(m);
            var tm = this;
            if (tm.fun[id] != undefined) {
                setTimeout(function () {
                    tm.fun[id](tag == undefined ? true : tag);
                    delete tm.fun[id];
                }, 200);
            }
        }
    },
}

var textOperation = {
    obj: null,
    txtFind: null,
    txtReplace: null,
    init: function () {
        this.obj = $("#cf-main");
        this.txtFind = $("#txtfind");
        this.txtReplace = $("#txtreplace");
    },
    findKey: function (e) {
        var val = $.trim(e.value);
        if (val.length < 1) {
            return false;
        }
        this.init();
        this.obj.html(this.obj.html().replace(new RegExp(val, 'g'), "<span style=\"background:#FFAD00\">" + val + "</span>"));
    },
    replace: function () {
        var val = $.trim(this.txtReplace.val());
        if (val.length == 0) {
            return;
        }
        var re = new RegExp("<span style=\".*?\">" + $.trim(this.txtFind.val()) + "</span>");
        this.obj.html(this.obj.html().replace(re, "<span style=\"background:red;color:#FFF\">" + val + "</span>"));
    },
    replaceAll: function () {
        var val = $.trim(this.txtReplace.val());
        if (val.length == 0) {
            return;
        }
        var re = new RegExp("<span style=\".*?\">" + $.trim(this.txtFind.val()) + "</span>", 'g');
        this.obj.html(this.obj.html().replace(re, "<span style=\"background:red;color:#FFF\">" + val + "</span>"));
    },
    findNext: function () {
        var patt = new RegExp("<span style=\"background:#FFAD00\">" + $.trim(this.txtFind.val()) + "</span>", "g");
        if (patt.exec(this.obj.html()) == null) {
            if (confirm("已经没有下一个了，是否重头开始找！")) {
                this.obj.html(this.obj.html().replace(new RegExp("<span style=\"background:#0132FD;color:#FFF\">" + $.trim(this.txtFind.val()) + "</span>", 'g'), "<span style=\"background:#FFAD00\">" + $.trim(this.txtFind.val()) + "</span>"));
            }
        } else {
            this.obj.html(this.obj.html().replace(new RegExp("<span style=\"background:#FFAD00\">" + $.trim(this.txtFind.val()) + "</span>"), "<span style=\"background:#0132FD;color:#FFF\">" + $.trim(this.txtFind.val()) + "</span>"));
        }
    }
}
