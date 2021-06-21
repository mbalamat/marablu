import { canonicalize } from "../src/deps.ts";
import { isValidAndCanonicalized } from "../src/main.ts";
import { asserts } from "./dev_deps.ts";
const { assertEquals } = asserts;

Deno.test({
  name: "Simple JSON canonicalize test",
  fn: () => {
    const json = {
      "from_account": "543 232 625-3",
      "to_account": "321 567 636-4",
      "amount": 500,
      "currency": "USD",
    };
    const expected =
      '{"amount":500,"currency":"USD","from_account":"543 232 625-3","to_account":"321 567 636-4"}';
    assertEquals(canonicalize(json), expected);
  },
});

Deno.test({
  name:
    "isValidAndCanonicalized(): Should return false if input is not a valid JSON",
  fn: () => {
    '{"amount":500,"currency":"USD","from_account":"543 232 625-3","to_account":"321 567 636-4"}';
    assertEquals(isValidAndCanonicalized(""), false);
  },
});

Deno.test({
  name:
    "isValidAndCanonicalized(): Should return false if input is not a canonicalized JSON string",
  fn: () => {
    const notCanonicalizedJSONstring =
      '{"currency":"USD","amount":500,"from_account":"543 232 625-3","to_account":"321 567 636-4"}';
    assertEquals(isValidAndCanonicalized(notCanonicalizedJSONstring), false);
  },
});

Deno.test({
  name:
    "isValidAndCanonicalized(): Should return true if input is canonicalized JSON string",
  fn: () => {
    const canonicalizedJSONstring =
      '{"amount":500,"currency":"USD","from_account":"543 232 625-3","to_account":"321 567 636-4"}';
    assertEquals(isValidAndCanonicalized(canonicalizedJSONstring), true);
  },
});
Deno.test({
  name:
    "isValidAndCanonicalized(): Should return true if input is canonicalized JSON string",
  fn: () => {
    const canonicalizedJSONstring =
      '{"agent":"Malibu 0.4.0","type":"hello","version":"0.4.0"}\n';
    assertEquals(isValidAndCanonicalized(canonicalizedJSONstring), true);
  },
});
