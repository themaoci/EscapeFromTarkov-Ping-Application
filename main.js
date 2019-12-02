const isReachable = require('is-reachable');

var loopCounter = 0;
var maxLoops = 10;
var initialTime = 0;
var endingTime = 0;
var MIN = [999,999,999,999];
var MAX = [0,0,0,0];
var AVR = [0,0,0,0];
function sleep(second){
    return new Promise(resolve=>{
        setTimeout(resolve, second*1000);
    })
}
async function checkService(serviceHost){
        try{
            let initialTime = new Date();
            await isReachable(serviceHost+":443");
            let endingTime = new Date() - initialTime;
            return endingTime;
        } catch(e){
            console.log(e);
            return 9999;
        }
}
function clasifyRespTime(time){
	if(time > 300){
		return "\x1b[31m[BAD]\x1b[0m";
	} else if( time > 250 && time <= 300 ){
		return "\x1b[33m[LOW_BAD]\x1b[0m";
	} else if( time > 200 && time <= 250 ){
		return "\x1b[36m[USABLE]\x1b[0m";
	} else if( time > 120 && time <= 200){
		return "\x1b[32m[OK]\x1b[0m";
	} else if( time > 80 && time <= 120){
		return "\x1b[33m[BEST]\x1b[0m";
	} else {
		return "\x1b[35m[EPIC]\x1b[0m";
	}
}
function JustTimeColor(time){
	if(time > 300){
		return "\x1b[31m"+time+"\x1b[0m";
	} else if( time > 250 && time <= 300 ){
		return "\x1b[33m"+time+"\x1b[0m";
	} else if( time > 200 && time <= 250 ){
		return "\x1b[36m"+time+"\x1b[0m";
	} else if( time > 120 && time <= 200){
		return "\x1b[32m"+time+"\x1b[0m";
	} else if( time > 80 && time <= 120){
		return "\x1b[33m"+time+"\x1b[0m";
	} else {
		return "\x1b[35m"+time+"\x1b[0m";
	}
}
const services = [
	"prod.escapefromtarkov.com",
	"ragfair.escapefromtarkov.com",
	"trading.escapefromtarkov.com",
	"google.com"
];

(async () => {
	
	let tempTime = [999,999,999,999];
	while (	true ){
		tempTime = await Promise.all([checkService(services[0]), checkService(services[1]), checkService(services[2]), checkService(services[3])]);
		for(let i = 0; i < 4; i++)
		{	
			if(MIN[i] > tempTime[i])
				MIN[i] = tempTime[i];
			
			if(MAX[i] < tempTime[i])
				MAX[i] = tempTime[i];
			
			AVR[i] = ( (AVR[i] == 0) ? tempTime[i] : (AVR[i] + tempTime[i]) / 2 );
		}
		console.log("prod["+tempTime[0]+"ms] | ragfair["+tempTime[1]+"ms] | trading["+tempTime[2]+"ms] | google.com["+tempTime[3]+"ms]");
		loopCounter++;
		if(maxLoops <= loopCounter)
			break;
	}
	
	console.log("\nTest Finished! Comparing results...\n");
	for(let i = 0; i < 4; i++)
	{
		console.log("Server " + services[i] + " - " + clasifyRespTime(Math.round(AVR[i])) + "\nMinimum:" + JustTimeColor(MIN[i]) + " Averange:" + JustTimeColor(Math.round(AVR[i])) + " Maximum:" + JustTimeColor(MAX[i]));
	}
	console.log("\nexiting...");

})();
