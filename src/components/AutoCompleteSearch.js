import React, { Component } from "react";
import { AutoComplete, Layout, Button, Input, Icon } from 'antd'
import axios from 'axios'

const { Option } = AutoComplete
const apiURL = 'https://places.cit.api.here.com/places/v1/autosuggest'

class AutoCompleteSearch extends Component {

  state = {
    searchBoxValue: '',
    searchBoxDataSource: []
  }

  onChange = (value) => {
    const { lat, long, selectedLocation, appId, appCode } = this.props
    console.log(value)

    try {
      // this is ant design bug. onChange is called after onSelect.
      JSON.parse(value)
    } catch (err) {
      const position = [0.0, 0.0]
      if (Object.keys(selectedLocation).length !== 0){
        position[0] = selectedLocation.location.position[0]
        position[1] = selectedLocation.location.position[1]
      } else {
        position[0] = lat
        position[1] = long
      }

      axios.get(apiURL,
        {
          params: {
            at: `${position[0]},${position[1]}`,
            q: value,
            app_id: appId,
            app_code: appCode
          }
        }
      ).then((response) => {
        const dataSource = response.data.results.slice(0, 4).map(this.renderOption)
        console.log(dataSource)
        this.setState({ searchBoxDataSource: dataSource })
      }).catch((error) => {
        console.log('error')
        console.log(error)
      })

      this.setState({ searchBoxValue: value })
    }
  }

  onSelect = (value) => {
    console.log('onSelect', JSON.parse(value))
    axios.get(JSON.parse(value).href)
      .then((response) => {
        console.log(response.data)
        this.props.onSelect(response.data)
      })
      .catch((error) => {
        console.log('error')
        console.log(error)
      })
    this.setState({ searchBoxValue: '' })
  }

  renderOption = (item) => {
    let innerHtml
    if (item.vicinity)
      innerHtml = `${item.highlightedTitle} <span className="global-search-item-count">${item.vicinity}</span>`
    else
      innerHtml = `${item.highlightedTitle}`

    const key = `${item.title}${item.category}`

    return (
      <Option key={ key } value={ JSON.stringify(item) }>
        <div dangerouslySetInnerHTML={ { __html: innerHtml } }/>
      </Option>
    )
  }

  render() {
    const { searchBoxDataSource, searchBoxValue } = this.state

    return (
      <AutoComplete
        size='large'
        dataSource={ searchBoxDataSource }
        style={ { width: '100%' } }
        onSelect={ this.onSelect }
        onChange={ this.onChange }
        value={ searchBoxValue }
        placeholder="input here"
      />
    )
  }
}

export default AutoCompleteSearch;