const Dialog = require('../models/dialog');
const Mes = require('../models/message');
const User = require('../models/user');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


class DialogMessageServices {

     static async addDialog (body) {
        const findDialog = await Dialog.findOne({$or: [
                        {$and: [{'person': body.person[0]}, {'person': body.person[1]}]},
                        {$and: [{'person': body.person[1]}, {'person': body.person[0]}]}
                        ]});
        if (findDialog) {
            return findDialog;
        }

        const dialog = new Dialog(body);
        await dialog.save();

        return dialog;
    }

    static async addMes (body) {
        const dialog = await Dialog.findOne({_id: body.dialog});

        if (!dialog) {
            throw new Error("dialog not found!");
        }

        const message = new Mes(body);
        await message.save();

        return await User.populate(message, {path: 'user'});
    }

    static async delDialog(id){
        await Dialog.deleteOne({_id: id.toString()});
        await Mes.deleteMany({dialog: ObjectId(id)});

        return id;
    }

    static async delMes(id){
        await Mes.deleteOne({_id: id.toString()});

        return id
    }

    static async editDialog(body){
        return await Dialog.findOneAndUpdate({_id: body._id.toString()}, body);
    }

    static async editMes(body){
        return await Mes.findOneAndUpdate({_id: body._id.toString()}, body);
    }

    static async getDialog(dialogId){
        return await Dialog.findOne({_id: dialogId.toString()});
    }

    static async getDialogs(userId){
        const id = ObjectId(userId);
        return await Dialog.aggregate([
            {$match: { person: {$all:   [id] } }},
            { $addFields:
                    { persons:
                            {$filter:
                                    {
                                        input: "$person", as: "id", cond:
                                            {$ne: ["$$id", userId]}
                                    }
                            }
                    }
            },
            {$unwind: "$persons" },
            {
                $lookup: {
                    from: "users",
                    localField: 'persons',
                    foreignField: '_id',
                    as: "persons"
                }
            },
            {$unwind: "$persons" },
            {$unset: ['person','__v', 'persons.password', 'persons.tokens', 'persons.__v', 'updatedAt']}
        ]);
    }

     static async getAllDialogs(){
        return await Dialog.find({}).select('_id');
    }

    static async getMessages(dialogId){
        const dialog = await Dialog.findOne({_id: ObjectId(dialogId)});
        const mes = await Mes.find({dialog: dialogId.toString()}).populate('user');
        return {mes, dialog};
    }

}

module.exports = DialogMessageServices;
