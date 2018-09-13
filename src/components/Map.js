import React, { Component } from "react";

class Map extends Component {

  render() {
    const { mapWidth, mapHeight } = this.props

    return (
      <div style={ { width: '100%' } }>
        <div id="heremap" style={
          {
            width: mapWidth,
            height: mapHeight,
            margin: '0 auto'
          }
        }>
          { this.props.children }
        </div>
      </div>
    )
  }
}

export default Map;


