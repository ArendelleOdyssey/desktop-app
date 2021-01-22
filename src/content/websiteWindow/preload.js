// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
document.addEventListener('DOMContentLoaded', () => {

  var head = document.getElementsByTagName('head')[0];
  var sty = document.createElement('style');
  sty.type = 'text/css';
  var css = `
    .oneall_social_login{
        visibility: hidden;
    }
    ` // You can compress all css files you need and put here
  if (sty.styleSheet){
    sty.styleSheet.cssText = css;
  } else {
    sty.appendChild(document.createTextNode(css));
  }
  head.appendChild(sty);

  var socialLogin = document.querySelector('.oneall_social_login');
  socialLogin.parentNode.removeChild(socialLogin);
})
  
/*global document*/
/*eslint no-undef: "error"*/