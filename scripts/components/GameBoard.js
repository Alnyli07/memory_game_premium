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
		this._items = [];
		this.createBoard = createBoard.bind(this);
		this.initBoard = initBoard.bind(this);
		this.clearBoard = clearBoard.bind(this);
		this.updateBoardItemSize = updateBoardItemSize.bind(this);
	}

);

function createBoard(width, row) {
	if (this._row === row)
		return;
	this.removeAll();
	this.dispatch({
		type: "removeChildren"
	});
	this._items = [];
	this._row = row;
	const itemCount = row * row;
	var item;
	var itemSize = ((width - ((row + 1) * 5)) / row);
	for (var i = 0; i < itemCount; ++i) {
		item = new BoardItem();
		this._items.push(item);
		this.addChild(item, PREFIX + i, ".board_item_passive", function(style) {
			style.width = itemSize;
			style.height = itemSize;
			style.left = 0;
			style.marginLeft = 5;
			style.marginTop = 5;
			if ((i / row) >= (row - 1))
				style.marginBottom = 5;
			return style;
		});
		item.applyLayout();
	}
	//console.log("Width"+width+" . "+itemSize);
}

function initBoard(gameLevel) {
	var count = this._row + gameLevel,
		items = this._items;
	var list = [];
	for (var i = 0; i < count; ++i) {
		list.push(getRandomInt(0, this._row * this._row, list));
	}
	list.forEach(item => {
		items[item].setItemStyle("right");
	});
	this._list = list;
}

function updateBoardItemSize(width) {
	var itemSize = ((width - ((this._row + 1) * 5)) / this._row);
	this._items.forEach(item => {
		item.dispatch({
			type: "updateUserStyle",
			userStyle: {
				width: itemSize,
				height: itemSize
			}
		});
		item.applyLayout();
	});
}

function getRandomInt(min, max, ignoreList) {
	min = Math.ceil(min);
	max = Math.floor(max);
	var res = Math.floor(Math.random() * (max - min)) + min;
	if (ignoreList.find(e => e === res))
		return getRandomInt(min, max, ignoreList);
	return res;
}

function clearBoard() {
	this._items.forEach(item => {
		item.setItemStyle("passive");
	});
}
module && (module.exports = GameBoard);
