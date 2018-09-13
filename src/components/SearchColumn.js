import React, { Component } from 'react'
import { Button, Layout, Row, Col, Icon } from 'antd'
import AutoCompleteSearch from "./AutoCompleteSearch"
import DisplaySelectedLocation from "./DisplaySelectedLocation"
import ListOfSelectedLocations from "./ListOfSelectedLocations"

const { Sider } = Layout
const ButtonGroup = Button.Group

class SearchColumn extends Component {

  state = {
    planLoading: false
  }

  planButtonOnClick = (e) => {
    console.log('onClick', e)

    const { planOnClick } = this.props

    this.setState({ planLoading: true })

    planOnClick((response) => {
      this.setState({ planLoading: false })
    })
  }

  render() {
    const {
      appId,
      appCode,
      lat,
      long,
      addableLocation,
      addLocation,
      locationOnSelect,
      removeLocation,
      selectedLocation,
      listOfSelectedLocations,
      saveOnClick,
      clearOnClick
    } = this.props

    const {
      planLoading
    } = this.state

    const buttonStyle = {
      width: '33.333%'
    }
    return (
      <Layout style={ { height: '100%' } }>
        <AutoCompleteSearch appId={ appId }
                            appCode={ appCode }
                            lat={ lat }
                            long={ long }
                            selectedLocation={ selectedLocation }
                            onSelect={ locationOnSelect }/>
        <DisplaySelectedLocation addableLocation={ addableLocation }
                                 addLocation={ addLocation }
                                 selectedLocation={ selectedLocation }
                                 distance={ this.props.distance }
                                 time={ this.props.time }/>
        <ListOfSelectedLocations onSelect={ locationOnSelect }
                                 removeLocation={ removeLocation }
                                 listOfSelectedLocations={ listOfSelectedLocations }/>
      
        <ButtonGroup>
          <Button type='primary' onClick={ saveOnClick } size="large" style={buttonStyle}>
            <Icon type="save"/>
              Save
          </Button>
          <Button type='primary' onClick={ clearOnClick } size="large"style={buttonStyle}>
            <Icon type="reload"/>
              Clear
          </Button>
          <Button type='primary' loading={ planLoading } onClick={ this.planButtonOnClick } size="large"style={buttonStyle}>
            <Icon type="caret-right"/>
              Plan
          </Button>
        </ButtonGroup>
      
      </Layout>
    )
  }

}

export default SearchColumn