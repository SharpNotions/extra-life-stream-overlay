/* global Vue, moment, io */
function setupPage() {
  const formatDuration = duration => {
    const h = ('' + duration.hours()) || '0';
    const m = ('' + duration.minutes()).padStart(2, '0');
    return `${h}:${m}`;
  };

  const timers = new Vue({
    el: '#timers',
    data: {
      now: new Date(),
      morning: moment().hours(9).minutes(0).seconds(0).toDate()
    },
    computed:{
      localTime: function() {
        return moment(this.now).format('HH:mm');
      },
      timePlayed: function(){
        const duration = moment.duration(moment(this.now).diff(this.morning));
        return formatDuration(duration);
      },
      timeRemaining: function(){
        const duration = moment.duration(moment(this.morning).add(1, 'd').diff(this.now));
        duration.add(1, 'm');
        return formatDuration(duration);
      }
    },
    mounted: function(){
      setInterval(() => this.now = new Date(), 1000);
    }
  });

  const donationProgress = new Vue({
    el: '#progress',
    data: {
      raised: 0,
      goal: 2500
    },
    computed: {
      pct: function(){
        return `width: ${this.raised / this.goal * 100}%`;
      }
    }
  });

  const rosterMember = {
    template: '<div>{{displayName}} - <span class="highlight">${{raised}}</span></div>',
    props: ['data'],
    computed: {
      raised: function(){ return this.data.raised },
      displayName: function() { return this.data.displayName; }
    }
  };

  const roster = new Vue({
    el: '#roster',
    data: {
      members: [
        { displayName: 'tester', raised: 0 }
      ]
    },
    computed: {
      contributors: function(){
        return this.members.filter(x => x.raised > 0);
      }
    },
    components : {
      'member': rosterMember
    }
  });

  const topInfo = new Vue({
    el: '#top_center',
    data: {
      top: {
        displayName: 'Hi',
        raised: 1
      },
      latest:{
        amount: 10,
        from: 'Some Yung Guy',
        displayName: 'Bobbers'
      }
    }
  });

  const getTopMember = (members) => {
    if(members && members.length){
      const top = members[0];
      topInfo.top.displayName = top.displayName;
      topInfo.top.raised = top.raised;
    } else {
      topInfo.top.displayName = 'Anonymous',
      topInfo.top.raised = 0;
    }
  };

  const getLatestDonation = (members) => {
    const donations = [];
    members.forEach(member => {
      const memberDonate = member.donors.map(donation => ({
        amount: donation.donationAmount,
        from: donation.donorName,
        displayName: member.displayName,
        when: moment(donation.createdOn)
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
      topInfo.latest.amount = latest.amount;
      topInfo.latest.from = latest.from;
      topInfo.latest.displayName = latest.displayName;
    } else {
      topInfo.latest.amount = 0;
      topInfo.latest.from = 'Nobody';
      topInfo.latest.displayName = 'No one in particular';
    }
  };

  const notification = new Vue({
    el:'#donation_notification',
    data:{
      animating: false,
      showNotification: false,
      from: 'No one',
      amount: 0,
      displayName: 'Ya Boi',
      message: '',
      backlog: []
    },
    methods: {
      show: function(data){
        let x = null;
        if(data){
          if(this.backlog.length || this.animating){
            this.backlog.push(data);
          } else {
            x = data;
          }
        } else if(this.backlog.length) {
          x = this.backlog.shift();
        }

        if(x){
          this.from = x.from;
          this.amount = x.amount;
          this.displayName = x.displayName;
          this.message = x.message;
          this.animating = true;
          this.showNotification = true;
        }
      },
      pop: function(){
        console.log('POP!');
        setTimeout(() => this.showNotification = false, 4500);
      },
      notifyExit: function(){
        this.animating = false;
        if(this.backlog.length){
          this.show();
        }
      }
    }
  })

  var socket = io('/public');
  socket.on('connect', function(){
    console.log('Socket Connected');
    socket.emit('join', { }, function(data){
      if(data.success){
        console.info(data.result);
      } else {
        console.warn('socket#join failed');
      }
    });
  });
  socket.on('team-info', function(data){
    donationProgress.goal = data.fundraisingGoal;
    donationProgress.raised = data.totalRaisedAmount;
  });
  socket.on('roster-update', data => {
    console.log('roster-update', data);
    roster.members = data;
    getTopMember(data);
    getLatestDonation(data);
  });
  socket.on('donations', data => {
    console.log('donations!', data);
    const displayName = data.name;
    data.donors.forEach(donor => {
      notification.show({
        displayName: displayName,
        from: donor.donorName || 'Anonymous',
        amount: donor.donationAmount,
        message: donor.message || ''
      });
    });
  });
  socket.on('member-update', member => {
    console.log('member-updated', member);
  });
  socket.on('member-added', member => {
    console.log('member-added', member);
  });

  window.views = {
    timers: timers,
    donationProgress: donationProgress,
    roster: roster,
    topInfo: topInfo,
    notification: notification
  };
};

document.onreadystatechange = () => {
  if(document.readyState === 'interactive'){
    setupPage(Vue);
  }
  document.onreadystatechange = () => {};
}