var Twister = function (uri) {
    this.messages = {
        "SUBSCRIBE": 5,
        "UNSUBSCRIBE": 6,
        "PUBLISH": 7,
        "EVENT": 8
    };
    this.subscriptions = {};
    this.connect = function (callback) {
        this.ws = new WebSocket(uri);
        if (callback) {
            this.ws.onmessage = callback;
        }
        this.ws.onmessage = function (message) {
            var payload = JSON.parse(message.data);
            if (payload[0] != this.messages.EVENT) {return;}
            for (var key in this.subscriptions) {
                if (this.subscriptions.hasOwnProperty(key) &&
                    key == payload[1]) {
                    var callback = this.subscriptions[key];
                    callback(payload[1], payload[2]);
                }
            }

        }.bind(this);
    };
    this.send = function (message) {
        this.ws.send(JSON.stringify(message));
    };
    this.subscribe = function (channel, callback) {
        this.send([this.messages.SUBSCRIBE, channel]);
        if (!this.subscriptions[channel]) {
            this.subscriptions[channel] = [];
        }
        this.subscriptions[channel].push(callback);
    };
    this.unsubscribe = function (channel) {
        this.send([this.messages.UNSUBSCRIBE, channel]);
        delete this.subscriptions[channel];
    };
    this.publish = function (channel, payload) {
        this.send([this.messages.PUBLISH, channel, payload, true]);
    };
};
