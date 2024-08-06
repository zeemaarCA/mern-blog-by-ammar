import User from '../models/user.model.js';
import VerificationCode from '../models/verificationCode.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'testinguser1173@gmail.com',
    pass: 'A@P%vPIV%^2zR2AKuX',
  },
});


export const verifyEmail = async (req, res, next) => {
  const { email, code } = req.body;

  try {
    const verificationRecord = await VerificationCode.findOne({ email, code });
    if (!verificationRecord) {
      return next(errorHandler(400, 'Invalid verification code'));
    }

    await VerificationCode.deleteOne({ email, code }); // Remove the verification code after successful verification
    res.json('Email verified successfully');
  } catch (error) {
    next(error);
  }
};


export const signup = async (req, res, next) => {
  const { username, email, password, fullName, country, city, phone, address, deliveryMethod } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === '' ||
    email === '' ||
    password === ''
  ) {
    next(errorHandler(400, 'All fields are required'));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    fullName,
    country,
    city,
    phone,
    address,
    deliveryMethod,

  });

  try {
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const newVerificationCode = new VerificationCode({
      email,
      code: verificationCode,
    });
    await newVerificationCode.save();

    const mailOptions = {
      from: 'testinguser1173@gamil.com',
      to: email,
      subject: 'Email Verification',
      text: `Your verification code is: ${verificationCode}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return next(errorHandler(500, 'Failed to send verification email'));
      }
      res.json('Signup successful, please check your email for the verification code');
    });
  } catch (error) {
    next(error)
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === '' || password === '') {
    next(errorHandler(400, 'All fields are required'));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(400, 'User not found'));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) {
      return next(errorHandler(400, 'Invalid Password'));
    }

    const token = jwt.sign({ id: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc
    res.status(200).cookie('access_token', token, {
      httpOnly: true
    })
      .json(rest);

  } catch (error) {
    next(error)

  }
}

export const google = async (req, res, next) => {
  const { email, googlePhotoUrl, name } = req.body
  try {
    const user = await User.findOne({ email })

    if (user) {
      const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET)
      const { password: pass, ...rest } = user._doc
      res.status(200).cookie('access_token', token, {
        httpOnly: true
      })
        .json(rest);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-9) + Math.random().toString(36).slice(-9)
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10)
      const newUser = new User({
        username: name.toLowerCase().split(' ').join('') +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl
      })
      await newUser.save()
      const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET)
      const { password: pass, ...rest } = newUser._doc
      res.status(200).cookie('access_token', token, {
        httpOnly: true
      })
        .json(rest);
    }
  }
  catch (error) {
    next(error)
  }

}