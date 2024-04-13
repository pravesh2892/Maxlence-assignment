
const router = require("express").Router();
const { User } = require("../models/user");
const Token = require("../models/token");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcrypt");
const Joi = require("joi");


router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        const user = await User.findOne({ email: req.body.email  });
        
        
        if (!user)
            return res.status(401).send({ message: "Invalid Email" });

        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!validPassword)
            return res.status(401).send({ message: "Invalid  Password" });

        if (!user.verified) {
            let token = await Token.findOne({ userId: user._id });
            if (!token) {
                token = await new Token({
                    userId: user._id,
                    token: crypto.randomBytes(32).toString("hex"),
                }).save();
                const url = `${process.env.BASE_URL}users/${user.id}/verify/${token.token}`;
                await sendEmail(user.email, "Verify Email", url);
            }

            return res
                .status(400)
                .send({ message: "An Email sent to your account please verify" });
        }

        const token = user.generateAuthToken();
        res.status(200).send({ user: { name: user.firstName, surname: user.lastName, email: user.email }, token, message: "Logged in successfully" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});




router.post("/reset-password", async (req, res) => {
    try {
        const { error } = validateResetPassword(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message });
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send({ message: "Invalid email address" });

       
        const token = Math.floor(100000 + Math.random() * 900000).toString();

        let existingToken = await Token.findOne({ userId: user._id });
        if (existingToken) {
            
            existingToken.token = token;
        } else {
           
            existingToken = new Token({ userId: user._id, token });
        }

       
        await existingToken.save();

        await sendEmail(user.email, "Password Reset", `Your password reset token is: ${token}`);
        res.status(200).send({ message: "Password reset token sent to your email" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});





// Password reset
router.post("/reset-password-update", async (req, res) => {
    try {
        const { error } = validatePasswordResetUpdate(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message });
        const token = await Token.findOne({ token: req.body.token });
        if (!token) return res.status(400).send({ message: "Invalid or expired token" });
        const user = await User.findById(token.userId);
        if (!user) return res.status(400).send({ message: "User not found" });
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        user.password = hashPassword;
        await user.save();
        await token.remove();

        res.status(200).send({ message: "Password reset successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Validation function for password reset request
const validateResetPassword = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
    });
    return schema.validate(data);
};


// Validation function for password reset
const validatePasswordResetUpdate = (data) => {
    const schema = Joi.object({
        token: Joi.string().required().label("Token"),
        password: Joi.string().required().label("Password"),
    });
    return schema.validate(data);
};


const validate = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
};

module.exports = router;
