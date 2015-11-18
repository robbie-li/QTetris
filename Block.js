var componentBlock = null;
var currentBlock = null;

var componentI = Qt.createComponent("BlockI.qml");
var componentJ = Qt.createComponent("BlockJ.qml");
var componentL = Qt.createComponent("BlockL.qml");
var componentO = Qt.createComponent("BlockO.qml");
var componentS = Qt.createComponent("BlockS.qml");
var componentT = Qt.createComponent("BlockT.qml");
var componentZ = Qt.createComponent("BlockZ.qml");

var blockComponets = {
  "BlockI.qml": componentI,
  "BlockJ.qml": componentJ,
  "BlockL.qml": componentL,
  "BlockO.qml": componentO,
  "BlockS.qml": componentS,
  "BlockT.qml": componentT,
  "BlockZ.qml": componentZ,
};

var blockComponet;

var randomBlocks = [
  "BlockI.qml", "BlockI.qml", "BlockI.qml", "BlockI.qml", "BlockI.qml",
  "BlockJ.qml", "BlockJ.qml", "BlockJ.qml", "BlockJ.qml", "BlockJ.qml",
  "BlockL.qml", "BlockL.qml", "BlockL.qml", "BlockL.qml", "BlockL.qml",
  "BlockO.qml", "BlockO.qml", "BlockO.qml", "BlockO.qml", "BlockO.qml",
  "BlockS.qml", "BlockS.qml", "BlockS.qml", "BlockS.qml", "BlockS.qml",
  "BlockT.qml", "BlockT.qml", "BlockT.qml", "BlockT.qml", "BlockT.qml",
  "BlockZ.qml", "BlockZ.qml", "BlockZ.qml", "BlockZ.qml", "BlockZ.qml",
];

var blocks = [];
var blockStateIndex = 0;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function createRandomBlock() {
  if (currentBlock) {
    currentBlock.destroy();
    currentBlock = null;
  }

  if (blocks.length == 0) {
    blocks = randomBlocks;
  }

  var block = blocks.splice(getRandomInt(0, blocks.length - 1), 1)[0];
  blockStateIndex = getRandomInt(0, 4);
  blockComponet = blockComponets[block];
  if (blockComponet.status == Component.Ready)
    finishBlockCreation();
  else
    blockComponet.statusChanged.connect(finishBlockCreation);
}

function finishBlockCreation() {
  if (blockComponet.status == Component.Ready) {
    currentBlock = blockComponet.createObject(play_ground, {
      "x": play_ground.width / 2 - Constants.BLOCK_SIZE_DEFAULT * 2,
      "y": 0,
      "index": blockStateIndex
    });
    if (currentBlock == null) {
      // Error Handling
      console.log("Error creating object");
    }
  } else if (blockComponet.status == Component.Error) {
    // Error Handling
    console.log("Error loading component:", blockComponet.errorString());
  }
}

function layoutCells(block, state) {
  var child = 0;
  for (var i = 0; i < 16; ++i) {
    if (state[i] == '1') {
      var pos_X = i % 4;
      var pos_Y = Math.floor(i / 4);
      //console.log("idx:" + i + ", x:" + pos_X + ", y:" + pos_Y);
      block.children[child].x = pos_X * Constants.BLOCK_SIZE_DEFAULT;
      block.children[child].y = pos_Y * Constants.BLOCK_SIZE_DEFAULT;
      ++child;
    }
  }
}

function GoDown() {
  if (currentBlock) {
    currentBlock.y += Constants.BLOCK_SIZE_DEFAULT;
  }
}

function GoLeft() {
  if (currentBlock) {
    currentBlock.x -= Constants.BLOCK_SIZE_DEFAULT;
  }
}

function GoRight() {
  if (currentBlock) {
    currentBlock.x += Constants.BLOCK_SIZE_DEFAULT;
  }
}

function Rotate(h, v) {
  if (currentBlock) {
    currentBlock.index = (currentBlock.index + 1) % 4;
    currentBlock.x += Constants.BLOCK_SIZE_DEFAULT * h;
    currentBlock.y += Constants.BLOCK_SIZE_DEFAULT * v;
  }
}
