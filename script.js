$(document).ready(function() {
	
	//uncomment this to wipe the DB
	// clearStorage();

	getData();
	enterMemories();

	function getData(){
		// if (data){
			chrome.storage.sync.get(function(data){
				loadMemories(data)
			});
		// }
	}

	// console.log(data)
	// getData();
	// arr = [];	


	// function loadMemories(){
	// 	for (int i = 0; i < data.length; i ++){
	// 		$(".showMemories").prepend("<br>" + arr[arr.length-1]);		

	// 	}



	// }

	function loadMemories(data){
		// $(".showMemories").prepend("<br>" + array[array.length-1]);''
			// console.log(data)
			// $(".showMemories").val()
			// console.log("hi!");
		if (data.memories){
			console.log("works")
			for(i = 0; i < data.memories.length; i ++){
				$(".showMemories").prepend("<br>" + data.memories[i].text);		
			}
		}	
		
	}

	function displayNewMemory(val){
		// $(".showMemories").prepend("<br>" + array[array.length-1]);''
			// console.log(data)
			// $(".showMemories").val()
			// console.log("hi!");
			$(".showMemories").prepend("<br>" + val);		
		
	}


	function enterMemories(){
		$("#enterText").keydown(function(event){
			if(event.which==13){ //enter key
			var text = $("#enterText").val();

				if (text.length>0 ){
					event.preventDefault();
					addMemory(text);
					$("#enterText").val("");//reset field

				}
			}
		});
	}

	function clearStorage(){
		chrome.storage.sync.clear(function(data){
			console.log("W I P E D");
		});
	}

	function addMemory(val){

		chrome.storage.sync.get(function(data){
			if(!data.memories){
				data.memories=[];
			}

			var today = new Date();
			var memory = {'text':val, 
						  'date': + (today.getMonth()+1).toString() + "/" + (today.getDate()).toString()
						 }
			data.memories.push(memory);
			displayNewMemory(val);

			chrome.storage.sync.set(data,function(){
				// console.log(data)

				

			});
		});			
	}


});