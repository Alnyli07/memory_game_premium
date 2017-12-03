/* 
		You can modify its contents.
*/
const extend = require('js-base/core/extend');
const NewPage001Design = require('ui/ui_pgFBLogin');

const NewPage001 = extend(NewPage001Design)(
  // Constructor
  function(_super) {
    // Initalizes super class for this page scope
    _super(this);
    // overrides super.onShow method
    this.onShow = onShow.bind(this, this.onShow.bind(this));
    // overrides super.onLoad method
    this.onLoad = onLoad.bind(this, this.onLoad.bind(this));

    Object.assign(this.fbLogin, {
      onChangedURL: function(event) {
        console.log("Event Change URL: " + event.url);
      },
      onError: function(event) {
        console.log("Event Error : " + event.message + ", URL: " + event.url);
      },
      onLoad: function(event) {
        console.log("Event Load: " + event.url);
      },
      onShow: function(event) {
        console.log("Event Show: " + event.url);
      }
    });

  });

/**
 * @event onShow
 * This event is called when a page appears on the screen (everytime).
 * @param {function} superOnShow super onShow function
 * @param {Object} parameters passed from Router.go function
 */
function onShow(superOnShow) {
  superOnShow();
  this.fbLogin.loadURL('https://www.facebook.com/v2.11/dialog/oauth?client_id=155540368398387&redirect_uri=https://www.facebook.com');
}

/**
 * @event onLoad
 * This event is called once when page is created.
 * @param {function} superOnLoad super onLoad function
 */
function onLoad(superOnLoad) {
  superOnLoad();
}

module && (module.exports = NewPage001);
