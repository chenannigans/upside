document.addEventListener('DOMContentLoaded', function() {
	var displayMemories = document.getElementById("display-memories")
	displayMemories.addEventListener('click', function(){
			document.getElementById("showMemories").innerHTML+=document.getElementById("thetext").value + '<br>'

	})
});
