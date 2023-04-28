import {Cloudinary} from "@cloudinary/url-gen";
import {AdvancedImage} from '@cloudinary/react';
import {fill} from "@cloudinary/url-gen/actions/resize";


const ImageDisplay = ({publicId}) => {
    // Create a Cloudinary instance and set your cloud name.
const cld = new Cloudinary({
    cloud: {
      cloudName: 'dagmdgl9e'
    }
  });

  // Instantiate a CloudinaryImage object for the image with the public ID.
  const myImage = cld.image(publicId); 


  // Resize to 250 x 250 pixels using the 'fill' crop mode.
  myImage.resize(fill().height(300));

  // Render the image in a React component.
  return (
    <div>
      <AdvancedImage cldImg={myImage} />
    </div>
  )

}

export default ImageDisplay


