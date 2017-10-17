const config = require('../config');
const fs = require('fs');
const cheerio = require('cheerio');
const request = require('request');

const LIVE = config.asBool('LIVE');

const participantIdExpression = /participantID=(\d+)/;

const getParticipantId = (txt) => {
  const result = participantIdExpression.exec(txt);
  if(result && result.length && result[1]){
    const num = parseInt(result[1]);
    return isNaN(num) ? -1 : num;
  } else {
    return -1;
  }
};

const getParticipantName = (txt) => {
  return (txt || '')
    .replace('Team Captain', '')
    .replace(/\s+/gm, ' ').trim();
};

const getDonationAmount = (amount) => {
  const match = /\$(\d+\.\d+)/.exec(amount);
  if(match && match.length > 1){
    const num = parseFloat(match[1]);
    if(isNaN(num)){
      return 0;
    }
    return num;
  } else {
    return 0;
  }
};

const getDonationCount = (count) => {
  const num = parseInt(count);
  return isNaN(num) ? 0 : num;
};

const isTeamCaptain = (rawName, memberName) => {
  return rawName.replace(memberName, '').indexOf('Team Captain') >= 0;
};

const parseRoster = (body) => {
  const resultRoster = [];

  const $ = cheerio.load(body, {
    decodeEntities: true,
    lowerCaseAttributeNames: true,
    lowerCaseTags: true,
    normalizeWhitespace: true,
    recognizeSelfClosing: true
  });

  $('table#team a').map((memberIndex, memberElement) => {
    const $el = $(memberElement);
    const memberId = getParticipantId($el.attr('href'));
    if(memberId >= 0){
      const memberAvater = $el.find('img.member-avatar').attr('src');
      const textBlocks = $el.children('span.pull-left').eq(1);
      const memberName = textBlocks.children('strong').text();
      const raisedAmount = textBlocks.children('div.gray').children().first().find('small>strong').text();
      const numDonations = textBlocks.children('div.gray').children().last().find('small>strong').text();

      const result = {
        participantID: memberId,
        avatarImageURL: memberAvater,
        displayName: getParticipantName(memberName),
        raised: getDonationAmount(raisedAmount),
        donations: getDonationCount(numDonations)
      }
      result.isTeamCaptain = isTeamCaptain(memberName, result.name);
      resultRoster.push(result);
    } else {
      return null;
    }
  });

  return resultRoster;
};


const getRoster = () => {
  return new Promise((resolve, reject) => {
    if(LIVE){
      request.get(`https://www.extra-life.org/index.cfm?fuseaction=donordrive.teamParticipants&teamID=${config.TEAM_ID}`, (err, request, body) => {
        if(err){
          reject(err);
        }
        const result = parseRoster(body);
        resolve(result);
      });
    } else {
      const filename = require.resolve('../../samples/roster.html');
      const contents = fs.readFileSync(filename, { encoding: 'utf8' });
      const result = parseRoster(contents);
      resolve(result);
    }
  });
};

module.exports = {
  getRoster
};