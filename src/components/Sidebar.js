import React, { Component } from "react";
import logo from '../logo.svg'
import '../App.css'
import { Layout, Menu, Breadcrumb, Icon, Input, AutoComplete } from 'antd'

const { Sider } = Layout
const SubMenu = Menu.SubMenu
const Search = Input.Search

class Sidebar extends Component{
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true
    };
  }

  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  }

  render(){
    return(

        <Sider collapsible
               collapsed={ this.state.collapsed }
               onCollapse={ this.onCollapse }>
          <div>
            <img src={require('./herelogo.png')} width='50px' height='50px' style={{marginLeft: "15px", marginTop: "5px", marginBottom: "5px"}} />
          </div>
          <Menu theme="dark" defaultSelectedKeys={ ['1'] } mode="inline">
            <Menu.Item key="1" onClick={()=>this.props.menuItemOnClick(1)}>
              <Icon type="edit" style={{fontSize:"25px", paddingTop:"7px"}} />
              <span>Plan</span>
            </Menu.Item>
            <Menu.Item key="2" onClick={()=>this.props.menuItemOnClick(2)}>
              <Icon type="schedule" style={{fontSize:"25px", paddingTop:"8px"}} />
              <span>Saved Plan</span>
            </Menu.Item>
          </Menu>
        </Sider>
    )
  }
}

export default Sidebar;
          