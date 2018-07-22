const deck            = document.querySelector( '.deck'  ),
      timer           = document.querySelector( '.timer' ),
      movesContainer  = document.querySelector( '.moves' ),
      starsContainer  = document.querySelector( '.stars' ),
      container       = document.querySelector( '.container' ),
      restartButton   = document.querySelector( '.restart' );

let   moves           = 0,
      pairs           = 0,
      stars           = 3,
      gameTimer       = false, 
      gameTimerActive = false,
      currentlyOpen   = [];

const symbolClasses   = [
    'fa-diamond', 
    'fa-diamond', 
    'fa-paper-plane-o', 
    'fa-paper-plane-o', 
    'fa-anchor', 
    'fa-anchor', 
    'fa-bolt', 
    'fa-bolt', 
    'fa-cube', 
    'fa-cube', 
    'fa-leaf', 
    'fa-leaf', 
    'fa-bicycle',
    'fa-bicycle',
    'fa-bomb', 
    'fa-bomb'
];

/* State of the Game */

const startTimer = () => {
        let min = 0,
            sec = 1;

        gameTimerActive = true;

        gameTimer = setInterval(
            () => {
                sec < 10 
                    ? timer.innerHTML = `${min}:0${sec}`
                    : timer.innerHTML = `${min}:${sec}`;

                if (sec === 59) {
                    min++;
                    sec = 0;
                } else {
                    sec++;
                }

            }, 
            1000
        );

    },

    stopTimer = () => {
        gameTimerActive = false;
        clearInterval( gameTimer );
    },

    setCounter = () => movesContainer.textContent = moves,

    setInitial = () => {
        const winContainer = document.querySelector( '.win' );

        moves     = 0,
        pairs     = 0,
        stars     = 3;

        deck.removeEventListener( 'click', handleCardClick );
        
        stopTimer();
        timer.innerHTML = "0:00";

        if ( winContainer ) {
            container.removeChild( winContainer );
        }

        setCounter();
        setStars();
    };

    setNewGame = () => {
        setInitial();

        resetDeck();
        generateCards();
        shuffleDeck();
        deck.addEventListener( 'click', handleCardClick );
    },

    // Hello, OneRepublic! :)
    countStars = () => {

        if      ( moves < 14 )                   { stars = 3; }
        else if ( (moves >= 14) && (moves < 20) ) { stars = 2; }
        else if ( moves >= 20 )                  { stars = 1; }

        setStars();
    },

    setStars = () => {
        starsContainer.innerHTML = '';

        let star, starIcon;

        for ( var count = 0; count < stars; count++  ) {
            star     = document.createElement( 'li' );
            starIcon = document.createElement( 'i'  );
            starIcon.classList.add( 'fa', 'fa-star' );
            star.append( starIcon );
            starsContainer.append( star );
        }

        for ( var count = 0; count < (3 - stars); count++  ) {
            star     = document.createElement( 'li' );
            starIcon = document.createElement( 'i'  );
            starIcon.classList.add( 'far', 'fa-star' );
            star.append( starIcon );
            starsContainer.append( star );
        }
    };


/* Interaction with Deck */

var resetDeck = () => {
        while ( deck.firstChild ) { 
            deck.removeChild( deck.firstChild ); 
        }
    },

    generateCards = () => {
        const fragment = document.createDocumentFragment();

        while ( fragment.childElementCount < 16 ) {
            const card       = document.createElement( 'li' );
            const cardSymbol = document.createElement( 'i'  );

            card      .classList.add( 'card' );
            cardSymbol.classList.add( 'fa'   );

            card.append( cardSymbol );
            fragment.appendChild( card );
        }

        deck.append(fragment);
    },

    shuffleDeck = () => {
        const cardsCollection = deck.getElementsByClassName('fa'),
              shuffledSymbolClasses = shuffle( symbolClasses );

        shuffledSymbolClasses.forEach( 
            (symbolClass, index) => 
                cardsCollection[index].classList.add( symbolClass ) 
        );
    },

    handleCardClick = ({target}) => {

console.log(timer.innerHTML);

        !gameTimerActive && startTimer();

        if ( target.nodeName === 'LI' && !isOpened( target ) ) {
            countStars();

            showSymbol( target );
            checkForMatch();

            checkIfWin();
        }
    },

    isOpened = card => card.classList.contains( 'open' ),

    showSymbol = card => {
        var cardClasses = card.classList;

        cardClasses.add( 'open', 'show' );
        currentlyOpen.push( card );
    },

    checkForMatch = () => {
        if ( currentlyOpen.length === 2 ) {
            const a = currentlyOpen[0];
            const b = currentlyOpen[1];

            deck.removeEventListener( 'click', handleCardClick );

            if ( a.innerHTML === b.innerHTML ) {
                a.classList.add( 'match' );
                b.classList.add( 'match' );
                pairs++;
            } else {
                a.classList.add( 'mismatch' );
                b.classList.add( 'mismatch' );
            }

            setTimeout( 
                () => {
                    a.classList.remove( 'open', 'show', 'mismatch' );
                    b.classList.remove( 'open', 'show', 'mismatch' );

                    currentlyOpen = [];

                    deck.addEventListener( 'click', handleCardClick );
                }, 
                500
            );

            moves++;
            setCounter();
        }
    },

    checkIfWin = () => {
        if ( pairs === 8 ) {
            stopTimer();
            showWinWindow();
        }
    };

/* Win Window */

const showWinWindow = () => {
    // container.innerHTML = '';

    const containerDiv = document.createElement( 'div' ),
          congrats     = document.createElement( 'div' ),
          stats        = document.createElement( 'div' ),
          resetButton  = document.createElement( 'button' );

    containerDiv.classList.add( 'win' );
    congrats    .classList.add( 'congrats' );
    stats       .classList.add( 'stats' );
    resetButton .classList.add( 'reset-button' );

    congrats   .innerText = 'Congratulations! You won!';
    stats      .innerText = `With ${moves} moves and ${stars} stars. It tooks you ${timer.innerHTML} to win.\nJust great!`;
    resetButton.innerText = 'Play again';

    containerDiv.append( congrats, stats, resetButton );
    container   .append( containerDiv );
    resetButton.addEventListener( 'click', setNewGame );
};

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length - 1, 
        temporaryValue, 
        randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
        currentIndex -= 1;
    }

    return array;
}

restartButton.addEventListener( 'click', setNewGame );

setNewGame();