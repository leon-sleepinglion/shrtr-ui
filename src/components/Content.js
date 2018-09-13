import React, { Component } from "react";
import Map from './Map.js';

class Conten extends Component {


  render() {
    const { mapWidth, mapHeight } = this.props

    return (
      <Map mapWidth={ mapWidth }
           mapHeight={ mapHeight }/>
    )
  }
}

export default Conten;