import React, { Component } from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../components/footer/Footer'
import Dashboard from '../pages/Dashboard'
import Orb from '../components/orbit/Orbit'
import Navigation from '../components/navigation/Navigation'

export default class HomeTemplates extends Component {
  render() {
    return (
      <>
        <Navigation/>

        <Dashboard/>

        <Orb/>
        
{/*     <div style={{minHeight: 800}}> 
            <Outlet/> 
        </div> */}

        <Footer/>
      </>
    )
  }
}
