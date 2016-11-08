$(document).ready(function() {
	
	//uncomment this to wipe the DB
	// clearStorage();

	loadCalendar();
	getQuote();	
	getData();
	loadDate();
	pickDateIcon();

	
	function loadCalendar(){
		$('#calendar').fullCalendar({

			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'listDay,listWeek,month'
			},

			// customize the button names,
			// otherwise they'd all just say "list"
			views: {
				listDay: { buttonText: 'list day' },
				listWeek: { buttonText: 'list week' }
			},


			defaultView: 'listWeek',
			defaultDate: new Date(),
			fixedWeekCount: false,
			navLinks: true, // can click day/week names to navigate views
			editable: true,
			eventLimit: true, // allow "more" link when too many events
			
			dayClick: function(date){
				alert('Clicked on: ' + date.format());
			},



		});
	}

	function getData(){
	
			chrome.storage.sync.get(function(data){

				loadMemories(data);
				populateCalendar(data);
			});
		
	}

	// function populateCalendar(data){

	// 	$("#calendar").fullCalendar('events')
	// }

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
		
		// console.log(data.memories);
		$(".showMemories").empty();

		if (data.memories){
			for(i = 0; i < data.memories.length; i ++){

				if (data.memories[i][0]!=null){
					// $("#calendar").fullCalendar('addEventSource', data.memories[i]);
					$(".showMemories").prepend("<input style = text id = 'edit'></input><br>");
					$("#edit").val(data.memories[i][0].title);
					$("#edit").attr('tag', data.memories[i][0].title+" "+data.memories[i][0].start);
				}
			}
		}	
				enterMemories(data);


	}

	function populateCalendar(data){

		if (data.memories){
			for(i = 0; i < data.memories.length; i ++){

				if (data.memories[i][0]!=null){
					$("#calendar").fullCalendar('addEventSource', data.memories[i]);
				}
			}
		}	

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
		var tagtxt = $(this).attr('tag').substring(0,len-11);
		var tagdate = $(this).attr('tag').substring(len-10,len);
		// console.log(tagtxt,tagdate);	

		chrome.storage.sync.get(function(data){
			for (i =0;i<data.memories.length;i++){
				// var i = 0 ;
				for (var mems in data.memories){

					if (data.memories[i][0]!=null){
					var txt = data.memories[i][0].title;
					var dte = data.memories[i][0].start;

					
						if (txt == tagtxt && dte == tagdate){
							if (changedVal == ""){
								console.log(delete data.memories[i][0]);
								break;
							}else{
							data.memories[i][0].title=('title', changedVal)
							break;
							}
						}
					
					}
			
				}
			}

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
			var realMonth = today.getMonth()+1;
			var day = today.getDate();

			//append 0 to beginning if single digit, for calendar formatting
			var month =  realMonth>9 ? realMonth : "0"+realMonth;
			day = day>10? day: "0"+day;

			var formattedDate = today.getFullYear() +"-"+ month +"-"+ day; 
			// console.log(formattedDate);
			var memory = [{'title':val, 
						  'start': formattedDate
						 }]

			$("#calendar").fullCalendar('addEventSource', memory);
			console.log(memory);

			data.memories.push(memory);

			chrome.storage.sync.set(data,function(){
				loadMemories(data);
			});

		});	



	}

	function pickDateIcon() {
		var today = new Date();
		var day = today.getDate();
		if (day == 1) {
			$("#loadMain").css('background-image', 'url(' + "images/days/day01.png" + ')');
		}
		else if (day == 2) {
			$("#loadMain").css('background-image', 'url(' + "images/days/day02.png" + ')');
		}
		else if (day == 3) {
			$("#loadMain").css('background-image', 'url(' + "images/days/day03.png" + ')');
		}
		else if (day == 4) {
			$("#loadMain").css('background-image', 'url(' + "images/days/day04.png" + ')');
		}
		else if (day == 5) {
			$("#loadMain").css('background-image', 'url(' + "images/days/day05.png" + ')');
		}
		else if (day == 6) {
			$("#loadMain").css('background-image', 'url(' + "images/days/day06.png" + ')');
		}
		else if (day == 7) {
			$("#loadMain").css('background-image', 'url(' + "images/days/day07.png" + ')');
		}
		else if (day == 8) {
			$("#loadMain").css('background-image', 'url(' + "images/days/day08.png" + ')');
		}
		else if (day == 9) {
			$("#loadMain").css('background-image', 'url(' + "images/days/day09.png" + ')');
		}
		else if (day == 10) {
			$("#loadMain").css('background-image', 'url(' + "images/days/day10.png" + ')');
		}
		else if (day == 11) {
			$("#loadMain").css('background-image', 'url(' + "images/days/day11.png" + ')');
		}
		else if (day == 12) {
			$("#loadMain").css('background-image', 'url(' + "images/days/day12.png" + ')');
		}
		else if (day == 13) {
			$("#loadMain").css('background-image', 'url(' + "images/days/day13.png" + ')');
		}
		else if (day == 14) {
			$("#loadMain").css('background-image', 'url(' + "images/days/day14.png" + ')');
		}
		else if (day == 15) {
			$("#loadMain").css('background-image', 'url(' + "images/days/day15.png" + ')');
		}
		else if (day == 16) {
			$("#loadMain").css('background-image', 'url(' + "images/days/day16.png" + ')');
		}
		else if (day == 17) {
			$("#loadMain").css('background-image', 'url(' + "images/days/day17.png" + ')');
		}
		else if (day == 18) {
			$("#loadMain").css('background-image', 'url(' + "images/days/day18.png" + ')');
		}
		else if (day == 19) {
			$("#loadMain").css('background-image', 'url(' + "images/days/day19.png" + ')');
		}
		else if (day == 20) {
			$("#loadMain").css('background-image', 'url(' + "images/days/day20.png" + ')');
		}
		else if (day == 21) {
			$("#loadMain").css('background-image', 'url(' + "images/days/day21.png" + ')');
		}
		else if (day == 22) {
			$("#loadMain").css('background-image', 'url(' + "images/days/day22.png" + ')');
		}
		else if (day == 23) {
			$("#loadMain").css('background-image', 'url(' + "images/days/day23.png" + ')');
		}
		else if (day == 24) {
			$("#loadMain").css('background-image', 'url(' + "images/days/day24.png" + ')');
		}
		else if (day == 25) {
			$("#loadMain").css('background-image', 'url(' + "images/days/day25.png" + ')');
		}
		else if (day == 26) {
			$("#loadMain").css('background-image', 'url(' + "images/days/day26.png" + ')');
		}
		else if (day == 27) {
			$("#loadMain").css('background-image', 'url(' + "images/days/day27.png" + ')');
		}
		else if (day == 28) {
			$("#loadMain").css('background-image', 'url(' + "images/days/day28.png" + ')');
		}
		else if (day == 29) {
			$("#loadMain").css('background-image', 'url(' + "images/days/day29.png" + ')');
		}
		else if (day == 30) {
			$("#loadMain").css('background-image', 'url(' + "images/days/day30.png" + ')');
		}
		else{
			$("#loadMain").css('background-image', 'url(' + "images/days/day31.png" + ')');
		}

	}




});

	var quotes = ["Happiness is not something ready made. It comes from your own actions - Dalai Lama",
				"Take care of all your memories. For you cannot relive them - Bob Dylan",
				"You can close your eyes to reality but not to memories - Stanislaw Jerzy Lec",
				"Follow effective action with quiet reflection. From the quiet reflection will come even more effective action - Peter Drucker",
				"Once you replace negative thoughts with positive ones, you'll start having positive results - Willie Nelson",
				"When you realize nothing is lacking, the whole world belongs to you - Lao Tzu",
				"Pessimism leads to weakness, optimism to power - William James",
				"Attitude is a little thing that makes a big difference - Winston Churchill",
				"Find a place inside where there's joy, and the joy will burn out the pain - Joseph Campbell",
				"In order to carry a positive action, we must develop here a positive vision - Dalai Lama",
				"A strong, positive self-image is the best possible preparation for success - Joyce Brothers",
				"You cannot have a positive life and a negative mind - Joyce Meyer",
				"Change your thoughts and you change your world - Norman Vincent Peale",
				"Believe you can and you're halfway there - Theodore Roosevelt"]