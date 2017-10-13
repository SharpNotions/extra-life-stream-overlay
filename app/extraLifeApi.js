const request = require('request');

function doRequest(uri){
  return new Promise((accept, reject) => {
    request.get({ uri: uri, json:true}, (err, response, body) => {
      if(err){
        reject(err);
      } else {
        accept(body);
      }
    });
  }).then(x => {
    if(x instanceof Array){
      x.forEach(y => y.createdOn = new Date(y.createdOn));
    } else if (x && x.createdOn){
      x.createdOn = new Date(x.createdOn);
    }
    return x;
  });
}

/**
 * @typedef ParticipantProfile
 * @prop {string} displayName - the participant's display name
 * @prop {number} totalRaisedAmount - the amount raised by this participant
 * @prop {number} fundraisingGoal - the amount the participant aims to raise
 * @prop {number} participantID - the participant's system ID
 * @prop {string} createdOn - the date the participant's account was created
 * @prop {string} avatarImageURL - the URI location of the participant's avatar
 * @prop {number} teamID - the participant's team
 * @prop {boolean} isTeamCaptain - if true, the participant is their team's captain
 */

/**
 * @typedef Donation
 * @prop {string} message - (or null) the message with the donation
 * @prop {string} createdOn - javascript date when the donation was made
 * @prop {string} donorName - (or null) the name of the donor
 * @prop {string} avatarImageURL - the URI location of the donor's avatar
 * @prop {number} donationAmount - the amount donated
 */

/**
 * @typedef TeamInfo
 * @prop {number} totalRaisedAmount - the total raised by the team
 * @prop {number} fundraisingGoal - the team's fundraising goal
 * @prop {string} createdOn - a javascript Date indicating when the team was created
 * @prop {string} avatarImageURL - the URI location of the team's avatar image
 * @prop {number} teamID - the team's id
 * @prop {string} name - the team's name
 */

/**
 * @typedef TeamMember
 * @prop {string} displayName - the team member's display name
 * @prop {number} participantID - the team member's participant ID
 * @prop {string} createdOn - a javascript Date incidating when the user's account was created
 * @prop {string} avatarImageURL - the URI location of the user's avatar image
 * @prop {boolean} isTeamCaptain - indicates if the member is the team captain
 */


/**
 * Retrieve's the participant's profile information.
 * @param {*} participantId - the identifier of the participant to lookup
 * @returns {Promise<ParticipantProfile>}
 */
function getParticipantProfile(participantId){
  let url = `https://www.extra-life.org/index.cfm?fuseaction=donorDrive.participant&participantID=${participantId}&format=json`;
  return doRequest(url);
}

/**
 * Gets the participant's donations
 * @param {*} participantId 
 * @returns {Promise<Donation[]>}
 */
function getParticipantDonations(participantId){
  let url = `https://www.extra-life.org/index.cfm?fuseaction=donordrive.participantDonations&participantID=${participantId}&format=json`
  return doRequest(url);
}

/**
 * Gets the team info
 * @param {*} teamId 
 * @returns {Promise<TeamInfo>}
 */
function getTeamInfo(teamId){
  let url = `https://www.extra-life.org/index.cfm?fuseaction=donordrive.team&teamID=${teamId}&format=json`;
  return doRequest(url);
}

/**
 * Retrieves the team's roster: an array of objects (displayName, partidipantId, createdOn, avatarImageURL, isTeamCaptain)
 * @param {*} teamId - the indentifier of the team to lookup
 * @returns {Promise<TeamMember[]>}
 */
function getTeamRoster(teamId){
  let url = `https://www.extra-life.org/index.cfm?fuseaction=donordrive.teamParticipants&teamID=${teamId}&format=json`;
  return doRequest(url);
}

module.exports = {
  getParticipantProfile: getParticipantProfile,
  getParticipantDonations: getParticipantDonations,
  getTeamInfo: getTeamInfo,
  getTeamRoster: getTeamRoster
};