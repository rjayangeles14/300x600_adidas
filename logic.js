
/**
 * Window onload handler.
 */

var mainContainer;
var exitHandler;
var videoContainer;
var vid;
var vidPlayBtn;
var vidPauseBtn;
var vidStopBtn;
var vidReplayBtn;
var vidUnmuteBtn;
var vidMuteBtn;

function preInit() {
  setupDom();

  if (Enabler.isInitialized()) {
    init();
  } else {
    Enabler.addEventListener(
      studio.events.StudioEvent.INIT,
      init
    );
  }
}

/**
 * Initializes the ad components
 */
function setupDom() {
  mainContainer = document.getElementById('main-container');
  exitHandler = document.getElementById('exit');
  video0 = {};
  vidContainer = document.getElementById('video-container-0');
  vid          = document.getElementById('video-0');
  vidPlayBtn   = document.getElementById('playBtn');
  vidPauseBtn  = document.getElementById('pauseBtn');
  vidStopBtn   = document.getElementById('stopBtn');
  vidReplayBtn = document.getElementById('replayBtn');
  vidUnmuteBtn = document.getElementById('unmuteBtn');
  vidMuteBtn   = document.getElementById('muteBtn');
  //vidProgressBar   = document.getElementById('progress-bar-0');
}

/**
 * Ad initialisation.
 */
function init() {
  // You can update the autoplay flag to 'true' to enable muted
  // autoplay although it won't work on iOS.
  autoplay0 = true;
  isClick0 = false;
  hasCanPlay = true;
  transition();

  // Hide mute / unmute on iOS.
  if ((navigator.userAgent.match(/iPhone/i)) ||
    (navigator.userAgent.match(/iPad/i)) ||
    (navigator.userAgent.match(/iPod/i))) {
    vidUnmuteBtn.style.opacity = 0;
    vidMuteBtn.style.opacity = 0;
  }

  addVideoTracking0();

  addListeners();

  // Polite loading
  if (Enabler.isVisible()) {
    show();
  }
  else {
    Enabler.addEventListener(studio.events.StudioEvent.VISIBLE, show);
  }
}

/**
 * Adds appropriate listeners at initialization time
 */
function addListeners() {
  exitHandler.addEventListener('click', exitClickHandler);
  vidPlayBtn.addEventListener('click', pausePlayHandler0, false);
  vidPauseBtn.addEventListener('click', pausePlayHandler0, false);
  vidMuteBtn.addEventListener('click', muteUnmuteHandler0, false);
  vidUnmuteBtn.addEventListener('click', muteUnmuteHandler0, false);
  vidReplayBtn.addEventListener('click', replayHandler0, false);
	vidStopBtn.addEventListener('click', stopHandler0, false);
  vid.addEventListener('ended', videoEndHandler0, false);
  vid.addEventListener('timeupdate', videoTimeUpdateHandler0, false);
}

/**
 *  Shows the ad.
 */
function show() {
  exitHandler.style.display = "block";
  vidMuteBtn.style.visibility    = 'hidden';
  vidUnmuteBtn.style.visibility  = 'visible';
  vidPauseBtn.style.visibility   = 'visible';
  vidPlayBtn.style.visibility    = 'hidden';
  if (autoplay0) {
    if (vid.readyState >= 2) {
      startMuted0(null);
    }
    else {
      hasCanPlay = true;
      vid.addEventListener('canplay', startMuted0, false);
    }
    // HACK: Safari experiences video rendering issues, fixed by forcing a viewport refresh
    vidMuteBtn.style.visibility = 'visible';
      setTimeout(function() {
        vidMuteBtn.style.visibility = 'hidden';
      }, 200);

  }
  else {
	 vid.volume = 0.0;
    vidMuteBtn.style.visibility    = 'hidden';
    vidUnmuteBtn.style.visibility  = 'visible';
    vidPauseBtn.style.visibility   = 'hidden';
    vidPlayBtn.style.visibility    = 'visible';
  }
  vidContainer.style.visibility  = 'visible';

}

// ---------------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------------

function exitClickHandler() {
  // Reset video
  vid.pause();
  vidPauseBtn.style.visibility   = 'hidden';
  vidPlayBtn.style.visibility    = 'visible';
  if (vid.readyState > 0) {
    vid.currentTime = 0;
  }
  Enabler.exit('BackgroundExit');
}
/**
 * Triggered once the video player is ready to play the video on expansion.
 */
function startMuted0(e) {
  // Leaving the listener can cause issues on Chrome / Firefox
  if (hasCanPlay) {
    vid.removeEventListener('canplay', startMuted0);
    hasCanPlay = false;
  }
  // If paused then play
  vid.volume       = 0.0; // Muted by default
  vid.currentTime  = 0;
  vid.play();
  vidPauseBtn.style.visibility = 'visible';
  vidPlayBtn.style.visibility  = 'hidden';
}

/**
 * Play pause toggle.
 */
function pausePlayHandler0(e) {
  // Under IE10, a video is not 'paused' after it ends.
  if (vid.paused || vid.ended) {
    if (isClick0) {
      vid.volume = 1.0;
      vidMuteBtn.style.visibility    = 'visible';
      vidUnmuteBtn.style.visibility  = 'hidden';
      creative.isClick0 = false;
    }
    // If paused then play
    vid.play();
    vidPauseBtn.style.visibility = 'visible';
    vidPlayBtn.style.visibility  = 'hidden';
  }
  else {
    vid.pause();
    vidPauseBtn.style.visibility = 'hidden';
    vidPlayBtn.style.visibility  = 'visible';
  }
}

/**
 * Mutes or unmute the video player.
 */
function muteUnmuteHandler0(e) {
  if (vid.volume == 0.0) {
    Enabler.counter("Unmute video 0", true);
    vid.volume = 1.0;
    vidMuteBtn.style.visibility   = 'visible';
    vidUnmuteBtn.style.visibility = 'hidden';
  } else {
    Enabler.counter("Mute video 0", true);
    vid.volume = 0.0;
    vidMuteBtn.style.visibility   = 'hidden';
    vidUnmuteBtn.style.visibility = 'visible';
  }
}

/**
 * Stops the video.
 */
function stopHandler0(e) {
  Enabler.counter("Video 0 stopped", true);
  vid.currentTime = 0;
  vid.pause();
  vidPauseBtn.style.visibility = 'hidden';
  vidPlayBtn.style.visibility  = 'visible';
  creative.isClick0 = true;
}

/**
 * Relaunches the video from the beginning.
 */
function replayHandler0(e) {
  Enabler.counter("Replay video 0", true);
  vid.currentTime = 0;
  vid.play();
  vid.volume = 1.0;
  vidPlayBtn.style.visibility = 'hidden';
  vidPauseBtn.style.visibility = 'visible';
  vidUnmuteBtn.style.visibility = 'hidden';
  vidMuteBtn.style.visibility  = 'visible';
}

/**
 * Handler triggered when the video has finished playing.
 */
function videoEndHandler0(e) {
  vid.currentTime = 0;
  vid.pause();
  vidPauseBtn.style.visibility = 'hidden';
  vidPlayBtn.style.visibility  = 'visible';
  creative.isClick0 = true;
  vid.load();
}

/**
 * Handler triggered when the video has timeUpdates.
 */
function videoTimeUpdateHandler0(e) {
 var perc = vid.currentTime / vid.duration;
}

/**
 * Add video metrics to the HTML5 video elements by loading in video module, and assigning to videos.
 */
function addVideoTracking0() {
  // Add in the video files.
  // These are 3 different codecs due to different browser specifications ; we recommend you have all 3 filetypes.
  var srcNode = document.createElement('source');
  srcNode.setAttribute('type', 'video/webm');
  srcNode.setAttribute('src', Enabler.getUrl('video.webm'));
  vid.appendChild(srcNode);

  srcNode = document.createElement('source');
  srcNode.setAttribute('type', 'video/mp4');
  srcNode.setAttribute('src', Enabler.getUrl('video.mp4'));
  vid.appendChild(srcNode);

  vid.appendChild(srcNode);

  Enabler.loadModule(studio.module.ModuleId.VIDEO, function() {
    studio.video.Reporter.attach('Video Report 0', vid);
  }.bind(this));
}

function transition() {
        // BEGIN THE GREENSOCK ANIMATION
      var t1 = new TimelineMax();

      // ADD ANIMATION
      //t1.to('#background', 0.5, {css : {'display' : 'block', 'opacity' : '1'},  delay :1});
      t1.to('#cta', 0.25, {css : {'left' : '67'}, delay : 0});

      // PLAYERS ANIMATE OUT
      t1.to('#red-player', 0.5, {css : {'left' : '-980','display' : 'none', 'opacity' : '0'}, ease: Expo.easeIn, y: 0 , delay : 1});
      t1.to('#blue-player', 0.5, {css : {'left' : '-743','display' : 'none', 'opacity' : '0'}, ease: Expo.easeIn, y: 0 , delay : -0.45});
      t1.to('#yellow-player', 0.5, {css : {'left' : '-575', 'display' : 'none', 'opacity' : '0'}, ease: Expo.easeIn, y: 0 , delay : -0.45});
 // SLIDE IN WHITE LINES
      t1.to('#white_line', 0, {css : {rotation:15}, delay : -0.5});
      t1.to('#white_line', 0.6, {css : {'left' : '-550'}, ease: Power1.easeIn, delay : -0.5});


      // SLIDE BOOTS and LOGO IN
      t1.to('#green_boot, #blue_boot, #red_boot', 0, {css : {'display' : 'block', 'opacity' : '1'},  delay :0});
      t1.from('#green_boot', 0.5, {css : {'left' : '-300', rotation:-95}, ease: Power1.easeOut, delay : 0});
      t1.from('#blue_boot', 0.5, {css : {'left' : '-300', rotation:-95}, ease: Power1.easeOut, delay : -0.25});
      t1.from('#red_boot', 0.5, {css : {'left' : '-300', rotation:-95}, ease: Power1.easeOut, delay : -0.25});
      t1.to('#logo', 0.5, {css : {'left' : '180'}, ease: Power1.easeOut, delay : 0});

      //SCALE IN CTA

      t1.to('#redbox_final', 0.25, {css : {'left' : '20'}, delay : -0.25});

      // CALCULATES ANIMATION DURATION - UNCOMMENT TO SEE
      //var ctd = t1.totalDuration();
      //alert(ctd);

}

/**
 *  Main onload handler
 */
window.addEventListener('load', preInit);
