$(function() {
	$("#menu").hover(function() {
		$(this).find("div").show();
	}, function() {
		$(this).find("div").hide();
	});
	$("#setting").hover(function() {
		$(this).find("div").show();
	}, function() {
		$(this).find("div").hide();
	});
	$("#msg").click(function() {
		$(this).next().show();
	})
	$("#close-msg").click(function() {
		$(this).parent().hide();
	})

})