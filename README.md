# Queer-E

Queer-e is a platform for finding queer focused erotica online. It was built as  a project for Information Retrieval.

## Installation Instructions
First you must have a Solr instance running. I have included my Solr conf folder, create a core and use the provided conf for setup. Check out [Solr](https://lucene.apache.org/solr/)!

Once your core is up and running, go into the uploader folder, change the mirrorPath variable, to contain the path to your mirrored website/websites. data is expected to be in a certain format, quite a bit of this is hard coded for [Nifty.org]([https://www.nifty.org/nifty/](https://www.nifty.org/nifty/)).
Provided you get no errors, your data should now be indexed into your Solr instance!

To run the front end, inside the front end folder
run npm install
npm start

Your front end should start, and your browser should open and display the page. Should end up looking something like this
![Queer-e Website](frontend\frontened.png)


## For more info check out the report

