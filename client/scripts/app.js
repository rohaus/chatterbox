var url = 'https://api.parse.com/1/classes/chatterbox';
//display()
var display = function(messages){
  var list, results = messages.results;
  $('.chatbox').text('');
  console.log('clearing chat box');
  for(var i = results.length - 10; i < results.length; i++){
    var message = results[i];
    if (message.username === undefined){
      message.username = "anonymous";
    }
    list = '<li class="message">'+message.username+": "+message.text+'</li>';
    $('.chatbox').append(list);
  }
}


//fetch()
var fetch = function(callBack){
  return $.ajax({
    url: url,
    type: 'GET',
    contentType: 'application/json',
    data : {
      limit: 10
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
fetch(display);
setInterval(function(){
  fetch(display);
}, 5000);

//send()
var send = function(msg){
  var message = {
    'username': 'ken2',
    'text': msg,
    'roomname': '4chan'
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
send("abcefh");