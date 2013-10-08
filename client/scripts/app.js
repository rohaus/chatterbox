var url = 'https://api.parse.com/1/classes/chatterbox';
var rooms = {};
var secure = function(key){
  if (key === undefined || key === null){
    return undefined;
  }
  return key.replace("<", "&lt;").replace(">","&gt;");
}

var display = function(messages){
  var list, option, results = messages.results;
  $('.chatbox').text('');
  $('select').text('');
  for(var i = results.length-1 ; i >= results.length - 10; i--){
    var message = results[i];
    message.username = secure(message.username) || username;
    message.roomname = secure(message.roomname) || 'lobby';
    message.text = secure(message.text) || '';
    rooms[message.roomname] = message.roomname;
    list = '<li class="message">('+message.roomname+') '+message.username+": "+message.text+'</li>';
    $('.chatbox').append(list);
  }
  for(var room in rooms){
    var option = '<option>'+room+'</option>';
    $('select').append(option);
  }
}

var fetch = function(callBack){
  return $.ajax({
    url: url,
    type: 'GET',
    contentType: 'application/json',
    data : {
      limit: 10,
      order: "-createdAt"
    },
    success: function(messages){
      console.log("Messages fetched");
      callBack(messages);
    },
    error: function(){
      console.log('Error fetching messages');
    }
  });
};

var send = function(msg){
  var message = {
    'username': username,
    'text': msg,
    'roomname': $('select').val() || 'lobby'
  };
  $.ajax({
  	url: url,
  	type: 'POST',
  	data: JSON.stringify(message),
    contentType: 'application/json',
  	success: function(data){
  		console.log('Message Sent');
  	},
  	error: function(data){
  		console.log('Error sending message');
  	}
  });
  fetch(display);
};

// create rooms for users to chat in
/*
  On click
*/

// friends
/*
filter by friends using bold text
*/

var username = prompt("What is your username?");
fetch(display);
setInterval(function(){fetch(display);}, 5000);
