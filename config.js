/**
 * Created by guedj_m on 7/28/15.
 */

module.exports = {
  "db" : {
    "server" : "localhost",
    "port" : "27017",
    "database" : "smooth"
  },

  "http": {
    "port" : 3000
  },

  "login_srv" : {
    "url" : "login.smooth.local",
    "session_secret": "fezfezgzekrgeger",
    "access_code_duration": 10,
    "scopes": ['all']
  },

  "api_srv": {
    "url" : "api.smooth.local"
  },

  "db_srv" : {
    "url" : "db.smooth.local",
    "username": "user",
    "password": "pass"
  }
};