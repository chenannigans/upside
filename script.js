$(document).ready(function() {
	
	//uncomment this to wipe the DB
	// clearStorage();

	var placeHolder = "Write something that brightened your day";

	loadData();
	loadDate();
	pickDateIcon();
	loadMain();
	getCanvas();
	loadCalendar();


  //initialize word cloud settings
	function getCanvas() {
	  	TagCanvas.shape = 'sphere';
	  	TagCanvas.textColour = 'white';
	  	TagCanvas.textHeight = 20;
	  	TagCanvas.textAlign = 'centre';
	  	TagCanvas.textFont = 'HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, sans-serif';
	  	TagCanvas.weight = true;
	  	TagCanvas.weightFrom = 'data-weight';
	  	TagCanvas.weightSizeMin = 20;
	  	TagCanvas.weightSizeMax = 50;
	  	// TagCanvas.noSelect = true;
	  	TagCanvas.clickToFront = 800;
	  	TagCanvas.maxSpeed = 0.03;
	  	TagCanvas.reverse = true;
	  	TagCanvas.outlineMethod = 'none';
	  }


//upload file as backgroudn in options
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
			// document.getElementById("body").background='url('+e.target.result +')';

		var uploadedImage = 'url('+e.target.result +')';
	    $('body').css('background', uploadedImage);

	};




	function loadData(){

			chrome.storage.sync.get(function(data){
				loadBackground(data);
				loadMemories(data);
				promptText(data);
				loadRandom(data);

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
		
		//hdies 
		if (data.settings[1].privacyMode==true){		
 			$(".showMemories").hide();		
 			$(".random").hide();
 		}
 		//clears memory display, random, calendar, and cloud
 		emptyMemories();

		if (data.memories){
			for(i = 0; i < data.memories.length; i ++){

				if (data.memories[i][0]!=null){
					//load calendar
					$("#calendar").fullCalendar('addEventSource', data.memories[i]);
					//load home page memories
					if (data.memories[i][0].start == getFormattedDate()){
						$(".showMemories").prepend("<input style = text id = 'edit'></input><br>");
						$("#edit").val(data.memories[i][0].title);
						$("#edit").attr('tag', data.memories[i][0].title+"|"+data.memories[i][0].start);
					}
				}
				
			}
			//after cloud is loaded
			getWordCount(data.memories);
		}	
     	TagCanvas.Start('myCanvas');
		enterMemories(data);
	}

	function loadRandom(data){

		var randomNumber = (Math.floor(Math.random()*11));
		if (randomNumber < 4 && data.memories){
		//chance of random memory appearing on page load
			
				var randomNumber = (Math.floor(Math.random()*data.memories.length));
				
					var randomMemory = data.memories[randomNumber][0];
					var currentDate = randomMemory.start.split("-");
					var months =  ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
					var newDate = months[currentDate[1]-1] +" " + currentDate[2] + ", " + currentDate[0];
					$(".quote").append("<h1>" + '"'+randomMemory.title + '"'+ " - your memory on "+ newDate+ "</h1>");

		}
		else{
			getQuote();
		}

	}

	function emptyMemories(){

		$(".showMemories").empty();
		$(".random").empty();
		$("#calendar").fullCalendar('removeEventSources');
		$("#myCanvas").empty();
	}

	function getWordCount(memories) {
		$("#stats").empty()

		words = new Array();
		var dict = {};
		var sizeLimit = 10; //limits how big the words can get

		for (i=0; i < memories.length; i++) {
			if (memories[i][0]!=null){
			var memory = memories[i][0].title.toLowerCase();
			memory = memory.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");

			var memoryWords = memory.split(" ");
			// just get the words
			var wordsArray = $.map(memoryWords, function(value, index) { return [value]; });
			// combine to a cumulative list of words
	
			words.push(wordsArray);
		}
		}
		var merged = [].concat.apply([], words);
		//adapted from stackoverflow, how many times each word is used
		for (i = 0,  j = merged.length; i < j; i++){
			dict[merged[i]] = (dict[merged[i]] || 0) + 1;
		}

		var max = 0 ;
		var maxKey;
		var maxVal;
		for (var key in dict) {
			if(stopWords.indexOf(key)==-1){
				if (dict[key] > sizeLimit)
					dict[key] = sizeLimit;
				$("#myCanvas").append("<li><a href='#' data-weight="+dict[key]*10+">"+key+"</a></li>");
				if (dict[key]>max){
					max = dict[key]
					maxKey = key;
					maxVal = dict[key];
				}

			}
		}

		$("#stats").append("<li>Most mentioned word: <b>" +maxKey + "</b>, "+maxVal+" times</li>");
		getAverageMemoriesPerDay();
	}

	function getAverageMemoriesPerDay(){

		chrome.storage.sync.get(function(data){

		var first = moment(data.memories[0][0].start, 'YYYY-MM-DD');
		var today = moment(getFormattedDate(), 'YYYY-MM-DD');

		// console.log(first,today);

		var days = today.diff(first, 'days');
		console.log(data.memories.length/days);
		// console.log(firs	t,today);
		// console.log((data.memories.length)/(data.memories.length));
		$("#stats").append("<li>It has been <b>" + days + "</b> days since you recorded your first memory</li>");
		$("#stats").append("<li>Total memories: <b>" + data.memories.length +"</b></li>");
		$("#stats").append("<li>You average <b>" + parseFloat(data.memories.length/days).toFixed(4) +"</b> memories per day</li>");
		$("#stats").append("<li>You're on a <b>5</b> day streak, keep it up!</li>");

		$("#stats").append("<li>Keep up the good work!</li>");

		});


	}

	//changes the prompt text depending on how many memories there are
	function promptText(data){

		if (data.memories){
			var num = data.memories.length;
			var prompttexts = ["Write something good that made you smile today", "Write about something or someone you're grateful for today","Write something that made you feel appreciated today", "Write about something that happened today that you'd like to remember", "Write about something that brightened your day"];
			var ran = Math.floor(Math.random()*(prompttexts.length));
			placeHolder = prompttexts[ran];
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
		$(".history").toggle(false);
		$(".analysis").toggle(false);	
		$(".settings").toggle(false);	
		$(".main").fadeIn("slow");
		lastTab = ".main"
	}

	$('#enterText').focus(function(){
		$(this).removeAttr('placeholder')
	});

	$('#enterText').focusout(function(){
		$(this).attr('placeholder', placeHolder)
	});

	function enterMemories(data){
	
		$("#enterText").keydown(function(event){

			if (event.which==13){ //enter key
			
				var text = $("#enterText").val();

				if (text.length>0 ){
					event.preventDefault();
					addMemory(text);
					$("#enterText").val("");//reset field
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
		if (confirm('Are you sure you want to clear all settings and memories? There are some good ones in there!')){
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
			$(".history").fadeIn("slow");
			lastTab = ".history"
		$('#calendar').fullCalendar('render');

		});

	});

	$("#loadAnalysis").click(function(){
		$(".history").toggle(false);
		$(".settings").toggle(false);
		$(".main").fadeOut("slow", function(){
			$(".analysis").fadeIn("slow");
			lastTab = ".analysis"
		});
	});

	$("#loadSettings").click(function(){
		$(".settings").toggle();
		$(lastTab).toggle();
	});

	// CHANGE BACKGROUNDS
	$(".bg-change").click(function(){
		id = $(this).attr('id');
		img = "images/backgrounds/bg"+id+".jpg"
		document.getElementById("body").background=img;
		setBackground(id);
	});

	//this initializes the rest of the setting array
	function loadBackground(data){

	    $('body').css('background', '');

		var num;
		if (!data.settings){
			console.log("this should only happen once");
			data.settings=[];
			data.streak=0;
			num =6;
			var background = {'background': num};
			var privacyMode = {'privacyMode': false};
			data.settings.push(background);
			data.settings.push(privacyMode);

			chrome.storage.sync.set(data);

		} else{
			num = data.settings[0].background;
 
		}
		
		var img = "images/backgrounds/bg"+num+".jpg";
			document.getElementById("body").background=img;
			$("#"+num).css("opacity",".25");

	}


	function setBackground(num){

		chrome.storage.sync.get(function(data){
			$("#"+data.settings[0].background).css("opacity","1");
			data.settings[0].background=num;

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

				console.log(data);
			

			formattedDate = getFormattedDate();

			var memory = [{'title':val, 
						  'start': formattedDate
						 }]

			$("#calendar").fullCalendar('addEventSource', memory);

			data.memories.push(memory);

			chrome.storage.sync.set(data,function(){
				loadMemories(data);
			});

		});	
	}

	//enables editing memories on the main page and acalendar week view
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

	//filter for words to not include in the word cloud
	var stopWords =  new Array(
		//contractions
		"i've",
		"don't",
		"i'm",
		"you're",
		"aren't",
		"isn't",
		'a',
        'about',
        'above',
        'across',
        'after',
        'again',
        'against',
        'all',
        'almost',
        'alone',
        'along',
        'already',
        'also',
        'although',
        'always',
        'among',
        'an',
        'and',
        'another',
        'any',
        'anybody',
        'anyone',
        'anything',
        'anywhere',
        'are',
        'area',
        'areas',
        'around',
        'as',
        'ask',
        'asked',
        'asking',
        'asks',
        'at',
        'away',
        'b',
        'back',
        'backed',
        'backing',
        'backs',
        'be',
        'became',
        'because',
        'become',
        'becomes',
        'been',
        'before',
        'began',
        'behind',
        'being',
        'beings',
        'best',
        'better',
        'between',
        'big',
        'both',
        'but',
        'by',
        'c',
        'came',
        'can',
        'cannot',
        'case',
        'cases',
        'certain',
        'certainly',
        'clear',
        'clearly',
        'come',
        'could',
        'd',
        'did',
        'differ',
        'different',
        'differently',
        'do',
        'does',
        'done',
        'down',
        'down',
        'downed',
        'downing',
        'downs',
        'during',
        'e',
        'each',
        'early',
        'either',
        'end',
        'ended',
        'ending',
        'ends',
        'enough',
        'even',
        'evenly',
        'ever',
        'every',
        'everybody',
        'everyone',
        'everything',
        'everywhere',
        'f',
        'face',
        'faces',
        'fact',
        'facts',
        'far',
        'felt',
        'few',
        'find',
        'finds',
        'first',
        'for',
        'four',
        'from',
        'full',
        'fully',
        'further',
        'furthered',
        'furthering',
        'furthers',
        'g',
        'gave',
        'general',
        'generally',
        'get',
        'gets',
        'give',
        'given',
        'gives',
        'go',
        'going',
        'good',
        'goods',
        'got',
        'great',
        'greater',
        'greatest',
        'group',
        'grouped',
        'grouping',
        'groups',
        'h',
        'had',
        'has',
        'have',
        'having',
        'he',
        'her',
        'here',
        'herself',
        'high',
        'high',
        'high',
        'higher',
        'highest',
        'him',
        'himself',
        'his',
        'how',
        'however',
        'i',
        'if',
        'important',
        'in',
        'interest',
        'interested',
        'interesting',
        'interests',
        'into',
        'is',
        'it',
        'its',
        'itself',
        'j',
        'just',
        'k',
        'keep',
        'keeps',
        'kind',
        'knew',
        'know',
        'known',
        'knows',
        'l',
        'large',
        'largely',
        'last',
        'later',
        'latest',
        'least',
        'less',
        'let',
        'lets',
        'like',
        'likely',
        'long',
        'longer',
        'longest',
        'm',
        'made',
        'make',
        'making',
        'man',
        'many',
        'may',
        'me',
        'member',
        'members',
        'men',
        'might',
        'more',
        'most',
        'mostly',
        'mr',
        'mrs',
        'much',
        'must',
        'my',
        'myself',
        'n',
        'necessary',
        'need',
        'needed',
        'needing',
        'needs',
        'never',
        'new',
        'new',
        'newer',
        'newest',
        'next',
        'no',
        'nobody',
        'non',
        'noone',
        'not',
        'nothing',
        'now',
        'nowhere',
        'number',
        'numbers',
        'o',
        'of',
        'off',
        'often',
        'old',
        'older',
        'oldest',
        'on',
        'once',
        'one',
        'only',
        'open',
        'opened',
        'opening',
        'opens',
        'or',
        'order',
        'ordered',
        'ordering',
        'orders',
        'other',
        'others',
        'our',
        'out',
        'over',
        'p',
        'part',
        'parted',
        'parting',
        'parts',
        'per',
        'perhaps',
        'place',
        'places',
        'point',
        'pointed',
        'pointing',
        'points',
        'possible',
        'present',
        'presented',
        'presenting',
        'presents',
        'problem',
        'problems',
        'put',
        'puts',
        'q',
        'quite',
        'r',
        'rather',
        'really',
        'right',
        'right',
        'room',
        'rooms',
        's',
        'said',
        'same',
        'saw',
        'say',
        'says',
        'second',
        'seconds',
        'see',
        'seem',
        'seemed',
        'seeming',
        'seems',
        'sees',
        'several',
        'shall',
        'she',
        'should',
        'show',
        'showed',
        'showing',
        'shows',
        'side',
        'sides',
        'since',
        'small',
        'smaller',
        'smallest',
        'so',
        'some',
        'somebody',
        'someone',
        'something',
        'somewhere',
        'state',
        'states',
        'still',
        'still',
        'such',
        'sure',
        't',
        'take',
        'taken',
        'than',
        'that',
        'the',
        'their',
        'them',
        'then',
        'there',
        'therefore',
        'these',
        'they',
        'thing',
        'things',
        'think',
        'thinks',
        'this',
        'those',
        'though',
        'thought',
        'thoughts',
        'three',
        'through',
        'thus',
        'to',
        'today',
        'together',
        'too',
        'took',
        'toward',
        'turn',
        'turned',
        'turning',
        'turns',
        'two',
        'u',
        'under',
        'until',
        'up',
        'upon',
        'us',
        'use',
        'used',
        'uses',
        'v',
        'very',
        'w',
        'want',
        'wanted',
        'wanting',
        'wants',
        'was',
        'way',
        'ways',
        'we',
        'well',
        'wells',
        'went',
        'were',
        'what',
        'when',
        'where',
        'whether',
        'which',
        'while',
        'who',
        'whole',
        'whose',
        'why',
        'will',
        'with',
        'within',
        'without',
        'work',
        'worked',
        'working',
        'works',
        'would',
        'x',
        'y',
        'year',
        'years',
        'yet',
        'you',
        'young',
        'younger',
        'youngest',
        'your',
        'yours',
        'z'
    )