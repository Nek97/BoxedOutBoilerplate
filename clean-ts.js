const { Project } = require('ts-morph');

const project = new Project();
const sourceFile = project.addSourceFileAtPath('libs/boxedout/manage-user/src/user.resolver.ts');
const cls = sourceFile.getClass('UserResolver');

const methodsToRemove = ['MonitorAsset', 'MonitorFiat', 'UserFile', 'UserIdentityDocument', 'UserDynamic', 'Comment', 'UserIdentity', 'LogAction', 'LogView', 'UserTag', 'BankAccount', 'Addressbook', 'WatchlistHit'];

methodsToRemove.forEach(name => {
  const method = cls.getMethod(name);
  if (method) {
    method.remove();
  }
});

const dlToRemove = ['assetDL', 'fiatDL', 'userIdentityDocumentDL', 'userFileDL', 'addressbookDL', 'watchlistHitDL', 'userIdentityDL', 'logActionDL', 'logViewDL', 'userTagDL', 'bankAccountDL', 'userDynamicDL', 'commentDL'];
const ctors = cls.getConstructors();
if (ctors.length > 0) {
  const ctor = ctors[0];
  dlToRemove.forEach(dl => {
    const param = ctor.getParameter(dl);
    if (param) {
      param.remove();
    }
  });
}

// Remove forbidden imports
const forbidden = ['manage-monitor', 'monitor-asset', 'monitor-fiat', 'bank-account', 'watchlist-hit', 'user-identity-document', 'user-file', 'addressbook', 'log-action', 'log-view', 'user-tag', 'user-dynamic', 'comment', 'user-identity'];

sourceFile.getImportDeclarations().forEach(imp => {
  const moduleSpecifier = imp.getModuleSpecifierValue();
  if (forbidden.some(f => moduleSpecifier.includes(f))) {
    imp.remove();
  }
});

// We can also fix @AgGridArgs fieldMap to fieldType, but we can just let regex do it after
sourceFile.saveSync();
console.log('Done cleaning with ts-morph');
