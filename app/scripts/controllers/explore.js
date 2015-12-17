'use strict';

/**
 * @ngdoc function
 * @name brainCoApp.controller:AboutCtrl
 * @description
 * # ExploreCtrl
 * Controller of the brainCoApp
 */
angular.module('brainCoApp').controller('ExploreCtrl', exploreCtrl);

exploreCtrl.$inject = [
  'SocketService'
];

function exploreCtrl(SocketService) {
  var brainwave = $('#Brainwave').epoch( {
    type: 'time.area', axes: ['left', 'bottom', 'right'],
    data: [ { values: [ { time: Date.now()/1000, y: 0 } ] } ],
  } );
  console.log('The brainwave epoch is:');
  console.log(brainwave);


  var explore = io( 'localhost:9000/explore' );
  explore.on( 'stats-updated', function( update ) {
    brainwave.push( [ { time: Date.now()/1000, y: update.value } ] );
  } );


  var allData = [
    {value: 0.3}, {value: 0.5}, {value: 0.4}, {value: 0.6}, {value: 0.2},
    {value: 0.7}, {value: 0.1}, {value: 0.8}, {value: 0.2}, {value: 0.4},
    {value: 0.5}, {value: 0.9}, {value: 0.4}, {value: 0.4}, {value: 0.4},
    {value: 0.3}, {value: 0.5}, {value: 0.4}, {value: 0.6}, {value: 0.2},
    {value: 0.7}, {value: 0.1}, {value: 0.8}, {value: 0.2}, {value: 0.4},
    {value: 0.4}, {value: 0.4}, {value: 0.4}, {value: 0.4}, {value: 0.4},
    {value: 0.3}, {value: 0.5}, {value: 0.4}, {value: 0.6}, {value: 0.2},
    {value: 0.7}, {value: 0.1}, {value: 0.8}, {value: 0.2}, {value: 0.4},
    {value: 0.4}, {value: 0.4}, {value: 0.4}, {value: 0.4}, {value: 0.4},
    {value: 0.3}, {value: 0.5}, {value: 0.4}, {value: 0.6}, {value: 0.2},
    {value: 0.7}, {value: 0.1}, {value: 0.8}, {value: 0.2}, {value: 0.4},
    {value: 0.4}, {value: 0.4}, {value: 0.4}, {value: 0.4}, {value: 0.4},
  ]
  var socket = io('localhost:9000/explore');
  socket.on('connect', function() {
    console.log('connected');
    var data = {
     url: window.location.href,
     value: 0.5
    }
     socket.emit('client-data', data );
  } );

  for(var i=0; i < allData.length; i++) {
    (function(i) {
      setTimeout(
        function(){
          console.log('Send data::::'+allData[i]);
          socket.emit('sendBrainWaveData', allData[i]);
        }, (1000 * i));
    })(i);
  }



}



/*
angular.module('brainCoApp')
  .controller('ExploreCtrl', function ($scope) {
    $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.series = ['Series A'];

    var dataList = [
      [65, 59, 80, 81, 56, 55, 40],
      [28, 48, 40, 19, 86, 27, 90],
      [65, 59, 80, 81, 56, 55, 40],
      [28, 48, 40, 19, 86, 27, 90],
      [65, 59, 80, 81, 56, 55, 40],
      [28, 48, 40, 19, 86, 27, 90],
      [65, 59, 80, 81, 56, 55, 40],
      [28, 48, 40, 19, 86, 27, 90],
      [65, 59, 80, 81, 56, 55, 40],
      [28, 48, 40, 19, 86, 27, 90]
    ];
    for(var i = 0; i < 10; i++) {
      $scope.data = dataList[i];
    }
    $scope.data = [
      [65, 59, 80, 81, 56, 55, 40],
    ];
    $scope.onClick = function(points, evt) {
      console.log(points, evt);
    }
  });
*/
