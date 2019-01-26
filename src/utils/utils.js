const pipe = (initialValue, ...fns) => {
  return fns.reduce((val, fn) => fn(val), initialValue);
};

module.exports = {
  pipe,
};
