
import { FormControl, MenuItem, Select, Card, CardContent } from '@material-ui/core';
import { useEffect, useState } from 'react';
import './App.css';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import {prettyPrintStat, sortData} from './util';
import LineGraph from './LineGraph'
import "leaflet/dist/leaflet.css"


function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide')
  const [countryInfo, setCountryInfo] = useState({})
  const [date, setDate] = useState('');
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState([34.80746, -40.4796]);
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([])




  //useEffect() to make an API call to the country endpoint
  useEffect(()=>{
     fetch("https://disease.sh/v3/covid-19/all")
        .then((response) => response.json())
        .then((data) => {
          setCountryInfo(data);
        })
  }, [])
 
  //for fetching the date:
  useEffect(()=>{
    fetch("https://covid19.mathdro.id/api")
    .then((res) => res.json())
    .then((data)=>{
       setDate(data.lastUpdate);
    })
  }, [])

  useEffect(()=>{
 // async function as we are sending a request and waiting for a response
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);

          setCountries(countries);
      });
    };
    getCountriesData();
  }, []);

 const onCountryChange = async (event) => {
   const countryCode = event.target.value;
   
   const url = 
   countryCode === "worldwide"
   ? "https://disease.sh/v3/covid-19/all"
   : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
    .then((response)=> response.json())
    .then((data) => {
      setCountry(countryCode);
      setCountryInfo(data);
      countryCode === "worldwide"
          ? setMapCenter([34.80746, -40.4796])
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    })

 }


  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1 className = "logo">COVID-19.INFO</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange = {onCountryChange}
            > 
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country)=>(
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
              
            </Select>
          </FormControl>
        </div>
        
        <div className="app__stats">
              <InfoBox isCases active={casesType=='cases'} onClick={(e) => setCasesType('cases')} title="Total Covid cases" total={prettyPrintStat(countryInfo.cases)} cases={prettyPrintStat(countryInfo.todayCases)} date={date}/>
              <InfoBox isRecovered active={casesType=='recovered'} onClick={(e) => setCasesType('recovered')} title="Recovered" total={prettyPrintStat(countryInfo.recovered)} cases={prettyPrintStat(countryInfo.todayRecovered)} date={date} />
              <InfoBox isDeaths active={casesType=='deaths'} onClick={(e) => setCasesType('deaths')} title="Deaths" total={prettyPrintStat(countryInfo.deaths)} cases={prettyPrintStat(countryInfo.todayDeaths)} date={date} />
        </div>
        
        <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom}/>
      </div>
      <Card className="app__right">
         <CardContent className="right-card">
           <h2 className = "table_title">Cases by country</h2>
           <Table countries={tableData} />
           <h3 className="graph_title">Worldwide new {casesType}</h3>
            <LineGraph className="app__graph" casesType={casesType} />
         </CardContent>
      </Card>
    </div>
  );
}

export default App;
