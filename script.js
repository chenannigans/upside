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
	loadDate();


	function getData(){
	
			chrome.storage.sync.get(function(data){

				loadMemories(data);

			});
		
	}

	function getQuote(){
		var random = Math.floor(Math.random()*quotes.length);

		$(".quote").append("<h1>" + quotes[random] + "</h1>");

	}


	function loadDate(){
		var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var today = new Date();
		var currentDate = days[today.getDay()] + " " + months[today.getMonth()] + " " + today.getDate();
		$(".date").html(currentDate);
	}

	function loadMemories(data){
		
		$(".showMemories").empty();

		if (data.memories){
			for(i = 0; i < data.memories.length; i ++){

				if (data.memories[i]!=null){

					$(".showMemories").prepend("<input style = text id = 'edit'></input><br>");
					$("#edit").val(data.memories[i].text);
					$("#edit").attr('tag', data.memories[i].text+" "+data.memories[i].date);
				}
			}
		}	
				enterMemories(data);


	}


	$('#enterText').focus(function(){
	   $(this).data('placeholder',$(this).attr('placeholder'))
	          .attr('placeholder','');
	}).blur(function(){
	   $(this).attr('placeholder',$(this).data('placeholder'));
	});

	function enterMemories(data){
	
		$("#enterText").keydown(function(event){

			if(event.which==13){ //enter key
				var numMemories = 0;
				if(data.memories!=null){
					// numMemories = data.memories.length;
					// console.log(numMemories);
				}
					var text = $("#enterText").val();

					if (text.length>0 ){
						event.preventDefault();
							addMemory(text);
						$("#enterText").val("");//reset field

					
					}else{
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

	$("#loadHistory").click(function(){
		$(".analysis").hide();
		$(".main").fadeOut("slow", function(){
			$(".history").fadeIn("slow");
		});


	});

	$("#loadAnalysis").click(function(){
		
		$(".history").hide();
		$(".main").fadeOut("slow", function(){
			$(".analysis").fadeIn("slow");
		});


	});

	$("#loadMain").click(function(){
			$(".history").hide();
			$(".analysis").hide();
		
		$(".main").fadeIn("slow", function(){

		});
	});

	$("#delete-memory").click(function(){
		$(this).val("");
	});

	$(document).on('keydown', '#edit', function(){
		if (event.which==40){

			$(this).next().next().click();

		}
	});

	$(document).on('change', '#edit', function(){

		var selected = $(this);
		var len = $(this).attr('tag').length;
		var changedVal = $(this).val();
		var tagtxt = $(this).attr('tag').substring(0,len-16);
		var tagdate = $(this).attr('tag').substring(len-15,len);
		console.log(tagtxt,tagdate);	

		chrome.storage.sync.get(function(data){
			for (i =0;i<data.memories.length;i++){
				console.log(data);
				// var i = 0 ;
				for (var mems in data.memories){

				if (data.memories[i]!=null){
					console.log("exists");
				var txt = data.memories[i].text;
				var dte = data.memories[i].date;

				
					if (txt == tagtxt && dte == tagdate){
						if (changedVal == ""){
							console.log(i);
							console.log(delete data.memories[i]);
							break;
						}else{
						data.memories[i].text=('text', changedVal)
						break;
						}
					}
				
				}
				// else{
				// 	delete data.memories[i];
				}
				// i++;
			}
			// console.log(data);

			chrome.storage.sync.set(data,function(){
				loadMemories(data);
				
			});

		});

	});


	function addMemory(val){

		chrome.storage.sync.get(function(data){
			if(!data.memories){
				data.memories=[];
			}

			var today = new Date();
			var memory = {'text':val, 
						  'date': today.toString().substring(0,15)
						 }
			data.memories.push(memory);

			chrome.storage.sync.set(data,function(){
				loadMemories(data);
			});

		});	



	}


	


	





});