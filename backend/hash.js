// hash.js
import bcrypt from 'bcrypt';

async function makeHash(pw) {
  const hash = await bcrypt.hash(pw, 10);
  console.log(hash);
}

makeHash(process.argv[2] || 'changeme');
