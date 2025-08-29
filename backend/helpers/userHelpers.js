const User = require('../models/Users');



const getUser = async (username,password) => {

    try {
        user = await User.findOne({ username: username});
        if (!user) {
            return null; // User not found
        }
        if (user.password !== password) {
            return null; // Password does not match
        }
        return user;
    } catch (err) {
        throw new Error('Error fetching user: ' + err.message);
    }
}

module.exports = {
  getUser
};