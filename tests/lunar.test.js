// Chạy: node tests/lunar.test.js — so với các ngày Tết đã biết
require("../lunar.js");
const assert = require("assert");
const { solarToLunar, canChi } = globalThis.Lunar;
const cases = [
  [[17, 2, 2026], { day: 1, month: 1, year: 2026 }], // Tết Bính Ngọ
  [[6, 2, 2027], { day: 1, month: 1, year: 2027 }],  // Tết Đinh Mùi
  [[29, 1, 2025], { day: 1, month: 1, year: 2025 }], // Tết Ất Tỵ
  [[10, 2, 2024], { day: 1, month: 1, year: 2024 }], // Tết Giáp Thìn
  [[5, 2, 2026], { day: 18, month: 12, year: 2025 }], // trước Tết vẫn là năm âm cũ
];
for (const [[d, m, y], want] of cases) {
  const got = solarToLunar(d, m, y);
  assert.deepStrictEqual({ day: got.day, month: got.month, year: got.year }, want, `${d}/${m}/${y}`);
}
assert.strictEqual(canChi(2026), "Bính Ngọ");
assert.strictEqual(canChi(2027), "Đinh Mùi");
// năm 2025 có tháng 6 nhuận: 25/7/2025 = 1/6 nhuận
const leap = solarToLunar(25, 7, 2025);
assert.deepStrictEqual([leap.day, leap.month, leap.leap], [1, 6, true]);
console.log("lunar ok:", JSON.stringify(solarToLunar(26, 10, 2027)));
