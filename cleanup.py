import re
with open('libs/boxedout/manage-user/src/user.resolver.ts', 'r', encoding='utf8') as f:
    code = f.read()

code = re.sub(r'([\s]*)@ResolveField\([^)]+\)[\s]*@UseInterceptors\([^)]+\)[\s]*async (MonitorAsset|MonitorFiat|UserFile|UserIdentityDocument|UserDynamic|Comment|UserIdentity|LogAction|LogView|UserTag|BankAccount|Addressbook|WatchlistHit)\([\s\S]*?\}[\s]*(?=\n[\s]*@)', '\n\n', code)
code = re.sub(r'([\s]*)@ResolveField\([^)]+\)[\s]*@UseInterceptors\([^)]+\)[\s]*async (MonitorAsset|MonitorFiat|UserFile|UserIdentityDocument|UserDynamic|Comment|UserIdentity|LogAction|LogView|UserTag|BankAccount|Addressbook|WatchlistHit)\([\s\S]*?\}[\s]*(?=\n[\s]*\})', '\n', code)

dlToRemove = ['assetDL', 'fiatDL', 'userIdentityDocumentDL', 'userFileDL', 'addressbookDL', 'watchlistHitDL', 'userIdentityDL', 'logActionDL', 'logViewDL', 'userTagDL', 'bankAccountDL', 'userDynamicDL', 'commentDL']
for dl in dlToRemove:
    code = re.sub(r'([\s]*)@Inject\([^)]+\)[\s]*private ' + dl + ':[^,]+,?', '', code)
    code = re.sub(r'([\s]*)private ' + dl + ':[^,]+,?', '', code)

forbidden = ['manage-monitor', 'monitor-asset', 'monitor-fiat', 'bank-account', 'watchlist-hit', 'user-identity-document', 'user-file', 'addressbook', 'log-action', 'log-view', 'user-tag', 'user-dynamic', 'comment', 'user-identity']
def replace_import(match):
    for f in forbidden:
        if f in match.group(0):
            return ''
    return match.group(0)

code = re.sub(r'import\s+\{[\s\S]*?\}\s+from\s+[\'\"].*?[\'\"];?', replace_import, code)
code = re.sub(r'import\s+[A-Za-z0-9_]+\s+from\s+[\'\"].*?[\'\"];?', replace_import, code)

code = re.sub(r'fieldMap:\s*([A-Za-z]+)FieldMap,', r'fieldType: \1Type,', code)
code = re.sub(r'fieldMap:\s*UserLogFieldMap,', r'fieldType: UserLogType,', code)
code = re.sub(r'fieldMap:\s*AdminLogFieldMap,', r'fieldType: AdminLogType,', code)

code = code.replace('@Inject(getDataloaderToken(UserAddress))', '@Inject(getDataloaderToken(UserAddress) as string)')

with open('libs/boxedout/manage-user/src/user.resolver.ts', 'w', encoding='utf8') as f:
    f.write(code)

file = 'libs/common/database/src/seed.service.ts'
with open(file, 'r', encoding='utf8') as f:
    code = f.read()
code = code.replace('await new seeder().run(factory, connection);', 'await new seeder().run(factory, connection as any);')
with open(file, 'w', encoding='utf8') as f:
    f.write(code)

file = 'libs/common/graphql/src/plugins/gql-complexity.plugin.ts'
with open(file, 'r', encoding='utf8') as f:
    code = f.read()
code = code.replace('query: requestContext.document,', 'query: requestContext.document as any,')
with open(file, 'w', encoding='utf8') as f:
    f.write(code)
