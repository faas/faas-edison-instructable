angular.module('starter.controllers', [])

.controller('StartupCtrl', function($scope, $location, $ionicSlideBoxDelegate) {

  $scope.slideIndex = 0;

  $scope.startApp = function() {
    if (Faas.getUsername() && Faas.getUsername() !== "") {
      $location.path('/tab/dash');
    } else {
      $location.path('login');
    }
  };

  var done = window.localStorage.getItem('skip_intro');
  console.log(done);
  if (done) {
    $scope.startApp();
  }

  $scope.skip = function() {
    window.localStorage.setItem('skip_intro', true);
    $scope.startApp();
  }

  $scope.close = function() {
    $scope.startApp();
  }

  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };

  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };

  $scope.navSlide = function(index) {
    $ionicSlideBoxDelegate.slide(index);
  };

  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };
})

.controller('LoginCtrl', function($scope, $location, $ionicLoading) {

  $scope.login = {
    email:'your email',
    password:'your password'
  }

  $scope.executeLogin = function(data)
  {
    $ionicLoading.show();

    // Faas Login
    Faas.bouncer.login(
      Faas.getApiKey(),
      $scope.login.email,
      $scope.login.password,
      1, function(err, data) {

      $ionicLoading.hide();

      if (!err) {
        $location.path('/tab/dash');
      } else {
        console.log('error', err);
      }
    });
  };

  $scope.loginValid = function()
  {
    if($scope.login.email != undefined &&
       $scope.login.email != '' &&
       $scope.login.password != undefined &&
       $scope.login.password != '' )
    {
      return true;
    }

    return false;
  };

})

.controller('DashCtrl', function(Sensors, $scope, $interval) {

  // List all the sensors
  $scope.sensors = Sensors.all();

})

.controller('SensorsCtrl', function(Sensors, $rootScope, $scope, $stateParams, $interval, $ionicNavBarDelegate, $ionicModal) {

  // ensure the back button displays on this page
  $ionicNavBarDelegate.showBackButton(true);

  // Grab the sensor name from url parameter
  $scope.sensorName = $stateParams.sensorName;

  // Grab the sensor information from Sensors service
  $scope.sensor = Sensors.getSensor($stateParams.sensorName);

  // Timer interval instance
  $scope.intervalTimer = null;

  // Handle errors
  $scope.maxErrorsCount = 3;
  $scope.errorsCount = 0;

  // Service status
  $scope.noService = false;
  $scope.currentCallback = null;

  // Load service err modal
  $ionicModal.fromTemplateUrl('templates/service-err-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.serviceErrorModal = modal;
  });

  $scope.showServiceError = function() {
    $scope.noService = true;
    $scope.serviceErrorModal.show();
  };

  $scope.closeServiceError = function() {
    $scope.serviceErrorModal.hide();
  };

  $scope.retry = function() {
    $scope.errorsCount = 0;
    $scope.closeServiceError();
    $scope.currentCallback && $scope.currentCallback();
  };

  // Connection modal
  $ionicModal.fromTemplateUrl('templates/connection-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.connectionModal = modal;
  });

  $scope.showConnectionModal = function() {
    $scope.connectionModal.show();
  };

  $scope.closeConnectionModal = function() {
    $scope.connectionModal.hide();
  };

  // Code modal
  $ionicModal.fromTemplateUrl('templates/code-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.codeModal = modal;
  });

  $scope.showCodeModal = function() {
    $scope.codeModal.show();
  };

  $scope.closeCodeModal = function() {
    $scope.codeModal.hide();
  };

  // Cancel the timer when navigate back to the list
  $scope.$on('$destroy', function(){
    if ($scope.intervalTimer) {
      $interval.cancel($scope.intervalTimer);
    }

    // remove the modal
    $scope.serviceErrorModal.remove();
    $scope.currentCallback = null;
  });

  $scope.resetTimer = function() {
    $scope.errorsCount += 1;
    if ($scope.errorsCount >= $scope.maxErrorsCount) {
      if ($scope.intervalTimer) {
        $interval.cancel($scope.intervalTimer);
        $scope.errorsCount = 0;
        $scope.showServiceError();
      }
    }
  }

  $scope.redLEDonCallback = function() {
    $scope.currentCallback = $scope.redLEDonCallback;

    Faas.ix.edison.redLEDon &&
    Faas.ix.edison.redLEDon(function(err, data) {
      if (err) $scope.showServiceError();
    });
  };

  $scope.redLEDoffCallback = function() {
    $scope.currentCallback = $scope.redLEDoffCallback;

    Faas.ix.edison.redLEDoff &&
    Faas.ix.edison.redLEDoff(function(err, data) {
      if (err) $scope.showServiceError();
    });
  };

  $scope.greenLEDonCallback = function() {
    $scope.currentCallback = $scope.greenLEDonCallback;

    Faas.ix.edison.greenLEDon &&
    Faas.ix.edison.greenLEDon(function(err, data) {
      if (err) $scope.showServiceError();
    });
  };

  $scope.greenLEDoffCallback = function() {
    $scope.currentCallback = $scope.greenLEDoffCallback;

    Faas.ix.edison.greenLEDoff &&
    Faas.ix.edison.greenLEDoff(function(err, data) {
      if (err) $scope.showServiceError();
    });
  };

  $scope.blueLEDonCallback = function() {
    $scope.currentCallback = $scope.blueLEDonCallback;

    Faas.ix.edison.blueLEDon &&
    Faas.ix.edison.blueLEDon(function(err, data) {
      if (err) $scope.showServiceError();
    });
  };

  $scope.blueLEDoffCallback = function() {
    $scope.currentCallback = $scope.blueLEDoffCallback;

    Faas.ix.edison.blueLEDoff &&
    Faas.ix.edison.blueLEDoff(function(err, data) {
      if (err) $scope.showServiceError();
    });
  };

  $scope.lightStatus = function() {
    Faas.ix.edison.lightStatus &&
    Faas.ix.edison.lightStatus(function(err, data) {
      if (err) $scope.resetTimer();
      $rootScope.light.lux = data.lux + ' lux';
    });
  };

  $scope.lightStatusCallback = function() {
    $scope.currentCallback = $scope.lightStatusCallback;

    $scope.intervalTimer = $interval($scope.lightStatus, 1000);
  };

  $scope.axelStatus = function() {
    Faas.ix.edison.axelStatus &&
    Faas.ix.edison.axelStatus(function(err, data) {
      if (err) $scope.resetTimer();
      $rootScope.axel.X = data.x;
      $rootScope.axel.Y = data.y;
      $rootScope.axel.Z = data.z;
    });
  };

  $scope.axelStatusCallback = function() {
    $scope.currentCallback = $scope.axelStatusCallback;

    $scope.intervalTimer = $interval($scope.axelStatus, 1000);
  };

  $scope.rotaryStatus = function() {
    Faas.ix.edison.rotaryStatus &&
    Faas.ix.edison.rotaryStatus(function(err, data) {
      if (err) $scope.resetTimer();
      $rootScope.rotary.V = data.v;
      $rootScope.rotary.D = data.d;
      $rootScope.rotary.R = data.r;
    });
  };

  $scope.rotaryStatusCallback = function() {
    $scope.currentCallback = $scope.rotaryStatusCallback;

    $scope.intervalTimer = $interval($scope.rotaryStatus, 1000);
  };

  $scope.temperatureStatus = function() {
    Faas.ix.edison.temperatureStatus &&
    Faas.ix.edison.temperatureStatus(function(err, data) {
      if (err) $scope.resetTimer();
      $rootScope.temperature.C = data.c + ' °C';
      $rootScope.temperature.F = data.f + ' °F';
    });
  };

  $scope.temperatureStatusCallback = function() {
    $scope.currentCallback = $scope.temperatureStatusCallback;

    $scope.intervalTimer = $interval($scope.temperatureStatus, 1000);
  };

  $scope.buttonStatus = function() {
    Faas.ix.edison.buttonStatus &&
    Faas.ix.edison.buttonStatus(function(err, data) {
      if (err) $scope.resetTimer();
      if (data.b === 0) {
        $scope.buttonPress = 'OFF';
        $scope.buttonPressClass = 'light';
      } else {
        $scope.buttonPress = 'ON';
        $scope.buttonPressClass = 'balanced';
      }
    });
  };

  $scope.buttonStatusCallback = function() {
    $scope.currentCallback = $scope.buttonStatusCallback;

    $scope.intervalTimer = $interval($scope.buttonStatus, 500);
  };

  $scope.touchStatus = function() {
    Faas.ix.edison.touchStatus &&
    Faas.ix.edison.touchStatus(function(err, data) {
      if (err) $scope.resetTimer();
      if (data.t) {
        $scope.touchPress = 'ON';
        $scope.touchPressClass = 'balanced';
      } else {
        $scope.touchPress = 'OFF';
        $scope.touchPressClass = 'light';
      }
    });
  };

  $scope.touchStatusCallback = function() {
    $scope.currentCallback = $scope.touchStatusCallback;

    $scope.intervalTimer = $interval($scope.touchStatus, 500);
  }

  // Perform the current sensor actions
  switch ($scope.sensorName) {
    case 'led':
      {
        $scope.noService = !Faas.ix.edison || !Faas.ix.edison.redLEDon;

        $rootScope.led = $rootScope.led || {};
        $rootScope.led.red = $rootScope.led.red || false;
        $rootScope.led.green = $rootScope.led.green || false;
        $rootScope.led.blue = $rootScope.led.blue || false;

        $scope.toggleRed = function() {
          if ($rootScope.led.red) {
            $scope.redLEDonCallback();
          } else {
            $scope.redLEDoffCallback();
          }
        };

        $scope.toggleGreen = function() {
          if ($rootScope.led.green) {
            $scope.greenLEDonCallback();
          } else {
            $scope.greenLEDoffCallback();
          }
        };

        $scope.toggleBlue = function() {
          if ($rootScope.led.blue) {
            $scope.blueLEDonCallback();
          } else {
            $scope.blueLEDoffCallback();
          }
        };
      }
      break;
    case 'light':
      {
        $scope.noService = !Faas.ix.edison || !Faas.ix.edison.lightStatus;

        // Light sensor
        $rootScope.light = $rootScope.light || {};
        $rootScope.light.lux = $rootScope.light.lux || '0 lux';

        $scope.lightStatusCallback();
      }
      break;
    case 'accelerometer':
      {
        $scope.noService = !Faas.ix.edison || !Faas.ix.edison.axelStatus;

        // 3-Axis Digital Accelerometer
        $rootScope.axel = $rootScope.axel || {};
        $rootScope.axel.X = $rootScope.axel.X || '0';
        $rootScope.axel.Y = $rootScope.axel.Y || '0';
        $rootScope.axel.Z = $rootScope.axel.Z || '0';

        $scope.axelStatusCallback();
      }
      break;
    case 'rotary':
      {
        $scope.noService = !Faas.ix.edison || !Faas.ix.edison.rotaryStatus;

        // Rotary sensor
        $rootScope.rotary = $rootScope.rotary || {};
        $rootScope.rotary.V = $rootScope.rotary.V || '0';
        $rootScope.rotary.D = $rootScope.rotary.D || '0';
        $rootScope.rotary.R = $rootScope.rotary.R || '0';

        $scope.rotaryStatusCallback();
      }
      break;
    case 'temperature':
      {
        $scope.noService = !Faas.ix.edison || !Faas.ix.edison.temperatureStatus;

        // Temperature sensor
        $rootScope.temperature = $rootScope.temperature || {};
        $rootScope.temperature.C = $rootScope.temperature.C || '0 °C';
        $rootScope.temperature.F = $rootScope.temperature.F || '0 °F';

        $scope.temperatureStatusCallback();
      }
      break;
    case 'button':
      {
        $scope.noService = !Faas.ix.edison || !Faas.ix.edison.buttonStatus;

        // Button press status
        $scope.buttonPress = 'OFF';
        $scope.buttonPressClass = 'light';

        $scope.buttonStatusCallback();
      }
      break;
    case 'touch':
      {
        $scope.noService = !Faas.ix.edison || !Faas.ix.edison.touchStatus;

        // Touch status
        $scope.touchPress = 'OFF';
        $scope.touchPressClass = 'light';

        $scope.touchStatusCallback();
      }
      break;
  }

})

.controller('AccountCtrl', function($scope) {

  // User account info
  $scope.user = {};
  $scope.user.username = "";
  $scope.user.tenant_name = "";
  $scope.user.org_name = "";

  // Load the cookie object
  var cookieStr = Faas.getJSCookie();
  var cookieObj = Faas.extractFaasCookieObj(cookieStr);

  // Retrieve the account info using api_key
  var faas_api_key = cookieObj.api_key;
  Faas.bouncer.getLoginScreenInfo(faas_api_key, function(err, data) {
    $scope.user.username = cookieObj.username;
    $scope.user.tenant_name = data.tenant_name;
    $scope.user.org_name = data.org_name;
    $scope.$apply();
  });

  // var options = {
  //   user_id: Faas.getUserId()
  // };
  // Faas.users.get(options, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });
})

.controller('AboutCtrl', function($scope) {
  // About this App && Faas
});
