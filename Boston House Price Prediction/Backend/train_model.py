import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.impute import SimpleImputer
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np
import joblib

# 1️⃣ Load dataset
data = pd.read_csv("data/boston.csv")

# 2️⃣ Handle missing values
X = data.drop("MEDV", axis=1)
y = data["MEDV"]
imputer = SimpleImputer(strategy="mean")
X = pd.DataFrame(imputer.fit_transform(X), columns=X.columns)

# 3️⃣ Split dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4️⃣ Train model using Gradient Boosting
model = GradientBoostingRegressor(
    n_estimators=200,       # Number of boosting stages
    learning_rate=0.1,      # Step size shrinkage
    max_depth=3,            # Maximum depth of each tree
    random_state=42
)
model.fit(X_train, y_train)

# 5️⃣ Evaluate
y_pred = model.predict(X_test)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred)
print("RMSE:", rmse)
print("R2 Score:", r2)

# 6️⃣ Save model
joblib.dump(model, "boston_model_gb.pkl")
print("Model saved as boston_model_gb.pkl")