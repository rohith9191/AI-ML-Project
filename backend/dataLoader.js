const fs = require('fs');
const csv = require('csv-parser');
const { connectDB, Exercise } = require('./db');
require('dotenv').config();

const loadData = async (filePath) => {
  await connectDB();
  
  const exercises = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      exercises.push({
        exercise_name: row.Exercise_Name,
        body_part: row.Body_Part,
        condition: row.Condition,
        equipment: row.Equipment,
        reps_sets: row.Reps_Sets,
        duration: row.Duration,
        intensity_level: row.Intensity_Level,
        goal: row.Goal
      });
    })
    .on('end', async () => {
      console.log('CSV file successfully processed. Clearing collection and importing...');
      try {
        await Exercise.deleteMany({});
        await Exercise.insertMany(exercises);
        console.log(`Successfully loaded ${exercises.length} exercises into MongoDB.`);
        process.exit(0);
      } catch (err) {
        console.error('Import Error:', err);
        process.exit(1);
      }
    });
};

loadData('../physical_therapy_exercises_dataset_10000 (1).csv');
