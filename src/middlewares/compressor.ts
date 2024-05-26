const zlib = require('zlib')

async function compressSent (data: any){
    try {
        data = JSON.stringify(data); 
        // Convert the JSON string to a Buffer
        data = Buffer.from(data);
        // Compress the data
        return zlib.gzipSync(data);
    } catch (error) {
        console.error('Decompression error:', error);
        throw new Error('Error during decompression');
    }
}



async function decompressSent (data: any){
    try {
        // Decode base64 string to Buffer
        data = Buffer.from(data, 'base64');

        // Decompress the Buffer
        data = zlib.gunzipSync(data);

        // Parse the decompressed data back to the array of products
        return JSON.parse(data.toString());
    } catch (error) {
        console.error('Decompression error:', error);
        throw new Error('Error during decompression');
    }
}


module.exports = {
    compressSent,
    decompressSent
};