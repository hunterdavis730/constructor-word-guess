var Word = require('./word.js')
var inquirer = require('inquirer')

var axios = require('axios');

var comedyMovies = ['Monty Python and the Holy Grail', 'Superbad', 'The Hangover', 'Step Brothers', 'The Other Guys', 'Dumb and Dumber', 'Pineapple Express', 'Happy Gilmore', 'Shaun of the Dead', 'Hot Fuzz'];
var actionMovies = ['John Wick', 'The Dark Knight', 'The Bourne Ultimatum', 'Lethal Weapon', 'Saving Private Ryan', 'The Fugitive', 'Casino Royale', 'Die Hard', 'True Lies', 'Enemy of the State'];
var scifiMovies = ['The Matrix', 'Edge of Tomorrow', 'Terminator Salvation', 'Minority Report', 'Inception', 'War of the Worlds', 'Ex Machina', 'Blade Runner', 'The Martian', 'Planet of the Apes']
var comedyTV = ["Family Guy", "The Office", "Parks and Recreation", "Friends", "The Simpsons", "It's Always Sunny in Philidelphia", "How I Met Your Mother", "Seinfeld", "Arrested Development", "New Girl"]
var actionTV = ["Game of Thrones", "Prison Break", "Breaking Bad", "Sons of Anarchy", "Smallville", "Band of Brothers", "Person of Interest", "Criminal Minds", "The Last Kingdom", "Jessica Jones"];
var scifiTV = ["Westworld", "Stranger Things", "Black Mirror", "The Orville", "The Twilight Zone", "Falling Skies", "Quantum Leap", "Battlestar Galactica", "Star Trek The Next Generation", "Terra Nova"];


var currentMovie = '';
var movie;
var wins = 0;
var losses = 0;
var guessesLeft = 16;
var guessedLetters = [];
var mediaType = '';

var correctGuess = false;
var wordGuessed = false;
var user = '';

function getMovie(event) {
    var num = Math.floor(Math.random() * 10);
    currentMovie = event[num];
}


function displayMovie() {
    movie = new Word(currentMovie)
    movie.addLetters();
    movie.configLetters();
    movie.displayWord();
    console.log(movie.wordDisplay.join(' '))

}

function isGameOver() {

    var correct = 0;
    for (var i = 0; i < movie.letterBank.length; i++) {

        if (movie.letterBank[i].userGuessed === true) {
            correct++

        }

        if (correct === movie.letterBank.length) {

            return wordGuessed = true;
        }
    }

}


function promptGuess() {
    if (guessesLeft === 0) {
        console.log(`Oops. You're out of guesses ${user}.`)
        losses++;
        console.log(`You have ${wins} wins and ${losses} losses.`)
        playAgain();

    } else {
        console.log(`You have ${guessesLeft} guesses remaining`)
        inquirer.prompt([{
            type: "input",
            message: "Guess a letter!",
            name: "userGuess"
        }]).then(function (response) {
            if (response.userGuess.length > 1) {
                console.log("Oops. Please only guess one letter at a time!")
                promptGuess();
            } else if (!guessedLetters.includes(response.userGuess)) {
                guessedLetters.push(response.userGuess);

                movie.guessLetter(response.userGuess)


                console.log(movie.wordDisplay.join(' '))

                isGameOver();



                if (wordGuessed === false) {
                    guessesLeft--;
                    promptGuess();
                } else {
                    console.log(`Congratulations ${user} you guessed the movie!`)
                    wins++;
                    console.log(`You have ${wins} wins and ${losses} losses.`)

                    promptMovie();
                }
            } else {
                console.log("You have already guessed that letter")
                promptGuess();
            }



        })
    }


}

function start() {


    inquirer.prompt([

        {
            type: "input",
            message: "What is your name?",
            name: "userName"
        },
        {
            type: "list",
            message: "Choose a category!",
            choices: ["Movies", "TV Shows"],
            name: "choice"
        }
    ]).then(function (answers) {

        user = answers.userName;
        switch (answers.choice) {
            case "Movies":
                mediaType = "movie";
                showMovies();
                break;
            case "TV Shows":
                mediaType = "show";
                showTV();
                break;

        }
    })
}

function showMovies() {
    inquirer.prompt([{

        type: "list",
        message: "Choose a movie Genre!",
        choices: ["Comedy", "Action", "Sci-Fi"],
        name: "movieGenre"

    }]).then(function (answers) {
        var genre = answers.movieGenre;


        switch (genre) {
            case "Comedy":
                getMovie(comedyMovies)
                displayMovie();

                promptGuess();
                break;
            case "Action":
                getMovie(actionMovies)
                displayMovie();
                promptGuess();
                break;
            case "Sci-Fi":
                getMovie(scifiMovies)
                displayMovie();
                promptGuess();
                break;
            default:
                console.log("Please try again")
        }
    })
}

function showTV() {
    inquirer.prompt([{
        type: "list",
        message: "Choose a TV Show Genre!",
        choices: ["Comedy", "Action", "Sci-Fi"],
        name: "genre"
    }]).then(function (answers) {
        var genre = answers.genre;


        switch (genre) {
            case "Comedy":
                getMovie(comedyTV)
                displayMovie();

                promptGuess();
                break;
            case "Action":
                getMovie(actionTV)
                displayMovie();
                promptGuess();
                break;
            case "Sci-Fi":
                getMovie(scifiTV)
                displayMovie();
                promptGuess();
                break;
            default:
                console.log("Please try again")
        }
    })
}


function promptMovie() {
    inquirer.prompt([{
        type: "confirm",
        message: `Would you like to see ${mediaType} details for ${currentMovie}?`,
        name: "answer"
    }]).then(function (res) {
        if (!res.answer) {
            console.log("No worries!")
            playAgain();
        } else {
            searchMovie(currentMovie)
        }
    })
}


function searchMovie(event) {
    var queryUrl = `http://www.omdbapi.com/?apikey=trilogy&t=${event}`;
    axios.get(queryUrl).then(function (response) {
        var res = response.data;

        console.log('================');
        console.log(`Title: ${res.Title}`)
        console.log(`Released: ${res.Released}`)
        console.log(`IMDB Rating: ${res.Ratings[0].Value}`)
        console.log(`Produced in: ${res.Country}`)
        console.log(`Movie Language: ${res.Language}`)
        console.log(`Movie plot: ${res.Plot}`)
        console.log(`Actors: ${res.Actors}`)
        console.log('================');

        playAgain()
    })
}



function playAgain() {
    inquirer.prompt([{
        type: "confirm",
        message: "Play Again?",
        name: "play"
    }]).then(function (res) {

        if (!res.play) {
            console.log("Okay enjoy the rest of your day!")
        } else {
            guessedLetters = [];
            guessesLeft = 16;
            wordGuessed = false;
            newRound();
        }
    })
}

function newRound() {
    inquirer.prompt([

        {
            type: "list",
            message: "Choose a category!",
            choices: ["Movies", "TV Shows"],
            name: "choice"
        }
    ]).then(function (answers) {

        switch (answers.choice) {
            case "Movies":
                mediaType = "movie";
                showMovies();
                break;
            case "TV Shows":
                mediaType = "show";
                showTV();
                break;

        }
    })
}

start()