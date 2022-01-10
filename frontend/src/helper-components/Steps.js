import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

const steps = [
  {
    label: <h4>Shipping Details</h4>,
  },
  {
    label: <h4>Confirm Order</h4>,
  },
  {
    label: <h4>Payment</h4>,
  },
];

export default function Steps({ activeStep = 0 }) {
  return (
    <Box className="w-full px-1 sm:px-10">
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((item, index) => {
          return (
            <Step key={index}>
              <StepLabel>{item.label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}
