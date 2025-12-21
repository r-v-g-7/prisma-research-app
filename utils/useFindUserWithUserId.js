const User = require("../models/user")

const useFindUserByUserId = async (userId) => {
    const findUser = await User.findById(userId);
    return findUser
}

module.exports = useFindUserByUserId