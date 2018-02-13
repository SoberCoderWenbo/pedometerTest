document.addEventListener('init', function(event) {
    var page = event.target;
    var pedometerService = window.pedometerService;
    var storageService = window.storageService;
    
    if (page.matches('#offline-app')) {
        var isTracking = storageService.isTracking();
        var stepDisplay = $(page).find('#offline-steps');        
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
            var latestOfflineBuffer = storageService.getDistanceFromLocalOfflineBuffer();
            var total = parseInt(latestStepsonline) + parseInt(latestOfflineBuffer);
            console.log('offline app interval: (online:' + latestStepsonline + ')(buffer:' + latestOfflineBuffer + ')' );
            stepDisplay.html(total);
        }, 1000);        
    }
});