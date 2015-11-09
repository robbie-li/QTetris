import QtQuick 2.5
import QtQuick.Controls 1.3
import "Constants.js" as Constants

Item {
  width: Constants.MAX_COLUMN_DEFAULT * Constants.BLOCK_SIZE_DEFAULT
  height: Constants.MAX_ROW_DEFAULT * Constants.BLOCK_SIZE_DEFAULT

  Row {
    anchors.bottom: parent.bottom
    Repeater {
      model: Constants.MAX_COLUMN_DEFAULT
      Item {
        width: Constants.BLOCK_SIZE_DEFAULT
        height: 5
        Rectangle {
          height: 5
          width: 1
          color: "black"
          anchors.bottom: parent.bottom
          anchors.left: parent.left
        }
        Rectangle {
          height: 1
          width: Constants.BLOCK_SIZE_DEFAULT
          color: "black"
          anchors.bottom: parent.bottom
          anchors.left: parent.left
        }
        Text {
          text: index
          anchors.bottom: parent.bottom
          anchors.left: parent.left
          anchors.horizontalCenter: parent.horizontalCenter
          horizontalAlignment: Text.AlignHCenter
        }
      }
    }
  }

  Column {
    anchors.top: parent.top
    anchors.left: parent.left
    Repeater {
      model: Constants.MAX_ROW_DEFAULT
      Item {
        width: 5
        height: Constants.BLOCK_SIZE_DEFAULT
        Rectangle {
          height: 1
          width: 5
          color: "black"
          anchors.top: parent.top
          anchors.left: parent.left
        }
        Rectangle {
          height: Constants.BLOCK_SIZE_DEFAULT
          width: 1
          color: "black"
          anchors.top: parent.top
          anchors.left: parent.left
        }
        Text {
          text: index
          anchors.left: parent.left
          anchors.verticalCenter: parent.verticalCenter
          verticalAlignment: Text.AlignVCenter
        }
      }
    }
  }
}
