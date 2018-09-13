import React, { Component } from 'react'
import './App.css'
import { Col, Icon, Layout, message, Modal, notification, Row, Spin } from 'antd'
import Sidebar from "./components/Sidebar.js";
import Heder from "./components/Header.js";
import SearchColumn from "./components/SearchColumn"
import axios from 'axios'
import TripDescriptionModal from "./components/TripDescriptionModal"
import Map from "./components/Map"
import DisplaySavedTrip from "./components/DisplaySavedTrip"

const appId = 'LlE2nrAJrse1JYXZ0Df7'
const appCode = 'XXCx7D_XrTccT2tsc4xElg'
const apiURL = 'https://shrtr-api.herokuapp.com'
const routeApi = `${apiURL}/route`
const recommendationApi = `${apiURL}/recommendation`

var bubble

class App extends Component {

  state = {
    collapsed: true,
    listOfSelectedLocations: [],
    route: {},
    planned: false,
    selectedLocation: {},
    lat: '',
    long: '',
    modalVisible: false,
    displayPlan: true,
    spinning: false,
    listOfSavedTrip: [],
    tripCache: null,
    planDistance: null,
    planTime: null
  }

  menuItemOnClick = (menuItemIndex) => {
    if (menuItemIndex === 1)
      this.setState({ displayPlan: true })
    else {
      this.setState({ displayPlan: false, spinning: true }, () => {
        axios.get(recommendationApi)
          .then(response => response.data)
          .then(response => {
            console.log('response', response)
            this.setState({ spinning: false, listOfSavedTrip: response })
          })
          .catch((err) => {
            console.log('error', err)
            this.setState({ spinning: false })
          })
      })
    }
  }

  updateMapMarker = (map, group, lat, lng, zoom, itemref) => {
    if (map){
      let marker

      if (itemref){
        const icon = new window.H.map.Icon(itemref.icon)
        marker = new window.H.map.Marker({ lat, lng }, { icon });
      } else {
        marker = new window.H.map.Marker({ lat, lng })
      }

      marker.addEventListener('pointerup',
        (e) => {
          console.log('itemref', itemref)
          this.locationOnClick(itemref)
        }
      )

      if (!group.contains(marker))
        group.addObject(marker)

      if (zoom > 0){
        map.setCenter({ lat, lng })
        map.setZoom(zoom)
      }

      this.setState({ map, group })
    }
  }

  componentDidMount() {
    if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude
        const long = position.coords.longitude

        const H = window.H
        const platform = new H.service.Platform({
          app_id: appId,
          app_code: appCode,
          useHTTPS: true
        })

        const pixelRatio = window.devicePixelRatio || 1;
        const defaultLayers = platform.createDefaultLayers({
          tileSize: pixelRatio === 1 ? 256 : 512,
          ppi: pixelRatio === 1 ? undefined : 320
        })

        console.log('initiatiate')
        const map = new H.Map(document.getElementById('heremap'),
          defaultLayers.normal.map,
          { pixelRatio })
        const ui = window.H.ui.UI.createDefault(map, defaultLayers)

        const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map))
        const group = new H.map.Group()

        map.addObject(group)

        this.setState({ lat, long, map, group, behavior, ui })
        this.updateMapMarker(map, group, lat, long, 15)
        this.openNotification()
      })

    } else {
      alert('Geolocation is not supported')
      this.setState({ map: false })
    }


  }

  locationOnClick = (value) => {
    if (value){
      this.updateMapMarker(
        this.state.map,
        this.state.group,
        value.location.position[0],
        value.location.position[1],
        15,
        value
      )
      this.setState({ selectedLocation: value })
    }
  }

  locationOnSelect = (value) => {
    if (value){
      const list = this.state.listOfSelectedLocations.filter((location) => {
        return location.placeId === value.placeId
      })

      if (list.length === 0){
        if (value.results){ // autosuggest
          // select food on map and add
          value.results.items.forEach((item) => {
            console.log('item', item.href)
            axios.get(item.href)
              .then((itemref) => {
                this.updateMapMarker(
                  this.state.map,
                  this.state.group,
                  item.position[0],
                  item.position[1],
                  -1,
                  itemref.data
                )
              })
              .catch((error) => {
                console.log('error', error)
              })
          })
        } else {
          this.setState({
            selectedLocation: value
          })

          this.updateMapMarker(
            this.state.map,
            this.state.group,
            value.location.position[0],
            value.location.position[1],
            15,
            value
          )
        }
      } else {
        this.setState({ selectedLocation: value })
      }
    }
  }

  addableLocation = (value) => {
    return value && this.state.listOfSelectedLocations.filter((location) => {
      return location.placeId === value.placeId
    }).length === 0
  }

  addLocation = (location) => {
    if (this.addableLocation(location)){
      this.setState({
        planned: false,
        listOfSelectedLocations: [...this.state.listOfSelectedLocations, location]
      })

      message.success(`Location ${location.name} has been added`)
    } else {
      message.success(`Location ${location.name} has already added into your list`)
    }
  }

  removeLocation = (value) => {
    const list = this.state.listOfSelectedLocations.filter((location) => {
      return location.placeId !== value.placeId
    })

    this.setState({
      planned: false,
      listOfSelectedLocations: [...list]
    })

    message.success(`Location ${value.name} has been deleted`)
  }

  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  }

  openNotification = () => {
    notification.open({
      message: 'Welcome to SHRTR Trip Planner',
      placement: 'topRight',
    });
    console.log('print notification')
  }

  saveOnClick = (e) => {
    if (!this.state.planned){
      Modal.error({
        title: 'No plan yet',
        content: 'Please click Plan button to plan the trip first!'
      })
    } else {
      this.setState({ modalVisible: true })
    }
  }

  modalOnOk = (tripData, callback) => {
    // todo: save
    message.info('Trip has been saved!')
    const saveValue = {
      trip_name: tripData.tripName,
      trip_description: tripData.tripDescription,
      trip_creator: 'leonwcs',
      route: this.state.route,
      list_of_selected_locations: this.state.listOfSelectedLocations
    }

    axios.post(recommendationApi, saveValue)
      .then(response => {
        callback()
        this.setState({ modalVisible: false })
      })
      .catch(err => {
        console.log('error', err)
        callback()
        this.setState({ modalVisible: false })
      })
  }

  modalOnCancel = (e) => {
    this.setState({ modalVisible: false })
  }

  clearOnClick = () => {
    Modal.confirm({
      title: 'Clear',
      content: 'Do you want to clear your selected locations? (Included markers on the map)',
      onOk: () => {
        const { map, group, lat, long } = this.state
        group.removeAll()
        this.updateMapMarker(map, group, lat, long, 15)
        this.setState({ listOfManeuver: [] })
        this.setState({ listOfSelectedLocations: [] })
      }
    })
  }

  planOnClick = (callback) => {
    const { group, map, listOfSelectedLocations, ui } = this.state
    const svgMarkup = '<svg width="18" height="18" ' +
      'xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="8" cy="8" r="8" ' +
      'fill="#1b468d" stroke="white" stroke-width="1"  />' +
      '</svg>'
    const dotIcon = new window.H.map.Icon(svgMarkup, { anchor: { x: 8, y: 8 } })

    if (listOfSelectedLocations.length < 2){
      Modal.error({
        title: 'Invalid number of locations!',
        content: 'Please select your desired location to go. (At least 2)'
      })

      callback({})
    } else {
      const postParams = {
        "coordinates": listOfSelectedLocations
          .map((item) => `${item.location.position[0]},${item.location.position[1]}`),
        "option": "distance"
      }

      this.setState({ spinning: true })
      axios.post(routeApi, postParams)
        .then((response) => response.data)
        .then((route) => {
          group.removeAll()
          console.log(route)
          const sortedList = route.best_path.map((position) => {
            const parts = position.split(',')
            const lat = parseFloat(parts[0])
            const lng = parseFloat(parts[1])

            const itemref = listOfSelectedLocations.filter((item) =>
              item.location.position[0] === lat && item.location.position[1] === lng
            )[0]

            const icon = new window.H.map.Icon(itemref.icon)

            const marker = new window.H.map.Marker({
              lat: itemref.location.position[0],
              lng: itemref.location.position[1]
            }, { icon })

            console.log('????')

            marker.addEventListener('pointerup',
              (e) => {
                console.log('itemref', itemref)

                this.locationOnClick(itemref)
              }
            )

            console.log(marker.getPosition())
              
            
            group.addObject(marker)

            return itemref
          })


          route.maneuvers.forEach((maneuver) => {
            maneuver.forEach((item) => {
              const marker = new window.H.map.Marker({
                lat: item.position.latitude,
                lng: item.position.longitude
              }, { icon: dotIcon })
              marker.instruction = item.instruction

              // marker.addEventListener('tap', (e) => {
              //   if(!bubble){
              //     bubble =  new window.H.ui.InfoBubble(
              //       e.target.getPosition(),
              //       // The FO property holds the province name.
              //       {content: e.target.instruction});
              //     console.log('fffffffff', bubble)
              //     ui.addBubble(bubble);
              //     bubble.open()
              //   } else {
              //     bubble.setPosition(e.target.getPosition());
              //     bubble.setContent(e.target.instruction);
              //     console.log('ggggggg', bubble)
              //     bubble.open()
              //   }
              // })

              // group.addObject(marker)
            })
          })

          const groupLineString = new window.H.geo.LineString()
          route.shapes.forEach((shape) => {
            let lineString = new window.H.geo.LineString()
            shape.forEach((point) => {
              const parts = point.split(',')
              lineString.pushLatLngAlt(parts[0], parts[1])
              groupLineString.pushLatLngAlt(parts[0], parts[1])
            })
            const polyline = new window.H.map.Polyline(lineString, {
              style: {
                lineWidth: 4,
                strokeColor: 'rgba(0, 128, 255, 0.7)'
              }
            })

            group.addObject(polyline);
          })

          const polyline = new window.H.map.Polyline(groupLineString)
          map.setViewBounds(polyline.getBounds(), true)

          const planDistance = route.distance
          const planTime = route.time

          this.setState({ map, group, route, planDistance, planTime, listOfSelectedLocations: sortedList, spinning: false, planned: true })
          callback(route)
        })
        .catch((error) => {
          console.log('error', error)
          callback({})
          this.setState({ spinning: false })
        })
    }
  }

  displayOnMap = (route, listOfSelectedLocations) => {
    const { map, group } = this.state
    const svgMarkup = '<svg width="18" height="18" ' +
      'xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="8" cy="8" r="8" ' +
      'fill="#1b468d" stroke="white" stroke-width="1"  />' +
      '</svg>'
    const dotIcon = new window.H.map.Icon(svgMarkup, { anchor: { x: 8, y: 8 } })

    group.removeAll()

    listOfSelectedLocations.forEach((itemref) => {
      const icon = new window.H.map.Icon(itemref.icon)

      const marker = new window.H.map.Marker({
        lat: itemref.location.position[0],
        lng: itemref.location.position[1]
      }, { icon })

      marker.addEventListener('pointerup',
        (e) => {
          console.log('itemref', itemref)
          this.locationOnClick(itemref)
        }
      )

      group.addObject(marker)
    })

    route.maneuvers.forEach((maneuver) => {
      maneuver.forEach((item) => {
        const marker = new window.H.map.Marker({
          lat: item.position.latitude,
          lng: item.position.longitude
        }, { icon: dotIcon })
        marker.instruction = item.instruction
        // group.addObject(marker)
      })
    })

    const groupLineString = new window.H.geo.LineString()
    route.shapes.forEach((shape) => {
      let lineString = new window.H.geo.LineString()
      shape.forEach((point) => {
        const parts = point.split(',')
        lineString.pushLatLngAlt(parts[0], parts[1])
        groupLineString.pushLatLngAlt(parts[0], parts[1])
      })
      const polyline = new window.H.map.Polyline(lineString, {
        style: {
          lineWidth: 4,
          strokeColor: 'rgba(0, 128, 255, 0.7)'
        }
      })

      group.addObject(polyline);
    })

    const polyline = new window.H.map.Polyline(groupLineString)
    map.setViewBounds(polyline.getBounds(), true)

    this.setState({ map, group, route, listOfSelectedLocations, spinning: false })
  }

  tripOnClick = (trip) => {
    this.tripOnSelect(trip, () => {
      this.setState({ modalVisible: true, tripCache: trip.cache })
    })
  }

  tripOnSelect = (trip, callback) => {
    console.log(trip)
    this.setState({ spinning: true }, () => {
      if (trip.cache){
        const route = trip.cache.route
        const list_of_selected_locations = trip.cache.list_of_selected_locations

        this.displayOnMap(route, list_of_selected_locations)
        if (callback)
          callback()
      } else {
        axios.get(recommendationApi, {
          params: { id: trip._id.$oid }
        })
          .then(response => response.data)
          .then(response => {
            console.log(response)
            trip.cache = {
              route: response.route,
              list_of_selected_locations: response.list_of_selected_locations,
              trip_name: response.trip_name,
              trip_description: response.trip_description,
              trip_creator: response.trip_creator
            }

            this.displayOnMap(response.route, response.list_of_selected_locations)
            if (callback)
              callback()
          })
      }
    })
  }

  render() {
    const {
      lat,
      long,
      selectedLocation,
      listOfSelectedLocations,
      modalVisible,
      displayPlan,
      spinning,
      listOfSavedTrip,
      tripCache,
      planDistance,
      planTime
    } = this.state

    return (
      <div>
        <Layout style={ { height: "100vh" } }>
          <Sidebar menuItemOnClick={ this.menuItemOnClick }>
          </Sidebar>
          <Layout>
            <Heder></Heder>
            <Spin spinning={ spinning } indicator={ <Icon type="loading" style={ { fontSize: 24 } } spin/> }>
              <Layout.Content>
                <Row>
                  <Col span={ 6 } style={ { height: '657px' } }>
                    { displayPlan ?
                      <SearchColumn appId={ appId }
                                    appCode={ appCode }
                                    lat={ lat }
                                    long={ long }
                                    distance={ planDistance }
                                    time={ planTime }
                                    clearOnClick={ this.clearOnClick }
                                    saveOnClick={ this.saveOnClick }
                                    planOnClick={ this.planOnClick }
                                    addableLocation={ this.addableLocation }
                                    addLocation={ this.addLocation }
                                    locationOnSelect={ this.locationOnSelect }
                                    removeLocation={ this.removeLocation }
                                    selectedLocation={ selectedLocation }
                                    listOfSelectedLocations={ listOfSelectedLocations }/>
                      :
                      <DisplaySavedTrip selectedLocation={ selectedLocation }
                                        listOfSavedTrip={ listOfSavedTrip }
                                        tripOnClick={ this.tripOnClick }
                                        tripOnSelect={ this.tripOnSelect }/>
                    }
                  </Col>
                  <Col span={ 18 }>
                    <Map mapWidth='1152px'
                         mapHeight='657px'/>
                  </Col>
                </Row>
                <TripDescriptionModal displayPlane={ displayPlan }
                                      modalVisible={ modalVisible }
                                      modalOnOk={ this.modalOnOk }
                                      modalOnCancel={ this.modalOnCancel }
                                      tripCache={ tripCache }
                                      listOfSelectedLocations={ listOfSelectedLocations }/>
              </Layout.Content>
            </Spin>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default App;
