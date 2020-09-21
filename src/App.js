import React,{useState,useEffect} from 'react';
import { FormControl, MenuItem, Select } from '@material-ui/core'
import './App.css';
import Map from './Map'
import InfoBox from './InfoBox'
import Table from './Table'
import {Card,CardContent,Typography} from '@material-ui/core'
import { sortData } from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";
import {prettyPrintStat} from './util'



function App() {
  const [countries,setCountries]=useState([])
  const [tabledata,setTableData]=useState([])
  const [countryInfo,setCountryInfo]=useState({})
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter,setMapCenter]=useState({
    lat:34.80746,lng:-40.4796
  })
  const [mapZoom,setMapZoom]=useState(3)
  const [mapCountries,setMapCountries]=useState([])
  const [country,setCountry]=useState("Worldwide")//state is basically  VARIABLE in React
  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response)=> response.json()
    .then((data)=>{
      setCountryInfo(data)
    }))
  },[])
  
  useEffect(()=>{
//only runs once based on a condition
    const getCountriesData = async()=>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=>response.json())
      .then((data)=>{
        const countries=data.map((country)=>(
         { name:country.country,
          value:country.countryInfo.iso2
         }))
         const sortedData=sortData(data)
         setTableData(sortedData)
         setCountries(countries);
         setMapCountries(data)
      })
    }
    getCountriesData()
  },[])
  const onCountryChange= async (e)=>{
    const countryCode=e.target.value;
    
    const url=countryCode==='worldwide'?'https://disease.sh/v3/covid-19/all':`https://disease.sh/v3/covid-19/countries/${countryCode}`
    
    await fetch(url)
    .then(response=>response.json())
    .then(data=>{
      setCountry(countryCode)
      setCountryInfo(data)
      setMapCenter([data.countryInfo.lat,data.countryInfo.long])
    })
    console.log(countryInfo)
  }
  return (
    <div className="app">
      <div className="app_left">
      <div className="app_header">
      <h1>Covid-19 Tracker</h1>
      <FormControl className="app_dropdown">
        <Select
        variant="outlined"
        value={country}
        onChange={onCountryChange}
        ><MenuItem value={country}>{country}</MenuItem>
          {/* loops thrugh all the countries and show a drop down list of the options */}
          {countries.map((country)=>(
              <MenuItem value={country.value}>{country.name}</MenuItem>
          ))}
          
          

        </Select>
      </FormControl>
      </div>
      <div className="app_stats">
          <InfoBox isRed Select={casesType==="cases"} onClick={e=>setCasesType('cases')}
          title="Coronavirus cases" cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)}/>
          <InfoBox Select={casesType==="recovered"} onClick={e=>setCasesType('recovered')}
          title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)}/>
          <InfoBox isRed Select={casesType==="deaths"} onClick={e=>setCasesType('deaths')}
          title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)}/>
      </div>
      <Map 
      center={mapCenter} zoom={mapZoom} countries={mapCountries} casesType={casesType}
      />
      </div>
      <Card className="app_right">
        <CardContent>
          <h1>Live cases by country</h1>
          <Table countries={tabledata}/>
          <h1 className="app_graphTitle">Worldwide new {casesType}</h1>
          <LineGraph className="app_graph" casesType={casesType}/>
        </CardContent>
      </Card>

      
      
      {/* InfoBox */}
      {/* InfoBox */}
      {/* InfoBox
      {/* table */}
      {/* Graph */}
      {/* Map */}
    </div>
  );
}

export default App;
