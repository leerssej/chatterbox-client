// YOUR CODE HERE:
class App {
  constructor() {
    this.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';
    this.username = window.location.search;
    this.data = {};
    this.cleanedData = {}; 
  }
  
  init(username) {
    $('#main').append(`<div class="username ${username}">${username}</div>`);
    this.handleUsernameClick(username);
    this.handleSubmit();
  }

  send(message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }
  
  fetch() {
    var context = this;
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
      type: 'GET',
      data: {order: '-createdAt', limit: 100},
      contentType: 'application/json',
      success: function (data) {
        context.data = data;
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to recieve message', data);
      }
    });
  }

  clearMessages() {
    $('#chats').empty();
  }

  renderMessage({username, text, roomname}) {
    // $('#chats').append(`<div class="username ${username}"><em>${username}</em>  ${text}  [${roomname}]</div>`);
    $('#chats').append(`<div class="username ${username}"> ${username} </div>  
                        <div>${text}  [${roomname}]</div>`);
    // this.handleUsernameClick(username); // TODO make message usernames selectable
  }

  renderRoom(room) {
    $('#roomSelect').append(`<div>${room}</div>`);
  }
  
  handleUsernameClick(username) {  
    $(`.username.${username}`).click((e) => {
      console.log('msg: ', e.target);
    });
  }

  handleSubmit() {
    $('#send').click('.submit', (e) => {
      // console.log('submit working');
      // sends a message upon clicking
      let text = $('#textInput').val();
      let username = $('#usernameInput').val();
      this.send({username: username, text: text, roomname: 'lobby'});
      $('#textInput').text('');
      $('#usernameInput').text('');
    });
  }
 
  getUnique(textValue) {
    let raw = this.data.results.map((elem) => elem[textValue]);
    return [...new Set(raw)];
  }
  
  // scrubData(dataSource) {
  //   return this.data.results.map((elem) => sanitizeData(elem[dataSource]));
  // }
  
  // sanitizeData(textValue, dataSource) {
  //   const regex = /(<\s*\/?\s*)script(\s*([^>]*)?\s*>)/gi;
  //   return this[dataSource].results.map((elem) => {
  //     if (elem[textValue] === '' || !elem[textValue]) {
  //       return elem[textValue] = 'none supplied';
  //       // console.log(elem[textValue]);
  //     } else {
  //       return elem[textValue].replace(regex, '$1div$2');  
  //     }
  //   });
  // }
  
  sanitizeDatum(dataSource) {
    const regex = /(<\s*\/?\s*)script(\s*([^>]*)?\s*>)/gi;
    return dataSource.replace(regex, '**failed attempt**');
  }
  
  cleanAndValidateAllData() {
    return this.data.results.map((elem) => {
      var obj = {
        objectId: elem.objectId,
        username: '1',
        text: 'hello',
        roomname: 'lobby',
        createdAt: elem.createdAt,
        updatedAt: elem.updatedAt,
      };
      obj['username'] = elem['username'] || 'anon';
      obj['text'] = elem['text'] || 'nothing to share';
      obj['roomname'] = elem['roomname'] || 'unknown';
      obj['username'] = this.sanitizeDatum(obj['username']);
      obj['text'] = this.sanitizeDatum(obj['text']);
      obj['roomname'] = this.sanitizeDatum(obj['roomname']);
      return obj;
    });
  }
  
  getCleanedData() {
    this.cleanedData = this.cleanAndValidateAllData();
    // this.cleanedData.text = this.sanitizeData('text');
    // this.cleanedData.roomname = this.sanitizeData('roomname');
  }
  
} // closes App

var app = new App;
$(document).ready(() => {
  // app.init();
});