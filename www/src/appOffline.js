document.addEventListener('init', function(event) {
    var page = event.target;
    var pedometerService = window.pedometerService;
    var storageService = window.storageService;
    
    if (page.matches('#offline-app')) {
        var currentSteps = storageService.getDistanceFromLocal();
        console.log('current steps from offline app:' + currentSteps)
        var isTracking = storageService.isTracking();
        console.log('is tracking from offline app:' + isTracking);
        var stepDisplay = $(page).find('#offline-steps');
        stepDisplay.html(currentSteps);
        
        var startBtn = $(page).find('#start-btn');
        var stopBtn = $(page).find('#stop-btn');    
        
        window.offlineStartBtn = startBtn;
        window.offlineStopBtn = stopBtn;
        
        startBtn.click(function(){
            pedometerService.initPedometer();
            storageService.setTrackingValue(true);
            startBtn.hide();
            stopBtn.show();
        });
        
        stopBtn.click(function(){
           pedometerService.stopPedometer(); 
           var unsavedOnlineSteps = storageService.getDistanceFromLocal();
           var unsavedOfflineSteps = storageService.getDistanceFromLocalOffline();
           var offlineBuffer = storageService.getDistanceFromLocalOfflineBuffer();
           
           var currentTotal = parseInt(unsavedOnlineSteps) + parseInt(unsavedOfflineSteps) + parseInt(offlineBuffer);
           storageService.addDistanceToLocalOfflineBuffer(currentTotal);
           storageService.addDistanceToLocal(0);
           storageService.addDistanceToLocalOffline(0);
           storageService.setTrackingValue(false);
           
           startBtn.show();
           stopBtn.hide();
        });
        
        if(isTracking === true){
            startBtn.hide();    
            stopBtn.show();
        }else{
            stopBtn.hide();    
            startBtn.show();
        }
    
        window.offlineAppInterval = setInterval(function(){
            var latestStepsonline = storageService.getDistanceFromLocal();
            var latestStepsOffline = storageService.getDistanceFromLocalOffline();
            var latestOfflineBuffer = storageService.getDistanceFromLocalOfflineBuffer();
            var total = parseInt(latestStepsonline) + parseInt(latestStepsOffline) + parseInt(latestOfflineBuffer);
            console.log('offline app interval: (online:' + latestStepsonline + ') (offline:' + latestStepsOffline + ') (buffer:' + latestOfflineBuffer + ')' );
            stepDisplay.html(total);
        }, 1000);        
    }
});