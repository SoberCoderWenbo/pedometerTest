function initPedometer(){
    var storageService = window.storageService;
    pedometer.startPedometerUpdates(successHandler, onError);
    console.log('started pedometer...');
    function successHandler(pedometerData){
       console.log("steps:"+pedometerData.numberOfSteps);
       var isOffline = window.checkNetworkConnection() === "none";
       if(isOffline === true){
           storageService.addDistanceToLocalOffline(pedometerData.numberOfSteps);               
       }else{
           storageService.addDistanceToLocal(pedometerData.numberOfSteps);    
       }
    }
    
    function onError(e){
        console.log('pedometer error...' + JSON.stringify(e));
    }
}

function stopPedometer(){
    pedometer.stopPedometerUpdates(function(){
        console.log("successfully to stopped pedometer");
    }, function(error){
        console.log("failed to stop pedometer");
    });    
}

window.pedometerService = {
    initPedometer: initPedometer,
    stopPedometer: stopPedometer
};

