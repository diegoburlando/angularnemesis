//The following query executed in the mongo shell allows to replace fields and perform bulk update

var curs = db.BachFlowers.aggregate([
    {
        "$project": {
            "Name": "$Name",
            "Description": "$Description",
            "ImagePath": { "$concat": ["https://algorithmnemesis.cloud/assets/images/Flowers/", { "$substr": ["$ImagePath", 33, -1] }] }
        }
    }
]);

while (curs.hasNext()) {

    var currentDocument = curs.next();
    db.BachFlowers.updateOne({ _id: currentDocument._id }, { $set: { "ImagePath": currentDocument.ImagePath } });
    print(currentDocument);

} 