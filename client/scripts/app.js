// YOUR CODE HERE:
class App {
  constructor() {
    this.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';
    this.username = window.location.search;
    this.data = {};
    this.cleanedData = {}; 
  }
  
  init(username) {
    var context = this;
    this.fetch();
    this.handleUsernameClick(username);
    this.handleSubmit();
    this.handleRenderMessagesClick();
    // setTimeInterval();
    setInterval(function() {
      // console.log(context);
      context.fetch();
      context.renderAllMessages();
    }, 2000);
    // $('#main').append(`<div class="username ${username}">${username}</div>`);
  }

  send(message) {
    var context = this;
    $.ajax({
      url: context.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }
  
  fetch() {
    var context = this;
    $.ajax({
      url: context.server,
      type: 'GET',
      data: {order: '-createdAt', limit: 50},
      contentType: 'application/json',
      success: function (data) {
        context.data = data;
        context.getCleanedData(data);
      },
      error: function (data) {
        console.error('chatterbox: Failed to recieve message', data);
      }
    });
  }
 
  getCleanedData(dataSource) {
    this.cleanedData = this.cleanAndValidateAllData(dataSource);
  }

  // data manipulation
  sanitizeDatum(dataSource) {
    const regex = /(script|img|\<\!|\$\(|style|iframe)/gi;
    return dataSource.replace(regex, '**failed attempt**');
  }
  
  cleanAndValidateAllData(dataSource) {
    return dataSource.results.map((elem) => {
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
  
  getUnique(textValue) {
    let raw = this.data.results.map((elem) => elem[textValue]);
    return [...new Set(raw)];
  }

  // frontend activities
  clearMessages() {
    $('#chats').empty();
  }

  renderMessage({username, text, roomname}) {
    $('#chats').append(`
      <div class="username ${username}">
        <span class="textUsername">@${username}: </span>
        <span class="textMessage">${text}</span>
        <span class="textRoomname">[${roomname}]</span>
      </div>
    `);
  }

  renderAllMessages() {
    this.clearMessages();
    this.cleanedData.map((elem) => this.renderMessage(elem));
    
  }

  renderRoom(room) {
    $('#roomSelect').append(`<div>${room}</div>`);
  }
  
  // click handlers
  handleUsernameClick(username) {  
    $(`.username.${username}`).click((e) => {
      console.log('msg: ', e.target);
    });
  }

  handleRenderMessagesClick(username) {  
    $('h1').click((e) => {
      console.log('show me the messages', e.target);
      this.renderAllMessages();
    });
  }

  handleSubmit() {
    $('#send').click('.submit', (e) => {
      let text = $('#textInput').val();
      let username = $('#usernameInput').val();
      this.send({username: username, text: text, roomname: 'lobby'});
      $('#textInput').text('');
      $('#usernameInput').text('');
    });
  }
 
  
} // closes App

var app = new App;
$(document).ready(function() {
  // app.init();
});