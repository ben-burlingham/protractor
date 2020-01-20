Arc = function({ settings }) {
    const ns = 'http://www.w3.org/2000/svg';

    this.guideThetas = [settings.theta0, settings.theta1];
    this.radius = 0;
    this.phi = 0;

    this.node = document.createElementNS(ns, 'svg');
    this.node.setAttribute('class', 'protractor-extension-arc');

    this.arc = document.createElementNS(ns, 'path');
    this.arc.style.fill = settings.arcFill;
    this.arc.setAttribute('class', 'protractor-extension-path');

    this.triangle = document.createElementNS(ns, 'path');
    this.triangle.style.fill = settings.arcFill;
    this.triangle.setAttribute('class', 'protractor-extension-path');

    this.node.appendChild(this.arc);
    this.node.appendChild(this.triangle);

    this.refresh(...this.guideThetas, this.radius, this.phi);

    PubSub.subscribe(Channels.MOVE_CONTAINER, this);
    PubSub.subscribe(Channels.MOVE_GUIDE, this);
    PubSub.subscribe(Channels.MOVE_HANDLE_ROTATE, this);

    return this.node;
};

Arc.prototype = {
    refresh: function(theta0, theta1, radius, phi) {
        const rX = radius;
        const rY = radius;

        const delta = (theta1 - theta0) % (2 * Math.PI);

        const flip = (delta > Math.PI || (delta < 0 && delta > -Math.PI))
                ? 0
                : 1;

        const startX = rX + rX * Math.cos(theta0 + phi);
        const startY = rY + rY * Math.sin(theta0 + phi);
        const endX = rX + rX * Math.cos(theta1 + phi);
        const endY = rY + rY * Math.sin(theta1 + phi);
        
        
        const arcPath = `M ${startX} ${startY} A ${rX} ${rY} 0 0 ${flip} ${endX} ${endY}`;
        const trianglePath = `M ${startX} ${startY} L ${endX} ${endY} L ${rX} ${rY} Z`;

        this.arc.setAttribute('d', arcPath);
        this.triangle.setAttribute('d', trianglePath);
    },

    onMoveContainer: function(msg) {
        this.refresh(...this.guideThetas, msg.radius, this.phi);

        this.node.setAttribute('height', msg.radius * 2);
        this.node.setAttribute('width', msg.radius * 2);
        this.radius = msg.radius;
    },

    onMoveGuide: function(msg) {
        this.guideThetas[msg.index] = msg.theta;
        this.refresh(...this.guideThetas, this.radius, this.phi);
    },

    onMoveHandleRotate: function(msg) {
        this.phi = msg.phi 

        this.refresh(...this.guideThetas, this.radius, this.phi);
    },

    onUpdate: function(chan, msg) {
        switch(chan) {
            case Channels.MOVE_CONTAINER: this.onMoveContainer(msg); break;
            case Channels.MOVE_GUIDE: this.onMoveGuide(msg); break;
            case Channels.MOVE_HANDLE_ROTATE: this.onMoveHandleRotate(msg); break;
        }
    },
};
