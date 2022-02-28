const bcrypt = require('bcrypt');
const userDataMapper = require('../models/user');
const { ApiError } = require('../helpers/errorHandler');

const userController = {

    async profil(req, res) {
        const { id } = req.params;
        const user = await userDataMapper.findByPk(id);

        // User does not exists
        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        return res.json(user);
    },

    async signupAction(req, res) {
        // User already exists
        const user = await userDataMapper.findByEmail(req.body.email);
        if (user) {
            throw new ApiError(400, 'User already exist');
        }

        // Password confirm does not match
        if (req.body.password !== req.body.passwordConfirm) {
            throw new ApiError(400, 'Password does not match with password confirm');
        }

        // Hash with bcrypt
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(req.body.password, salt);

        // New user
        const newUser = await userDataMapper.insert(
            req.body.email,
            req.body.first_name,
            req.body.last_name,
            encryptedPassword,
        );
        return res.json(newUser);
    },

};

module.exports = userController;