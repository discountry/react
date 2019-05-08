export default function shallowDiffers(a, b) {
  console.log(`shallow differ`, a, b)
  for (var i in a) {
    if (!(i in b)) return true
  }
  for (var _i in b) {
    if (a[_i] !== b[_i]) return true
  }
  return false
}
