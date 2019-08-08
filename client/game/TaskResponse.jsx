import React from "react";
import {
  Button,
  Callout,
  FormGroup,
  Label,
  EditableText
} from "@blueprintjs/core";

export default class TaskResponse extends React.Component {
  constructor(props) {
    super(props);

    // console.log("player.round._id", this.props.player.round._id);

  }

  handleEditTextConceptChange = str => {
    const { round, player } = this.props;
	player.round.set("set_concept", str);
	round.set("concept", str);

  };

  handleEditTextConceptRelease = str => {
	const { round, player } = this.props;
	player.round.set("set_concept", str);
	round.set("concept", str);
  };

   handleEditTextChange1 = str => {
	const { round, stage, player } = this.props;

    if (stage.displayName !== "Round outcome") {
	  if(stage.displayName === "Guess concept")
		  player.round.set("guess_concept", str);
	  if(stage.displayName === "Check concept")
		  round.set("judgment",str);
	  else
	  {
		  player.round.set("question",str);
		  player.stage.set("stage_question", str);
		//   console.log(player.stage.get("stage_question",str));
		//   round.set("record",round.get("record") + "Guesser: if it is a " + player.stage.get("stage_question") + ", what would it be?");
	  }
	}
  };

  handleEditTextRelease1 = str => {
    const { stage, player } = this.props;
    if (stage.displayName !== "Round outcome") {
	  if(stage.displayName === "Guess concept")
		  player.round.set("guess_concept", str);
	  if(stage.displayName === "Check concept")
		  player.round.set("judgment",str)
	  else
	  {
		  player.round.set("question",str);
		  player.stage.set("stage_question", str);
		//   round.set("record",round.get("record") + "if it is a " + player.stage.get("stage_question") + "what would it be?")

	  }
	}
  };

     handleEditTextChange0 = str => {
    const { round, stage, player } = this.props;
    if (stage.displayName !== "Round outcome") {
	  if(stage.displayName === "Guess concept")
		  player.round.set("guess_concept", str);
	  if(stage.displayName === "Check concept")
		  round.set("judgment",str);
	  else
	  {
		  player.round.set("answer",str);
		  player.stage.set("stage_answer", str);
	  }
	}
  };

  handleEditTextRelease0 = str => {
    const { stage, player } = this.props;
    if (stage.displayName !== "Round outcome") {
	  if(stage.displayName === "Guess concept")
		  player.round.set("guess_concept", str);
	  if(stage.displayName === "Check concept")
		  player.round.set("judgment",str)
	  else
	  {
		  player.round.set("answer",str);
		  player.stage.set("stage_answer", str);
	  }
	}
  };
  handleEditTextCategoryChange = str => {
    const { player, round } = this.props;
	player.round.set("category", str);
	round.set("category", str);
	round.set("record", "The guesser is thinking about a particular " + str + "\n");

  };

  handleEditTextCategoryRelease = str => {
	const { player, round } = this.props;
	player.round.set("category", str);
	round.set("category", str);
	round.set("record", "The guesser is thinking about a particular " + str)

  };

  handleSubmit = event => {
	const {player,stage, game, round} = this.props;
	const isOutcome = stage.displayName === "Round Outcome" ;
	const isSetConcept = stage.name === "Set concept";
	const isGuess = stage.displayName === "Guess concept";		
	const isAnswer = stage.displayName.includes("Answer");
	const isQuestion = stage.displayName.includes("Question");
	const isCheckconcept = stage.displayName === "Check concept"; 
	event.preventDefault();
	
	if (0 === player.get("p_id") && isSetConcept || isAnswer || isOutcome || isCheckconcept)
	{
		game.players.forEach(player => {
			player.stage.submit();
	});
		isAnswer? round.set("record",round.get("record") + "\nThinker: it would be " + player.stage.get("stage_answer") + "\n"):null;
		isCheckconcept? round.set("record", round.get("record")+ "\nThe thinker is thinking about " + player.round.get("set_concept")+"\n The guesser is " + round.get("judgment")):null;

}
	else if(1 === player.get("p_id") && isQuestion || isGuess || isOutcome)
	{
		game.players.forEach(player => {
			player.stage.submit();
	});
	  
		isQuestion? round.set("record",round.get("record") + "\nGuesser: if it is " + player.stage.get("stage_question") + ", what would it be?"):null;
		isGuess? round.set("record",round.get("record")+"\nThe Guesser thinks the concept is " + player.round.get("guess_concept")):null;

	}
    // this.props.player.stage.submit();
  };

  renderSubmitted = () => {
    return (
      <div className={"task-response"}>
        <Callout
          className={"call-out"}
          title={"Waiting on your partner..."}
          icon={"automatic-updates"}
        >
          Please wait until all players are ready
        </Callout>
      </div>
    );
  };


  renderCurrentGuess = (player) => {
	  if (0 === player.get("p_id")) 
		{
			return (
				
			<Label>
				it would be :{/*player.round.get("question")*/}
			</Label>

			);
		}
		else
		{
			return (
			<Label>
				What would it be, if it is: {/*player.round.get("question")*/}
				
			</Label>
			);
		}
    
  };

    renderCurrentCategory = (player) => {
	  if(0 === player.get("p_id"))
		{
			return (

				<Label>
					what is the category of concept (e.g. City, animal, etc.): {/*player.round.get("category")*/}
				</Label>
			);
		}
  };

  renderCurrentChoice = (player) => {
	  if (0 === player.get("p_id"))
	  {
		  return(

			<Label>
				The concept you are thinking about is: {/*player.round.get("set_concept")*/}
			</Label>
		  );
	  }
  };

  renderMoveon = ()=> {
	  return(

		<Label>
			Your partner is typing. Click "Submit" whenever you are ready to move on...
		</Label>
	  );
  };

  renderJudgement(player){
	  const { stage } = this.props;
	  const isGuess = stage.displayName === "Guess concept";
	  const isCheckconcept = stage.displayName === "Check concept";

	  if(0 === player.get("p_id") && isCheckconcept)
	  {
		  return(
			  <Label>
				  is it correct? please type "correct" or "incorrect":{/*player.round.set("judgment")*/}
			  </Label>
		  );	  
	  }
	  else if(1 === player.get("p_id") && isGuess)
	  {
		  return(
		  <Label>
			  please make a guess :{/*player.round.get("guess_concept")*/}
		  </Label>
		  );
	  }
  };

  renderEditableTextConceptCatalog(round, stage, isOutcome) {

	const isSetConcept = stage.name === "Set concept" ;

    return (
      <FormGroup>
        {isOutcome? (
          <EditableText
		    onChange={this.handleEditTextConceptChange}
            onRelease={this.handleEditTextConceptRelease}
            value={round.get("concept")}
            disabled={!isSetConcept}
			hideHandleOnEmpty
          />
		):
		(
          <EditableText
		    onChange={this.handleEditTextConceptChange}
            onRelease={this.handleEditTextConceptRelease}
            value={round.get("concept")}
            disabled={!isSetConcept}
            hideHandleOnEmpty
          />
		)}
      </FormGroup>
    );
  }


  renderEditableText(player, stage) {

	const isSetConcept = stage.name === "Set concept" ;
	const isQuestion = stage.displayName.includes("Question")  //=== "Question Phases1" || stage.displayName === "Question Phases2" || stage.displayName === "Question Phases3";

    return (
      <FormGroup>
        {isSetConcept ? (
          <EditableText
		    onChange={this.handleEditTextCategoryChange}
            onRelease={this.handleEditTextCategoryRelease}
            value={player.round.get("category")}
            disabled={isQuestion}
            hideHandleOnEmpty
          />
		):
		(
          <EditableText
		    onChange={this.handleEditTextChange0}
            onRelease={this.handleEditTextRelease0}
            value={player.round.get("answer")}
            disabled={isQuestion}
            hideHandleOnEmpty
          />
		)}
      </FormGroup>
    );
  }

  renderEditableText_player1(stage, isOutcome) {
	const isSetConcept = stage.name === "Set concept" ;
	//const isAnswer = stage.displayName === "Answer Phases1" || stage.displayName === "Answer Phases2" || stage.displayName === "Answer Phases3";
	const isAnswer = stage.displayName.includes("Answer");
	const isCheckconcept = stage.displayName === "Check concept";
	return (
      <FormGroup>
        {isOutcome ? (
          <EditableText
		    onChange={this.handleEditTextChange1}
            onRelease={this.handleEditTextRelease1}
            value={player.round.get("question")}
            disabled={isOutcome || isSetConcept || isAnswer || isCheckconcept}
            hideHandleOnEmpty
          />
		):
		(
          <EditableText
		    onChange={this.handleEditTextChange1}
            onRelease={this.handleEditTextRelease1}
            value={player.round.get("question")}
            disabled={isOutcome || isSetConcept || isAnswer || isCheckconcept}
            hideHandleOnEmpty
          />
		)}
      </FormGroup>
    );
  }


  render() {
    const { stage, round, player } = this.props;
    //todo: add this back after the experiment
	
    //if the player already submitted, don't show the slider or submit button
    if (player.stage.submitted) {
      return this.renderSubmitted();
    }
    
	const isOutcome = stage.displayName === "Round Outcome" ;
	const isSetConcept = stage.name === "Set concept";
	//const isAnswer = stage.displayName === "Answer Phases1" || stage.displayName === "Answer Phases2" || stage.displayName === "Answer Phases3";
	const isGuess = stage.displayName === "Guess concept";		
	const isAnswer = stage.displayName.includes("Answer");
	const isQuestion = stage.displayName.includes("Question");
	const isCheckconcept = stage.displayName === "Check concept";

	// const feedbackTime = round.get("displayFeedback");
	// const selfFeedback = game.treatment.selfFeedback;
	

	if(0 === player.get("p_id")){
		return (
		<div className="task-response">
			<form onSubmit={this.handleSubmit}>
			
			<FormGroup>
				{!isOutcome ? this.renderCurrentChoice(player) : null}
				{!isOutcome ? this.renderEditableTextConceptCatalog(round, stage, isOutcome) :null}
			</FormGroup>

			<FormGroup>
			 	{isSetConcept ? this.renderCurrentCategory(player) : null}
			 	{isSetConcept ? this.renderEditableText(player, stage):null}
			</FormGroup>

			<FormGroup>
				{isAnswer ? this.renderCurrentGuess(player) : null}
				{isAnswer ? this.renderEditableText(player, stage):null}
			</FormGroup>



			{/* <FormGroup>
				{isQuestion ||isGuess ? this.renderMoveon(round, player) : null}
			</FormGroup> */}

			{/*We only show self feedback if it is feedback time & we show individual feedback & it is outcome*/}
			{isCheckconcept
				? this.renderJudgement(player)
				: null}
			{isCheckconcept
				? this.renderEditableText(player, stage)
				: null}

			{/* <FormGroup>
				<Button type="submit" icon={"tick"} large={true} fill={true}>
				{isOutcome ? "Next" : "Submit"}
				</Button>
			</FormGroup> */}
			<FormGroup>
        		{isSetConcept || isAnswer || isCheckconcept || isOutcome? (
          		<Button type = "submit" icon={"tick"} large={true} fill={true}>
		  		{isOutcome ? "Next": "Submit"}
		  		</Button>
				):
				(<div><i>your partner is typing, please wait...</i></div>
		     )}
      		</FormGroup>
			</form>
		</div>
		);
	}
	else
	{
		return (
		<div className="task-response">
			<form onSubmit={this.handleSubmit}>

			<FormGroup>
				{isQuestion ? this.renderCurrentGuess(player) : null}
				{isQuestion ? this.renderEditableText_player1(stage, isOutcome):null}
			</FormGroup>

 			{/* <FormGroup>
 				{isSetConcept ||isAnswer ||isCheckconcept ? this.renderMoveon(round, player) : null}
 			</FormGroup> */}

			{/*We only show self feedback if it is feedback time & we show individual feedback & it is outcome*/}
			{isGuess?
				this.renderJudgement(player)
				: null}
			{isGuess?
				this.renderEditableText_player1(stage, isOutcome):null}
 				
			{/* {isOutcome?
				this.renderFeedback(player,round):null}  */}
			<FormGroup>
        		{isQuestion || isGuess || isOutcome? (
          		<Button type = "submit" icon={"tick"} large={true} fill={true}>
		  		{isOutcome ? "Next": "Submit"}
		  		</Button>
				):
				(<div><i>your partner is typing, please wait...</i></div>
		     )}
      		</FormGroup>

			{/* <FormGroup>
				<Button type="submit" icon={"tick"} large={true} fill={true}>
				{isOutcome ? "Next" : "Submit"}
				</Button>
			</FormGroup> */}
			</form>
		</div>
		);
	}
  }
}