const config = require('../config');
const EventEmitter = require('events');
const el = require('extra-life-api');

const events = Object.freeze({
  TEAM_INFO_UPDATED: Symbol(),
  ROSTER_CHANGE: Symbol(),
  MEMBER_DONATIONS: Symbol(),
  MEMBER_UPDATED: Symbol(),
  MEMBER_ADDED: Symbol()
});

const TEAM_ID = config.TEAM_ID;
const POLL_DELAY = config.asInt('POLL_DELAY', 60000);
const IS_DEBUG = config.asBool('DEBUG');
let pollCount = 0;
let pollTimeoutID = null;

const ROSTER = [];
const TEAM_MEMBERS = new Map();
const emitter = new EventEmitter();

const teamInfo = {
  totalRaisedAmount: 0,
  fundraisingGoal: 0,
  createdOn: new Date(),
  avatarImageURL: '',
  teamID: TEAM_ID,
  name: ''
};

const emit = (eventId, data) => {
  emitter.emit(eventId, data);
  if(IS_DEBUG){
    let eventName = 'unknown';

    switch(eventId){
      case events.TEAM_INFO_UPDATED:
        eventName = 'Team Info Updated';
        break;
      case events.ROSTER_CHANGE:
        eventName = 'Team Roster Changed';
        break;
      case events.MEMBER_ADDED:
        eventName = 'Team Member Added';
        break;
      case events.MEMBER_UPDATED:
        eventName = 'Member Info Updated';
        break;
      case events.MEMBER_DONATIONS:
        eventName = 'Member Donations Received';
        break;
    }
    console.log(new Date(), '[Monitor]', eventName, data);
  }
};


const processMemberDonations = (member) => {
  if(!member.donors || !(member.donors instanceof Array)){
    member.donors = [];
  }
  el.getUserDonations(member.participantID)
    .then(donors => {
      const newDonors = [];
      for(let idx = 0; idx < donors.donations.length; idx++){
        if(idx >= member.donors.length){
          newDonors.push(donors.donations[idx]);
          member.donors.push(donors.donations[idx]);
        }
      }
      if(newDonors.length){
        emit(events.MEMBER_DONATIONS, {
          name: member.displayName,
          donors: newDonors
        });
      }
    });
};

const processMemberData = (newRoster) => {
  newRoster.members.forEach(member => {
    if(TEAM_MEMBERS.has(member.participantID)){
      let memberChanges = false;
      let donationChanges = false;
      const og = TEAM_MEMBERS.get(member.participantID);

      if(member.displayName !== og.displayName){
        memberChanges = true;
        og.displayName = member.displayName;
      }

      if(member.avatarImageURL !== og.avatarImageURL){
        memberChanges = true;
        og.avatarImageURL = member.avatarImageURL;
      }

      if(member.sumDonations !== og.raised){
        memberChanges = true;
        donationChanges = true;
        og.raised = member.sumDonations;
      }

      if(member.donations !== og.donations){
        memberChanges = true;
        donationChanges = true;
        og.donations = member.donations;
      }

      if(memberChanges){
        emit(events.MEMBER_UPDATED, og);
      }
      if(donationChanges){
        processMemberDonations(og);
      }
    } else {
      member.donors = [];
      TEAM_MEMBERS.set(member.participantID, member);
      emit(events.MEMBER_ADDED, member);
      processMemberDonations(member);
    }
  });
};

/**
 * Checks the team roster and issues updates if the roster has changed,
 * then processes each member.
 * @param {*} newRoster 
 */
const processRosterChanges = (newRoster) => {
  let hasChanges = false;
  newRoster.members.forEach(member => {
    if(!ROSTER.filter(r => r.participantID === member.participantID).length){
      ROSTER.push(member);
      hasChanges = true;
    }
  });
  if(hasChanges){
    emit(events.ROSTER_CHANGE, [...ROSTER]);
  }
  processMemberData(newRoster);
};

/**
 * Requests the team's roster, and processes roster changes / member data updates
 */
const requestTeamRoster = () => {
  return el.getTeamRoster(TEAM_ID)
    .then(roster => {
      if(roster.length !== ROSTER.length){
        processRosterChanges(roster);
      } else {
        processMemberData(roster);
      }
    });
};

/**
 * Requests the configured Team's basic info, and raises an event if it has changed
 * @returns {Promise<boolean>} A promise that resolves with true if the team had changes
 */
const requestTeamInfo = () => {
  return el.getTeamInfo(TEAM_ID)
    .then(ti => {
      let hasChanges = false;

      if(teamInfo.avatarImageURL !== ti.avatarImageURL){
        teamInfo.avatarImageURL = ti.avatarImageURL;
        hasChanges = true;
      }
      if(teamInfo.createdOn !== ti.createdOn){
        teamInfo.createdOn = ti.createdOn;
        hasChanges = true;
      }
      if(teamInfo.name !== ti.name){
        teamInfo.name = ti.name;
        hasChanges = true;
      }
      if(teamInfo.fundraisingGoal !== ti.fundraisingGoal){
        teamInfo.fundraisingGoal = ti.fundraisingGoal
        hasChanges = true;
      }
      if(teamInfo.totalRaisedAmount != ti.sumDonations){
        teamInfo.totalRaisedAmount = ti.sumDonations;
        hasChanges = true;
      }

      if(hasChanges){
        emit(events.TEAM_INFO_UPDATED, teamInfo);
      }
      return hasChanges;
    });
};

const poll = () => {
  if(IS_DEBUG){
    console.log(new Date(), '[Monitor] polling fired');
  }
  //check the pollcount to see if we should get the team info
  //or just get the team roster
  if(pollCount % 10 === 0){
    pollCount = 0;
    requestTeamInfo()
      .then(requestTeamRoster);
  } else {
    requestTeamRoster();
  }

  //increment the pollcount
  pollCount++;

  // when it's all done, schedule another poll
  pollTimeoutID = setTimeout(poll, POLL_DELAY);
};

const startPolling = () => {
  if(pollTimeoutID == null){
    poll();
  } else {
    console.warn('Polling is already running');
  }
};

const stopPolling = () => {
  if(pollTimeoutID != null){
    clearTimeout(pollTimeoutID);
    pollTimeoutID = null;
  }
};

module.exports = {
  getTeamInfo: () => { return teamInfo; },
  getMemberInfo: (participantID) => { return TEAM_MEMBERS.get(participantID); },
  getRoster: () => { return [...ROSTER]; },
  events: events,
  emitter: emitter,
  startPolling: startPolling,
  stopPolling: stopPolling
};