// --- GAME SETTINGS ---

const noMatchDelay = 1000; // in ms
const defaultCardNumber = 10; // must be increments of 2 greater than or equal to 2
gameBackgroundColor = 'whitesmoke';
defaultCardColor = 'white';

// ---------------------

let selection1;
let selection2;
let element1;
let element2;
let match;
let attempts;
let matches;
let lowestScore = null;
let randomColor;
let cardColorArray;
let shuffledColorsArray;
let colorMapObject;
let lowestScoreObject = {};
let inputCardNumber;

const gameContainer = document.getElementById('game');
const increaseCardNumber = document.getElementById('increasecardnumber');
const decreaseCardNumber = document.getElementById('decreasecardnumber');
const resultCardNumber = document.getElementById('resultcardnumber');
const startRestartButton = document.getElementById('startrestartbutton');
const attemptsP = document.getElementById('attempts');
const matchesP = document.getElementById('matches');
const lowestP = document.getElementById('lowestscore');
const topOfPage = document.getElementById('topofpage');
const headingElements = document.querySelectorAll('.hiddenheading');

// create array based on number of cards and random colors
function createColorArray() {
	cardColorArray = [];
	colorMapObject = {};

	let count = 0;
	for (let card = 0; card < inputCardNumber; card += 2) {
		count++;
		cardColorArray.push('cardtype' + count);
		cardColorArray.push('cardtype' + count);
		// selectRandomColor();
		colorMapObject['cardtype' + count] = selectRandomColor();
	}
}

function selectRandomColor() {
	return `rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(
		Math.random() * 256
	)})`;
}

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
	let counter = array.length;

	// While there are elements in the array
	while (counter > 0) {
		// Pick a random index
		let index = Math.floor(Math.random() * counter);

		// Decrease counter by 1
		counter--;

		// And swap the last element with it
		let temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}

	return array;
}

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(shuffledColorsArray) {
	for (let color of shuffledColorsArray) {
		// create a new div
		const newDiv = document.createElement('div');

		// give it a class attribute for the value we are looping over
		newDiv.classList.add(color);
		newDiv.style.backgroundColor = defaultCardColor;

		// call a function handleCardClick when a div is clicked on
		newDiv.addEventListener('click', handleCardClick);

		// append the div to the element with an id of game

		gameContainer.append(newDiv);
	}
}

function displayAttempts() {
	if (attempts === 1) {
		attemptsP.innerText = attempts + ' attempt';
	} else {
		attemptsP.innerText = attempts + ' attempts';
	}
}

function displayMatches() {
	matchesP.innerText = `${matches} / ${inputCardNumber} matched`;

	if (matches === inputCardNumber) {
		let winAlert = setTimeout(function() {
			alert('You win!');
		}, 25);

		if (attempts < lowestScore || lowestScore == null) {
			let lowestScoreAlert = setTimeout(function() {
				alert('New lowest score!');
			}, 25);
			if (lowestScoreObject == null) lowestScoreObject = {};
			lowestScoreObject[inputCardNumber] = attempts;
			lowestScore = attempts;
			localStorage.setItem('memorygame', JSON.stringify(lowestScoreObject));
			displayLowestScore();
			// startRestartButton.className = 'notstarted';
		}

		startRestartButton.className = 'notstarted';
	}
}

function displayLowestScore() {
	lowestScoreObject = JSON.parse(localStorage.getItem('memorygame'));
	// debugger

	lowestScore = null;
	if (lowestScoreObject) {
		// lowestScore = null;
		for (let each in lowestScoreObject) {
			if (parseInt(each) === inputCardNumber) {
				lowestScore = lowestScoreObject[each];
			}
		}
	}

	if (lowestScore == null) {
		lowestP.innerText = 'No lowest score recorded.';
	} else {
		lowestP.innerText = `Lowest score for ${inputCardNumber} cards: ${lowestScore}`;
	}
}

// TODO: Implement this function!
function handleCardClick(event) {
	// you can use event.target to see which element was clicked

	// prevent selecting additional cards during no match delay
	if (selection1 !== 0 && selection2 !== 0) return;

	// console.log('you just clicked', event.target);
	const cardClass = event.target.className;

	if (event.target.className === 'matched') {
		console.log('Cannot reselect this card!');
		return;
	}

	attempts++;
	displayAttempts();

	event.target.style.backgroundColor = `${colorMapObject[cardClass]}`;

	if (selection1 === 0) {
		selection1 = cardClass;
		element1 = event.target;
	} else if (selection2 === 0) {
		if (event.target === element1) return;
		selection2 = cardClass;
		element2 = event.target;

		if (selection1 === selection2) {
			match = true;
			selection1 = 0;
			selection2 = 0;
			element1.className = 'matched';
			element2.className = 'matched';
			matches += 2;
			displayMatches();
		} else {
			match = false;
			let noMatchTimeout = setTimeout(function() {
				element1.style.backgroundColor = defaultCardColor;
				element2.style.backgroundColor = defaultCardColor;
				selection1 = 0;
				selection2 = 0;
			}, noMatchDelay);
		}
	}
}

// when the DOM loads
inputCardNumber = defaultCardNumber;
resultCardNumber.innerText = `${defaultCardNumber} cards`;
document.body.style.backgroundColor = selectRandomColor();
startRestartButton.className = 'notstarted';
for (let each of headingElements) {
	each.hidden = true;
}

increaseCardNumber.addEventListener('click', function() {
	inputCardNumber += 2;
	resultCardNumber.innerText = `${inputCardNumber} cards`;
	startGame();
});

decreaseCardNumber.addEventListener('click', function() {
	if (inputCardNumber >= 6) {
		inputCardNumber -= 2;
	}
	resultCardNumber.innerText = `${inputCardNumber} cards`;
	startGame();
});

startRestartButton.addEventListener('click', function(event) {
	event.preventDefault();
	startGame();
});

function startGame() {
	gameContainer.innerHTML = '';
	selection1 = 0;
	selection2 = 0;
	element1;
	element2;
	attempts = 0;
	displayAttempts();
	matches = 0;
	displayMatches();
	createColorArray();
	shuffledColorsArray = shuffle(cardColorArray);
	document.body.style.backgroundColor = gameBackgroundColor;
	attemptsP.hidden = true;
	matchesP.hidden = true;
	lowestP.hidden = true;

	for (let each of headingElements) {
		each.hidden = false;
	}

	startRestartButton.hidden = false;
	startRestartButton.className = 'started';
	startRestartButton.innerText = 'Restart Game';
	topOfPage.style.border = '1px solid black';
	topOfPage.style.backgroundColor = selectRandomColor();
	createDivsForColors(shuffledColorsArray);
	displayLowestScore();
}
