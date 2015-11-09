import QtQuick 2.5
import QtQuick.Controls 1.3
import "Constants.js" as Constants

Rectangle {
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
}
