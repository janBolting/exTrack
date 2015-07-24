# exTrack #

exTrack is a minimalist, easy to use excercise tracking service. 

### Features ###

- allows you to define your own exercises
- exercises are displayd numerically and graphically
- there will be an app that notifies you of the latest achievents of your mates (this adds hugely to your motivation to do a couple of hundred push ups a day)
- login works with google, facebook, and plain and simple = email+password
- allows you to add videos or pictures to each exercise, e.g. to show how a proper push up is done

### Architecture ###

Currently figuring out which of the vast number of available web frameworks provides the least painfull way to do this. By and large it will look like this: 

There will be a **back end** that stores user data (how many exercises have been done when) in json files or a database.

There will be multiple **front ends**: 

- a website
- an Android app

those front ends visualize user data and allow to easily enter new exercises.

The website will use bootstrap for the layout, knockout.js for data binding. The site requests user data as json files from the back end.
