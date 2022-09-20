# Personalization clicks
Sample repository to show how we can use Enterprise Search and Search UI to add personalization on a search experience using clicks analytics.

# Index data 

A sample dataset is provided with the application, you can find it under `data` folder.

To index data in your Elasticsearch deployment, you can use the python script `index_es.py`. Simply edit the file and replace `CLOUD_ID` and `ES_PASSWORD` with your values. 

Once ready, simply run `python3 index_es.py`

# Prepare application 

The front-end part of the application is located under `personalization-ui` folder. 

Navigate to this folder `cd personalization-ui` and run `yarn` to install node dependencies for the front-end.

Navigate back to the root folder `cd ..`. Then run again `yarn` here to install node dependencies for the root level project. 

Once done, edit the front-end environment file (`personalization-ui/.env`) to provide the values from your environment.

Then edit the file `server.js` to provide the values from your environment.

Once ready, run `yarn dev` to run the application locally. 





