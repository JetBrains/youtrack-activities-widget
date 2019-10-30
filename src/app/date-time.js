
function toFechaFormat(pattern) {
  return (pattern || '').
    replace(/y/g, 'Y').
    replace(/d/g, 'D').
    replace('aaa', 'A');
}

function toLocalMidday(timestamp) {
  // eslint-disable-next-line radix
  const date = new Date(parseInt(timestamp));
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    // eslint-disable-next-line no-magic-numbers
    12,
    0,
    0,
    0
  );
}

export default {
  toFechaFormat, toLocalMidday
};
