$(document).ready(function() {
	
	//uncomment this to wipe the DB
	// clearStorage();

	loadCalendar();
	getQuote();	
	getData();
	loadDate();
	pickDateIcon();
	loadMain();
	getCanvas();
	

	window.onload = function() {
    try {
      TagCanvas.Start('myCanvas');
    } catch(e) {
      // something went wrong, hide the canvas container
      document.getElementById('myCanvasContainer').style.display = 'none';
    }
    console.log('hi');
  };

  function getCanvas() {
  	if(!$('#myCanvas').tagcanvas({
  		textColour: '#ffffff',
  		depth: 0.8,
  		maxSpeed: 0.03,
  	}, 'tags')) {
  		// something went wrong, hide the canvas container
  		$('#myCanvasContainer').hide();
  	}
  	console.log('do i go here?');
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
	console.log(e.target.result);
    // $('#previewImg').attr('src', e.target.result);
    $('body').css('background-image', 'url('+e.target.result +')');
};

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
		var currentDate = days[today.getDay()] + ", " + months[today.getMonth()] + " " + today.getDate();
		$(".date").html(currentDate);
	}

	function loadMemories(data){
		
		$(".showMemories").empty();
		$("#calendar").fullCalendar('removeEventSources');
		$("#myCanvas").empty();
		$("#myCanvas").append("<ul>");
		if (data.memories){
			for(i = 0; i < data.memories.length; i ++){

				if (data.memories[i][0]!=null){
					//load calendar
					$("#calendar").fullCalendar('addEventSource', data.memories[i]);
					//load cloud
					$("#myCanvas").append("<li><a href= ''>"+data.memories[i][0].title+"</a></li>");

					if (data.memories[i][0].start == getFormattedDate()){
						$(".showMemories").prepend("<input style = text id = 'edit'></input><br>");
						//<button type = button id = 'delete'>x</button>
						$("#edit").val(data.memories[i][0].title);
						$("#edit").attr('tag', data.memories[i][0].title+"|"+data.memories[i][0].start);
					}
				}
			}
		}	
		// $("#myCanvas").append("</ul>");
      TagCanvas.Start('myCanvas');

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

	function getFormattedDate(){
		var today = new Date();
		var realMonth = today.getMonth()+1;
		var day = today.getDate();

		//append 0 to beginning if single digit, for calendar formatting
		var month =  realMonth>9 ? realMonth : "0"+realMonth;
		day = day>9? day: "0"+day;
		console.log(day);



		var formattedDate = today.getFullYear() +"-"+ month +"-"+ day; 

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
		chrome.storage.sync.clear(function(data){
			console.log("W I P E D");
		});
		location.reload();
	});

	$("#private-memories").click(function(){
		$(".showMemories").toggle();
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
			loadCloud();
			$(".analysis").fadeIn("slow");
		});
		lastTab = ".analysis"
	});

	$("#loadSettings").click(function(){
		$(".settings").toggle();
		$(lastTab).toggle();
	});

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

	$

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

	function loadCloud(){

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
				listWeek: { buttonText: 'week' }
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
				"Attitude is a little thing that makes a big difference - Winston Churchill",
				"Find a place inside where there's joy, and the joy will burn out the pain - Joseph Campbell",
				"In order to carry a positive action, we must develop here a positive vision - Dalai Lama",
				"A strong, positive self-image is the best possible preparation for success - Joyce Brothers",
				"You cannot have a positive life and a negative mind - Joyce Meyer",
				"Change your thoughts and you change your world - Norman Vincent Peale",
				"Believe you can and you're halfway there - Theodore Roosevelt"]