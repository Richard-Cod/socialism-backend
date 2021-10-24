/**
 *
 * This call sends a message to the given recipient with vars and custom vars.
 *
 */
const mailjet = require ('node-mailjet')
    .connect("fe49dcb5b73eabeec5c70daaec362e6e", "1be81491da821d97a457a03f4ffd8a19")
    

const sendVerificationEmail = (receiverMail , codeGenerated) => {
    const request = mailjet
	.post("send", {'version': 'v3.1'})
	.request({
		"Messages":[
			{
				"From": {
					"Email": "richard.bathiebo.7@gmail.com",
					"Name": "Email Verification Email"
				},
				"To": [
					{
						"Email": receiverMail,
						"Name": "passenger 1"
					}
				],
				"TemplateID": 3247573,
				"TemplateLanguage": true,
				"Subject": "Email Verification on SocialIsm",
				"Variables": {
                "codeOfVerification": "codeOfVerification",
                "code" : codeGenerated
    }
			}
		]
	})
request
	.then((result) => {
		console.log(result.body)
	})
	.catch((err) => {
		console.log(err.statusCode)
    })
    
}

module.exports = sendVerificationEmail