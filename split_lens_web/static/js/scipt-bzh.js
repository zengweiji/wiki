
$(function () { 
    $("#btnRevoked").click(function () {
        scriptPlugin.revokedOperating();
    }) 

    $("#btnSave").click(function () {
        var obj = scriptPlugin.content;
        var trimContent = $.trim(obj.html());
      
        var splitArr = trimContent.split(/<i class=\"split\"><\/i>/gi);
  
        var data = "";
        var replace = function (str) {
            str = str.replace(/"/gi, "\\\"");
            str = str.replace(/\n/g, "\\n");
            str = str.replace(/\r/g, "\\r"); 
            return str;
        }

        var getJson = function (arr) {
            var str = "";
            var obj = null;
            $.each(arr, function () {
                obj = $(this);
                str += "{\"id\":" + obj.find("b").data("id") + ",\"content\":\"" + replace(obj.text()) + "\"},";
            })
            return str.length > 0 ? str.substring(0, str.length - 1) : str;
        }

        for (var i = 0; i < splitArr.length; i++) { 
            var r = new RegExp("<span id=\"split-cc-[0-9]+\" class=\"cc\"><b data-id=\"([0-9]+)\">.*?</b><input type=\"text\" class=\"form-control ccinput\" value=\"(.*?)\">([\\s\\S]*?)</span>").exec(splitArr[i]);
            if (r != null) { 
                var c = $("<div>" + splitArr[i] + "</div>");  
                data += "{\"id\":\"" + r[1] + "\",\"value\":\"" + r[2] + "\",\"title\":\"" + replace(r[3]) + "\",\"cc\":\"" + replace(splitArr[i]) + "\",\"jt\":[" + getJson(c.find(".jt")) + "],\"dh\":[" + getJson(c.find(".dh")) + "],\"db\":[" + getJson(c.find(".db")) + "]},";
            } 
        }

        if (data.length > 0) {
            data = "[" + data.substring(0, data.length - 1) + "]"; 
            console.log(JSON.parse(data)) 
        } else {
            alert("解析错误!")
        }
    })

    $('#editControls a').click(function (e) {
        var type = $(this).data("tag");
        scriptPlugin.scriptOperating(type);
    })

    $(document).on('blur', '#bzh-main input', function () {
        $(this).attr("value", $(this).val());
    })

})

var scriptPlugin = {
    content: null,
    commId: 0,
    revokedArr: [], 
    getTypeName: function (e) {
        switch (e.attr("class")) {
            case "cc":
                return "场次";
            case "jt":
                return "镜头";
            case "dh":
                return "对话";
            case "db":
                return "独白";
        }
    },
    revokedOperating: function () {
        if (this.revokedArr.length > 0) {
            var m = this.revokedArr[this.revokedArr.length - 1]; 
            var reg = new RegExp(m,'gi');
            var p = reg.exec(this.content.html());
            if (p!=null) {
                this.content.html(this.content.html().replace(reg, p[1]));
            }
            this.revokedArr.remove(this.revokedArr.length - 1);
        } else {
            alert("没有可撤销内容！");
        }
    },
    getType: function (type) {
        switch (type) {
            case "cc":
                return 0;
            case "jt":
                return 1;
            case "dh":
                return 2;
            case "db":
                return 3;
        }
    },
    getSelectedContents: function () {
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
    },
    scriptOperating: function (type) {
        var tm = this;


        tm.commId++;
        tm.content = $("#bzh-main"); 
        var oldContent = tm.content.html();
        var sText = tm.getSelectedContents(); 
        if (sText.length <= 0) {
            alert("未选择剧本内容！")
            return false;
        }
        if (sText.indexOf("<span") != -1 || sText.indexOf("<i") != -1) {
            alert("选择内容有误，当前选择内容已经属于某个段落！");
            return false;
        } 
        tm.content.attr("contenteditable", "true");

        document.execCommand('insertHTML', false, (type == "cc" ? "<i class=\"split\"></i>" : "") + "<span id=\"split-" + type + "-" + tm.commId + "\">" + sText + "</span>");

        var html = "";
        switch (type) {
            case "cc":
                html = "<b data-id=\"" + tm.commId + "\">场次</b><input type=\"text\"  class=\"form-control ccinput\" value=\" \"/>";
                break;
            case "jt":
                html = "<b data-id=\"" + tm.commId + "\">镜头</b>";
                break;
            case "dh":
                html = "<b data-id=\"" + tm.commId + "\">对话</b>";
                break;
            case "db":
                html = "<b data-id=\"" + tm.commId + "\">独白</b>";
                break;
        }


        tm.content.find("b").removeAttr("style");
        tm.content.find("br").remove();

        var el = $("#split-" + type + "-" + tm.commId);
        var oldText = el.text();
        el.addClass(type).html(html +oldText);

        var parent = el.parent();
        var prev = el.prev();
        console.log("父级：" + parent.attr("class"));
        console.log("上上节点Class：" + prev.prev().attr("class"))
        if (undefined != prev.prev().attr("class")) {
            if (prev.prev().attr("class") == "start") {
                tm.content.html(oldContent);
                alert("选择内容有误，当前选择内容已经属于某个段落！");
                return false;
            }
        }
        //验证选中内容是否在其他标签之中
        if (parent.attr("class") != "bzh-main") {
            tm.content.html(oldContent);
            alert("选择内容有误，当前选择内容已经属于某个段落！");
        } else { 
            tm.revokedArr.push((type == "cc" ? "<i class=\"split\"></i>" : "") + "<span id=\"split-" + type + "-" + tm.commId + "\" class=\"" + type + "\"><b data-id=\"" + tm.commId + "\">.*?</b>"+(type=="cc"?"<input.*?>":"")+"([\\s\\S]*?)</span>");
        }
        tm.content.removeAttr("contenteditable");
    }
}
 

Array.prototype.remove = function (dx) {
    if (isNaN(dx) || dx > this.length) {
        return false;
    }
    for (var i = 0, n = 0; i < this.length; i++) {
        if (this[i] != this[dx]) {
            this[n++] = this[i];
        }
    }
    this.length -= 1;
};



document.onkeydown = function (e) {
    e = e || window.event;
    if (e.keyCode == 49 && e.ctrlKey) {
        scriptPlugin.scriptOperating("cc");
        return false;
    }
    if (e.keyCode == 50 && e.ctrlKey) {
        scriptPlugin.scriptOperating("jt");
        return false;
    }
    if (e.keyCode == 51 && e.ctrlKey) {
        scriptPlugin.scriptOperating("dh");
        return false;
    }
    if (e.keyCode == 52 && e.ctrlKey) {
        scriptPlugin.scriptOperating("db");
        return false;
    }
}