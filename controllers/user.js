const bcrypt = require('bcrypt');
const User = require('../models/User');
const auth = require("../auth");

const { errorHandler } = auth;
// User registration controller
exports.registerUser = async (req, res) => {
    try {
        const { firstname, lastname, email, contactNumber, address, password, facebookLink } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({
            firstname,
            lastname,
            email,
            contactNumber,
            address,
            password: hashedPassword, // store the hashed password
            facebookLink
        });

        // Save the user to the database
        await newUser.save();

        // Respond with success message
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports.loginUser = (req, res) => {

    if(req.body.email.includes("@")){
        return User.findOne({ email : req.body.email })
        .then(result => {
            if(result == null){
                // if the email is not found, send a message 'No email found'.
                return res.status(404).send({ message: 'No email found' });
            } else {
                const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
                if (isPasswordCorrect) {
                    // if all needed requirements are achieved, send a success message 'User logged in successfully' and return the access token.
                    return res.status(200).send({ 
                        message: 'User logged in successfully',
                        access : auth.createAccessToken(result)
                        })
                } else {
                    // if the email and password is incorrect, send a message 'Incorrect email or password'.
                    return res.status(401).send({ message: 'Incorrect email or password' });
                }
            }
        })
        .catch(error => errorHandler(error, req, res));
    } else{
        // if the email used in not in the right format, send a message 'Invalid email format'.
        return res.status(400).send({ message: 'Invalid email format' });
    }
};

module.exports.getProfile = (req, res) => {
    return User.findById(req.user.id)
    .then(user => {

        if(!user){
            // if the user has invalid token, send a message 'invalid signature'.
            return res.status(404).send({ message: 'invalid signature' })
        }else {
            // if the user is found, return the user.
            user.password = "";
            return res.status(200).send(user);
        }  
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params; // Get userId from request parameters

  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      return res.status(200).send(user); // Send the found user
    })
    .catch(err => {
      return res.status(500).send({ message: 'An error occurred', error: err.message });
    });
};

// Edit user profile controller
module.exports.editProfile = (req, res) => {

     // Assuming the authenticated user's ID comes from token
    const { firstname, lastname, email, contactNumber, address, facebookLink } = req.body;

    // Find user by ID and update their profile
    User.findById(req.user.id)
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }

            // Update fields if provided
            user.firstname = firstname || user.firstname;
            user.lastname = lastname || user.lastname;
            user.email = email || user.email;  // Make sure to handle unique constraint elsewhere
            user.contactNumber = contactNumber || user.contactNumber;
            user.address = address || user.address;
            user.facebookLink = facebookLink || user.facebookLink;

            // Save updated user to the database
            return user.save();
        })
        .then(updatedUser => {
            updatedUser.password = "";  // Exclude password from response
            res.status(200).send(updatedUser);
        })
        .catch(error => {
            return res.status(500).send({
                message: 'An error occurred while updating the profile',
                error: error.message,
            });
        });


};

module.exports.getAllUsers = (req, res) => {
    User.find({})
        .then(users => {
            if (!users || users.length === 0) {
                return res.status(404).send({ message: 'No users found' });
            }
            return res.status(200).send(users);
        })
        .catch(error => {
            return res.status(500).send({
                message: 'An error occurred while fetching users',
                error: error.message
            });
        });
};
