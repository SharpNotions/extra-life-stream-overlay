const fs = require('fs');
const htmlparser = require("htmlparser2");
const request = require('request');
const { NodeTree } = require('./domLite');

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

const targetElements = [
  'table#team a.block[href]',
  'table#team a.block[href] small>strong'
];

const parseRequest = (body) => {
  const finalMembers = [];

  const nodeTree = new NodeTree();
  let textBlock = false;
  let currentMemberId = -1;
  let currentMemberAmount = -1;
  let currentMemberNum = -1;

  const parser = new htmlparser.Parser({
    onopentag: function(name, attribs){
      nodeTree.addNode(name, attribs);

      if(currentMemberId < 0 && nodeTree.satisfies(targetElements[0])){
        currentMemberId = getParticipantId(attribs.href);
      } else if(currentMemberId >= 0){
        if(nodeTree.satisfies(targetElements[1])){
          if(currentMemberAmount < 0){
            textBlock = 'amount';
          } else {
            textBlock = 'num';
          }
        }
      }

    },
    ontext: function(text){
      if(textBlock){
        if(textBlock === 'amount'){
          const match = /\$(\d+\.\d+)/.exec(text);
          if(match){
            currentMemberAmount = parseFloat(match[1]);
          }
        } else if(textBlock === 'num'){
          currentMemberNum = parseInt(text);
        }
        textBlock = false;
      }
    },
    onclosetag: function(tagname){
      nodeTree.popNode(tagname);
      if(tagname === 'a' && currentMemberId >= 0){
        finalMembers.push({
          id: currentMemberId,
          amount: currentMemberAmount >= 0 ? currentMemberAmount : 0,
          num: currentMemberNum >= 0 ? currentMemberNum : 0
        });
        currentMemberId = -1;
        currentMemberNum = -1;
        currentMemberAmount = -1;
      }
    }
  }, {
    decodeEntities: true,
    lowerCaseAttributeNames: true,
    lowerCaseTags: true,
    recognizeSelfClosing: true
  });
  
  parser.write(body);
  parser.end();

  return finalMembers;
}

const liveRequest = (teamId) => {
  return new Promise((resolve, reject) => {
    request.get(`https://www.extra-life.org/index.cfm?fuseaction=donorDrive.teamParticipants&teamID=${teamId}`, (err, request, body) => {
      if(err){
        reject(err);
      }
      resolve(parseRequest(body));
    });
  });
};

const cannedRequest = () => {
  const exampleFile = require.resolve('../example_roster.html');
  const body = fs.readFileSync(exampleFile, {encoding: 'utf8'});
  return parseRequest(body);
};


module.exports = {
  liveRequest,
  cannedRequest
};