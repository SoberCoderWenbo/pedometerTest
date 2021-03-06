function addDistanceToLocal(distance){
    console.log('adding to storage:'+ distance);
    localStorage.setItem(window.localDistanceKey, distance);    
}

function addDistanceToLocalOfflineBuffer(distance){
    console.log('adding to storage offline buffer:'+ distance);
    localStorage.setItem(window.localDistanceKeyOfflineBuffer, distance);    
}

function getDistanceFromLocalOfflineBuffer(){
    var distance = localStorage.getItem(window.localDistanceKeyOfflineBuffer);
    return distance ? JSON.parse(distance): 0;
}

function getDistanceFromLocal(){
    var distance = localStorage.getItem(window.localDistanceKey);
    return distance ? JSON.parse(distance): 0;
}

function isTracking(){
    var tracking = localStorage.getItem('isCurrentlyTracking');
    return tracking ? JSON.parse(tracking) : false;
}

function setTrackingValue(isTracking){
    localStorage.setItem('isCurrentlyTracking', isTracking);    
}

window.storageService = {
    addDistanceToLocal: addDistanceToLocal,
    getDistanceFromLocal: getDistanceFromLocal,
    addDistanceToLocalOfflineBuffer:addDistanceToLocalOfflineBuffer,
    getDistanceFromLocalOfflineBuffer:getDistanceFromLocalOfflineBuffer,
    setTrackingValue: setTrackingValue,
    isTracking: isTracking
};