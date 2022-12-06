# CU Planner

<img
  src="https://github.com/poon919/cu-planner/raw/master/client/public/logo192.png"
  alt="CU Planner"
  width="96"
/>

A web-based class schedule planner for Chulalongkorn University students powered by Go and Typescript with React.

## Preview

https://poon919.github.io/cu-planner

![timetable preview](/docs/images/preview-timetable.png)

## Features

- Easily save and load sets of courses and share it with your friends
- Clearly see which course has an overlap in course schedule or examination time

## Project Structure

`client/`

A web application powered by React.js.

`regapi/`

A Go interface to scrape course data from Chula websites.

`scripts/`

Automation scripts for building client and server.

`server/` and `main.go`

Files for a web server designed to run on Heroku free tier with an optional `Redis` storage.

All user data are stored in a client-side web browser to minimize server costs.

`testdata/`

HTML files for testing the parsers.
