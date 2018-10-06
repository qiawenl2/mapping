import PropTypes from "prop-types";
import React from "react";

import Timer from "./Timer.jsx";

export default class PlayerProfile extends React.Component {
  renderProfile() {
    const { player } = this.props;
    return (
      <div className="profile-score">
        <h3>Your Profile</h3>
        <img src={player.get("avatar")} className="profile-avatar" />
      </div>
    );
  }

  renderScore() {
    const { player } = this.props;
    return (
      <div className="profile-score">
        <h4>Total score</h4>
        <span className="pt-icon-standard pt-icon-dollar" />
        <span>{player.get("cumulativeScore") || 0}</span>
      </div>
    );
  }

  render() {
    const { stage, round } = this.props;

    return (
      <aside className="pt-card player-profile">
        {this.renderProfile()}
        {/*We always show individual level feedback*/}
        {this.renderScore()}
        <Timer stage={stage} />
      </aside>
    );
  }
}
