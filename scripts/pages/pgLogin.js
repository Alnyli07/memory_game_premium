/* 
		You can modify its contents.
*/
/*global lang */
const extend = require('js-base/core/extend');
const LoginPageFB001Design = require('ui/ui_pgLogin');
const Router = require("sf-core/ui/router");
const AlertView = require('sf-core/ui/alertview');

const LoginPageFB001 = extend(LoginPageFB001Design)(
  // Constructor
  function(_super) {
    // Initalizes super class for this page scope
    _super(this);
    // overrides super.onShow method
    this.onShow = onShow.bind(this, this.onShow.bind(this));
    // overrides super.onLoad method
    this.onLoad = onLoad.bind(this, this.onLoad.bind(this));
    this.loginbutton.onPress = loginPress.bind(this);

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

/**
 * @event onLoad
 * This event is called once when page is created.
 * @param {function} superOnLoad super onLoad function
 */
function onLoad(superOnLoad) {
  superOnLoad();
}

function loginPress() {
  var text = this.userName.text;
  console.log("Text: "+ text);
  if (usernameIsValid(text)) {
    Router.go("pgGameBoard");
  }else{
    showAlert();
  }
}

function showAlert() {
  var myAlertView = new AlertView({
    title: lang["invalid_user_name_title"],
    message: lang["invalid_user_name_message"]
  });
  myAlertView.addButton({
    text: lang["ok"]
  });
  myAlertView.show();
}

function usernameIsValid(username) {
  return /^[0-9a-zA-Z_.-]+$/.test(username) && (username.length < 7 && username.length > 3);
}

module && (module.exports = LoginPageFB001);
