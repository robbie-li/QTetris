Qt.include("Constants.js");
Qt.include("Block.js");

var boardCellComponent = Qt.createComponent("BoardCell.qml");

var boardCells = [];

function cellIndex(col, row) {
  return col + Constants.MAX_COLUMN_DEFAULT * row;
}

function blockIndex(col, row) {
  return col +  4 * row;
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

function deleteFullRow(row) {
  for(var col = 0; col < Constants.MAX_COLUMN_DEFAULT; ++col) {
    boardCells[cellIndex(col, row)].taken = false;
    boardCells[cellIndex(col, row)].opacity = 0.0;
  }
}

function moveRowDown(row, move_down) {
  for(var col = 0; col < Constants.MAX_COLUMN_DEFAULT; ++col) {
    if(boardCells[cellIndex(col, row)].taken) {
      console.log("move down block: (" + col + "," + row + "), down:" + move_down);
      boardCells[cellIndex(col, row)].taken = false;
      boardCells[cellIndex(col, row)].opacity = 0.0;

      boardCells[cellIndex(col, row+move_down)].taken = true;
      boardCells[cellIndex(col, row+move_down)].opacity = 0.8;
      boardCells[cellIndex(col, row+move_down)].color = boardCells[cellIndex(col, row)].color;
    }
  }  
}

function processRows(full_rows, not_full_rows) {
  for(var index =0; index < full_rows.length; ++index) {
    var row = full_rows[index];
    deleteFullRow(row);
  }

  if(full_rows.length) {
    for(var index1 =0; index1 < not_full_rows.length; ++index1) {
      var not_full_row = not_full_rows[index1];
      console.log("processing not full row:" + not_full_row);
      var move_down = 0;
      for(var index2 =0; index2< full_rows.length; ++index2) {
        var full_row = full_rows[index2];
        if(full_row > not_full_row) {
          ++move_down;
        }
      }
      if(move_down) {
        moveRowDown(not_full_row, move_down);
      }
    }
  }

  console.log("process rows finished.");
}

function checkRowFull() {
  var score = 0;
  var score_increase = 1;
  var full_rows = [];
  var not_full_rows = [];
  for(var row = Constants.MAX_ROW_DEFAULT - 1; row >= 0; --row) {
    var taken = 0;
    for(var col = 0; col < Constants.MAX_COLUMN_DEFAULT; ++col) {
      if(boardCells[cellIndex(col, row)].taken) {
        ++taken;
      }
    }
    
    if( taken == Constants.MAX_COLUMN_DEFAULT ) {
      score += score_increase;
      score_increase *= 2;
      full_rows.push(row);
    } else if (taken >0) {
      not_full_rows.push(row);
    }
  }

  console.log("rows: [" + full_rows + "] is full, got score: "+ score);
  console.log("rows: [" + not_full_rows + "] has block but not full");
  processRows(full_rows, not_full_rows);
  return score;
}

function parkBlock(block) {
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

  checkRowFull();
}

function canGoDown() {
  return checkCollision(Block.currentBlock) != COLLISION.DOWN_COLLISION;
}

function isGameOver() {
  return false;
}

function handleTimeout() {
  if (Block.currentBlock == null) {
    Block.createRandomBlock();
  } else {
    if (canGoDown()) {
      //Block.GoDown();
    } else {
      parkBlock(Block.currentBlock);
      if(isGameOver()) {
      } else {
        Block.createRandomBlock();  
      }      
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
    if (canGoDown()) {
      Block.GoDown();
    }
  }
}

function handleKeyLeft() {
  Block.GoLeft();
}

function handleKeyRight() {
  Block.GoRight();
}
