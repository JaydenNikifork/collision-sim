import './App.css';
import { Stage, Layer, Circle, Line } from 'react-konva';
import React from 'react';
import { pyth, area, momentum, elasCollision, getAngle } from './helpers';

function update() {
  for (let i = 0; i < cirData.length - 1; i++) {
    for (let j = i; j < cirData.length; j++) {
      if (i !== j && checkCollision(i, j)) {
        collide(i, j);
      }
    }
  }
  for (let i = 0; i < cirData.length; i++) {
    wallBounce(i);
    cirData[i][2][0] += cirData[i][0][0];
    cirData[i][2][1] += cirData[i][0][1];
  }
}

function checkCollision(cir1, cir2) {
  if (pyth(cirData[cir1][2][0] - cirData[cir2][2][0], cirData[cir1][2][1] - cirData[cir2][2][1]) < cirData[cir1][1] + cirData[cir2][1]) {
    console.log("collide");
    return true;
  }
}

function collide(cir1, cir2) {
  let distance = pyth(cirData[cir1][2][0] - cirData[cir2][2][0], cirData[cir1][2][1] - cirData[cir2][2][1]);
  let radius = cirData[cir1][1] + cirData[cir2][1];
  let angle = getAngle(cirData[cir1][2][0] - cirData[cir2][2][0], cirData[cir1][2][1] - cirData[cir2][2][1]);
  let normal = angle + Math.PI/2;
  //console.log(angle*180/Math.PI);
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
  let v1X = (m1 - m2) / (m1 + m2) * cirData[cir1][0][0] + 2 * m2 / (m1 + m2) * cirData[cir2][0][0];
  let v1Y = (m1 - m2) / (m1 + m2) * cirData[cir1][0][1] + 2 * m2 / (m1 + m2) * cirData[cir2][0][1];
  let v2X = (m2 - m1) / (m1 + m2) * cirData[cir2][0][0] + 2 * m1 / (m1 + m2) * cirData[cir1][0][0];
  let v2Y = (m2 - m1) / (m1 + m2) * cirData[cir2][0][1] + 2 * m1 / (m1 + m2) * cirData[cir1][0][1];
  let v1 = pyth(v1X, v1Y);
  let v2 = pyth(v2X, v2Y);
  angle1 = 2 * normal - angle1;
  angle2 = 2 * normal - angle2;
  // v1X = v1 * Math.cos(angle1);
  // v1Y = v1 * Math.sin(angle1);
  // v2X = v2 * Math.cos(angle2);
  // v2Y = v2 * Math.sin(angle2);

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
  if (cirData[cir][2][1] - cirData[cir][1] <= 0) {
    cirData[cir][0][1] = Math.abs(cirData[cir][0][1]);
  }
  else if (cirData[cir][2][1] + cirData[cir][1] >= window.innerHeight) {
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

var cirData = [[[3, 8], 80, [300, 300], "green"],
               [[6, 2], 100, [900, 400], "blue"],
               [[4, -2], 140, [600, 600], "red"]];

var curcles = cirData.map((data, index) => <CollidingCircle key={index} index={index} speed={data[0]} 
                                                         radius={data[1]} pos={data[2]} color={data[3]} />);


var circles = [
  <CollidingCircle speed={[1, 0]} radius={50} pos={[300, 300]} color="green" />,
  <CollidingCircle speed={[3, -7]} radius={75} pos={[600, 300]} color="red" />
]

function App() {

  return (
    <div className="App">
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          {curcles}
        </Layer>
      </Stage>
    </div>
  );
}

export default App;
