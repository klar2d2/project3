import React, { Component } from 'react'
import  { IUserModel, IVendorModel }  from '../../../../interfaces/modelInterfaces';
import { getThemeProps } from '@material-ui/styles';
import { ContentInt } from '../../react-app-env';

class Profile extends Component<ContentInt, { current }> {
  constructor(props) {
    super(props);

    this.state = {
      current: this.props.current,
    }
  }

  componentDidMount() {
    console.log("CURRENT", this.state.current);
    if (!this.state.current.email) {
      this.setState({
        current: {
          firstname: 'Joe',
          lastname: 'Blow',
          email: 'abc@def.com',
          favorites: ['http://placekitten.com/100/100', 'http://placekitten.com/150/100'],
          vendor: {
            address: {
              streetNumber: '123',
              street: 'Main St',
              streetSuffix: 'NW',
              state: 'WA',
              country: 'USA',
              zipcode: '98133'
            },
            phoneNumber: '(205) 555-1212',
            website: 'http://mysite.com',
            pinned: ['http://placekitten.com/50/50']
          }
        }
      })
    }
  }

  renderFavorites() : JSX.Element {
    console.log("FAVE:", this.state.current.favorites);
    if (this.state.current.favorites) {
        return (
          <div>
            <p>Favorites</p>
            {this.state.current.favorites.map((favorite: string, i : number) => {
              return <img key={i} src={favorite} /> 
              })
            }
          </div>
        )
      } else {
        return <div><p>No Favorites!</p></div>
      }

  }

  renderVendor() : JSX.Element {
    if (this.state.current.vendor) {
      return (
        <div>
          <h2>Vendor Info</h2>
          <p>Address:</p>
          <p>{this.state.current.vendor.address.streetNumber} {this.state.current.vendor.address.street} {this.state.current.vendor.address.streetSuffix}<br />
          {this.state.current.vendor.address.state} {this.state.current.vendor.address.zipcode}, {this.state.current.vendor.address.country}</p>
          <p>{this.state.current.vendor.phoneNumber}</p>
          <p>{this.state.current.vendor.website}</p>
          <p>Pinned Instagram Posts</p>
          <img src={this.state.current.vendor.pinned[0]} />
        </div>
      )
    } else {
      return (
        <div>
          <h1></h1>
        </div>
      )
    }
  }

  render() {
    return (
      <div>
        <h1>My Profile</h1>
        <p>{this.state.current.firstname} {this.state.current.lastname}</p>
        {this.renderFavorites()}
        {this.renderVendor()}
      </div>
    )
  }
}

export default Profile
