/* 
		You can modify its contents.
*/
const extend = require('js-base/core/extend');

const GameBoardDesign = require('library/GameBoard');
const BoardItem = require("components/BoardItem");
const PREFIX = "item";
const GameBoard = extend(GameBoardDesign)(
  //constructor
  function(_super, props, pageName) {
    // initalizes super class for this scope
    _super(this, props || {});
    this.pageName = pageName;
    this.createBoard = createBoard.bind(this);
    
  }

);

function createBoard(width, row){
  this.removeAll();
	this.children = {};
	const itemCount = row * row;
	var itemSize = ((width -((row+1) *5)) / row);
	for(var i = 0; i<itemCount; ++i){
	  this.addChild(new BoardItem(), PREFIX + i, ".board_item_passive", function(style){
	    style.width = itemSize;
	    style.height = itemSize;
	    style.marginLeft = 5;
	    style.marginTop = 5;
	    return style;
	  });
	}
	this.dispatch({
			type: "updateUserStyle",
			userStyle: {
				height: width
			}
		});
	this.applyLayout();
  //console.log("Width"+width+" . "+itemSize);
}

module && (module.exports = GameBoard);