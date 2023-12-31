# How to use

On the first time run the following, to install the needed modules:

```shell
npm install
```

To start the server, run:

```shell
npm start
```

# Example database

File db.json can have the following contents:

```json
{
  "gps_data_records": [
    {
      "time": "1702728333",
      "gps": {
        "lat": "38.7111263",
        "lon": "-9.1276078"
      },
      "battery_soc": "94.52"
    },
    {
      "time": "1702729333",
      "gps": {
        "lat": "38.7111263",
        "lon": "-9.1276078"
      },
      "battery_soc": "94.40"
    },
    {
      "time": "1702731333",
      "gps": {
        "lat": "38.7111263",
        "lon": "-9.1276078"
      },
      "battery_soc": "93.20"
    },
    {
      "time": "1702732333",
      "gps": {
        "lat": "38.7111263",
        "lon": "-9.1276078"
      },
      "battery_soc": "90.02"
    },
    {
      "time": "1702734233",
      "gps": {
        "lat": "38.7111263",
        "lon": "-9.1276078"
      },
      "battery_soc": "88.64"
    }
  ],
  "users": [
    {
      "id": "0",
      "name": "abc def"
    },
    {
      "id": "1",
      "name": "Maria Manuel"
    },
    {
      "id": "3",
      "name": "António de França"
    }
  ]
}
```

# License

As stated on package.json:

```json
  "author": "Fabio <fabio@ua.pt>",
  "license": "MIT",
```
