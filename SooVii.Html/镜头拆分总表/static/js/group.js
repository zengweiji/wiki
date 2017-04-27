var $group = $( ".group-0" ),
    $ungroup = $( ".group-1"),
    $groupItem = $( ".group-0 li"),
    $ungroupItem = $( ".group-1 li" );

// 让分组A的条目可拖拽
$groupItem.draggable({
    cancel: "a.ui-icon", // 点击一个图标不会启动拖拽
    revert: "invalid", // 当未被放置时，条目会还原回它的初始位置
    containment: "document",
    helper: "clone",
    cursor: "move"
});
// 让分组B的条目可拖拽
$ungroupItem.draggable({
    cancel: "a.ui-icon", // 点击一个图标不会启动拖拽
    revert: "invalid", // 当未被放置时，条目会还原回它的初始位置
    containment: "document",
    helper: "clone",
    cursor: "move"
});
// 让分组A可放置，接受分组A的条目
$ungroup .droppable({
    accept: ".group-0 >li",
    activeClass: "ui-state-highlight",
    drop: function( event, ui ) {
        goNewGroup( ui.draggable,$ungroup );
    }
});

// 让分组A可放置，接受分组B的条目
$group.droppable({
    accept: ".group-1 >li",
    activeClass: "ui-state-highlight",
    drop: function( event, ui ) {
        goNewGroup( ui.draggable,$group );
    }
});

// li分组功能
function goNewGroup( $item,$container ) {

    $item.fadeOut(function() {
        $item.fadeOut(function() {
            $item.appendTo($container).fadeIn();
        });
    });
}