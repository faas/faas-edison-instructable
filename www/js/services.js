angular.module('starter.services', [])

.factory('Sensors', function() {

  var sensors = [
    { title: 'LEDs', image: 'led.jpg', page: 'led' },
    { title: 'Light Sensor', image: 'light.jpg', page: 'light' },
    { title: 'Accelerometer', image: 'accelerometer.jpg', page: 'accelerometer' },
    { title: 'Rotary', image: 'rotary.jpg', page: 'rotary' },
    { title: 'Temperature', image: 'temperature.jpg', page: 'temperature' },
    { title: 'Button', image: 'button.jpg', page: 'button' },
    { title: 'Touch', image: 'touch.jpg', page: 'touch' }
  ];

  return {
    all: function() {
      return sensors;
    },
    getSensor: function(page) {
      for(var i=0; i<sensors.length; i++) {
        if (sensors[i].page === page) {
          return sensors[i];
        }
      }
    }
  };
});
