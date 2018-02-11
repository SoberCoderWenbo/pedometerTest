document.addEventListener("deviceready", onDeviceReady, false);    
    function onDeviceReady() {                
                
        var hostUrl = window.hostUrl;
        var inAppWindowConfigs = window.inAppWindowConfigs;
        var storageService = window.storageService;
        var pedometerService = window.pedometerService;
        var invokeAddDistance = window.invokeAddDistance;
        var setUserCredentials = window.setUserCredential;
        var getStepsFromErrorStorage = window.getStepsFromErrorStorage;
        var setErrorStepsToStorage = window.setErrorStepsToStorage;
        var invokeAddErrorDistance = window.invokeAddErrorDistance;
        var checkNetworkConnection = window.checkNetworkConnection;
        var initNetworkService = window.initNetworkService;
        
        //init value and service
        storageService.setTrackingValue(false);
        checkNetworkConnection();
        
        var intervalValue = 1000;        
        var getTokenInterval;
        var setDistanceInterval;
                        
        var ref = cordova.InAppBrowser.open(hostUrl, '_blank', inAppWindowConfigs);
        initNetworkService(ref);
        ref.addEventListener( "loadstop", function() {
            
            ref.executeScript({ code: "localStorage.setItem('isInApp', true)" });
            
            setDistanceInterval = setInterval(function() {
                var distance = storageService.getDistanceFromLocal();
                var distanceValue = distance || 0;
                var latestStepsOffline = storageService.getDistanceFromLocalOffline();
                var latestOfflineBuffer = storageService.getDistanceFromLocalOfflineBuffer();
                var stepsCode = "localStorage.setItem('steps'," + distanceValue + ");";
                var offlineStepsCode = "localStorage.setItem('offlineSteps'," + distanceValue + ");";
                var offlineBufferStepsCode = "localStorage.setItem('offlineBufferSteps'," + distanceValue + ");";
                var code = stepsCode + offlineStepsCode + offlineBufferStepsCode;
                ref.executeScript({ code: code }, function(values){});
            }, intervalValue)
            
            getTokenInterval = setInterval(function() {
                ref.executeScript({ code: "localStorage.getItem('linkingData')" }, function(values) {
                    
                    if(values && values[0]){
                        var errorSteps = getStepsFromErrorStorage();
                        if(parseInt(errorSteps) > 0){
                            setErrorStepsToStorage(0);
                            invokeAddErrorDistance(JSON.parse(values[0]), parseInt(errorSteps), ref);
                        }
                    }
                        
                    if(values && values[0] && JSON.parse(values[0]).tracking === false){
                        var currentDistance = storageService.getDistanceFromLocal();                    
                        if(currentDistance > 0){
                                        
                            var latestStepsOffline = storageService.getDistanceFromLocalOffline();
                            var latestOfflineBuffer = storageService.getDistanceFromLocalOfflineBuffer();
                            var total = parseInt(currentDistance) + parseInt(latestStepsOffline) + parseInt(latestOfflineBuffer);
                            
                            invokeAddDistance(JSON.parse(values[0]), total, ref);
                            storageService.addDistanceToLocal(0);
                            storageService.addDistanceToLocalOfflineBuffer(0);
                            storageService.addDistanceToLocalOffline(0);
                            
                            pedometerService.stopPedometer();
                            storageService.setTrackingValue(false);   
                        }
                    } else {
                        var isTracking = storageService.isTracking();
                        if(values && values[0] && JSON.parse(values[0]).tracking === true && isTracking !== true){
                            pedometerService.initPedometer();
                            storageService.setTrackingValue(true);
                        }
                    }
                });
            }, intervalValue)
        });

        ref.addEventListener('exit', function() {
            clearInterval(setDistanceInterval);
            clearInterval(getTokenInterval);      
        });
    }

    