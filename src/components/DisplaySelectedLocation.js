import React, { Component } from 'react'
import { Card, Collapse, Icon, Layout, Button, message } from 'antd'
import CollapseInformation from "./CollapseInformation"

const { Panel } = Collapse
const { Meta } = Card

class DisplaySelectedLocation extends Component {

  render() {
    const { selectedLocation, addLocation, distance, time } = this.props
    const noLocationSelected = () => {
      message.info(`No location has been selected`)
    }
    let actions

    if (addLocation)
      actions = Object.keys(selectedLocation).length !== 0 ? [<Button onClick={ () => addLocation(selectedLocation) } block><Icon type="plus"/></Button>] : [<Button  onClick={ noLocationSelected } block><Icon type="plus"/></Button>]
    else
      actions = null

    const title = Object.keys(selectedLocation).length !== 0 ? selectedLocation.name : ''
    const address = Object.keys(selectedLocation).length !== 0 ? selectedLocation.location.address.text.replace(/<br\s*\/?>/mg, ', ') : ''

    return (
      <Layout.Content style={ this.props.style ? this.props.style : { } }>
        <Card
          style={ { width: '100%' } }
          // cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
        >
          <Meta
            title={ title }
            description={
              <div
                dangerouslySetInnerHTML={
                  { __html: address }
                }
              />
            }
          />
        </Card>
        <div>{actions}</div>
        { distance ?
          <Card title='Details'>
            <p>Total distance: {distance}</p>
            <p>Time: {time}</p>
          </Card> : null }
      </Layout.Content>
    )
  }

}

export default DisplaySelectedLocation;