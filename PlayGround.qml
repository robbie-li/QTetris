import QtQuick 2.5
import QtQuick.Controls 1.3
import "Block.js" as Block
import "Game.js" as Game
import "Constants.js" as Constants

Rectangle {
  id: play_ground
  width:  Constants.BLOCK_SIZE_DEFAULT * Constants.MAX_COLUMN_DEFAULT
  height: Constants.BLOCK_SIZE_DEFAULT * Constants.MAX_ROW_DEFAULT
  color: "#3c3c3c"
  focus: true

  Column {
    id: background
    Repeater {
      model: Constants.MAX_ROW_DEFAULT

      Row {
        id: rep_row
        property variant currentx: index

        Repeater {
          model: Constants.MAX_COLUMN_DEFAULT
          Rectangle {
            property variant bgcolors: ["#1c1c1c", "#2f2f2f"]
            width:  Constants.BLOCK_SIZE_DEFAULT
            height: Constants.BLOCK_SIZE_DEFAULT
            color: bgcolors[index % 2]
            opacity: 0.5
            Text {
              anchors.centerIn: parent
              text: '{'+ index +',' + rep_row.currentx +'}'
            }
          }
        }
      }
    }
  }

  Timer {
    interval: 500; running: true; repeat: true
    onTriggered: {
      Game.handleTimeout();
    }
  }

  /*
  Ruler {
    anchors.left: play_ground.left
    anchors.bottom: play_ground.bottom
  }
  */

  Keys.onUpPressed: {
    Game.handleKeyUp();
  }

  Keys.onDownPressed: {
    Game.handleKeyDown();
  }

  Keys.onLeftPressed: {
    Game.handleKeyLeft();
  }

  Keys.onRightPressed: {
    Game.handleKeyRight();
  }

  Component.onCompleted: {
    Game.resetBoards();
  }
}
