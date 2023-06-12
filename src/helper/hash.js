const bcrypt = require("bcryptjs/dist/bcrypt");

const hasPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10)
        result = bcrypt.hash(password, salt)
        return result
    } catch (error) {
        
    }
}

module.exports = hasPassword