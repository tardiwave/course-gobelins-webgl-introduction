// A fragment shader has no default precision for float, so this has to come
// before anything that uses one. mediump would be wrong here anyway: three
// decimal digits is fine for a colour and hopeless for a value that feeds
// back into itself thousands of times.
precision highp float;
