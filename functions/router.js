
const getCollection = (collectionName, db) => {
	return db.collection(collectionName).get();
};
const getDocument = (collectionName, documentName, db) => {
	return db.collection(collectionName)
		.doc(documentName)
		.get();
};
const postToDocument = (collectionName, documentName, data, db) => {
	return db.collection(collectionName)
		.doc(documentName)
		.set(data);
};
const mergeSubCollectionFields = (subCollection) => {
	const json = {};

	subCollection.forEach((field) => {
		json[`${field.id}`] = field.data();
	});
	return json;
};

exports.getCollection = getCollection;
exports.getDocument = getDocument;
exports.postToDocument = postToDocument;
exports.mergeSubCollectionFields = mergeSubCollectionFields;