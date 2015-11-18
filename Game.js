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
      //console.log("move down block: (" + col + "," + row + "), down:" + move_down);
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
      //console.log("processing not full row:" + not_full_row);
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

  //console.log("process rows finished.");
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
        //console.log("taken cell: cx:", blockX + x, ' ,cy:', blockY + y, ', x:', x, ', y:', y);
        boardCells[cellIndex(blockX + x, blockY + y)].opacity = 0.8
        boardCells[cellIndex(blockX + x, blockY + y)].color = block.color
        boardCells[cellIndex(blockX + x, blockY + y)].taken = true
      }
    }
  }

  checkRowFull();
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

function isCellTaken(x, y) {
  if( (x >= 0 && x < Constants.MAX_COLUMN_DEFAULT) && (y>=0 && y < Constants.MAX_ROW_DEFAULT)) {
    return boardCells[cellIndex(x, y)].taken;  
  }

  return true;
}

function blockReachesTop(blockX, x) {
  return blockX + x <= 0;
}

function blockReachesBottom(blockY, y) {
  return blockY + (y + 1) >= Constants.MAX_ROW_DEFAULT;
}

function blockReachesLeft(blockX, x) {
  return blockX + x <= 0;
}

function blockReachesRight(blockX, x) {
  return blockX + (x + 1) >= Constants.MAX_COLUMN_DEFAULT;
}

function checkCollisionUp(state, blockX, blockY) {
  for (var y = 3; y >= 0; --y) {
    for (var x = 0; x < 4; ++x) {
      if (state[blockIndex(x, y)] == "1") {
        if (blockReachesTop(blockY, y)) {
          console.log('reach top, blockY:' + blockY + ', x:' + x + ', y:' + y);
          return true;
        }

        if (isCellTaken(blockX + x, blockY + y - 1)) {
          console.log('upper block taken, blockY:' + blockY + ', x:' + x + ', y:' + y);
          return true;
        }
      }
    }
  }

  return false;
}

function blockReachesEdges(blockX, blockY, x, y) {
  if( blockX + x < 0 || blockX + x >= Constants.MAX_COLUMN_DEFAULT ) {
    //console.log('reach h edge, blockX:' + blockX + ', x:' + x);
    return true;
  }

  if( blockY + y < 0 || blockY + y >= Constants.MAX_ROW_DEFAULT ) {
    //console.log('reach v edge, blockY:' + blockY + ', y:' + y);
    return true;
  }

  return false;
}

function checkCollision(state, blockX, blockY) {
  for (var y = 0; y < 4; ++y) {
    for (var x = 0; x < 4; ++x) {
      if (state[blockIndex(x, y)] == "1") {
        if (blockReachesEdges(blockX, blockY, x, y)) {
          return true;
        }

        if (isCellTaken(blockX + x, blockY + y)) {
          //console.log('cell is taken, bX:'+ blockX +', bY:' + blockY + ', x:' + x + ', y:' + y);
          return true;
        }
      }
    }
  }

  return false;
}

function canGoDown() {
  var block = Block.currentBlock;
  var blockX = block.x / Constants.BLOCK_SIZE_DEFAULT;
  var blockY = block.y / Constants.BLOCK_SIZE_DEFAULT;
  return !checkCollision(block.currentState, blockX, blockY+1);
}

function canGoLeft() {
  var block = Block.currentBlock;
  var blockX = block.x / Constants.BLOCK_SIZE_DEFAULT;
  var blockY = block.y / Constants.BLOCK_SIZE_DEFAULT;
  return !checkCollision(block.currentState, blockX-1, blockY);
}

function canGoRight() {
  var block = Block.currentBlock;
  var blockX = block.x / Constants.BLOCK_SIZE_DEFAULT;
  var blockY = block.y / Constants.BLOCK_SIZE_DEFAULT;
  return !checkCollision(block.currentState, blockX+1, blockY);
}

function canRotate() {
  var block = Block.currentBlock;
  var state = block.nextState;

  if( state == block.currentState ) {
    return { fit: true, h: 0, v: 0 };
  }
  
  var blockX = block.x / Constants.BLOCK_SIZE_DEFAULT;
  var blockY = block.y / Constants.BLOCK_SIZE_DEFAULT;

  if(!checkCollision(state, blockX, blockY)) {
    //console.log('no collision for rotate');
    return { fit: true, h: 0, v: 0 };
  } else {
    for( var moveX = 0; moveX < 4; ++moveX ) {
      for( var moveY = 0; moveY < 4; ++moveY ) {
        if( !checkCollision(state, blockX + moveX, blockY + moveY)) {
          //console.log('found fit, moveX:' + moveX + ', moveY:'+moveY);
          return {fit: true, h: moveX, v: moveY};
        }
        if( !checkCollision(state, blockX - moveX, blockY + moveY)) {
          //console.log('found fit, moveX:' + (-moveX) + ', moveY:'+moveY);
          return {fit: true, h: -moveX, v: moveY};
        }
        if( !checkCollision(state, blockX + moveX, blockY - moveY)) {
          //console.log('found fit, moveX:' + moveX + ', moveY:'+(-moveY));
          return {fit: true, h: moveX, v: -moveY};
        }
        if( !checkCollision(state, blockX - moveX, blockY - moveY)) {
          //console.log('found fit, moveX:' + (-moveX) + ', moveY:'+ (-moveY));
          return {fit: true, h: -moveX, v: -moveY};
        }
      }
    }
  }

  return {fit: false, h: 0, v: 0};
}

function handleKeyUp() {
  if (Block.currentBlock) {
    var result = canRotate();
    if( result.fit ) {
      Block.Rotate(result.h, result.v);
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
  if (Block.currentBlock) {
    if (canGoLeft()) {
      Block.GoLeft();
    }
  }
}

function handleKeyRight() {
   if (Block.currentBlock) {
    if (canGoRight()) {
      Block.GoRight();
    }
  }
}
