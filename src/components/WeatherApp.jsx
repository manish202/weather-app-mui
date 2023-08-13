import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import {useState,memo,useRef} from "react";

function WeatherApp(){
    console.log("App > WeatherApp");
    let [data,updtData] = useState({});
    let [isLoading,updtLoading] = useState(false);
    let inputField = useRef();
    let skeleton_arr = ["h4","h5","h5","h5","h5","h5"];
    const getData = async () => {
        try{
            let inputData = inputField.current.value.trim();
            if(inputData){
                updtLoading(true);
                const API_KEY = "c37dca6d9aabb02499acb5c84aad390b";
                let coords_url = `http://api.openweathermap.org/geo/1.0/direct?q=${inputData},IN&appid=${API_KEY}`;
                let info = await (await fetch(coords_url)).json();
                if(info[0]){
                    let {lat,lon,state} = info[0];
                    let info2 = await (await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)).json();
                    if(info2.name){
                        let {main,name,wind} = info2;
                        let arr_data = [
                            {id:"h4",txt:`${name}, ${info[0].name}, ${state}`},
                            {id:"h5",txt:`Speed: ${wind.speed} | Degree: ${wind.deg}`},
                            {id:"h5",txt:`Temperature: ${main.temp}`},
                            {id:"h5",txt:`Min: ${main.temp_min} | Max: ${main.temp_max}`},
                            {id:"h5",txt:`Pressure: ${main.pressure}`},
                            {id:"h5",txt:`Humidity: ${main.humidity}`}
                        ];
                        updtData(arr_data);
                    }else{
                        updtData({message:`Sorry! No Data Found.`})
                    }
                }else{
                    updtData({message:`No Data Found.`})
                }
                updtLoading(false);
            }
        }catch(error){
            updtData({message:`something is wrong. ${error}`})
        }
    }

    return(
        <>
            <Box sx={{maxWidth:'576px',mx:'auto',padding:'20px 10px'}} >
                <TextField inputRef={inputField} onKeyDown={(e) => e.key == 'Enter' && getData()} sx={{width:'calc(100% - 48px)'}} label="city name" variant="standard" />
                <IconButton size="large" aria-label="city name" onClick={getData}>
                    <SearchIcon />
                </IconButton>
                {!isLoading && data.message && <Typography sx={{mt:2}} variant="h4">{data.message}</Typography>}
                {isLoading && <Card sx={{mt:2}}>
                    <CardContent>
                        {skeleton_arr.map((val,ind) => <Typography key={ind} variant={val}><Skeleton animation="wave" /></Typography>)}
                    </CardContent>
                </Card>}
                {!isLoading && Array.isArray(data) && <Card sx={{mt:2}}>
                    <CardContent>
                        {data.map((val,ind) => <Typography key={ind} variant={val.id}>{val.txt}</Typography>)}
                    </CardContent>
                </Card>}
            </Box>
        </>
    )
}
export default memo(WeatherApp);