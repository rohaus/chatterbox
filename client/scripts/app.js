/*
anytime we have an event we want to reset the interval?

*/

var url = 'https://api.parse.com/1/classes/chatterbox';
var timer;
var rooms = {};
var users = {};
var username = prompt("What is your username?");

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
};

var display = function(messages){
  var user, text, room, msg;
  $('.chatbox').text('');
  _(messages).each(function(message){
    user = secure(message.username);
    text = secure(message.text);
    room = secure(message.roomname);
    rooms[room] = room || 'lobby';
    users[user] = user || 'anonymous';
    msg = "<li class="+user+" "+room+">"+user+": "+text+"</class>";
    $('.chatbox').append(msg);
  });
  updateRoomList($('select').val());
  updateFriendList();
};

var fetch = function(property, value){
  $.ajax({
    url:url,
    type:'GET',
    contentType: 'application/json',
    data: {
      limit:50,
      order:'-createdAt',
    },
    success:function(data){
      console.log('Messages retrieved.');
      filterMsgs(data, property, value);
    },
    error:function(){
      console.log('Error in sending.');
    }
  });
  clearTimeout(timer);
  timer = setInterval(function(){fetch(property, value);}, 5000);
};

var filterMsgs = function(msgObj, property, value){
  var messages = msgObj.results;
  if(property){
    messages = _.filter(messages, function(msg){
      return msg[property] === value;
    })
  }
  return display(messages);
};

var send = function(text, room){
  var message = {
    username: username,
    text: text,
    roomname: room
  };
  $.ajax({
    url:url,
    type:'POST',
    data:JSON.stringify(message),
    contentType: 'application/json',
    success:function(){
      console.log('Message successfully sent.');
    },
    error:function(){
      console.log('Error in sending.');
    }
  });
};

var updateRoomList = function(currentRoom){
  currentRoom = currentRoom || 'lobby';
  rooms[currentRoom] = currentRoom;
  var sortedRooms = _(rooms).map(function(key){
    var selected = (key === currentRoom) ? '" selected':'"';
    return '<option class="'+key+selected+'>'+key+'</option>';
  });
  $('select').html(sortedRooms.join('\n'));
};

var updateFriendList = function(){
  var friends = _(users).map(function(key){
    return '<li class="friend '+key+'">'+key+'</li>';
  });
  $('ul.friends').html(friends.sort());
};
