// YOUR CODE HERE:
class App {
  constructor() {
    this.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';
    this.username = window.location.search;
    this.data = {};
    this.cleanedData = {}; 
  }
  
  init(username) {
    this.handleUsernameClick(username);
    this.handleSubmit();
    this.handleRenderMessagesClick();
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
      data: {order: '-createdAt', limit: 10},
      contentType: 'application/json',
      success: function (data) {
        context.data = data;
        context.getCleanedData(data);
        // console.log(context.data, context.cleanedData);
      },
      error: function (data) {
        console.error('chatterbox: Failed to recieve message', data);
      }
    });
  }

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
    this.cleanedData.map((elem) => this.renderMessage(elem));
    
  }

  renderRoom(room) {
    $('#roomSelect').append(`<div>${room}</div>`);
  }
  
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
 
  getUnique(textValue) {
    let raw = this.data.results.map((elem) => elem[textValue]);
    return [...new Set(raw)];
  }
  
  sanitizeDatum(dataSource) {
    const regex = /(script|img|\<\!|\$\(|style)/gi;
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
  
  getCleanedData(dataSource) {
    // this.fetch();
    this.cleanedData = this.cleanAndValidateAllData(dataSource);
  }
  
} // closes App

var app = new App;