/**
 * return an object based on fled name (including '.')
 * @param {Object} fld {fld: "xxx.yyyy.id", value}
 * @returns Object { xxx: { yyy: { id: value } } }
 */
export default function transformField(fld) {
  const nm = fld.field.split('.');
  const ret = nm.reverse().reduce((prev, n) => {
    const f = { [n]: prev };
    if (n === 'contains') {
      f.mode = 'insensitive';
    }
    return f;
  }, fld.value);
  return ret;
}
