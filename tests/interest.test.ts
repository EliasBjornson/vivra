import assert from "node:assert/strict";
import test from "node:test";
import { createInterestHandler } from "../api/interest.ts";

const valid = { name: "Testperson Vivra", birthDate: "1970-01-02", email: "test@example.com", phone: "+46701234567", consent: true };
async function request(body: unknown, send: any, method = "POST") {
  let status = 200;
  let result: any;
  const response: any = {
    setHeader() {},
    status(code: number) { status = code; return this; },
    json(value: unknown) { result = value; return this; },
  };
  await createInterestHandler(send)({ method, body } as any, response);
  return { status, result };
}

test("sends all contact fields to the confirmed mailbox", async () => {
  let sent: any;
  const response = await request(valid, async (message: any) => { sent = message; return { data: { id: "test-id" }, error: null }; });
  assert.equal(response.status, 200);
  assert.deepEqual(sent.to, ["info@vivrahealth.se"]);
  assert.equal(sent.replyTo, valid.email);
  for (const value of [valid.name, valid.birthDate, valid.email, valid.phone, "Samtycke till kontakt: Ja"]) assert.ok(sent.text.includes(value));
});
test("provider rejection or exception never reports success", async () => {
  assert.equal((await request(valid, async () => ({ data: null, error: { message: "rejected" } }))).status, 502);
  assert.equal((await request(valid, async () => { throw new Error("network failure"); })).status, 500);
  assert.equal((await request(valid, async () => ({ data: null }))).status, 502);
});
test("invalid date, email, missing fields and consent do not send an email", async () => {
  for (const body of [{...valid, birthDate: "1970-02-30"}, {...valid, birthDate: "2999-01-01"}, {...valid, email: "bad"}, {...valid, consent: false}, {...valid, phone: ""}, {...valid, name: ""}, null, "{broken"]) {
    assert.equal((await request(body, async () => { assert.fail("Should not send"); })).status, 400);
  }
});
test("honeypot and unsupported methods do not send", async () => {
  assert.equal((await request({...valid, website: "bot"}, async () => { assert.fail("Should not send"); })).status, 200);
  assert.equal((await request(valid, async () => { assert.fail("Should not send"); }, "GET")).status, 405);
});
