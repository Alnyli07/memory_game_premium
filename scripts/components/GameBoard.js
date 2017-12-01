/* 
		You can modify its contents.
*/
const extend = require('js-base/core/extend');

const GameBoardDesign = require('library/GameBoard');

const GameBoard = extend(GameBoardDesign)(
  //constructor
  function(_super, props, pageName) {
    // initalizes super class for this scope
    _super(this, props || {});
    this.pageName = pageName;
  }

);

module && (module.exports = GameBoard);