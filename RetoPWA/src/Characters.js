import React, { useEffect, useState } from 'react';
import md5 from 'md5';

const url = new URL('https://gateway.marvel.com/v1/public/characters');
const pub = 'INSERTAR ACA API KEY PUBLICA';
const priv = 'INSERTAR ACA API KEY PRIVADA';

const Characters = () => {
    const [cars, setCars] = useState();

    const ts = new Date().getTime() - 534231;

    const md5Calc = md5(ts + priv + pub);

    const search = new URLSearchParams({ts: ts, hash: md5Calc, apikey: pub});

    url.search = search;

    
    useEffect(() => {
        if(!navigator.onLine){
            if(localStorage.getItem("cars") === null) {
                setCars([]);
            } else {
                setCars(JSON.parse(localStorage.getItem("cars")));
            }
        } else {
            fetch(url).then(res=>res.json()).then(res=>{
                setCars(res.data.results);
                localStorage.setItem("cars", JSON.stringify(res.data.results));
            })
        }
    }, []);

    if(!cars || cars.length === 0) return (<div><h1>There's no characters.</h1> <h3>Loading...</h3></div>);
    console.log(cars);

    let carss = (<hr />);

    if(cars) {
        carss = cars.map(car => {
            return (
                <div className='carDiv' key={car.name}>
                    <h6>
                        {car.name}
                    </h6>
                    <img src={car.thumbnail.path + '.' +car.thumbnail.extension} alt={car.name} className='heroImg'/>
                </div>
            );
        });
    }


    return (
        <div>
            <h1>{cars.length} characters loaded!</h1>
            <div className='carsDiv'>
            {carss}
            </div>
        </div>
    );

};

export default Characters;