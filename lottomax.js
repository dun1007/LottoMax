let LOTTO_MAX_CHANCE_LIST = {
	'7':1/33294800,
	'6b':1/4756400,
	'6':1/113248,
	'5b':1/37749,
	'5':1/1841,
	'4b':1/1105,
	'4':1/82.9,
	'3b':1/82.9,
	'3':1/8.5
};

let LOTTO_MAX_PRIZE_LIST = {
	'7':lottery_jackpot_amt,
	'6b':lottery_jackpot_amt*0.025,
	'6':lottery_jackpot_amt*0.025,
	'5b':lottery_jackpot_amt*0.015,
	'5':lottery_jackpot_amt*0.035,
	'4b':lottery_jackpot_amt*0.0275,
	'4':20,
	'3b':20,
	'3':5
};

export LOTTO_MAX_CHANCE_LIST, LOTTO_MAX_PRIZE_LIST;