# Sagemaker_Tumor_Classifier_DATS6450
A tumor classification project using a variety of AWS services.   
Completed as a final group project for Cloud Computing-DATS 6450 at George Washington University.

Results Website [http://medical-images-testing.s3-website-us-east-1.amazonaws.com/]

## Data Sources

Brain tumour classification images sourced from the MRI Brain Tumor Classification dataset competition from Kaggle.
[https://www.kaggle.com/sartajbhuvaji/brain-tumor-classification-mri]

## Running the Code

To generate the data for yourself, run the scripts in the following order:  
1. On Google Collab, run the following scripts from the Training_Models_on_Colab directory:
  1a. Brain_Tumor_Load_Data.ipynb
  1b. Brain_Tumor_ResNet50.ipynb
  1c. Brain_Tumor_VGG16.ipynb
  1d. Brain_Tumor_Xception.ipynb
  1e. Brain_Tumor_Combine_Three_Models.ipynb
2. Create 3 AWS S3 buckets for models, testing images and results
3. Load generated models into 1st S3 Bucket
4. Load testing images form Small_test_images directory into 2nd S3 bucket
5. In AWS Sagemaker, run Jupyter_Notebook_Code.ipynb. Fill in #YOUR_BUCKET_HERE with the names of your respective buckets
6. Place index.html, style.css, PhotoViewer.js and loading.gif the results bucket
7. Configure AWS Cognito to allow unauth access to the images in the results bucket
8. Configure the results bucket to host static websites.

## Templates

Base template for the website modified from [https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-photos-view.html]
