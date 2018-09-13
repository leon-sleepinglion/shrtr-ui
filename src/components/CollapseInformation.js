import React, { Component } from 'react'
import { Collapse } from 'antd'

const { Panel } = Collapse

class CollapseInformation extends Component {

  state = {
    panelOpen: false,
    header: 'See more'
  }

  onChange = () => {
    const header = !this.state.panelOpen ? 'Close' : 'See more'

    this.setState({ panelOpen: !this.state.panelOpen, header })
  }

  render() {
    return (
      <Collapse onChange={ this.onChange } style={ { overflowY: 'scroll' } }>
        <Panel header={ this.state.header }>
          { this.props.children }
        </Panel>
      </Collapse>
    )
  }

}

export default CollapseInformation;