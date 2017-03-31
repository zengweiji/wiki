
//全选
function selectAll(e){
  var target = $(e).attr('data-check-target');
  $(target).prop('checked', $(e).prop('checked'));

}
//弹窗
var $dialog = {
    fun: new Object(),
    mark: function () {
        return (new Date().getHours() + "" + new Date().getMinutes() + "" + new Date().getSeconds() + "" + new Date().getMilliseconds()).replace(/0/g, "");
    },
    msg:function(msg,fun){//只有确认按钮的对话框
        this.alert(msg,false,fun);
    },
    okOrCancel:function(msg,fun){//有确认和取消按钮的对话框
        this.alert(msg,true,fun);
    },
    alert:function(msg,isbtn,fun){
        var mark = this.mark();
        if(fun){
            this.fun[mark]=fun;
        }
        var str = "";
        str += "<div class='dialog-layer-bg'></div>";
        str += "<table cellpadding='0' cellspacing='0' border='0' style='width: 100%;height:100%; position:fixed;top:0px;left:0px; z-index:99'>";
        str += "<tr>";
        str += "<td valign='middle' align='center'>";
        str += "<div class='dialog-layer-alert'><p><span>系统提示</span></p>";
        str += "<div class='dialog-layer-alert-content'>"+msg+"</div>";
        str += "<div class='dialog-layer-alert-btn'><button class='confirm' onclick=\"$dialog.hideAlert("+mark+",true)\">确定</button>";
        if(isbtn){
            str +="<button class='cancel' onclick=\"$dialog.hideAlert("+mark+",false)\">取消</button>";
        }
        str += "</div>";
        str += "</div>";
        str += "</td>";
        str += "</tr>";
        str += "</table>";
        var m = document.createElement("div");
        m.innerHTML = str;
        m.setAttribute("id", "dialog-alert-" + mark);
        m.getElementsByTagName("div")[0].className = 'dialog-layer-bg layer-bg-fadeIn';
        m.getElementsByTagName("div")[1].className = 'dialog-layer-alert layer-fadeIn';
        document.body.appendChild(m);
        return mark;
    },
    hideAlert:function(id,tag){
        var m = document.getElementById("dialog-alert-" + id);
        if (m != null) {
            var tm = this;
            m.getElementsByTagName("div")[0].className = 'dialog-layer-bg layer-bg-fadeOut';
            m.getElementsByTagName("div")[1].className = 'dialog-layer-alert layer-fadeOut';
            setTimeout(function () {
                m.parentNode.removeChild(m);
                if (tm.fun[id] != undefined) {
                    tm.fun[id](tag);
                    delete tm.fun[id];
                }
            }, 200);
        }
    },
    window: function (id, obj, e) {
        //obj 可传递dom标签也可传递str
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
        str += "<div class='dialog-layer-bg'></div>";
        str += "<table cellpadding='0' cellspacing='0' border='0' style='width: 100%;height:100%; position:fixed;top:0px;left:0px; z-index:99'>";
        str += "<tr>";
        str += "<td valign='middle' align='center'><div class='dialog-layer-box'>" + (html.replace(/data-el-id/g, "id")) + "</div></td>";
        str += "</tr>";
        str += "</table>";
        var m = document.createElement("div");
        m.innerHTML = str;
        m.setAttribute("id", "dialog-window-" + mark);
        m.getElementsByTagName("div")[0].className = 'dialog-layer-bg layer-bg-fadeIn';
        m.getElementsByTagName("div")[1].className = 'dialog-layer-box layer-fadeIn';
        document.body.appendChild(m);
        return mark;
    },
    hideWindow: function (id, tag) {
        var m = document.getElementById("dialog-window-" + id);
        if (m != null) {
            var tm = this;
            m.getElementsByTagName("div")[0].className = 'dialog-layer-bg layer-bg-fadeOut';
            m.getElementsByTagName("div")[1].className = 'dialog-layer-box layer-fadeOut';
            setTimeout(function () {
                m.parentNode.removeChild(m);
                if (tm.fun[id] != undefined) {
                    tm.fun[id](tag == undefined ? true : tag);
                    delete tm.fun[id];
                }
            }, 200);
        }
    }
}



//导出 execl 表格，兼容各大浏览器
var idTmr;
function  getExplorer() {
    var explorer = window.navigator.userAgent ;
    //ie
    if (explorer.indexOf("MSIE") >= 0) {
        return 'ie';
    }
    //firefox
    else if (explorer.indexOf("Firefox") >= 0) {
        return 'Firefox';
    }
    //Chrome
    else if(explorer.indexOf("Chrome") >= 0){
        return 'Chrome';
    }
    //Opera
    else if(explorer.indexOf("Opera") >= 0){
        return 'Opera';
    }
    //Safari
    else if(explorer.indexOf("Safari") >= 0){
        return 'Safari';
    }
}
function exportExcel(tableid){
    if(getExplorer()=='ie')
    {
        var curTbl = document.getElementById(tableid);
        var oXL = new ActiveXObject("Excel.Application");
        var oWB = oXL.Workbooks.Add();
        var xlsheet = oWB.Worksheets(1);
        var sel = document.body.createTextRange();
        sel.moveToElementText(curTbl);
        sel.select();
        sel.execCommand("Copy");
        xlsheet.Paste();
        oXL.Visible = true;

        try {
            var fname = oXL.Application.GetSaveAsFilename("Excel.xls", "Excel Spreadsheets (*.xls), *.xls");
        } catch (e) {
            print("Nested catch caught " + e);
        } finally {
            oWB.SaveAs(fname);
            oWB.Close(savechanges = false);
            oXL.Quit();
            oXL = null;
            idTmr = window.setInterval("Cleanup();", 1);
        }

    }
    else
    {
        tableToExcel(tableid)
    }
}
function Cleanup() {
    window.clearInterval(idTmr);
    CollectGarbage();
}
var tableToExcel = (function() {
    var uri = 'data:application/vnd.ms-excel;base64,',
            template = '<html><head><meta charset="UTF-8"></head><body><table border="1">{table}</table></body></html>',
            base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) },
            format = function(s, c) {
                return s.replace(/{(\w+)}/g,
                        function(m, p) { return c[p]; }) }
    return function(table, name) {
        if (!table.nodeType) table = document.getElementById(table)
        var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
        window.location.href = uri + base64(format(template, ctx))
    }
})()
