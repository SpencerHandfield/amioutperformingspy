import { Line } from 'react-chartjs-2'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../../node_modules/bootstrap-icons/font/bootstrap-icons.css';
import Popup from './Popup'
import React, {useState, useEffect} from 'react'
import {
  Chart as ChartJS, 
  LineElement, 
  CategoryScale,
  LinearScale,
  PointElement
} from 'chart.js'
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
)
let defaultLine = {
  labels: null,
  datasets: [{
      data: null,
      borderColor: '#f5f5f7',
      backgroundColor: '#f5f5f7',
      showLine: true,
      fill: false,
      pointRadius: 0
  },
  {
      data: null,
      borderColor: 'red',
      backgroundColor: 'red',
      showLine: true,
      fill: false,
      pointRadius: 0 
  }]
}
function Chart() {
  const [ticker, setTicker] = useState("init-wxyz")
  const [year, setYear] = useState(1)
  const [data, setData] = useState({})
  const [hasResponded, setHasResponded] = useState(false)
  const [colour, setColour] = useState("red")
  const [lineOptions, setLineOptions] = useState(defaultLine)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
      fetchData()
  }, [year])

  useEffect(() => {
    setLineOptions({
      labels: data['spy_labels'],
      datasets: [{
          data: data['spy_values'],
          borderColor: '#f5f5f7',
          backgroundColor: '#f5f5f7',
          showLine: true,
          fill: false,
          pointRadius: 0
        },
        {
          data: data['user_values'],
          borderColor: colour,
          backgroundColor: colour,
          showLine: true,
          fill: false,
          pointRadius: 0 
      }]
    })
  }, [data, colour])

  const fetchData = async () => {
      let json = {
          "user_ticker": ticker,
          "user_year": year
      }
      //fetch("http://localhost:5000/views/home", {
      fetch("https://flask-serviceprint2.v81km8ek1r70a.us-east-2.cs.amazonlightsail.com/views/home", {
          'method': 'POST',
          body: JSON.stringify(json)
      }).then(
          res => res.json()
      ).then(
          data => {
              setData(data)
          }
      )
  }

  const handleSubmit = async(e) => {
      e.preventDefault();
      await fetchData().then(
        setHasResponded(true)
      )
    };

  const updateTicker = (e) => {
      e.preventDefault();
      setTicker(e.target.value);
  };

  const updateYear = (e) => {
      setYear(e.target.value);
      setHasResponded(true)
  };

  const otherOptions =  {
      scales: {
        x: {
          display: false,
          ticks: {
            display: false
          },
          grid: {
            display: false
          }
        },
        y: {
          display: false,
          ticks: {
            display: false
          },
          grid: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          display: true
        }
      }
  }
  
  return (
    <div class="container-fluid">
        <h1>Am I outperforming SPY?</h1>
        <i class="bi bi-info-circle" id="icon" data-bs-toggle="tooltip" title="Largely used as a litmus test for long term growth, compare various stocks such as MSFT, NVDA or AAPL and see if you're smarter than the market!"></i>
      <div class = "row">
            <div class="col-7" id="chart-col" align="center">
              <div class="wrapper">
                  <div class="chart-div">
                      <Line data={lineOptions} options={otherOptions}></Line>
                  </div>
                </div>
            </div>
            <div class="col-5" id="form-col" align="center">
              <div class="wrapper">
                <div>
                    <form onSubmit={handleSubmit}>
                      <div class="form-div">
                        <input type="text" class="form-control" placeholder="Ticker Symbol" onChange={updateTicker}></input>
                        <input type="submit" class="form-button" name="btn" value="Submit"></input>
                      </div>
                      <label for="period" class="label-period">Period:</label>
                      <input type="radio" id="year1"name="btn" class="radio" value="1" onChange={updateYear} defaultChecked></input>
                      <label for="year1" class="label label-1">1Y</label>
                      <input type="radio" id="year2" name="btn" class="radio" value="2" onChange={updateYear}></input>
                      <label for="year2" class="label label-2">2Y</label>
                      <input type="radio" id="year5" name="btn" class="radio" value="5" onChange={updateYear}></input>
                      <label for="year5" class="label label-5">5Y</label>
                      <input type="radio" id="year10" name="btn" class="radio" value="10" onChange={updateYear}></input>
                      <label for="year10" class="label label-10">10Y</label>
                    </form>
                </div>
                <div>
                    {hasResponded && <Popup data={data} setColour={setColour}></Popup>}
                </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Chart
