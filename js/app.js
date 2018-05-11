// these are the icons on our cards...
const shapes = ['code', 'bug', 'user-secret', 'terminal', 'globe', 'laptop', 'server', 'power-off'];
let State = function () {
    // this keeps a list of the cards we're currently looking at
    // that may or may not have matched as well as moves and matches
    this.allcards = [];
    this.openCards = [];
    this.moves = 0;
    this.removedstars = 0;
    this.matches = 0;
    this.seconds = 0;
    this.intervalObj = {};
};

state.prototype.incrementMoves = function() {
    this.moves++;
};

State.prototype.removeStar = function() {
    this.removedStars++;
};

state.prototype.addCard = function(card) {
    this.allCards.push(card);
};

state.prototype.addopenCard = function(card) {
    this.incrementmoves();
    // after 35 moves and 45 moves we remove stars
    switch (this.moves) {
        case 35:
            this.removestar();
            break;
        case 45:
            this.removestar();
            break;
    }
    this.opencards.push(card);
};

state.prototype.clearopencards = function() {
    this.opencards = [];
};

state.prototype.incrementseconds = function() {
    this.seconds++;
};

state.prototype.reset = function() {
    // reset our state
    this.allcards = [];
    this.opencards = [];
    this.moves = 0;
    this.removedstars = 0;
    this.matches = 0;
    this.seconds = 0;
    this.intervalObj = {};
};

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
function togglecardclicks(state,toggle){
  //enable or disable click-ability of all cards
  if (toggle === true){
    state.all.cards.map(card) => { togglecardclick(state, true, card)};
  } 
    else if(toggle === false)
   {
   state.all.cards.map(card) => { togglecardclick(state, false, card)};
    }
}

function togglecardclick(state, toggle, card) {
    // enable or disable click-ability of single card
    if (toggle === true) {
        $(card).unbind();
        $(card).click(() => {
            turncard(state, card);
        });
    } else if (toggle === false) {
        $(card).off('click');
    }
}

function clearboard(cards) {
    for (const card of cards) {
        // clears out classes other than card
        $(card).attr('class', 'card');
        $(card).children('i').attr('class', 'fa');
        $(card).unbind();
    }
}

function checkForMatch(state) {
    if (state.openCards.length === 2) {
        const card1 = $(state.opencards[0]);
        const card2 = $(state.opencards[1]);
        // check if there is a match
        if (card1.data('shape') === card2.data('shape')) {
            markMatch(state);
        } else {
            nonMatch(state);
        }
    }
}

function markMatch(state) {
          state.opencards.map(card => {$(card).addclass('match'))};
    state.clearopencards();
    state.matches++;
    // game has been won!
    if (state.matches === 8) {
        gameOver(state);
    }
}

function nonMatch(state) {
    togglecardclicks(state, false);
    setTimeout(() => {
        state.opencards.map(card => { $ card.removeclass('open show'))};
        state.clearopencards();
        togglecardclicks(state, true);
    }, 1000);
}

function turncard(state, card) {
    state.addopencard(card);
    $(card).addclass('open show');
    togglecardclick(state, false, card);

    // show the number of moves we've made thus far
    $('#move-count').text(state.moves);

    if (state.moves === 1) {
        startTimer(state);
    }

    showstars(state, $('.score-panel-item').children('.stars')[0]);

    checkForMatch(state);
}

function showstars(state, starParentEl) {
    const stars = $(starParentEl).find('.fa-star');
    for (let i = 0; i < state.removedstars; i++ ) {
        $(stars[i]).css('display', 'none');
    }
}

function resetstars(starParentEl) {
    const stars = $(starParentEl).find('.fa-star');
    for (const star of stars) {
        $(stars).css('display', 'inline-block');
    }
}

function startTimer(state) {
    // clear timer if previously instantiated
    if (state.intervalObj !== undefined) {
        clearInterval(state.intervalObj);
        state.seconds = 0;
    }
    // start timer
    state.intervalObj = setInterval(() => {
        state.incrementSeconds();
        $('.seconds-passed').text(state.seconds);
    }, 1000);
}

function stopTimer(state) {
    clearInterval(state.intervalObj);
}

function gameOver(state) {
    // the game is over, stop the timer and give the user the results
    // and the option to play again
    stopTimer(state);

    const modal = $('.modal');
    modal.css('display', 'block');

    function buildMessage(headerText, messageText) {
        $('.modal-header').text(headerText);
        $('.modal-message').text(messageText);
    }

    if (state.removedstars === 0) {
        buildMessage('Excellent!', 'I wasn\'t sure at first but I\'m certain now, you\'re a matching master.');
    } else if (state.removedStars === 1) {
        buildMessage('Well done!', 'I\'m impressed. With a few more matches going your way, 3 stars will be yours!');
    } else {
        buildMessage('Good Try!', 'Not the best I\'ve seen but I can see some potential!');
    }

    $('#modal-moves').text(state.moves);
    $('#modal-seconds').text(state.seconds);

    showstars(state, $('.modal-content').children('.modal-stars')[0]);

    $('#modal-again-no').click(() => {
        modal.css('display', 'none');
    });

    $('#modal-again-yes').click(() => {
        modal.css('display', 'none');
        buildBoard(state);
    });

    // When the user clicks anywhere outside of the modal, close it
    $(window).click(function(evt) {
        if (evt.target.className === 'modal') {
            modal.css('display', 'none');
        }
    });
}

function addShapes(cards, cardShapes) {
    cards.map((index, card) => {
        $(card).data('shape', cardShapes[index]);
        $(card).children('i').addClass('fa-' + cardShapes[index]);
    });
}

function buildBoard(state) {

    // start fresh
    stopTimer(state);
    $('#move-count').text(0);
    $('.seconds-passed').text(0);
    resetStars($('.score-panel-item').children('.stars')[0]);
    resetStars($('.modal-content').children('.modal-stars')[0]);
    state.reset();

    let cards = $('.card');
    clearBoard(cards);

    const cardShapes = shuffle([...shapes, ...shapes]);
    addShapes(cards, cardShapes);

    for (const card of cards) {
        state.addcard(card);
        $(card).click(() => {
            turnCard(state, card);
        });
    }

}

/* On Document Ready */
$(() => {
    // Instantiate state object
    let state = new State();

    // Build our initial board
    buildBoard(state);

    // Allows for new games to be restarted at any time
    $('i.fa-repeat').click(() => buildBoard(state) );

});
