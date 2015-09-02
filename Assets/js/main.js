//global variable declorations 
var turns = 0;
var cardBacks = document.getElementsByClassName("back");
var firstCard = null;
var firstCardElement = "";
var secondCardElement = "";
var cardsFlipped = 0;
var numCorrect = 0;
var timeArray = [0, 0, 0];
var state = "gameOver"
var wm = null;
var t = null;
var accuracy = 0;
var difficulty = "medium";
var row = 3;
var perRow = 6;
//var cardPairs = 9;
//var imgArray = ['archer_rs.png', 'castle_rs.png', 'dragon_green_rs.png', 'dragon_pink_rs.png', 'king_rs.png', 'knight_rs.png', 'princess_rs.png', 'shield_rs.png', 'wizard_rs.png', 'archer_rs.png', 'castle_rs.png', 'dragon_green_rs.png'];
var imgArray = ['anna.jpg', 'ariel.jpg', 'jasmine.jpg', 'sofia.png', 'elsa.png', 'belle.jpg', 'cinderella.gif', 'merida.jpg', 'tinkerbell.jpg', 'rapunzel.png', 'minnieMouse.jpg', 'jessie.png'];

//resets everything "Mostly"
function resetGame() {
    resetStats();
    startTime(false);
    resetTime();
    toggleStartBtn(false);
    state = "gameOver";
    firstCardElement = "";
    setDifficulty(difficulty);
    clearBoard();
}

function gameState(status){
    //if all cards have been matched display final stats in alert message and stops timer
    if (status == "gameOver"){
        startTime(false);
        alert('Congratulations! You have cleared the board.\n\nFinal Stats:\n\nTime: ' + getTime('words') + '\nTurns: ' + turns +        '\nAccuracy: ' + accuracy + '%');
    }
    //starts game, creates game board, starts timer, disables button
    else if (status == "gameStart"){
        state = "gameStart";
        setBoard(sizeArray((row*perRow)/2));
        startTime(true);
        toggleStartBtn(true);   
    }
    //checks for win
    else if (status == "running"){
        if (numCorrect == cardBacks.length/2){
            state = "gameOver";
            gameState(state);
        }
    } 
}

function checkCard(element) {
    
    //ensures the start game button is pushed before the cards can be clicked on
    if(state == "gameOver"){
        if(confirm("Click 'OK' to begin!")){
            gameState('gameStart');
            return;
        }
        else{
            return;
        }
    }
    
    if(cardsFlipped == 2){
        window.clearTimeout(wm);
        wrongMatch(secondCardElement);
        cardsFlipped = 0;
    }
    
    //changes game state to 'running' state
    state = "running";
    
    //gets sibbling element of card clicked on
    var cardFace = element.previousElementSibling;
    //hides back of card
    element.style.display = "none";
    
    //checks for first card
    if(firstCardElement == ""){
        cardFace.setAttribute("class", "selected-card");
        firstCard = element;
        firstCardElement = element.getAttribute('face');
        cardsFlipped++;
    }
    //if second card clicked compares the two cards
    else {
        if(firstCardElement == element.getAttribute('face')){
            correctMatch(cardFace);
            numCorrect++;
            cardsFlipped = 0;
            //alert('MATCH!');
        }
        else {
            cardFace.setAttribute("class", "selected-card");
            secondCardElement = element;
            wm = setTimeout(function(){wrongMatch(element)}, 1000);
            cardsFlipped++;
            //alert('NO MATCH!');
        }
        //increments turn counter, resets firstCardElement, updates accuracy, checks gameState
        turnCounter();
        firstCardElement = "";
        updateAccuracy();
        gameState(state);
    }
}

//if cards do match leaves them visable and increases opacity
function correctMatch(secondCard){
    var firstChoice = document.getElementsByClassName('selected-card');
    secondCard.setAttribute("class", "used-card");
    firstChoice[0].setAttribute("class", "used-card");
}

//if cards don't match 'flips' cards back over and returns them to original state
function wrongMatch(secondCard){
    resetCards("selected-card");
    secondCard.style.display = "inline-block";
    firstCard.style.display = "inline-block";
}

//rests all card fronts to original state
function resetCards(className){
    var cardFronts = document.getElementsByClassName(className);
    var i = cardFronts.length;
    while(i--) cardFronts[i].setAttribute("class", "front");
}

//calculates accuracy and updates display on page
function updateAccuracy(){
    accuracy = Math.round((numCorrect/turns) * 100);
    document.getElementById('accuracy').innerHTML = accuracy + "%";
}

//resets the number of tries and accuracy displays and variables
function resetStats(){
    numCorrect = 0;
    turns = 0;
    document.getElementById('numTries').innerHTML = "000";
    document.getElementById('accuracy').innerHTML = "100%";
}

//fades start button and disables it
function toggleStartBtn(disable){
    var startBtn = document.getElementById('start');
    startBtn.disabled = disable;
    
    if(disable){
        startBtn.style.opacity = 0.4;
    }
    else {
        startBtn.style.opacity = 1;
    }
}

function setDifficulty(diff){
    var button = document.getElementById(diff);
    
    document.getElementById("easy").classList.remove("pressed");
    document.getElementById("medium").classList.remove("pressed");
    document.getElementById("hard").classList.remove("pressed");
    
    if(diff == "easy"){
        button.classList.add("pressed");
        difficulty = diff;
        row = 3;
        perRow = 4;
        //cardPairs = (row*perRow)/2;
    }
    if(diff == "medium"){
        button.classList.add("pressed");
        difficulty = diff;
        row = 3;
        perRow = 6;
        //cardPairs = (row*perRow)/2;
    }
    if(diff == "hard"){
        button.classList.add("pressed");
        difficulty = diff;
        row = 3;
        perRow = 8;
    }
}

//counts the total number of turns taken by player and updates display on page
function turnCounter(){
    turns++;
    var str = "";
    if(turns < 10){
        str = "00" + turns;
    }
    else if(turns < 100){
        str = "0" + turns;
    }
    else {
        str = turns;
    }
    
    document.getElementById("numTries").innerHTML = str;
}

//resets the timer and display on page to all zeros
function resetTime() {
    timeArray = [0, 0, 0];
    
    var h = checkTime(timeArray[0]);
    var m = checkTime(timeArray[1]);
    var s = checkTime(timeArray[2]);
    
    document.getElementById("timer").innerHTML = h + ":" + m + ":" + s;
}

//returns the current timer array in number (00:00:00) or word format (02-minutes 01-second)
function getTime(format){
    if(format == "numbers"){
        return checkTime(timeArray[0]) + ':' + checkTime(timeArray[1]) + ':' + checkTime(timeArray[2]);
    }
    if(format == "words"){
        var str = "";
        if(timeArray[0] > 0){
            str = checkTime(timeArray[0]) + "-Hour";
        }
        if(timeArray[0] > 1){
            str = str + "s";
        }
        if(timeArray[1] > 0){
            str = str + " " + checkTime(timeArray[1]) + "-minute";
        }
        if(timeArray[1] > 1){
            str = str + "s";
        }
        if(timeArray[2] > 0){
            str = str + " " + checkTime(timeArray[2]) + "-second";
        }
        if(timeArray[2] > 1){
            str = str + "s";
        }
        
        return str;
    }
} 

//timer function takes boolean: true - starts timer, false - pauses timer
function startTime(cont) {
    if(cont){
        timeArray[2]++;
        //if seconds > 59 increments minutes by 1
        if(timeArray[2] > 59){
            timeArray[1]++;
            timeArray[2] = 0;
            //if minutes > 59 increments hours by 1
            if(timeArray[1] > 59){
                timeArray[0]++;
                timeArray[1] = 0;
            }
        }
        //updates timer on webpage
        document.getElementById("timer").innerHTML = getTime('numbers');
        //recalls this function in 1 sec
        t = setTimeout(function(){ startTime(true) }, 1000);
    }
    else{
        //pauses timer
        window.clearTimeout(t);
    }
}

//pads numbers less than 10 for timer
function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function sizeArray(size){
    var sizedArray = [];
    
    for(var i=0; i<size; i++){
        sizedArray.push(imgArray[i]);
    }
    
    return sizedArray;
}

//randomizes images on game board
function setBoard(imgs){
    var imgIndex = 0;
    
    var game_area = document.querySelector("#main-game-area");
    //creates an array with two of each image
    var images = imgs.concat(imgs);
    var cardSpaces = document.getElementsByClassName('front');
    //shuffles images array
    shuffle(images);
    
    //places images on board and adds face attribute to sibbling
    //for(var i=0; i < images.length; i++){
        //cardSpaces[i].setAttribute('src', 'Assets/images/' + images[i]);
        //cardBacks[i].setAttribute('face', images[i]);
    //}
    
    for(var i=0; i<row; i++){
        var card_row = document.createElement("div");
        card_row.classList.add("card-row");
        for(var j=0; j<perRow; j++){
            var card_container = document.createElement("div");
            card_container.classList.add("card-container");
            
            var card_front = document.createElement("img");
            card_front.src = "Assets/images/" + images[imgIndex];
            card_front.classList.add('front');
            
            var card_back = document.createElement("img");
            card_back.src = "Assets/images/back2.png";
            card_back.classList.add('back');
            card_back.setAttribute('onclick', "checkCard(this)");
            card_back.setAttribute('face', images[imgIndex]);
            
            card_container.appendChild(card_front);
            card_container.appendChild(card_back);
            card_row.appendChild(card_container);
            imgIndex++;
        }
        game_area.appendChild(card_row);
    }
}

function clearBoard(){
    document.getElementById("main-game-area").innerHTML = "";
}

//shuffles an array - Adopted from stackoverflow.com Fisher-Yates Shuffle
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}