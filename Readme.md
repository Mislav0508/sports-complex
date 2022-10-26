# Sports complex app
The sports complex app is a management tool used by businesses to manage their sporting facilities.

## Api Documentation
https://documenter.getpostman.com/view/13858608/2s84LNTspB#e5819209-12d2-426c-9a5a-97020a422548

env file should be placed in the same folder as docker-compose.yml
## ENV FILE EXAMPLE:

### Application info
PORT=3000

### Database credentials
MONGO_URL=mongodb://mongo:27017/sports-complex-node

### Email notifications
SENDGRID_API_KEY=your_sendgrid_key <br />
RECIPIENT_EMAIL=example@gmail.com <br />
SENDER_EMAIL=example@gmail.com

### JWT
JWT_SECRET=mysupersecret <br />
JWT_LIFETIME=1h
