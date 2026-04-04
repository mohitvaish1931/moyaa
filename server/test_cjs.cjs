const mongoose = require('mongoose');
console.log('Mongoose is present:', !!mongoose);
console.log('Mongoose version:', mongoose.version);
console.log('Mongoose Schema:', !!mongoose.Schema);
console.log('Mongoose connect:', !!mongoose.connect);
console.log('Keys:', Object.keys(mongoose).slice(0, 10));
process.exit(0);
