/* 
		You can modify its contents.
*/
const extend = require('js-base/core/extend');

const BoardItemDesign = require('library/BoardItem');

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
    this.pageName = pageName;
  }

);

function setItemStyle(type) {

  switch (type) {
    case "passive":
      break;
    case "right":
      break;
    case "empty":
      break;
    case "wrong":
      break;
  }

}

module && (module.exports = BoardItem);
