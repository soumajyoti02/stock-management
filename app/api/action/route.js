import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function POST(request) {
    // Replace the uri string with your connection string.
    let { action, slug, initialQuantity } = await request.json()
    const uri = "mongodb+srv://soumyabwn3:qQixdl1WElcr1RpH@cluster0.7dqtzbx.mongodb.net/";

    const client = new MongoClient(uri);
    try {
        const database = client.db('stock');
        const inventory = database.collection('inventory');
        const filter = { slug: slug };

        let newQuantity = action == "plus" ? (parseInt(initialQuantity) + 1) : (parseInt(initialQuantity) - 1)
        const updateDoc = {
            $set: {
                quantity: newQuantity
            },
        };
        // Update the first document that matches the filter
        const result = await inventory.updateOne(filter, updateDoc, {});

        // Print the number of matching and modified documents
        return NextResponse.json({ success: true, message: `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)` })
    } finally {
        // Close the connection after the operation completes
        await client.close();
    }
}
