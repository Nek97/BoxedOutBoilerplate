const zlib = require("zlib")

module.exports.inflate = (input) => {
  try {
    const inflated = zlib.inflateSync(Buffer.from(input, 'base64')).toString();
    return inflated;
  } catch (error) {
    return input;
  }
};
module.exports.deflate = (input) => {
  try {
    const deflated = zlib.deflateSync(input);
    return deflated;
  } catch (error) {
    return input;
  }
};
