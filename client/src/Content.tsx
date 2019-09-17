import React, { Component } from 'react'
import { Route } from "react-router-dom"

import Browse from './components/pages/Browse'
import Home from './components/pages/Home'
import Logout from './components/auth/Logout'
import FacebookLogin from './FacebookLogin'
import Profile from './components/pages/Profile'

import { ContentInt } from './react-app-env'



class Content extends Component<ContentInt> {
  render() {
    return (
      <div>
        <Route exact path='/' component={Home} />
        //THESE ROUTE WILL BE ADDED AFTER WE GET THE RESTFULL ROUTES DONE
        //<Route pathe='/login' component={FacebookLogin} />

         <Route path='/profile' component={Profile} />
         <Route path='/browse' render={ () =>
           <Browse refreshArtworks={this.props.refreshArtworks}
            artworks={this.props.artworks} />
          } />
        // <Route path='/logout' component={Logout} />
      </div>
    )
  }
}

export default Content
