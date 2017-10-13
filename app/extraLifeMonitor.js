const EventEmitter = require('events');
const el = require('./extraLifeApi');

const eventNames = Object.freeze({
  ROSTER_CHANGE: Symbol(),
  MEMBER_DONATIONS: Symbol(),
  NO_ROSTER_CHANGES: Symbol(),
  TEAM_UPDATED: Symbol()
});

const emitter = new EventEmitter();

const TEAM_ID = 34850;
const POLL_DELAY = 60000;

const ROSTER = [];
const TEAM_MEMBERS = new Map();

const teamInfo = {
  totalRaisedAmount: 0,
  fundraisingGoal: 0,
  createdOn: new Date(),
  avatarImageURL: '',
  teamID: TEAM_ID,
  name: ''
};

let teamUpdateTimeout = null;

const requestMemberDonations = (participantID) => {

};

const processMemberData = (newRoster) => {
  let hasChanges = false;
  newRoster.forEach(member => {
    if(TEAM_MEMBERS.has(member.participantID)){
      let memberChanges = false;
      const om = TEAM_MEMBERS.get(member.participantID);
      if(member.displayName !== om.displayName){
        memberChanges = true;
      }

      if(memberChanges){
        hasChanges |= memberChanges;
        processMember(member.participantID);
      }
    } else {
      member.donations = [];
      TEAM_MEMBERS.set(member.participantID, member);
    }
  });
  if(!hasChanges){
    emitter.emit(eventNames.NO_ROSTER_CHANGES);
  }
};

const processRosterChanges = (newRoster) => {
  let hasChanges = false;
  newRoster.forEach(member => {
    if(!ROSTER.filter(r => r.participantID === member.participantID).length){
      ROSTER.push(member);
      hasChanges = true;
    }
  });
  if(hasChanges){
    emitter.emit(eventNames.ROSTER_CHANGE, [...ROSTER]);
  }
  processMemberData(newRoster);
};

const requestTeamRoster = () => {
  return el.getTeamRoster(TEAM_ID)
    .then(roster => {
      if(roster.length !== ROSTER.length){
        processRosterChanges(roster);
      } else {
        processMemberData(roster);
      }
    }).then(() => {
      teamUpdateTimeout = setTimeout(() => {
        clearTimeout(teamUpdateTimeout);
        teamUpdateTimeout = null;
      }, POLL_DELAY);
    });
};

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
      if(teamInfo.totalRaisedAmount != ti.totalRaisedAmount){
        teamInfo.totalRaisedAmount = ti.totalRaisedAmount;
        hasChanges = true;
      }

      if(hasChanges){
        emitter.emit(eventNames.TEAM_UPDATED, teamInfo);
      }
      return hasChanges;
    });
};

module.exports = {
  getTeamInfo: () => { return teamInfo; },
  getMemberInfo: (participantID) => { return TEAM_MEMBERS.get(participantID); },
  getRoster: () => { return [...ROSTER]; },
  events: eventNames,
  emitter: emitter
};