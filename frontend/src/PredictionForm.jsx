import React, { useState } from "react";
import {
  Slider,
  Typography,
  Button,
  Grid,
  Box,
  TextField,
  MenuItem,
  Tooltip,
  Container,
} from "@mui/material";
import axios from "axios";

const featureLabels = {
  CRIM: "Crime Rate",
  ZN: "Residential Zone",
  INDUS: "Industrial Proportion",
  CHAS: "Charles River",
  NOX: "NOx Concentration",
  RM: "Average Rooms",
  AGE: "Age of Property",
  DIS: "Distance to Centers",
  RAD: "Highway Access",
  TAX: "Property Tax",
  PTRATIO: "Pupil-Teacher Ratio",
  B: "Black Population",
  LSTAT: "Lower Status %",
};

const tooltips = {
  CRIM: "Per capita crime rate by town",
  ZN: "Proportion of residential land zoned for lots >25,000 sq.ft.",
  INDUS: "Proportion of non-retail business acres per town",
  CHAS: "1 if tract bounds river; 0 otherwise",
  NOX: "Nitric oxide concentration (parts per 10 million)",
  RM: "Average number of rooms per dwelling",
  AGE: "Proportion of owner-occupied units built prior to 1940",
  DIS: "Weighted distances to employment centers",
  RAD: "Index of accessibility to radial highways",
  TAX: "Full-value property-tax rate per $10,000",
  PTRATIO: "Pupil-teacher ratio by town",
  B: "1000(Bk - 0.63)^2 where Bk is the proportion of blacks by town",
  LSTAT: "Percentage of lower status population",
};

const sliderMax = {
  CRIM: 100,
  NOX: 1,
  TAX: 700,
  PTRATIO: 25,
  B: 400,
  LSTAT: 40,
};

const PredictionForm = () => {
  const [inputs, setInputs] = useState({
    CRIM: 0,
    ZN: 0,
    INDUS: 0,
    CHAS: 0,
    NOX: 0,
    RM: 0,
    AGE: 0,
    DIS: 0,
    RAD: 0,
    TAX: 0,
    PTRATIO: 0,
    B: 0,
    LSTAT: 0,
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSliderChange = (key) => (event, value) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handlePredict = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", inputs);
      setPrediction(response.data.price);
    } catch (err) {
      console.error(err);
      alert("Error predicting price");
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage:
          "url('https://i.pinimg.com/1200x/d5/b5/77/d5b577b2c86e17e99bb32d2a1db913b5.jpg')",
        backgroundSize: "100%",
        backgroundPosition: "center 85%",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
      }}
    >
      {/* Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(255, 255, 255, 0.36)",
          zIndex: 1,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: "bold",
            mb: 4,
            textAlign: "center",
            color: "#000000ff",
          }}
        >
          Boston House Price Prediction
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {/* Slider features */}
          {["CRIM", "NOX", "TAX", "PTRATIO", "B", "LSTAT"].map((key) => (
            <Grid item xs={12} sm={6} key={key}>
              <Tooltip title={tooltips[key]} arrow>
                <Typography variant="h6" gutterBottom>
                  {featureLabels[key]} ({inputs[key]})
                </Typography>
              </Tooltip>
              <Slider
                value={inputs[key]}
                min={0}
                max={sliderMax[key]}
                step={key === "NOX" ? 0.01 : 0.1}
                onChange={handleSliderChange(key)}
                valueLabelDisplay="auto"
              />
            </Grid>
          ))}

          {/* Text fields for RM, AGE, DIS */}
          {["RM", "AGE", "DIS"].map((key) => (
            <Grid item xs={12} sm={6} key={key}>
              <Tooltip title={tooltips[key]} arrow>
                <Typography variant="h6" gutterBottom>
                  {featureLabels[key]}
                </Typography>
              </Tooltip>
              <TextField
                type="number"
                name={key}
                value={inputs[key]}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
              />
            </Grid>
          ))}

          {/* Select CHAS */}
          <Grid item xs={12} sm={6}>
            <Tooltip title={tooltips["CHAS"]} arrow>
              <Typography variant="h6" gutterBottom>
                {featureLabels["CHAS"]}
              </Typography>
            </Tooltip>
            <TextField
              select
              name="CHAS"
              value={inputs.CHAS}
              onChange={handleInputChange}
              fullWidth
            >
              <MenuItem value={0}>No</MenuItem>
              <MenuItem value={1}>Yes</MenuItem>
            </TextField>
          </Grid>

          {/* Select RAD & ZN */}
          {["RAD", "ZN"].map((key) => (
            <Grid item xs={12} sm={6} key={key}>
              <Tooltip title={tooltips[key]} arrow>
                <Typography variant="h6" gutterBottom>
                  {featureLabels[key]}
                </Typography>
              </Tooltip>
              <TextField
                select
                name={key}
                value={inputs[key]}
                onChange={handleInputChange}
                fullWidth
              >
                {[...Array(25).keys()].map((val) => (
                  <MenuItem key={val} value={val}>
                    {val}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          ))}

          {/* Fixed slider for INDUS */}
          <Grid item xs={12} sm={6}>
            <Tooltip title={tooltips["INDUS"]} arrow>
              <Typography variant="h6" gutterBottom>
                {featureLabels["INDUS"]} ({inputs["INDUS"]})
              </Typography>
            </Tooltip>
            <Slider
              value={inputs["INDUS"]}
              min={0}
              max={30}
              step={0.1}
              onChange={handleSliderChange("INDUS")}
              valueLabelDisplay="auto"
            />
          </Grid>
        </Grid>

        {/* Predict button & result */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 4,
          }}
        >
          <Button
            variant="contained"
            onClick={handlePredict}
            sx={{
              px: 6,
              py: 3,
              fontSize: "1.3rem",
              backgroundColor: "#3f9494ff",
              "&:hover": { backgroundColor: "#115293" },
            }}
            disabled={loading}
          >
            {loading ? "Predicting..." : "Predict"}
          </Button>

          {prediction !== null && (
            <Typography
              variant="h5"
              sx={{ mt: 2, fontWeight: "bold", color: "#000000ff" }}
            >
              Predicted Price: ${prediction.toFixed(2)}
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default PredictionForm;