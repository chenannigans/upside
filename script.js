$(document).ready(function() {
	
	//uncomment this to wipe the DB
	// clearStorage();

	loadCalendar();
	getQuote();	
	loadData();
	loadDate();
	pickDateIcon();
	loadMain();
	getCanvas();

	var placeHolder = "Write something that brightened your day";

	window.onload = function() {
    try {
      TagCanvas.Start('myCanvas');
    } catch(e) {
      // something went wrong, hide the canvas container
      document.getElementById('myCanvasContainer').style.display = 'none';
    }
  };

  function getCanvas() {
  	TagCanvas.textColour = 'white';
  	TagCanvas.outlineMethod = 'none';

  }

  // if( ! $('#myCanvas').tagcanvas({
  //   textColour: '#ffffff',
  //   outlineThickness : 1,
  //   maxSpeed : 0.03,
  //   depth : 0.75,
  // })) {
  //    // TagCanvas failed to load
  //   $('#myCanvasContainer').hide();
  // }
$(function () {
    $(":file").change(function () {
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = imageIsLoaded;
            reader.readAsDataURL(this.files[0]);
        }
    });
});

function imageIsLoaded(e) {
	// console.log(e.target.result);
    // $('#previewImg').attr('src', e.target.result);]
    $('body').css('background-image', 'url('+e.target.result +')');

};


	function loadData(){

			chrome.storage.sync.get(function(data){
				loadBackground(data);
				loadMemories(data);
				promptText(data);
				$("#enterText").attr('placeholder', placeHolder)

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
		var currentDate = days[today.getDay()] + ", " + months[today.getMonth()] + " " + today.getDate();
		$(".date").html(currentDate);
	}

	function formatDate(date){
		var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var currentDate = days[date.getDay()] + ", " + months[date.getMonth()] + " " + date.getDate();

	}



	function loadMemories(data){
		
		if (data.settings[1].privacyMode==true){		
 			$(".showMemories").hide();		
 			$(".random").hide();
 			$("#private-memories").attr("checked", true);	
 				
 	}
		$(".showMemories").empty();
		$(".random").empty();
		$("#calendar").fullCalendar('removeEventSources');
		$("#myCanvas").empty();
		$("#myCanvas").append("<ul>");
		if (data.memories){
			var randomMemory = data.memories[Math.floor(Math.random()*data.memories.length)][0];
			$(".random").append("<h5>" + randomMemory.start + " " + randomMemory.title + "</h5>");

			for(i = 0; i < data.memories.length; i ++){

				if (data.memories[i][0]!=null){
					//load calendar
					$("#calendar").fullCalendar('addEventSource', data.memories[i]);
					//load cloud
					// $("#myCanvas").append("<li><a href= ''>"+data.memories[i][0].title+"</a></li>");

					if (data.memories[i][0].start == getFormattedDate()){
						$(".showMemories").prepend("<input style = text id = 'edit'></input><br>");
						//<button type = button id = 'delete'>x</button>
						$("#edit").val(data.memories[i][0].title);
						$("#edit").attr('tag', data.memories[i][0].title+"|"+data.memories[i][0].start);
					}
				}
				
			}
			wordCount(data.memories);
		}	
		// $("#myCanvas").append("</ul>");
      TagCanvas.Start('myCanvas');

			enterMemories(data);
	}

	function wordCount(memories) {
		words = new Array();
		for (i=0; i < memories.length; i++) {
			var memory = memories[i][0].title;
			// console.log("Memory is: " + memories[i][0].title);
			var memoryWords = memory.split(" ");
			// console.log(memoryWords);
			// just get the words
			var wordsArray = $.map(memoryWords, function(value, index) { return [value]; });
			// combine to a cumulative list of words
			words.push(wordsArray);
		}
		var merged = [].concat.apply([], words);
		// console.log("All words: " + merged);
		console.log(merged);
		for (i=0; i < merged.length; i++) {
			$("#myCanvas").append("<li><a href=''>"+merged[i]+"</a></li>");
		}
	}

	// $("#myCanvas").append("<li><a href= ''>"+data.memories[i][0].title+"</a></li>");

	function promptText(data){

		if (data.memories){
			var num = data.memories.length;
		
			if (num > 0){
				placeHolder = "Doing good";
			}
			if (num >1){
				placeHolder = "Keep it going";

			}
			if (num >2){
				placeHolder = "Such good memories!";

			}
			if (num>3) {
				placeHolder = "You're a superstar";
			}
		}else{
			placeHolder = "Write something good that brightened your day";

		}		

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

	function getFormattedDate(){
		var today = new Date();
		var realMonth = today.getMonth()+1;
		var day = today.getDate();

		//append 0 to beginning if single digit, for calendar formatting
		var month =  realMonth>9 ? realMonth : "0"+realMonth;
		day = day>9? day: "0"+day;
		// console.log(day);

		var formattedDate = today.getFullYear() +"-"+ month +"-"+ day; 
		// console.log(formattedDate);
		return formattedDate;
	}



	function pickDateIcon() {
		var today = new Date();
		var day = today.getDate();
		var path = "images/days/day" + day + ".png"
		document.getElementById("dayIcon").src=path;
	}

	function loadMain(){
		lastTab = ".main";
		$(".history").hide();
		$(".analysis").hide();	
		$(".settings").hide();	
		$(".main").fadeIn("slow");
		lastTab = ".main"
	}


	// $('#enterText').focus(function(){
	//    $(this).data('placeholder',$(this).attr('placeholder'))
	//           .attr('placeholder','');
	//           console.log($(this).data('placeholder'));
	// }).blur(function(){
	//    $(this).attr('placeholder',$(this).data('placeholder'));
	// });

$('#enterText').focus(function(){
	$(this).removeAttr('placeholder')
});

$('#enterText').focusout(function(){
	$(this).attr('placeholder', placeHolder)
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

	$("#delete-memory").click(function(){
		$(this).val("");
	});

	$(document).on('keydown', '#edit', function(){
		if (event.which==40){
			$(this).next().next().click();
		}
	});

	// SETTINGS OPTIONS

	$("#clear-database").click(function(){
		if (confirm('Are you sure you want to clear all memories? There are some good ones in there!')){
			chrome.storage.sync.clear(function(data){
				location.reload();
			});
		}else{
			return false;
		}
	});

	$("#private-memories").click(function(){

		$(".showMemories").toggle();
		$(".random").toggle();
		if ($("#private-memories").attr("checked")==true){
			$("#private-memories").attr("checked", false);
		}else{
			$("private-memories").attr("checked", true);
		}
		
		chrome.storage.sync.get(function(data){
			data.settings[1].privacyMode=!data.settings[1].privacyMode;
			chrome.storage.sync.set(data);

		});

	});

	// NAVIGATIONAL TABS

	$("#loadMain").click(function(){
		$(".history").toggle(false);
		$(".analysis").toggle(false);
		$(".settings").toggle(false);	
		$(".main").fadeIn("slow");
		lastTab = ".main"
	});

	$("#loadHistory").click(function(){
		$(".analysis").toggle(false);
		$(".settings").toggle(false);
		$(".main").fadeOut("slow", function(){
			loadCalendar();
			$(".history").fadeIn("slow");
			lastTab = ".history"
		});
	});

	$("#loadAnalysis").click(function(){
		$(".history").toggle(false);
		$(".settings").toggle(false);
		$(".main").fadeOut("slow", function(){
			// loadCloud();
			$(".analysis").fadeIn("slow");
		});
		lastTab = ".analysis"
	});

	$("#loadSettings").click(function(){
		$(".settings").toggle();
		$(lastTab).toggle();
	});

	// CHANGE BACKGROUNDS
	$("#bg-1").click(function(){
		img = "images/bg1.jpg"
		document.getElementById("body").background=img;
		setBackground(1);
	});

	$("#bg-2").click(function(){
		img = "images/bg2.jpg"
		document.getElementById("body").background=img;
		setBackground(2);
	});

	$("#bg-3").click(function(){
		img = "images/bg3.jpg"
		document.getElementById("body").background=img;
		setBackground(3);

	});

	$("#bg-4").click(function(){
		img = "images/bg4.jpg"
		document.getElementById("body").background=img;
		setBackground(4);

	});

	$("#bg-5").click(function(){
		img = "images/bg5.jpg"
		document.getElementById("body").background=img;
		setBackground(5);

	});

	$("#bg-6").click(function(){
		img = "images/bg6.jpg"
		document.getElementById("body").background=img;
		setBackground(6);
	});

	//this initializes the rest of the setting array
	function loadBackground(data){
		var num;
		if (!data.settings){
			console.log("this should only happen once");
			data.settings=[];
			num =6;
			var background = {'background': num};
			var privacyMode = {'privacyMode': false};
			data.settings.push(background);
			data.settings.push(privacyMode);

			chrome.storage.sync.set(data);

		}
		else{
			num = data.settings[0].background;

		}
		

		var img = "images/bg"+num+".jpg";
		console.log(img);
			// $('body').css('background', "images/bg"+num+".jpg");\
			document.getElementById("body").background=img;
			$("#bg-"+num).css("color","black");


	}


	function setBackground(num){

		chrome.storage.sync.get(function(data){
			$("#bg-"+data.settings[0].background).css("color","white");
			data.settings[0].background=num;
				

			// console.log(num);
			// var background = {'background': num};
			// data.settings.push(background);

			chrome.storage.sync.set(data,function(){
				loadBackground(data);
			});

		});


	}

	function addMemory(val){
	chrome.storage.sync.get(function(data){
			if(!data.memories){
				data.memories=[];
			}

			formattedDate = getFormattedDate();

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



	//***TO BE IMPLEMENTED: DELETE BUTTON

	// $(document).on('click','#delete', function(){


	// 	var selected = $(this).prev("#x");
	// 	console.log(selected);
	// 	// var len = selected.attr('tag').length;
	// 	var changedVal = selected.val();
	// 	var tagtxt = $(this).attr('tag').substring(0,len-11);
	// 	var tagdate = $(this).attr('tag').substring(len-10,len);
	// 	chrome.storage.sync.get(function(data){

	// 		for (i =0;i<data.memories.length;i++){
	// 			for (var mems in data.memories){
	// 				if (txt == tagtxt && dte == tagdate){
	// 					console.log(delete data.memories[i][0]);
	// 				}	
	// 			}
	// 		}

	// 		chrome.storage.sync.set(data,function(){
	// 			loadMemories(data);
	
	// 		});

	// 	});
	// });

	$(document).on('change', '#edit', function(){

		var selected = $(this).closest("#edit");
		var len = $(this).attr('tag').length;
		var changedVal = $(this).val();
		var tagtxt = $(this).attr('tag').substring(0,len-11);
		var tagdate = $(this).attr('tag').substring(len-10,len);
		// console.log(tagtxt,tagdate);	
		
		var escaped = $(this).attr('escaped');

		console.log(tagtxt);
		if (escaped){
			tagtxt = tagtxt.replace(/\u00A0/g,' ');
			changedVal = changedVal.replace(/\u00A0/g,' ');
		}

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

			formattedDate = getFormattedDate();

			var memory = [{'title':val, 
						  'start': formattedDate
						 }]

			$("#calendar").fullCalendar('addEventSource', memory);
			console.log(memory);

			data.memories.push(memory);

			chrome.storage.sync.set(data,function(){
				loadMemories(data);
				if (data.memories){
				promptText(data);
			}
			});

		});	
		



	}


	function loadCalendar(){
		var startDate;
		$('#calendar').fullCalendar({

			header: {
				left: 'prev,next',
				center: 'title',
				right: 'listWeek,month'
			},

			// customize the button names,
			// otherwise they'd all just say "list"
			views: {
				listDay: { buttonText: 'day' },
				listWeek: { buttonText: 'week' },
				month: { buttonText: 'month' }
			},


			defaultView: 'month',
			defaultDate: new Date(),
			fixedWeekCount: false,
			navLinks: true, // can click day/week names to navigate views
			editable: true,
			eventLimit: true, // allow "more" link when too many events

			// dayClick: function(date){
			// 	alert('Clicked on: ' + date.format());
			// },

			eventDragStart: function(event){
				startDate = event._start._i;
				// console.log(event._start._i);
			},

			eventDrop: function(event){
				var endDate = event.start.format();
				var text = event.title;
				var duplicate = false;
				console.log(endDate, text);

				chrome.storage.sync.get(function(data){
					for (i =0;i<data.memories.length;i++){
						// var i = 0 ;
						for (var mems in data.memories){

							if (data.memories[i][0]!=null){
							var txt = data.memories[i][0].title;
							var dte = data.memories[i][0].start;

							
								if (txt == text && dte == startDate && !duplicate){
									data.memories[i][0].start=('start', endDate)
									duplicate=true;
									break;
								}
							
							}
					
						}
					}

					chrome.storage.sync.set(data,function(){
						loadMemories(data);
					});
				});

			}



		});
	}


});

	var quotes = ["Happiness is not something ready made. It comes from your own actions - Dalai Lama",
				"Take care of all your memories. For you cannot relive them - Bob Dylan",
				"You can close your eyes to reality but not to memories - Stanislaw Jerzy Lec",
				"Follow effective action with quiet reflection. From the quiet reflection will come even more effective action - Peter Drucker",
				"Once you replace negative thoughts with positive ones, you'll start having positive results - Willie Nelson",
				"When you realize nothing is lacking, the whole world belongs to you - Lao Tzu",
				"Pessimism leads to weakness, optimism to power - William James",
				"Difficult roads often lead to beautiful destinations - Unknown",
				"Attitude is a little thing that makes a big difference - Winston Churchill",
				"Find a place inside where there's joy, and the joy will burn out the pain - Joseph Campbell",
				"In order to carry a positive action, we must develop here a positive vision - Dalai Lama",
				"A strong, positive self-image is the best possible preparation for success - Joyce Brothers",
				"You cannot have a positive life and a negative mind - Joyce Meyer",
				"Change your thoughts and you change your world - Norman Vincent Peale",
				"Believe you can and you're halfway there - Theodore Roosevelt",
				"Sometimes the wrong train can take us to the right place - Paulo Coelho",
				"I am not what has happened to me, I am what I chose to become - Carl Jung",
				"The greatest glory in living lies not in never falling, but in rising every time we fall - Nelson Mandela",
				"Life is not a matter of holding good cards, but sometimes, playing a poor hand well - Jack London",
				"LIfe is short. Smile while you still have teeth - Mallory Hopkins",
				"Money will not buy happiness, but it will let you be unhappy in nice places - Unkown",
				"Always remember you are absolutely unique. Just like everyone else - Margaret Mead",
				"A day without sunshine is like, you know, night - Steve Martin",
				"Even if you are on the right track, you'll get run over if you just sit there - Will Rogers"]