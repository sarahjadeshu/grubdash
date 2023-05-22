const path = require("path");

const dishes = require(path.resolve("src/data/dishes-data"));

const nextId = require("../utils/nextId");


// POST
function create(req, res) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  const dishId = nextId();
  const newDish = {
    id: dishId,
    name,
    description,
    price,
    image_url,
  };
  dishes.push(newDish);
  res.status(201).json({ data: newDish });
};


// VALIDATE
function hasName(req, res, next) {
  const { data: { name } = {} } = req.body;

  if (name) {
    return next();
  }
  next({ status: 400, message: "Dish must include a name" });
};

function hasDescription(req, res, next) {
  const { data: { description } = {} } = req.body;

  if (description && description !== "") {
    return next();
  }
  next({ status: 400, message: "Dish must include a description" });
};

function hasPrice(req, res, next) {
  const { data: { price } = {} } = req.body;
  if (!price) {
    next({ status: 400, message: "Dish must include a price" });
  } else if (!Number.isInteger(price)) {
    next({ status: 400, message: "Dish must have a price that is an integer greater than 0" });
  } else if (price < 0) {
    next({ status: 400, message: "Dish must have a price that is an integer greater than 0" });
  } else {
    return next();
  }
};


function hasImage(req, res, next) {
  const { data: { image_url } = {} } = req.body;

  if (image_url) {
    return next();
  }
  next({ status: 400, message: "Dish must include a image_url" });
};

function dishExists(req, res, next) {
  const dishId = req.params.dishId;
  const foundDish = dishes.find((dish) => (dish.id = dishId));
  if (foundDish) {
    res.locals.dish = foundDish;
    return next();
  }
  next({
    status: 404,
    message: `Dish id not found: ${req.params.dishId}`,
  });
};

function ifDishId(req, res, next) {
  const dishId = req.params.dishId;
  const { data: { id } = {} } = req.body;
  if (!id) {
    next();
  } else if (id === dishId) {
    next();
  } else {
    next({ status: 400, message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`});
  }
};


// GET
function list(req, res) {
  res.json({ data: dishes });
};

function read(req, res) {
  const dishId = req.params.dishId;
  const foundDish = dishes.find((dish) => (dish.id = dishId));
  res.json({ data: foundDish });
};

// PUT
function update(req, res, next) {
  const dishId = req.params.dishId;
  const foundDish = dishes.find((dish) => (dish.id = dishId));

  const { data: { id, name, description, price, image_url } = {} } = req.body;

  foundDish.id = `${dishId}`;
  foundDish.name = name;
  foundDish.description = description;
  foundDish.price = price;
  foundDish.image_url = image_url;
  
  res.json({ data: foundDish });
}

module.exports = {
  create: [hasName, hasDescription, hasPrice, hasImage, create],
  list,
  read: [dishExists, read],
  update: [dishExists, hasName, hasDescription, hasPrice, hasImage, ifDishId, update],
};
