const fs = require('fs');

let f = 'libs/boxedout/manage-user/src/user.resolver.ts';
let lines = fs.readFileSync(f, 'utf8').split('\n');
const newLines = [];
for (let line of lines) {
  if (line.includes('from \'./dto/admin-log.type\'') ||
      line.includes('from \'./dto/user-phone.type\'') ||
      line.includes('from \'./dto/user-log.type\'') ||
      line.includes('from \'./dto/user-questionnaire.type\'') ||
      line.includes('from \'./dto/user.type\'') ||
      line.includes('from \'./dto/user-device.type\'') ||
      line.includes('from \'./dto/user-mobile-device.type\'') ||
      line.includes('from \'./user-document.type\'') ||
      line.includes('from \'./dto/user-email.type\'') ||
      line.includes('from \'@boxedout-libs/db-boxedout/enums/log-action.enum\'') ||
      line.includes('Duplicate identifier') ||
      (line.startsWith('import {') && line.includes('Type') && line.includes('Grid'))
  ) {
    continue;
  }
  newLines.push(line);
}

const finalImports = `import { AdminLogType, AdminLogGrid } from './dto/admin-log.type';
import { UserPhoneType, UserPhoneGrid } from './dto/user-phone.type';
import { UserLogType, UserLogGrid, UserLogExtendedGrid } from './dto/user-log.type';
import { UserQuestionnaireType, UserQuestionnaireGrid } from './dto/user-questionnaire.type';
import { UserForAgentType, UserType, UserForAgentGrid, UserGrid } from './dto/user.type';
import { UserDeviceType, UserDeviceGrid } from './dto/user-device.type';
import { UserMobileDeviceType, UserMobileDeviceGrid } from './dto/user-mobile-device.type';
import { UserFileType, UserFileGrid } from './user-document.type';
import { UserEmailType } from './dto/user-email.type';
// @ts-ignore
import { LogActionTypeEnum } from '@boxedout-libs/db-boxedout/enums/log-action.enum';
`;

fs.writeFileSync(f, finalImports + newLines.join('\n'));
console.log('Fixed imports');
