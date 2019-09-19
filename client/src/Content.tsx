import React, { Component } from 'react'
import { Route } from "react-router-dom"

import Browse from './components/pages/Browse'
import Home from './components/pages/Home'
//import Logout from './components/auth/Logout'
//import FacebookLogin from './FacebookLogin'
import Profile from './components/pages/Profile'

import { ContentInt } from './react-app-env'



class Content extends Component<ContentInt> {

  render() {
    return (
      <div>
        <Route exact path='/' render={ () =>
          <Home refreshUser={this.props.refreshUser}/>
        } />

        <Route path='/profile' render={() =>
          <Profile current={this.props.current} refreshUser={this.props.refreshUser} refreshArtworks={this.props.refreshArtworks} />
        } />

        <Route path='/browse' render={ () =>
           <Browse refreshArtworks={this.props.refreshArtworks}
            artworks={this.props.artworks} />
          } />
      </div>
    )
  }
}

export default Content
