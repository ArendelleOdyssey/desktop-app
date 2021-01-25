// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const customTitlebar = require('custom-electron-titlebar');
const {remote} = require('electron')

document.addEventListener('DOMContentLoaded', () => {
  // It does not make sense to use the custom titlebar on macOS where
  // it only tries to simulate what we get with the normal behavior anyway.
  if (process.platform != 'darwin') {

    // add a menu
    const menu = new remote.Menu();

    new customTitlebar.Titlebar({
        backgroundColor: customTitlebar.Color.fromHex('#000F42'),
        icon: `https://arendelleodyssey.com/wp-content/uploads/2021/01/cropped-logo_final_final_PNG-3.png`,
        menu
    });

    var head = document.getElementsByTagName('head')[0];
    var sty = document.createElement('style');
    sty.type = 'text/css';
    var css = `
      .titlebar{
          z-index: 999999;
      }
      .oneall_social_login{
          visibility: hidden;
      }
  
      div.edit-post-layout.is-mode-visual.is-sidebar-opened.has-metaboxes.interface-interface-skeleton{
        top : 30px !important;
      }
      
      #wpadminbar{
          top: 30px !important;
      }
      
      /* There two selectors below is for the backsite (admin dashboard) */
      #adminmenuwrap{
        position: relative !important;
      }
      #adminmenu{
        top: 30px !important;
        margin : 40px 0 !important;
      }
      #wpbody{
        margin-top: 30px !important;
      }
      ${window.location.href.startsWith('https://arendelleodyssey.com') ?'':`
      body{
        margin-top: 30px !important;
      }
      nav{
        margin-top: 30px !important;
      }`}
      
      /* Elementor */
      #elementor-panel-header-wrapper{
        top : 30px;
        position: relative;
      }
      #elementor-panel-content-wrapper{
        position: relative !important;
        top: 30px !important;
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
  }
})

/*global document, window*/
/*eslint no-undef: "error"*/