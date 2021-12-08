exports.handler = function (context, event, callback) {
    console.log(event.media);
    console.log(event.uuid);

    callback(null,'done');
}