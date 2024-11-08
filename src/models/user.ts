import mongoose from "mongoose";


// Schemas define the structure of the documents in the collection.
// It maps to a collection of documents in the MongoDB database.
// Th edoc will contain the fields/schema defined in the model schema
const userSchema = new mongoose.Schema({
    
    auth0Id : {
        type: String,
        required: true
    
    },
    email : {
        type: String,
        required: true
    },
    name : {
        type: String,
    },
    addressLine1 : {
        type : String,  
    },
    city : {
        type : String,
    }, 
    country : {
        type: String,
    }
});

// Models are created from schemas using the mongoose.model() method
const User = mongoose.model("User", userSchema);
export default User;