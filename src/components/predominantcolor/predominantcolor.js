import React from 'react';

const PredominantColor = ({color}) => {

	const colorArray = color.map((col) => {
	        			return { color: col.raw_hex, value: col.value }
	        		});
	return (
		<div className='fr mr5'>
		<h4>The most predominant colors are:</h4>
			{
				colorArray.map((col,i) => {
					return <p key={i}>{col.color}</p>
				})
			}
		</div>
		);
 }


export default PredominantColor;