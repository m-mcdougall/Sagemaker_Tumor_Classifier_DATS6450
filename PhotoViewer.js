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
        return getHtml([
          '<span>',
            '<div>',
              '<br/>',
              '<img style="width:128px;height:128px;" src="' + photoUrl + '"/>',
            '</div>',
            '<div>',
              '<span>',
                photoKey.replace(albumPhotosKey, ''),
              '</span>',
            '</div>',
          '</span>',
        ]);
      });
      var message = photos.length ?
        '<p>The following photos are present.</p>' :
        '<p>There are no photos in this album.</p>';
      var htmlTemplate = [
        '<div style="text-align: center;">',
          '<button style="margin:5px 0 10px 20px;" onclick="listAlbums()">',
            'Back To Directory',
          '</button>',
        '</div>',
        '<div style="text-align: center;">',
          '<h2>',
            'Album: ' + albumName,
          '</h2>',
          message,
        '</div>',
        '<div>',
          getHtml(photos),
        '</div>',
        '<div style="text-align: center;">',
          '<h2>',
            'End of Album: ' + albumName,
          '</h2>',
          '<div>',
            '<button style="margin:5px 0 10px 20px;" onclick="listAlbums()">',
              'Back To Directory',
            '</button>',
          '</div>',
        '</div>',
      ]
      document.getElementById('viewer').innerHTML = getHtml(htmlTemplate);
      document.getElementsByTagName('img')[0].setAttribute('style', 'display:none;');
    });
  }
  