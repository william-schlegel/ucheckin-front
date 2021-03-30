/**
 * return an object based on fled name (including '.')
 * @param {Object} fld {fld: "xxx.yyyy.id", value}
 * @returns Object { xxx: { yyy: { id: value } } }
 */
export default function transformField(fld) {
  const nm = fld.field.split('.');
  const ret = nm.reverse().reduce((prev, n) => ({ [n]: prev }), fld.value);
  return ret;
}
