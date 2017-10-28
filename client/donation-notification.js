import Vue from 'vue';
import Cannon from './confetti';

const notification = () => {
  const cannon = new Cannon('confetti');
  return new Vue({
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
        const elem = document.getElementById('donation_container');
        const rect = elem.getBoundingClientRect();

        const height = rect.bottom - rect.top;
        const midpoint = Math.floor(rect.top + height / 2);

        cannon.shoot([
          { x: rect.left, y: midpoint, count: 25, isLeft: true },
          { x: rect.right, y: midpoint, count: 25 }
        ]);
        
        setTimeout(() => this.showNotification = false, 4500);
      },
      notifyExit: function(){
        this.animating = false;
        if(this.backlog.length){
          this.show();
        }
      }
    }
  });
};

export default notification;