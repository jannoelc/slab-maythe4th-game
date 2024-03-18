# SLAB Club's May the 4th Event

This is a web app helper to be able to play [Sherlock Holmes Consulting Detective Game](https://www.spacecowboys.fr/sherlock-holmes-consultingdetective) with multiple teams competing.

Each team were given login credentials to be able to login their teams account. Each member can login their team account simultaneously. It is intended for this to be opened with a smartphone.

The required seed data (`intro.json`, `leads.json`, `teams.json`) were not included due to copyright and privacy concerns. You may however design your own SHCD puzzle and use it as an input to this app. An example seed data is included on `seed-data` directory.

Made with:

#### (Backend)

- Serverless Framework
- AWS Lambda + Websocket API
- AWS DynamoDB

#### (Frontend)

- NextJS
- Netlify (app deployment)
- React
- Ant Design

## Demo

### Desktop

![Desktop](/docs/media/desktop.gif)

### Mobile

![Mobile](/docs/media/mobile.gif)
