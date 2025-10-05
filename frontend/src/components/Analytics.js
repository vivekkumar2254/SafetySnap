
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Form, Row, Col, Card } from 'react-bootstrap';
import './Analytics.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [chartData, setChartData] = useState(null);
  const [labels, setLabels] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState('');

  useEffect(() => {
    fetchLabels();
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [selectedLabel]);

  const fetchLabels = async () => {
    try {
      const res = await axios.get('https://safetysnap-43yb.onrender.com/api/labels');
      setLabels(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get('https://safetysnap-43yb.onrender.com/api/images', {
        params: {
          label: selectedLabel,
        },
      });
      const images = res.data;
      const labelCounts = {};
      images.forEach((image) => {
        image.detections.forEach((detection) => {
          labelCounts[detection.label] = (labelCounts[detection.label] || 0) + 1;
        });
      });

      setChartData({
        labels: Object.keys(labelCounts),
        datasets: [
          {
            label: 'Detections',
            data: Object.values(labelCounts),
            backgroundColor: 'rgba(75, 192, 192, 0.8)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="analytics-container">
      <h2 className="mb-4">Detection Analytics</h2>
      <Row className="mb-4 filter-form">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Filter by Label</Form.Label>
            <Form.Control
              as="select"
              value={selectedLabel}
              onChange={(e) => setSelectedLabel(e.target.value)}
            >
              <option value="">All Labels</option>
              {labels.map((label) => (
                <option key={label} value={label}>
                  {label}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <Card className="shadow-sm chart-card">
        <Card.Body>
          {chartData ? (
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: selectedLabel ? `Detections for ${selectedLabel}` : 'All Detections',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1,
                    },
                  },
                },
              }}
            />
          ) : (
            <p>Loading chart data...</p>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Analytics;
