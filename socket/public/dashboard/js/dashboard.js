$( function() {
  var brainwave = $('#Brainwave').epoch( {
    type: 'time.line',
    axes: ['left', 'bottom'],
    data: [ { values: [ { time: Date.now()/1000, y: 0 } ] } ],
  } );
  console.log('The brainwave epoch is:');
  console.log(brainwave);

  //var pages = $( '#pages' ).epoch( { type: 'bar' } );

  //console.log('The io is:');
  //console.log(io);
  var dashboard = io( 'localhost:3000/dashboard' );
  dashboard.on( 'stats-updated', function( update ) {
    console.log('The update value is:::');
    console.log(update.value);
    brainwave.push( [ { time: Date.now()/1000, y: update.value } ] );
  } );

} );
