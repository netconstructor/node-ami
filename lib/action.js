var NEWLINE = '\r\n';

var noop = function() { };

var Action = function(data) {
  this.data = data || {};
  this.actionID = this.data.actionID = Action.getNextActionID();
  this.callback = noop;
}

Action.nextActionIndex = 0;
Action.getNextActionID = function() {
  Action.lastActionID = new Date().getTime() + '-' + ~~(Math.random() * 100000)  + '-' + Action.nextActionIndex++;
  return Action.lastActionID;
}


//write's the action's data to a string fit to be sent to AMI
Action.prototype.serialize = function() {
  var keys = Object.keys(this.data);
  var packet = '';
  for(var i = 0, key; key = keys[i]; i++) {
    //ensure first char is uppercase (support json -> AMI casing)
    packet += key[0].toUpperCase();
    packet += key.substr(1);
    packet += ': ';
    packet += this.data[key];
    packet += NEWLINE;
  }
  packet += NEWLINE;
  return packet;
}

Action.prototype.receive = function(message) {
  if(message.actionID != this.actionID) return false;
  if(message.response == 'Success') {
    this.callback(null, message);
  }
  else {
    this.callback(message, null);
  }
  return true;
}

module.exports = Action;
