var Letter = require("./letter.js");

function Word(word) {
    this.word = word;
    this.letters = [];
    this.letterBank = [];
    this.wordDisplay = [];

}

Word.prototype.addLetters = function () {
    this.letters = this.word.split('');
}

Word.prototype.configLetters = function () {
    for (var i = 0; i < this.letters.length; i++) {
        var letter = `letter${this.letters[i].toUpperCase()}`

        letter = new Letter(this.letters[i]);
        this.letterBank.push(letter)
    }
}

Word.prototype.displayWord = function () {
    for (var i = 0; i < this.letterBank.length; i++) {
        this.letterBank[i].initializeDisplay();
        this.letterBank[i].display();
        this.wordDisplay.push(this.letterBank[i].letterDisplay);

    }
}

Word.prototype.guessLetter = function (event) {
    this.wordDisplay = [];
    for (var i = 0; i < this.letterBank.length; i++) {
        this.letterBank[i].guess(event)

    }

    this.displayWord()
}


module.exports = Word;