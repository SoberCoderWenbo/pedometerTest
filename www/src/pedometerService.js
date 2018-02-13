function initPedometer(){
    var storageService = window.storageService;
    pedometer.startPedometerUpdates(successHandler, onError);
    console.log('started pedometer...');
    function successHandler(pedometerData){
        console.log("steps:"+pedometerData.numberOfSteps);
        storageService.addDistanceToLocal(pedometerData.numberOfSteps);    
    }
    
    function onError(e){
        console.log('pedometer error...' + JSON.stringify(e));
    }
}

function stopPedometer(){
    pedometer.stopPedometerUpdates(function(){
        console.log("successfully to stopped pedometer");
        var currentLocalSteps = storageService.getDistanceFromLocal();
        var currentLocalBuffer = storageService.getDistanceFromLocalOfflineBuffer();
        var newCurrentBuffer = parseInt(currentLocalSteps) + parseInt(currentLocalBuffer);
        storageService.addDistanceToLocalOfflineBuffer(newCurrentBuffer);
        console.log('new local buffer:' + newCurrentBuffer);
        storageService.addDistanceToLocal(0);
    }, function(error){
        console.log("failed to stop pedometer");
    });    
}

window.pedometerService = {
    initPedometer: initPedometer,
    stopPedometer: stopPedometer
};

