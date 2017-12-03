/*global lang */
const Timer = require("sf-core/timer");
const AlertView = require('sf-core/ui/alertview');
//const Animator = require('sf-core/ui/animator');

const MEMORIZE_TIME = 2100;
const INTERVAL_DELAY = 1000;
const PENALTY_COEFFICENT = 1.13;
const LEVEL_COEFFICENT = 1.3;
const SUCCESS_TRESHOLD = 60;
const GAME_STATE = {
    READY: "ready",
    PLAYING: "playing",
    CONTINUE: "continue",
    OVER: "gameOver",
    COMPLETED: "completed"
};

Array.prototype.diff = function(a) {
    return this.filter(function(i) { return a.indexOf(i) < 0; });
};

function Engine(context) {

    var score = 0;
    var level = 1;
    var row = 3;
    var totalTime = 2;

    this.initGame = e => {
        totalTime = 2;
        level = 1;
        score = 0;
        context.lblInfo.text = lang["newGame"];
        setTexts(context, score, level, totalTime);
    };

    this.startGame = e => {
        context.gameBoard.clearBoard();
        context.gameBoard.touchEnabled = true;
        context.lblInfo.text = lang["playing"];
        playingGame.call(this, context, totalTime);
    };

    this.setNextLevel = e => {
        ++level;
        row = context._rowCount;
        totalTime += ((level % 2) === 0) ? 1 : 0;
        setTexts(context, score, level, totalTime);
    };

    this.showGame = e => {
        context.gameBoard.touchEnabled = false;
        context.startBtn.touchEnabled = false;
        context.gameBoard.clearBoard();
        context.gameBoard.initBoard(level);
        context.lblInfo.text = lang["memorize"];
        setTimeout(this.startGame.bind(this), MEMORIZE_TIME);
    };

    this.finishGame = remainingTime => {
        context.gameBoard.touchEnabled = false;
        var res = setGameResult(context);
        var nextLevel = res >= SUCCESS_TRESHOLD;
        context.lblInfo.text =
            `${lang["result"]}\n${lang["success_rate"]}: %${res}\n${getStrContiinueOrDone(nextLevel)}`;
        context.timerIcon.dispatch({
            type: "updateUserStyle",
            userStyle: {
                image: "timeroff.png"
            }
        });
        context.startBtn.touchEnabled = true;
        score += nextLevel ? getScore(level, res, remainingTime) : 0;
        setTexts(context, score, level, totalTime);
        this.onFinish && this.onFinish(nextLevel);
        showAlert(nextLevel, score > context._leader.score);

    };
    this.getScore = e => score;
}

Engine.MEMORIZE_TIME = MEMORIZE_TIME;
Engine.GAME_STATE = GAME_STATE;

function getScore(level, res, remainingTime) {
    return Math.floor((level * res * LEVEL_COEFFICENT) + (remainingTime * level * 10));
}

function setTexts(context, score, level, totalTime) {
    context.currentScore.text = "Score: " + score;
    context.currentLevel.text = "Level: " + level;
    context.currentTime.text = totalTime + " s";
}

function playingGame(context, totalTime) {
    var secondCount = 0;
    context.timerIcon.dispatch({
        type: "updateUserStyle",
        userStyle: {
            image: "timeron.png"
        }
    });
    context.startBtn.dispatch({
        type: "updateUserStyle",
        userStyle: {
            image: "continue.png"
        }
    });
    var deggreePerSecond = 360 / totalTime;
    var timer = Timer.setInterval({
        task: e => {
            var isFinished = checkIsGameFinished(context);
            if (isFinished || (secondCount === totalTime)) {
                Timer.clearTimer(timer);
                return this.finishGame(totalTime - secondCount);
            }
            secondCount += 1;
            context.currentTime.text = (totalTime - secondCount) + " s";
            /*
            Animator.animate(context.timerIcon, INTERVAL_DELAY, function() {
                context.timerIcon.rotation = deggreePerSecond;
                context.timerIcon.left = 0;
            });
            */
        },
        delay: INTERVAL_DELAY
    });
}

function checkIsGameFinished(context) {
    var items = context.gameBoard._items,
        list = context.gameBoard._list,
        itemState, modfiedCount = 0;
    //console.log("List checkGAme: " + list.join(", "));
    items.forEach((item, index) => {
        itemState = item.getState();
        if (itemState === "right" && (list.indexOf(index) !== -1)) {
            modfiedCount += 1;
        }
    });
    return list.length === modfiedCount;
}

function setGameResult(context) {
    var items = context.gameBoard._items,
        list = context.gameBoard._list,
        itemState, rightCount = 0,
        emptyCount = 0,
        wrongCount = 0,
        modifiedList = [];

    //console.log("List setGameResult: " + list.join(", "));
    items.forEach((item, index) => {
        itemState = item.getState();
        if (itemState === "right") {
            //console.log("Index: " + index);
            if (list.indexOf(index) !== -1) {
                rightCount += 1;
            }
            else {
                wrongCount += 1;
                item.setItemStyle("wrong");
            }
            modifiedList.push(index);
        }
    });
    list.diff(modifiedList).forEach(l => {
        emptyCount += 1;
        items[l].setItemStyle("empty");
    });
    var rights = (rightCount - emptyCount - (wrongCount * PENALTY_COEFFICENT));
    return rightCount > 0 ? ((rights * 100) / (rightCount)).toFixed(2) : 0;
}

function showAlert(nextLevel, isLeader) {
    var myAlertView = new AlertView({
        title: nextLevel ? lang["game_continue"] : lang["game_over"],
        message: (isLeader ? lang["new_leader"] : "") + " " + getStrContiinueOrDone(nextLevel)
    });
    myAlertView.addButton({
        text: lang["ok"]
    });
    myAlertView.show();
}

function getStrContiinueOrDone(nextLevel) {
    return nextLevel ? lang["nextLevel"] : lang["tryagain"];
}

module.exports = Engine;
