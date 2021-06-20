import { canonicalize } from "../src/deps.ts";
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
