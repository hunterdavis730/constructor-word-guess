function Letter(letter) {
    this.letter = letter;
    this.userGuessed = false;
    this.letterDisplay = ' ';

}

Letter.prototype.display = function () {
    if (this.userGuessed) {
        this.letterDisplay = this.letter;
    }

};

Letter.prototype.guess = function (event) {
    if (event.toLowerCase() === this.letter.toLowerCase()) {
        this.userGuessed = true;
        this.display();
    }
};

Letter.prototype.initializeDisplay = function () {
    if (this.letter === ' ') {
        this.letterDisplay = ' ';
        this.userGuessed = true;
    } else {
        this.letterDisplay = '_';
    }
}



module.exports = Letter;