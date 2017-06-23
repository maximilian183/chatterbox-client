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
  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  init: function(){
    // fetch data from server
    app.fetch();
  },
  processing: function(){
    //Get all the Room names in drop down
    var roomnamesObject = {};
    for(let obj of window.data.results){
      roomnamesObject[obj.roomname] = true;
    }
    for(let i of Object.keys(roomnamesObject)){
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
        app.processing();
        console.log(data);
        console.log(data.length);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },
  clearMessages: function(){
    $('#chats').html('');
  },
  renderMessage: function(message, who){
    var element = `<div class="chat ${who}">
                    <a href=# onclick="app.handleUsernameClick()" class="username ${who}">${message.username}</a>
                    <span class="talk-bubble round ${who}">${message.text}</span>
                  </div>`;
    $('#chats').prepend(element);
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
      if( obj.roomname === roomname ) {
        if ( obj.username !== undefined && obj.text.length > 0 && app.NOT_TROLL(obj)){
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
    if (window.currentRoomname === null){
      alert("Please select a room");
      return false;
    }
    if ( $('#message').val() === '' ) {
      alert('What do you want to message?')
      return false;
    }

    var message = {
      username: window.username,
      text: $('#message').val(),
      roomname: window.currentRoomname
    };

    app.send(message);
    app.renderMessage(message);
  }
};

//