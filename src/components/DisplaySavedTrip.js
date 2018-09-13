import React, { Component } from 'react'
import { List, Layout, Icon } from 'antd'
import DisplaySelectedLocation from './DisplaySelectedLocation'

const shortedString = (s) => {
  if (s.length < 40)
    return s
  else
    return `${s.slice(0, 40)}...`
}

class DisplaySavedTrip extends Component {
  render() {
    const { listOfSavedTrip, tripOnSelect, tripOnClick, selectedLocation } = this.props

    return (
      <Layout style={ this.props.style }>
        <DisplaySelectedLocation style={ { height: '100%' } } selectedLocation={ selectedLocation }/>
        <List itemLayout='horizontal'
              dataSource={ listOfSavedTrip }
              renderItem={ item => (
                <List.Item
                  style={
                    {
                      padding: '12px',
                      borderBottom: '1px solid red'
                    }
                  }
                  actions={ [
                    <Icon type="ellipsis" theme="outlined" onClick={ () => tripOnClick(item) }/>
                  ] }>

                  <List.Item.Meta
                    title={ item ?
                      <span style={ { fontSize: 14 } }>{ item.trip_name + ' ' }
                        <span style={ { fontSize: 12 } }>by { item.trip_creator }, { item.route.distance }, { item.route.time }</span>
                      </span> : '' }
                    description={ item ? shortedString(item.trip_description) : '' }
                    onClick={ () => tripOnSelect(item) }
                  />
                </List.Item>
              ) }
        />
      </Layout>
    )
  }
}

export default DisplaySavedTrip