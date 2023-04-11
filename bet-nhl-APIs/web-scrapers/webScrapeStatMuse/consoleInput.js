
 function prompter(msg){
  let fs = require('fs');
  fs.writeSync(1, String(msg));
  let s = '', buf = Buffer.alloc(1);
  while(buf[0] - 10 && buf[0] - 13)
    s += buf, fs.readSync(0, buf, 0, 1, 0);
  return s.slice(1);
}


module.exports = prompter;