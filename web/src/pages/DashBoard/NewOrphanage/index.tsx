import { LeafletMouseEvent } from 'leaflet';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import FormCreateUpdate from '../../../components/FormCreateUpdate'
import api from '../../../services/api';
import useUser from '../../../utils/useUser';


interface PropsParams{
  
  id: string;
}



const NewOrphanage = () => {


  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });

  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [phone, setPhone] = useState('');
  const [opening_hours, setOpeningHours] = useState('');
  const [open_on_weekends, setOpenOnWeekends] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);



  const [markerMap, setMarkerMap] = useState('#FF6666');



  const { token } = useUser();


  const history = useHistory();
  const { id } = useParams() as PropsParams;
 

  const [location, setLocation ] = useState({
    latitude: -27.2092052,
    longitude: -49.6401092
  });
  

  useEffect(() => {

    navigator.geolocation.getCurrentPosition( (position: any) => {


      if(position){
        const { latitude, longitude } = position.coords;


        setLocation({latitude, longitude});

      }
    }, error => console.log(error));

  
  }, []);



  useEffect(() => {

   (async()=> {
     

  const { data } = await api.get(`/orphanages/${id}`);

    if(!data) return;

    setName(data.name);
    setAbout(data.about);
    setInstructions(data.instructions);
    setPhone(data.phone);
    setOpeningHours(data.opening_hours);
    setOpenOnWeekends(data.open_on_weekends);
    setImages(data.images);
    setPosition({ latitude: data.latitude, longitude: data.longitude})


  })();
  
}, [id]);



 const handleSelectColorMarker = (color: string) => {

    setMarkerMap(color);

    console.log(markerMap);


  };



  const handleMapClick = (event: LeafletMouseEvent) => {
 

    const { lat, lng } = event.latlng;

    setPosition({
      latitude: lat,
      longitude: lng
    });
  };



  const handleSelectImage = (event: ChangeEvent<HTMLInputElement>) => {

   


    if (!event.target.files) return;

    const selectedImages = Array.from(event.target.files);

    
    
    setImages(selectedImages);
    
    
    
    const selectImagesPreview = selectedImages.map(image => {
      
      return URL.createObjectURL(image);
    });
    
    setPreviewImages(selectImagesPreview);
    
    
  };


 const handleForm = async (event: FormEvent) => {

    event.preventDefault();



    const { latitude, longitude } = position;

    const pending = false;

    const data = new FormData();

    data.append('name', name);
    data.append('about', about);
    data.append('instructions', instructions);
    data.append('phone', phone);
    data.append('markerMap', markerMap);
    data.append('pending', String(pending));
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('opening_hours', opening_hours);
    data.append('open_on_weekends', String(open_on_weekends));



    images.forEach(image => {

      data.append('images', image);

    });

    

      const auth = `Bearer ${token} `



    await api.put(`/dashboard/update/${id}`, data,
    {
      headers: {Authorization: auth}
    });


    toast.success('Orfanato cadastrado com sucesso!',{ 
          position: toast.POSITION.BOTTOM_RIGHT

        });

    history.goBack();

  };  


  return (



  <div>

    <FormCreateUpdate
     name={name}
     setName={setName}
     about={about}
     setAbout={setAbout}
     instructions={instructions}
     setInstructions={setInstructions}
     phone={phone}
     setPhone={setPhone}
     opening_hours={opening_hours}
     setOpeningHours={setOpeningHours}
     open_on_weekends={open_on_weekends}
     setOpenOnWeekends={setOpenOnWeekends}
     position={position}
     setPosition={setPosition}
     previewImages={previewImages}
     location={location}
     handleMapClick={handleMapClick}
     handleSelectImage={handleSelectImage}
     handleForm={handleForm}
     markerMap={markerMap}
     handleSelectColorMarker={handleSelectColorMarker}
     idOrphanage={id}
     page='newOrphanage'
     
     />

  </div>
  );
};


export default NewOrphanage;
