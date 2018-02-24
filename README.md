This project demonstrates scraping of tweets on timeline of any Twitter username, performing sentiment analysis on the tweet texts and display them in a web page. Python, Javascript, HTML and CSS were used to accomplish this. 

The username to analyze is taken as an input from user. The program uses Twitter's Streaming API to scrape the latest 300 tweets. I am planning to increase this number to 2500 soon. Tweet texts are then broken down into lemmas and matched to a customized emotions dictionary to get the sentiment associated with each tweet and also aggregated over all 300 tweets. The result is displayed in an attractive, user-friendly format using D3.


This repository contains a web application for analyzing the sentiment of Twitter timelines, created as part of an assignment for the [Python and JavaScript for Data Science](https://canvas.uw.edu/courses/1139975) course at the UW iSchool.