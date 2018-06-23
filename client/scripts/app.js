// YOUR CODE HERE:
class App {
  constructor() {
    this.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';
    this.username = window.location.search;
    this.data = {};
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
      data: {order: '-createdAt', limit: 500},
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
      console.log('msg still there');
    });
  }
 
  getUserNames() {
    let raw = this.data.results.map((elem) => elem.username);
    return [...new Set(raw)];
  }
  
  getRoomNames() {
    let raw = this.data.results.map((elem) => elem.roomname);
    return [...new Set(raw)];

  }
  
  getText() {
    let raw = this.data.results.map((elem) => elem.text);
    return [...new Set(raw)];
  }

} // closes App

var app = new App;
$(document).ready(() => {
  // app.init();
});
