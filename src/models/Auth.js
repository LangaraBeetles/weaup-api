// Class to support intellisense when working with the auth data

class AuthData {
  constructor(req) {
    this._id = req.auth._id;
    this.name = req.auth.name;
    this.email = req.auth.email;
    this.preferred_mode = req.auth.preferred_mode;
    this.daily_goal = req.auth.daily_goal;
    this.is_setup_complete = req.auth.is_setup_complete;
    this.xp = req.auth.xp;
    this.hp = req.auth.hp;
    this.device_id = req.auth.device_id;
  }
}

export default AuthData;
