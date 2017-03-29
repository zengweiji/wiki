//全选
function selectAll(e) {
    var target = $(e).attr('data-check-target');
    $(target).prop('checked', $(e).prop('checked'));

}
//弹窗
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

;(function ($) {

    $.fn.extend({
        "lineFocus": function (options) {
            var opts = $.extend({}, defaluts, options); //使用jQuery.extend 覆盖插件默认参数
            return this.each(function () {  //这里的this 就是 jQuery对象。这里return 为了支持链式调用
               var $this = $(this); //获取当前dom 的 jQuery对象，这里的this是当前循环的dom
                //根据参数来设置 dom的样式
                $this.click(function(){ 

                    $this.addClass(opts.trHoverClass).siblings().removeClass(opts.trHoverClass);

                    var fieldSeloctor = opts.field.split(",");
                    $.each(fieldSeloctor,function(i,item){

                         var selectedFieldHtml = $this.find(item).html();
                         $(opts.showContent).find(item).html(selectedFieldHtml);
                    })

                });
               
            });

        }
    });
    //默认参数
    var defaluts = {
        trHoverClass: "",
        field:"",
        showContent:"",
    };


})(window.jQuery);
