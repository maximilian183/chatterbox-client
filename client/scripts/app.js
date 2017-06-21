// YOUR CODE HERE:
// Hello Masato

// var message = {
//   username: 'shawndrost',
//   text: 'trololo',
//   roomname: '4chan'
// };

var app = {

  server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',

  init: function(){
    $('#main .username').on('click', function(e){
        app.handleUsernameClick();
    });
    return;
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
    $('#main').append(`<button class="username">${message.username}</button>`);
  },
  renderRoom: function(roomname){
    var element = `<div>
                    <span>${roomname}</span>
                  </div>`;
    $('#roomSelect').append(element);
  },
  handleUsernameClick: function(){
    return;
  },
  handleSubmit: function(){
    console.log('triggered handleSubmit');
  }
};

$( document ).ready(function() {
  $('#send .submit').on('submit', function(e){
      app.handleSubmit();
  });
});