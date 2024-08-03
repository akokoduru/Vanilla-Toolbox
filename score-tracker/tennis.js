// Player objects
const p1 = {
    score: 0,
    scoreDisplay: document.querySelector("#p-one-score"),
    button: document.querySelector("#p-one-btn")
}

const p2 = {
    score: 0,
    scoreDisplay: document.querySelector("#p-two-score"),
    button: document.querySelector("#p-two-btn")
}

// Button Selectors
const scoreLimit = document.querySelector("#limit-select");
const resetBtn = document.querySelector("#reset-btn");

// Game Variables
let scoreLimitCounter = 5;
let isGameOver = false;

function updateScore(player, opp) {
    if (!isGameOver) {
        player.score += 1;
        player.scoreDisplay.innerText = player.score;
        if (player.score == scoreLimitCounter) {
            isGameOver = true;
            player.scoreDisplay.style.color = 'green';
            opp.scoreDisplay.style.color = 'red';
            player.button.disabled = true;
            opp.button.disabled = true;
        }
    }
}

// '+1 Player One' Button Behavior
p1.button.addEventListener('click', function(e){
    updateScore(p1, p2);
})

// '+1 Player Two' Button Behavior
p2.button.addEventListener('click', function(e){
    updateScore(p2, p1);
})

// 'Playing To' Selector Behavior
scoreLimit.addEventListener('change', function() {
    scoreLimitCounter = parseInt(this.value);
    if (isGameOver == true) {
        reset();
    }
})

// Reset Behavior
resetBtn.addEventListener('click', reset)

function reset() {
    isGameOver = false;
    for (let p of [p1, p2]) {
        p.score = 0;
        p.scoreDisplay.innerText = p.score;
        p.scoreDisplay.style.color = '#25eb17';
        p.button.disabled = false;
    }
}

