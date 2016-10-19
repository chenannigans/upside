
document.addEventListener('DOMContentLoaded', function() {
	var displayMemories = document.getElementById("display-memories")
	displayMemories.addEventListener('click', function(){
			document.getElementById("showMemories").innerHTML+=document.getElementById("enterText").value + '<br>';
			document.getElementById("enterText").value = "";
	});


	$("#enterText").keydown(function(event){
	if(event.which==13){
		if ($("#enterText").val().length>0 ){
		event.preventDefault();
		$("#display-memories").click();
	}
	}
		

});
});