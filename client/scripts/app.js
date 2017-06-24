// YOUR CODE HERE:
// Hello Masato

// var message = {
//   username: 'shawndrost',
//   text: 'trololo',
//   roomname: '4chan'
// };

$(document).ready(function(){
  $('#send .submit').on('submit', function(e){
    app.handleSubmit();
  });

  app.init();

  $('#roomSelect select').on('change', function(e){
    if (this.value === 'Pick a room'){
      app.clearMessages();
    }else{
      app.renderRoomMessages(this.value);
    }
    window.currentRoomname = this.value;
  });
});

window.data = null;
window.currentRoomname = null;
window.username = window.location.search.replace('?username=', '');

var app = {
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages?limit=1000&order=-createdAt',
  init: function(){
    // fetch data from server
    app.fetch();
  },
  processing: function(){
    //Get all the Room names in drop down
    var roomnamesObject = {};
    roomnamesObject.roomnameSort = [];
    for(let obj of window.data.results){
      var key = String(obj.roomname).trim();
      if (roomnamesObject.hasOwnProperty(key)){
        roomnamesObject[key] = roomnamesObject[key] + 1;
      }else{
        roomnamesObject[key] = 1;
        roomnamesObject.roomnameSort.push(key);
      }
    }
    roomnamesObject.roomnameSort = roomnamesObject.roomnameSort.sort();
    for(let i of roomnamesObject.roomnameSort){
      app.renderRoom(i);
    }
  },
  send: function(message){
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        console.log(data);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },
  fetch: function(){
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'GET',
      data: JSON,
      contentType: 'application/json',
      success: function (data) {
        window.data = data;
        app.processing();      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },
  clearMessages: function(){
    $('#chats').html('');
  },
  renderMessage: function(message, who, newMessage){
    var element = `<div class="chat ${who}">
                    <a href=# onclick="app.handleUsernameClick()" class="username ${who}">${message.username}</a>
                    <span class="talk-bubble round ${who}">${message.text}</span>
                  </div>`;
    if (newMessage !== undefined) {
      $('#chats').prepend(element);
    }else{
      $('#chats').append(element);
    }
  },
  renderRoom: function(roomname){
    var element = `<option value="${roomname}">
                    ${roomname}
                  </option>`;
    $('#roomSelect select').append(element);
  },
  renderRoomMessages: function(roomname){
    var count = 0;
    app.clearMessages();
    for(let obj of window.data.results){
      if( obj.roomname === roomname && obj.text !== undefined) {
        if ( obj.username !== undefined && app.NOT_TROLL(obj)){
          if(obj.username === window.username){
            app.renderMessage(obj);
            count++;
          }else{
            app.renderMessage(obj, 'others');
            count++;
          }
        }
      }
    }
    if (count === 0){
      $('#chats').append("<div>Start a Conversation!</div>");
    }
  },
  NOT_TROLL: function(obj){  //ESCAPING CODE
    if (obj.text.indexOf('<script>') > -1){
      return false;
    }
    if (obj.username.indexOf('<script>') > -1){
      return false;
    }
    return true;
  },
  handleUsernameClick: function(){
    console.log('triggered handleUsernameClick');
    return;
  },
  handleSubmit: function(){
    console.log('triggered handleSubmit');
    console.log(window.currentRoomname);
    if (window.currentRoomname === null){
      alert("Please select a room");
      return false;
    }
    if ( $('#message').val() === '' ) {
      alert('What do you want to message?');
      return false;
    }

    var message = {
      username: window.username,
      text: $('#message').val(),
      roomname: window.currentRoomname
    };

    app.send(message);
    app.renderMessage(message, 'me', 'newMessage');
  }
};

//