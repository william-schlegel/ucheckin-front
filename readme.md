# ucheckin front-end application

based on nextjs stack, connected to the backend

## dev

```shell
yarn dev
```

## deploy

on scaleway, as root, in `ucheckin-front` folder, pull the repo from github (not gitlab), then:

- `pm2 stop ecosystem.config.js`
- `yarn build`
- `pm2 start ecosystem.config.js`

content of `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'ucheckin-front',
      cwd: '/root/ucheckin-front/',
      script: 'npm start -p 3000',
      instances: 1,
      autorestart: true,
      max_memory_restart: '1G',
    },
  ],
};
```
