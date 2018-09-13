import React, { Component } from 'react'
import { Modal, Input, Row, Col, Icon, List, Button, message } from 'antd'

class TripDescriptionModal extends Component {

  state = {
    modalLoading: false,
    tripName: '',
    tripDescription: ''
  }

  modalOnOk = (e) => {
    const { tripName, tripDescription } = this.state
    this.setState({ modalLoading: true })
    this.props.modalOnOk({ tripName, tripDescription }, () => this.setState({ modalLoading: false }))
  }

  tripNameInputOnChange = (e) => {
    this.setState({ tripName: e.target.value })
  }

  emitEmpty = () => {
    this.tripNameInput.focus();
    this.setState({ tripName: '' });
  }

  tripDescriptionOnChange = (e) => {
    this.setState({ tripDescription: e.target.value })
  }

  render() {
    const {
      modalVisible,
      modalOnCancel,
      listOfSelectedLocations,
      displayPlan,
      tripCache
    } = this.props

    const {
      modalLoading,
      tripName,
      tripDescription
    } = this.state

    const suffix = tripName ? <Icon type="close-circle" onClick={ this.emitEmpty }/> : null;
    if (displayPlan || !tripCache){
      return (
        <Modal
          visible={ modalVisible }
          title="Save Trip"
          onOk={ this.modalOnOk }
          onCancel={ modalOnCancel }
          footer={ [
            <Button key="back" onClick={ modalOnCancel }>
              Cancel
            </Button>,
            <Button key="submit" type="primary" loading={ modalLoading } onClick={ this.modalOnOk }>
              Save
            </Button>
          ] }
        >
          <Input
            placeholder="Enter your trip name"
            prefix={ <Icon type="user" style={ { color: 'rgba(0,0,0,.25)' } }/> }
            suffix={ suffix }
            value={ tripName }
            onChange={ this.tripNameInputOnChange }
            ref={ node => this.tripNameInput = node }
          />
          <Row style={ { marginTop: '12px' } }>
            <Col span={ 24 }>
              <Input.TextArea placeholder='Trip description'
                              value={ tripDescription }
                              onChange={ this.tripDescriptionOnChange }
                              autosize/>
            </Col>
          </Row>
          <Row style={ { marginTop: '12px' } }>
            <Col span={ 24 }>
              <List itemLayout='horizontal'
                    dataSource={ listOfSelectedLocations }
                    renderItem={ item => (
                      <List.Item
                        style={
                          {
                            padding: '12px',
                            borderBottom: '1px solid red'
                          }
                        }>
                        <List.Item.Meta
                          title={ item ? item.name : '' }
                          description={ item ? item.location.address.text.replace(/<br\s*\/?>/mg, ', ') : '' }
                        />
                      </List.Item>
                    ) }
              />
            </Col>
          </Row>
        </Modal>
      )
    } else {
      return (
        <Modal
          visible={ modalVisible }
          title={ <span className="ant-modal-title">{ tripCache.trip_name + ' ' }
                        <span style={ { fontSize: 12 } }>by { tripCache.trip_creator }</span>
                      </span> }
          onCancel={ modalOnCancel }
          footer={ null }
        >
          <Row style={ { marginTop: '12px' } }>
            <Col span={ 24 }>
              <p>Total Distance: { tripCache.route.distance }</p>
              <p>Total Time: { tripCache.route.time }</p>
              <p>{ tripCache.trip_description }</p>
            </Col>
          </Row>
          <Row style={ { marginTop: '12px' } }>
            <Col span={ 24 }>
              <List itemLayout='horizontal'
                    dataSource={ listOfSelectedLocations }
                    renderItem={ item => (
                      <List.Item
                        style={
                          {
                            padding: '12px',
                            borderBottom: '1px solid red'
                          }
                        }>
                        <List.Item.Meta
                          title={ item ? item.name : '' }
                          description={ item ? item.location.address.text.replace(/<br\s*\/?>/mg, ', ') : '' }
                        />
                      </List.Item>
                    ) }
              />
            </Col>
          </Row>
        </Modal>
      )
    }
  }
}

export default TripDescriptionModal