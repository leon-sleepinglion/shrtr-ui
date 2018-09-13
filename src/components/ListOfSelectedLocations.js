import React, { Component } from 'react'
import { Layout, List, Icon } from 'antd'

class ListOfSelectedLocations extends Component {


  render() {
    const { listOfSelectedLocations, onSelect, removeLocation } = this.props

    return (
      <Layout style={ {
        height: '80vh',
        overflowY: 'scroll'
      } }>
        <List itemLayout='horizontal'
              dataSource={ listOfSelectedLocations }
              renderItem={ item => (
                <List.Item
                  style={
                    {
                      padding: '12px',
                      borderBottom: '1px solid red'
                    }
                  }
                  actions={ [
                    <Icon type="ellipsis" theme="outlined" onClick={ () => onSelect(item) }/>,
                    <Icon type="close" onClick={ () => removeLocation(item) }/>
                  ] }>
                  <List.Item.Meta
                    title={ item ? item.name : '' }
                    description={ item ? item.location.address.text.replace(/<br\s*\/?>/mg, ', ') : '' }
                  />
                </List.Item>
              ) }
        />
      </Layout>
    )
  }
}

export default ListOfSelectedLocations