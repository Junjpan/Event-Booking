import React from 'react';
import {Bar} from 'react-chartjs-2';

const BOOKING_BUCKETS={
    'Cheap':{min:0,max:100},
    "Normal":{min:100,max:200},
    "Expenseive":{min:200,max:1000}
}

const BookingChart=props=>{
    const output={labels:[],datasets:[]};
    const values=[];
    for (const bucket in BOOKING_BUCKETS){
        const filteredBookingsCount=props.bookings.reduce((prev,current)=>{
         if(current.event.price>BOOKING_BUCKETS[bucket].min&&current.event.price<=BOOKING_BUCKETS[bucket].max){
             return prev+1
         }else{
             return prev
         }
        
        },0)
        values.push(filteredBookingsCount)
        output.labels.push(bucket);
    
    }

    output.datasets.push({
        data:values,
        backgroundColor:["rgba(220,110,110,0.8)","rgba(54,162,225,0.8)","rgba(75,162,110,0.8)"]
    })

    console.log(output)

 let option={
     scales:{
         yAxes:[{
             ticks:{
                 beginAtZero:true
             }
         }]
     }
 }

 return <Bar data={output} height={100} options={option} />
}

export default BookingChart;