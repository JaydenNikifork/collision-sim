export function pyth(x, y) {
    return (Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
  }

export function area(radius) {
    return (Math.PI * Math.pow(radius, 2));
}

export function momentum(radius, speed) {
    return (area(radius) * speed);
}

export function elasCollision(ma1, sp1, ma2, sp2) {
    return (((ma1 - ma2) * sp1 + 2 * ma2 * sp2) / (ma1 + ma2));
}

export function kineticEnergy(ma1, sp1) {
    return (ma1 * Math.pow(sp1, 2) / 2);
}

export function getAngle(x, y) {
    if (x === 0) {
        return 0;
    }
    let angle = Math.abs(Math.atan(y / x));
    if (x <= 0 && y > 0) {
        angle = Math.PI - angle;
    }
    else if (x < 0 && y <= 0) {
        angle = Math.PI + angle;
    }
    else if (x >= 0 && y < 0) {
        angle = Math.PI*2 - angle;
    }
    return angle;
}

export function getXVel(m1, m2, v1, v2, theta1, theta2, phi) {
    return (v1 * Math.cos(theta1 - phi) * (m1 - m2) + 2 * m2 * v2 * Math.cos(theta2 - phi)) * Math.cos(phi) / (m1 + m2) +
            v1 * Math.sin(theta1 - phi) * Math.cos(phi + Math.PI / 2);
}

export function getYVel(m1, m2, v1, v2, theta1, theta2, phi) {
    return (v1 * Math.cos(theta1 - phi) * (m1 - m2) + 2 * m2 * v2 * Math.cos(theta2 - phi)) * Math.sin(phi) / (m1 + m2) +
            v1 * Math.sin(theta1 - phi) * Math.sin(phi + Math.PI / 2);
}

export function getRand(lo, hi) {
    return Math.floor(Math.random() * (hi - lo) + lo);
}