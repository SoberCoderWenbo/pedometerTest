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
        var checkSyncInterval;
        
        var linkingData;
                        
        var ref = cordova.InAppBrowser.open(hostUrl, '_blank', inAppWindowConfigs);
        initNetworkService(ref);
        ref.addEventListener( "loadstop", function() {
            
            ref.executeScript({ code: "localStorage.setItem('isInApp', true)" });
            
            setDistanceInterval = setInterval(function() {
                var distance = storageService.getDistanceFromLocal();
                var distanceBuffer = storageService.getDistanceFromLocalOfflineBuffer();
                var total = parseInt(distance) + parseInt(distanceBuffer);
                var stepsCode = "localStorage.setItem('steps'," + total + ");";
                ref.executeScript({ code: stepsCode }, function(values){});
            }, intervalValue)
            
            checkSyncInterval = setInterval(function() {
                ref.executeScript({ code: "localStorage.getItem('sync');" }, function(values) {                
                    if(values && values[0] && values[0] == "true"){
                        var distance = storageService.getDistanceFromLocal();
                        var distanceBuffer = storageService.getDistanceFromLocalOfflineBuffer();
                        var total = parseInt(distance) + parseInt(distanceBuffer);
                        
                        if(total > 0){
                            invokeAddDistance(linkingData, total, ref);
                            var syncCode = "localStorage.setItem('sync','false');";
                            ref.executeScript({ code: syncCode }, function(values){});
                            storageService.addDistanceToLocal(0);
                            storageService.addDistanceToLocalOfflineBuffer(0);
                        }
                    }
                });
            }, intervalValue)
            
            getTokenInterval = setInterval(function() {
                ref.executeScript({ code: "localStorage.getItem('linkingData');" }, function(values) {
                    linkingData = JSON.parse(values[0]);
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
            clearInterval(checkSyncInterval); 
            //clearInterval(window.offlineAppInterval);
        });
    }

    