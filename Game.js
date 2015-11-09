var boardCellComponent = Qt.createComponent("BoardCell.qml");

var boardCells = [];

function cellIndex(x, y) {
  return x + Constants.MAX_COLUMN_DEFAULT * y;
}

function blockIndex(x, y) {
  return x + y * 4;
}

function pos_x(index) {
  return index % Constants.MAX_COLUMN_DEFAULT;
}

function pos_y(index) {
  return Math.floor(index / Constants.MAX_COLUMN_DEFAULT);
}

function resetBoards() {
  for (var i = 0; i < boardCells.length; ++i) {
    boardCells[i].destroy();
  }

  boardCells = [];
  for (var i = 0; i < Constants.MAX_COLUMN_DEFAULT * Constants.MAX_ROW_DEFAULT; ++i) {
    boardCells[i] = boardCellComponent.createObject(play_ground, {
      'x': Constants.BLOCK_SIZE_DEFAULT * pos_x(i),
      'y': Constants.BLOCK_SIZE_DEFAULT * pos_y(i),
      'opacity': 0.0,
      'taken': false
    });
  }
}

function packBlock(block) {
  console.log("state:" + block.currentState);

  var state = block.currentState;
  var blockX = block.x / Constants.BLOCK_SIZE_DEFAULT;
  var blockY = block.y / Constants.BLOCK_SIZE_DEFAULT;

  for (var y = 0; y < 4; ++y) {
    for (var x = 0; x < 4; ++x) {
      if (state[blockIndex(x, y)] == "1") {
        console.log("taken cell: cx:", blockX + x, ' ,cy:', blockY + y, ', x:', x, ', y:', y);
        boardCells[cellIndex(blockX + x, blockY + y)].opacity = 0.8
        boardCells[cellIndex(blockX + x, blockY + y)].color = block.color
        boardCells[cellIndex(blockX + x, blockY + y)].taken = true
      }
    }
  }
}

function handleTimeout() {
  if (Block.currentBlock == null) {
    Block.createRandomBlock();
  } else {
    if (checkCollision(Block.currentBlock) == COLLISION.DOWN_COLLISION) {
      packBlock(Block.currentBlock);
      Block.createRandomBlock();
    } else {
      //Block.GoDown();
    }
  }
}

function handleKeyUp() {
  Block.Rotate();
}

var COLLISION = {
  DOWN_COLLISION: 1,
  LEFT_COLLISION: 2,
  RIGHT_COLLISION: 3,
  UP_COLLISION: 4,
};

function isCellTaken(x, y) {
  return boardCells[cellIndex(x, y)].taken;
}

function blockReachesBottom(blockY, y) {
  return blockY + (y + 1) >= Constants.MAX_ROW_DEFAULT;
}

function checkCollision(block) {
  var state = block.currentState;
  var blockX = block.x / Constants.BLOCK_SIZE_DEFAULT;
  var blockY = block.y / Constants.BLOCK_SIZE_DEFAULT;

  for (var y = 3; y >= 0; --y) {
    for (var x = 0; x < 4; ++x) {
      if (state[blockIndex(x, y)] == "1") {
        if (blockReachesBottom(blockY, y)) {
          console.log('reach bottom, blockY:' + blockY + ', x:' + x + ', y:' + y);
          return COLLISION.DOWN_COLLISION;
        }

        if (isCellTaken(blockX + x, blockY + y + 1)) {
          console.log('lower block taken, blockY:' + blockY + ', x:' + x + ', y:' + y);
          return COLLISION.DOWN_COLLISION;
        }
      }
    }
  }
}

function handleKeyDown() {
  if (Block.currentBlock) {
    if (checkCollision(Block.currentBlock) != COLLISION.DOWN_COLLISION) {
      Block.GoDown();
    }
  }
}

function handleKeyLeft() {
  Block.GoLeft();
  /*
  if (Block.currentBlock) {
    if (Block.currentBlock.x > 0) {
      Block.currentBlock.x -= Constants.BLOCK_SIZE_DEFAULT;
    }
  }
  */
}

function handleKeyRight() {
  Block.GoRight();
  /*
  if (Block.currentBlock) {
    if (Block.currentBlock.x < play_ground.width - Constants.BLOCK_SIZE_DEFAULT) {
      Block.currentBlock.x += Constants.BLOCK_SIZE_DEFAULT;
    }
  }
  */
}
