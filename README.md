#Twitter sentiment anaylsis & stock market prediction
This is the fronEnd application which gives us a search option to search the stock Names.
Ones the stock name is selected from the drop down data.
It will take the ticker data and scrape yahoo finance for previous 5 years of data and at the same time seach the entered keyword in twitter for setiment analysis.
We have a option to enter the number of tweets to be analysed.

Twitter will get the data:-
Divide the data into 3 categories:
1. Positive Sentiment
2. Negative Sentimnt
3. Neutral Sentiment

Below the twitter chart we have Two graphs that represent.
Previous 5 years of stock market data
Future 5 years of prediction of that specific stock data. (Using FBPROPHET)

Below that we have the list of almost 200 top companies and 200 top lowest companies in terms of growth and fall respoectively.

All the data in this application no data is stored on any server or database.

To get the local Api check my repo name ``

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.
