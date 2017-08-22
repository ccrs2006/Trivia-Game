//GLOBAL VARIABLES
var primaryScreen;
var gameHTML;
var counter = 25;
var questionArray = [
"What is the world's longest river?",
"Name of the world's largest ocean?",
"What is the diameter of Earth?",
"which country is Prague in?",
"What color jersey is worn by the overall leader of the race in the Tour of France?",
"Which chess piece can only move diagonally?",
"Name the three primary colors?",
"Name of the seventh planet from the sun?",
];
var answerArray = [
 ["Nile river", "Yangtze river", "Amazon river", "Yellow river"], 
 ["Atlantic","Indian","Arctic","Pacific"],
 ["12,000 Miles", "8,000 Miles", "20,000 Miles", "90,500 Miles"], 
 ["Czech Republic","Italy","Germany","Greece"], 
 ["Green", "Yellow", "White with red dots", "White"], 
 ["A queen","A knight","A bishop","A rooks"], 
 ["red, yellow and green", "red, yellow and blue", "red, yellow and purple", "red, orange and blue"], 
 ["Uranus","Mercury","Mars","Saturn"]
 ];
var correctAnswersArray= [
"C. Amazon river",
"D. Pacific",
"B. 8,000 Miles",
"A. Czech Republic",
"B. Yellow",
"C. A bishop",
"B. red, yellow and blue",
"A. Uranus"
 ];
var questionCounter = 0;
var selecterAnswer;
var Clock;
var IfCorrect = 0;
var IfNotCorrect = 0;
var IfNotAnswered = 0;
var clickSound = new Audio("assets/sounds/click.mp3");
var timeOutSound = new Audio("assets/sounds/timeIsRunningOut.mp3");
var winSound = new Audio("assets/sounds/yeah.mp3");
var lossSound = new Audio ("assets/sounds/whatsWrongWithYou.mp3");


//MAIN FUNCTIONS

function generateLossDueToTimeout() {
	IfNotAnswered++;
	gameHTML = "$('.timer-p')" + counter + "</span></p>" + "<p class='text-center'>You ran out of time!  The correct answer was: " + correctAnswersArray[questionCounter] + "</p>";
	$(".main-area").html(gameHTML);
	$.get("https://api.giphy.com/v1/gifs/search?q=TIME&IS&OVER&api_key=9afb8f5d4c4b492c9afe06afb0904326&limit=10")
    .done(function(data) {
      var img = $("<img src='" + data.data[Math.floor(Math.random() * data.data.length)].images.original.url + "'>")
      $(".main-area").append(img);
    });
	timeOutSound.play();
	setTimeout(wait, 5000);
}

function generateWin() {
	IfCorrect++;
	gameHTML = "$('.timer-p')" + counter + "</span></p>" + "<p class='text-center'>Correct! The answer is: " + correctAnswersArray[questionCounter] + "</p>";	
	$(".main-area").html(gameHTML);
	$.get("https://api.giphy.com/v1/gifs/search?q=WIN&api_key=9afb8f5d4c4b492c9afe06afb0904326&limit=10")
    .done(function(data) {
      var img = $("<img src='" + data.data[Math.floor(Math.random() * data.data.length)].images.original.url + "'>")
      $(".main-area").append(img);
    });
	winSound.play();
	setTimeout(wait, 5000);
}

function generateLoss() {
	IfNotCorrect++;
	gameHTML = "$('.timer-p')" + counter + "</span></p>" + "<p class='text-center'>Wrong! The correct answer is: "+ correctAnswersArray[questionCounter] + "</p>";
	$(".main-area").html(gameHTML);
	$.get("https://api.giphy.com/v1/gifs/search?q=WRONG&api_key=9afb8f5d4c4b492c9afe06afb0904326&limit=10")
    .done(function(data) {
    var img = $("<img src='" + data.data[Math.floor(Math.random() * data.data.length)].images.original.url + "'>")
    $(".main-area").append(img);
    });
    lossSound.play();
	setTimeout(wait, 5000);
	}

function generateHTML() {
	gameHTML = "<p class='text-center timer-p'>Time Remaining: <span class='timer'>25</span></p><p class='text-center'>" + questionArray[questionCounter] + "</p><p class='first-answer answer'>A. " + answerArray[questionCounter][0] + "</p><p class='answer'>B. "+answerArray[questionCounter][1]+"</p><p class='answer'>C. "+answerArray[questionCounter][2]+"</p><p class='answer'>D. "+answerArray[questionCounter][3]+"</p>";
	$(".main-area").html(gameHTML);
}

function wait() {
	if(questionCounter < 7) {
		questionCounter++;
		generateHTML();
		counter = 25;
		timerWrapper();
	}else {
		finalScreen();
	}
}

function timerWrapper() {
	Clock = setInterval(twentyFiveSeconds, 1000);
	function twentyFiveSeconds () {
		if(counter === 0) {
			clearInterval(Clock);
			generateLossDueToTimeout();
		}
		if(counter > 0) {
			counter --;
		}
		$(".timer").html(counter);
	}
}

function finalScreen() {
	gameHTML = "$('.timer-p')" + counter + "</span></p>" + "<p class='text-center'>All done, here's how you did!" + "</p>" + "<p class='summary-correct'>Correct Answers: " + IfCorrect + "</p>" + "<p class='wrong-answers'>Wrong Answers: " + IfNotCorrect + "</p>" + "<p class='unanswered-answers'>Unanswered: " + IfNotAnswered + "</p>" + "<p class='text-center reset-button-container'><a class='btn btn-success btn-lg btn-block reset-button' href='#' role='button'>Reset The Quiz!</a></p>";
	$(".main-area").html(gameHTML);
}

function resetGame(){
	questionCounter = 0;
	IfCorrect = 0;
	IfNotCorrect = 0;
	IfNotAnswered = 0;
	counter = 25;
	generateHTML();
	timerWrapper();
}

//activate javascript when html loads

$(document).ready(function() {

	function initialScreen() {
		primaryScreen = $(".main-button");
		$(".main-area").html(primaryScreen);
	}

	initialScreen();

	$("body").on("click", ".start-button", function(event) {
		event.preventDefault();
		clickSound.play();
		generateHTML();
		timerWrapper();
	});

	$("body").on("click", ".answer", function(event) {
		clickSound.play();
		selectedAnswer = $(this).text();
		if(selectedAnswer === correctAnswersArray[questionCounter]) {
			clearInterval(Clock);
			generateWin();
		}else {
			clearInterval(Clock);
			generateLoss();
		}
	});

	$("body").on("click", ".reset-button", function(event) {
		clickSound.play();
		resetGame();
	});
});


