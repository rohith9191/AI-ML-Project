import pandas as pd
from app import app, db
from models import Exercise

def load_data(file_path):
    with app.app_context():
        # Clear existing exercises to avoid duplicates during dev
        Exercise.query.delete()
        
        df = pd.read_csv(file_path)
        exercises = []
        for _, row in df.iterrows():
            exercise = Exercise(
                exercise_name=row['Exercise_Name'],
                body_part=row['Body_Part'],
                condition=row['Condition'],
                equipment=row['Equipment'],
                reps_sets=row['Reps_Sets'],
                duration=row['Duration'],
                intensity_level=row['Intensity_Level'],
                goal=row['Goal']
            )
            exercises.append(exercise)
        
        db.session.bulk_save_objects(exercises)
        db.session.commit()
        print(f"Successfully loaded {len(exercises)} exercises.")

if __name__ == "__main__":
    load_data("../physical_therapy_exercises_dataset_10000 (1).csv")
