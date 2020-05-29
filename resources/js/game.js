// Define setup-stage.
var gameMode;

var gameArea = document.querySelector('.game-area');
var setupStage = document.querySelector('.setup-stage');
var playStage = document.querySelector('.play-stage');
var endStage = document.querySelector('.end-stage');

document.querySelector('.btn-start').addEventListener('click', function() {
    gameMode = document.getElementById('game-mode').value;
    var warning = document.querySelector('.warning');

    if (gameMode == 3 || gameMode == 4 || gameMode == 5 || gameMode == 6) {
        // Play game
        // Step1: Empty screen from setup-stage
        setupStage.style.display = 'none';
        // Step2: Display on the screen play-stage
        playStage.style.display = 'block';
        // Step3: Prepare dice for game
        getDice();
    }else if (gameMode === "")
        warning.textContent = 'Please insert game mode to continue.';
    else
        warning.textContent = 'You must insert an integer between 3 and 6 to continue.';
});

// Define play-stage.
var round = 0;
var dice = [];
var balance = 0;
var rollSound = new Audio();
rollSound.src = 'resources/mp3/roll-dice.mp3';

document.querySelector('.btn-roll').addEventListener('click', function() {
    // Update dice images
    rollDice();
    rollSound.play();
    addDiceAnimation();
    // Update round
    round++;
    document.getElementById('status-1').textContent = round;
    // Update score
    document.getElementById('status-2').textContent = getScore();
    // Update balance
    balance = balance + getScore();
    document.getElementById('status-3').textContent = balance; 
});

// Define end-stage
document.querySelector('.btn-hold').addEventListener('click', function() {
    // Empty screen from play-stage
    playStage.style.display = 'none';
    // Display on the screen end-stage
    endStage.style.display = 'block';
    // Adjust game area
    gameArea.style.width = '35%';
    // Display statistics on the screen
    document.getElementById('result-1').textContent = round;
    document.getElementById('result-2').textContent = balance;
    document.getElementById('result-3').textContent = (balance/round).toFixed(3);
});

// Remove dice animation after it ends because it has to be added again when clicked.
removeDiceAnimation();

// This function set the grid type for dice according to chosen gameMode by user
function getDice() {
    for (var i = 1; i < 7; i++)
        if (gameMode < i)
            document.getElementById('grid-' + i).style.display = 'none';
        else {
            document.getElementById('grid-' + i).classList.remove('span-1-of-6'); 
            document.getElementById('grid-' + i).classList.add('span-1-of-' + gameMode);
        }
}

// This function updates the dice images when btn-roll is clicked
function rollDice() {
    for (var i = 0; i < gameMode; i++) {
        dice[i] = Math.floor(Math.random() * 6) + 1;
        document.getElementById('dice-'+ (i + 1)).src = 'resources/css/dice/dice-' + dice[i] + '.png';
    }
}

// This function updates the score for each round
function getScore() {
    // Case 1
    if (scoreCaseOne(dice))
        return 60 + getSum(dice);
    
    // Case 2
    if (scoreCaseTwo(dice)) 
        return 40 + getSum(dice);

    // Case 3
    if (scoreCaseThree(dice)) 
        return 20 + getSum(dice);
    
    // Case 4
    if (scoreCaseFour(dice))
        return getSum(dice);
    
    // Any other outcome
    return 0;
}

// Case 1: All N dice have the same value
function scoreCaseOne(parameter) {
    var iterator = 0;
    
    for (var i = 0; i < parameter.length; i++)
        if (parameter[i] == parameter[i + 1])
            iterator++;
    
    if (iterator == parameter.length - 1)
        return true;
}

// Case 2: N - 1 but not N dice have the same value
function scoreCaseTwo(parameter) {
    for (var i = 1; i <= 6; i++) {
        var iteration = 0;
        
        for (var j = 0; j < parameter.length; j++)
            if (parameter[j] == i)
                iteration++
        
        if (iteration == parameter.length - 1)
            return true;
    }
}

// Case 3: A run (a sequence K+1 to K+N for some K ≥ 0)
function scoreCaseThree(parameter) {
    // Step 1: Check if the array is increasing
    var iterator = 0;
    
    for (var i = 0; i < parameter.length - 1; i++)
        if (parameter[i + 1] - parameter[i] == 1)
            iterator++;
    
    if (iterator == gameMode-1)
        return true;
    
    // Step 2: Check if array is decreasing
    iterator = 0;
    
    for (var i = 0; i < parameter.length - 1; i++)
        if (parameter[i] - parameter[i + 1] == 1)
            iterator++;
    
    if (iterator == gameMode-1)
        return true;
}

// Case 4: All dice have different values, but it is not a run
function scoreCaseFour(parameter) {
    // Step 1: Check that all dice have different values
    for (var i = 0; i < parameter.length - 1; i++) 
        for (var j = i + 1; j < parameter.length; j++)
            if (parameter[i] == parameter[j])
                return false;
    
    // Step 2: Check that it is not a run
    if (scoreCaseThree(parameter))
        return false;
    
    // If both checkings are passed then the case is true
    return true;
}

// Helpful functions below
function getSum(parameter) {
    var sum = 0;
    for (var i = 0; i < parameter.length; i++) {
        sum = sum + parameter[i];
    } 
    return sum;
}

function addDiceAnimation() {
    document.getElementById('dice-1').classList.add('apply-shake');
    document.getElementById('dice-2').classList.add('apply-shake');
    document.getElementById('dice-3').classList.add('apply-shake');
    document.getElementById('dice-4').classList.add('apply-shake');
    document.getElementById('dice-5').classList.add('apply-shake');
    document.getElementById('dice-6').classList.add('apply-shake');
}

function removeDiceAnimation() {
    var diceOne   = document.querySelector("img#dice-1");
    var diceTwo   = document.querySelector("img#dice-2");
    var diceThree = document.querySelector("img#dice-3");
    var diceFour  = document.querySelector("img#dice-4");
    var diceFive  = document.querySelector("img#dice-5");
    var diceSix   = document.querySelector("img#dice-6");
    stopAnimation(diceOne);
    stopAnimation(diceTwo);
    stopAnimation(diceThree);
    stopAnimation(diceFour);
    stopAnimation(diceFive);
    stopAnimation(diceSix);
}

function stopAnimation(parameter) {
    parameter.addEventListener('animationend', function() {
        parameter.classList.remove('apply-shake');
    });
}
