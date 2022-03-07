import './App.css';
import { Stage, Layer, Circle, Line } from 'react-konva';
import React from 'react';
import { useEffect } from 'react';
import { pyth, area, momentum, elasCollision, getAngle, getXVel, getYVel } from './helpers';
//import { Scrollbar } from 'smooth-scrollbar-react';
import Scrollbar from 'smooth-scrollbar';
import { Html } from 'react-konva-utils';

var scrollPos = window.scrollY;
var bounceSlow = 0.8;

function update() {
  for (let i = 0; i < cirData.length - 1; i++) {
    for (let j = i; j < cirData.length; j++) {
      if (i !== j && checkCollision(i, j)) {
        collide(i, j);
      }
    }
    scrollPos = scrollbar.offset.y;
  }
  for (let i = 0; i < cirData.length; i++) {
    wallBounce(i);
    cirData[i][2][0] += cirData[i][0][0];
    cirData[i][2][1] += cirData[i][0][1];
  }
}

function checkCollision(cir1, cir2) {
  if (pyth(cirData[cir1][2][0] - cirData[cir2][2][0], cirData[cir1][2][1] - cirData[cir2][2][1]) < cirData[cir1][1] + cirData[cir2][1]) {
    return true;
  }
}

function collide(cir1, cir2) {
  let distance = pyth(cirData[cir1][2][0] - cirData[cir2][2][0], cirData[cir1][2][1] - cirData[cir2][2][1]);
  let radius = cirData[cir1][1] + cirData[cir2][1];
  let angle = getAngle(cirData[cir1][2][0] - cirData[cir2][2][0], cirData[cir1][2][1] - cirData[cir2][2][1]);
  let normal = angle + Math.PI/2;
  
  if (distance < radius) {
    cirData[cir1][2][0] += (radius - distance) / 2 * Math.cos(angle);
    cirData[cir2][2][0] -= (radius - distance) / 2 * Math.cos(angle);
    cirData[cir1][2][1] += (radius - distance) / 2 * Math.sin(angle);
    cirData[cir2][2][1] -= (radius - distance) / 2 * Math.sin(angle);
  }

  let m1 = area(cirData[cir1][1]);
  let m2 = area(cirData[cir2][1]);
  let angle1 = getAngle(cirData[cir1][0][0], cirData[cir1][0][1]);
  let angle2 = getAngle(cirData[cir2][0][0], cirData[cir2][0][1]);
  // let v1X = (m1 - m2) / (m1 + m2) * cirData[cir1][0][0] + 2 * m2 / (m1 + m2) * cirData[cir2][0][0];
  // let v1Y = (m1 - m2) / (m1 + m2) * cirData[cir1][0][1] + 2 * m2 / (m1 + m2) * cirData[cir2][0][1];
  // let v2X = (m2 - m1) / (m1 + m2) * cirData[cir2][0][0] + 2 * m1 / (m1 + m2) * cirData[cir1][0][0];
  // let v2Y = (m2 - m1) / (m1 + m2) * cirData[cir2][0][1] + 2 * m1 / (m1 + m2) * cirData[cir1][0][1];

  let v1 = Math.max(pyth(cirData[cir1][0][0], cirData[cir1][0][1]) * bounceSlow, 0);
  let v2 = Math.max(pyth(cirData[cir2][0][0], cirData[cir2][0][1]) * bounceSlow, 0);

  let v1X = getXVel(m1, m2, v1, v2, angle1, angle2, angle);
  let v1Y = getYVel(m1, m2, v1, v2, angle1, angle2, angle);
  let v2X = getXVel(m2, m1, v2, v1, angle2, angle1, angle);
  let v2Y = getYVel(m2, m1, v2, v1, angle2, angle1, angle);

  cirData[cir1][0] = [v1X, v1Y];
  cirData[cir2][0] = [v2X, v2Y];
}

function wallBounce(cir) {
  if (cirData[cir][2][0] - cirData[cir][1] <= 0) {
    cirData[cir][0][0] = Math.abs(cirData[cir][0][0]);
  }
  else if (cirData[cir][2][0] + cirData[cir][1] >= window.innerWidth) {
    cirData[cir][0][0] = Math.abs(cirData[cir][0][0]) * -1;
  }
  if (cirData[cir][2][1] - cirData[cir][1] <= scrollbar.offset.y) {
    cirData[cir][0][1] = Math.abs(cirData[cir][0][1]);
  }
  else if (cirData[cir][2][1] + cirData[cir][1] >= scrollbar.offset.y + window.innerHeight) {
    cirData[cir][0][1] = Math.abs(cirData[cir][0][1]) * -1;
  }
}

setInterval(update, 1000/60);

class CollidingCircle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: props.index,
      pos: props.pos,
      speed: props.speed,  // 2D Vector
      radius: props.radius,
      color: props.color,
    }
  }
  render() {
    return (
      <Circle x={this.state.pos[0]} y={this.state.pos[1]} radius={this.state.radius} fill={this.state.color} />
    );
  }

  componentDidMount() {
    this.interval = setInterval(() => this.updatePos(this.state.speed[0], this.state.speed[1]), 1000/60);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  updatePos(x, y) {
    var index = this.state.index;
    this.setState({
      pos: [cirData[index][2][0], cirData[index][2][1]]
    });
    this.setState({
      speed: cirData[index][0]
    });
  }
}

function generateCircles() {
  
}

var cirData = [[[10, 2], 80, [300, 300], "#8080ff"],
               [[6, 12], 100, [700, 200], "#8080ff"],
               [[4, -12], 140, [600, 600], "#8080ff"]];

var circles = cirData.map((data, index) => <CollidingCircle key={index} index={index} speed={data[0]} 
                                                         radius={data[1]} pos={data[2]} color={data[3]} />);

var options = {
  damping: 0.05
}

const scrollbar = Scrollbar.init(document.body, options);
scrollbar.addListener(() => {
  let velIncrease = (scrollbar.offset.y - scrollPos) / 50;
  
  for (let i = 0; i < cirData.length; i++) {
    cirData[i][0][1] += velIncrease;
  }
})

function App() {
  return (
    <div className='App'>
      <div className='list-data' style={{display: 'flex', maxHeight: window.innerHeight}}>
          <Stage className='stage' width={window.innerWidth} height={window.innerHeight * 2}>
            <Layer>
              <Html>
                <body>
                    <div class="tab-bar">
                        <button class="button" onclick="location.href='index.html'">About Me</button>
                        <button class="button" onclick="location.href='projects.html'">Projects</button>
                        <button class="button" onclick="location.href='resume.pdf'">Résumé</button>
                    </div>
                    <div class="main-header">
                        <h1>Jayden Nikifork</h1>
                        <p>My E-Portfolio Site.</p>
                    </div>
                    <div class="sub-header about">
                        <h1>About Me</h1>
                        <p>
                            Hello everyone, my name is Jayden Nikifork and I am currently a first year student at McMaster's general engineering program. Despite being an engineering student,
                            my passion lies in software development which is why I am planning on specializing in software engineering come second year. This E-Portfolio website that I have created
                            from scratch is designed to showcase my coding projects as well as my real life accomplishments. I have a few--what are in my opinion--cool projects right now and will
                            hopefully have more, even cooler projects to come in the future. Anyways, back to who I am, outside of coding I love althletics, especially body building, and track and
                            field. Back in elementary and high school I used to participate semi-successfully on the track team, and more recently during my time in high school I was a
                            frequent member of the school's fitness club. To round out my hobbies, I also play League of Legends (peak elo: Diamond 2) and chess (peak elo: 1600), so as a TLDR, 
                            I'm a pretty simple guy. For my future, I have aspirations of one day running my own software development company, you know like Bills Gates or one of those other guys.
                            However, in the mean time I plan on working as a software engineer where I can learn the ropes. Anyways, I'm sure by now you are tired of reading what seems like a 
                            10 page essay, so please feel free to take a look around the different webpages of my E-Portfolio. Enjoy your stay!
                        </p>
                    </div>
                </body>
              </Html>
            </Layer>
            <Layer>
              {circles}
            </Layer>
          </Stage>
      </div>
    </div>
  );
}

export default App;
