// **DO THIS**:
//   Replace BUCKET_NAME with the bucket name.
//
var albumBucketName = 'medical-images-testing';

// **DO THIS**:
// Initialize the Amazon Cognito credentials provider
AWS.config.region = 'us-east-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:02436402-2cc9-4638-bd6c-14b67075118c',
});


// Create a new service object
var s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: {Bucket: albumBucketName}
});

// A utility function to create HTML.
function getHtml(template) {
  return template.join('\n');
}

// List the photo albums that exist in the bucket.
function listAlbums() {
    s3.listObjects({Delimiter: '/'}, function(err, data) {
      if (err) {
        return alert('There was an error listing your albums: ' + err.message);
      } else {
        var albums = data.CommonPrefixes.map(function(commonPrefix) {
          var prefix = commonPrefix.Prefix;
          var albumName = decodeURIComponent(prefix.replace('/', ''));
          return getHtml([
            '<li>',
              '<button style="margin:5px 0 10px 20px;" onclick="viewAlbum(\'' + albumName + '\')">',
                albumName,
              '</button>',
            '</li>'
          ]);
        });
        var message = albums.length ?
          getHtml([
            '<p style="margin:10px 0 10px 20px;">Click on an patient name to view analysis results.</p>',
          ]) :
          '<p>You do not have any albums. Please Create album.';
        var htmlTemplate = [
          '<div style="text-align: center;">',
          '<h2 style="margin:10px 0 10px 20px;">Patient Directory</h2>',
          message,
          '<ul>',
            getHtml(albums),
          '</ul>',
          '</div>',
        ]
        document.getElementById('viewer').innerHTML = getHtml(htmlTemplate);
      }
    });
  }
  
  // Show the photos that exist in an album.
function viewAlbum(albumName) {
    var albumPhotosKey = encodeURIComponent(albumName) + '/';
    s3.listObjects({Prefix: albumPhotosKey}, function(err, data) {
      if (err) {
        return alert('There was an error viewing your album: ' + err.message);
      }
      // 'this' references the AWS.Request instance that represents the response
      var href = this.request.httpRequest.endpoint.href;
      var bucketUrl = href + albumBucketName + '/';
  
      var photos = data.Contents.map(function(photo) {
        
        var photoKey = photo.Key;
        var photoUrl = bucketUrl + encodeURIComponent(photoKey);
        var photoUrlResults = bucketUrl + encodeURIComponent(photoKey.slice(0,-4)+'_Results.jpg');

        if (photoKey.includes('image')){
          if (!photoKey.includes('_Result')){
              console.log(photoUrl);
              //console.log(photoUrlResults);

              return getHtml([
                '<span>',
                  //Div for image
                  '<div style="padding-left: 25px; padding-upper: 250px; padding-lower: 250px;text-align: center;" >',
                    '<hr style="border-width:10px">',
                    '<img style="padding:40px;width:225px;height:225px;" src="' + photoUrl + '"/>',
                    '<img style="padding:40px;width:225px;height:225px;" src="' + photoUrlResults + '"/>',
                  '</div>',
                  //Div for image name
                  //'<div style="padding-left: 25px;" >',
                   // '<span>',
                    //  photoKey.replace(albumPhotosKey, ''),
                   // '</span>',
                  //'</div>',
                '</span>',
              ]);
            }
          }
      });//Photos
      
      //Photos for the Overall analysis report
      var direct = data.Contents[0].Key;
      var confuse_mat = bucketUrl + encodeURIComponent(direct + 'confusion.jpg');
      var conf_table = bucketUrl + encodeURIComponent(direct + 'table.jpg');


      var message = photos.length ?
        '<p style ="padding-bottom:50px;">Analysis indicates the following results:</p>' :
        '<p>There are no photos in this album.</p>';
      var htmlTemplate = [
        '<div style="text-align: center;">',
          '<button style="margin:5px 0 10px 20px;" onclick="listAlbums()">',
            'Return To Directory',
          '</button>',
        '</div>',
        '<div style="text-align: center;">',
          
          '<h2>',
            'Analysis Report: ' + albumName,
          '</h2>',
          '<br>',
          message,
        '</div>',

        '<div style="padding-left: 25px; padding-upper: 10px; padding-lower: 50px;text-align: center;">',
        '<br>',
           /// HERE for the Top
          '<img style="padding:40px;width:225px;height:225px;" src="' + conf_table + '"/>',
          '<img style="padding:40px;width:500px;height:300px;" src="' + conf_table + '"/>',
          '<img style="padding:40px;width:300px;height:300px;" src="' + confuse_mat + '"/>',



        '</div>',

        '<div>',
        '<br>',
          getHtml(photos),
        '</div>',
        '<div style="text-align: center;">',
          '<h2>',
            'End of Report: ' + albumName,
          '</h2>',
          '<div>',
            '<button style="margin:5px 0 10px 20px;" onclick="listAlbums()">',
              'Return To Directory',
            '</button>',
          '</div>',
        '</div>',
      ]
      document.getElementById('viewer').innerHTML = getHtml(htmlTemplate);
      document.getElementsByTagName('img')[0].setAttribute('style', 'display:none;');
    });
  }
  