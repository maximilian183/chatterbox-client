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
});

window.data = null;
var app = {

  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',

  init: function(){
    // fetch data from server
    app.fetch();
      console.log(window.data);
  },
  chatRooms:[],
  processing: function(){
      // create empty array
      var roomnamesObject = {};
      // loop through result array
      for(let obj of window.data.results){
        // push list of room name into empty array
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
        // console.table(data.results);
        console.log(data);
        window.data = data;
        console.log(this)
        app.processing();
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
  renderMessage: function(message){
    var element = `<div>
                    <span>${message.username}</span>
                    <span>${message.text}</span>
                    <span>${message.roomname}</span>
                  </div>`;
    $('#chats').append(element);
    $('#main').append(`<button onclick="app.handleUsernameClick()" class="username">${message.username}</button>`);
  },
  renderRoom: function(roomname){
    var element = `<option value="${roomname}">
                    ${roomname}
                  </option>`;
    $('#roomSelect select').append(element);
  },
  handleUsernameClick: function(){
    return;
  },
  handleSubmit: function(){
    console.log('triggered handleSubmit');
  }
};

//