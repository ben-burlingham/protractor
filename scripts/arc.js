Arc = function({ appId, settings }) {
    const ns = 'http://www.w3.org/2000/svg';

    this.settings = settings;
    this.guideThetas = [settings.theta0, settings.theta1];

    const { arcPath, trianglePath } = this.buildPaths(...this.guideThetas, settings);

    this.node = document.createElementNS(ns, 'svg');
    this.node.setAttribute('class', `${this.appId}-arc`);
    this.node.setAttribute('height', settings.radius * 2);
    this.node.setAttribute('width', settings.radius * 2);

    this.arc = document.createElementNS(ns, 'path');
    this.arc.setAttribute('d', arcPath);
    this.arc.setAttribute('class', `${appId}-path`);

    this.triangle = document.createElementNS(ns, 'path');
    this.triangle.setAttribute('d', trianglePath);
    this.triangle.setAttribute('class', `${appId}-path`);

    this.node.appendChild(this.arc);
    this.node.appendChild(this.triangle);

    PubSub.subscribe(Channels.GUIDE_MOVE, this);

    return this.node;
};

Arc.prototype = {
    buildPaths: function(theta0, theta1, radius) {
        const rX = this.settings.radius;
        const rY = this.settings.radius;
        const flip = 0
        // const flip = (theta1 - theta0) < Math.PI ? 0 : 1;

        const startX = rX + rX * Math.cos(theta0);
        const startY = rY - rY * Math.sin(theta0);
        const endX = rX + rX * Math.cos(theta1);
        const endY = rY - rY * Math.sin(theta1);

        return {
            arcPath: `M ${startX} ${startY} A ${rX} ${rY} 0 0 ${flip} ${endX} ${endY}`,
            trianglePath: `M ${startX} ${startY} L ${endX} ${endY} L ${rX} ${rY} Z`
        }

    },

    onUpdate: function(chan, msg) {
        if (chan === Channels.GUIDE_MOVE) {
            this.guideThetas[msg.index] = msg.theta;

            const { arcPath, trianglePath } = this.buildPaths(...this.guideThetas);
            this.arc.setAttribute('d', arcPath);
            this.triangle.setAttribute('d', trianglePath);
        }

        // if (chan === Channels.RESIZE) {
    }
};
