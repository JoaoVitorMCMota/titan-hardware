import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    usuario:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    produtos: [
        {
            produto:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product",
            },
            quantidade:{
                type:Number,
                default:1,
                required:true
            }
        }
    ]
}, { timestamps: true });

export default mongoose.model("Cart",cartSchema);