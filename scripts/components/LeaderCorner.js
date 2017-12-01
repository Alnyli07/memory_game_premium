/* 
		You can modify its contents.
*/
const extend = require('js-base/core/extend');

const LeaderCornerDesign = require('library/LeaderCorner');

const LeaderCorner = extend(LeaderCornerDesign)(
  //constructor
  function(_super, props, pageName) {
    // initalizes super class for this scope
    _super(this, props || {});
    this.pageName = pageName;
  }

);

module && (module.exports = LeaderCorner);