import React from 'react'
//import CountUp from "react-countup";
import './InfoBox.css';

import { Card,CardContent,Typography} from "@material-ui/core";
import { imageOverlay } from 'leaflet';
function InfoBox( {title, cases, isDeaths, isRecovered, isCases, active, total, date, ...props}) {
    return (
         <Card onClick={props.onClick} className={`infoBox ${active && "infoBox--selected"} ${isCases && "infoBox--cases"} ${isRecovered && "infoBox--recovered"} ${isDeaths && "infoBox--deaths"}`}>
            <CardContent>
               <Typography className="infoBox__title" color="textSecondary">{title}</Typography>
                
               <h2 className={`infoBox__total ${isCases && "infoBox__total--cases"} ${isRecovered && "infoBox__total--recovered"} ${isDeaths && "infoBox__total--deaths"}`}>
               {total}
               </h2>
               

               <Typography className="infoBox__cases" color="textSecondary">
                  {/* <CountUp start={0} end={cases} duration={1} seperator=',' /> */}
                     +{cases}
                </Typography>
                

               <Typography className="infoBox__date" >
                    {new Date(date).toDateString()}
                </Typography>

            </CardContent>
        </Card>
    )
}

export default InfoBox
