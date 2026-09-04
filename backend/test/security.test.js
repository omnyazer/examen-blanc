const test = require("node:test");
const assert = require("node:assert/strict");
const authRoute = require("../routes/auth");
const tasksRoute = require("../routes/tasks");

const { isStrongPassword, isValidUsername } = authRoute.__test;
const { isValidTaskId, sanitizeTaskInput } = tasksRoute.__test;

test("password validation accepts only strong passwords", () => {
  assert.equal(isStrongPassword("Password123!"), true);
  assert.equal(isStrongPassword("password123!"), false);
  assert.equal(isStrongPassword("PASSWORD123!"), false);
  assert.equal(isStrongPassword("Password!"), false);
  assert.equal(isStrongPassword("Password1234"), false);
});

test("username validation accepts only alphanumeric usernames", () => {
  assert.equal(isValidUsername("User123"), true);
  assert.equal(isValidUsername("ab"), false);
  assert.equal(isValidUsername("user name"), false);
  assert.equal(isValidUsername("user!"), false);
});

test("task id validation rejects malformed MongoDB ids", () => {
  assert.equal(isValidTaskId("64f1b7b9b7b9b7b9b7b9b7b9"), true);
  assert.equal(isValidTaskId("bad-id"), false);
});

test("task input is trimmed and escaped", () => {
  const result = sanitizeTaskInput({
    title: "  <script>alert(1)</script>  ",
    description: "  hello & goodbye  ",
  });

  assert.equal(result.title, "&lt;script&gt;alert(1)&lt;/script&gt;");
  assert.equal(result.description, "hello &amp; goodbye");
});
