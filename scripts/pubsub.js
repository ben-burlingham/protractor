PubSub = {
    channels: {},

    emit: (chan, msg) => {
        PubSub.channels[chan].forEach(o => {
            o.onUpdate(chan, msg);
        });
    },

    subscribe: (chan, obj) => {
        PubSub.channels[chan] = PubSub.channels[chan] || [];
        PubSub.channels[chan].push(obj);
    },
}
