$(document).ready(function() {

	// displayMemories();
	enterMemories();	
	// loadMemories();


	console.log(chrome.storage);

	function displayMemories(){

		// $("#showMemories").append($("#enterText").val());
		// $("#enterText").val("");



		// var displayMemories = document.getElementById("display-memories")
		// displayMemories.addEventListener('click', function(){
		// 		document.getElementById("showMemories").innerHTML=document.getElementById("enterText").value + '<br>' + document.getElementById("showMemories").innerHTML ;
		// 		document.getElementById("enterText").value = "";
		// });
	}

	function loadMemories(){
		var themem = chrome.storage.sync.get("memory");
		console.log(themem);

		$("#memoryLog").append(themem);
	}


	function enterMemories(){
		$("#enterText").keydown(function(event){
			if(event.which==13){
				if ($("#enterText").val().length>0 ){
					event.preventDefault();

					var newMemory = $("#enterText").val();
					storeData('memory', newMemory);
				

					// displayMemories();
					$("#enterText").val("");

				}
			}
		});
	}

	function storeData(key,val){
		chrome.storage.sync.set({key: val});
		console.log("stored ho");
	}




});