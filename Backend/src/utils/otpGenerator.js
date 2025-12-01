function generateOTP(length = 4) {
    return Math.floor(100000 + Math.random() * 900000).toString().slice(0, length);
}

export default generateOTP;
