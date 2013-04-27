WORK IN PROGRESS


Examples

```javascript

var twister = new Twister("ws://localhost:9000/ws");
twister.connect(function () {
    twister.subscribe('articles/23', function (channel, message) {
        console.log(message);
    });

    twister.publish('articles/23', "Hello!");
});
````
