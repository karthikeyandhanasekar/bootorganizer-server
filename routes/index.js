var express = require('express');
const { hashdata, comparehashdata } = require('../bcrypt');
var router = express.Router();
const nodemailer = require("nodemailer");


const userSchema = require("../Schema/userSchema")
const adminschema = require("../Schema/adminschema")
const bootcampschema = require("../Schema/bootcampschema")
const complaintschema = require("../Schema/complaintSchema")





/* GET user home page. */
router.get('/:id', async (req, res, next) => {
  try {
    const result = await bootcampschema.find().sort({ orgdate: 1 })
    const result1 = await userSchema.find({ _id: req.params.id }, { userlists: 1 }).sort({ orgdate: 1 })
    if (result) {
      res.json({
        message: "OK",
        bootlist: result,
        registeredbootcamp: result1
      })
    }
    else {
      res.json({
        message: "Sorry for inconvience.kindly contact our support"
      })
    }
  } catch (error) {
    console.error(error.message);
  }
});

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    const result = await bootcampschema.find().sort({ orgdate: 1 })
    const result1 = await userSchema.find({ _id: req.params.id }, { userlists: 1 }).sort({ orgdate: 1 })
    if (result) {
      res.json({
        message: "OK",
        bootlist: result,
        registeredbootcamp: result1
      })
    }
    else {
      res.json({
        message: "Sorry for inconvience.kindly contact our support"
      })
    }
  } catch (error) {
    console.error(error.message);
  }
});


/* GET bootcamp list for admin. */
router.get('/adminhomepage/:id', async (req, res, next) => {
  try {
    console.log(req.body);
    const result = await bootcampschema.find().sort({ orgdate: 1 })
    console.log(result);
    if (result) {
      res.json({
        message: "OK",
        bootlist: result,
      })
    }
    else {
      res.json({
        message: "Sorry for inconvience.kindly contact our support"
      })
    }
  } catch (error) {
    console.error(error.message);
  }
});


/* retrive specific bootcamp. */
router.get('/bootcamp/:id', async (req, res, next) => {
  try {
    const result = await bootcampschema.findOne({ _id: req.params.id })
    if (result) {
      res.json({
        message: "OK",
        bootlist: result,
      })
    }
    else {
      res.json({
        message: "Sorry for inconvience.kindly contact our support"
      })
    }
  } catch (error) {
    console.error(error.message);
  }
});
/* user status verification. */
router.put('/bootcamp/:id', async (req, res, next) => {
  try {
    const findbootcamp = await bootcampschema.findOneAndUpdate({ _id: req.params.id, "userlists.email": req.body.email }, { "userlists.$.status": "verified" })
    if (findbootcamp) {
      next()
    }
  } catch (error) {
    console.error(error.message);
  }
});

/* user status verification. */
router.put('/bootcamp/:id', async (req, res, next) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "dkmailpratice@gmail.com", // generated ethereal user
        pass: "karthik!123",
      }
    });

    const mailOptions = {
      from: 'dkpraticemail@gmail.com',  // sender address
      to: req.body.email,   // list of receivers
      subject: `${req.body.bname} BootCamp Transcation Verification`,
      text: `Hi ${req.body.name},Your transcation has been verified. Hope all Safe!  `,
    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err)
        console.log(err)
      else {
        console.log("Info :");
        console.log(info);
        res.json({
          message: "OK"
        })

      }
    });
  } catch (error) {
    console.error(error.message);
  }
});

/* update userlist  */
router.put('/', async (req, res, next) => {
  try {
    const result = await userSchema.findOneAndUpdate({ email: req.body.userdata.email }, { $push: { userlists: req.body.bootcampdata } })
    const result1 = await bootcampschema.findOneAndUpdate({ _id: req.body.id }, { $push: { userlists: req.body.userdata } })

    if (!!result && !!result1) {

      res.json({
        message: "OK"
      })
      next()
    }

    else
      res.json({
        message: "Error Occured..Try Again"
      })
  } catch (error) {
    console.error(error.message);
  }
});


/* bootcamp register approval mail */
router.put('/', async (req, res, next) => {
  try {
    const result = await bootcampschema.findOne({ _id: req.body.id })

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "dkmailpratice@gmail.com", // generated ethereal user
        pass: "karthik!123",
      }
    });

    const mailOptions = {
      from: 'dkpraticemail@gmail.com',  // sender address
      to: req.body.userdata.email,   // list of receivers
      subject: `${result.name} BootCamp Registed Successfully`,
      text: `Hi ${req.body.userdata.name} , thanks for ${result.name} BootCamp. We will verify your transaction details and contact you. All the best..Hope you all Safe!`,
    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err)
        console.log(err)
      else {
        console.log("Info :");
        console.log(info);

      }
    });
  } catch (error) {
    console.error(error.message);
  }
});






//post for createuser account
router.post('/signin', async (req, res, next) => {

  try {
    const data = req.body

    const validemail = await userSchema.findOne({ email: data.email })
    if (!!validemail) {
      res.send("Email already exists")
    }
    else {
      data.password = await hashdata(data.password)
      const result = await userSchema.create(data)
      console.log(!!result);
      if (!!result) {
        next()
        // res.sendStatus(200)
      }
      else
        res.status(401).json({ errormessage: "Invalid Signin Process.." })
    }
  } catch (error) {
    res.send(error);
  }

});

//welcome mail
router.post('/signin', async (req, res, next) => {

  try {

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "dkmailpratice@gmail.com", // generated ethereal user
        pass: "karthik!123",
      }
    });

    const mailOptions = {
      from: 'dkpraticemail@gmail.com',  // sender address
      to: req.body.email,   // list of receivers
      subject: 'Account Registered',
      text: `Hi ${req.body.name} , thanks for registering our company. Soon we will contact you..`,

    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err)
        console.log(err)
      else {
        console.log("Info :");
        console.log(info);
        res.sendStatus(200)
      }
    });

  } catch (error) {
    res.send(error);
  }

});

// verify userlogin account
router.post('/userlogin', async (req, res, next) => {

  try {
    console.log(req.body);
    const validemail = await userSchema.findOne({ email: req.body.email })
    if (!!validemail) {
      const validpassword = await comparehashdata(req.body.password, validemail.password)
      if (validpassword) {
        console.log(validemail);
        res.json({
          message: "OK",
          email: validemail.email,
          name: validemail.name,
          phoneno: validemail.phoneno,
          id: validemail._id
        })
      }
      else
        res.json({
          message: "Invalid Password"
        })
    }
    else {
      res.json({
        message: "Invalid Email/Not Exist"
      })
    }
  } catch (error) {
    res.send(error);
  }

});
// verify adminlogin account
router.post('/adminlogin', async (req, res, next) => {

  try {
    const validemail = await adminschema.findOne({ email: req.body.email })
    console.log(validemail);
    if (!!validemail) {
      if (req.body.password === validemail.password) {
        res.json({
          message: "OK",
        })
      }
      else
        res.json({
          message: "Invalid Password"
        })
    }
    else {
      res.json({
        message: "Invalid Email/Not Exist"
      })
    }
  } catch (error) {
    res.send(error);
  }

});

// forgotpassword
router.put('/forgotpassword', async (req, res, next) => {

  try {
    const validemail = await userSchema.findOne({ email: req.body.email })
    if (!!validemail) {
      const result = await userSchema.findOneAndUpdate({ email: req.body.email }, { password: await hashdata(req.body.password) })
      console.log(result);
      if (result)
        res.json({
          message: "OK"
        })
    }
    else {
      res.json({
        message: "Invalid Email/Not Exist"
      })
    }
  } catch (error) {
    res.send(error);
  }

});

//insert campdetails in mongodb
router.post('/addcamp', async (req, res, next) => {

  try {
    const isnameexist = await bootcampschema.findOne({ name: req.body.name })
    if (!!isnameexist) {
      res.json({
        message: "Bootcamp already exist..Try another name"
      })
    }
    else {
      const result = await bootcampschema.create(req.body)
      if (result)
        res.json({
          message: "OK"
        })
      else
        res.json({
          message: "Error Occured.Try Again"
        })
    }
  } catch (error) {
    res.send(error);
  }

});

//store complaints
router.post('/support', async (req, res, next) => {

  try {

    const result = await complaintschema.create(req.body)
    const ticketid = result._id.toString()
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "dkmailpratice@gmail.com", // generated ethereal user
        pass: "karthik!123",
      }
    });

    const mailOptions = {
      from: 'dkpraticemail@gmail.com',  // sender address
      to: req.body.email,   // list of receivers
      subject: `Complaint Regsitered`,
      text: `Sorry for the Inconivence.we will support and clear this issue as soon as possible.
      
      Your ticket is ${ticketid}  `,
    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err)
        console.log(err)
      else {
        console.log("Info :");
        console.log(info);
        res.json({
          message: "OK"
        })
      }
    });

  } catch (error) {
    res.send(error);
  }

});


//store complaints
router.get('/complaintlist/:id', async (req, res, next) => {

  try {

    const result = await complaintschema.find({ status: "pending" }).sort({ createdAt: -1 })
    if (result)
      res.json({
        message: "OK",
        value: result
      })
  }

  catch (error) {
    res.send(error);
  }

});


//update complaint status
router.put('/complaintlist/:id', async (req, res, next) => {

  try {

    const result = await complaintschema.findOneAndUpdate({ _id: req.body.id }, { status: "resolved" })
    console.log(result);
    if (result) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "dkmailpratice@gmail.com", // generated ethereal user
          pass: "karthik!123",
        }
      });

      const mailOptions = {
        from: 'dkpraticemail@gmail.com',  // sender address
        to: req.body.email,   // list of receivers
        subject: `Complaint Resolved`,
        text: `Your Complaint has been resolved.
      
      Your ticket is ${req.body.id}.
      
      Thank you..Hope ALL safe`,
      };
      transporter.sendMail(mailOptions, function (err, info) {
        if (err)
          console.log(err)
        else {
          console.log("Info :");
          console.log(info);
          res.json({
            message: "OK"
          })
        }
      });
    }
  }

  catch (error) {
    res.send(error);
  }

});



module.exports = router;
