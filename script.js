$(document).ready(function() {
	
	//uncomment this to wipe the DB
	// clearStorage();
	var quotes = ["Happiness is not something ready made. It comes from your own actions - Dalai Lama",
				"Take care of all your memories. For you cannot relive them - Bob Dylan",
				"You can close your eyes to reality but not to memories - Stanislaw Jerzy Lec",
				"Follow effective action with quite reflection. From the quiet reflection will come even more effective action - Peter Drucker",
				"Once you replace negative thoughts with positive ones, you'll start having positive results - Willie Nelson",
				"When you realize nothing is lacking, the whole world belongs to you - Lao Tzu"]
	getQuote();
	getData();
	enterMemories();


	function getData(){
	
			chrome.storage.sync.get(function(data){
				loadMemories(data)
			});
		
	}

	function getQuote(){
		var random = Math.floor(Math.random()*quotes.length);
		console.log(random);
		$(".quote").append("<h3>" + quotes[random] + "</h3");

	}

	function loadMemories(data){
		
		if (data.memories){
			console.log("works")
			for(i = 0; i < data.memories.length; i ++){
				$(".showMemories").prepend("<br>" + data.memories[i].text);		
			}
		}	
		
	}

	function displayNewMemory(val){
		
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

	$("#clear-database").click(function(){
		chrome.storage.sync.clear(function(data){
			console.log("W I P E D");
		});
		location.reload();
	});

	// function clearStorage(){
		
	// }

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

			});
		});			
	}





});