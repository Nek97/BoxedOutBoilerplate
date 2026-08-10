const fs = require('fs');
let f = 'libs/boxedout-libs/shared/src/emailSender/email-sender.module.ts';
if (fs.existsSync(f)) {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/import .*? from '@boxedout-libs\/db-email';/, 'const EmailDbModule = { forRoot: () => ({ module: class {} }) };\nconst EmailDbService = class {};\nconst DbConnection = { EMAIL: "EMAIL" };');
  fs.writeFileSync(f, c);
}

f = 'libs/boxedout-libs/shared/src/emailSender/email-sender.service.ts';
if (fs.existsSync(f)) {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/import .*? from '@boxedout-libs\/db-email';/, 'const EmailDbService = class { getClient() { return { sendEmail: async () => {} }; } };\nconst DbConnection = { EMAIL: "EMAIL" };');
  fs.writeFileSync(f, c);
}
console.log("Mocked email");
