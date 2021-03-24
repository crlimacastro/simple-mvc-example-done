const models = require('../models');
// get the Dog model
const Dog = models.Dog.DogModel;

const createDog = (req, res) => {
  if (!req.body.name || !req.body.breed || !req.body.age) {
    return res.status(400).json({ error: 'name,breed and age are all required' });
  }

  const dogData = {
    name: req.body.name,
    breed: req.body.breed,
    age: req.body.age,
  };
  const newDog = new Dog(dogData);

  const savePromise = newDog.save();
  savePromise.then(() => {
    res.json({
      name: newDog.name,
      breed: newDog.breed,
      age: newDog.age,
    });
  });

  // if error, return it
  savePromise.catch((err) => res.status(500).json({ err }));

  return res;
};

const searchDogName = (req, res) => {
  if (!req.query.name) {
    return res.status(400).json({ error: 'Name is required to perform a search' });
  }

  return Dog.findByName(req.query.name, (err, doc) => {
    if (err) {
      return res.status(500).json({ err });
    }

    if (!doc) {
      return res.json({ error: 'No dogs found' });
    }

    const dog = doc;
    dog.age++;
    const savePromise = dog.save();

    savePromise.catch((err2) => res.status(500).json({ err2 }));
    return savePromise.then(() => res.json(dog));
  });
};

const readAllDogs = (req, res, callback) => {
  Dog.find(callback).lean();
};

module.exports.createDog = createDog;
module.exports.searchDogName = searchDogName;
module.exports.readAllDogs = readAllDogs;
