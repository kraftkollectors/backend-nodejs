// move data from one mongodb to another

// import mongo
const { MongoClient } = require('mongodb');
// Connect to the source database
var sourceUri = 'mongodb+srv://'

// Connect to the target database
var targetUri = 'mongodb+srv://'

async function transferData() {
    // Create a new MongoClient
    const sourceClient = new MongoClient(sourceUri);
    const targetClient = new MongoClient(targetUri);

    try {
        // Connect to the source and target databases
        await sourceClient.connect();
        await targetClient.connect();

        console.log('Connected successfully to both databases');

        const sourceDb = sourceClient.db('churchil');
        const targetDb = targetClient.db('churchil');

        // Get the list of collections from the source database
        const collections = await sourceDb.listCollections().toArray();        

        // Loop through each collection and transfer the data
        for (let collection of collections) {
            const collectionName = collection.name;
            const data = await sourceDb.collection(collectionName).find().toArray();

            if (data.length > 0) {
                await targetDb.collection(collectionName).insertMany(data);
                console.log(`Transferred ${data.length} documents from ${collectionName}`);
            } else {
                console.log(`No documents found in ${collectionName}`);
            }
        }

        // after running
        console.log('Data transfer complete');
    } catch (err) {
        console.error('Error occurred during data transfer:', err);
    } finally {
        // Close the connections
        await sourceClient.close();
        await targetClient.close();
    }
}

transferData();