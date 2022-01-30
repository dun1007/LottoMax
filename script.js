let lottetyType = '';
let lotteryJackpotAmt = 0;
let lotteryWager = 0;
let numberToPlay = 0;
let prizeMoneyAccumulated = 0;
let ticketPrice = 5;
let poolsFund = 0;
let lottoMaxPrizeList = {};
let lottoMaxWinsCount = [];
const primaryScreen = document.getElementById("welcome");
const secondaryScreen = document.getElementById("result");
const resultParagraph = document.getElementById("p-result");
const avgGainParagraph = document.getElementById("p-avg-gain");
const breakdownParagraph = document.getElementById("p-breakdown");
const breakdownWindow = document.getElementById("breakdown-window");


//const LOTTO_MAX_CHANCE_LIST = {'7':1/33294800,'6b':1/4756400,'6':1/113248,'5b':1/37749,'5':1/1841,'4b':1/1105,'4':1/82.9,'3b':1/82.9,'3':1/8.5};
//const LOTTO_MAX_PLAYING_BOARD = Array.from(Array(50), (_,x) => x+1);

function roundToDigit(num, d) {
	return Math.round(num * Math.pow(10, d))/Math.pow(10,d);
}

function randomIntFromInterval(min, max) {
	return Math.floor(Math.random() * (max-min+1) + min);
}

//lets emulate lotto max play
function performDraw() {
	let prizeMoney = 0;

	//the last number is bonus which applies to 3/4/5/6 matches, so we need to prepare 8 numbers
	const jackpotNumbers = [];
	for(let i=0; i<8; i++) {
		let newJackpotNumber = randomIntFromInterval(1,50);
		while (jackpotNumbers.includes(newJackpotNumber)) {
			newJackpotNumber = randomIntFromInterval(1,50); //make sure no dupe numbers
		}
		jackpotNumbers.push(newJackpotNumber);
	}

	//each lotto max ticket gives you 3 chances
	const chosenNumberSets = [];
	for(let i=0; i<3; i++) {
		const chosenNumbers = [];
		for(let j=0; j<7; j++) {
			let newChosenNumber = randomIntFromInterval(1,50);
			while (chosenNumbers.includes(newChosenNumber)) {
				newChosenNumber = randomIntFromInterval(1,50);
			}
			chosenNumbers.push(newChosenNumber);
		}
		chosenNumberSets.push(chosenNumbers);
	}

	//compare chosen numbers and jackpot number, check for 3/4/5/6 cases 
	const bonusNumber = jackpotNumbers[7];
	const jackpotNumbersWithoutBonus = jackpotNumbers.slice(0,7);
	for (let numbers of chosenNumberSets) {
		let numbersWon = [];
		let numbersWonAmt = 0;
		let isBonusWon = false;
		for(let number of numbers) {
			if (number === bonusNumber) {
				isBonusWon = true;
			} 
			if (jackpotNumbersWithoutBonus.includes(number)) {
				numbersWon.push(number);
				numbersWonAmt += 1;
			}
		}
		let criteria = '';
		if (numbersWonAmt == 7) {
			console.log("WTF!!!");
			console.log(jackpotNumbersWithoutBonus);
			console.log(numbers);
			criteria = '7';
			prizeMoney += lottoMaxPrizeList[criteria];
		}
		else if (numbersWonAmt >= 4 && numbersWonAmt <= 6) {
			criteria = isBonusWon ? numbersWonAmt.toString().concat('b') : numbersWonAmt.toString();
			prizeMoney += lottoMaxPrizeList[criteria];
			//console.log("So lucky! You matched " + criteria + " numbers and won " + lottoMaxPrizeList[criteria]);
		}
		//handle free play
		else if (numbersWonAmt == 3) {
			if (isBonusWon) {
				criteria = '3b';
				prizeMoney += lottoMaxPrizeList[criteria];
			}
			else {
				criteria = '3';
				prizeMoney += performDraw();
			}
		}
		//increment win count if something is won
		if (criteria.length != 0) {
			lottoMaxWinsCount[criteria] += 1;
		}
	}
	return prizeMoney;
}

document.getElementById("submit").onclick = function updateProps() {
	// initialize values
	lottetyType = document.getElementById("lottery-selection").value;
	lotteryJackpotAmt = document.getElementById("jackpot-amount").value*1000000;
	lotteryWager = document.getElementById("wager").value;
	numberToPlay = lotteryWager/ticketPrice;
	prizeMoneyAccumulated = 0;
	poolsFund = 1.45*lotteryJackpotAmt;
	breakdownWindow.innerHTML = '';
	lottoMaxWinsCount = {
		'7': 0,
		'6b':0,
		'6':0,
		'5b':0,
		'5':0,
		'4b':0,
		'4':0,
		'3b':0,
		'3':0
	};
	lottoMaxPrizeList = {
		/*'7': lotteryJackpotAmt,
		'6b':poolsFund*0.025/1.2,
		'6':poolsFund*0.025/66.6,
		'5b':poolsFund*0.015/176,
		'5':poolsFund*0.035/3654.5,
		'4b':poolsFund*0.0275/5914.5,
		'4':20,
		'3b':20*/
		'7': lotteryJackpotAmt,
		'6b':poolsFund*0.025/3,
		'6':poolsFund*0.025/166.5,
		'5b':poolsFund*0.015/440,
		'5':poolsFund*0.035/9136.25,
		'4b':poolsFund*0.0275/14786.25,
		'4':20,
		'3b':20
	};

	// play lottery until you run out of wager
	let count = 0;
	while (count < numberToPlay) {
		prizeMoneyAccumulated += performDraw();
		count+=1;	
	}

	// switch display 
	primaryScreen.style.zindex = "-1";
	primaryScreen.classList.remove("fadeIn");
	primaryScreen.classList.add("fadeOut");

	secondaryScreen.style.zIndex = "1";
	secondaryScreen.classList.add("fadeIn");
	secondaryScreen.classList.remove("fadeOut");

	//print result
	resultParagraph.innerHTML = 'You have won <b style="color:forestgreen;">$' + roundToDigit(prizeMoneyAccumulated,0) + '</b> with your wager of <b style="color:red;">$' + lotteryWager + "</b>.";
	avgGainParagraph.innerHTML = 'For each $ spent, you earned <b style="color:forestgreen;">$' + roundToDigit(prizeMoneyAccumulated/lotteryWager, 2) + 
	'</b> dollar(s). You had <b style="color:' + (prizeMoneyAccumulated/lotteryWager > 0.5 ? 'forestgreen;">better' : 'red;">worse') + "</b> odds than average, considering lottery's 50% average RTP."
	
	//populate breakdown list
	let winCriteria = Object.keys(lottoMaxWinsCount).sort();
	for (keys of winCriteria) {
		list =  document.createElement('p');
		let totalPrize = (keys === '3') ? "FREE PLAY" : roundToDigit(lottoMaxPrizeList[keys] * lottoMaxWinsCount[keys],0);
		list.innerHTML = '<b style="color:darkslategray;">' + keys + "</b> matches : " + lottoMaxWinsCount[keys] + " (Total Prize: $" + totalPrize + ")";
		breakdownWindow.appendChild(list);
	}

}


document.getElementById("replay").onclick = function playAgain() {

	//switch display
	primaryScreen.style.zindex = "1";
	primaryScreen.classList.add("fadeIn");
	primaryScreen.classList.remove("fadeOut");

	secondaryScreen.style.zIndex = "-1";
	secondaryScreen.classList.add("fadeOut");
	secondaryScreen.classList.remove("fadeIn");
}
