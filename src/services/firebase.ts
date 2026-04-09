import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC5peBmS47kP5F4oWyMMp_WC_CxbvNlmoI",
  authDomain: "mobdev-e2201.firebaseapp.com",
  projectId: "mobdev-e2201",
  storageBucket: "mobdev-e2201.firebasestorage.app",
  messagingSenderId: "535836591907",
  appId: "1:535836591907:web:4e57f2df577f226ad06e96",
  measurementId: "G-5J25FD4H7E"
};

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);

const IMGBB_API_KEY = '415d559aff5202d3cfe7a295734a1def';

export const uploadImageAsync = async (uri: string) => {
  const formData = new FormData();
  
  formData.append('image', {
    uri: uri,
    type: 'image/jpeg',
    name: 'photo.jpg',
  } as any);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error('ImgBB Error');
    }
  } catch (error) {
    return '';
  }
};