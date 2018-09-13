import React, { Component } from "react";
import { Layout, Icon, Menu } from 'antd'

const { Header } = Layout

class Heder extends Component{
	render(){
		return(
			<Header>
			<Menu
        theme="dark"
        mode="horizontal"
        style={{ lineHeight: '64px' }}>
        </Menu><div><p style = {{color: "white", textAlign:"center", fontFamily: "PLayfair Display", fontSize: "30px"}}>S  H  R  T  R</p></div></Header>
		)
	}
}

export default Heder;