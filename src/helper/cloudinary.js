const { uploader } = require('cloudinary').v2
const cloudinary = require('cloudinary').v2


cloudinary.config({ 
    cloud_name: 'dzinbpitv', 
    api_key: '246763532629247', 
    api_secret: '94-TECFB3cMqa5FHQGaiB7xR6EE' 
  });

  async function upload(pathFile) {
    try {
        let result = await uploader.upload(pathFile, {
            folder: 'assets',
            use_filename: true
        })
        return result.url
    } catch (error) {
        return error
    }
}

module.exports = upload
