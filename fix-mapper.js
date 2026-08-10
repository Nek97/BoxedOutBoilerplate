const fs = require('fs');
const dir = 'libs/boxedout/manage-user/src/dto/';
fs.readdirSync(dir).forEach(f => {
  if (f.endsWith('.ts')) {
    let code = fs.readFileSync(dir + f, 'utf8');
    code = code.replace(/IFieldMapper/g, 'FieldMapper');
    code = code.replace(/IFieldAndFilterMapper/g, 'FieldAndFilterMapper');
    fs.writeFileSync(dir + f, code);
  }
});
let code = fs.readFileSync('libs/boxedout/manage-user/src/user-log.service.ts', 'utf8');
code = code.replace(/IFieldMapper/g, 'FieldMapper');
fs.writeFileSync('libs/boxedout/manage-user/src/user-log.service.ts', code);

code = fs.readFileSync('libs/boxedout/manage-user/src/dto/user.type.ts', 'utf8');
code = code.replace('UserForAgentFieldMap,', 'UserForAgentType,');
code = code.replace('UserGrid,', ''); // remove UserGrid export if not needed or leave it
fs.writeFileSync('libs/boxedout/manage-user/src/dto/user.type.ts', code);

console.log('Mapper fixed');
