Arc = function({ appId, settings }) {
    const ns = 'http://www.w3.org/2000/svg';

    this.guideThetas = [settings.theta0, settings.theta1];
    this.radius = settings.radius;

    const { arcPath, trianglePath } = this.buildPaths(...this.guideThetas, this.radius);

    this.node = document.createElementNS(ns, 'svg');
    this.node.setAttribute('class', `${this.appId}-arc`);
    this.node.setAttribute('height', settings.radius * 2);
    this.node.setAttribute('width', settings.radius * 2);

    this.arc = document.createElementNS(ns, 'path');
    this.arc.setAttribute('d', arcPath);
    this.arc.style.fill = settings.arcFill;
    this.arc.setAttribute('class', `${appId}-path`);

    this.triangle = document.createElementNS(ns, 'path');
    this.triangle.setAttribute('d', trianglePath);
    this.triangle.style.fill = settings.arcFill;
    this.triangle.setAttribute('class', `${appId}-path`);

    this.node.appendChild(this.arc);
    this.node.appendChild(this.triangle);

    PubSub.subscribe(Channels.CONTAINER_RESIZE, this);
    PubSub.subscribe(Channels.GUIDE_MOVE, this);

    return this.node;
};

Arc.prototype = {
    buildPaths: function(theta0, theta1, radius) {
        const rX = radius;
        const rY = radius;

        const delta = theta1 - theta0;

        const flip = (delta > Math.PI || (delta < 0 && delta > -Math.PI))
            ? 1
            : 0;

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

            const { arcPath, trianglePath } = this.buildPaths(...this.guideThetas, this.radius);
            this.arc.setAttribute('d', arcPath);
            this.triangle.setAttribute('d', trianglePath);
        }

        if (chan === Channels.CONTAINER_RESIZE) {
            const { arcPath, trianglePath } = this.buildPaths(...this.guideThetas, msg.radius);

            this.node.setAttribute('height', msg.radius * 2);
            this.node.setAttribute('width', msg.radius * 2);
            this.radius = msg.radius;

            this.arc.setAttribute('d', arcPath);
            this.triangle.setAttribute('d', trianglePath);
        }
    }
};
