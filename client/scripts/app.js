// YOUR CODE HERE:
class App {
  constructor() {
    this.server = 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages';
    this.username = window.location.search;
    this.data = {};
    this.cleanedData = {};
    this.roomMessages = {};
  }
  
  init(username) {
    var context = this;
    this.fetch();
    // this.handleUsernameClick(username);
    this.handleSubmit();
    this.handleRoomnameClick();
    this.handleRenderMessagesClick();
    setInterval(function() {
      context.fetch();
      context.renderAllMessages('cleanedData');
    }, 2000);
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
      data: {order: '-createdAt', limit: 100},
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
    const regex = /(\?|script|img|\<\!|\$\(|style|iframe|\<)/gi;
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
    let raw = this.cleanedData.map((elem) => elem[textValue]);
    return [...new Set(raw)];
  }
  
  getSingleRoomMessages(room) {
    return this.cleanedData.filter((elem) => (elem.roomname === room));    
  }

  // frontend activities
  clearMessages() {
    $('#chats').empty();
  }

  renderMessage({username, text, roomname}) {
    $('#chats').append(`
      <div class="username">
        <span class="textUsername ${username}">@${username}: <br></span>

        <span class="textMessage">${text}</span>
        <span class="textRoomname">[${roomname}]</span>
      </div>
    `);
    this.handleUsernameClick(username);
  }

  renderAllMessages(sourceData) {
    this.clearMessages();
    this[sourceData].map((elem) => this.renderMessage(elem));
    
  }

  renderRooms() {
    this.getUnique('roomname').map((roomname) => {
      $('.rightnav').append(`<a class="${roomname}" href='#'>${roomname}</a>`);
      this.handleRoomnameClick(roomname);
    });
  }
  
  renderRoomMessages() {
    this.getSingleRoomMessages('roomname').map((room) => 
      $('.rightnav').append(`<a href='#'>${room}</a>`)
    );
  }
  
  // click handlers
  handleRoomnameClick(roomname) {
    // if (!typeof e.handleObj.handler === 'function') {
    $(`.${roomname}`).click((e) => {
      this.roomMessages = this.getSingleRoomMessages(e.toElement.className);
      console.log(this.roomMessages);
      this.renderAllMessages('roomMessages');
    });
    
    
    // $('.sidenav').append('<br>');
    // }
  }
  
  handleUsernameClick(username) {
    // if (!typeof e.handleObj.handler === 'function') {
    $(`.${username}`).click((e) => {
      $('.leftnav').append(e.target);
    });
    // $('.sidenav').append('<br>');
    // }
  }
  
  checkUsernameClick(username) {  
  }

  handleRenderMessagesClick(username) {  
    $('h1').click((e) => {
      console.log('show me the messages', e.target);
      this.renderAllMessages(this[username]);
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