var url = 'https://api.parse.com/1/classes/chatterbox';
var timer;
var rooms = {};
var secure = function(key){
  if (key === undefined || key === null){
    return undefined;
  }
  return key.replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace("&", "&amp;")
            .replace('"', "&quot;")
            .replace("'", "&#x27;")
            .replace("/", "&#x2F;");
}

var filterMessages = function(className){
  // debugger;
  $('.message').css({'display':'none'});
  $('.message').filter('.'+className).css({'display':'block'});
};

var updateRooms = function(){
  $('select').text('');
  for(var room in rooms){
    var option = '<option>'+room+'</option>';
    $('select').append(option);
  }
};

var display = function(messages, filter){
  var list, option, results = messages.results;
  $('.chatbox').text('');
  // debugger;
  for(var i = results.length-1 ; i >= results.length - 50; i--){
    var message = results[i];
    message.username = secure(message.username) || username;
    message.roomname = secure(message.roomname) || 'lobby';
    message.text = secure(message.text) || '';
    rooms[message.roomname] = message.roomname;
    list = '<li class="message ' + message.roomname +'">('+message.roomname+') '+message.username+": "+message.text+'</li>';
    $('.chatbox').append(list);
  }
  updateRooms();
  filterMessages(filter);
};

var fetch = function(filter){
  $.ajax({
    url: url,
    type: 'GET',
    contentType: 'application/json',
    data : {
      limit: 50,
      order: "-createdAt",
    },
    success: function(messages){
      console.log("Messages fetched");
      display(messages, filter);
    },
    error: function(){
      console.log('Error fetching messages');
    }
  });
  // debugger;
  clearTimeout(timer);
  timer = setInterval(function(){fetch(filter);}, 5000);
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
};

var username = prompt("What is your username?");

// create rooms for users to chat in
/*
  On click
*/

// friends
/*
filter by friends using bold text
*/

// var filter = null;
// fetch(display);
// // updateRooms();
fetch();
