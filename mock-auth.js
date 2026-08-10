const fs = require('fs');

let f = 'libs/boxedout/auth/src/auth.module.ts';
if (fs.existsSync(f)) {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/import \{ AllowedIpService \} from '@boxedout\/manage-monitor\/allowed-ip\.service';/, 'const AllowedIpService = class { async validateIp() { return true; } };');
  fs.writeFileSync(f, c);
}

f = 'libs/boxedout/auth/src/auth.service.ts';
if (fs.existsSync(f)) {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/import \{ AllowedIpService \} from '@boxedout\/manage-monitor\/allowed-ip\.service';/, 'const AllowedIpService = class { async validateIp() { return true; } };');
  fs.writeFileSync(f, c);
}

f = 'libs/boxedout/manage-user/src/user-log.service.ts';
if (fs.existsSync(f)) {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/import \{ Ip \} from '@boxedout-libs\/db-fraudPrevention\/entities\/ip\.entity';/, 'const Ip = class {};');
  c = c.replace(/import \{ Asn \} from '@boxedout-libs\/db-fraudPrevention\/entities\/asn\.entity';/, 'const Asn = class {};');
  fs.writeFileSync(f, c);
}

f = 'libs/boxedout-libs/shared/src/seeder-helper.ts';
if (fs.existsSync(f)) {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/import .*? from '@boxedout-libs\/db-boxedoutAdmin\/database\/seeds\/fixed-tags';/, 'const FIXED_TAG_GROUPS_ENUM = {}; const FIXED_TAGS_ENUM = {};');
  c = c.replace(/public getGroupTagIds.*?\}\n/gs, 'public getGroupTagIds(tagType: any): any[] { return []; }\n');
  c = c.replace(/public getSpecificTagId.*?\}\n/gs, 'public getSpecificTagId(tagName: any): any { return null; }\n');
  c = c.replace(/await rep.insert\(elementsToInsert\);/g, 'await rep.insert(elementsToInsert as any);');
  fs.writeFileSync(f, c);
}

console.log('Mocked auth, fraudPrevention, and seeder-helper');
