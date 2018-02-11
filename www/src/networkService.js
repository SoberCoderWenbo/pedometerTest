

window.initNetworkService = function(ref){
    document.addEventListener("offline", function() {
            console.log('offline now');
            ref.hide();
            var isTracking = window.storageService.isTracking();
            if(isTracking === true){
                window.offlineStartBtn.hide();
                window.offlineStopBtn.show();    
            }else{
                window.offlineStartBtn.show();
                window.offlineStopBtn.hide();    
            }
    }, false);
    
    document.addEventListener("online", function() {
            console.log('online again');
            ref.show();
    }, false);
}

window.checkNetworkConnection = function() {
    var networkState = navigator.connection.type;
    console.log('Connection type: ' + networkState);
    return networkState;
}

