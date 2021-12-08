(() => {
  'use strict';
  const TWILIO_DOMAIN = location.host; //unique to user, will be website to visit for video app
  const ROOM_NAME = room;
  const Video = Twilio.Video;
  let videoRoom, localStream;
  const video = document.getElementById("video");
 
  // preview screen
  navigator.mediaDevices.getUserMedia({video: true, audio: true})
  .then(vid => {
      video.srcObject = vid;
      localStream = vid;
  })

  console.log(room);
      
  // buttons
  const joinRoomButton = document.getElementById("button-join");
  const leaveRoomButton = document.getElementById("button-leave");
  var site = `https://${TWILIO_DOMAIN}/video-token?room=${room}`;
  console.log(`site ${site}`);
  joinRoomButton.onclick = () => {
    // get access token
    axios.get(`https://${TWILIO_DOMAIN}/video-token`).then(async (body) => {
      const token = body.data.token;
      console.log(token);
      //connect to room
      Video.connect(token, { name: ROOM_NAME }).then((room) => {
        console.log(`Connected to Room ${room.name}`);
        videoRoom = room;

        room.participants.forEach(participantConnected);
        room.on("participantConnected", participantConnected);

        room.on("participantDisconnected", participantDisconnected);
        room.once("disconnected", (error) =>
          room.participants.forEach(participantDisconnected)
        );
        joinRoomButton.disabled = true;
        leaveRoomButton.disabled = false;
      });
    });
  };
  // leave room
  leaveRoomButton.onclick = () => {
    videoRoom.disconnect();
    console.log(`Disconnected from Room ${videoRoom.name}`);
    joinRoomButton.disabled = false;
    leaveRoomButton.disabled = true;
  };
})();

// connect participant
const participantConnected = (participant) => {
  console.log(`Participant ${participant.identity} connected'`);

  const div = document.createElement('div'); //create div for new participant
  div.id = participant.sid;

  participant.on('trackSubscribed', track => trackSubscribed(div, track));
  participant.on('trackUnsubscribed', trackUnsubscribed);

  participant.tracks.forEach(publication => {
    if (publication.isSubscribed) {
      trackSubscribed(div, publication.track);
    }
  });
  document.body.appendChild(div);
}

const participantDisconnected = (participant) => {
  console.log(`Participant ${participant.identity} disconnected.`);
  document.getElementById(participant.sid).remove();
}

const trackSubscribed = (div, track) => {
  div.appendChild(track.attach());
}

const trackUnsubscribed = (track) => {
  track.detach().forEach(element => element.remove());
}

(function() {
  "use strict";

  var video, $output;
  var scale = 0.25;

  var initialize = function() {
      $output = $("#output");
      video = $("#video").get(0);
      $("#capture").click(captureImage);                
  };

  var captureImage = function() {
      var canvas = document.createElement("canvas");
      canvas.width = video.videoWidth * scale;
      canvas.height = video.videoHeight * scale;
      canvas.getContext('2d')
            .drawImage(video, 0, 0, canvas.width, canvas.height);

      var img = document.createElement("img");
      img.src = canvas.toDataURL();

      console.log(canvas.toDataURL());

      $output.prepend(img);
  };

  $(initialize);            

}());

function clearCaptures(){
  $( "#output" ).empty();
}