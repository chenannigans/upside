$(document).ready(function() {
	
	//uncomment this to wipe the DB
	// clearStorage();
	var quotes = ["Happiness is not something ready made. It comes from your own actions - Dalai Lama",
				"Take care of all your memories. For you cannot relive them - Bob Dylan",
				"You can close your eyes to reality but not to memories - Stanislaw Jerzy Lec",
				"Follow effective action with quiet reflection. From the quiet reflection will come even more effective action - Peter Drucker",
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
		$(".quote").append("<h1>" + quotes[random] + "</h1>");

	}

	function loadMemories(data){
		
		$(".showMemories").empty();

		if (data.memories){
			console.log("works")
			for(i = 0; i < data.memories.length; i ++){

				$(".showMemories").prepend("<br> <input style = text id = 'edit'></input>");
				$("#edit").val(data.memories[i].text);
				$("#edit").attr('tag', data.memories[i].text+" "+data.memories[i].date);
			}
		}	

		
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

	$(document).on('change', '#edit', function(){

		// console.log("FUCKING PING");
		var len = $(this).attr('tag').length;
		var changedVal = $(this).val();
		var tagtxt = $(this).attr('tag').substring(0,len-6);
		var tagdate = $(this).attr('tag').substring(len-5,len);
		
		// console.log(tagtxt,tagdate);

		chrome.storage.sync.get(function(data){
		for (i =0;i<data.memories.length;i++){
			var txt = data.memories[i].text;
			var dte = data.memories[i].date;

			// console.log(txt,dte);
			if (txt == tagtxt && dte == tagdate){
				data.memories[i].text=('text', changedVal)
				console.log("this is true");
			}	
		}

		chrome.storage.sync.set(data,function(){
			// console.log("ping");
			});

		});



		// console.log($(this).attr('tag'));

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

			chrome.storage.sync.set(data,function(){
				loadMemories(data);
			});

		});	
			// displayNewMemory(val, (new Date().getMonth()+1).toString() + "/" + (new Date().getDate()).toString());


	}


	


	





});