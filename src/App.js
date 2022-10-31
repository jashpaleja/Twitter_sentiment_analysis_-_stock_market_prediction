import logo from "./logo.svg";
import "./App.css";
import {
  Button,
  Col,
  Container,
  FormControl,
  InputGroup,
  Row,
  Card,
  Table,
  Spinner,
} from "react-bootstrap";
import { Pie, Line } from "react-chartjs-2";
import { Chart as ChatJS } from "chart.js/auto";
import axios from "axios";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faCaretUp,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";

function App() {
  const [url, seturl] = useState("http://127.0.0.1:8000");
  const [winners, setWinners] = useState([]);
  const [winnerDVal, setWinnerDVal] = useState(10);
  const [losers, setLosers] = useState([]);
  const [loserDVal, setLoserDVal] = useState(10);
  const [stockName, setStockName] = useState("");
  const [pieData, setPieData] = useState("");
  const [twitterCount, setTwitterCount] = useState(0);
  const [tickerData, setTickerData] = useState("");
  const [graphLabel, setGraphLabel] = useState("");
  const [graphData, setGraphData] = useState("");
  const [futureGraphLabel, setFutureGraphLabel] = useState("");
  const [futureGraphData, setFutureGraphData] = useState("");
  const [dropDownData, setDropDownData] = useState("");
  const [dropDownSpinner, setDSpinner] = useState(false);
  const [graphSpinner, setGSpinner] = useState(false);
  const [pieSpinner, setPSpinner] = useState(false);
  const [priceChange, setPriceChange] = useState("");
  const [percentChange, setPercentChange] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [selectData, setSelectData] = useState([]);
  // const [currentStock, setCurrentStock] = useState("");
  const [n, setN] = useState(100);
  const [label, setLabel] = useState("");

  const analyze = async (value) => {
    setPSpinner(true);
    const response = await axios.get(`${url}/sentiment/${stockName}/${n}`);
    console.log("Analysis data", response.data.sentiment);
    setTwitterCount(response.data.sentiment.total_count);
    let array = [];
    array.push(response.data.sentiment.positive_count);
    array.push(response.data.sentiment.negative_count);
    array.push(response.data.sentiment.neutral_count);
    console.log("Array", array);
    setPSpinner(false);
    setPieData(array);
  };

  const ticker = async (value) => {
    setDSpinner(true);
    console.log("ticker fucntion", value);
    const response = await axios.get(`${url}/ticker?search=${value}`);
    console.log("Ticker data", response.data);
    setTickerData(response.data.ticker_list);
    const selectDat = [];
    response.data.ticker_list.map((item) => {
      const itemData = {
        label: `${item.shortName} (${item.symbol})`,
        value: item.symbol,
      };
      selectDat.push(itemData);
    });
    console.log(selectDat);
    setSelectData(selectDat);
    setDSpinner(false);
  };

  const yahoo = async (value) => {
    setGSpinner(true);
    let filteredByKey = null;
    let prChange = null;
    let perChange = null;
    let currPrice = null;
    for (var i = 0; i < tickerData.length; i++) {
      if (tickerData[i].symbol == value) {
        filteredByKey = tickerData[i].shortName;
        prChange = tickerData[i].regularMarketChange;
        perChange = tickerData[i].regularMarketPercentChange;
        currPrice = tickerData[i].regularMarketPrice;
        // console.log(tickerData[i]);
      }
    }
    setLabel(filteredByKey);
    setPriceChange(prChange);
    setPercentChange(perChange);
    setCurrentPrice(currPrice);
    const response = await axios.get(`${url}/historical?ticker=${value}`);
    console.log("Yahoo data", response.data.historical);
    setGraphLabel(response.data.historical.label);
    setGraphData(response.data.historical.data);
    setFutureGraphLabel(response.data.prediction.label);
    setFutureGraphData(response.data.prediction.data);
    setGSpinner(false);
  };

  useEffect(() => {
    const data = async () => {
      const response = await axios.get(`${url}/top`);
      console.log("Response data", response.data);
      setWinners(response.data.winners_data);
      setLosers(response.data.losers_data);
    };
    data();
    // yahoo("tcs");
    console.log("wtf", label == "");
    setLabel("");
  }, []);

  return (
    <div className="mx-5 my-5">
      {/* <Container> */}
      <InputGroup className="mb-3">
        {/* <Row> */}
        <Col md={4} className="my-2 mx-2">
          <FormControl
            placeholder="Stock-Name"
            onChange={(e) => {
              setStockName(e.target.value);
              // console.log(e.target.value);
            }}
          />
        </Col>
        <Col md={4} className="my-2 mx-2">
          <FormControl
            placeholder="Enter number of tweets to scan"
            onChange={(e) => {
              setN(e.target.value);
            }}
            type="number"
          />
        </Col>
        {/* <Col md={4} className="my-2"></Col> */}
        {/* <Col md={3} className="my-2"></Col> */}
        <Col className="my-2 mx-2">
          <Button
            variant="primary"
            id="button-addon2"
            onClick={() => {
              // analyze(stockName);
              ticker(stockName);
              setPieData("");
              setTwitterCount(0);
              setTickerData("");
              setGraphLabel("");
              setGraphData("");
              setDropDownData("");
              setLabel("");
              setCurrentPrice("");
              setPriceChange("");
              setPercentChange("");
              setSelectData([]);
              // setCurrentStock("");
            }}
            style={{ width: 100 }}
          >
            Go
          </Button>
        </Col>
        {/* </Row> */}
      </InputGroup>
      <Row className="my-5">
        <Col md={9}>
          <Col md={8}>
            {tickerData != "" && dropDownData == "" ? (
              <Card>
                We Found matches to your search (Please select one to proceed)
                {/* <select
                  onChange={(e) => {
                    yahoo(e.target.value);
                    analyze(e.target.value);
                    setDropDownData(e.target.value);
                    setPieData('');
                    setTwitterCount(0);
                    setGraphLabel('');
                    setGraphData('');

                    setFutureGraphLabel('');
                    setFutureGraphData('');
                    // setCurrentStock("");
                    console.log('Values of ticker', e.target.value);
                  }}
                >
                  <option value={null} disabled selected hidden>
                    Company Name
                  </option>
                  {tickerData.map((item, index) => (
                    // <tr>
                    //   <td>{item.shortName}</td>
                    //   <td>{item.exchange}</td>
                    // </tr>
                    <option value={item.symbol}>
                      {item.shortName} ({item.exchange})
                    </option>
                  ))}
                </select> */}
                <Select
                  options={selectData}
                  onChange={(e) => {
                    console.log(e.value);
                    yahoo(e.value);
                    analyze(e.value);
                    setDropDownData(e.value);
                    setPieData("");
                    setTwitterCount(0);
                    setGraphLabel("");
                    setGraphData("");

                    setFutureGraphLabel("");
                    setFutureGraphData("");
                  }}
                />
              </Card>
            ) : dropDownSpinner ? (
              <Spinner
                animation="border"
                variant="dark"
                style={{ marginLeft: "48%", marginBottom: 20, marginTop: 10 }}
              />
            ) : null}
          </Col>
          <Col md={12}>
            {label != "" ? (
              <Card
                style={{
                  borderRadius: 12,
                  // marginBottom: 30,
                  marginTop: 100,
                  fontFamily: "sans-serif",
                }}
                className="boxShadow"
              >
                <div style={{ padding: 10 }}>
                  <h2>{label}</h2>
                  <div className="element-wrap">
                    <h3>{currentPrice}</h3>
                    <p
                      style={{
                        position: "relative",
                        marginTop: 19,
                        marginLeft: 5,
                      }}
                    >
                      {"  "}
                    </p>
                  </div>
                  <h5 style={{ color: percentChange > 0 ? "green" : "red" }}>
                    {priceChange > 0 ? "+" : ""}
                    {priceChange} ({percentChange}%){" "}
                    <FontAwesomeIcon
                      icon={priceChange > 0 ? faArrowUp : faArrowDown}
                    />{" "}
                    today
                  </h5>
                </div>
              </Card>
            ) : null}
          </Col>
          <Col md={4}></Col>
        </Col>
        <Col md={3}>
          {pieData != "" ? (
            <Card
              style={{
                borderRadius: 12,
                marginBottom: 30,
              }}
              className="boxShadow"
            >
              <p
                style={{
                  justifySelf: "center",
                  alignSelf: "center",
                  marginTop: 10,
                  fontSize: 15,
                  color: "grey",
                  fontFamily: "monospace",
                }}
              >
                Twitter Sentiment Analysis
              </p>
              <Pie
                data={{
                  labels: ["Positive", "Negative", "Neutral"],

                  datasets: [
                    {
                      label: "Sentiments",
                      data: pieData,
                      backgroundColor: [
                        "rgba(54,162,235,0.6)",
                        "rgba(255,99,132,0.6)",
                        "rgba(255,206,86,0.6)",
                      ],
                    },
                  ],
                }}
              />
              <p
                style={{
                  justifySelf: "center",
                  alignSelf: "center",
                  marginTop: 10,
                  fontSize: 13,
                  color: "grey",
                }}
              >
                TotalCount: {twitterCount}
              </p>
            </Card>
          ) : pieSpinner ? (
            <Spinner
              animation="border"
              variant="info"
              style={{ marginLeft: "48%", marginBottom: 200, marginTop: 200 }}
            />
          ) : null}
        </Col>
        <Col md={6} className="my-8">
          {graphLabel != "" ? (
            <Card
              style={{ borderRadius: 10, padding: 10 }}
              className="boxShadow"
            >
              <h4
                style={{
                  fontFamily: "monospace",
                  marginLeft: "32%",
                  // marginTop: 10,
                  color: "rgb(255, 99, 132)",
                }}
              >
                Historical Data
              </h4>
              <Line
                // borderWidth={2}
                data={{
                  labels: graphLabel,
                  datasets: [
                    {
                      label: label,
                      backgroundColor: "rgb(255, 99, 132)",
                      borderColor: "rgb(255, 99, 132)",
                      data: graphData,
                    },
                  ],
                }}
              />
            </Card>
          ) : graphSpinner ? (
            <Spinner
              animation="border"
              variant="danger"
              style={{ marginLeft: "48%", marginBottom: 200, marginTop: 200 }}
            />
          ) : null}
        </Col>
        <Col md={6} className="my-8">
          {graphLabel != "" ? (
            <Card
              style={{ borderRadius: 10, padding: 10 }}
              className="boxShadow"
            >
              <h4
                style={{
                  fontFamily: "monospace",
                  marginLeft: "25%",
                  // marginTop: 10,
                  color: "rgb(0, 250, 130)",
                }}
              >
                Future Prediction Graph{" "}
              </h4>
              <Line
                // borderWidth={2}
                data={{
                  labels: futureGraphLabel,
                  datasets: [
                    {
                      label: label,
                      backgroundColor: "rgb(0, 250, 130)",
                      borderColor: "rgb(0, 250, 130)",
                      data: futureGraphData,
                    },
                  ],
                }}
              />
            </Card>
          ) : graphSpinner ? (
            <Spinner
              animation="border"
              variant="secondary"
              style={{ marginLeft: "48%", marginBottom: 200, marginTop: 200 }}
            />
          ) : null}
        </Col>
        <Col md={6} className="my-5">
          <Card className="boxShadow" style={{ borderRadius: 12 }}>
            <Row>
              <Col md={6}>
                <h3
                  className="my-2"
                  style={{
                    color: "green",
                    paddingLeft: 10,
                    fontFamily: "cursive",
                    paddingTop: 5,
                    paddingBottom: 5,
                  }}
                >
                  Winner Board
                </h3>
              </Col>
              <Col md={4}></Col>
              <Col md={2} style={{ marginTop: 20 }}>
                <div style={{ flexDirection: "row" }}>
                  Rows:{" "}
                  <select
                    onClick={(e) => {
                      setWinnerDVal(e.target.value);
                    }}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={150}>150</option>
                    <option value={200}>200</option>
                  </select>
                </div>
              </Col>
            </Row>

            <Table hover>
              <thead
                style={{
                  backgroundColor: "#f1f1f1",
                }}
              >
                <tr>
                  <th>Sr.no</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Change %</th>
                </tr>
              </thead>
              <tbody>
                {winners.slice(0, winnerDVal).map((item, index) => {
                  return (
                    <>
                      <tr>
                        <td>{item[0]}</td>
                        <td>{item[1]}</td>
                        <td>{item[2]}</td>
                        <td style={{ color: "green" }}>
                          <FontAwesomeIcon
                            icon={faCaretUp}
                            size="lg"
                            color="green"
                          />{" "}
                          {parseFloat(item[3]).toFixed(2)}
                          {"%"}
                        </td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </Table>
            {Object.keys(winners).length == 0 ? (
              <Spinner
                animation="border"
                variant="success"
                style={{ marginLeft: "48%", marginBottom: 20, marginTop: 10 }}
              />
            ) : null}
          </Card>
        </Col>
        <Col md={6} className="my-5">
          <Card className="boxShadow" style={{ borderRadius: 12 }}>
            <Row>
              <Col md={6}>
                <h3
                  className="my-2"
                  style={{
                    color: "red",
                    paddingLeft: 10,
                    fontFamily: "cursive",
                    paddingTop: 5,
                    paddingBottom: 5,
                  }}
                >
                  Losers Board
                </h3>
              </Col>
              <Col md={4}></Col>
              <Col md={2} style={{ marginTop: 20 }}>
                <div style={{ flexDirection: "row" }}>
                  Rows:{" "}
                  <select
                    onClick={(e) => {
                      setLoserDVal(e.target.value);
                    }}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={150}>150</option>
                    <option value={200}>200</option>
                  </select>
                </div>
              </Col>
            </Row>
            <Table hover>
              <thead
                style={{
                  backgroundColor: "#f1f1f1",
                }}
              >
                <tr>
                  <th>Sr.no</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Change %</th>
                </tr>
              </thead>
              <tbody>
                {losers.slice(0, loserDVal).map((item, index) => {
                  return (
                    <>
                      <tr>
                        <td>{item[0]}</td>
                        <td>{item[1]}</td>
                        <td>{item[2]}</td>
                        <td style={{ color: "red" }}>
                          <FontAwesomeIcon
                            icon={faCaretDown}
                            size="lg"
                            color="red"
                          />{" "}
                          {parseFloat(item[3]).toFixed(2)}
                          {"%"}
                        </td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </Table>
            {Object.keys(losers).length == 0 ? (
              <Spinner
                animation="border"
                variant="danger"
                style={{ marginLeft: "48%", marginBottom: 20, marginTop: 10 }}
              />
            ) : null}
          </Card>
        </Col>
      </Row>
      {/* </Container> */}
    </div>
  );
}

export default App;
