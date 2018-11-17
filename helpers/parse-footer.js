


function parsefooter(footer) {
    var model = {};
    var footersplit = footer.split(' | ');
    footersplit.forEach(element => {
        elementsplit = element.split(': ');
        model[elementsplit[0].toLowerCase()] = elementsplit[1].toLowerCase();
    });
    return model;
}

module.exports = parsefooter;