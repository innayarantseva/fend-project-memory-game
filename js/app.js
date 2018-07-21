const deck             = document.querySelector( '.deck'  ),
      timerPlaceholder = document.querySelector( '.timer' ),
      movesPlaceholder = document.querySelector( '.moves' );

let moves           = 0,
    pairs           = 0,
    gameTimer       = false, 
    gameTimerActive = false,
    tries           = [],
    currentlyOpen   = [];

const symbolClasses = [
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

/* State of the Game Functions */

const startTimer = () => {
        let min = 0,
            sec = 1;

        gameTimerActive = true;

        gameTimer = setInterval(
            () => {
                sec < 10 
                    ? timerPlaceholder.innerHTML = `${min}:0${sec}`
                    : timerPlaceholder.innerHTML = `${min}:${sec}`;

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

    setCounter = () => movesPlaceholder.textContent = moves;


/* Interaction with Deck Functions */

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
        !gameTimerActive && startTimer();

        if ( target.nodeName === 'LI' && !isOpened( target ) ) {
            showSymbol( target );
            checkForMatch();
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
            }

            setTimeout( 
                () => {
                    a.classList.remove( 'open', 'show' );
                    b.classList.remove( 'open', 'show' );

                    currentlyOpen = [];

                    deck.addEventListener( 'click', handleCardClick );
                }, 
                500
            );

            moves++;
            setCounter();
        }
    }

    setNewGame = () => {
        resetDeck();
        generateCards();
        shuffleDeck();
        deck.addEventListener( 'click', handleCardClick );
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

setNewGame();