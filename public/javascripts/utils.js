function calculateDistance (levelInDb, freqInMHz){
    freqInMHz = freqInMHz || 2430;
    var exp = (27.55 - (20 * Math.log10(freqInMHz)) + Math.abs(levelInDb)) / 20.0;
    return Math.pow(10.0, exp);
}