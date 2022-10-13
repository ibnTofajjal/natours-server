const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

// MIDDLEWARES =============================
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
  console.log('Hello from the middleware ✋');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// ROUTES HANDLERS ===========================
const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestTime: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getOneTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'FAILED',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const creatTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'FAILED',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: `[UPDATED TOUR HERE]`,
    },
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'FAILED',
      message: 'Invalid ID',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// ROUTES ===========================
app.route('/api/v1/tours').get(getAllTours).post(creatTour);
app
  .route('/api/v1/tours/:id')
  .get(getOneTour)
  .patch(updateTour)
  .delete(deleteTour);

// ------------------------------
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server Running On PORT ${PORT}`);
});
