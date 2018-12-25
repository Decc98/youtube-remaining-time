let videoPlayer = document.getElementsByClassName('video-stream html5-main-video')[0];
let remaining = document.getElementsByClassName('ytp-time-separator')[0];
let elapsedTime = document.getElementsByClassName('ytp-time-current')[0];
let theVidWasStopped = false;

// When the time updates, a 'customTime' property is added to the video player with, well, the custom time
videoPlayer.addEventListener('timeupdate', () => {
    let videoDuration = videoPlayer.duration;

    videoPlayer.customTime = ' / -' + getRemaining(videoDuration, videoPlayer.currentTime) + ' / ';
});

videoPlayer.addEventListener('loadeddata', () => {
    if(theVidWasStopped){
        observer.observe(elapsedTime, {attributes: true, childList: true, characterData: true});
    }
});

// Then, to avoid the delay, we show the custom time once the currentTime updates
let observer = new MutationObserver(() =>{
    remaining.innerText = videoPlayer.customTime;
});


function getRemaining(total, elapsedTime){
    let seconds = total - elapsedTime;
    return String(seconds).toHHMMSS();
}

function parseTimeToSeconds(_time){
    let p = _time.split(':'),
        s = 0, m = 1;

    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }

    return Number(s);
}

String.prototype.toHHMMSS = function () {
    let sec_num = parseInt(this, 10);
    let hours   = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds = sec_num - (hours * 3600) - (minutes * 60);

    if(hours > 0){
        if (minutes < 10) {minutes = `0${minutes}`;}
        if (seconds < 10) {seconds = `0${seconds}`;}
        return `${hours}:${minutes}:${seconds}`;
    }else if(minutes > 0){
        if (seconds < 10) {seconds = `0${seconds}`;}
        return `${minutes}:${seconds}`;
    }else{
        minutes = '00';
        if (seconds < 10) {seconds = `0${seconds}`;}
        return `${minutes}:${seconds}`;
    }
}

observer.observe(elapsedTime, {attributes: true, childList: true, characterData: true});

videoPlayer.addEventListener('ended', () => {
    observer.disconnect();
    theVidWasStopped = true;
});

videoPlayer.addEventListener('abort', () => {
    observer.disconnect();
    theVidWasStopped = true;
});

videoPlayer.addEventListener('error', () => {
    observer.disconnect();
    theVidWasStopped = true;
});