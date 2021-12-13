import {
  decodeMessage,
  encodeMessage,
  getUrlParams,
  isValidPeerId,
} from "./utils";

test("isValidPeerId", () => {
  expect(
    isValidPeerId("16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs")
  ).toBe(true);
  expect(
    [
      "06Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs",
      "1",
      "16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvH",
      "16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs1",
    ].every((p) => !isValidPeerId(p))
  ).toBe(true);
});

test("encodeMessage", () => {
  expect(
    encodeMessage(
      "16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs",
      "hello"
    )
  ).toEqual(`myne:16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs:hello`);
});

test("decodeMessage", () => {
  expect(
    decodeMessage(
      `myne:16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs:hello`
    )
  ).toEqual({
    tag: "myne",
    from: "16Uiu2HAm6phtqkmGb4dMVy1vsmGcZS1VejwF4YsEFqtJjQMjxvHs",
    message: "hello",
  });
});

test("getUrlParams", () => {
  const location = {
    search: "?securityToken=hello",
  };

  expect(getUrlParams(location as any)).toEqual({
    securityToken: "hello",
  });
});
