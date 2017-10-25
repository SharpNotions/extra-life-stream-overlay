# stream-overlay

A stream overlay service to provide interactivity during our Extra Life game day events


## Get started

- [node.js required](https://nodejs.org/en/) and grab some [Yarn](https://github.com/yarnpkg/yarn)
- `yarn`
- Create your .env file (see below)
- `yarn start` Or `yarn start:dev` -- this will run the server with Nodemon watching
- Navigate to [http://localhost:3000/](http://localhost:3000/)

## ENV file

A .env file is required at the root of this project in order to know what team it is tracking.

### Required entries

```
TEAM_ID={your team number here}
```

### Optional entries

Default values are presented below

```
DEBUG=false - prevents outputs debugging messages to console
LIVE=true - Extra Life API calls execute against website instead of samples
POLL_DELAY=60000 - how often the service polls for changes
```

## Credits
<p align="center">
  <a href="https://goo.gl/xExFj2"><img alt="Extra Life - Sharp Notions Team" src="https://www.extra-life.org/themes/extralife/img/logo.svg" width="400"></a>
  <a href="https://go.twitch.tv/sharpnotions"><img alt="twitch Sharp Notions, LLC" src="https://www.extra-life.org/themes/extralife/img/logo-twitch.svg" width="200"></a>
</p>

---
<p align="center">Extra Life unites thousands of players around the world in a 24-hour fundraising and gaming marathon
to support Children's Miracle Network Hospitals.
</p>
