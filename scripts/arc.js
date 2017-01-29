Arc = function({ appId, initialState }) {
    const ns = 'http://www.w3.org/2000/svg';

    this.guideThetas = [initialState.guideTheta0, initialState.guideTheta1];

    const { arcPath, trianglePath } = this.buildPaths(...this.guideThetas, initialState);

    this.node = document.createElementNS(ns, 'svg');
    this.node.setAttribute('class', `${this.appId}-arc`);
    this.node.setAttribute('height', initialState.radius * 2);
    this.node.setAttribute('width', initialState.radius * 2);

    this.arc = document.createElementNS(ns, 'path');
    // this.arc.setAttribute('d', arcPath);
    this.arc.setAttribute('class', `${appId}-path`);

    this.triangle = document.createElementNS(ns, 'path');
    // this.triangle.setAttribute('d', trianglePath);
    this.triangle.setAttribute('class', `${appId}-path`);

    this.node.appendChild(this.arc);
    this.node.appendChild(this.triangle);

    PubSub.subscribe(Channels.GUIDE_MOVE, this);

    return this.node;
};

Arc.prototype = {
    buildPaths: function(theta0, theta1, radius) {
        // `M ${start.x} ${start.y} A ${r.x} ${r.y} 0 0 ${flip} ${end.x} ${end.y}`
        // `M ${start.x} ${start.y} L ${end.x} ${end.y} L ${r.x} ${r.y} Z`     << TRIANGLE
        return {
            // r: {
            //     x: radius,
            //     y: radius
            // },
            //
            // flip: 0,
            //
            // start: {
            //     x: 200 + 200 * Math.cos(theta0),
            //     y: 200 + 200 * Math.sin(theta0)
            // },
            // end: {
            //     x: 200 + 200 * Math.cos(theta1),
            //     y: 200 + 200 * Math.sin(theta1)
            // }
        };
    },



    onUpdate: function(chan, msg) {
        if (chan === Channels.GUIDE_MOVE) {
            // this.guideThetas[msg.index] = msg.theta;
            // const { start, end } = this.buildPaths(...this.guideThetas);
            //
            // // console.warn(this.guideThetas[1] - this.guideThetas[0])
            //
            // const rx = this.initialState.width / 2;
            // const ry = this.initialState.height / 2;
            // const flip = (this.guideThetas[1] - this.guideThetas[0]) < Math.PI ? 1 : 0;
            //
            // this.arc.setAttribute('d', `M ${start.x} ${start.y} A ${rx} ${ry} 0 0 ${flip} ${end.x} ${end.y}`);
            // this.triangle.setAttribute('d', `M ${start.x} ${start.y} L ${end.x} ${end.y} L ${rx} ${ry} Z`);
        }

        // if (chan === Channels.RESIZE) {
    }
};
