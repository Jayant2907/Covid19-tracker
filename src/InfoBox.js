import React from 'react'
import './infobox.css'
import {Card,CardContent,Typography} from '@material-ui/core'
function InfoBox({title,cases,Select,isRed,total,...props}) {
    return (
        <Card className={`infoBox ${Select && 'infoBox--selected'} ${isRed && 'infoBox--red'}`} onClick={props.onClick}>
            <CardContent>
                <Typography color="textSecondary" className="infoBox_title">{title}</Typography>
    <h2 className={`infoBox_cases ${!isRed && "infoBox_cases--green"}`}>{cases}</h2>
                <Typography className="infoBox_total" color="textSecondary">{total} Total</Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
