const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { test } = require("node:test");

const schema = readFileSync("packages/db/prisma/schema.prisma", "utf8");

test("tracking event foundation models exist", () => {
  [
    "model TrackedEmail",
    "model TrackedRecipient",
    "model TrackedLink",
    "model TrackingEvent",
    "enum TrackingEventType",
    "enum TrackingState",
  ].forEach((name) => {
    assert.match(schema, new RegExp(name));
  });
});

test("tracking events are idempotent by event id", () => {
  assert.match(schema, /eventId\s+String\s+@unique/);
});

test("gmail tokens are still isolated from next-auth provider accounts", () => {
  assert.match(schema, /model GmailConnection/);
  assert.match(schema, /refreshToken\s+String\?\s+@db\.Text/);
});
