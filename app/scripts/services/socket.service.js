/**
 * Created by Rhea on 12/12/15.
 */

angular.module('brainCoApp').factory('SocketService', socketService);

socketService.$inject = [
  '$rootScope'
];

function socketService($rootScope) {
  var socket = io.connect();

  function _on(eventName, callback) {
    socket.on(eventName, function() {
      var args = arguments;
      $rootScope.$apply(function() {
        callback.apply(socket, args);
      });
    });
  }

  function _emit(eventName, data, callback) {
    socket.emit(eventName, data, function() {
      var args = arguments;
      $rootScope.$apply(function() {
        if(callback) {
          callback.apply(socket, args);
        }
      });
    });
  }

  return {
    on: _on,
    emit: _emit
  }
}
