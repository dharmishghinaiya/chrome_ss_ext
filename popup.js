document.addEventListener('DOMContentLoaded', function() {
  var hiButton = document.getElementById('hiButton');
  hiButton.addEventListener('click', function() {

    var customMessage = prompt('Enter your  message:');
    if (!customMessage) {
      return; // User cancelled or left the custom message empty
    }
    


    chrome.tabs.captureVisibleTab(null, { format: 'png' }, function(dataUrl) {
      if (!dataUrl) {
        alert('Failed to capture screenshot.');
        return;
      }

      var watermarkUrl = 'images/watermark.png'; // Replace with the actual path to your watermark image file
      var message = customMessage + "\n\n\nThis information share for educational purposes only";
      var botToken = '6017556568:AAFuyws6BfhrUKVXEyxiLxHDjXTvU2bQwVE'; //Bot Token
      var chatId = '909631441';  // Bot Chat ID
      var chatId = '@invest_and_grow_in'; // Channel ID

       // Show loader while sending the message
       var loader = document.getElementById('loader');
       loader.style.display = 'block';

      var apiUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;
      var formData = new FormData();

      // Apply watermark to the screenshot and save it as a file
      applyWatermark(dataUrl, watermarkUrl, function(watermarkedDataUrl) {
        var watermarkedBlob = dataUrlToBlob(watermarkedDataUrl);
        formData.append('chat_id', chatId);
        formData.append('caption', message);
        formData.append('photo', watermarkedBlob, 'screenshot_with_watermark.png');

        fetch(apiUrl, {
          method: 'POST',
          body: formData
        })
          .then(response => response.json())
          .then(data => {
            loader.style.display = 'none'; // Hide loader after the response is received
            if (data.ok) {
              alert('URL and screenshot with watermark sent successfully!');
            } else {
              alert('Failed to send URL and screenshot with watermark.');
            }
          })
          .catch(error => {
            loader.style.display = 'none'; // Hide loader after the response is received
            console.error('Error:', error);
            alert('An error occurred while sending the URL and screenshot with watermark.');
          });
      });
    });
  });

  // Helper function to apply watermark on the image
  function applyWatermark(dataUrl, watermarkUrl, callback) {
    var image = new Image();
    image.crossOrigin = 'anonymous'; // Enable CORS for the watermark image
    image.onload = function() {
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      canvas.width = image.width;
      canvas.height = image.height;

      // Draw the image on the canvas
      context.drawImage(image, 0, 0);

      // Load the watermark image
      var watermarkImage = new Image();
      watermarkImage.crossOrigin = 'anonymous'; // Enable CORS for the watermark image
      watermarkImage.onload = function() {
        // Repeat the watermark across the entire canvas
        var pattern = context.createPattern(watermarkImage, 'repeat');
        context.fillStyle = pattern;
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Convert the canvas content back to a data URL
        var watermarkedDataUrl = canvas.toDataURL('image/png');
        callback(watermarkedDataUrl); // Pass the watermarked data URL to the callback
      };
      watermarkImage.src = watermarkUrl;
    };
    image.src = dataUrl;
  }

  // Helper function to convert Data URL to Blob
  function dataUrlToBlob(dataUrl) {
    var arr = dataUrl.split(',');
    var mime = arr[0].match(/:(.*?);/)[1];
    var bstr = atob(arr[1]);
    var n = bstr.length;
    var u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }
});
