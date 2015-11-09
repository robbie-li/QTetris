import QtQuick 2.5
import QtQuick.Controls 1.3
import "Constants.js" as Constants

Rectangle {
  id: board_cell

  property bool spawned: false
  property bool taken: false

  // used internally
  property double tmp_y: 0
  property bool modified_y: false

  width: Constants.BLOCK_SIZE_DEFAULT
  height: Constants.BLOCK_SIZE_DEFAULT
  border.color: Qt.darker(color, 1.10);
  opacity: 0.8
  radius: 5

  Rectangle {
    width: parent.width - 2 * 5
    height: parent.height - 2 * 5
    anchors.centerIn: parent
    color: parent.color
    radius: 0
  }

  Behavior on y {
    enabled: spawned
    SequentialAnimation {
      PauseAnimation { duration: 500 }
      SpringAnimation{ spring: 3; damping: 0.5 }
    }
  }

  states: [
    State {
      name: "completed"
      PropertyChanges { target: board_cell; blockColor: "red" }
      PropertyChanges { target: board_cell; opacity: 0 }
    }
  ]

  transitions: [
    Transition {
      from: "*"
      to: "completed"
      SequentialAnimation {
        ColorAnimation { to: "red"; duration: 150 }
        ColorAnimation { to: "white"; duration: 100 }
        ColorAnimation { to: "red"; duration: 100 }
        NumberAnimation { property: "opacity"; duration: 150 }
      }
    }
  ]
}
