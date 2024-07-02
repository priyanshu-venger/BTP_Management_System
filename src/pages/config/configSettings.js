var baseURL = process.env.BTP_BASE_URL ? process.env.BTP_BASE_URL : "http://localhost:5000";
var config = {
    "btpBaseURL": baseURL,
    "btpLoginURL": baseURL + "/login",
    "btpForgotURL": baseURL + "/forgot_password",
    "btpSignupURL": baseURL + "/signup",
    "btpSignupOTPVerifyURL": baseURL + "/verify_otp_signup",
    "btpUploadProjectURL": baseURL + "/upload_project",

    "ERROR_UNEXPECTED_RESPONSE": "An unexpected response was received. (HTTP Status != 302)",
}

module.exports = {
    config
}