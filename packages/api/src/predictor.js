import axios from 'axios';
import * as nsfw from 'nsfwjs';
import * as tensorFlow from '@tensorflow/tfjs-node';

export async function getPredictionsFromTwitterResponse(twitterResponse = {}) {
  const tweets = twitterResponse.data;
  const mediaFiles = twitterResponse?.includes?.media;

  if (!tweets || !mediaFiles) {
    throw new Error(
      'Something went wrong with twitter response. It has different format from what is expected'
    );
  }

  const predictionPromises = [];
  mediaFiles.forEach((mediaFileItem) => {
    const url = mediaFileItem.url || mediaFileItem.preview_image_url;
    predictionPromises.push(
      getPredictions(url, mediaFileItem.media_key)
    );
  });

  const predictionResults = await Promise.all(predictionPromises);
  const predictionsMap = predictionResults.reduce((acc, value) => {
    const { key, ...other } = value;
    acc[key] = {
      ...other,
    };
    return acc;
  }, {});

  return tweets.map((tweetItem) => {
    const tweetImgWithPredictions = tweetItem.attachments.media_keys.map(
      (mediaKey) => predictionsMap[mediaKey]
    );

    return {
      tweetText: tweetItem.text,
      tweetId: tweetItem.id,
      predictions: tweetImgWithPredictions,
    };
  });
}
export async function getPredictions(url, mediaKey) {
  try {
    const pic = await axios.get(url, {
      responseType: 'arraybuffer',
    });
    const model = await nsfw.load();
    const image = await tensorFlow.node.decodeImage(pic.data, 3);
    const predictions = await model.classify(image);
    image.dispose(); // Tensor memory must be managed explicitly (it is not sufficient to let a tf.Tensor go out of scope for its memory to be released).

    const predictionsByType = predictions.reduce((acc, prediction) => {
      acc[prediction.className] = prediction.probability;
      return acc;
    }, {});

    return { key: mediaKey, imgUrl: url, ...predictionsByType };
  } catch (e) {
    console.error('ERROR occurred in the predictor. More info:');
    console.error(e);
  }
}

export function filterPredictions(tweetsWithPredictions, thresholds) {
  return tweetsWithPredictions.filter((tweetWithPredictions) => {
    const criteriaCategories = Object.keys(thresholds);

    return criteriaCategories.some((criteriaCategory) => {
      return tweetWithPredictions.predictions.some(prediction => {
        return prediction[criteriaCategory] >= thresholds[criteriaCategory];
      });
    });
  });
}
