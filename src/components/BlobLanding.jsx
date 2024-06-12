const BlobLanding = () => {
    const imageURL = "/prato1.jpg";
  
    return (
      <div className="relative hidden lg:block" style={{ width: '250px', height: '250px' }}>
        <svg 
          id="visual" 
          viewBox="0 0 250 250" 
          width="250" 
          height="250" 
          xmlns="http://www.w3.org/2000/svg" 
          version="1.1"
        >
          <image 
            href={imageURL} 
            x="25" // Adjust x and y to center the image within the SVG
            y="25" 
            width="200" // Adjust width and height as needed
            height="200" 
            preserveAspectRatio="xMidYMid slice" // Ensure the image is centered and covers the SVG
          />
          <path 
            d="M88.7 -105C124.6 -75.5 170.1 -56.8 189.4 -22.3C208.7 12.1 201.8 62.3 172.4 86.7C143 111 91.2 109.5 46 125.7C0.8 141.9 -37.7 175.7 -67.8 171.3C-97.9 166.9 -119.5 124.2 -125.3 86C-131 47.8 -120.9 14.1 -113.7 -18.8C-106.4 -51.8 -102.1 -84.1 -83.6 -116.7C-65.1 -149.3 -32.6 -182.1 -3.1 -178.4C26.4 -174.7 52.7 -134.5 88.7 -105" 
            fill="none" 
            stroke="#000000" 
            strokeWidth="4"
          />
        </svg>
      </div>
    );
  }
  
  export default BlobLanding;
  