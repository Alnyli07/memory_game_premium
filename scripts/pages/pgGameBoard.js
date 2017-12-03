/* 
		You can modify its contents.
*/
const extend = require('js-base/core/extend');
const PgGameBoardDesign = require('ui/ui_pgGameBoard');
const Screen = require('sf-core/device/screen');
const System = require('sf-core/device/system');
const GameEngine = require("lib/game/engine");
const http = require("lib/net/http");
const Timer = require("sf-core/timer");

const HEADER_HEIGHT = System.OS === "Android" ? 80 : 64;
const MEMORIZE_TIME = 2200;
const BASE_ROWCOUNT = 3;
const GAME_STATE = {
  READY: "ready",
  PLAYING: "playing",
  CONTINUE: "continue",
  OVER: "gameOver",
  COMPLETED: "completed"
};
const PgGameBoard = extend(PgGameBoardDesign)(
  // Constructor
  function(_super) {
    // Initalizes super class for this page scope
    _super(this);
    // overrides super.onShow method
    this.onShow = onShow.bind(this, this.onShow.bind(this));
    // overrides super.onLoad method
    this.onLoad = onLoad.bind(this, this.onLoad.bind(this));
    this._gameState = GAME_STATE.READY;
    this._gameLevel = 1;
    this._gameEngine = new GameEngine(this);
    this._gameEngine.onFinish = onGameFinish.bind(this);
    this.onOrientationChange = onOrientationChange.bind(this, this.onOrientationChange.bind(this));
    this.startBtn.onTouchEnded = startBtnPress.bind(this);
  });

/**
 * @event onShow
 * This event is called when a page appears on the screen (everytime).
 * @param {function} superOnShow super onShow function
 * @param {Object} parameters passed from Router.go function
 */
function onShow(superOnShow) {
  superOnShow();
}

function onOrientationChange(superOnOrientationChange, e) {
  superOnOrientationChange && superOnOrientationChange(e);
  setTimeout(setContainerSize.bind(this), 120);
}

/**
 * @event onLoad
 * This event is called once when page is created.
 * @param {function} superOnLoad super onLoad function
 */
function onLoad(superOnLoad) {
  superOnLoad();
  this._rowCount = 3;
  setContainerSize.call(this);
  this._gameEngine.initGame();
  this.gameBoard.createBoard(this._boardWidth, this._rowCount);
  updateLeaderCorner.call(this);
  //console.log("Screen:" + Screen.width + " .height " + Screen.height + "System:" + (Screen.height - Screen.width - HEADER_HEIGHT));
}


function setContainerSize() {
  var orientationLandscape = (Screen.orientation === Screen.OrientationType.LANDSCAPELEFT) || (Screen.orientation === Screen.OrientationType.LANDSCAPERIGHT);
  var userStyleBoard;
  var userStyleHeader;
  //console.log("orientationlandscape: " + orientationLandscape);
  if (orientationLandscape) {
    this._boardWidth = Screen.height - HEADER_HEIGHT - 22;
    userStyleHeader = {
      height: null,
      width: Screen.width - this._boardWidth - 20
    };
    userStyleBoard = {
      height: null,
      width: this._boardWidth
    };
  }
  else {
    this._boardWidth = Screen.width - 22;
    userStyleHeader = {
      height: Screen.height - Screen.width - HEADER_HEIGHT,
      width: null,
    };
    userStyleBoard = {
      height: this._boardWidth,
      width: null,
    };
  }

  //console.log("Width: " + this._boardWidth);

  this.headerContainer.dispatch({
    type: "updateUserStyle",
    userStyle: userStyleHeader
  });
  this.gameBoard.dispatch({
    type: "updateUserStyle",
    userStyle: userStyleBoard
  });
  this.gameBoard.updateBoardItemSize(this._boardWidth);
  this.gameBoard.applyLayout();
  this.headerContainer.applyLayout();
}

function startBtnPress(e) {
  this.startBtn.touchEnabled = false;
  this.startBtn.dispatch({
    type: "updateUserStyle",
    userStyle: {
      alpha: 0.5
    }
  });
  switch (this._gameState) {
    case GAME_STATE.READY:
      this._gameEngine.initGame();
      this._gameEngine.showGame();
      break;
    case GAME_STATE.COMPLETED:
      updateLeaderCorner.call(this);
      this._gameLevel += 1;
      this._rowCount += ((this._gameLevel % 4) === 0) ? 1 : 0;
      this.gameBoard.createBoard(this._boardWidth, this._rowCount);
      this._gameEngine.setNextLevel();
      this.layout.applyLayout();
      this._gameEngine.showGame();
      break;
    case GAME_STATE.OVER:
      this._gameLevel = 1;
      this._rowCount = BASE_ROWCOUNT;
      this.gameBoard.createBoard(this._boardWidth, this._rowCount);
      this.layout.applyLayout();
      this._gameEngine.initGame();
      this._gameEngine.showGame();
      break;
  }

}

function onGameFinish(isNextLevel) {
  //console.log("Game Finished" + isNextLevel);
  updateNewLeader.call(this);
  this.startBtn.dispatch({
    type: "updateUserStyle",
    userStyle: {
      image: "play.png",
      alpha: 1
    }
  });
  if (isNextLevel) {
    this._gameState = GAME_STATE.COMPLETED;
  }
  else {
    this._gameState = GAME_STATE.OVER;
  }

}

function updateLeaderCorner() {

  http.reqGetLeader((err, res) => {
    if (err) return;
    this._leader = JSON.parse(res);
    this.leaderCorner.user.text = this._leader.user;
    this.leaderCorner.score.text = this._leader.score;
  });

}

function updateNewLeader() {
  var score = this._gameEngine.getScore();
  if (this._leader.score >= score)
    return;
  http.reqNewLeader("alnyli", score, (err, res) => {
    if (err) return;
  });
}

module && (module.exports = PgGameBoard);
