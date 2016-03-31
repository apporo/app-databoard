module.exports = {
  plugins: {
    appDataboard: {
      contextPath: '/databoard',
      client: {
        "ng-admin": {
          homedir: "public/client/ng-admin-demo"
        },
        "ng-nimda": {
          homedir: "public/client/ng-nimda-demo"
        }
      },
      default: "ng-admin"
    }
  }
};
