$(document).ready(function() {

	displayMemories();
	enterMemories();	





	function displayMemories(){
		var displayMemories = document.getElementById("display-memories")
		displayMemories.addEventListener('click', function(){
				document.getElementById("showMemories").innerHTML=document.getElementById("enterText").value + '<br>' + document.getElementById("showMemories").innerHTML ;
				document.getElementById("enterText").value = "";
		});
	}


	function enterMemories(){
	$("#enterText").keydown(function(event){
		if(event.which==13){
			if ($("#enterText").val().length>0 ){
				event.preventDefault();
				$("#display-memories").click();
			}
		}
	});
	}




});