window.notifyWebRefreshAwsSession = function(webRef){    
    var currentTime = new Date().getTime();
    var code = "localStorage.setItem('needRefreshSession'," + currentTime + ")";
    webRef.executeScript({ code: code }, function(values){});
}

function getStepsFromErrorStorage(){
    var errorSteps = localStorage.getItem('errorSteps');
    return errorSteps ? parseInt(errorSteps) : 0;
}

window.getStepsFromErrorStorage = getStepsFromErrorStorage;

function setErrorStepsToStorage(steps){
    localStorage.setItem('errorSteps', steps);
}

window.setErrorStepsToStorage = setErrorStepsToStorage;

function invokeAddDistance(linkingData, distance, webRef){
    window.setUserCredential(linkingData);
    var meters = distance / 3;
    var metersToSend = meters.toFixed(0);
    console.log("coverted to meters:" + metersToSend);
	var data = JSON.stringify({action: window.serverActions.addDistance, distanceInMeters: metersToSend });        
	new AWS.Lambda().invoke({ FunctionName: window.userFunctionName,
		Payload: data
	}).promise().then(function(data){
        console.log('Successfully invoked AddDistance' + JSON.stringify(data));
        var code = "localStorage.setItem('latestStepLog'," + metersToSend + ")";
        webRef.executeScript({ code: code }, function(values){});
	}).catch(function (error) {
		console.log(JSON.stringify(error));
        setErrorStepsToStorage(metersToSend);
        window.notifyWebRefreshAwsSession(webRef);
	});
}

function invokeAddErrorDistance(linkingData, distance, webRef){
    window.setUserCredential(linkingData);
    console.log("sending previous error distance to:" + distance);
    var data = JSON.stringify({action: window.serverActions.addDistance, distanceInMeters: distance });        
	new AWS.Lambda().invoke({ FunctionName: window.userFunctionName,
		Payload: data
	}).promise().then(function(data){
        console.log('Successfully invoked for previous error distance' + JSON.stringify(data));
        var code = "localStorage.setItem('latestStepLog'," + distance + ")";
        webRef.executeScript({ code: code }, function(values){});
	}).catch(function (error) {
		console.log(JSON.stringify(error));
        setErrorStepsToStorage(distance);
        window.notifyWebRefreshAwsSession(webRef);
	});
}

window.invokeAddErrorDistance = invokeAddErrorDistance;
window.invokeAddDistance = invokeAddDistance;

window.setUserCredential = function(linkingData){
    AWS.config.update({region: window.awsRegion});
    var logins = {};
    logins[window.Logins] = linkingData.token;    
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: window.IdentityPoolId,
        Logins: logins
    });
}