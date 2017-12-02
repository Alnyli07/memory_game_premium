/* 
		You can modify its contents.
*/
const extend = require('js-base/core/extend');

const BoardItemDesign = require('library/BoardItem');
const pushClassNames = require("@smartface/contx/lib/styling/action/pushClassNames")
const removeClassName = require("@smartface/contx/lib/styling/action/removeClassName")

const ITEM_STYLE = {
  "passive": ".board_item_passive",
  "right": ".board_item_right",
  "empty": ".board_item_empty",
  "wrong": ".board_item_wrong"
};

const BoardItem = extend(BoardItemDesign)(
  //constructor
  function(_super, props, pageName) {
    // initalizes super class for this sc ope
    _super(this, props || {});
    Object.assign(this, props ||{});
    this.pageName = pageName;
    this._state = "passive";
    this.setItemStyle = setItemStyle.bind(this);
    this.onTouchEnded = onTouchEnded.bind(this);
    this.getState = e => this._state;
  }

);

function setItemStyle(type) {
  if(this._state === type)
    return;
  this.dispatch(removeClassName(ITEM_STYLE[this._state]));
  this.dispatch(pushClassNames(ITEM_STYLE[type]));
  this._state = type;
}

function onTouchEnded(){
  var type = this._state === "right" ? "passive" : "right";
  this.setItemStyle(type);
}



module && (module.exports = BoardItem);
