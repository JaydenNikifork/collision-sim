import './App.css';
import { Stage, Layer, Circle } from 'react-konva';
import React from 'react';
import { pyth, area, getAngle, getXVel, getYVel, getRand } from './helpers';
import Scrollbar, { ScrollbarPlugin } from 'smooth-scrollbar';
import { Html } from 'react-konva-utils';

var scrollPosX;
var scrollPosY;
var bounceSlow = 0.8;

function update() {
  for (let i = 0; i < cirData.length; i++) {
    if (i < cirData.length - 1) {
      for (let j = i; j < cirData.length; j++) {
        if (i !== j && checkCollision(i, j)) {
          collide(i, j);
        }
      }
    }
    scrollPosX = scrollbar.offset.x;
    scrollPosY = scrollbar.offset.y;
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
  if (cirData[cir][2][0] - cirData[cir][1] <= scrollbar.offset.x) {
    cirData[cir][0][0] = Math.abs(cirData[cir][0][0]);
  }
  else if (cirData[cir][2][0] + cirData[cir][1] >= scrollbar.offset.x + window.innerWidth) {
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
      speed: props.speed,
      radius: props.radius,
      color: props.color,
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.pos !== prevProps.pos) {
      this.setState({
        pos: this.props.pos
      });
    }
  }

  render() {
    return (
      <Circle x={this.state.pos[0]} y={this.state.pos[1]} radius={this.state.radius} fill={this.state.color} />
    );
  }
}

var cirData = [];
console.log(getRand(0, 16777215).toString(16));
console.log("liga");
function generateCircles() {
  for (let i = 0; i < getRand(4, 7); i++) {
    cirData.push([[getRand(15, 15), getRand(-15, 15)], getRand(50, Math.min(window.innerHeight, window.innerWidth) / 3), 
                  [getRand(0, window.innerWidth), getRand(0, window.innerHeight)], '#'.concat(getRand(0, 16777215).toString(16))])
  }
}

generateCircles();

var options = {
  damping: 0.05
}

class MobilePlugin extends ScrollbarPlugin {
  static pluginName = 'mobile';
  static defaultOptions = {
    speed: 0.5
  };
}

Scrollbar.use(MobilePlugin);
const scrollbar = Scrollbar.init(document.body, options);

scrollbar.addListener(() => {
  let velIncreaseX = (scrollbar.offset.x - scrollPosX) / 50;
  let velIncreaseY = (scrollbar.offset.y - scrollPosY) / 50;
  
  for (let i = 0; i < cirData.length; i++) {
    cirData[i][0][0] += velIncreaseX;
    cirData[i][0][1] += velIncreaseY;
  }
})

function Circles() {
  var circles = cirData.map((data, index) => <CollidingCircle key={index} index={index} speed={data[0]} 
                                                           radius={data[1]} pos={data[2]} color={data[3]} />);
  return(
    <>
      {circles}
    </>
  );
}

function App() {
  return (
    <div className='App'>
      <div className='list-data' style={{display: 'flex', maxHeight: window.innerHeight}}>
          <Stage className='stage' width={window.innerWidth * 2} height={window.innerHeight * 2}>
            <Layer>
              <Circles />
            </Layer>
            <Layer>
              <Html>
                <h1>Collision Sim</h1>
              </Html>
            </Layer>
          </Stage>
      </div>
    </div>
  );
}

export default App;
