const Schema = mongoose.Schema;
const ObjectId = schema.ObjectId;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    }
})

