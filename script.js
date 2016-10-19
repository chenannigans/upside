
document.addEventListener('DOMContentLoaded', function() {
	var displayMemories = document.getElementById("display-memories")
	displayMemories.addEventListener('click', function(){
			if($("#enterText")){
				console.log($("#enterText"));
			document.getElementById("showMemories").innerHTML+=document.getElementById("enterText").value + '<br>';
			document.getElementById("enterText").value = "";
		}
	});


	$("#enterText").keydown(function(event){
	if(event.which==13){
		event.preventDefault();
		$("#display-memories").click();
	}
		

});
});