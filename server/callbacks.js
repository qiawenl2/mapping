import Empirica from "meteor/empirica:core";

// onGameStart is triggered once per game before the game starts, and before
// the first onRoundStart. It receives the game and list of all the players in
// the game.
Empirica.onGameStart(game => {
  game.set("justStarted", true); // I use this to play the sound on the UI when the game starts
  game.players.forEach((player,i) => {
      player.set("p_id", i)
  });
  console.log("game", game._id, "started");
});

// onRoundStart is triggered before each round starts, and before onStageStart.
// It receives the same options as onGameStart, and the round that is starting.
Empirica.onRoundStart((game, round) => {
  console.log("round", round.index, "started");
  round.set("round_score", 0);
  round.set("judgment", null);
  round.set("category", null);
  round.set("record",null);

  game.players.forEach((player, i) => {
      if (0 === player.get("p_id")){
          player.set("p_id",1)
      }
      else{
          player.set("p_id",0)
      }
    player.round.set("alterIds", player.get("alterIds"));
	player.round.set("guess", null);
	player.round.set("choice", null);

	if(i === 0)
		player.round.set("interact_des", "What would it be, if it is...");
	else
		player.round.set("interact_des", "it would be...");

	player.round.set("last_stage_question", null);
	player.round.set("last_stage_answer", null);
	player.round.set("question", null);
	player.round.set("set_concept", null);
	player.round.set("guess_concept", null);
	// player.round.set("category",null);
	player.round.set("difficulty", player.get("difficulty"));
  });

  const feedbackTime =
    game.treatment.feedbackRate > 0 &&
    (round.index + 1) %
      Math.round(
        game.treatment.nRounds /
          (game.treatment.feedbackRate * game.treatment.nRounds)
      ) ===
      0;
  round.set("displayFeedback", feedbackTime);
  console.log("display feedback at round", round.index, "?", feedbackTime);
});

// onRoundStart is triggered before each stage starts.
// It receives the same options as onRoundStart, and the stage that is starting.
Empirica.onStageStart((game, round, stage) => {
  console.log("stage", stage.name, "started");
//   console.log("category", round.get("category"));
	console.log("record",round.get("record"))


  game.players.forEach((player) => {
   		player.stage.set("stage_question", player.round.get("last_stage_question"));
   		player.stage.set("stage_answer", player.round.get("last_stage_answer"));
   });
});

// It receives the same options as onRoundEnd, and the stage that just ended.
Empirica.onStageEnd((game, round, stage, player) => {
	console.log("stage", stage.name, "ended");
	// console.log("category", round.get("category"));

	game.players.forEach((player) => {
		   player.round.set("last_stage_question", player.stage.get("stage_question"));
		   player.round.set("last_stage_answer", player.stage.get("stage_answer"));
   });
	const category = "The thinker is thinking about a particular " + round.get("category");
	// const question = "Guesser: what would it be, if it is" + player.stage.get("last_stage_question");
	// const answer = "Thinker: " + player.stage.get("last_stage_answer");
	console.log(category)
	console.log("record",round.get("record"))

   
	// if(stage.name.includes("outcome")) {
		//after the 'interactive' stage, we compute the score and color it
		// computeScore(game.players, round);
		// if (game.treatment.altersCount > 0 && round.get("displayFeedback")) {
		// 	colorScores(game.players);
    	// }
  	// }
});

// onRoundEnd is triggered after each round.
// It receives the same options as onGameEnd, and the round that just ended.
Empirica.onRoundEnd((game, round) => {
  console.log("category", round.get("category"));
  console.log("round", round.index, "ended");


  // compute this round score for the players
  computeScore(round);

  game.players.forEach(player => {
    const currentScore = player.get("cumulativeScore");
    const roundScore = round.get("round_score");
	// const cumScore = Math.round((currentScore + roundScore) * 10) / 10;
	const cumScore = currentScore + roundScore;
    player.set("cumulativeScore", cumScore);
  });

  //checking whether the game contains shock and whether it is time for it!
  //currentRoundNumber % nRounds/shockRate * nRounds => whether it is time!
  const shockTime =
    game.treatment.shockRate > 0 &&
    (round.index + 1) %
      Math.round(
        game.treatment.nRounds /
          (game.treatment.shockRate * game.treatment.nRounds)
      ) ===
      0;
  //if it is time for a shock to arrive, then shock the players
  // i.e., change the difficulty of the task for them.
  shockTime ? shock(game.players) : null;
  console.log("round:", round.index, ", is it shock time?", shockTime);
});

// onRoundEnd is triggered when the game ends.
// It receives the same options as onGameStart.
Empirica.onGameEnd(game => {
  console.log("The game", game._id, "has ended");
  const conversionRate = game.treatment.conversionRate || 1;
  game.players.forEach(player => {
    const bonus =
      Math.round(player.get("cumulativeScore") * conversionRate * 100) / 100;
    player.set("bonus", bonus);
  });
});


function computeScore(round){
	
	const judge = round.get("judgment");
	console.log("judge: ", judge);
	console.log("round_score: ", round.get("round_score"));
	
	if (judge === "correct"){	
		round.set("round_score", 10); 
	} 
	else if (judge === "incorrect"){
		round.set("round_score",0);		
	}
};

// We sort the players based on their score in this round in order to color code
// how we display their scores.
// The highest 1/3 players are green, the lowest 1/3 are red, and the rest are orange.
// function colorScores(players) {
//   const sortedPlayers = players.sort(compareScores);
//   const top3rd = Math.floor(players.length / 3);
//   const bottom3rd = Math.floor(players.length - players.length / 3);

//   sortedPlayers.forEach((player, i) => {
//     if (i < top3rd) {
//       player.round.set("scoreColor", "green");
//     } else if (i >= bottom3rd) {
//       player.round.set("scoreColor", "red");
//     } else {
//       player.round.set("scoreColor", "orange");
//     }
//   });
// }

// Helper function to sort players objects based on their score in the current round.
// function compareScores(firstPlayer, secondPlayer) {
//   const scoreA = firstPlayer.round.get("round_score");
//   const scoreB = secondPlayer.round.get("round_score");

//   let comparison = 0;
//   if (scoreA > scoreB) {
//     comparison = -1;
//   } else if (scoreA < scoreB) {
//     comparison = 1;
//   }
//   return comparison;
// }

// Shocking the players by changing the difficulty of the problem that they see
// -1 permutation: easy => hard; medium => easy; hard => medium.
function shock(players) {
  console.log("time for shock [inside shock(players]");
  players.forEach(player => {
    const currentDifficulty = player.get("difficulty");
    if (currentDifficulty === "easy") {
      player.set("difficulty", "hard");
    } else if (currentDifficulty === "medium") {
      player.set("difficulty", "easy");
    } else {
      player.set("difficulty", "medium");
    }
  });
}

// ===========================================================================
// => onSet, onAppend and onChanged ==========================================
// ===========================================================================

// onSet, onAppend and onChanged are called on every single update made by all
// players in each game, so they can rapidly become quite expensive and have
// the potential to slow down the app. Use wisely.
//
// It is very useful to be able to react to each update a user makes. Try
// nontheless to limit the amount of computations and database saves (.set)
// done in these callbacks. You can also try to limit the amount of calls to
// set() and append() you make (avoid calling them on a continuous drag of a
// slider for example) and inside these callbacks use the `key` argument at the
// very beginning of the callback to filter out which keys your need to run
// logic against.
//
// If you are not using these callbacks, comment them out so the system does
// not call them for nothing.

// // onSet is called when the experiment code call the .set() method
// // on games, rounds, stages, players, playerRounds or playerStages.
// Empirica.onSet((
//   game,
//   round,
//   stage,
//   players,
//   player, // Player who made the change
//   target, // Object on which the change was made (eg. player.set() => player)
//   targetType, // Type of object on which the change was made (eg. player.set() => "player")
//   key, // Key of changed value (e.g. player.set("score", 1) => "score")
//   value, // New value
//   prevValue // Previous value
// ) => {
//   // // Example filtering
//   // if (key !== "value") {
//   //   return;
//   // }
// });

// // onSet is called when the experiment code call the `.append()` method
// // on games, rounds, stages, players, playerRounds or playerStages.
// Empirica.onAppend((
//   game,
//   round,
//   stage,
//   players,
//   player, // Player who made the change
//   target, // Object on which the change was made (eg. player.set() => player)
//   targetType, // Type of object on which the change was made (eg. player.set() => "player")
//   key, // Key of changed value (e.g. player.set("score", 1) => "score")
//   value, // New value
//   prevValue // Previous value
// ) => {
//   // Note: `value` is the single last value (e.g 0.2), while `prevValue` will
//   //       be an array of the previsous valued (e.g. [0.3, 0.4, 0.65]).
// });

// // onChange is called when the experiment code call the `.set()` or the
// // `.append()` method on games, rounds, stages, players, playerRounds or
// // playerStages.
// Empirica.onChange((
//   game,
//   round,
//   stage,
//   players,
//   player, // Player who made the change
//   target, // Object on which the change was made (eg. player.set() => player)
//   targetType, // Type of object on which the change was made (eg. player.set() => "player")
//   key, // Key of changed value (e.g. player.set("score", 1) => "score")
//   value, // New value
//   prevValue, // Previous value
//   isAppend // True if the change was an append, false if it was a set
// ) => {
//   // `onChange` is useful to run server-side logic for any user interaction.
//   // Note the extra isAppend boolean that will allow to differenciate sets and
//   // appends.
// });