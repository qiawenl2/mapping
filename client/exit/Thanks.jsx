import React, {component} from "react";

import { Centered } from "meteor/empirica:core";
import { Button, NonIdealState } from "@blueprintjs/core";



export default class Thanks extends React.Component {
  static stepName = "Thanks";
  render() {
    const { player, game } = this.props;
    //const submissionCode = "Submission code: " + player._id;
    const submissionCode = "If you are a new player, please click the "New Player" button in the upper right to enter your prolific ID and start your game. \n If you have finished the game, please click the button below to submit"
    

        //window.location.href = 'https://app.prolific.co/submissions/complete?cc=8CB8F904'; 
    return (

      <div className="game finished">

        <NonIdealState
          icon={"thumbs-up"}
          title={submissionCode}
		  description="Thank you for participating!"// " Please submit the above code to receive your final bonus!"
          //action={"what is an actions?"}
        />
                  <Button
                onClick={event =>  window.location.href= 'https://app.prolific.co/submissions/complete?cc=8CB8F904'}
    > Submit

    </Button>
      </div>
    );
  }
}
