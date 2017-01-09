// function x(tab) {
//     console.log("PROTRACTOR")
//
//     var div = document.createElement('div');
//
//     div.innerHTML = "HELLO WORLD"
//     div.style.position = 'absolute';
//     div.style.border = '10px solid turquoise'
//     div.style.left = '0'
//     div.style.top = '0';
//
//     document.body.appendChild(div);
// }
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      console.warn("RECEIVED MESSAGE IN CONTENT SCRIPT");
  }
 );
