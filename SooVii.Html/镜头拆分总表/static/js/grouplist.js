;(function(){

  //折叠面板
    $("#panelSwitch").on("click", function () {

        var $left = $("#panelLeft");
        var $right = $("#panelRight");

        if ($right.css("display") == "none") {

            $right.show();
            $(".main").removeClass("active");
        } else {

            $right.hide();
            $(".main").addClass("active");
        }
    })
    //添加特效
    $(document).on('click', '#assetsInfo p a', function () {
        var a = $(this);
        if (a.attr("class") == "add") {
            a.hide();
            var str = "<p><span>特效类型：</span><select class='form-control'><option value=\"\">请选择</option><option value=\"Assets\">Assets</option><option value=\"DMP\">DMP</option><option value=\"Matchmove/Track\">Matchmove/Track</option><option value=\"Anim\">Anim</option><option value=\"Light\">Light</option><option value=\"Hair\">Hair</option><option value=\"MG\">MG</option><option value=\"FX\">FX</option><option value=\"Roto\">Roto</option><option value=\"Paint\">Paint</option><option value=\"Comp\">Comp</option></select><span>名称：</span><input type=\"text\" class='form-control'><span>难度：</span><select class='form-control'><option value=\"\">请选择</option><option value=\"A\">A</option><option value=\"B\">B</option><option value=\"C\">C</option><option value=\"D\">D</option><option value=\"E\">E</option></select><span>Manday:</span><input type=\"text\" class='form-control'><a class=\"add\"></a><a class=\"del\"></a></p>";
            $("#assetsInfo").append(str);
        } else {
            var p = a.parent();
            if (p.next().length == 0) {
                p.prev().find("a").show();
            }
            p.remove();
        }

    })

//分组操作
    //未分组文件统计
    function flieListInit() {
        var fisrtFileName = $('.ungroup').find(".screenshot-item").eq(0).find(".item-name").text();
        var fisrtFileNum = $('.ungroup').find('.screenshot-item').length;
        $('.ungroup').find('.g-fliename').text(fisrtFileName);
        $('.ungroup').find('#ungroupFileNum').text(fisrtFileNum);
        if (fisrtFileNum == 0) {
            $('.ungroup').hide();
        }

    }

    //删除分组子节点
    $(document).on('click', '.js-groupItemDel', function () {
        var $checkItems = $(this).parent().parent().find(".screenshot-item").find("input[type='checkbox']:checked");
        $checkItems.parent().parent().remove();
        flieListInit();
    })

    flieListInit();
    var groupsArr = [""];
    $(".js-addGroup").on("click", function () {
        var groupVal = "";
        var flag = 0;
        var itemHtmls = '';
        var groupName = $("#fGroupName").find("option:selected").text();
        var groupTag = $("#groupTag").val();

        if (groupTag == "") {
            alert('请填写分组标签');
            return false;
        }
        $("input[name='ungroup']:checkbox").each(function (i) {
            groupVal = $("#fGroupName").find("option:selected").val();
            if ($(this).is(':checked')) {
                $(this).removeClass("id-checkbox").addClass("group-" + groupVal);
                $(this).parent().parent(".screenshot-item").remove();
                itemHtmls += '<dl class="screenshot-item">' + $(this).parent().parent(".screenshot-item").html() + '</dl>';
                flag += 1;
                flieListInit();
            }
        });

        if (0 < flag) {
            var isExist = false;
            $.each(groupsArr, function (i, val) {

                if (groupName == groupsArr[i]) {

                    $(".grouping-box-wrap[data-groupcode='" + groupName + "']").find(".grouping-list").append(itemHtmls);
                    isExist = true;
                }

            });
            if (!isExist) {
                var groupHtmlStr = ['<div class="grouping-box-wrap" data-groupcode=' + groupName + '>',
                    '                        <p><strong class="group-sort inlineblock">' + groupName + '</strong>',
                    '                            <span class="group-tag inlineblock">' + groupTag + '</span>',
                    '                            <input type="checkbox" name="" class="inlineblock" data-check-target=".group-' + groupVal + '" onclick="selectAll(this)">全选',
                    '                            <a herf="javascript:;" class="btn-del-group js-groupItemDel" data-code=' + groupVal + '>删除</a>',
                    '                        </p>',
                    '                        <div class="grouping-list"> ',
                    '                        </div>                      ',
                    '</div>'].join("");
                $(".js-groupingBox").append(groupHtmlStr);
                $(".grouping-box-wrap[data-groupcode='" + groupName + "']").find(".grouping-list").append(itemHtmls);
                groupsArr.push(groupName);
            }


        } else {
            alert('请至少选择一项！');
            return false;
        }


    });


    //拖拽分组

    // var range = {x: 0, y: 0};//鼠标元素偏移量
    // var lastPos = {x: 0, y: 0, x1: 0, y1: 0}; //拖拽对象的四个坐标

    // var theDiv = null, move = false, singe;//拖拽对象 拖拽状态
    // var theDivHeight = 0, theDivHalf = 0;
    // tarFirstY = 0; //拖拽对象的索引、高度、的初始化。
    // var tarDiv = null, tarFirst, tempDiv;  //要插入的目标元素的对象, 临时的虚线对象

    // $(".screenshot-item").each(function () {
    //     $(this).mousedown(function (event) {
    //         //拖拽对象
    //         move = true;
    //         theDiv = $(this);

    //         //鼠标元素相对偏移量
    //         range.x = event.pageX - theDiv.offset().left;
    //         range.y = event.pageY - theDiv.offset().top;

    //         theDivHeight = theDiv.height();
    //         theDivHalf = theDivHeight / 2;


    //         theDiv.attr("class", "itemdash");

    //         // 创建新元素 插入拖拽元素之前的位置(虚线框)
    //         // $("<dl class='dash'></dl>").insertBefore(theDiv);

    //     });
    // });

    // $(document).mousemove(function (event) {
    //     if (!move) return false;

    //     lastPos.x = event.pageX - range.x;
    //     lastPos.y = event.pageY - range.y;
    //     lastPos.y1 = lastPos.y + theDivHeight;

    //     // 拖拽元素随鼠标移动
    //     theDiv.css({left: lastPos.x + 'px', top: lastPos.y + 'px'});
    //     // 拖拽元素随鼠标移动 查找插入目标元素


    // }).mouseup(function (event) {
    //     move = false;
    //     //alert(theDiv.offset().left+","+theDiv.offset().top)
    //     if(theDiv!==null){
    //          theDiv.attr("class", "screenshot-item"); //恢复对象的初始样式
    //      }else{
    //         return false
    //      }
       
    //     // $(".grouping-box-wrap").css("border","1px solid #999");
    //     //$('.itemdash').remove(); // 删除新建的虚线div
    //     if (theDiv.offset().top == lastPos.y) {

    //         return false
    //     } else {

    //         $(".grouping-box-wrap").each(function (i) {
    //             var boxY = $(this).offset().top;
    //             var boxMaxY = $(this).offset().top + $(this).height() + $(this).css('marginBottom');

    //             if (lastPos.y < boxY) {   //拖拽对象移动左边于容器坐标
    //                 singe = i;
    //                 $(".grouping-box-wrap").eq(i - 1).find(".grouping-list").prepend(theDiv);
    //                 return false;
    //             }

    //         });
    //         if (singe === undefined) {

    //             var num = $(".grouping-box-wrap").length;
    //             //  $(".grouping-box-wrap").eq(num-1).css("border"," 1px dashed #999");
    //             $(".grouping-box-wrap").eq(num - 1).find(".grouping-list").prepend(theDiv);

    //         }
    //     }


    // });



}());