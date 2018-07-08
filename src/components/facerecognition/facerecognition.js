import React from 'react';
import './facerecognition.css';

const FaceRecognition = ({imageURL,box}) => {

	const styleArray = box.map((face) => {
	        			return { top:face.topRow,left:face.leftCol,right:face.rightCol,bottom:face.bottomRow }
	        		});


	return (
		<div className='center ma'>
			<div className='absolute mt2'>
				<img id='inputImage' src={imageURL} alt='' width='500px' height='auto' className='imageFaces'/>
				{
					styleArray.map((style,i) => {
						return <div key={i} className='boundingbox' style={style}></div>
					})
	        	}
			</div>
		</div>
		);	
}

export default FaceRecognition;