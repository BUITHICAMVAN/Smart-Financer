import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { InnerLayout } from '../../styles/Layouts';
import ForecastTable from '../../components/tables/ForecastTable';

const mockForecastData = {
  months: [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ],
  categories: [
    {
      key: 'income',
      category: 'Income',
      children: [
        { key: 'base-salary', category: 'Base Salary', january: 5000, february: 5200, march: 5100, april: 5300, may: 5400, june: 5500, july: 5600, august: 5700, september: 5800, october: 5900, november: 6000, december: 6100 },
        { key: 'side-hustles', category: 'Side Hustles', january: 500, february: 600, march: 550, april: 650, may: 600, june: 700, july: 750, august: 800, september: 850, october: 900, november: 950, december: 1000 },
        { key: 'bonus', category: 'Bonus', january: 1000, february: 0, march: 0, april: 0, may: 1000, june: 0, july: 0, august: 0, september: 0, october: 0, november: 1000, december: 0 },
        { key: 'investments', category: 'Investments', january: 200, february: 300, march: 250, april: 350, may: 300, june: 400, july: 450, august: 500, september: 550, october: 600, november: 650, december: 700 },
      ]
    },
    {
      key: 'expenses',
      category: 'Expenses',
      children: [
        {
          key: 'essentials',
          category: 'Essentials',
          children: [
            { key: 'renting', category: 'Renting', january: 1000, february: 1000, march: 1000, april: 1000, may: 1000, june: 1000, july: 1000, august: 1000, september: 1000, october: 1000, november: 1000, december: 1000 },
            { key: 'groceries', category: 'Groceries', january: 500, february: 600, march: 550, april: 650, may: 600, june: 700, july: 750, august: 800, september: 850, october: 900, november: 950, december: 1000 },
            { key: 'billings', category: 'Billings (electric, internet, water, ...)', january: 200, february: 250, march: 230, april: 270, may: 260, june: 300, july: 320, august: 350, september: 370, october: 400, november: 420, december: 450 },
            { key: 'transport', category: 'Transport (gas, uber, ...)', january: 150, february: 180, march: 160, april: 190, may: 170, june: 200, july: 220, august: 240, september: 260, october: 280, november: 300, december: 320 },
          ]
        },
        {
          key: 'non-essentials',
          category: 'Non-Essentials',
          children: [
            { key: 'coffee', category: 'Coffee', january: 50, february: 60, march: 55, april: 65, may: 60, june: 70, july: 75, august: 80, september: 85, october: 90, november: 95, december: 100 },
            { key: 'leisure', category: 'Leisure Activities', january: 100, february: 120, march: 110, april: 130, may: 120, june: 140, july: 150, august: 160, september: 170, october: 180, november: 190, december: 200 },
            { key: 'shopping', category: 'Shopping', january: 200, february: 250, march: 230, april: 270, may: 260, june: 300, july: 320, august: 350, september: 370, october: 400, november: 420, december: 450 },
          ]
        }
      ]
    },
    {
      key: 'savings',
      category: 'Savings',
      children: [
        { key: 'house', category: 'Properties - House', january: 500, february: 600, march: 550, april: 650, may: 600, june: 700, july: 750, august: 800, september: 850, october: 900, november: 950, december: 1000 },
        { key: 'retirement', category: 'Retirement', january: 300, february: 400, march: 350, april: 450, may: 400, june: 500, july: 550, august: 600, september: 650, october: 700, november: 750, december: 800 },
        { key: 'emergency', category: 'Emergency', january: 200, february: 300, march: 250, april: 350, may: 300, june: 400, july: 450, august: 500, september: 550, october: 600, november: 650, december: 700 },
        { key: 'savings', category: 'Savings', january: 400, february: 500, march: 450, april: 550, may: 500, june: 600, july: 650, august: 700, september: 750, october: 800, november: 850, december: 900 },
        { key: 'travel', category: 'Travel', january: 100, february: 200, march: 150, april: 250, may: 200, june: 300, july: 350, august: 400, september: 450, october: 500, november: 550, december: 600 },
      ]
    }
  ]
};

const ForecastPage = () => {
  const [forecastData, setForecastData] = useState(mockForecastData);

  useEffect(() => {
    // Here, you would fetch real forecast data if needed
    // For now, we're using the mock data
  }, []);

  return (
    <ForecastPageStyled>
      <InnerLayout>
        <div className="container">
          <h3 className="text-center">12-Month Forecast</h3>
          <ForecastTable data={forecastData} />
        </div>
      </InnerLayout>
    </ForecastPageStyled>
  );
};

const ForecastPageStyled = styled.div`
  .container {
    h3 {
      text-align: center;
      margin-bottom: 2rem;
      font-size: 1.5rem;
      font-weight: 600;
    }
  }
`;

export default ForecastPage;
