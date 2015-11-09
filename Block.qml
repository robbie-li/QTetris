import QtQuick 2.5
import QtQuick.Controls 1.3
import "Block.js" as P
import "Constants.js" as Constants

Item {
  id: block
  property variant color
  property int index
  property variant states
  property string currentState: states[index]
  property string nextState: states[(index+1)%4]
  property string name: 'block'

  width:  Constants.BLOCK_SIZE_DEFAULT * 4
  height: Constants.BLOCK_SIZE_DEFAULT * 4

  Component.onCompleted: {
    console.log("created:" + name + ', index:' + index + ', state:' + currentState);
    P.layoutCells(this, currentState)
  }

  Component.onDestruction: {
    console.log("destroy:"+name);
  }

  onIndexChanged: {
    currentState = states[index];
    P.layoutCells(this, currentState)
  }

  /* any visualable element cannot before this four cell*/
  Cell {
    color: block.color
  }
  Cell {
    color: block.color
  }
  Cell {
    color: block.color
  }
  Cell {
    color: block.color
  }
  /* any visualable element cannot before this four cell*/

  MouseArea {
    anchors.fill: parent
    onClicked: {
      index = (index + 1) % 4
    }
  }
}
