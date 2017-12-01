/* 
		You can modify its contents.
*/
const extend = require('js-base/core/extend');

const BoardItemDesign = require('library/BoardItem');

const BoardItem = extend(BoardItemDesign)(
  //constructor
  function(_super, props, pageName) {
    // initalizes super class for this sc ope
    _super(this, props || {});
    this.pageName = pageName;
    
  }

);

function setItemStyle(type){
  
  switch(type){
    case "passive":
      break;
    case "active":
      break;
    case "empty":
      break;
  }
  
}

module && (module.exports = BoardItem);