import Vue from 'vue';
import moment from 'moment';

const getLatestDonation = (members) => {
  const donations = [];
  members.forEach(member => {
    const memberDonate = (member.donors || []).map(donation => ({
      amount: donation.amount,
      from: donation.displayName,
      displayName: member.displayName,
      when: moment(donation.createdDateUTC)
    }));
    donations.push(...memberDonate);
  });
  if(donations.length){
    donations.sort((a, b) => {
      if(a.when.isBefore(b.when)){
        return 1;
      } else if(b.when.isBefore(a.when)){
        return -1;
      } else {
        return 0;
      }
    });
    const latest = donations[0];
    return {
      amount: latest.amount,
      from: latest.from,
      displayName: latest.displayName
    };
  } else {
    return null;
  }
};

const topInfo = () => new Vue({
  el: '#top_center',
  data: {
    top: {
      displayName: 'Hi',
      raised: 1
    },
    latest:{
      amount: 0,
      from: 'No one',
      displayName: 'waiting too long'
    }
  },
  methods:{
    checkMembers: function(members) {
      if(members && members.length){
        const top = members.filter(x => x.sumDonations > 0).sort((a, b) => (a.sumDonations > b.sumDonations) ? -1 : 1)[0];
        this.top.displayName = top.displayName;
        this.top.raised = top.sumDonations;

        const latestDonation = getLatestDonation(members);
        if(latestDonation){
          this.latest.amount = latestDonation.amount;
          this.latest.from = latestDonation.from;
          this.latest.displayName = latestDonation.displayName;
        }
      } else {
        this.top.displayName = 'Anonymous',
        this.top.raised = 0;
      }
    }
  }
});

export default topInfo;