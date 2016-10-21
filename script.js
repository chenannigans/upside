$(document).ready(function() {

var array = [];
	// displayMemories();
	enterMemories();	
	// loadMemories();


	// console.log(chrome.storage);

	function displayMemories(){
		$(".showMemories").prepend("<br>" + array[array.length-1]);
		
	}

	function loadMemories(){
		var themem = chrome.storage.sync.get("memory");
		console.log(themem);

		$("#memoryLog").append(themem);
	}


	function enterMemories(){
		$("#enterText").keydown(function(event){
			if(event.which==13){
			var text = $("#enterText").val();

				if (text.length>0 ){
					event.preventDefault();

					// var newMemory = $("#enterText").val();
					// storeData('memory', newMemory);

					array.push(text);
					displayMemories();
					// console.log(text);
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