const cloudinary = require('cloudinary').v2

cloudinary.config({ 
    cloud_name: 'dzinbpitv', 
    api_key: '246763532629247', 
    api_secret: '94-TECFB3cMqa5FHQGaiB7xR6EE' 
  });

module.exports = cloudinary;