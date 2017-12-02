/* 
		You can modify its contents.
*/
const extend = require('js-base/core/extend');
const PgGameBoardDesign = require('ui/ui_pgGameBoard');
const Screen = require('sf-core/device/screen');
const System = require('sf-core/device/system');
const GameEngine = require("lib/game/engine");

const HEADER_HEIGHT = System.OS === "Android" ? 80 : 64;
const MEMORIZE_TIME = 2200;
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
  this.gameBoard.createBoard(this._boardWidth, this._rowCount);
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
  switch (this._gameState) {
    case GAME_STATE.READY:
      this._gameEngine.initGame();
      this._gameEngine.showGame();
      break;
    case GAME_STATE.COMPLETED:
      this._gameLevel += 1;
      this._rowCount += Math.floor(this._gameLevel / 3);
      this._gameEngine.setNextLevel();
      this.gameBoard.createBoard(this._boardWidth, this._rowCount);
      this.layout.applyLayout();
      this._gameEngine.showGame();
      break;
    case GAME_STATE.OVER:
      this._gameLevel = 1;
      this._rowCount = 3;
      this.gameBoard.createBoard(this._boardWidth, this._rowCount);
      this._gameEngine.initGame();
      this._gameEngine.showGame();
      break;
  }

}

function onGameFinish(isNextLevel) {
  //console.log("Game Finished" + isNextLevel);
  this.startBtn.dispatch({
    type: "updateUserStyle",
    userStyle: {
      image: "play.png"
    }
  });
  if (isNextLevel) {
    this._gameState = GAME_STATE.COMPLETED;
  }else{
    this._gameState = GAME_STATE.OVER;
  }

}
module && (module.exports = PgGameBoard);
