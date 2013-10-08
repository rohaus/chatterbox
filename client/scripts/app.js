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

var updateRooms = function(roomName){
  $('select').text('');
  for(var room in rooms){
    var option = '<option class="'+room+'">'+room+'</option>';
    if (!(room === roomName)){
      $('select').append(option);
    }else{
      $('select').prepend(option);
    }
  }
};

var display = function(messages, filter){
  var list, option, results = messages.results;
  $('.chatbox').text('');
  for(var i = results.length-1 ; i >= results.length - 50; i--){
    var message = results[i];
    message.username = secure(message.username) || username;
    message.roomname = secure(message.roomname) || 'lobby';
    message.text = secure(message.text) || '';
    rooms[message.roomname] = message.roomname;
    list = '<li class="message ' + message.roomname +'">('+message.roomname+') '+message.username+": "+message.text+'</li>';
    $('.chatbox').append(list);
  }
  updateRooms(filter);
  $('.message').css({'display':'none'});
  $('.message').filter('.'+filter).css({'display':'block'});
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

fetch();
