const video = document.getElementById("video");
const square = document.getElementById("square");

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
]).then(startVideo);

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    (stream) => (video.srcObject = stream),
    (err) => console.error(err)
  );
}

video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
    // console.log(detections[0].expressions.happy);

    const Tracker = await detections[0].expressions;
    if (Tracker.happy >= 0.4) {
      square.style.backgroundColor = "#73E220";
      square.style.borderRadius = "100%";
    }
    if (Tracker.angry >= 0.4) {
      square.style.backgroundColor = "red";

      square.style.borderRadius = "50px";
    }
    if (Tracker.neutral >= 0.4) {
      square.style.backgroundColor = "black";

      square.style.borderRadius = "50px";
    }
    if (Tracker.sad >= 0.4) {
      square.style.backgroundColor = "blue";

      square.style.borderRadius = "50px";
    }
    if (Tracker.surprised >= 0.4) {
      square.style.backgroundColor = "purple";

      square.style.borderRadius = "100%";
    }
  }, 100);
});
