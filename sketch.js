// Your code will go here

// Open up your console - if everything loaded properly you should see the version number
// corresponding to the latest version of ml5 printed to the console and in the p5.js canvas.
console.log("ml5 version:", ml5.version);
let video;
let videoWidth = 640;
let videoHeight = 480;
let hand = {
  boundingBox: {
    topLeft: [0, 0],
    bottomRight: [1, 1],
  },
};
let hand_X;
let hand_Y;
let handWidth;
let handHeight;
let handpose;
let width;
let height;
let d1 = 0;
let theta = 0;
let kQ = 10000;
let formulaImage;
function preload() {
  formulaImage = loadImage('img/E_formula.png');
}
function whileTraining(loss) {
  if (loss == null) {
    console.log("Training Complete");
    predictor.predict(gotResults);
  } else {
    console.log(loss);
  }
}
function gotResults(error, result) {
  if (error) console.error("Error : ", error);
  else {
    val = result;
    predictor.predict(gotResults);
  }
}

function setup() {
  width = windowWidth;
  height = windowHeight;
  createCanvas(width, height);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  handpose = ml5.handpose(video, { flipHorizontal: true }, () => {
    console.log("handpose loaded");
  });
  handpose.on("hand", (results) => {
    hand = results[0] ? results[0] : hand;
    //console.log(`(x: ${hand_X},y: ${hand_Y})`);
    // console.log(`hand: ${hand}`);
  });

}

function draw() {
  background(0);
  translate(0.5 * width, 0.5 * height);

  angleMode(DEGREES);
  d1 = Math.round(
    Math.sqrt(
      (hand_X - 0.5 * videoWidth) * (hand_X - 0.5 * videoWidth) +
      (hand_Y - 0.5 * videoHeight) * (hand_Y - 0.5 * videoHeight)
    )
  );
  theta = Math.round(atan2(hand_Y - 0.5 * videoHeight, hand_X - 0.5 * videoWidth));
  //  stroke(255);
  //strokeWeight(5);
  strokeWeight(0);
  fill(255, 204, 0);
  textSize(22);
  textAlign(CENTER)
  text("An Elelctric Field Acting On A Positive Point Charge", 0, -0.45 * height);
  formulaImage.resize(0, 75)
  image(formulaImage, -0.25 * 150 * (755 / 301), -0.4 * height)

  push();
  strokeWeight(1);
  stroke("blue");
  fill("blue");
  ellipse(0, 0, 75);
  pop();
  push();
  strokeWeight(1);
  fill("white");
  textSize(22);
  textAlign(CENTER, CENTER);
  text("Q", 0, -45);
  text("-", 0, 0);
  pop();
  let v0 = createVector(0, 0);
  let v1 = createVector(hand_X - 0.5 * videoWidth, hand_Y - 0.5 * videoHeight);
  let v2 = createVector(
    (kQ / (d1 * d1)) * d1 * cos(theta + 180),
    (kQ / (d1 * d1)) * d1 * sin(theta + 180)
  );
  push();
  strokeWeight(1);
  stroke("red");
  fill("red");
  ellipse(hand_X - 0.5 * videoWidth, hand_Y - 0.5 * videoHeight, 25);
  pop();
  push();
  strokeWeight(1);
  fill("white");
  textSize(22);
  textAlign(CENTER, CENTER);
  text("+", hand_X - 0.5 * videoWidth, hand_Y - 0.5 * videoHeight);
  pop();


  drawArrow(v1, v2, "orange", "E");

  /* text(`r = ${d1},theta = ${theta}`, 0, 0, 150, 150);*/
  /*push();
  stroke("white");
  fill("white");
  strokeWeight(0);
  text(`(${hand_X},${hand_Y})`, 50, 50);
  pop();*/

  push();
  translate(-0.5 * width, -0.5 * height);
  if (hand) {
    hand_X = hand.boundingBox.topLeft[0];
    handWidth = hand.boundingBox.bottomRight[0] - hand.boundingBox.topLeft[0];
    hand_Y = hand.boundingBox.topLeft[1];
    handHeight = hand.boundingBox.bottomRight[1] - hand.boundingBox.topLeft[1];
    stroke(0, 255, 0);
    strokeWeight(4);
    noFill();
    /*ellipse(hand_X + 0.5 * handWidth, hand_Y + 0.5 * handHeight, 25);*/
    noStroke();
  }
  pop();
}

function drawArrow(base, vec, myColor, label) {
  push();
  stroke(myColor);
  strokeWeight(3);
  fill(myColor);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 7;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);

  strokeWeight(0);
  fill(myColor);
  textSize(22);
  textAlign(LEFT, BOTTOM);
  text(label, arrowSize, 0);
  pop();
}
