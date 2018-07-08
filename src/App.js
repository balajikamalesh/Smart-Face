import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/navigation/navigation';
import Logo from './components/logo/logo';
import ImageLinkForm from './components/imagelinkform/imagelinkform';
import Rank from './components/rank/rank';
import FaceRecognition from './components/facerecognition/facerecognition';
// import PredominantColor from './components/predominantcolor/predominantcolor';
import Signin from './components/Signin/signin';
import Register from './components/register/register';
import './App.css';



const particlesOption = {
                particles: {
                  number: {
                    value: 75,
                    density: {
                      enable: true,
                      value_area: 800 
                    }
                  }
                },
                interactivity: {
                  onhover: {
                    enable: true,
                    mode: 'grab'
                  }
                }
}

const initialState = {
          input: '',
          imageURL: '',
          box: [],
          color: [],
          route: 'signin',
          isSignedin: false,
          user: {
            id: '123',
            name: '',
            email: '',
            entries: 0,
            joined: ''
          }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;  
}

calculateFaceLocation = (data) => {
    
    var image = document.getElementById('inputImage');
    var imageWidth = Number(image.width);
    var imageHeight = Number(image.height);

    const faceArray = data.map((face) => {
      
      return {
          leftCol: face.region_info.bounding_box.left_col * imageWidth,
          topRow: face.region_info.bounding_box.top_row * imageHeight,
          rightCol: (1 - face.region_info.bounding_box.right_col) * imageWidth,
          bottomRow: (1 - face.region_info.bounding_box.bottom_row) * imageHeight
          } 

    })

    return faceArray;

}

  displayFaceBox = (box) => {

    this.setState({box: box});
  
  }

  displayColor = (color) => {

    this.setState({color: color.colors});
  
  }

  onInputChange = (event) => {

    this.setState({input: event.target.value});
  
  }

  onButtonSubmit = () => {

        this.setState({imageURL: this.state.input});
        // console.log(this.state.input);
        // console.log(this.state.imageURL); //this displays blank becauese of asynchronous behavior
        fetch('https://infinite-gorge-98791.herokuapp.com/imageurl',{
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                  input: this.state.input
                })
              })
          .then(response => response.json())
          .then((response) => {
            if(response){
              fetch('https://infinite-gorge-98791.herokuapp.com/image',{
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                  id: this.state.user.id
                })
              })
              .then(response => response.json())
              .then(count => {
                this.setState(Object.assign(this.state.user,{entries: count}));
              })
              .catch(console.log);
            }
            this.displayFaceBox(this.calculateFaceLocation(response.outputs[0].data.regions))
          })
          .catch(err => console.log(err));

        // app.models.predict(Clarifai.COLOR_MODEL, this.state.input)
        //   .then((response) =>  this.displayColor(response.outputs[0].data))
        //   .catch(err => console.log(err));

  }
  //Clarifai.FACE_DETECT_MODEL
  //Clarifai.COLOR_MODEL

  onRouteChange = (route) => {
    
    if(route === 'signout') {
      this.setState({isSignedin: false});
    } else if(route === 'home') {
      this.setState({isSignedin: true});
    }

    this.setState({route: route});

  }

  loadUser = (data) => {
      this.setState({user: {
            id: data.id,
            name: data.name,
            email: data.email,
            entries: data.entries,
            joined: data.joined
      }})
  }

  render() {
    const {isSignedin, imageURL, route, box,user} = this.state;
    return (
      <div className="App">
        <Particles className='particles'
              params={particlesOption}
            />
        <Navigation isSignedIn={isSignedin} onRouteChange={this.onRouteChange}/>
        { route === 'home' ?
          <div>
            <Logo />
            <Rank name={user.name} entries={user.entries} style={{float:'right'}}/>
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
            <FaceRecognition box={box} imageURL={imageURL}/>
            {

            }
          </div>
            : 
              (
                (route === 'signin' || route === 'signout') ?
                <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
              )         
        }
        {/* <PredominantColor color={this.state.color} /> */}
      </div>
    );
  }
}

export default App;
