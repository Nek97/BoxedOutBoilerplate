
const fs = require('fs');
const file = 'libs/boxedout/manage-user/src/user.resolver.ts';
let code = fs.readFileSync(file, 'utf8');

const map = {
  ManageUser_getUserForAgentGrid: 'UserForAgentType',
  AdminLog: 'AdminLogType',
  UserPhone: 'UserPhoneType',
  UserQuestionnaire: 'UserQuestionnaireType',
  UserLog: 'UserLogType',
  UserMobileDevice: 'UserMobileDeviceType',
  UserDynamic: 'UserDynamicType',
  Comment: 'CommentType',
  UserIdentity: 'UserIdentityType',
  LogAction: 'LogActionType',
  LogView: 'LogViewType',
  UserTag: 'UserTagType',
  BankAccount: 'BankAccountType',
  Addressbook: 'AddressbookType',
  WatchlistHit: 'WatchlistHitType',
  UserDevice: 'UserDeviceType'
};

for (const [methodName, typeName] of Object.entries(map)) {
  const regex = new RegExp('(async ' + methodName + '\\\\b[\\\\s\\\\S]*?fieldType: )\\\\s*,', 'g');
  code = code.replace(regex, '\\' + typeName + ',');
}

fs.writeFileSync(file, code);

